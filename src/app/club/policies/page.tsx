import Link from "next/link";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";

export const metadata = {
  title: "Policies & documentation — Salisbury FC",
  description:
    "Salisbury FC's club policies — safeguarding, equality, anti-discrimination, data protection and ground regulations.",
};

const POLICIES = [
  {
    title: "Safeguarding",
    body:
      "Children and adults at risk are kept safe at the Whites. Our designated safeguarding officer is FA-trained and contactable directly.",
    href: null,
  },
  {
    title: "Equality, diversity & inclusion",
    body:
      "Everyone is welcome at the Ray Mac. Discrimination on any protected ground is not tolerated; incidents can be reported on matchday or to the office.",
    href: null,
  },
  {
    title: "Anti-discrimination & Kick It Out",
    body:
      "Salisbury FC support the Kick It Out campaign. Report racist, homophobic, sexist or other discriminatory abuse via Kick It Out's app or report line.",
    href: "https://www.kickitout.org/report",
  },
  {
    title: "Spectators' Code of Conduct",
    body:
      "All supporters are asked to follow the FA's spectator Code of Conduct so the Ray Mac stays a welcoming environment.",
    href: "/club/spectators-code-of-conduct",
  },
  {
    title: "Ground regulations",
    body:
      "Standard FA Ground Regulations apply at the Ray Mac — no smoking in covered areas, no glass, persistent foul / abusive language can result in ejection.",
    href: null,
  },
  {
    title: "Privacy & data protection",
    body:
      "Personal data is processed lawfully under UK GDPR. Booking and ticket data is retained for the season for accounting and stewarding purposes.",
    href: null,
  },
  {
    title: "Cookies",
    body:
      "We use a small number of essential cookies for ticketing, language and currency preferences. No third-party advertising or tracking.",
    href: null,
  },
  {
    title: "Refunds & cancellations",
    body:
      "Tickets are refundable when the club cancels a fixture. Customer-initiated cancellations are non-refundable but can be transferred up to 24 hours before kick-off.",
    href: null,
  },
];

export default function ClubPoliciesPage() {
  return (
    <>
      <div className="sfc-band">
        <div className="sfc-container py-8 sm:py-12">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">The Club</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold leading-[1.05] sm:text-5xl">
            Policies &amp; documentation
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            Our club policies — safeguarding, equality, ground regulations,
            data protection and refunds.
          </p>
        </div>
      </div>

      <div className="sfc-container py-10 sm:py-14">
        <MotionStagger
          as="ul"
          className="grid gap-3 sm:grid-cols-2"
          stagger={0.04}
        >
          {POLICIES.map((p) => (
            <MotionItem
              as="li"
              key={p.title}
              className="rounded-2xl border border-sfc-n-200 bg-white p-5"
            >
              <h2 className="sfc-display text-[16px] font-bold text-sfc-ink">
                {p.title}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-sfc-n-700">
                {p.body}
              </p>
              {p.href && (
                p.href.startsWith("http") ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="sfc-display mt-3 inline-block text-[12px] font-bold uppercase tracking-[0.12em] text-sfc-navy hover:underline hover:underline-offset-4"
                  >
                    Learn more ↗
                  </a>
                ) : (
                  <Link
                    href={p.href}
                    className="sfc-display mt-3 inline-block text-[12px] font-bold uppercase tracking-[0.12em] text-sfc-navy hover:underline hover:underline-offset-4"
                  >
                    Read more →
                  </Link>
                )
              )}
            </MotionItem>
          ))}
        </MotionStagger>

        <div className="anim-fade-up mt-10 flex flex-wrap gap-3">
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
