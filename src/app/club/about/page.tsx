import Link from "next/link";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";
import { LEAGUE, STADIUM } from "@/lib/club";
import { localize, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const metadata = {
  title: "The Club — Salisbury FC",
  description:
    "About Salisbury FC — our home at the Raymond McEnhill Stadium, league, ownership, partners and supporter initiatives.",
};

const HONOURS = [
  { year: "2024–25", title: "Promoted to National League South", note: "Southern League Premier South play-off champions" },
  { year: "2018–19", title: "Wessex League Premier", note: "Champions, with 100+ points" },
  { year: "2015", title: "Salisbury FC re-formed", note: "Phoenix club takes the field at the Ray Mac" },
] as const;

const INITIATIVES = [
  {
    title: "Armed Forces Covenant",
    body:
      "Signatory to the UK Armed Forces Covenant — committed to ensuring serving personnel, veterans and their families are treated fairly at the Whites.",
  },
  {
    title: "Spectators' Code of Conduct",
    body:
      "Every supporter is asked to follow the FA's spectator Code of Conduct so the Ray Mac stays welcoming for everyone.",
  },
  {
    title: "easyfundraising",
    body:
      "Sign up via easyfundraising and a slice of every online purchase you make goes to the club at no extra cost to you.",
  },
] as const;

const FACTS = [
  { label: "Founded", value: "1947" },
  { label: "Re-formed", value: "2015" },
  { label: "Nickname", value: "The Whites" },
  { label: "Colours", value: "White & black" },
] as const;

export default async function ClubAboutPage() {
  const locale = await getLocale();

  return (
    <>
      {/* Page strip */}
      <div className="sfc-band">
        <div className="sfc-container py-8 sm:py-12">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">{t("brand.name", locale)}</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold leading-[1.05] sm:text-5xl">
            The Club
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            {t("brand.name", locale)} is the home of football in Salisbury — based at the Raymond
            McEnhill Stadium and currently competing in {localize(LEAGUE.league, locale)}.
          </p>
        </div>
      </div>

      <div className="sfc-container py-10 sm:py-14">
        {/* Quick facts */}
        <MotionStagger
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          stagger={0.06}
        >
          {FACTS.map((f) => (
            <MotionItem
              key={f.label}
              variant="scaleIn"
              className="rounded-2xl border border-sfc-n-200 bg-white p-5"
            >
              <div className="sfc-eyebrow text-sfc-n-500">{f.label}</div>
              <div className="sfc-display mt-1 text-xl font-bold text-sfc-navy sm:text-2xl">
                {f.value}
              </div>
            </MotionItem>
          ))}
        </MotionStagger>

        {/* About the club + Stadium card */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <article className="anim-fade-up rounded-2xl border border-sfc-n-200 bg-white p-6 sm:p-8">
            <h2 className="sfc-display text-2xl font-bold">About the Whites</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-sfc-n-700">
              <p>
                Salisbury have been the city&apos;s senior football club since
                1947, originally as Salisbury City. The club moved to a
                purpose-built ground at Old Sarum in 1997, named after the
                long-serving chairman Raymond McEnhill — the &ldquo;Ray
                Mac&rdquo; to everyone who follows the team.
              </p>
              <p>
                After the original club&apos;s departure from senior football,
                supporters re-formed the side as Salisbury FC in 2015 and
                re-started in the Wessex League. A decade of promotions later,
                the Whites are back at National League level.
              </p>
              <p>
                Home colours are white shirts with black trim, and the club is
                run as Salisbury FC Ltd (registered in England, no. 09342954),
                with Proleague Ltd as the significant shareholder.
              </p>
            </div>
          </article>

          <aside className="anim-fade-up rounded-2xl border border-sfc-n-200 bg-white p-6 sm:p-8">
            <h2 className="sfc-display text-xl font-bold">Home ground</h2>
            <p className="mt-3 text-sm leading-relaxed text-sfc-n-700">
              {localize(STADIUM.name, locale)}<br />
              {localize(STADIUM.address, locale)}
            </p>
            <Link
              href="/club/ray-mac-stadium"
              className="sfc-btn sfc-btn--primary press mt-5 inline-flex"
            >
              About the Ray Mac →
            </Link>

            <hr className="my-6 border-sfc-n-200" />

            <h3 className="sfc-display text-base font-bold">Hospitality</h3>
            <p className="mt-2 text-sm leading-relaxed text-sfc-n-700">
              Board-room hospitality and private VIP boxes for matchday at the
              Ray Mac.
            </p>
            <Link
              href="/club/hospitality"
              className="sfc-btn sfc-btn--ghost press mt-3 inline-flex"
            >
              Hospitality packages →
            </Link>
          </aside>
        </section>

        {/* Honours */}
        <section className="mt-12">
          <h2 className="sfc-display anim-fade-up text-2xl font-bold">
            Recent honours
          </h2>
          <MotionStagger
            as="ul"
            className="mt-5 grid gap-3 sm:grid-cols-3"
            stagger={0.07}
          >
            {HONOURS.map((h) => (
              <MotionItem
                as="li"
                key={h.year}
                whileHover={{
                  y: -2,
                  boxShadow: "0 12px 28px -14px rgba(12,22,54,0.22)",
                }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="rounded-2xl border border-sfc-n-200 bg-white p-5"
              >
                <div className="sfc-display text-2xl font-bold text-sfc-navy">
                  {h.year}
                </div>
                <div className="sfc-display mt-1 text-[15px] font-bold leading-tight">
                  {h.title}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-sfc-n-700">
                  {h.note}
                </p>
              </MotionItem>
            ))}
          </MotionStagger>
        </section>

        {/* Supporter initiatives */}
        <section className="mt-12">
          <h2 className="sfc-display anim-fade-up text-2xl font-bold">
            Supporter initiatives
          </h2>
          <MotionStagger
            className="mt-5 grid gap-3 sm:grid-cols-3"
            stagger={0.07}
          >
            {INITIATIVES.map((i) => (
              <MotionItem
                key={i.title}
                className="rounded-2xl border border-sfc-n-200 bg-white p-5"
              >
                <h3 className="sfc-display text-[15px] font-bold text-sfc-ink">
                  {i.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-sfc-n-700">
                  {i.body}
                </p>
              </MotionItem>
            ))}
          </MotionStagger>
        </section>

        {/* CTAs */}
        <div className="anim-fade-up mt-12 flex flex-wrap gap-3">
          <Link href="/tickets" className="sfc-btn sfc-btn--primary press">
            {t("club.buy-tickets", locale)}
          </Link>
          <Link href="/club" className="sfc-btn sfc-btn--ghost press">
            Squad &amp; staff
          </Link>
          <Link href="/news" className="sfc-btn sfc-btn--ghost press">
            {t("club.read-news", locale)}
          </Link>
        </div>
      </div>
    </>
  );
}
