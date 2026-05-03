"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createBooking,
  createMatch,
  deleteMatch,
  setBookingStatus,
  updateMatch,
} from "./db";
import { allSeatIds } from "./seats";
import type { BookingStatus, PaymentMethod } from "./types";

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function num(v: FormDataEntryValue | null): number {
  const n = Number(str(v));
  return Number.isFinite(n) ? n : 0;
}

function parseSeats(value: string): string[] {
  if (!value) return [];
  const valid = new Set(allSeatIds());
  return Array.from(
    new Set(
      value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => valid.has(s)),
    ),
  );
}

export async function submitBookingAction(formData: FormData): Promise<void> {
  const matchId = str(formData.get("matchId"));
  const customerName = str(formData.get("customerName"));
  const email = str(formData.get("email"));
  const phone = str(formData.get("phone"));
  const seats = parseSeats(str(formData.get("seats")));
  const notes = str(formData.get("notes")) || undefined;
  const rawMethod = str(formData.get("paymentMethod"));
  const paymentMethod: PaymentMethod = (
    ["card", "apple", "google"].includes(rawMethod) ? rawMethod : "card"
  ) as PaymentMethod;

  if (!matchId || !customerName || !email || !phone) {
    redirect(
      `/tickets/${matchId}?error=${encodeURIComponent("Please fill in every required field.")}`,
    );
  }
  if (seats.length === 0) {
    redirect(
      `/tickets/${matchId}?error=${encodeURIComponent("Pick at least one seat from the map.")}`,
    );
  }

  const result = await createBooking({
    matchId,
    customerName,
    email,
    phone,
    seats,
    paymentMethod,
    notes,
  });

  if (!result.ok) {
    redirect(`/tickets/${matchId}?error=${encodeURIComponent(result.error)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/tickets");
  revalidatePath(`/tickets/${matchId}`);
  redirect(`/booking/${result.booking.id}`);
}

export async function setBookingStatusAction(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  const status = str(formData.get("status")) as BookingStatus;
  if (!id || !["pending", "confirmed", "cancelled"].includes(status)) return;
  await setBookingStatus(id, status);
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/tickets");
}

function parseMatchForm(formData: FormData) {
  const opponent = str(formData.get("opponent"));
  const competition = str(formData.get("competition"));
  const date = str(formData.get("date"));
  const time = str(formData.get("time"));
  const venue = str(formData.get("venue"));
  const isHome = str(formData.get("isHome")) === "home";
  const pricePerSeat = num(formData.get("pricePerSeat"));
  const notes = str(formData.get("notes")) || undefined;
  const kickoff =
    date && time ? new Date(`${date}T${time}:00`).toISOString() : "";
  return { opponent, competition, kickoff, venue, isHome, pricePerSeat, notes };
}

export async function createMatchAction(formData: FormData): Promise<void> {
  const data = parseMatchForm(formData);
  if (!data.opponent || !data.competition || !data.kickoff || !data.venue || data.pricePerSeat <= 0) {
    redirect(`/admin/matches?error=${encodeURIComponent("Missing required fields.")}`);
  }
  await createMatch(data);
  revalidatePath("/admin/matches");
  revalidatePath("/tickets");
  redirect("/admin/matches?ok=created");
}

export async function updateMatchAction(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  if (!id) return;
  const data = parseMatchForm(formData);
  await updateMatch(id, data);
  revalidatePath("/admin/matches");
  revalidatePath("/tickets");
  revalidatePath(`/tickets/${id}`);
}

export async function deleteMatchAction(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  if (!id) return;
  const result = await deleteMatch(id);
  revalidatePath("/admin/matches");
  revalidatePath("/tickets");
  if (!result.ok && result.error) {
    redirect(`/admin/matches?error=${encodeURIComponent(result.error)}`);
  }
}
