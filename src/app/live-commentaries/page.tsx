import Link from "next/link";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";

export const metadata = {
  title: "Live commentaries — Salisbury FC",
  description:
    "Listen to live commentary from Salisbury FC's league matches in partnership with Salisbury Radio Sport.",
};

export default function LiveCommentariesPage() {
  return (
    <>
      <div className="bg-sfc-navy text-white">
        <div className="sfc-container py-8 sm:py-12">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">Salisbury Radio Sport</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold leading-[1.05] sm:text-5xl">
            Live Commentaries
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            Listen to live commentary from Salisbury FC&apos;s league matches in
            partnership with Salisbury Radio.
          </p>
        </div>
      </div>

      <div className="sfc-container py-10">
        <section className="anim-fade-up rounded-2xl border border-sfc-n-200 bg-white p-6 sm:p-8">
          <h2 className="sfc-display text-xl font-bold">About Salisbury Radio</h2>
          <p className="mt-3 text-sm leading-relaxed text-sfc-n-700">
            Salisbury Radio is Salisbury&apos;s local radio station, focused on
            Salisbury, South Wiltshire and West Hampshire — broadcasting on
            DAB, smart speakers, online and via the Salisbury Radio app. You
            can listen to live commentary of away games on Salisbury Radio
            Sport on the website, in the app, or directly on the player below.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://www.salisburyradio.co.uk/"
              target="_blank"
              rel="noreferrer noopener"
              className="sfc-btn sfc-btn--ghost press"
            >
              Salisbury Radio website ↗
            </a>
            <a
              href="https://www.salisburyradio.co.uk/player/salisbury-radio-sport/"
              target="_blank"
              rel="noreferrer noopener"
              className="sfc-btn sfc-btn--primary press"
            >
              Open the live player ↗
            </a>
          </div>
        </section>

        <section className="anim-fade-up mt-6 overflow-hidden rounded-2xl border border-sfc-n-200 bg-white">
          <div className="border-b border-sfc-n-200 px-6 py-4">
            <h2 className="sfc-display text-lg font-bold">On air now</h2>
            <p className="mt-1 text-xs text-sfc-n-500">
              Embedded from Salisbury Radio. If the player doesn&apos;t load,
              use one of the buttons above.
            </p>
          </div>
          <div className="relative aspect-video w-full bg-sfc-bone">
            <iframe
              src="https://www.salisburyradio.co.uk/player/salisbury-radio-sport/"
              title="Salisbury Radio Sport — live player"
              className="absolute inset-0 h-full w-full"
              allow="autoplay"
              loading="lazy"
            />
          </div>
        </section>

        <MotionStagger as="section" className="mt-6 grid gap-4 sm:grid-cols-3" stagger={0.08}>
          <ListenWay
            label="DAB radio"
            text="Tune in to Salisbury Radio Sport on DAB+ across the local broadcast area."
          />
          <ListenWay
            label="Smart speaker"
            text='Say "play Salisbury Radio Sport" on Alexa, Google Home or HomePod.'
          />
          <ListenWay
            label="App"
            text="Download the Salisbury Radio app on iOS or Android and pick the Sport stream."
          />
        </MotionStagger>

        <div className="anim-fade-up mt-10 flex flex-wrap gap-3">
          <Link href="/tickets" className="sfc-btn sfc-btn--primary press">
            Buy match tickets
          </Link>
          <Link href="/news" className="sfc-btn sfc-btn--ghost press">
            Latest news
          </Link>
        </div>
      </div>
    </>
  );
}

function ListenWay({ label, text }: { label: string; text: string }) {
  return (
    <MotionItem
      whileHover={{ y: -2, boxShadow: "0 12px 28px -14px rgba(12,22,54,0.18)" }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="rounded-2xl border border-sfc-n-200 bg-white p-5"
    >
      <div className="sfc-eyebrow text-sfc-n-500">{label}</div>
      <p className="mt-2 text-sm text-sfc-n-700">{text}</p>
    </MotionItem>
  );
}
