"use server";

import { cookies } from "next/headers";
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
import { createAdminClient } from "./supabase/admin";
import { createClient } from "./supabase/server";
import type { CancelledBy, PaymentMethod } from "./types";
import type { Currency } from "./format";
import type { Locale } from "./i18n";

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

  revalidatePath("/");
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
  revalidatePath("/");
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
  revalidatePath("/");
  revalidatePath("/admin/matches");
  revalidatePath("/tickets");
  redirect("/admin/matches?ok=created");
}

export async function updateMatchAction(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  if (!id) return;
  const data = parseMatchForm(formData);
  await updateMatch(id, data);
  revalidatePath("/");
  revalidatePath("/admin/matches");
  revalidatePath("/tickets");
  revalidatePath(`/tickets/${id}`);
}

export async function cancelMatchAction(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  const reason = str(formData.get("reason")) || "Cancelled by club.";
  if (!id) return;
  const result = await cancelMatch(id, reason);
  revalidatePath("/");
  revalidatePath("/admin/matches");
  revalidatePath("/admin/bookings");
  revalidatePath("/tickets");
  if (!result.ok && result.error) {
    redirect(`/admin/matches?error=${encodeURIComponent(result.error)}`);
  }
  redirect("/admin/matches?ok=cancelled");
}

// Existing locale / currency / contact actions preserved from main.
export async function setCurrencyAction(formData: FormData): Promise<void> {
  const raw = str(formData.get("currency"));
  const currency: Currency = raw === "KWD" ? "KWD" : "GBP";
  const cookieStore = await cookies();
  cookieStore.set("currency", currency, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}

export async function setLocaleAction(formData: FormData): Promise<void> {
  const raw = str(formData.get("locale"));
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const cookieStore = await cookies();
  cookieStore.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}

export async function submitContactAction(formData: FormData): Promise<void> {
  const name = str(formData.get("contactName"));
  if (!name) redirect(`/contact?error=${encodeURIComponent("Please add your name.")}`);
  redirect(`/contact?sent=${encodeURIComponent(name)}`);
}

// ── Demo data: clear all bookings and reseed every match to ~50% ──────────
//
// Used by the /admin "Reseed demo bookings" button. Runs entirely in the
// Vercel function via the Supabase service-role client, so the demo can
// be reset without opening the Supabase dashboard.
const DEMO_NAMES = [
  "Oliver Smith", "Sarah Jones", "Tom Wilson", "Emma Brown", "James Taylor",
  "Lucy Davies", "Harry Roberts", "Charlotte White", "Jack Thompson",
  "Lily Walker", "Charlie Hughes", "Grace Edwards", "George Green", "Mia Hall",
  "Henry Lewis", "Isla Wood", "Alfie Harris", "Amelia Clark", "Noah Robinson",
  "Ella Wright", "Ethan Carter", "Evelyn Phillips", "Oscar Bennett",
  "Poppy Mitchell", "Leo Cooper", "Florence Kelly", "Freddie Hayes",
  "Ivy Powell", "Theo Reed", "Daisy Ward", "Arthur King", "Rosie Scott",
  "Joseph Bell", "Phoebe Murphy", "Logan Cox", "Hazel Howard", "William Ross",
  "Maisie Mason", "Edward Ellis", "Sienna Wells",
];

const DEMO_PAYMENT_POOL: PaymentMethod[] = [
  "card", "card", "card", "card", "apple", "google",
];

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export async function reseedDemoBookingsAction(): Promise<void> {
  const supabase = createAdminClient();

  // Clear existing demo bookings (and the booking_seats rows they own).
  await supabase.from("booking_seats").delete().not("seat_id", "is", null);
  await supabase.from("bookings").delete().not("id", "is", null);

  // List active matches.
  const { data: matches, error: matchErr } = await supabase
    .from("matches")
    .select("id")
    .is("cancelled_at", null);
  if (matchErr) {
    redirect(`/admin?error=${encodeURIComponent(matchErr.message)}`);
  }

  const allSeats = allSeatIds();
  const targetFraction = 0.5;

  for (const m of matches ?? []) {
    const matchId = m.id as string;
    const shuffled = shuffle(allSeats);
    const target = Math.floor(allSeats.length * targetFraction);

    let i = 0;
    while (i < target) {
      // 70% singleton, 25% pair, 5% triplet — keeps the pattern speckled.
      const r = Math.random();
      let groupSize = r < 0.7 ? 1 : r < 0.95 ? 2 : 3;
      groupSize = Math.min(groupSize, target - i);
      const seats = shuffled.slice(i, i + groupSize);
      i += groupSize;

      const name = DEMO_NAMES[Math.floor(Math.random() * DEMO_NAMES.length)];
      const method = DEMO_PAYMENT_POOL[Math.floor(Math.random() * DEMO_PAYMENT_POOL.length)];
      let adult = groupSize;
      let conc = 0;
      let u17 = 0;
      const u5 = 0;
      if (groupSize >= 2 && Math.random() < 0.4) { conc = 1; adult -= 1; }
      if (groupSize >= 3 && Math.random() < 0.3) { u17 = 1; adult -= 1; }

      const { data: booking, error: insErr } = await supabase
        .from("bookings")
        .insert({
          match_id: matchId,
          customer_name: name,
          email: name.toLowerCase().replace(/[^a-z]+/g, ".") + "@example.com",
          phone: "07" + String(Math.floor(Math.random() * 1e9)).padStart(9, "0"),
          seats,
          adult_count: adult,
          concession_count: conc,
          under17_count: u17,
          under5_count: u5,
          payment_method: method,
          status: "confirmed",
        })
        .select("id")
        .single();
      if (insErr || !booking) continue;

      const rows = seats.map((seat_id) => ({
        match_id: matchId,
        seat_id,
        booking_id: booking.id,
      }));
      await supabase.from("booking_seats").insert(rows);
    }
  }

  revalidatePath("/", "layout");
  redirect("/admin?reseeded=1");
}
