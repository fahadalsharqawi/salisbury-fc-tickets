import Link from "next/link";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";

export const metadata = {
  title: "Hospitality — Salisbury FC",
  description:
    "Matchday hospitality at the Raymond McEnhill Stadium — board-room and VIP box packages for individuals, friends, family and businesses.",
};

const PACKAGES = [
  {
    title: "Individual Board Room Hospitality",
    price: "£60",
    priceNote: "inc. VAT · per person",
    tagline: "Ideal for individuals or smaller groups",
    perks: [
      "Hot meal and cheese & biscuits served one hour before kick-off",
      "Coffee, tea and biscuits throughout the match, cake at half time",
      "The best seating available — Board Room or Directors area",
      "Match-day programme & team sheet",
      "Waitress service throughout the match",
      "Smart-casual dress code",
    ],
    cta: "Book a board-room seat",
  },
  {
    title: "VIP Hospitality Box",
    price: "£400",
    priceNote: "inc. VAT · for 10 people",
    tagline: "Ideal for friends and family gatherings or company outings",
    perks: [
      "A private hospitality box with seating and a great view of the pitch",
      "Hot meal pre-match and cake at half time",
      "Coffee, tea and biscuits throughout the match",
      "Cheese & biscuits at half time (order separately in advance)",
      "Match-day programme & team sheet",
      "Waitress service throughout the match",
    ],
    cta: "Book a private box",
  },
];

export default function HospitalityPage() {
  return (
    <>
      <div className="bg-sfc-navy text-white">
        <div className="sfc-container py-8 sm:py-12">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">The Ray Mac</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold leading-[1.05] sm:text-5xl">
            Hospitality
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            Our matchday hospitality at the Ray Mac is always popular. Get a
            great view of the match from the balconies outside the boxes — add
            a hot pre-match meal and a place to keep warm and you've got a great
            way to make the day a bit special, or to entertain friends, family,
            colleagues or clients.
          </p>
        </div>
      </div>

      <div className="sfc-container py-10">
        <MotionStagger as="section" className="grid gap-5 sm:grid-cols-2" stagger={0.1}>
          {PACKAGES.map((p) => (
            <MotionItem
              as="article"
              key={p.title}
              whileHover={{ y: -3, boxShadow: "0 18px 36px -18px rgba(12,22,54,0.22)" }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="flex flex-col rounded-2xl border border-sfc-n-200 bg-white p-6"
            >
              <h2 className="sfc-display text-xl font-bold">{p.title}</h2>
              <p className="mt-1 text-sm text-sfc-n-600">{p.tagline}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="sfc-display text-4xl font-bold text-sfc-navy">
                  {p.price}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-sfc-n-500">
                  {p.priceNote}
                </span>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-sfc-n-700">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex gap-2">
                    <span aria-hidden className="text-sfc-pitch">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:hospitality@salisburyfc.co.uk?subject=Hospitality%20enquiry"
                className="sfc-btn sfc-btn--primary press mt-6 self-start"
              >
                {p.cta}
              </a>
            </MotionItem>
          ))}
        </MotionStagger>

        <section className="anim-fade-up mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-sfc-navy to-sfc-navy-deep p-6 text-white sm:p-8">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">Giveaway</div>
          <h2 className="sfc-display mt-2 text-2xl font-bold sm:text-3xl">
            Business Hospitality Box Giveaway
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light">
            Want to win a business hospitality experience for you and your
            colleagues? Register your company through the quick form and you
            could have the perfect view of the Ray Mac — the home of the
            Whites.
          </p>
          <a
            href="https://forms.gle/1KCouuELF5o9ZpFG7"
            target="_blank"
            rel="noreferrer noopener"
            className="sfc-btn sfc-btn--ghost-on-dark press mt-5 inline-flex"
          >
            Register your company →
          </a>
        </section>

        <section className="anim-fade-up mt-10 grid gap-3 rounded-2xl border border-sfc-n-200 bg-white p-6 sm:grid-cols-2">
          <div>
            <div className="sfc-eyebrow text-sfc-n-500">Phone</div>
            <a
              href="tel:+441722776655"
              className="sfc-display mt-1 block text-xl font-bold text-sfc-navy hover:underline hover:underline-offset-4"
            >
              01722 77 66 55
            </a>
          </div>
          <div>
            <div className="sfc-eyebrow text-sfc-n-500">Email</div>
            <a
              href="mailto:hospitality@salisburyfc.co.uk"
              className="sfc-display mt-1 block break-all text-xl font-bold text-sfc-navy hover:underline hover:underline-offset-4"
            >
              hospitality@salisburyfc.co.uk
            </a>
          </div>
          <p className="mt-2 text-xs text-sfc-n-500 sm:col-span-2">
            Packages are also available to purchase via TicketCo.
          </p>
        </section>

        <div className="anim-fade-up mt-10 flex flex-wrap gap-3">
          <Link href="/tickets" className="sfc-btn sfc-btn--primary press">
            Buy match tickets
          </Link>
          <Link href="/club" className="sfc-btn sfc-btn--ghost press">
            ← Back to the club
          </Link>
        </div>
      </div>
    </>
  );
}
