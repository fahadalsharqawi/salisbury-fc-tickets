import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroParallax from "@/components/HeroParallax";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";
import { NewsPoster } from "@/components/NewsPoster";
import { LAST_RESULT, LEAGUE, NEWS, RESULTS, STANDINGS } from "@/lib/club";
import { getCurrency } from "@/lib/currency-server";
import { listMatches } from "@/lib/db";
import { formatKickoff, formatMoney } from "@/lib/format";
import { localize, t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const currency = await getCurrency();
  const locale = await getLocale();
  const matches = await listMatches({ upcomingOnly: true });
  const next = matches.find((m) => m.isHome) ?? matches[0];
  const upcoming = matches.slice(0, 3);

  return (
    <div>
      {/* HERO — magazine-style, asymmetric */}
      <section
        className="relative isolate overflow-hidden text-white"
        style={{ minHeight: 520 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sfc-navy-deep via-sfc-navy to-sfc-navy-darker" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(104,152,200,0.25), transparent 60%)",
          }}
        />
        <HeroParallax className="absolute inset-0 opacity-[0.05]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-sfc-navy-darker via-sfc-navy-darker/40 to-transparent" />

        <div className="sfc-container relative pb-24 pt-20 sm:pb-28 sm:pt-24">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div className="anim-fade-up max-w-3xl">
              <Image
                src="/logo.png"
                alt={t("nav.crest-alt", locale)}
                width={72}
                height={72}
                priority
                className="anim-scale-in mb-5 h-16 w-16 drop-shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
              />
              <span
                className="sfc-eyebrow sfc-eyebrow--on-dark anim-fade-up"
                style={{ ["--anim-delay" as string]: "120ms" }}
              >
                {t("hero.tickets-on-sale", locale)}
              </span>
              <h1
                className="sfc-display anim-fade-up mt-3 max-w-[18ch] text-balance text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.98] tracking-[-0.02em]"
                style={{ ["--anim-delay" as string]: "200ms" }}
              >
                {t("hero.title", locale)}
              </h1>
              <p
                className="anim-fade-up mt-5 max-w-xl text-pretty text-base leading-relaxed text-sfc-sky-light sm:text-lg"
                style={{ ["--anim-delay" as string]: "300ms" }}
              >
                {t("hero.subtitle", locale)}
              </p>
              <div
                className="anim-fade-up mt-7 flex flex-col gap-3 sm:flex-row"
                style={{ ["--anim-delay" as string]: "380ms" }}
              >
                <Link href="/tickets" className="sfc-btn sfc-btn--live press">
                  {t("hero.browse-fixtures", locale)}
                </Link>
                {next && (
                  <Link
                    href={`/tickets/${next.id}`}
                    className="sfc-btn sfc-btn--ghost-on-dark press"
                  >
                    {t("hero.next-match-prefix", locale)}{" "}
                    {localize(next.opponent, locale)}
                  </Link>
                )}
              </div>
            </div>

            {next && (
              <aside
                className="anim-slide-right relative self-end rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md sm:p-7"
                style={{ ["--anim-delay" as string]: "300ms" }}
              >
                <span className="sfc-eyebrow sfc-eyebrow--on-dark">
                  {t("hero.next-fixture", locale)}
                </span>
                <div className="sfc-display mt-3 text-2xl font-bold leading-[1.05] tracking-[-0.01em] sm:text-[28px]">
                  {t("brand.name", locale)}{" "}
                  <span className="text-sfc-sky-light">
                    {t("common.vs", locale)}
                  </span>{" "}
                  {localize(next.opponent, locale)}
                </div>
                <div className="mt-1 text-sm text-sfc-sky-light">
                  {localize(next.competition, locale)}
                </div>
                <hr className="my-4 border-white/10" />
                <dl className="space-y-2 text-sm">
                  <Row
                    label={t("common.kickoff", locale)}
                    value={formatKickoff(next.kickoff)}
                  />
                  <Row
                    label={t("common.venue", locale)}
                    value={localize(next.venue, locale)}
                  />
                  <Row
                    label={t("common.from", locale)}
                    value={`${formatMoney(next.pricePerSeat, currency)} ${t("form.from-per-seat", locale)}`}
                  />
                  <Row
                    label={t("common.availability", locale)}
                    value={
                      next.isSoldOut
                        ? t("common.sold-out", locale)
                        : t("tickets.row.seats-of", locale, {
                            remaining: next.remaining,
                            capacity: next.capacity,
                          })
                    }
                  />
                </dl>
                <Link
                  href={`/tickets/${next.id}`}
                  className="sfc-btn sfc-btn--live press mt-5 w-full"
                >
                  {t("hero.pick-a-seat", locale)} →
                </Link>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* FIXTURE STRIP — sits below the hero with breathing room */}
      <section className="relative z-10 bg-sfc-bone">
        <div className="sfc-container py-10 sm:py-14">
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-sfc-n-200 bg-white shadow-[0_12px_32px_rgba(12,22,54,0.14)] sm:grid-cols-3">
            {/* Last result */}
            <div className="border-b border-sfc-n-100 px-6 py-5 sm:border-b-0 sm:border-r">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sfc-n-500">
                {t("home.last-result", locale)}
              </div>
              <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="sfc-display text-end text-[15px] font-semibold tracking-[0.02em]">
                  {LAST_RESULT.homeOrAway === "home"
                    ? t("brand.name", locale)
                    : localize(LAST_RESULT.opponent, locale)}
                </div>
                <div className="sfc-display px-2 text-[32px] font-bold leading-none tracking-[-0.02em] text-sfc-navy">
                  {LAST_RESULT.homeOrAway === "home"
                    ? `${LAST_RESULT.scoreFor}-${LAST_RESULT.scoreAgainst}`
                    : `${LAST_RESULT.scoreAgainst}-${LAST_RESULT.scoreFor}`}
                </div>
                <div className="sfc-display text-[15px] font-semibold tracking-[0.02em]">
                  {LAST_RESULT.homeOrAway === "home"
                    ? localize(LAST_RESULT.opponent, locale)
                    : t("brand.name", locale)}
                </div>
              </div>
              <div className="mt-2 text-xs text-sfc-n-400">
                {localize(LAST_RESULT.competition, locale)} ·{" "}
                {formatNewsDate(LAST_RESULT.date, locale)}
              </div>
            </div>

            {/* Form */}
            <div className="border-b border-sfc-n-100 px-6 py-5 sm:border-b-0 sm:border-r">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sfc-n-500">
                {t("home.form-last-5", locale)}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {LEAGUE.form.map((r, i) => (
                  <span
                    key={i}
                    className={`sfc-form-chip sfc-form-chip--${r}`}
                    title={t(`form.result-${r}`, locale)}
                  >
                    {r}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-xs text-sfc-n-500">
                {LEAGUE.position}
                {t("club.position-suffix", locale)} ·{" "}
                {LEAGUE.points} {t("stats.points", locale)}
              </div>
            </div>

            {/* Next up */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sfc-n-500">
                  {t("home.next-three", locale)}
                </div>
                <Link
                  href="/tickets"
                  className="text-[11px] font-bold uppercase tracking-[0.12em] text-sfc-navy hover:underline hover:underline-offset-4"
                >
                  {t("common.see-all", locale)}
                </Link>
              </div>
              <ul className="mt-3 divide-y divide-sfc-n-100 text-[13px]">
                {upcoming.map((m) => (
                  <li
                    key={m.id}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-1.5"
                  >
                    <span className="font-mono text-[11px] text-sfc-n-500">
                      {formatKickoff(m.kickoff)}
                    </span>
                    <span className="truncate text-sfc-ink">
                      {m.isHome ? "v " : "@ "}
                      {localize(m.opponent, locale)}
                    </span>
                    <span className="font-mono text-[11px] text-sfc-n-500">
                      {m.isHome ? "H" : "A"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SEASON STATS — slim band */}
      <section className="bg-sfc-bone">
        <div className="sfc-container py-12">
          <MotionStagger
            className="grid gap-0 overflow-hidden rounded-2xl border border-sfc-n-200 bg-white sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.08}
          >
            <Stat label={t("stats.league", locale)} value={localize(LEAGUE.league, locale)} small />
            <Stat
              label={t("stats.position", locale)}
              value={`${LEAGUE.position}${t("club.position-suffix", locale)}`}
            />
            <Stat label={t("stats.points", locale)} value={LEAGUE.points.toString()} accent />
            <Stat
              label={t("stats.form", locale)}
              value={`${LEAGUE.won}W ${LEAGUE.drawn}D ${LEAGUE.lost}L`}
              small
            />
          </MotionStagger>
        </div>
      </section>

      {/* UPCOMING FIXTURES */}
      <section className="bg-white">
        <div className="sfc-container py-16">
          <div className="mb-7 flex items-end justify-between gap-6">
            <div>
              <span className="sfc-eyebrow">
                {t("nav.fixtures", locale)}
              </span>
              <h2 className="sfc-display mt-2 text-[clamp(2rem,3.4vw,2.75rem)] leading-none tracking-[-0.015em]">
                {t("section.upcoming-fixtures", locale)}
              </h2>
            </div>
            <Link
              href="/tickets"
              className="text-sm font-semibold uppercase tracking-[0.14em] text-sfc-navy hover:underline hover:underline-offset-4"
            >
              {t("common.see-all", locale)}
            </Link>
          </div>
          <MotionStagger as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {matches.slice(0, 6).map((m) => (
              <MotionItem
                as="li"
                key={m.id}
                whileHover={{ y: -3, boxShadow: "0 16px 36px -18px rgba(12,22,54,0.28)" }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="overflow-hidden rounded-2xl border border-sfc-n-200 bg-white"
              >
                <FixtureCrests
                  opponent={m.opponent}
                  isHome={m.isHome}
                  locale={locale}
                />
                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-sfc-n-500">
                    <span className="text-sfc-navy">
                      {m.isHome ? t("common.home", locale) : t("common.away", locale)}
                    </span>
                    <span>{localize(m.competition, locale)}</span>
                  </div>
                  <div className="sfc-display mt-2 text-[19px] font-bold leading-[1.15] tracking-[-0.005em]">
                    {t("brand.name", locale)} {t("common.vs", locale)}{" "}
                    {localize(m.opponent, locale)}
                  </div>
                  <div className="mt-1 text-sm text-sfc-n-600">
                    {formatKickoff(m.kickoff)}
                  </div>
                  <div className="text-sm text-sfc-n-500">
                    {localize(m.venue, locale)}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-sfc-ink">
                      {formatMoney(m.pricePerSeat, currency)}{" "}
                      {t("form.from-per-seat", locale)}
                    </span>
                    <Link
                      href={m.isSoldOut ? "/tickets" : `/tickets/${m.id}`}
                      aria-disabled={m.isSoldOut}
                      className={`text-[12px] font-bold uppercase tracking-[0.14em] ${
                        m.isSoldOut
                          ? "pointer-events-none text-sfc-n-400"
                          : "text-sfc-navy hover:underline hover:underline-offset-4"
                      }`}
                    >
                      {m.isSoldOut
                        ? t("common.sold-out", locale)
                        : t("hero.pick-a-seat", locale) + " →"}
                    </Link>
                  </div>
                </div>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* RESULTS + LEAGUE TABLE */}
      <section className="bg-white">
        <div className="sfc-container py-16">
          <div className="grid items-stretch gap-8 lg:grid-cols-[1.6fr_1fr]">
            {/* League table */}
            <div className="flex flex-col">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <span className="sfc-eyebrow">{t("home.standings", locale)}</span>
                  <h2 className="sfc-display mt-2 text-[clamp(2rem,3.4vw,2.75rem)] leading-none tracking-[-0.015em]">
                    {localize(LEAGUE.league, locale)}
                  </h2>
                </div>
                <Link
                  href="/club"
                  className="text-sm font-semibold uppercase tracking-[0.14em] text-sfc-navy hover:underline hover:underline-offset-4"
                >
                  {t("common.see-all", locale)}
                </Link>
              </div>
              <div className="overflow-hidden rounded-2xl border border-sfc-n-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-sfc-n-50 text-[11px] font-bold uppercase tracking-[0.14em] text-sfc-n-500">
                    <tr>
                      <th className="px-4 py-3 text-start">#</th>
                      <th className="py-3 text-start">{t("standings.team", locale)}</th>
                      <th className="px-2 py-3 text-end">{t("standings.played", locale)}</th>
                      <th className="px-2 py-3 text-end">{t("standings.won", locale)}</th>
                      <th className="px-2 py-3 text-end">{t("standings.drawn", locale)}</th>
                      <th className="px-2 py-3 text-end">{t("standings.lost", locale)}</th>
                      <th className="px-2 py-3 text-end">{t("standings.gd", locale)}</th>
                      <th className="px-4 py-3 text-end">{t("standings.points", locale)}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sfc-n-100">
                    {STANDINGS.map((row, i) => {
                      const isUs = row.team === "Salisbury";
                      const prev = STANDINGS[i - 1];
                      const showGap = prev && row.position > prev.position + 1;
                      return (
                        <Fragment key={row.team}>
                          {showGap && (
                            <tr className="bg-sfc-n-50/50">
                              <td colSpan={8} className="px-4 py-1.5 text-center text-[11px] tracking-[0.4em] text-sfc-n-400">
                                ⋯
                              </td>
                            </tr>
                          )}
                          <tr
                            className={
                              isUs
                                ? "bg-sfc-bone"
                                : "transition hover:bg-sfc-n-50"
                            }
                          >
                            <td className="px-4 py-3 font-mono text-[12px] text-sfc-n-400">
                              {row.position}
                            </td>
                            <td
                              className={`py-3 ${
                                isUs ? "border-l-4 border-sfc-navy ps-3 font-bold text-sfc-navy" : ""
                              }`}
                            >
                              <span className="inline-flex items-center gap-2.5">
                                <span
                                  aria-hidden
                                  className="h-5 w-5 shrink-0 rounded-full bg-sfc-n-200"
                                />
                                {localize(row.team, locale)}
                              </span>
                            </td>
                            <td className="px-2 py-3 text-end font-mono text-[12.5px] text-sfc-n-600">{row.played}</td>
                            <td className="px-2 py-3 text-end font-mono text-[12.5px] text-sfc-n-600">{row.won}</td>
                            <td className="px-2 py-3 text-end font-mono text-[12.5px] text-sfc-n-600">{row.drawn}</td>
                            <td className="px-2 py-3 text-end font-mono text-[12.5px] text-sfc-n-600">{row.lost}</td>
                            <td className={`px-2 py-3 text-end font-mono text-[12.5px] ${
                              row.goalsFor - row.goalsAgainst < 0 ? "text-sfc-loss" : "text-sfc-pitch"
                            }`}>
                              {row.goalsFor - row.goalsAgainst > 0 ? "+" : ""}
                              {row.goalsFor - row.goalsAgainst}
                            </td>
                            <td className="px-4 py-3 text-end text-[14px] font-bold text-sfc-ink">
                              {row.points}
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent results */}
            <div className="flex flex-col">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <span className="sfc-eyebrow">{t("home.results", locale)}</span>
                  <h2 className="sfc-display mt-2 text-[clamp(2rem,3.4vw,2.75rem)] leading-none tracking-[-0.015em]">
                    {t("home.recent-results", locale)}
                  </h2>
                </div>
              </div>
              <ul className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-sfc-n-200 bg-white divide-y divide-sfc-n-100">
                {RESULTS.map((r, i) => {
                  const result = r.scoreFor > r.scoreAgainst ? "W" : r.scoreFor < r.scoreAgainst ? "L" : "D";
                  return (
                    <li key={i} className="flex flex-1 items-center gap-3 px-5 py-4">
                      <span className={`sfc-form-chip sfc-form-chip--${result} h-9 w-9 text-[15px]`}>
                        {result}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[12.5px] font-bold uppercase tracking-[0.06em] text-sfc-n-500">
                            {r.homeOrAway === "home" ? "v" : "@"}
                          </span>
                          <span className="truncate text-[14px] font-semibold text-sfc-ink">
                            {localize(r.opponent, locale)}
                          </span>
                        </div>
                        <div className="mt-0.5 text-[11.5px] text-sfc-n-500">
                          {formatNewsDate(r.date, locale)} · {localize(r.competition, locale)}
                        </div>
                      </div>
                      <div className="font-mono text-[18px] font-bold leading-none tracking-tight text-sfc-ink">
                        {r.scoreFor}
                        <span className="px-1 text-sfc-n-300">–</span>
                        {r.scoreAgainst}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 text-end">
                <Link
                  href="/club"
                  className="text-sm font-semibold uppercase tracking-[0.14em] text-sfc-navy hover:underline hover:underline-offset-4"
                >
                  {t("home.full-archive", locale)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST NEWS — magazine layout: 1 lead + 3 small */}
      <section className="bg-sfc-bone">
        <div className="sfc-container py-16">
          <div className="mb-7 flex items-end justify-between gap-6">
            <div>
              <span className="sfc-eyebrow">{t("nav.news", locale)}</span>
              <h2 className="sfc-display mt-2 text-[clamp(2rem,3.4vw,2.75rem)] leading-none tracking-[-0.015em]">
                {t("section.latest-from-club", locale)}
              </h2>
            </div>
            <Link
              href="/news"
              className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.14em] text-sfc-navy hover:underline hover:underline-offset-4"
            >
              {t("common.all-news", locale)}
            </Link>
          </div>

          <MotionStagger className="grid gap-7 lg:grid-cols-[1.6fr_1fr]" stagger={0.1}>
            {NEWS[0] && <FeatureCard article={NEWS[0]} locale={locale} />}
            <MotionStagger className="flex flex-col" stagger={0.06}>
              {NEWS.slice(1, 4).map((n) => (
                <SmallRow key={n.slug} article={n} locale={locale} />
              ))}
            </MotionStagger>
          </MotionStagger>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-sfc-sky-light/80">{label}</dt>
      <dd className="text-end font-medium">{value}</dd>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <MotionItem
      className={`px-6 py-6 sm:border-l sm:border-sfc-n-200 sm:first:border-l-0 ${
        accent ? "bg-sfc-bone" : ""
      }`}
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sfc-n-500">
        {label}
      </div>
      <div
        className={`sfc-display mt-2 font-bold leading-none tracking-[-0.01em] ${
          small ? "text-base" : "text-2xl sm:text-3xl"
        } ${accent ? "text-sfc-navy" : "text-sfc-ink"}`}
      >
        {value}
      </div>
    </MotionItem>
  );
}

function teamInitials(name: string): string {
  // Strip accents/punct, take initials, trim words like "Town" / "United" /
  // "Borough" / "City" / "Football Club" — keeps the crest readable.
  const SKIP = new Set(["TOWN", "UNITED", "CITY", "BOROUGH", "FC"]);
  const words = name
    .replace(/[^A-Za-z\s]/g, "")
    .split(/\s+/)
    .map((w) => w.toUpperCase())
    .filter((w) => w && !SKIP.has(w));
  if (words.length === 0) return name.slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2);
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("");
}

function FixtureCrests({
  opponent,
  isHome,
  locale,
}: {
  opponent: string;
  isHome: boolean;
  locale: Locale;
}) {
  const initials = teamInitials(opponent);
  const home = (
    <div className="grid h-14 w-14 place-items-center rounded-full bg-white p-1 ring-2 ring-white/30 sm:h-16 sm:w-16">
      <Image
        src="/logo.png"
        alt={t("brand.name", locale)}
        width={56}
        height={56}
        className="h-full w-full object-contain"
      />
    </div>
  );
  const away = (
    <div
      className="grid h-14 w-14 place-items-center rounded-full bg-sfc-bone text-sfc-navy ring-2 ring-white/20 sm:h-16 sm:w-16"
      title={opponent}
    >
      <span className="sfc-display text-base font-bold leading-none tracking-tight sm:text-lg">
        {initials}
      </span>
    </div>
  );

  return (
    <div className="relative aspect-[16/7] overflow-hidden bg-gradient-to-br from-sfc-navy via-sfc-navy-deep to-sfc-navy-darker">
      {/* faint stadium netting */}
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 18px)",
        }}
      />
      {/* radial glow behind crests */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(104,152,200,0.35), transparent 60%)",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center gap-3 sm:gap-5">
        {isHome ? home : away}
        <span className="sfc-display flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.32em] text-white/70 sm:text-[13px]">
          <span aria-hidden className="h-px w-4 bg-white/30" />
          {t("common.vs", locale)}
          <span aria-hidden className="h-px w-4 bg-white/30" />
        </span>
        {isHome ? away : home}
      </div>

      <span className="absolute inset-x-0 bottom-2 text-center text-[9px] font-bold uppercase tracking-[0.4em] text-white/50">
        {isHome ? "Ray Mac" : "Away"}
      </span>
    </div>
  );
}

type Article = (typeof import("@/lib/club"))["NEWS"][number];

function FeatureCard({ article, locale }: { article: Article; locale: Locale }) {
  return (
    <MotionItem
      whileHover={{ y: -3, boxShadow: "0 16px 36px -16px rgba(12,22,54,0.22)" }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="overflow-hidden rounded-2xl border border-sfc-n-200 bg-white"
    >
      <Link
        href={`/news/${article.slug}`}
        className="group flex flex-col"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <NewsPoster article={article} locale={locale} size="feature" />
        </div>
        <div className="px-7 py-7 sm:px-8 sm:pb-8 sm:pt-7">
          <span className="inline-block rounded-full bg-sfc-n-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-sfc-navy">
            {localize(article.category, locale)}
          </span>
          <h3 className="sfc-display mt-3 text-balance text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.05] tracking-[-0.01em] text-sfc-ink transition group-hover:text-sfc-navy">
            {article.title[locale]}
          </h3>
          <p className="mt-3 max-w-[56ch] text-base leading-[1.55] text-sfc-n-600">
            {article.summary[locale]}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-sfc-n-400">
              {formatNewsDate(article.date, locale)}
            </span>
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-sfc-navy">
              {t("common.read-more", locale)}
            </span>
          </div>
        </div>
      </Link>
    </MotionItem>
  );
}

function SmallRow({
  article,
  locale,
}: {
  article: Article;
  locale: Locale;
}) {
  return (
    <MotionItem
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="border-b border-sfc-n-200 last:border-b-0"
    >
      <Link
        href={`/news/${article.slug}`}
        className="grid grid-cols-[96px_1fr] items-stretch gap-4 py-5 first:pt-0 hover:bg-white"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-md">
          <NewsPoster article={article} locale={locale} size="thumb" showTitle={false} />
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-sfc-n-400">
            {localize(article.category, locale)} · {formatNewsDate(article.date, locale)}
          </span>
          <span className="sfc-display text-[15px] font-bold leading-[1.2] tracking-[-0.005em] text-sfc-ink">
            {article.title[locale]}
          </span>
        </div>
      </Link>
    </MotionItem>
  );
}

function formatNewsDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale === "ar" ? "ar" : undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
