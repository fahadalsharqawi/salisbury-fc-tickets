import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelBookingAction, markAttendedAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { getCurrency } from "@/lib/currency-server";
import { bookingTotal, getBooking, getMatch } from "@/lib/db";
import { formatLongKickoff, formatMoney } from "@/lib/format";
import { localize, t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { tierLabel, tierPrices } from "@/lib/pricing";
import type { BookingStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function AdminBookingDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  await requireAdmin();
  const { id } = await params;
  const currency = await getCurrency();
  const locale = await getLocale();
  const booking = await getBooking(id);
  if (!booking) notFound();
  const match = await getMatch(booking.matchId);
  const total = match ? bookingTotal(booking, match) : 0;
  const tiers = match ? tierPrices(match.pricePerSeat) : null;

  return (
    <div className="space-y-6">
      <Link href="/admin/bookings" className="text-sm text-emerald-700 hover:underline">
        {t("admin.all-bookings", locale)}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <Label>{t("admin.booking-eyebrow", locale)}</Label>
                <div className="mt-1 font-mono text-sm" dir="ltr">
                  #{booking.id.slice(0, 8).toUpperCase()}
                </div>
                <h2 className="mt-3 text-2xl font-semibold">{booking.customerName}</h2>
                <div className="mt-1 text-sm text-stone-600" dir="ltr">
                  {booking.email} · {booking.phone}
                </div>
              </div>
              <StatusPill status={booking.status} locale={locale} />
            </div>

            <hr className="my-5 border-stone-200" />

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <Row label={t("admin.row.tickets", locale)} value={`${booking.seats.length}`} />
              <Row label={t("admin.row.total", locale)} value={match ? formatMoney(total, currency) : "—"} />
              <Row label={t("admin.row.payment", locale)} value={paymentLabel(booking.paymentMethod, locale)} />
              <Row
                label={t("admin.row.created", locale)}
                value={new Date(booking.createdAt).toLocaleString(locale === "ar" ? "ar" : undefined)}
              />
              <Row
                label={t("admin.row.match", locale)}
                value={match ? `${t("common.vs", locale)} ${localize(match.opponent, locale)}` : t("admin.deleted", locale)}
              />
            </dl>

            <div className="mt-5">
              <Label>{t("confirm.seats", locale)}</Label>
              <div className="mt-2 flex flex-wrap gap-2" dir="ltr">
                {booking.seats.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-stone-900 px-3 py-1 text-xs font-medium text-white"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {tiers && (
              <div className="mt-5">
                <Label>Headcount</Label>
                <ul className="mt-2 space-y-1 text-sm">
                  <TierRow
                    label={tierLabel("adult")}
                    count={booking.adultCount}
                    price={tiers.adult}
                  />
                  <TierRow
                    label={tierLabel("concession")}
                    count={booking.concessionCount}
                    price={tiers.concession}
                  />
                  <TierRow
                    label={tierLabel("under17")}
                    count={booking.under17Count}
                    price={tiers.under17}
                  />
                  <TierRow
                    label={tierLabel("under5")}
                    count={booking.under5Count}
                    price={tiers.under5}
                  />
                </ul>
              </div>
            )}

            {booking.notes && (
              <div className="mt-5 rounded-lg bg-stone-50 p-4 text-sm text-stone-700">
                <Label>{t("common.notes", locale)}</Label>
                <div className="mt-1">{booking.notes}</div>
              </div>
            )}
          </section>

          {match && (
            <section className="rounded-2xl border border-stone-200 bg-white p-6">
              <Label>{t("common.match", locale)}</Label>
              <div className="mt-1 text-lg font-semibold">
                {t("brand.name", locale)}{" "}
                <span className="text-stone-400">{t("common.vs", locale)}</span>{" "}
                {localize(match.opponent, locale)}
              </div>
              <div className="text-stone-600">{localize(match.competition, locale)}</div>
              <div className="mt-1 text-stone-600">{formatLongKickoff(match.kickoff)}</div>
              <div className="text-stone-600">{localize(match.venue, locale)}</div>
            </section>
          )}
        </div>

        <aside className="space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
          <Label>{t("admin.update-status", locale)}</Label>
          <form action={markAttendedAction}>
            <input type="hidden" name="id" value={booking.id} />
            <button
              type="submit"
              disabled={booking.status !== "confirmed"}
              className="block w-full rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Mark attended
            </button>
          </form>
          <form action={cancelBookingAction}>
            <input type="hidden" name="id" value={booking.id} />
            <input type="hidden" name="by" value="owner" />
            <input
              type="hidden"
              name="redirectTo"
              value={`/admin/bookings/${booking.id}`}
            />
            <button
              type="submit"
              disabled={booking.status === "cancelled"}
              className="block w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("admin.cancel-booking", locale)}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function TierRow({
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-0.5 font-medium text-stone-900">{value}</div>
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

function paymentLabel(m: "card" | "apple" | "google", locale: Locale): string {
  return m === "apple"
    ? t("pay.tab.apple", locale)
    : m === "google"
      ? t("pay.tab.google", locale)
      : t("pay.tab.card", locale);
}

function StatusPill({
  status,
  locale,
}: {
  status: BookingStatus;
  locale: Locale;
}) {
  const styles =
    status === "confirmed"
      ? "bg-emerald-100 text-emerald-800"
      : status === "attended"
        ? "bg-sky-100 text-sky-800"
        : "bg-stone-200 text-stone-600";
  const label =
    status === "attended"
      ? "Attended"
      : t(`admin.status.${status}`, locale);
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}
