import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelBookingAction } from "@/lib/actions";
import { bookingTotal, getBooking, getMatch } from "@/lib/db";
import { formatLongKickoff, formatMoney } from "@/lib/format";
import { tierLabel, tierPrices } from "@/lib/pricing";

export const dynamic = "force-dynamic";

type Params = { id: string };
type SearchParams = { error?: string; cancelled?: string };

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const booking = await getBooking(id);
  if (!booking) notFound();
  const match = await getMatch(booking.matchId);
  const total = match ? bookingTotal(booking, match) : 0;
  const tiers = match ? tierPrices(match.pricePerSeat) : null;

  const isCancelled = booking.status === "cancelled";
  const cancelledByMatch = booking.cancelledBy === "match";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div
        className={`anim-scale-in rounded-2xl border ${
          isCancelled ? "border-stone-200" : "border-emerald-200"
        } bg-white shadow-sm`}
      >
        <div
          className={`rounded-t-2xl px-8 py-12 text-center ${
            isCancelled ? "bg-stone-100" : "bg-emerald-50"
          }`}
        >
          {isCancelled ? (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-300">
                <svg viewBox="0 0 24 24" className="h-10 w-10 text-stone-600" fill="none">
                  <path
                    d="M6 6L18 18M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight">Booking cancelled</h1>
              <p className="mt-2 text-stone-600">
                {cancelledByMatch
                  ? "This match has been cancelled by the club. A refund has been issued."
                  : booking.cancelledBy === "owner"
                    ? "This booking was cancelled by the club. A refund has been issued."
                    : "You cancelled this booking. As stated, customer-initiated cancellations are non-refundable."}
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        <div
          className="anim-fade-up grid gap-0 px-8 py-6 sm:grid-cols-2 sm:gap-8"
          style={{ ["--anim-delay" as string]: "1100ms" }}
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
          style={{ ["--anim-delay" as string]: "1250ms" }}
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
          style={{ ["--anim-delay" as string]: "1400ms" }}
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

          {tiers && (
            <ul className="mt-4 space-y-1 text-sm">
              <TierLine
                label={tierLabel("adult")}
                count={booking.adultCount}
                price={tiers.adult}
              />
              <TierLine
                label={tierLabel("concession")}
                count={booking.concessionCount}
                price={tiers.concession}
              />
              <TierLine
                label={tierLabel("under17")}
                count={booking.under17Count}
                price={tiers.under17}
              />
              <TierLine
                label={tierLabel("under5")}
                count={booking.under5Count}
                price={tiers.under5}
              />
            </ul>
          )}

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-stone-600">
              {booking.seats.length} ticket{booking.seats.length === 1 ? "" : "s"}
            </span>
            {match && (
              <span className="text-lg font-semibold">{formatMoney(total)}</span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-stone-600">Paid with</span>
            <span className="font-medium text-stone-900">
              {paymentLabel(booking.paymentMethod)}
            </span>
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
        style={{ ["--anim-delay" as string]: "1550ms" }}
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

      {!isCancelled && (
        <form
          action={cancelBookingAction}
          className="anim-fade-up mt-6 flex flex-col items-center"
          style={{ ["--anim-delay" as string]: "1700ms" }}
        >
          <input type="hidden" name="id" value={booking.id} />
          <input type="hidden" name="by" value="customer" />
          <input type="hidden" name="redirectTo" value={`/booking/${booking.id}`} />
          <button
            type="submit"
            className="text-xs font-medium text-stone-500 underline-offset-2 hover:text-red-600 hover:underline"
          >
            Cancel this booking (non-refundable)
          </button>
        </form>
      )}
    </div>
  );
}

function TierLine({
  label,
  count,
  price,
}: {
  label: string;
  count: number;
  price: number;
}) {
  if (count === 0) return null;
  return (
    <li className="flex items-baseline justify-between text-stone-700">
      <span>
        {label} × {count}
      </span>
      <span className="text-stone-500">£{price * count}</span>
    </li>
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
