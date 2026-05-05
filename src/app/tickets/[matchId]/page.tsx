import Link from "next/link";
import { notFound } from "next/navigation";
import { getMatch } from "@/lib/db";
import { formatLongKickoff, formatMoney } from "@/lib/format";
import { MAIN_STAND_SURCHARGE } from "@/lib/seats";
import { createClient } from "@/lib/supabase/server";
import BookingForm from "./BookingForm";

export const dynamic = "force-dynamic";

type Params = { matchId: string };
type SearchParams = { error?: string };

export default async function BookingFormPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { matchId } = await params;
  const { error } = await searchParams;
  const match = await getMatch(matchId);
  if (!match) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const prefill = user
    ? {
        name: (user.user_metadata?.name as string | undefined) ?? "",
        email: user.email ?? "",
      }
    : undefined;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/tickets" className="text-sm text-emerald-700 hover:underline">
        ← Back to fixtures
      </Link>

      <header className="anim-fade-up mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
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
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Salisbury FC <span className="text-stone-400">vs</span> {match.opponent}
          </h1>
          <p className="mt-1 text-stone-600">{formatLongKickoff(match.kickoff)}</p>
          <p className="text-stone-500">{match.venue}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium uppercase tracking-wide text-stone-500">
            From
          </div>
          <div className="text-2xl font-semibold">
            {formatMoney(match.pricePerSeat)}{" "}
            <span className="text-base font-normal text-stone-500">/ seat</span>
          </div>
          <div className="text-xs text-stone-500">
            Main Stand seats {formatMoney(MAIN_STAND_SURCHARGE)} extra (stand transfer)
          </div>
        </div>
      </header>

      {match.notes && (
        <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
          {match.notes}
        </div>
      )}

      <div className="mt-8">
        <BookingForm match={match} error={error} prefill={prefill} />
      </div>
    </div>
  );
}
