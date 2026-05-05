import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Booking, DB, Match, MatchWithAvailability } from "./types";
import { TOTAL_SEATS, allSeatIds, getStand, parseSeatId, seatId, seatPrice } from "./seats";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

let writeQueue: Promise<unknown> = Promise.resolve();

const HOME_GROUND = "Raymond McEnhill Stadium, Old Sarum";

function nextWeekday(target: number, weeksAhead: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const delta = (target - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + delta + weeksAhead * 7);
  return d;
}

function withTime(d: Date, hours: number, minutes: number): string {
  const out = new Date(d);
  out.setHours(hours, minutes, 0, 0);
  return out.toISOString();
}

function buildSeed(): DB {
  const fixtures: Omit<Match, "id">[] = [
    {
      opponent: "Truro City",
      competition: "National League South",
      kickoff: withTime(nextWeekday(6, 0), 15, 0),
      venue: HOME_GROUND,
      isHome: true,
      pricePerSeat: 17,
      notes: "Adult £17 · Concessions £13 · Age 5–17 £6 · Under 5 free.",
    },
    {
      opponent: "Hemel Hempstead Town",
      competition: "National League South",
      kickoff: withTime(nextWeekday(2, 0), 19, 45),
      venue: "Vauxhall Road, Hemel Hempstead",
      isHome: false,
      pricePerSeat: 14,
      notes: "Away allocation — collect at the away turnstile.",
    },
    {
      opponent: "Eastbourne Borough",
      competition: "National League South",
      kickoff: withTime(nextWeekday(6, 1), 15, 0),
      venue: HOME_GROUND,
      isHome: true,
      pricePerSeat: 17,
    },
    {
      opponent: "Worthing",
      competition: "FA Trophy — Third Round",
      kickoff: withTime(nextWeekday(2, 1), 19, 45),
      venue: HOME_GROUND,
      isHome: true,
      pricePerSeat: 19,
      notes: "Cup pricing applies. No season-ticket entry.",
    },
    {
      opponent: "Farnborough",
      competition: "National League South",
      kickoff: withTime(nextWeekday(6, 2), 15, 0),
      venue: "Cherrywood Road, Farnborough",
      isHome: false,
      pricePerSeat: 14,
    },
    {
      opponent: "Slough Town",
      competition: "National League South",
      kickoff: withTime(nextWeekday(6, 3), 15, 0),
      venue: HOME_GROUND,
      isHome: true,
      pricePerSeat: 17,
      notes: "Family Day — under-5s free with a paying adult.",
    },
  ];

  const matches: Match[] = fixtures.map((f) => ({ id: randomUUID(), ...f }));
  const bookings: Booking[] = [];
  for (const match of matches) {
    bookings.push(...generateRandomBookings(match.id, 0.75));
  }

  return { matches, bookings };
}

const DUMMY_NAMES = [
  "Oliver Smith", "Sarah Jones", "Tom Wilson", "Emma Brown", "James Taylor",
  "Lucy Davies", "Harry Roberts", "Charlotte White", "Jack Thompson", "Lily Walker",
  "Charlie Hughes", "Grace Edwards", "George Green", "Mia Hall", "Henry Lewis",
  "Isla Wood", "Alfie Harris", "Amelia Clark", "Noah Robinson", "Ella Wright",
  "Ethan Carter", "Evelyn Phillips", "Oscar Bennett", "Poppy Mitchell", "Leo Cooper",
  "Florence Kelly", "Freddie Hayes", "Ivy Powell", "Theo Reed", "Daisy Ward",
  "Arthur King", "Rosie Scott", "Joseph Bell", "Phoebe Murphy", "Logan Cox",
  "Hazel Howard", "William Ross", "Maisie Mason", "Edward Ellis", "Sienna Wells",
];

