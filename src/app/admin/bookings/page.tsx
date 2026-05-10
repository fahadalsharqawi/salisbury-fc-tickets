import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { listBookings, listMatches } from "@/lib/db";
import { formatKickoff } from "@/lib/format";
import { localize, t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import type { BookingStatus, Match } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = { status?: string; q?: string };

const PAGE_LIMIT = 200;

function asStatus(s: string | undefined): BookingStatus | undefined {
  return s === "confirmed" || s === "attended" || s === "cancelled" ? s : undefined;
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const { status, q } = await searchParams;
  const locale = await getLocale();
  // Push filters into the DB query rather than fetching every row and
  // filtering in JS — on a busy season the bookings table can have
  // thousands of rows and the admin page was noticeably slow.
  const [filtered, matches] = await Promise.all([
    listBookings({
      status: asStatus(status),
      search: q,
      limit: PAGE_LIMIT,
    }),
    listMatches(),
  ]);
  const matchMap = new Map<string, Match>(matches.map((m) => [m.id, m]));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{t("admin.bookings-title", locale)}</h2>
          <p className="text-sm text-stone-500">
            {filtered.length === PAGE_LIMIT
              ? `Showing the most recent ${PAGE_LIMIT} bookings — refine filters to narrow.`
              : `${filtered.length} booking${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <form action="/admin/bookings" method="get" className="flex flex-wrap items-center gap-2">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder={t("admin.search-placeholder", locale)}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
          />
          <select
            name="status"
            defaultValue={status ?? "all"}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
          >
            <option value="all">{t("admin.all-statuses", locale)}</option>
            <option value="confirmed">{t("admin.status.confirmed", locale)}</option>
            <option value="attended">Attended</option>
            <option value="cancelled">{t("admin.status.cancelled", locale)}</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            {t("common.filter", locale)}
          </button>
        </form>
      </header>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-stone-500">
            {t("admin.no-match-filters", locale)}
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-stone-50 text-start text-xs font-semibold uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-5 py-3 text-start">{t("admin.col.customer", locale)}</th>
                <th className="px-5 py-3 text-start">{t("admin.col.match", locale)}</th>
                <th className="px-5 py-3 text-start">{t("admin.col.seats", locale)}</th>
                <th className="px-5 py-3 text-start">{t("admin.col.status", locale)}</th>
                <th className="px-5 py-3 text-start">{t("admin.col.created", locale)}</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filtered.map((b) => {
                const match = matchMap.get(b.matchId);
                return (
                  <tr key={b.id} className="hover:bg-stone-50">
                    <td className="px-5 py-3">
                      <div className="font-medium">{b.customerName}</div>
                      <div className="text-xs text-stone-500" dir="ltr">{b.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      {match ? (
                        <>
                          <div>
                            {t("common.vs", locale)} {localize(match.opponent, locale)}
                          </div>
                          <div className="text-xs text-stone-500">
                            {formatKickoff(match.kickoff)} ·{" "}
                            {match.isHome ? t("common.home", locale) : t("common.away", locale)}
                          </div>
                        </>
                      ) : (
                        <span className="text-stone-400">{t("admin.deleted", locale)}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium">{b.seats.length}</div>
                      <div className="text-xs text-stone-500" dir="ltr">{b.seats.join(", ")}</div>
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill status={b.status} locale={locale} />
                    </td>
                    <td className="px-5 py-3 text-stone-500">
                      {new Date(b.createdAt).toLocaleString(locale === "ar" ? "ar" : undefined)}
                    </td>
                    <td className="px-5 py-3 text-end">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="text-sm font-medium text-emerald-700 hover:underline"
                      >
                        {t("admin.open", locale)}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
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
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}
