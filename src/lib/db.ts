import "server-only";
import { createAdminClient } from "./supabase/admin";
import { TOTAL_SEATS } from "./seats";
import type {
  Booking,
  BookingStatus,
  CancelledBy,
  Match,
  MatchWithAvailability,
  PaymentMethod,
} from "./types";
import { calcTotal } from "./pricing";

type MatchRow = {
  id: string;
  opponent: string;
  competition: string;
  kickoff: string;
  venue: string;
  is_home: boolean;
  price_per_seat: string | number;
  notes: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
};

type BookingRow = {
  id: string;
  match_id: string;
  user_id: string | null;
  customer_name: string;
  email: string;
  phone: string;
  seats: string[];
  adult_count: number;
  concession_count: number;
  under17_count: number;
  under5_count: number;
  payment_method: PaymentMethod;
  notes: string | null;
  status: BookingStatus;
  cancelled_at: string | null;
  cancelled_by: CancelledBy | null;
  attended_at: string | null;
  created_at: string;
};

function rowToMatch(r: MatchRow): Match {
  return {
    id: r.id,
    opponent: r.opponent,
    competition: r.competition,
    kickoff: r.kickoff,
    venue: r.venue,
    isHome: r.is_home,
    pricePerSeat: Number(r.price_per_seat),
    notes: r.notes ?? undefined,
    cancelledAt: r.cancelled_at ?? undefined,
    cancellationReason: r.cancellation_reason ?? undefined,
  };
}

function rowToBooking(r: BookingRow): Booking {
  return {
    id: r.id,
    matchId: r.match_id,
    userId: r.user_id ?? undefined,
    customerName: r.customer_name,
    email: r.email,
    phone: r.phone,
    seats: r.seats ?? [],
    adultCount: r.adult_count,
    concessionCount: r.concession_count,
    under17Count: r.under17_count,
    under5Count: r.under5_count,
    paymentMethod: r.payment_method,
    notes: r.notes ?? undefined,
    status: r.status,
    cancelledAt: r.cancelled_at ?? undefined,
    cancelledBy: r.cancelled_by ?? undefined,
    attendedAt: r.attended_at ?? undefined,
    createdAt: r.created_at,
  };
}

async function bookedSeatsForMatch(matchId: string): Promise<string[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("booking_seats")
    .select("seat_id")
    .eq("match_id", matchId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.seat_id);
}

function withAvailability(match: Match, booked: string[]): MatchWithAvailability {
  const remaining = Math.max(0, TOTAL_SEATS - booked.length);
  return {
    ...match,
    bookedSeats: booked,
    ticketsSold: booked.length,
    capacity: TOTAL_SEATS,
    remaining,
    isSoldOut: remaining === 0,
  };
}

export async function listMatches(opts?: {
  upcomingOnly?: boolean;
}): Promise<MatchWithAvailability[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("matches")
    .select("*")
    .order("kickoff", { ascending: true });
  if (opts?.upcomingOnly) {
    query = query.gte("kickoff", new Date().toISOString());
  }
  // Parallel — both queries can fire at once.
  const [matchRes, seatRes] = await Promise.all([
    query,
    supabase.from("booking_seats").select("match_id, seat_id"),
  ]);
  if (matchRes.error) throw new Error(matchRes.error.message);
  if (seatRes.error) throw new Error(seatRes.error.message);
  const matchRows = matchRes.data;
  const seatRows = seatRes.data;

  const bookedByMatch = new Map<string, string[]>();
  for (const row of seatRows ?? []) {
    const list = bookedByMatch.get(row.match_id) ?? [];
    list.push(row.seat_id);
    bookedByMatch.set(row.match_id, list);
  }

  return (matchRows ?? []).map((r) =>
    withAvailability(rowToMatch(r as MatchRow), bookedByMatch.get(r.id) ?? []),
  );
}

export async function getMatch(id: string): Promise<MatchWithAvailability | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const booked = await bookedSeatsForMatch(id);
  return withAvailability(rowToMatch(data as MatchRow), booked);
}

export async function listBookings(opts?: { userId?: string }): Promise<Booking[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (opts?.userId) {
    query = query.eq("user_id", opts.userId);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToBooking(r as BookingRow));
}

export async function getBooking(id: string): Promise<Booking | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToBooking(data as BookingRow) : null;
}

export type CreateBookingInput = {
  matchId: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  seats: string[];
  adultCount: number;
  concessionCount: number;
  under17Count: number;
  under5Count: number;
  paymentMethod: PaymentMethod;
  notes?: string;
};

export type CreateBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; error: string };

export async function createBooking(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("create_booking", {
    p_match_id: input.matchId,
    p_user_id: input.userId ?? null,
    p_customer_name: input.customerName,
    p_email: input.email,
    p_phone: input.phone,
    p_seats: input.seats,
    p_adult: input.adultCount,
    p_concession: input.concessionCount,
    p_under17: input.under17Count,
    p_under5: input.under5Count,
    p_payment_method: input.paymentMethod,
    p_notes: input.notes ?? null,
  });
  if (error) {
    return { ok: false, error: humaniseDbError(error.message) };
  }
  // RPC returning a row: Supabase returns the row directly.
  return { ok: true, booking: rowToBooking(data as BookingRow) };
}

