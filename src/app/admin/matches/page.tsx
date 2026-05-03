import { createMatchAction, deleteMatchAction } from "@/lib/actions";
import { listMatches } from "@/lib/db";
import { dateInput, formatKickoff, formatMoney, timeInput } from "@/lib/format";

export const dynamic = "force-dynamic";

type SearchParams = { error?: string; ok?: string };

export default async function AdminMatchesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { error, ok } = await searchParams;
  const matches = await listMatches({ upcomingOnly: true });

  const todayDate = new Date();
  todayDate.setDate(todayDate.getDate() + 7);
  const defaultDate = todayDate.toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold">Fixtures</h2>
        <p className="text-sm text-stone-500">
          Add upcoming matches, monitor sales, and remove unbooked fixtures.
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {ok && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Fixture added.
        </div>
      )}

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h3 className="font-semibold">New fixture</h3>
        <form
          action={createMatchAction}
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Field label="Opponent" name="opponent" required placeholder="e.g. Truro City" />
          <Field
            label="Competition"
            name="competition"
            required
            placeholder="Southern League Premier South"
          />
          <Field label="Venue" name="venue" required placeholder="Raymond McEnhill Stadium" />
          <Field label="Date" name="date" type="date" required defaultValue={defaultDate} />
          <Field label="Kick-off" name="time" type="time" required defaultValue="15:00" />
          <Field
            label="Price per seat (£)"
            name="pricePerSeat"
            type="number"
            min={1}
            step="1"
            required
            defaultValue="12"
          />
          <label className="block text-sm font-medium text-stone-700">
            Venue type
            <select
              name="isHome"
              defaultValue="home"
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="home">Home</option>
              <option value="away">Away</option>
            </select>
          </label>
          <Field label="Notes" name="notes" placeholder="(optional)" />
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add fixture
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <header className="border-b border-stone-200 px-5 py-4">
          <h3 className="font-semibold">Upcoming fixtures</h3>
        </header>
        {matches.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-stone-500">No fixtures yet.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-5 py-3">Match</th>
                <th className="px-5 py-3">Kick-off</th>
                <th className="px-5 py-3">Venue</th>
                <th className="px-5 py-3">Sold</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {matches.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3">
                    <div className="font-medium">vs {m.opponent}</div>
                    <div className="text-xs text-stone-500">{m.competition}</div>
                    <div className="hidden text-xs text-stone-400">
                      {dateInput(m.kickoff)} {timeInput(m.kickoff)}
                    </div>
                  </td>
                  <td className="px-5 py-3">{formatKickoff(m.kickoff)}</td>
                  <td className="px-5 py-3">
                    <div>{m.venue}</div>
                    <div className="text-xs text-stone-500">{m.isHome ? "Home" : "Away"}</div>
                  </td>
                  <td className="px-5 py-3">
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
                  </td>
                  <td className="px-5 py-3">{formatMoney(m.pricePerSeat)}</td>
                  <td className="px-5 py-3 text-right">
                    <form action={deleteMatchAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="text-sm font-medium text-red-600 hover:underline disabled:opacity-40"
                        disabled={m.ticketsSold > 0}
                        title={
                          m.ticketsSold > 0
                            ? "Cancel bookings before deleting"
                            : undefined
                        }
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      <input
        {...props}
        className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </label>
  );
}
