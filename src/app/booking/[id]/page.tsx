import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { PendingAutoRefresh } from "./PendingAutoRefresh";
import { cancelBookingAction } from "@/lib/actions";
import { getCurrency } from "@/lib/currency-server";
import { bookingTotal, getBooking, getMatch } from "@/lib/db";
import { formatLongKickoff, formatMoney } from "@/lib/format";
import { localize, t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { tierLabel, tierPrices } from "@/lib/pricing";

export const dynamic = "force-dynamic";

type Params = { id: string };
type SearchParams = { error?: string };

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const currency = await getCurrency();
  const locale = await getLocale();
  const booking = await getBooking(id);
  if (!booking) notFound();
  const match = await getMatch(booking.matchId);
  const total = match ? bookingTotal(booking, match) : 0;
  const tiers = match ? tierPrices(match.pricePerSeat) : null;
  const isCancelled = booking.status === "cancelled";
  const isPending = booking.status === "pending";

  const qrPayload = JSON.stringify({
    ref: booking.id,
    seats: booking.seats,
    match: match ? `${match.opponent}|${match.kickoff}` : null,
  });
  const qrSvg = await QRCode.toString(qrPayload, {
    type: "svg",
    margin: 0,
    color: { dark: "#0c0a09", light: "#00000000" },
    errorCorrectionLevel: "M",
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {isPending && <PendingAutoRefresh />}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="anim-scale-in overflow-hidden rounded-2xl border border-sfc-n-200 bg-white shadow-sm">
        <div className="border-b border-sfc-n-200 bg-sfc-bone px-8 py-12 text-center">
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
              <h1 className="mt-6 text-3xl font-semibold tracking-tight">
                Booking cancelled
              </h1>
              <p className="mt-2 text-stone-600">
                {booking.cancelledBy === "match"
                  ? "This match has been cancelled by the club. A refund has been issued."
                  : booking.cancelledBy === "owner"
                    ? "This booking was cancelled by the club. A refund has been issued."
                    : "You cancelled this booking. As stated, customer-initiated cancellations are non-refundable."}
              </p>
            </>
          ) : isPending ? (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-200">
                <svg
                  viewBox="0 0 24 24"
                  className="h-9 w-9 animate-spin text-stone-500"
                  fill="none"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight">
                {t("confirm.pending.title", locale)}
              </h1>
              <p className="mt-2 text-stone-600">
                {t("confirm.pending.subtitle", locale)}
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
                    fill="#4F8534"
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
                {t("confirm.title", locale)}
              </h1>
              <p className="pay-success-text mt-2 text-stone-600">
                {t("confirm.subtitle", locale, { email: booking.email })}
              </p>
            </>
          )}
        </div>

        <div
          className="anim-fade-up grid gap-0 px-8 py-6 sm:grid-cols-2 sm:gap-8"
          style={{ ['--anim-delay' as string]: '1100ms' }}
        >
          <div>
            <Label>{t("confirm.reference", locale)}</Label>
            <div className="mt-1 font-mono text-sm" dir="ltr">
              #{booking.id.slice(0, 8).toUpperCase()}
            </div>
          </div>
          <div className="mt-6 sm:mt-0">
            <Label>{t("confirm.booked-under", locale)}</Label>
            <div className="mt-1 font-medium">{booking.customerName}</div>
            <div className="text-sm text-stone-500" dir="ltr">{booking.phone}</div>
          </div>
        </div>

        <hr className="border-stone-200" />

        <div
          className="anim-fade-up px-8 py-6"
          style={{ ['--anim-delay' as string]: '1250ms' }}
        >
          <Label>{t("common.match", locale)}</Label>
          {match ? (
            <>
              <div className="mt-1 text-lg font-semibold">
                {t("brand.name", locale)}{" "}
                <span className="text-stone-400">{t("common.vs", locale)}</span>{" "}
                {localize(match.opponent, locale)}
              </div>
              <div className="text-stone-600">{localize(match.competition, locale)}</div>
              <div className="mt-1 text-stone-600">{formatLongKickoff(match.kickoff)}</div>
              <div className="text-stone-600">{localize(match.venue, locale)}</div>
            </>
          ) : null}
        </div>

        <hr className="border-stone-200" />

        <div
          className="anim-fade-up px-8 py-6"
          style={{ ['--anim-delay' as string]: '1350ms' }}
        >
          <Label>{t("confirm.mobile-ticket", locale)}</Label>
          <div className="mt-3 grid items-center gap-5 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5 sm:grid-cols-[auto_1fr]">
            <div
              className="h-32 w-32 shrink-0 rounded-lg bg-white p-2 ring-1 ring-stone-200"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <div className="text-sm">
              <div className="font-mono text-xs uppercase tracking-wide text-stone-500">
                {t("confirm.reference", locale)}
              </div>
              <div className="mt-0.5 font-mono text-base font-semibold text-stone-900" dir="ltr">
                #{booking.id.slice(0, 8).toUpperCase()}
              </div>
              <p className="mt-2 text-xs text-stone-500">
                {t("confirm.mobile-ticket-help", locale)}
              </p>
            </div>
          </div>
        </div>

        <hr className="border-stone-200" />

        <div
          className="anim-fade-up px-8 py-6"
          style={{ ['--anim-delay' as string]: '1500ms' }}
        >
          <Label>{t("confirm.seats", locale)}</Label>
          <div className="stagger mt-2 flex flex-wrap gap-2" dir="ltr">
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
              <TierLine label={tierLabel("adult")} count={booking.adultCount} price={tiers.adult} currency={currency} />
              <TierLine label={tierLabel("concession")} count={booking.concessionCount} price={tiers.concession} currency={currency} />
              <TierLine label={tierLabel("under17")} count={booking.under17Count} price={tiers.under17} currency={currency} />
              <TierLine label={tierLabel("under5")} count={booking.under5Count} price={tiers.under5} currency={currency} />
            </ul>
          )}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-stone-600">
              {t(
                booking.seats.length === 1
                  ? "confirm.tickets-count"
                  : "confirm.tickets-count-plural",
                locale,
                { n: booking.seats.length },
              )}
            </span>
            {match && (
              <span className="text-lg font-semibold">{formatMoney(total, currency)}</span>
            )}
          </div>
          {!isPending && (
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-stone-600">{t("confirm.paid-with", locale)}</span>
              <span className="font-medium text-stone-900">
                {paymentLabel(booking.paymentMethod, locale)}
              </span>
            </div>
          )}
          {booking.notes && (
            <div className="mt-4 rounded-lg bg-stone-50 p-3 text-sm text-stone-700">
              <Label>{t("common.notes", locale)}</Label>
              <div className="mt-1">{booking.notes}</div>
            </div>
          )}
        </div>
      </div>

      <div
        className="anim-fade-up mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        style={{ ['--anim-delay' as string]: '1700ms' }}
      >
        <Link href="/tickets" className="sfc-btn sfc-btn--primary press">
          {t("confirm.book-another", locale)}
        </Link>
        <Link href="/" className="sfc-btn sfc-btn--ghost press">
          {t("confirm.back-home", locale)}
        </Link>
      </div>

      {!isCancelled && !isPending && (
        <form
          action={cancelBookingAction}
          className="anim-fade-up mt-6 flex flex-col items-center"
          style={{ ['--anim-delay' as string]: '1850ms' }}
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
  currency,
}: {
  label: string;
  count: number;
  price: number;
  currency: import("@/lib/format").Currency;
}) {
  if (count === 0) return null;
  return (
    <li className="flex items-baseline justify-between text-stone-700">
      <span>
        {label} × {count}
      </span>
      <span className="text-stone-500">{formatMoney(price * count, currency)}</span>
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

function paymentLabel(m: "card" | "apple" | "google", locale: Locale): string {
  return m === "apple"
    ? t("pay.tab.apple", locale)
    : m === "google"
      ? t("pay.tab.google", locale)
      : t("pay.tab.card", locale);
}