function humaniseDbError(msg: string): string {
  if (msg.includes("seats_taken")) {
    return "Sorry — one or more of those seats just got taken.";
  }
  if (msg.includes("count_mismatch")) {
    return "Ticket counts must add up to the number of seats picked.";
  }
  if (msg.includes("no_seats")) {
    return "Pick at least one seat.";
  }
  if (msg.includes("match_cancelled")) {
    return "This match has been cancelled.";
  }
  if (msg.includes("match_not_found")) {
    return "Match not found.";
  }
  if (msg.includes("booking_not_cancellable")) {
    return "This booking cannot be cancelled.";
  }
  if (msg.includes("booking_not_attendable")) {
    return "This booking cannot be marked attended.";
  }
  if (msg.includes("match_not_found_or_already_cancelled")) {
    return "Match not found or already cancelled.";
  }
  return msg;
}

export async function cancelBooking(
  id: string,
  cancelledBy: CancelledBy,
): Promise<{ ok: true; booking: Booking } | { ok: false; error: string }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("cancel_booking", {
    p_booking_id: id,
    p_cancelled_by: cancelledBy,
  });
  if (error) return { ok: false, error: humaniseDbError(error.message) };
  return { ok: true, booking: rowToBooking(data as BookingRow) };
}

export async function markBookingAttended(
  id: string,
): Promise<{ ok: true; booking: Booking } | { ok: false; error: string }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("mark_booking_attended", {
    p_booking_id: id,
  });
  if (error) return { ok: false, error: humaniseDbError(error.message) };
  return { ok: true, booking: rowToBooking(data as BookingRow) };
}

export async function createMatch(input: Omit<Match, "id">): Promise<Match> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("matches")
    .insert({
      opponent: input.opponent,
      competition: input.competition,
      kickoff: input.kickoff,
      venue: input.venue,
      is_home: input.isHome,
      price_per_seat: input.pricePerSeat,
      notes: input.notes ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToMatch(data as MatchRow);
}

export async function updateMatch(
  id: string,
  patch: Partial<Omit<Match, "id">>,
): Promise<Match | null> {
  const supabase = createAdminClient();
  const updates: Record<string, unknown> = {};
  if (patch.opponent !== undefined) updates.opponent = patch.opponent;
  if (patch.competition !== undefined) updates.competition = patch.competition;
  if (patch.kickoff !== undefined) updates.kickoff = patch.kickoff;
  if (patch.venue !== undefined) updates.venue = patch.venue;
  if (patch.isHome !== undefined) updates.is_home = patch.isHome;
  if (patch.pricePerSeat !== undefined) updates.price_per_seat = patch.pricePerSeat;
  if (patch.notes !== undefined) updates.notes = patch.notes ?? null;
  const { data, error } = await supabase
    .from("matches")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToMatch(data as MatchRow) : null;
}

export async function cancelMatch(
  id: string,
  reason: string,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.rpc("cancel_match", {
    p_match_id: id,
    p_reason: reason,
  });
  if (error) return { ok: false, error: humaniseDbError(error.message) };
  return { ok: true };
}

export async function getStats(): Promise<{
  totalBookings: number;
  activeBookings: number;
  ticketsSold: number;
  upcomingMatches: number;
  soldOutMatches: number;
  revenue: number;
}> {
  const supabase = createAdminClient();
  const [{ data: bookingRows }, { data: matchRows }, { data: seatRows }] =
    await Promise.all([
      supabase.from("bookings").select("*"),
      supabase.from("matches").select("*"),
      supabase.from("booking_seats").select("match_id, seat_id"),
    ]);

  const bookings = (bookingRows ?? []).map((r) => rowToBooking(r as BookingRow));
  const matches = (matchRows ?? []).map((r) => rowToMatch(r as MatchRow));
  const matchById = new Map(matches.map((m) => [m.id, m]));

  const bookedByMatch = new Map<string, string[]>();
  for (const r of seatRows ?? []) {
    const list = bookedByMatch.get(r.match_id) ?? [];
    list.push(r.seat_id);
    bookedByMatch.set(r.match_id, list);
  }

  const now = new Date().toISOString();
  const upcoming = matches.filter((m) => m.kickoff >= now && !m.cancelledAt);
  const upcomingWithAvail = upcoming.map((m) =>
    withAvailability(m, bookedByMatch.get(m.id) ?? []),
  );

  const active = bookings.filter((b) => b.status !== "cancelled");
  const ticketsSold = active.reduce((sum, b) => sum + b.seats.length, 0);
  const revenue = active.reduce((sum, b) => {
    const match = matchById.get(b.matchId);
    if (!match) return sum;
    return (
      sum +
      calcTotal({
        basePerSeat: match.pricePerSeat,
        counts: {
          adultCount: b.adultCount,
          concessionCount: b.concessionCount,
          under17Count: b.under17Count,
          under5Count: b.under5Count,
        },
        seats: b.seats,
      })
    );
  }, 0);

  return {
    totalBookings: bookings.length,
    activeBookings: active.length,
    ticketsSold,
    upcomingMatches: upcoming.length,
    soldOutMatches: upcomingWithAvail.filter((m) => m.isSoldOut).length,
    revenue,
  };
}

export function bookingTotal(booking: Booking, match: Match): number {
  return calcTotal({
    basePerSeat: match.pricePerSeat,
    counts: {
      adultCount: booking.adultCount,
      concessionCount: booking.concessionCount,
      under17Count: booking.under17Count,
      under5Count: booking.under5Count,
    },
    seats: booking.seats,
  });
}
