import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrency } from "@/lib/currency-server";
import { getMatch } from "@/lib/db";
import { formatLongKickoff, formatMoney } from "@/lib/format";
import { localize, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
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
  const currency = await getCurrency();
  const locale = await getLocale();
  const match = await getMatch(matchId);
  if (!match) notFound();

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  const prefill = claims
    ? {
        name:
          ((claims.user_metadata as Record<string, unknown> | undefined)?.name as
            | string
            | undefined) ?? "",
        email: (claims.email as string | undefined) ?? "",
      }
    : undefined;

  return (
    <>
      {/* Page strip — compact on mobile so the seat map gets more vertical room */}
      <div className="bg-sfc-navy text-white">
        <div className="sfc-container py-4 sm:py-6">
          <Link
            href="/tickets"
            className="sfc-display text-[11px] font-semibold uppercase tracking-[0.14em] text-sfc-sky-light hover:text-white sm:text-[12px]"
          >
            {t("form.back-to-fixtures", locale)}
          </Link>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-2 sm:mt-3 sm:gap-3">
            <div className="min-w-0 flex-1">
              <div className="sfc-eyebrow sfc-eyebrow--on-dark flex items-center gap-2">
                <span
                  className={
                    match.isHome
                      ? "bg-white px-2 py-0.5 text-sfc-navy"
                      : "border border-white/40 px-2 py-0.5 text-white"
                  }
                >
                  {match.isHome ? t("common.home", locale) : t("common.away", locale)}
                </span>
                <span className="truncate text-sfc-sky-light">
                  {localize(match.competition, locale)}
                </span>
              </div>
              <h1 className="sfc-display mt-1.5 text-2xl font-bold leading-[1.05] sm:mt-2 sm:text-4xl">
                {t("brand.name", locale)}{" "}
                <span className="text-sfc-sky-light">{t("common.vs", locale)}</span>{" "}
                {localize(match.opponent, locale)}
              </h1>
              <p className="mt-1 text-xs text-sfc-sky-light sm:text-sm">
                {formatLongKickoff(match.kickoff)}
              </p>
              <p className="text-xs text-sfc-sky-light/80 sm:text-sm">
                {localize(match.venue, locale)}
              </p>
            </div>
            <div className="text-end">
              <div className="sfc-eyebrow sfc-eyebrow--on-dark text-[10px] sm:text-xs">
                {t("common.from", locale)}
              </div>
              <div className="sfc-display mt-0.5 text-2xl font-bold leading-none sm:mt-1 sm:text-3xl">
                {formatMoney(match.pricePerSeat, currency)}
                <span className="ms-1 text-xs font-normal text-sfc-sky-light sm:text-base">
                  {t("form.from-per-seat", locale)}
                </span>
              </div>
              <div className="mt-1 hidden text-xs text-sfc-sky-light/80 sm:block">
                {t("form.main-stand-extra", locale, {
                  amount: formatMoney(MAIN_STAND_SURCHARGE, currency),
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sfc-container py-10">
        {match.notes && (
          <div className="mb-6 rounded-xl border border-sfc-n-200 bg-sfc-bone px-4 py-3 text-sm text-sfc-n-700">
            {localize(match.notes, locale)}
          </div>
        )}

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <BookingForm
          match={match}
          error={error}
          currency={currency}
          locale={locale}
          prefill={prefill}
        />
      </div>
    </>
  );
}
