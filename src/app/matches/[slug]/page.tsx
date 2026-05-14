import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TeamBadge } from "@/components/TeamBadge";
import { MatchLineupTabs } from "@/components/MatchLineupTabs";
import {
  findResultBySlug,
  placeholderLineup,
  salisburyLineup,
} from "@/lib/club";
import { localize, t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

type Params = { slug: string };

function dayLabel(date: string, locale: Locale): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(
    locale === "ar" ? "ar" : "en-GB",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  );
}

const PARTNERS: { src: string; alt: string }[] = [
  { src: "/partners/mitre.png",                 alt: "Mitre" },
  { src: "/partners/errea.jpg",                 alt: "Errea" },
  { src: "/partners/dazn.png",                  alt: "DAZN" },
  { src: "/partners/cara-glass.jpg",            alt: "Cara Glass" },
  { src: "/partners/complete-construction.png", alt: "Complete Construction" },
  { src: "/partners/enterprise.png",            alt: "Enterprise" },
  { src: "/partners/retain-healthcare.png",     alt: "Retain Healthcare" },
  { src: "/partners/tic-health.png",            alt: "TiC Health" },
  { src: "/partners/the-boss.png",              alt: "The Boss" },
  { src: "/partners/new-hall.png",              alt: "New Hall" },
];

