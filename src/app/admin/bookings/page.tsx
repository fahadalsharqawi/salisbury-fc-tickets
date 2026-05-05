import Link from "next/link";
import { listBookings, listMatches } from "@/lib/db";
import { formatKickoff } from "@/lib/format";
import type { BookingStatus, Match } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = { status?: string; q?: string };

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status, q } = await searchParams;
  const [bookings, matches] = await Promise.all([listBookings(), listMatches()]);
  const matchMap = new Map<string, Match>(matches.map((m) => [m.id, m]));

  const filtered = bookings.filter((b) => {
    if (status && status !== "all" && b.status !== status) return false;
    if (q) {
      const needle = q.toLowerCase();
      if (
        !b.customerName.toLowerCase().includes(needle) &&
        !b.email.toLowerCase().includes(needle)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Bookings</h2>
          <p className="text-sm text-stone-500">
            {filtered.length} of {bookings.length} bookings
          </p>
        </div>
        <form action="/admin/bookings" method="get" className="flex flex-wrap items-center gap-2">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search name or email"
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
          />
          <select
            name="status"
            defaultValue={status ?? "all"}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="attended">Attended</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            Filter
          </button>
        </form>
      </header>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-stone-500">
            No bookings match those filters.
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Match</th>
                <th className="px-5 py-3">Seats</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Created</th>
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
                      <div className="text-xs text-stone-500">{b.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      {match ? (
                        <>
                          <div>vs {match.opponent}</div>
                          <div className="text-xs text-stone-500">
                            {formatKickoff(match.kickoff)} ·{" "}
                            {match.isHome ? "Home" : "Away"}
                          </div>
                        </>
                      ) : (
                        <span className="text-stone-400">deleted</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium">{b.seats.length}</div>
                      <div className="text-xs text-stone-500">{b.seats.join(", ")}</div>
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="px-5 py-3 text-stone-500">
                      {new Date(b.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="text-sm font-medium text-emerald-700 hover:underline"
                      >
                        Open →
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

function StatusPill({ status }: { status: BookingStatus }) {
  const styles =
    status === "confirmed"
      ? "bg-emerald-100 text-emerald-800"
      : status === "attended"
        ? "bg-sky-100 text-sky-800"
        : "bg-stone-200 text-stone-600";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles}`}>
      {status}
    </span>
  );
}
