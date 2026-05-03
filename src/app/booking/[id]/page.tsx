import Link from "next/link";
import { notFound } from "next/navigation";
import { bookingTotal, getBooking, getMatch } from "@/lib/db";
import { formatLongKickoff, formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function ConfirmationPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) notFound();
  const match = await getMatch(booking.matchId);
  const total = match ? bookingTotal(booking, match) : 0;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="anim-scale-in rounded-2xl border border-emerald-200 bg-white shadow-sm">
        <div className="rounded-t-2xl bg-emerald-50 px-8 py-12 text-center">
          <div className="pay-success">
            <span className="pay-success__ring" aria-hidden />
            <span className="pay-success__ring pay-success__ring--two" aria-hidden />
            <svg viewBox="0 0 80 80" className="relative h-full w-full" aria-hidden>
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="#10b981"
                className="pay-success__circle"
              />
              <path
                d="M25 41 L36 52 L57 30"
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pay-success__check"
              />
            </svg>
          </div>
          <h1 className="pay-success-text mt-6 text-3xl font-semibold tracking-tight">
            Payment complete
          </h1>
          <p className="pay-success-text mt-2 text-stone-600">
            Confirmation sent to <span className="font-medium">{booking.email}</span>.
          </p>
        </div>

        <div
          className="anim-fade-up grid gap-0 px-8 py-6 sm:grid-cols-2 sm:gap-8"
          style={{ ['--anim-delay' as string]: '1100ms' }}
        >
          <div>
            <Label>Reference</Label>
            <div className="mt-1 font-mono text-sm">
              #{booking.id.slice(0, 8).toUpperCase()}
            </div>
          </div>
          <div className="mt-6 sm:mt-0">
            <Label>Booked under</Label>
            <div className="mt-1 font-medium">{booking.customerName}</div>
            <div className="text-sm text-stone-500">{booking.phone}</div>
          </div>
        </div>

        <hr className="border-stone-200" />

        <div
          className="anim-fade-up px-8 py-6"
          style={{ ['--anim-delay' as string]: '1250ms' }}
        >
          <Label>Match</Label>
          {match ? (
            <>
              <div className="mt-1 text-lg font-semibold">
                Salisbury FC <span className="text-stone-400">vs</span> {match.opponent}
              </div>
              <div className="text-stone-600">{match.competition}</div>
              <div className="mt-1 text-stone-600">{formatLongKickoff(match.kickoff)}</div>
              <div className="text-stone-600">{match.venue}</div>
            </>
          ) : (
            <div className="text-stone-500">Match details unavailable.</div>
          )}
        </div>

        <hr className="border-stone-200" />

        <div
          className="anim-fade-up px-8 py-6"
          style={{ ['--anim-delay' as string]: '1400ms' }}
        >
          <Label>Seats</Label>
          <div className="stagger mt-2 flex flex-wrap gap-2">
            {booking.seats.map((s) => (
              <span
                key={s}
                className="anim-scale-in rounded-md bg-stone-900 px-3 py-1 text-sm font-medium text-white"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-stone-600">{booking.seats.length} ticket{booking.seats.length === 1 ? "" : "s"}</span>
            {match && (
              <span className="text-lg font-semibold">{formatMoney(total)}</span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-stone-600">Paid with</span>
            <span className="font-medium text-stone-900">{paymentLabel(booking.paymentMethod)}</span>
          </div>
          {booking.notes && (
            <div className="mt-4 rounded-lg bg-stone-50 p-3 text-sm text-stone-700">
              <Label>Notes</Label>
              <div className="mt-1">{booking.notes}</div>
            </div>
          )}
        </div>
      </div>

      <div
        className="anim-fade-up mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        style={{ ['--anim-delay' as string]: '1550ms' }}
      >
        <Link
          href="/tickets"
          className="press inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 font-semibold text-white transition hover:bg-stone-800 hover:shadow-md"
        >
          Book another fixture
        </Link>
        <Link
          href="/"
          className="press inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-100 hover:shadow-sm"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
      {children}
    </div>
  );
}

function paymentLabel(m: "card" | "apple" | "google"): string {
  return m === "apple" ? "Apple Pay" : m === "google" ? "Google Pay" : "Card";
}
