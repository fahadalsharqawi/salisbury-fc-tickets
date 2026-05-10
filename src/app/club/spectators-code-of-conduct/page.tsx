import Link from "next/link";

export const metadata = {
  title: "Spectators' Code of Conduct — Salisbury FC",
  description:
    "The Salisbury FC spectator code — keeping the Ray Mac welcoming for every supporter.",
};

const DOS = [
  "Support the Whites positively — encouragement is what helps the players.",
  "Welcome opposition supporters and treat them with respect.",
  "Respect the match officials. They take a lot of stick they don't deserve.",
  "Look out for the people around you, especially children, families and first-time visitors.",
  "Sit, stand and celebrate as you wish — but mind people behind you.",
];

const DONTS = [
  "No racist, homophobic, sexist or any other form of discriminatory language or behaviour.",
  "No personal abuse of players, officials, opposition or fellow supporters.",
  "No throwing of any objects onto the pitch or into the crowd.",
  "No persistent foul or threatening language.",
  "No alcohol in view of the pitch (FA rule); no glass containers; no smoking in covered areas.",
];

export default function CodeOfConductPage() {
  return (
    <>
      <div className="sfc-band">
        <div className="sfc-container py-8 sm:py-12">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">The Club</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold leading-[1.05] sm:text-5xl">
            Spectators&rsquo; Code of Conduct
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            Salisbury FC follows the FA spectator Code of Conduct so the Ray
            Mac stays a welcoming environment for every supporter.
          </p>
        </div>
      </div>

      <div className="sfc-container py-10 sm:py-14">
        <div className="anim-fade-up mx-auto grid max-w-3xl gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h2 className="sfc-display text-xl font-bold text-emerald-900">
              Please do
            </h2>
            <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-emerald-900/90">
              {DOS.map((d) => (
                <li key={d} className="flex gap-2">
                  <span aria-hidden className="text-emerald-700">✓</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="sfc-display text-xl font-bold text-red-900">
              Please don&rsquo;t
            </h2>
            <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-red-900/90">
              {DONTS.map((d) => (
                <li key={d} className="flex gap-2">
                  <span aria-hidden className="text-red-700">✕</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <article className="anim-fade-up mx-auto mt-6 max-w-3xl rounded-2xl border border-sfc-n-200 bg-white p-6">
          <h2 className="sfc-display text-lg font-bold">Reporting a problem</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-sfc-n-700">
            If you witness or experience anything that breaks this code, you
            can report it to the nearest steward (high-vis jacket), at the
            ticket office, or via the Kick It Out report line.
            Stewards have an obligation to act and incidents will be
            investigated by the safeguarding officer.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://www.kickitout.org/report"
              target="_blank"
              rel="noreferrer noopener"
              className="sfc-btn sfc-btn--primary press"
            >
              Report via Kick It Out ↗
            </a>
            <Link href="/contact" className="sfc-btn sfc-btn--ghost press">
              Contact the club
            </Link>
            <Link href="/club/about" className="sfc-btn sfc-btn--ghost press">
              ← Back to the club
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
