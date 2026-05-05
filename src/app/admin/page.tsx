import Link from "next/link";
import { getCurrency } from "@/lib/currency";
import { getStats, listBookings, listMatches } from "@/lib/db";
import { formatKickoff, formatMoney } from "@/lib/format";
import { localize, t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const currency = await getCurrency();
  const locale = await getLocale();
  const stats = await getStats();
  const bookings = (await listBookings()).slice(0, 5);
  const matches = (await listMatches({ upcomingOnly: true })).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={t("admin.stat.tickets-sold", locale)} value={stats.ticketsSold.toString()} />
        <Stat label={t("admin.stat.active-bookings", locale)} value={stats.activeBookings.toString()} />
        <Stat
          label={t("admin.stat.upcoming-fixtures", locale)}
          value={`${stats.upcomingMatches}${
            stats.soldOutMatches
              ? ` ${t("admin.stat.sold-out-of", locale, { n: stats.soldOutMatches })}`
              : ""
          }`}
        />
        <Stat label={t("admin.stat.revenue", locale)} value={formatMoney(stats.revenue, currency)} accent />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white">
          <header className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
            <h2 className="font-semibold">{t("admin.recent-bookings", locale)}</h2>
            <Link
              href="/admin/bookings"
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              {t("admin.view-all", locale)}
            </Link>
          </header>
          {bookings.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-stone-500">
              {t("admin.no-bookings", locale)}
            </div>
          ) : (
            <ul className="divide-y divide-stone-200">
              {bookings.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/admin/bookings/${b.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-stone-50"
                  >
                    <div>
                      <div className="font-medium">{b.customerName}</div>
                      <div className="text-xs text-stone-500">
                        {t(
                          b.seats.length === 1 ? "admin.seat-count" : "admin.seats-count",
                          locale,
                          { n: b.seats.length },
                        )}{" "}
                        ·{" "}
                        {new Date(b.createdAt).toLocaleString(
                          locale === "ar" ? "ar" : undefined,
                        )}
                      </div>
                    </div>
                    <StatusPill status={b.status} locale={locale} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white">
          <header className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
            <h2 className="font-semibold">{t("admin.next-up", locale)}</h2>
            <Link
              href="/admin/matches"
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              {t("admin.manage-fixtures", locale)}
            </Link>
          </header>
          {matches.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-stone-500">
              {t("admin.no-upcoming", locale)}
            </div>
          ) : (
            <ul className="divide-y divide-stone-200">
              {matches.map((m) => (
                <li key={m.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="font-medium">
                      {t("common.vs", locale)} {localize(m.opponent, locale)}
                    </div>
                    <div className="text-xs text-stone-500">
                      {formatKickoff(m.kickoff)} ·{" "}
                      {m.isHome ? t("common.home", locale) : t("common.away", locale)}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      m.isSoldOut
                        ? "bg-stone-200 text-stone-600"
                        : m.remaining < 30
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {m.ticketsSold} / {m.capacity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? "border-emerald-200 bg-emerald-50" : "border-stone-200 bg-white"
      }`}
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </div>
      <div className={`mt-2 text-2xl font-semibold ${accent ? "text-emerald-800" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function StatusPill({
  status,
  locale,
}: {
  status: "pending" | "confirmed" | "cancelled";
  locale: Locale;
}) {
  const styles =
    status === "confirmed"
      ? "bg-emerald-100 text-emerald-800"
      : status === "pending"
        ? "bg-amber-100 text-amber-800"
        : "bg-stone-200 text-stone-600";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {t(`admin.status.${status}`, locale)}
    </span>
  );
}
