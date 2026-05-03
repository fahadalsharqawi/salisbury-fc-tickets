import Link from "next/link";
import { getStats, listBookings, listMatches } from "@/lib/db";
import { formatKickoff, formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const bookings = (await listBookings()).slice(0, 5);
  const matches = (await listMatches({ upcomingOnly: true })).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Tickets sold" value={stats.ticketsSold.toString()} />
        <Stat label="Active bookings" value={stats.activeBookings.toString()} />
        <Stat
          label="Upcoming fixtures"
          value={`${stats.upcomingMatches}${stats.soldOutMatches ? ` (${stats.soldOutMatches} sold out)` : ""}`}
        />
        <Stat label="Revenue" value={formatMoney(stats.revenue)} accent />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white">
          <header className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
            <h2 className="font-semibold">Recent bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              View all →
            </Link>
          </header>
          {bookings.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-stone-500">
              No bookings yet.
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
                        {b.seats.length} seat{b.seats.length === 1 ? "" : "s"} · {new Date(b.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <StatusPill status={b.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white">
          <header className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
            <h2 className="font-semibold">Next up</h2>
            <Link
              href="/admin/matches"
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              Manage fixtures →
            </Link>
          </header>
          {matches.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-stone-500">
              No upcoming fixtures.
            </div>
          ) : (
            <ul className="divide-y divide-stone-200">
              {matches.map((m) => (
                <li key={m.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="font-medium">vs {m.opponent}</div>
                    <div className="text-xs text-stone-500">
                      {formatKickoff(m.kickoff)} · {m.isHome ? "Home" : "Away"}
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

function StatusPill({ status }: { status: "pending" | "confirmed" | "cancelled" }) {
  const styles =
    status === "confirmed"
      ? "bg-emerald-100 text-emerald-800"
      : status === "pending"
        ? "bg-amber-100 text-amber-800"
        : "bg-stone-200 text-stone-600";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles}`}>
      {status}
    </span>
  );
}
