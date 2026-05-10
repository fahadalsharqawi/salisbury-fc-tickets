import Link from "next/link";

export const metadata = {
  title: "Armed Forces Covenant — Salisbury FC",
  description:
    "Salisbury FC is a signatory of the UK Armed Forces Covenant — supporting serving personnel, veterans and their families.",
};

export default function ArmedForcesCovenantPage() {
  return (
    <>
      <div className="sfc-band">
        <div className="sfc-container py-8 sm:py-12">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">The Club</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold leading-[1.05] sm:text-5xl">
            Armed Forces Covenant
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            Salisbury FC is a proud signatory of the UK Armed Forces Covenant,
            committed to supporting current and former service personnel and
            their families across our community.
          </p>
        </div>
      </div>

      <div className="sfc-container py-10 sm:py-14">
        <article className="anim-fade-up mx-auto max-w-3xl rounded-2xl border border-sfc-n-200 bg-white p-6 sm:p-8">
          <h2 className="sfc-display text-2xl font-bold">Our pledge</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-sfc-n-700">
            The Armed Forces Covenant is a promise from the nation that those
            who serve or have served, and their families, are treated fairly.
            By signing the Covenant, Salisbury FC commits to:
          </p>
          <ul className="mt-4 space-y-2 text-[15px] text-sfc-n-700">
            <li className="flex gap-2"><span aria-hidden className="text-sfc-pitch">✓</span><span>Recognising the value serving personnel, veterans and military families bring to the local community.</span></li>
            <li className="flex gap-2"><span aria-hidden className="text-sfc-pitch">✓</span><span>Concession-priced match tickets for serving personnel, veterans, cadets and their immediate family on production of valid ID.</span></li>
            <li className="flex gap-2"><span aria-hidden className="text-sfc-pitch">✓</span><span>Hosting a Forces Day fixture each season with reduced admission, charity collection, and military guests of honour.</span></li>
            <li className="flex gap-2"><span aria-hidden className="text-sfc-pitch">✓</span><span>Working with local charities supporting veterans&rsquo; mental and physical health.</span></li>
            <li className="flex gap-2"><span aria-hidden className="text-sfc-pitch">✓</span><span>Encouraging team members and volunteers to undertake the Defence Employer Recognition Scheme bronze-award standards.</span></li>
          </ul>

          <h2 className="sfc-display mt-8 text-xl font-bold">Who&rsquo;s eligible</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-sfc-n-700">
            All serving regular and reserve personnel, veterans (anyone with
            one day or more of service), and their immediate family members.
            Cadet Forces (Combined, Army, Sea, Air) are also covered.
          </p>

          <h2 className="sfc-display mt-8 text-xl font-bold">How to claim</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-sfc-n-700">
            Buy a concession ticket online or at the ticket office and present
            your MoD 90, Veterans Card, Cadet ID or equivalent on entry. For
            group bookings of ten or more, please contact the office in
            advance.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tickets" className="sfc-btn sfc-btn--primary press">
              Buy match tickets
            </Link>
            <Link href="/contact" className="sfc-btn sfc-btn--ghost press">
              Contact the office
            </Link>
            <Link href="/club/about" className="sfc-btn sfc-btn--ghost press">
              ← Back to the club
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
