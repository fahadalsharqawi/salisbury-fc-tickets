"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  cancelBooking,
  cancelMatch,
  createBooking,
  createMatch,
  markBookingAttended,
  updateMatch,
} from "./db";
import { allSeatIds } from "./seats";
import { createClient } from "./supabase/server";
import type { CancelledBy, PaymentMethod } from "./types";

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
  const adultCount = Math.max(0, num(formData.get("adultCount")));
  const concessionCount = Math.max(0, num(formData.get("concessionCount")));
  const under17Count = Math.max(0, num(formData.get("under17Count")));
  const under5Count = Math.max(0, num(formData.get("under5Count")));
  const rawMethod = str(formData.get("paymentMethod"));
  const paymentMethod: PaymentMethod = (
    ["card", "apple", "google"].includes(rawMethod) ? rawMethod : "card"
  ) as PaymentMethod;

  function fail(msg: string): never {
    redirect(`/tickets/${matchId}?error=${encodeURIComponent(msg)}`);
  }

  if (!matchId || !customerName || !email || !phone) {
    fail("Please fill in every required field.");
  }
  if (seats.length === 0) {
    fail("Pick at least one seat from the map.");
  }
  const totalCount = adultCount + concessionCount + under17Count + under5Count;
  if (totalCount !== seats.length) {
    fail(`Ticket counts must add up to ${seats.length} (you've got ${totalCount}).`);
  }

  // Attach to logged-in user, if any.
  let userId: string | undefined;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
  } catch {
    // Anonymous booking is fine.
  }

  const result = await createBooking({
    matchId,
    userId,
    customerName,
    email,
    phone,
    seats,
    adultCount,
    concessionCount,
    under17Count,
    under5Count,
    paymentMethod,
    notes,
  });

  if (!result.ok) {
    fail(result.error);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/tickets");
  revalidatePath(`/tickets/${matchId}`);
  redirect(`/booking/${result.booking.id}`);
}

export async function cancelBookingAction(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  const byRaw = str(formData.get("by")) as CancelledBy;
  const by: CancelledBy = ["customer", "owner", "match"].includes(byRaw)
    ? byRaw
    : "customer";
  const redirectTo = str(formData.get("redirectTo")) || `/booking/${id}`;
  if (!id) return;
  const result = await cancelBooking(id, by);
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath(`/booking/${id}`);
  revalidatePath("/tickets");
  if (!result.ok) {
    redirect(`${redirectTo}?error=${encodeURIComponent(result.error)}`);
  }
  redirect(redirectTo);
}

export async function markAttendedAction(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  if (!id) return;
  const result = await markBookingAttended(id);
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  if (!result.ok) {
    redirect(
      `/admin/bookings/${id}?error=${encodeURIComponent(result.error)}`,
    );
  }
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
  if (
    !data.opponent ||
    !data.competition ||
    !data.kickoff ||
    !data.venue ||
    data.pricePerSeat <= 0
  ) {
    redirect(
      `/admin/matches?error=${encodeURIComponent("Missing required fields.")}`,
    );
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

export async function cancelMatchAction(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  const reason = str(formData.get("reason")) || "Cancelled by club.";
  if (!id) return;
  const result = await cancelMatch(id, reason);
  revalidatePath("/admin/matches");
  revalidatePath("/admin/bookings");
  revalidatePath("/tickets");
  if (!result.ok && result.error) {
    redirect(`/admin/matches?error=${encodeURIComponent(result.error)}`);
  }
  redirect("/admin/matches?ok=cancelled");
}
