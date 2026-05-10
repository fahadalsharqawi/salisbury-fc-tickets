import Link from "next/link";

export const metadata = {
  title: "easyfundraising — Salisbury FC",
  description:
    "Raise free funds for Salisbury FC every time you shop online — sign up via easyfundraising.",
};

export default function EasyFundraisingPage() {
  return (
    <>
      <div className="sfc-band">
        <div className="sfc-container py-8 sm:py-12">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">The Club</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold leading-[1.05] sm:text-5xl">
            easyfundraising
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            Turn your everyday online shopping into free donations to the
            Whites — over 8,000 retailers, no extra cost to you.
          </p>
        </div>
      </div>

      <div className="sfc-container py-10 sm:py-14">
        <article className="anim-fade-up mx-auto max-w-3xl rounded-2xl border border-sfc-n-200 bg-white p-6 sm:p-8">
          <h2 className="sfc-display text-2xl font-bold">How it works</h2>
          <ol className="mt-4 space-y-3 text-[15px] leading-relaxed text-sfc-n-700">
            <li>
              <span className="font-semibold text-sfc-ink">1. Sign up.</span>{" "}
              Create a free easyfundraising account and choose Salisbury FC
              as your cause.
            </li>
            <li>
              <span className="font-semibold text-sfc-ink">2. Shop.</span>{" "}
              Visit easyfundraising&rsquo;s site or browser extension before
              you check out at one of 8,000+ partnered retailers — Amazon,
              Argos, John Lewis, eBay, Sainsbury&rsquo;s, Trainline,
              Booking.com…
            </li>
            <li>
              <span className="font-semibold text-sfc-ink">3. Raise.</span>{" "}
              The retailer pays a small commission on your purchase to
              easyfundraising, who pass it directly to the club. There&rsquo;s
              no extra cost to you.
            </li>
          </ol>

          <h2 className="sfc-display mt-8 text-xl font-bold">Why it matters</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-sfc-n-700">
            Every penny raised through easyfundraising goes back into the
            club — youth football, ground maintenance, kit and matchday
            running costs. A regular online shopper can raise £30–£50 a year
            for the Whites without changing their habits.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://www.easyfundraising.org.uk/"
              target="_blank"
              rel="noreferrer noopener"
              className="sfc-btn sfc-btn--primary press"
            >
              Sign up at easyfundraising.org.uk →
            </a>
            <Link href="/club/about" className="sfc-btn sfc-btn--ghost press">
              ← Back to the club
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
