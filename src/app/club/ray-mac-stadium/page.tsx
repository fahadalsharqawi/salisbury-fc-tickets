import Link from "next/link";
import NumberCounter from "@/components/anim/NumberCounter";
import TextScroll from "@/components/anim/TextScroll";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";
import { STADIUM } from "@/lib/club";
import { localize, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const metadata = {
  title: "Raymond McEnhill Stadium — Salisbury FC",
  description:
    "The Ray Mac, home of Salisbury FC since 1997 — Partridge Way, Old Sarum, Salisbury, SP4 6PU. Capacity 4,000 (2,247 covered).",
};

const MAP_QUERY =
  "Salisbury FC, Partridge Way, Old Sarum, near Salisbury, SP4 6PU";

const STATS: ReadonlyArray<{
  label: string;
  numericTo?: number;
  display: string;
  note: string;
}> = [
  { label: "Capacity", numericTo: 4000, display: "4,000", note: "5,000 technical max" },
  { label: "Covered", numericTo: 2247, display: "2,247", note: "all-seater Main Stand" },
  { label: "Opened", numericTo: 1997, display: "1997", note: "purpose-built ground" },
  { label: "Grade", display: "B", note: "FA standard" },
];

const NOTABLE_MATCHES = [
  {
    year: 2006,
    competition: "FA Cup, Second Round",
    opponent: "Nottingham Forest",
    attendance: "3,100",
    note: "First top-tier visitors at the Ray Mac.",
  },
  {
    year: 2013,
    competition: "Conference South Play-off Final",
    opponent: "Dover Athletic",
    attendance: "3,408",
    note: "Salisbury win 3–2 to clinch promotion.",
  },
  {
    year: 2016,
    competition: "FA Vase Semi-Final",
    opponent: "Hereford",
    attendance: "3,450",
    note: "Stadium attendance record.",
  },
] as const;

export default async function RayMacStadiumPage() {
  const locale = await getLocale();

  return (
    <>
      {/* Page strip */}
      <div className="sfc-band">
        <div className="sfc-container py-8 sm:py-12">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">The Whites</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold leading-[1.05] sm:text-5xl">
            {localize(STADIUM.name, locale)}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            Home of Salisbury FC since 1997 — purpose-built at Old Sarum and
            named after Raymond McEnhill, the club&rsquo;s chairman at the time
            of relocation.
          </p>
        </div>
      </div>

      <div className="sfc-container py-10">
        {/* Stats */}
        <MotionStagger
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          stagger={0.06}
        >
          {STATS.map((s) => (
            <MotionItem
              key={s.label}
              variant="scaleIn"
              className="rounded-2xl border border-sfc-n-200 bg-white p-5"
            >
              <div className="sfc-eyebrow text-sfc-n-500">{s.label}</div>
              <div className="sfc-display mt-1 text-3xl font-bold leading-none text-sfc-navy">
                {s.numericTo != null ? (
                  <NumberCounter to={s.numericTo} duration={1.6} />
                ) : (
                  s.display
                )}
              </div>
              <div className="mt-1 text-xs text-sfc-n-500">{s.note}</div>
            </MotionItem>
          ))}
        </MotionStagger>

        {/* About */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <article className="anim-fade-up rounded-2xl border border-sfc-n-200 bg-white p-6 sm:p-8">
            <h2 className="sfc-display text-2xl font-bold">About the Ray Mac</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-sfc-n-700">
              <p>
                The Raymond McEnhill Stadium — the &ldquo;Ray Mac&rdquo; to
                everyone who follows the Whites — was built when Salisbury
                relocated to Old Sarum in 1997. The all-seater Main Stand on
                the west side of the pitch sits 2,247 supporters under cover;
                the three terraces around it bring the capacity to 4,000, with
                a technical maximum of 5,000 for big cup nights.
              </p>
              <p>
                The ground is graded &lsquo;B&rsquo; under FA standards. Floodlit,
                with a flat surface and good drainage, it has hosted nearly
                three decades of league football, FA Cup runs and
                Conference-level promotion battles.
              </p>
              <p>
                Matchday parking is on-site at Partridge Way, with overflow on
                the surrounding industrial estate. The supporters&rsquo; bar
                opens before kick-off and stays open at full-time. For
                board-room hospitality and private boxes, see our{" "}
                <Link
                  href="/club/hospitality"
                  className="font-semibold text-sfc-navy hover:underline hover:underline-offset-4"
                >
                  Hospitality
                </Link>
                {" "}page.
              </p>
            </div>
          </article>

          {/* Address card */}
          <aside className="anim-fade-up rounded-2xl border border-sfc-n-200 bg-white p-6 sm:p-8">
            <h2 className="sfc-display text-xl font-bold">Find us</h2>
            <p className="mt-3 text-sm leading-relaxed text-sfc-n-700">
              {localize(STADIUM.address, locale)}
            </p>
            <a
              href={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}`}
              target="_blank"
              rel="noreferrer noopener"
              className="sfc-btn sfc-btn--primary press mt-5 inline-flex"
            >
              {t("contact.directions", locale)} →
            </a>

            <hr className="my-6 border-sfc-n-200" />

            <div className="sfc-eyebrow text-sfc-n-500">Postcode</div>
            <div
              className="sfc-display mt-1 text-lg font-bold text-sfc-navy"
              dir="ltr"
            >
              SP4 6PU
            </div>

            <div className="mt-4 sfc-eyebrow text-sfc-n-500">Built</div>
            <div className="sfc-display mt-1 text-lg font-bold text-sfc-navy">
              1997
            </div>
          </aside>
        </section>

        {/* Notable matches */}
        <section className="mt-10">
          <TextScroll
            text="Notable matches at the Ray Mac"
            className="sfc-display text-2xl font-bold"
          />
          <MotionStagger
            as="ul"
            className="mt-5 grid gap-3 sm:grid-cols-3"
            stagger={0.07}
          >
            {NOTABLE_MATCHES.map((m) => (
              <MotionItem
                as="li"
                key={m.year}
                whileHover={{
                  y: -3,
                  boxShadow: "0 16px 36px -18px rgba(12,22,54,0.22)",
                }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="rounded-2xl border border-sfc-n-200 bg-white p-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="sfc-display text-3xl font-bold text-sfc-navy">
                    {m.year}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-sfc-n-500">
                    {m.attendance}
                  </span>
                </div>
                <div className="mt-2 text-[13px] font-bold uppercase tracking-[0.08em] text-sfc-n-500">
                  {m.competition}
                </div>
                <div className="sfc-display mt-1 text-[18px] font-bold leading-tight">
                  vs {m.opponent}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-sfc-n-700">
                  {m.note}
                </p>
              </MotionItem>
            ))}
          </MotionStagger>
        </section>

        {/* CTAs */}
        <div className="anim-fade-up mt-10 flex flex-wrap gap-3">
          <Link href="/tickets" className="sfc-btn sfc-btn--primary press">
            {t("club.buy-tickets", locale)}
          </Link>
          <Link
            href="/club/hospitality"
            className="sfc-btn sfc-btn--ghost press"
          >
            Hospitality at the Ray Mac
          </Link>
          <Link href="/club" className="sfc-btn sfc-btn--ghost press">
            ← Back to the club
          </Link>
        </div>
      </div>
    </>
  );
}
