import Link from "next/link";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";

export const metadata = {
  title: "Club officials — Salisbury FC",
  description:
    "Board, directors and operational officials at Salisbury FC.",
};

const OFFICIALS = [
  { role: "Chairman", name: "Steve Claridge", note: "Significant Shareholder via Proleague Ltd" },
  { role: "President", name: "John Williams", note: "Honorary lifetime appointment" },
  { role: "Vice-chairman", name: "Andrew Reading", note: "Board director" },
  { role: "Director of football", name: "Steve Whitcher", note: "First-team operations" },
  { role: "Club secretary", name: "Susan Davies", note: "Match-day administration" },
  { role: "Commercial director", name: "Michael Phelan", note: "Sponsorship & hospitality" },
  { role: "Safeguarding officer", name: "Karen Booth", note: "FA-trained DSO" },
  { role: "Press officer", name: "Andy Munns", note: "Communications & media" },
] as const;

export default function ClubOfficialsPage() {
  return (
    <>
      <div className="sfc-band">
        <div className="sfc-container py-8 sm:py-12">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">The Club</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold leading-[1.05] sm:text-5xl">
            Club officials
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            The board, directors and operational officials behind the Whites
            on and off the pitch.
          </p>
        </div>
      </div>

      <div className="sfc-container py-10 sm:py-14">
        <MotionStagger
          as="ul"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.04}
        >
          {OFFICIALS.map((o) => (
            <MotionItem
              as="li"
              key={o.role}
              className="rounded-2xl border border-sfc-n-200 bg-white p-5"
            >
              <div className="sfc-eyebrow text-sfc-n-500">{o.role}</div>
              <div className="sfc-display mt-1 text-[18px] font-bold leading-tight text-sfc-ink">
                {o.name}
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-sfc-n-700">
                {o.note}
              </p>
            </MotionItem>
          ))}
        </MotionStagger>

        <p className="anim-fade-up mt-8 max-w-2xl text-sm text-sfc-n-600">
          Salisbury FC Ltd is registered in England, company number{" "}
          <span className="font-semibold text-sfc-ink">09342954</span>. The
          significant shareholder is Proleague Ltd. Registered office at the
          Raymond McEnhill Stadium.
        </p>

        <div className="anim-fade-up mt-8 flex flex-wrap gap-3">
          <Link href="/club/about" className="sfc-btn sfc-btn--primary press">
            ← Back to the club
          </Link>
          <Link href="/contact" className="sfc-btn sfc-btn--ghost press">
            Contact the office
          </Link>
        </div>
      </div>
    </>
  );
}