export default async function MatchCentrePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const match = findResultBySlug(slug);
  if (!match) notFound();

  const bucket =
    match.scoreFor > match.scoreAgainst
      ? "W"
      : match.scoreFor < match.scoreAgainst
        ? "L"
        : "D";

  const homeTeam = match.homeOrAway === "home" ? "Salisbury FC" : match.opponent;
  const awayTeam = match.homeOrAway === "home" ? match.opponent : "Salisbury FC";
  const homeLabel =
    match.homeOrAway === "home" ? t("brand.name", locale) : localize(match.opponent, locale);
  const awayLabel =
    match.homeOrAway === "home" ? localize(match.opponent, locale) : t("brand.name", locale);
  const homeScore = match.homeOrAway === "home" ? match.scoreFor : match.scoreAgainst;
  const awayScore = match.homeOrAway === "home" ? match.scoreAgainst : match.scoreFor;
  const totalGoals = homeScore + awayScore;

  const sfc = salisburyLineup();
  const opp = placeholderLineup();
  const homeLineup = match.homeOrAway === "home" ? sfc : opp;
  const awayLineup = match.homeOrAway === "home" ? opp : sfc;

  return (
    <>
      <div className="sfc-band relative isolate overflow-hidden">
        <div className="sfc-container py-10 sm:py-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="sfc-eyebrow sfc-eyebrow--on-dark">
                {t("match.heading", locale)}
              </div>
              <p className="mt-2 text-sm text-sfc-sky-light sm:text-base">
                {dayLabel(match.date, locale)} ·{" "}
                {localize(match.competition, locale)}
              </p>
            </div>
            <span
              className={`sfc-form-chip sfc-form-chip--${bucket} h-10 w-10 text-base`}
              aria-label={bucket === "W" ? "Win" : bucket === "L" ? "Loss" : "Draw"}
            >
              {bucket}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
            <div className="flex flex-col items-end gap-3 text-end">
              <TeamBadge team={homeTeam} size="xl" />
              <div className="sfc-display text-lg font-bold leading-tight sm:text-2xl">
                {homeLabel}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="sfc-display font-mono text-5xl font-bold leading-none tracking-tight sm:text-7xl">
                {homeScore}
                <span className="px-3 text-sfc-sky-light">–</span>
                {awayScore}
              </div>
              <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-sfc-sky-light">
                {t("match.full-time", locale)}
              </div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <TeamBadge team={awayTeam} size="xl" />
              <div className="sfc-display text-lg font-bold leading-tight sm:text-2xl">
                {awayLabel}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sfc-container space-y-12 py-10 sm:py-14">
        <section className="grid gap-4 sm:grid-cols-2">
          <MediaCard
            eyebrow={t("match.preview", locale)}
            title={t("match.preview-link", locale)}
            href="/news"
            team={homeTeam}
          />
          <MediaCard
            eyebrow={t("match.report", locale)}
            title={t("match.report-link", locale)}
            href={`/matches/${slug}/report`}
            team={awayTeam}
          />
        </section>

        <section>
          <h2 className="sfc-display text-xl font-bold sm:text-2xl">
            {t("match.scorers", locale)}
          </h2>
          {totalGoals === 0 ? (
            <p className="mt-3 text-sm text-sfc-n-500">0 – 0</p>
          ) : (
            <ol className="anim-fade-up mt-4 grid gap-2 sm:grid-cols-2">
              {Array.from({ length: homeScore }).map((_, i) => (
                <TimelineRow key={`h-${i}`} team={homeTeam} label={homeLabel} side="home" />
              ))}
              {Array.from({ length: awayScore }).map((_, i) => (
                <TimelineRow key={`a-${i}`} team={awayTeam} label={awayLabel} side="away" />
              ))}
            </ol>
          )}
          {totalGoals > 0 && (
            <p className="mt-3 text-xs italic text-sfc-n-500">
              {t("match.scorers-tbc", locale)}
            </p>
          )}
        </section>

        <section>
          <h2 className="sfc-display text-xl font-bold sm:text-2xl">
            {t("match.lineups", locale)}
          </h2>
          <div className="mt-4">
            <MatchLineupTabs
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              homeLabel={homeLabel}
              awayLabel={awayLabel}
              homeLineup={homeLineup}
              awayLineup={awayLineup}
              startingLabel={t("match.starting-xi", locale)}
              subsLabel={t("match.subs", locale)}
            />
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label={t("match.kickoff", locale)} value={dayLabel(match.date, locale)} />
          <Fact
            label={t("match.venue", locale)}
            value={
              match.homeOrAway === "home"
                ? "Raymond McEnhill Stadium"
                : `Away · ${localize(match.opponent, locale)}`
            }
          />
          <Fact
            label={t("match.competition", locale)}
            value={localize(match.competition, locale)}
          />
          <Fact label={t("match.full-time", locale)} value={`${homeScore} – ${awayScore}`} />
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sfc-n-200 bg-sfc-bone px-6 py-5">
          <div>
            <div className="sfc-eyebrow">{t("match.report", locale)}</div>
            <p className="mt-1 text-sm text-sfc-n-600">
              {t("match.report-placeholder", locale)}
            </p>
          </div>
          <Link href={`/matches/${slug}/report`} className="sfc-btn sfc-btn--primary press">
            {t("match.read-report", locale)}
          </Link>
        </div>

        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-sfc-n-500">
            {t("match.partners", locale)}
          </h2>
          <div className="mt-4 grid grid-cols-3 items-center gap-x-6 gap-y-6 sm:grid-cols-5">
            {PARTNERS.map((p) => (
              <div
                key={p.src}
                className="relative flex h-12 items-center justify-center sm:h-14"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={120}
                  height={56}
                  className="max-h-full w-auto object-contain opacity-70 transition hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </section>

        <div>
          <Link
            href="/results/first-team"
            className="text-sm font-semibold uppercase tracking-[0.12em] text-sfc-navy hover:underline hover:underline-offset-4"
          >
            {t("match.back-to-results", locale)}
          </Link>
        </div>
      </div>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-sfc-n-200 bg-white p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-sfc-n-500">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold text-sfc-ink">{value}</div>
    </div>
  );
}

function TimelineRow({
  team,
  label,
  side,
}: {
  team: string;
  label: string;
  side: "home" | "away";
}) {
  return (
    <li
      className={`flex items-center gap-3 rounded-xl border border-sfc-n-200 bg-white px-4 py-3 ${
        side === "away" ? "sm:justify-self-end" : ""
      }`}
    >
      <TeamBadge team={team} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-sfc-ink">{label}</div>
        <div className="text-[11px] uppercase tracking-[0.12em] text-sfc-n-500">⚽︎</div>
      </div>
    </li>
  );
}

function MediaCard({
  eyebrow,
  title,
  href,
  team,
}: {
  eyebrow: string;
  title: string;
  href: string;
  team: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-sfc-n-200 bg-white p-5 transition hover:border-sfc-navy hover:shadow-md"
    >
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sfc-navy via-sfc-navy-deep to-sfc-navy-darker sm:h-20 sm:w-20">
        <TeamBadge team={team} size="md" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-sfc-n-500">
          {eyebrow}
        </div>
        <div className="sfc-display mt-1 text-base font-bold leading-tight text-sfc-ink group-hover:text-sfc-navy sm:text-lg">
          {title}
        </div>
      </div>
    </Link>
  );
}
