import Link from "next/link";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";
import { LEAGUE, RESULTS, type LastResult } from "@/lib/club";
import { localize, t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const metadata = {
  title: "First-team results — Salisbury FC",
  description:
    "Every Salisbury FC first-team result this season, grouped by month.",
};

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function monthLabel(date: string, locale: Locale): string {
  const [y, m] = date.split("-").map(Number);
  if (locale === "ar") {
    return new Date(y, m - 1, 1).toLocaleDateString("ar", {
      month: "long",
      year: "numeric",
    });
  }
  return `${MONTH_NAMES_EN[m - 1]} ${y}`;
}

function dayLabel(date: string, locale: Locale): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(
    locale === "ar" ? "ar" : "en-GB",
    { weekday: "short", day: "numeric", month: "short" },
  );
}

function resultBucket(r: LastResult): "W" | "D" | "L" {
  if (r.scoreFor > r.scoreAgainst) return "W";
  if (r.scoreFor < r.scoreAgainst) return "L";
  return "D";
}

function groupByMonth(results: LastResult[]): Array<{ key: string; rows: LastResult[] }> {
  const buckets = new Map<string, LastResult[]>();
  for (const r of results) {
    const key = r.date.slice(0, 7); // yyyy-mm
    const list = buckets.get(key) ?? [];
    list.push(r);
    buckets.set(key, list);
  }
  return Array.from(buckets.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, rows]) => ({ key, rows }));
}

export default async function FirstTeamResultsPage() {
  const locale = await getLocale();

  const groups = groupByMonth(RESULTS);
  const summary = {
    P: RESULTS.length,
    W: RESULTS.filter((r) => resultBucket(r) === "W").length,
    D: RESULTS.filter((r) => resultBucket(r) === "D").length,
    L: RESULTS.filter((r) => resultBucket(r) === "L").length,
    GF: RESULTS.reduce((s, r) => s + r.scoreFor, 0),
    GA: RESULTS.reduce((s, r) => s + r.scoreAgainst, 0),
  };

  return (
    <>
      <div className="sfc-band">
        <div className="sfc-container py-8 sm:py-12">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">First Team</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold leading-[1.05] sm:text-5xl">
            Results
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            Every Salisbury FC first-team result this season —{" "}
            {localize(LEAGUE.league, locale)} plus FA Cup and FA Trophy ties.
          </p>
        </div>
      </div>

      <div className="sfc-container py-10 sm:py-14">
        {/* Season summary */}
        <MotionStagger
          className="grid grid-cols-3 gap-3 sm:grid-cols-6"
          stagger={0.04}
        >
          <Stat label={t("standings.played", locale)} value={summary.P.toString()} />
          <Stat label={t("standings.won", locale)} value={summary.W.toString()} accent="win" />
          <Stat label={t("standings.drawn", locale)} value={summary.D.toString()} accent="draw" />
          <Stat label={t("standings.lost", locale)} value={summary.L.toString()} accent="loss" />
          <Stat label="Goals for" value={summary.GF.toString()} />
          <Stat label="Goals against" value={summary.GA.toString()} />
        </MotionStagger>

        {/* Results by month */}
        <div className="mt-10 space-y-10">
          {groups.map((g) => (
            <section key={g.key}>
              <h2 className="sfc-display anim-fade-up mb-4 text-xl font-bold">
                {monthLabel(g.key + "-01", locale)}
              </h2>
              <ul className="overflow-hidden rounded-2xl border border-sfc-n-200 bg-white divide-y divide-sfc-n-100">
                {g.rows.map((r) => {
                  const bucket = resultBucket(r);
                  const home =
                    r.homeOrAway === "home" ? t("brand.name", locale) : localize(r.opponent, locale);
                  const away =
                    r.homeOrAway === "home" ? localize(r.opponent, locale) : t("brand.name", locale);
                  const homeScore = r.homeOrAway === "home" ? r.scoreFor : r.scoreAgainst;
                  const awayScore = r.homeOrAway === "home" ? r.scoreAgainst : r.scoreFor;
                  return (
                    <li key={r.date + r.opponent} className="flex items-center gap-4 px-5 py-4">
                      <span
                        className={`sfc-form-chip sfc-form-chip--${bucket} h-8 w-8 text-[12px]`}
                      >
                        {bucket}
                      </span>
                      <div className="hidden w-28 shrink-0 text-[12px] text-sfc-n-500 sm:block">
                        {dayLabel(r.date, locale)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
                          <span className="truncate text-end font-semibold">
                            {home}
                          </span>
                          <span className="font-mono text-base font-bold tracking-tight text-sfc-ink">
                            {homeScore}
                            <span className="px-1 text-sfc-n-300">–</span>
                            {awayScore}
                          </span>
                          <span className="truncate font-semibold">
                            {away}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 text-[11px] text-sfc-n-500 sm:hidden">
                          <span>{dayLabel(r.date, locale)}</span>
                          <span className="truncate">{localize(r.competition, locale)}</span>
                        </div>
                      </div>
                      <span className="hidden max-w-[18ch] truncate text-end text-[12px] text-sfc-n-500 sm:block">
                        {localize(r.competition, locale)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        {/* CTAs */}
        <div className="anim-fade-up mt-10 flex flex-wrap gap-3">
          <Link href="/tickets" className="sfc-btn sfc-btn--primary press">
            {t("club.buy-tickets", locale)}
          </Link>
          <Link href="/club" className="sfc-btn sfc-btn--ghost press">
            Squad &amp; staff
          </Link>
          <Link href="/club/about" className="sfc-btn sfc-btn--ghost press">
            ← Back to the club
          </Link>
        </div>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "win" | "draw" | "loss";
}) {
  const accentClass =
    accent === "win"
      ? "text-sfc-pitch"
      : accent === "draw"
        ? "text-amber-700"
        : accent === "loss"
          ? "text-sfc-loss"
          : "text-sfc-navy";
  return (
    <MotionItem
      variant="scaleIn"
      className="rounded-2xl border border-sfc-n-200 bg-white p-4 sm:p-5"
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-sfc-n-500">
        {label}
      </div>
      <div className={`sfc-display mt-1 text-2xl font-bold leading-none ${accentClass}`}>
        {value}
      </div>
    </MotionItem>
  );
}