function pickRandom<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function pastISO(): string {
  const days = Math.floor(Math.random() * 28);
  const hours = Math.floor(Math.random() * 24);
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hours, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

function makeEmail(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`;
}

function makePhone(): string {
  let n = "07";
  for (let i = 0; i < 9; i++) n += Math.floor(Math.random() * 10);
  return n;
}

function generateRandomBookings(matchId: string, fillRatio: number): Booking[] {
  const target = Math.floor(TOTAL_SEATS * fillRatio);
  const allIds = allSeatIds();
  const taken = new Set<string>();
  const bookings: Booking[] = [];

  let safety = 0;
  while (taken.size < target && safety < target * 4) {
    safety++;
    const seedIdx = Math.floor(Math.random() * allIds.length);
    const seed = allIds[seedIdx];
    if (taken.has(seed)) continue;
    const parsed = parseSeatId(seed);
    if (!parsed) continue;
    const stand = getStand(parsed.stand);

    const remaining = target - taken.size;
    const desired = Math.min(remaining, 1 + Math.floor(Math.random() * 5));

    const seats: string[] = [];
    for (let i = 0; i < desired; i++) {
      const col = parsed.col + i;
      if (col > stand.cols) break;
      const id = seatId(parsed.stand, parsed.row, col);
      if (taken.has(id)) break;
      seats.push(id);
    }
    if (seats.length === 0) continue;

    for (const id of seats) taken.add(id);

    const name = pickRandom(DUMMY_NAMES);
    const methods: Booking["paymentMethod"][] = ["card", "card", "card", "apple", "google"];
    bookings.push({
      id: randomUUID(),
      matchId,
      customerName: name,
      email: makeEmail(name),
      phone: makePhone(),
      seats,
      paymentMethod: pickRandom(methods),
      status: "confirmed",
      createdAt: pastISO(),
    });
  }

  return bookings;
}


async function ensureFile(): Promise<void> {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const seed = buildSeed();
    await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2), "utf8");
  }
}

async function readDB(): Promise<DB> {
  await ensureFile();
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw) as DB;
}

async function writeDB(db: DB): Promise<void> {
  const tmp = `${DB_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_PATH);
}

async function mutate<T>(fn: (db: DB) => Promise<T> | T): Promise<T> {
  const next = writeQueue.then(async () => {
    const db = await readDB();
    const result = await fn(db);
    await writeDB(db);
    return result;
  });
  writeQueue = next.catch(() => {});
  return next;
}

function bookedSeatsFor(matchId: string, bookings: Booking[]): string[] {
  return bookings
    .filter((b) => b.matchId === matchId && b.status !== "cancelled")
    .flatMap((b) => b.seats);
}

function withAvailability(match: Match, bookings: Booking[]): MatchWithAvailability {
  const booked = bookedSeatsFor(match.id, bookings);
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

export async function listMatches(opts?: { upcomingOnly?: boolean }): Promise<MatchWithAvailability[]> {
  const db = await readDB();
  const now = new Date().toISOString();
  return db.matches
    .filter((m) => (opts?.upcomingOnly ? m.kickoff >= now : true))
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
    .map((m) => withAvailability(m, db.bookings));
}

export async function getMatch(id: string): Promise<MatchWithAvailability | null> {
  const db = await readDB();
  const match = db.matches.find((m) => m.id === id);
  if (!match) return null;
  return withAvailability(match, db.bookings);
}

export async function listBookings(): Promise<Booking[]> {
  const db = await readDB();
  return [...db.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getBooking(id: string): Promise<Booking | null> {
  const db = await readDB();
  return db.bookings.find((b) => b.id === id) ?? null;
}

export type CreateBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; error: string };

export async function createBooking(
  input: Omit<Booking, "id" | "status" | "createdAt">,
): Promise<CreateBookingResult> {
  return mutate((db) => {
    const match = db.matches.find((m) => m.id === input.matchId);
    if (!match) return { ok: false, error: "Match not found." } as const;
    if (input.seats.length === 0) {
      return { ok: false, error: "Pick at least one seat." } as const;
    }
    if (new Set(input.seats).size !== input.seats.length) {
      return { ok: false, error: "Duplicate seats in selection." } as const;
    }
    const taken = new Set(bookedSeatsFor(match.id, db.bookings));
    const conflicts = input.seats.filter((s) => taken.has(s));
    if (conflicts.length > 0) {
      return {
        ok: false,
        error: `Sorry — these seats just got taken: ${conflicts.join(", ")}.`,
      } as const;
    }
    const booking: Booking = {
      id: randomUUID(),
      matchId: input.matchId,
      customerName: input.customerName,
      email: input.email,
      phone: input.phone,
      seats: input.seats,
      paymentMethod: input.paymentMethod,
      notes: input.notes,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    db.bookings.push(booking);
    return { ok: true, booking } as const;
  });
}

export async function setBookingStatus(id: string, status: Booking["status"]): Promise<Booking | null> {
  return mutate((db) => {
    const booking = db.bookings.find((b) => b.id === id);
    if (!booking) return null;
    booking.status = status;
    return booking;
  });
}

export async function createMatch(input: Omit<Match, "id">): Promise<Match> {
  return mutate((db) => {
    const match: Match = { id: randomUUID(), ...input };
    db.matches.push(match);
    return match;
  });
}

export async function updateMatch(id: string, patch: Partial<Omit<Match, "id">>): Promise<Match | null> {
  return mutate((db) => {
    const match = db.matches.find((m) => m.id === id);
    if (!match) return null;
    Object.assign(match, patch);
    return match;
  });
}

export async function deleteMatch(id: string): Promise<{ ok: boolean; error?: string }> {
  return mutate((db) => {
    const hasBookings = db.bookings.some(
      (b) => b.matchId === id && b.status !== "cancelled",
    );
    if (hasBookings) return { ok: false, error: "Cannot delete a fixture with active bookings." };
    const idx = db.matches.findIndex((m) => m.id === id);
    if (idx === -1) return { ok: false, error: "Match not found." };
    db.matches.splice(idx, 1);
    return { ok: true };
  });
}

export async function getStats() {
  const db = await readDB();
  const now = new Date().toISOString();
  const upcoming = db.matches
    .filter((m) => m.kickoff >= now)
    .map((m) => withAvailability(m, db.bookings));
  const active = db.bookings.filter((b) => b.status !== "cancelled");
  const ticketsSold = active.reduce((sum, b) => sum + b.seats.length, 0);
  const revenue = active.reduce((sum, b) => {
    const match = db.matches.find((m) => m.id === b.matchId);
    if (!match) return sum;
    return sum + b.seats.reduce((s, id) => s + seatPrice(id, match.pricePerSeat), 0);
  }, 0);
  return {
    totalBookings: db.bookings.length,
    activeBookings: active.length,
    pendingBookings: db.bookings.filter((b) => b.status === "pending").length,
    ticketsSold,
    upcomingMatches: upcoming.length,
    soldOutMatches: upcoming.filter((m) => m.isSoldOut).length,
    revenue,
  };
}

export function bookingTotal(booking: Booking, match: Match): number {
  return booking.seats.reduce((sum, id) => sum + seatPrice(id, match.pricePerSeat), 0);
}
