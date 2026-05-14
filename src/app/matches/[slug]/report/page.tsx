import Link from "next/link";
import { notFound } from "next/navigation";
import { TeamBadge } from "@/components/TeamBadge";
import { findResultBySlug, NEWS } from "@/lib/club";
import { localize, t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { NewsPoster } from "@/components/NewsPoster";

export const dynamic = "force-dynamic";

type Params = { slug: string };

function longDate(date: string, locale: Locale): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(
    locale === "ar" ? "ar" : "en-GB",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  );
}

function reportTitle(
  opponent: string,
  outcome: "W" | "D" | "L",
  isHome: boolean,
  locale: Locale,
): string {
  const opp = localize(opponent, locale);
  const brand = t("brand.name", locale);
  if (outcome === "W") {
    return isHome
      ? `${brand} dispatch ${opp} at the Ray Mac`
      : `${brand} take the points at ${opp}`;
  }
  if (outcome === "L") {
    return isHome
      ? `Disappointing afternoon for ${brand} against ${opp}`
      : `${brand} fall to ${opp}`;
  }
  return isHome
    ? `Honours even at the Ray Mac as ${opp} hold ${brand}`
    : `${brand} share the points at ${opp}`;
}

export default async function MatchReportPage({
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

  const resultKey =
    bucket === "W" ? "match.report.result-win"
    : bucket === "L" ? "match.report.result-loss"
    : "match.report.result-draw";
  const result = t(resultKey, locale);
  const opp = localize(match.opponent, locale);

  const title = reportTitle(match.opponent, bucket, match.homeOrAway === "home", locale);
  const related = NEWS.slice(0, 3);

  return (
    <article className="bg-white">
      <header className="sfc-band relative isolate overflow-hidden">
        <div className="sfc-container py-12 sm:py-16">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">
            {t("match.category", locale)}
          </div>
          <h1 className="sfc-display mt-2 max-w-3xl text-balance text-3xl font-bold leading-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-sfc-sky-light sm:text-base">
            {longDate(match.date, locale)} · {localize(match.competition, locale)}
          </p>
        </div>
      </header>

      <div className="sfc-container grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_320px]">
        <div className="prose-like max-w-prose">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-sfc-n-200 bg-gradient-to-br from-sfc-navy via-sfc-navy-deep to-sfc-navy-darker">
            <div className="grid h-full place-items-center text-white">
              <div className="flex items-center gap-4 sm:gap-8">
                <TeamBadge team={homeTeam} size="xl" />
                <div className="sfc-display font-mono text-4xl font-bold tracking-tight sm:text-6xl">
                  {homeScore}
                  <span className="px-3 text-sfc-sky-light">–</span>
                  {awayScore}
                </div>
                <TeamBadge team={awayTeam} size="xl" />
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-sfc-n-700 sm:text-base">
            <p>{t("match.report.body-1", locale, { opponent: opp, result })}</p>
            <p>{t("match.report.body-2", locale)}</p>
            <p>{t("match.report.body-3", locale)}</p>
          </div>

          <div className="mt-10 border-t border-sfc-n-200 pt-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sfc-n-500">
              {t("match.share", locale)}
            </div>
            <ShareLinks title={title} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/matches/${slug}`}
              className="text-sm font-semibold uppercase tracking-[0.12em] text-sfc-navy hover:underline hover:underline-offset-4"
            >
              {t("match.back-to-centre", locale)}
            </Link>
            <span aria-hidden className="text-sfc-n-300">·</span>
            <Link
              href="/results/first-team"
              className="text-sm font-semibold uppercase tracking-[0.12em] text-sfc-navy hover:underline hover:underline-offset-4"
            >
              {t("match.back-to-results", locale)}
            </Link>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-sfc-n-200 bg-sfc-bone p-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sfc-n-500">
              {t("match.full-time", locale)}
            </div>
            <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="flex flex-col items-end gap-1 text-end">
                <TeamBadge team={homeTeam} size="md" />
                <span className="text-[12px] font-semibold">{homeLabel}</span>
              </div>
              <div className="sfc-display font-mono text-3xl font-bold tracking-tight text-sfc-ink">
                {homeScore}–{awayScore}
              </div>
              <div className="flex flex-col items-start gap-1">
                <TeamBadge team={awayTeam} size="md" />
                <span className="text-[12px] font-semibold">{awayLabel}</span>
              </div>
            </div>
            <Link
              href={`/matches/${slug}`}
              className="mt-4 inline-block text-[12px] font-bold uppercase tracking-[0.12em] text-sfc-navy hover:underline hover:underline-offset-4"
            >
              {t("results.match-centre", locale)} →
            </Link>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sfc-n-500">
              {t("match.related", locale)}
            </div>
            <ul className="mt-3 space-y-3">
              {related.map((n) => (
                <li key={n.slug} className="overflow-hidden rounded-xl border border-sfc-n-200 bg-white">
                  <Link href={`/news/${n.slug}`} className="flex gap-3 p-3">
                    <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-md">
                      <NewsPoster article={n} locale={locale} size="thumb" showTitle={false} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-sfc-n-500">
                        {localize(n.category, locale)}
                      </div>
                      <div className="sfc-display mt-0.5 line-clamp-3 text-[13px] font-bold leading-tight">
                        {n.title[locale]}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}

function ShareLinks({ title }: { title: string }) {
  const text = encodeURIComponent(title);
  return (
    <div className="mt-3 flex gap-2">
      <ShareBtn label="X" href={`https://twitter.com/intent/tweet?text=${text}`} />
      <ShareBtn label="Facebook" href={`https://www.facebook.com/sharer/sharer.php?quote=${text}&u=`} />
      <ShareBtn label="WhatsApp" href={`https://wa.me/?text=${text}`} />
    </div>
  );
}

function ShareBtn({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-full border border-sfc-n-300 px-3 py-1 text-xs font-semibold text-sfc-navy transition hover:border-sfc-navy hover:bg-sfc-navy hover:text-white"
    >
      {label}
    </a>
  );
}
