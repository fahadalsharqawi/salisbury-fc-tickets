import Link from "next/link";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";
import PersonCard from "@/components/PersonCard";
import { LEAGUE, NEWS, SQUAD, STADIUM, STAFF, type Position } from "@/lib/club";
import { localize, t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

const POSITION_ORDER: Position[] = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

export default async function ClubPage() {
  const locale = await getLocale();

  const byPosition: Record<Position, typeof SQUAD> = {
    Goalkeeper: [],
    Defender: [],
    Midfielder: [],
    Forward: [],
  };
  for (const player of SQUAD) {
    byPosition[player.position].push(player);
  }

  const winRate = ((LEAGUE.won / LEAGUE.played) * 100).toFixed(0);
  const goalDiff = LEAGUE.goalsFor - LEAGUE.goalsAgainst;

  return (
    <>
      {/* Page strip */}
      <div className="sfc-band">
        <div className="sfc-container py-6">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">{t("brand.name", locale)}</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold sm:text-4xl">
            {t("club.title", locale)}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-sfc-sky-light">
            {t("club.subtitle", locale, { league: localize(LEAGUE.league, locale) })}
          </p>
        </div>
      </div>

      <div className="sfc-container py-10">
        <section className="grid grid-cols-2 overflow-hidden rounded-2xl border border-sfc-n-200 bg-white sm:grid-cols-4">
          <Stat label={t("stats.league", locale)} value={localize(LEAGUE.league, locale)} small />
          <Stat
            label={t("stats.position", locale)}
            value={`${LEAGUE.position}${t("club.position-suffix", locale)}`}
          />
          <Stat
            label={t("stats.points", locale)}
            value={LEAGUE.points.toString()}
            accent
          />
          <Stat
            label={t("stats.form", locale)}
            value={`${LEAGUE.won}W ${LEAGUE.drawn}D ${LEAGUE.lost}L`}
            small
          />
        </section>

        <section className="anim-fade-up mt-6 grid gap-6 rounded-2xl border border-sfc-n-200 bg-white p-6 sm:grid-cols-3">
          <div>
            <Label>{t("club.win-rate", locale)}</Label>
            <div className="sfc-display mt-1 text-3xl font-bold">{winRate}%</div>
            <div className="mt-1 text-xs text-sfc-n-500">
              {t("club.win-rate-from", locale, { n: LEAGUE.played })}
            </div>
          </div>
          <div>
            <Label>{t("club.goal-diff", locale)}</Label>
            <div
              className={`sfc-display mt-1 text-3xl font-bold ${
                goalDiff < 0 ? "text-sfc-loss" : "text-sfc-pitch"
              }`}
            >
              {goalDiff > 0 ? "+" : ""}
              {goalDiff}
            </div>
            <div className="mt-1 text-xs text-sfc-n-500">
              {t("club.goal-diff-line", locale, {
                f: LEAGUE.goalsFor,
                a: LEAGUE.goalsAgainst,
              })}
            </div>
          </div>
          <div>
            <Label>{t("club.home-ground", locale)}</Label>
            <Link
              href="/club/ray-mac-stadium"
              className="group block"
            >
              <div className="sfc-display mt-1 text-base font-bold transition group-hover:text-sfc-navy">
                {localize(STADIUM.name, locale)}
              </div>
              <div className="mt-1 text-xs text-sfc-n-500">
                {localize(STADIUM.address, locale)}
              </div>
              <div className="sfc-display mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sfc-navy opacity-0 transition group-hover:opacity-100">
                {t("nav.ray-mac", locale)} →
              </div>
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="sfc-display anim-fade-up mb-4 text-2xl font-bold">
            {t("club.squad-heading", locale)}
          </h2>
          {POSITION_ORDER.map((pos) => (
            <div key={pos} className="anim-fade-up mt-6">
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="sfc-display text-sm font-bold uppercase tracking-[0.1em] text-sfc-n-500">
                  {t(`position.${pos}`, locale)}
                </h3>
                <span className="text-xs text-sfc-n-400">
                  {t(
                    byPosition[pos].length === 1
                      ? "club.players-1"
                      : "club.players-n",
                    locale,
                    { n: byPosition[pos].length },
                  )}
                </span>
              </div>
              <MotionStagger as="ul" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" stagger={0.04}>
                {byPosition[pos].map((p) => (
                  <MotionItem as="li" key={p.slug}>
                    <PersonCard
                      href={`/club/squad/${p.slug}`}
                      photoUrl={p.photoUrl}
                      name={p.name}
                      meta={p.number ? `#${p.number}` : t(`position.${p.position}`, locale)}
                    />
                  </MotionItem>
                ))}
              </MotionStagger>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="sfc-display anim-fade-up mb-4 text-2xl font-bold">
            {t("club.staff-heading", locale)}
          </h2>
          <MotionStagger as="ul" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" stagger={0.04}>
            {STAFF.map((s) => (
              <MotionItem as="li" key={s.slug}>
                <PersonCard
                  href={`/club/staff/${s.slug}`}
                  photoUrl={s.photoUrl}
                  name={s.name}
                  meta={localize(s.role, locale)}
                />
              </MotionItem>
            ))}
          </MotionStagger>
        </section>

        <section className="mt-12">
          <div className="anim-fade-up flex items-baseline justify-between">
            <h2 className="sfc-display text-2xl font-bold">
              {t("section.latest-from-club", locale)}
            </h2>
            <Link
              href="/news"
              className="sfc-display text-sm font-semibold uppercase tracking-[0.14em] text-sfc-navy hover:underline hover:underline-offset-4"
            >
              {t("common.all-news", locale)}
            </Link>
          </div>
          <ul className="stagger mt-4 grid gap-3">
            {NEWS.slice(0, 5).map((n) => (
              <li
                key={n.slug}
                className="anim-fade-up lift rounded-xl border border-sfc-n-200 bg-white px-5 py-4"
              >
                <Link
                  href={`/news/${n.slug}`}
                  className="flex flex-wrap items-baseline justify-between gap-2"
                >
                  <span className="sfc-display font-bold text-sfc-ink">
                    {n.title[locale]}
                  </span>
                  <span className="text-xs text-sfc-n-400">
                    {formatDate(n.date, locale)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="anim-fade-up mt-12 flex flex-wrap gap-3">
          <Link href="/tickets" className="sfc-btn sfc-btn--primary press">
            {t("club.buy-tickets", locale)}
          </Link>
          <Link href="/news" className="sfc-btn sfc-btn--ghost press">
            {t("club.read-news", locale)}
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
  small,
}: {
  label: string;
  value: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`anim-fade-up border-t border-sfc-n-200 px-5 py-5 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0 ${
        accent ? "bg-sfc-bone" : ""
      }`}
    >
      <Label>{label}</Label>
      <div
        className={`sfc-display mt-1 font-bold leading-none ${
          small ? "text-base" : "text-2xl"
        } ${accent ? "text-sfc-navy" : "text-sfc-ink"}`}
      >
        {value}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="sfc-eyebrow text-sfc-n-500">{children}</div>
  );
}

function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale === "ar" ? "ar" : undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
