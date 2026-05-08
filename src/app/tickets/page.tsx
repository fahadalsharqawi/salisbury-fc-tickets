import Link from "next/link";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";
import { getCurrency } from "@/lib/currency-server";
import { listMatches } from "@/lib/db";
import { formatKickoff, formatMoney, type Currency } from "@/lib/format";
import { localize, t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import type { MatchWithAvailability } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = { competition?: string; venue?: string };

function chipHref(current: SearchParams, patch: Partial<SearchParams>): string {
  const params = new URLSearchParams();
  const merged: SearchParams = { ...current, ...patch };
  for (const [k, v] of Object.entries(merged)) {
    if (v) params.set(k, v as string);
  }
  const qs = params.toString();
  return qs ? `/tickets?${qs}` : "/tickets";
}

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { competition, venue } = sp;
  const currency = await getCurrency();
  const locale = await getLocale();
  const all = await listMatches({ upcomingOnly: true });

  const competitions = Array.from(new Set(all.map((m) => m.competition))).sort();
  const venueFilter = venue === "home" || venue === "away" ? venue : undefined;

  const filtered = all.filter((m) => {
    if (competition && m.competition !== competition) return false;
    if (venueFilter === "home" && !m.isHome) return false;
    if (venueFilter === "away" && m.isHome) return false;
    return true;
  });

  const isFiltered = Boolean(competition || venueFilter);

  return (
    <>
      {/* Page strip */}
      <div className="bg-sfc-navy text-white">
        <div className="sfc-container py-6">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">{t("nav.fixtures", locale)}</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold sm:text-4xl">
            {t("tickets.title", locale)}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-sfc-sky-light">
            {t("tickets.subtitle", locale)}
          </p>
        </div>
      </div>

      <div className="sfc-container py-10">
        <div className="anim-fade-up mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-sfc-n-200 bg-white p-3">
          <span className="sfc-eyebrow px-1">{t("tickets.filter.venue", locale)}</span>
          <Chip href={chipHref(sp, { venue: undefined })} active={!venueFilter}>
            {t("common.all", locale)}
          </Chip>
          <Chip href={chipHref(sp, { venue: "home" })} active={venueFilter === "home"}>
            {t("common.home", locale)}
          </Chip>
          <Chip href={chipHref(sp, { venue: "away" })} active={venueFilter === "away"}>
            {t("common.away", locale)}
          </Chip>
          <span className="mx-1 h-5 w-px bg-sfc-n-200" aria-hidden />
          <span className="sfc-eyebrow px-1">{t("tickets.filter.competition", locale)}</span>
          <Chip href={chipHref(sp, { competition: undefined })} active={!competition}>
            {t("common.all", locale)}
          </Chip>
          {competitions.map((c) => (
            <Chip
              key={c}
              href={chipHref(sp, { competition: c })}
              active={competition === c}
            >
              {shortCompetition(c, locale)}
            </Chip>
          ))}
          {isFiltered && (
            <Link
              href="/tickets"
              className="sfc-display ms-auto text-[12px] font-semibold uppercase tracking-[0.14em] text-sfc-n-500 hover:text-sfc-navy"
            >
              {t("common.reset", locale)}
            </Link>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="anim-fade-up rounded-2xl border border-sfc-n-200 bg-white p-10 text-center text-sfc-n-500">
            {t("tickets.empty", locale)}
          </div>
        ) : (
          <MotionStagger as="ul" className="space-y-3" stagger={0.05}>
            {filtered.map((m) => (
              <FixtureRow key={m.id} match={m} currency={currency} locale={locale} />
            ))}
          </MotionStagger>
        )}
      </div>
    </>
  );
}

function FixtureRow({
  match,
  currency,
  locale,
}: {
  match: MatchWithAvailability;
  currency: Currency;
  locale: Locale;
}) {
  return (
    <MotionItem
      as="li"
      whileHover={{ y: -2, boxShadow: "0 12px 32px -16px rgba(12,22,54,0.22)" }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="rounded-2xl border border-sfc-n-200 bg-white p-5"
    >
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
        <div className="min-w-[16rem] flex-1">
          <div className="sfc-eyebrow flex items-center gap-2">
            <span
              className={
                match.isHome
                  ? "bg-sfc-navy px-2 py-0.5 text-white"
                  : "border border-sfc-n-300 px-2 py-0.5 text-sfc-n-600"
              }
            >
              {match.isHome ? t("common.home", locale) : t("common.away", locale)}
            </span>
            <span className="text-sfc-n-500">
              {localize(match.competition, locale)}
            </span>
          </div>
          <div className="sfc-display mt-2 text-xl font-bold leading-[1.15] sm:text-2xl">
            {t("brand.name", locale)}{" "}
            <span className="text-sfc-n-400">{t("common.vs", locale)}</span>{" "}
            {localize(match.opponent, locale)}
          </div>
          <div className="mt-1 text-sm text-sfc-n-600">
            {formatKickoff(match.kickoff)}
          </div>
          <div className="text-sm text-sfc-n-500">{localize(match.venue, locale)}</div>
          {match.notes && (
            <div className="mt-2 text-xs italic text-sfc-n-500">
              {localize(match.notes, locale)}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`sfc-display rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              match.isSoldOut
                ? "bg-sfc-n-200 text-sfc-n-600"
                : match.remaining < 30
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {match.isSoldOut
              ? t("common.sold-out", locale)
              : match.remaining < 30
                ? t("tickets.row.only-left", locale, { n: match.remaining })
                : t("tickets.row.seats-of", locale, {
                    remaining: match.remaining,
                    capacity: match.capacity,
                  })}
          </span>
          <div className="text-sm font-semibold text-sfc-ink">
            {formatMoney(match.pricePerSeat, currency)} {t("form.from-per-seat", locale)}
          </div>
          {match.isSoldOut ? (
            <span className="sfc-display bg-sfc-n-200 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-sfc-n-500">
              {t("common.sold-out", locale)}
            </span>
          ) : (
            <Link
              href={`/tickets/${match.id}`}
              className="sfc-display press inline-flex items-center justify-center bg-sfc-navy px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-sfc-navy-deep"
            >
              {t("tickets.row.book", locale)}
            </Link>
          )}
        </div>
      </div>
    </MotionItem>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-pressed={active}
      className={`sfc-display px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
        active
          ? "bg-sfc-navy text-white"
          : "border border-sfc-n-200 bg-white text-sfc-n-600 hover:border-sfc-navy hover:text-sfc-navy"
      }`}
    >
      {children}
    </Link>
  );
}

function shortCompetition(name: string, locale: Locale): string {
  if (locale === "ar") {
    if (name.includes("Premier") || name.includes("National")) return "الدوري";
    if (name.includes("FA Trophy")) return "كأس الاتحاد";
    if (name.includes("FA Cup")) return "كأس FA";
    return localize(name, locale);
  }
  if (name.includes("Premier") || name.includes("National")) return "League";
  if (name.includes("FA Trophy")) return "FA Trophy";
  if (name.includes("FA Cup")) return "FA Cup";
  return name;
}
