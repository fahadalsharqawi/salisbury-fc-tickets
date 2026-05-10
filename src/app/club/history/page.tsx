import Link from "next/link";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";

export const metadata = {
  title: "Club history — Salisbury FC",
  description:
    "From Salisbury City in 1947 to the modern Salisbury FC re-formed in 2015 — a short history of the Whites.",
};

const TIMELINE = [
  {
    year: "1947",
    title: "Salisbury City founded",
    body:
      "The original Salisbury City founded in the post-war years, playing on Victoria Park before settling at the Old Sarum site decades later.",
  },
  {
    year: "1968",
    title: "Southern League era begins",
    body:
      "After years of local league football the club climbs into the regional Southern League, where the bulk of the next thirty years are spent.",
  },
  {
    year: "1997",
    title: "Move to the Ray Mac",
    body:
      "Salisbury City open the Raymond McEnhill Stadium at Old Sarum, named after long-serving chairman Raymond McEnhill.",
  },
  {
    year: "2006",
    title: "FA Cup against Nottingham Forest",
    body:
      "A 3,100-strong Ray Mac watches Forest visit in the FA Cup second round — the biggest fixture of the era.",
  },
  {
    year: "2007",
    title: "Conference South",
    body:
      "Promotion to Conference South — the highest level Salisbury football has reached.",
  },
  {
    year: "2013",
    title: "Conference South play-off champions",
    body:
      "Beating Dover Athletic 3–2 in front of 3,408 at the Ray Mac to win promotion to the Conference Premier.",
  },
  {
    year: "2014",
    title: "Salisbury City wound up",
    body:
      "Following financial difficulties the original company is wound up and senior football leaves the city for a season.",
  },
  {
    year: "2015",
    title: "Salisbury FC re-formed",
    body:
      "Supporters re-form the club as Salisbury FC. Re-starting in the Wessex League, the new club takes the field at the Ray Mac.",
  },
  {
    year: "2018–19",
    title: "Wessex League champions",
    body:
      "Wessex League Premier won at a canter — 100+ points — earning promotion to the Southern League.",
  },
  {
    year: "2024–25",
    title: "Back to the National League",
    body:
      "Promotion via the Southern League Premier South play-offs — Salisbury return to the National League pyramid.",
  },
] as const;

export default function ClubHistoryPage() {
  return (
    <>
      <div className="sfc-band">
        <div className="sfc-container py-8 sm:py-12">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">The Club</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold leading-[1.05] sm:text-5xl">
            Club history
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            From Salisbury City in 1947 to the modern Salisbury FC re-formed
            by supporters in 2015 — a short history of the Whites.
          </p>
        </div>
      </div>

      <div className="sfc-container py-10 sm:py-14">
        <MotionStagger as="ol" className="relative space-y-4 border-s-2 border-sfc-n-200 ps-6" stagger={0.04}>
          {TIMELINE.map((t) => (
            <MotionItem
              as="li"
              key={t.year}
              className="relative rounded-2xl border border-sfc-n-200 bg-white p-5"
            >
              <span
                aria-hidden
                className="absolute -start-[35px] top-6 h-3 w-3 rounded-full bg-sfc-navy ring-4 ring-white"
              />
              <div className="sfc-display text-2xl font-bold text-sfc-navy">{t.year}</div>
              <div className="sfc-display mt-1 text-[16px] font-bold leading-tight text-sfc-ink">
                {t.title}
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-sfc-n-700">{t.body}</p>
            </MotionItem>
          ))}
        </MotionStagger>

        <div className="anim-fade-up mt-10 flex flex-wrap gap-3">
          <Link href="/club/about" className="sfc-btn sfc-btn--primary press">
            ← Back to the club
          </Link>
          <Link href="/club/ray-mac-stadium" className="sfc-btn sfc-btn--ghost press">
            About the Ray Mac
          </Link>
        </div>
      </div>
    </>
  );
}
