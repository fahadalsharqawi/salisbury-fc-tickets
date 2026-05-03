import Link from "next/link";
import { listMatches } from "@/lib/db";
import { formatKickoff, formatMoney } from "@/lib/format";
import type { MatchWithAvailability } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = { competition?: string; venue?: string };

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { competition, venue } = await searchParams;
  const all = await listMatches({ upcomingOnly: true });

  const competitions = Array.from(new Set(all.map((m) => m.competition))).sort();
  const venueFilter = venue === "home" || venue === "away" ? venue : undefined;

  const filtered = all.filter((m) => {
    if (competition && m.competition !== competition) return false;
    if (venueFilter === "home" && !m.isHome) return false;
    if (venueFilter === "away" && m.isHome) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Upcoming fixtures</h1>
          <p className="mt-2 text-stone-600">
            Reserve your seat in the Raymond McEnhill Stadium Main Stand.
          </p>
        </div>
        <form
          action="/tickets"
          method="get"
          className="flex flex-wrap items-end gap-2 rounded-2xl border border-stone-200 bg-white p-3"
        >
          <label className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Competition
            <select
              name="competition"
              defaultValue={competition ?? ""}
              className="mt-1 block rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-normal text-stone-900"
            >
              <option value="">All</option>
              {competitions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Venue
            <select
              name="venue"
              defaultValue={venueFilter ?? ""}
              className="mt-1 block rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-normal text-stone-900"
            >
              <option value="">All</option>
              <option value="home">Home</option>
              <option value="away">Away</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            Filter
          </button>
          {(competition || venueFilter) && (
            <Link
              href="/tickets"
              className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      {filtered.length === 0 ? (
        <div className="anim-fade-up rounded-2xl border border-stone-200 bg-white p-10 text-center text-stone-500">
          No fixtures match those filters.
        </div>
      ) : (
        <ul className="stagger space-y-3">
          {filtered.map((m) => (
            <FixtureRow key={m.id} match={m} />
          ))}
        </ul>
      )}
    </div>
  );
}

function FixtureRow({ match }: { match: MatchWithAvailability }) {
  return (
    <li className="anim-fade-up lift rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
        <div className="flex-1 min-w-[16rem]">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide">
            <span
              className={
                match.isHome
                  ? "rounded-full bg-stone-900 px-2 py-0.5 text-white"
                  : "rounded-full border border-stone-300 px-2 py-0.5 text-stone-700"
              }
            >
              {match.isHome ? "Home" : "Away"}
            </span>
            <span className="text-stone-500">{match.competition}</span>
          </div>
          <div className="mt-2 text-xl font-semibold">
            Salisbury FC <span className="text-stone-400">vs</span> {match.opponent}
          </div>
          <div className="mt-1 text-sm text-stone-600">{formatKickoff(match.kickoff)}</div>
          <div className="text-sm text-stone-500">{match.venue}</div>
          {match.notes && (
            <div className="mt-2 text-xs italic text-stone-500">{match.notes}</div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              match.isSoldOut
                ? "bg-stone-200 text-stone-600"
                : match.remaining < 30
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {match.isSoldOut
              ? "Sold out"
              : match.remaining < 30
                ? `Only ${match.remaining} left`
                : `${match.remaining} / ${match.capacity} seats`}
          </span>
          <div className="text-sm font-semibold">{formatMoney(match.pricePerSeat)} / seat</div>
          {match.isSoldOut ? (
            <span className="rounded-full bg-stone-200 px-4 py-2 text-sm font-medium text-stone-500">
              Sold out
            </span>
          ) : (
            <Link
              href={`/tickets/${match.id}`}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Pick a seat →
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}
