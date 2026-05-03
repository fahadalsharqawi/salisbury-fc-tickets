import Image from "next/image";
import Link from "next/link";
import { listMatches } from "@/lib/db";
import { formatKickoff, formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const matches = await listMatches({ upcomingOnly: true });
  const next = matches.find((m) => m.isHome) ?? matches[0];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(135deg,white_1px,transparent_1px),linear-gradient(45deg,white_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:py-24">
          <div className="max-w-2xl">
            <Image
              src="/logo.png"
              alt="Salisbury FC crest"
              width={88}
              height={88}
              priority
              className="anim-scale-in mb-6 h-22 w-22 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            />
            <span className="anim-fade-up inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide ring-1 ring-white/20" style={{ ['--anim-delay' as string]: '120ms' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Tickets on sale now
            </span>
            <h1 className="anim-fade-up mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl" style={{ ['--anim-delay' as string]: '200ms' }}>
              Back the Whites at the Ray Mac.
            </h1>
            <p className="anim-fade-up mt-5 max-w-xl text-lg text-stone-200" style={{ ['--anim-delay' as string]: '300ms' }}>
              Pick your seat in the Main Stand for upcoming Salisbury FC fixtures.
              Cup ties, league nights, and Saturday three o'clocks — all bookable in a minute.
            </p>
            <div className="anim-fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ ['--anim-delay' as string]: '380ms' }}>
              <Link
                href="/tickets"
                className="press inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-stone-900 shadow-sm transition hover:bg-stone-100 hover:shadow-md"
              >
                Browse fixtures
              </Link>
              {next && (
                <Link
                  href={`/tickets/${next.id}`}
                  className="press inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Next match: vs {next.opponent}
                </Link>
              )}
            </div>
          </div>

          {next && (
            <aside
              className="anim-slide-right self-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              style={{ ['--anim-delay' as string]: '300ms' }}
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-stone-300">
                Next fixture
              </div>
              <div className="mt-2 text-2xl font-semibold">
                Salisbury FC <span className="text-stone-400">vs</span> {next.opponent}
              </div>
              <div className="mt-1 text-stone-300">{next.competition}</div>
              <hr className="my-4 border-white/10" />
              <dl className="space-y-2 text-sm">
                <Row label="Kick-off" value={formatKickoff(next.kickoff)} />
                <Row label="Venue" value={next.venue} />
                <Row label="From" value={`${formatMoney(next.pricePerSeat)} / seat`} />
                <Row
                  label="Availability"
                  value={
                    next.isSoldOut
                      ? "Sold out"
                      : `${next.remaining} of ${next.capacity} seats`
                  }
                />
              </dl>
              <Link
                href={`/tickets/${next.id}`}
                className="press mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 font-semibold text-stone-950 transition hover:bg-emerald-400 hover:shadow-[0_8px_24px_-8px_rgba(16,185,129,0.6)]"
              >
                Pick a seat
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </aside>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Upcoming fixtures</h2>
          <Link
            href="/tickets"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            See all →
          </Link>
        </div>
        {matches.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center text-stone-500">
            No fixtures on sale right now. Check back soon.
          </div>
        ) : (
          <ul className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches.slice(0, 6).map((m) => (
              <li
                key={m.id}
                className="anim-fade-up lift rounded-2xl border border-stone-200 bg-white p-5"
              >
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide">
                  <span className="text-emerald-700">{m.isHome ? "Home" : "Away"}</span>
                  <span className="text-stone-500">{m.competition}</span>
                </div>
                <div className="mt-2 text-lg font-semibold">
                  Salisbury FC vs {m.opponent}
                </div>
                <div className="mt-1 text-sm text-stone-600">{formatKickoff(m.kickoff)}</div>
                <div className="mt-1 text-sm text-stone-500">{m.venue}</div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {formatMoney(m.pricePerSeat)} / seat
                  </span>
                  <Link
                    href={m.isSoldOut ? "/tickets" : `/tickets/${m.id}`}
                    aria-disabled={m.isSoldOut}
                    className={`text-sm font-semibold ${
                      m.isSoldOut
                        ? "pointer-events-none text-stone-400"
                        : "text-emerald-700 hover:underline"
                    }`}
                  >
                    {m.isSoldOut ? "Sold out" : "Book →"}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-stone-400">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
