import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";
import { NEWS, SQUAD, getPlayer } from "@/lib/club";
import { localize, t, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

// The official salisburyfc.co.uk player profile pages all carry the same
// "Published 13 August, 2025 by Andy Munns" line. We mirror that.
const PROFILE_PUBLISHED = "2025-08-13";
const PROFILE_AUTHOR = "Andy Munns";

type Params = { slug: string };

export function generateStaticParams() {
  return SQUAD.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const player = getPlayer(slug);
  if (!player) return { title: "Player — Salisbury FC" };
  return {
    title: `${player.name} — Salisbury FC`,
    description: `${player.name} · ${player.position} · Salisbury FC first team.`,
  };
}

export default async function PlayerPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const player = getPlayer(slug);
  if (!player) notFound();
  const locale = await getLocale();

  // Find adjacent players in the same position for prev/next navigation.
  const samePos = SQUAD.filter((p) => p.position === player.position);
  const idx = samePos.findIndex((p) => p.slug === player.slug);
  const prev = samePos[(idx - 1 + samePos.length) % samePos.length];
  const next = samePos[(idx + 1) % samePos.length];

  const initials = player.name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      {/* Page strip */}
      <div className="bg-sfc-navy text-white">
        <div className="sfc-container py-4 sm:py-6">
          <Link
            href="/club"
            className="sfc-display text-[11px] font-semibold uppercase tracking-[0.14em] text-sfc-sky-light hover:text-white sm:text-[12px]"
          >
            ← {t("club.title", locale)}
          </Link>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3 sm:mt-3">
            <div className="min-w-0">
              <div className="sfc-eyebrow sfc-eyebrow--on-dark">
                {t(`position.${player.position}`, locale)}
              </div>
              <h1 className="sfc-display mt-1.5 text-3xl font-bold leading-[1.05] sm:mt-2 sm:text-5xl">
                {player.name}
              </h1>
            </div>
            {player.number != null && (
              <div className="text-end">
                <div className="sfc-eyebrow sfc-eyebrow--on-dark text-[10px] sm:text-xs">
                  Squad number
                </div>
                <div className="sfc-display mt-0.5 text-5xl font-bold leading-none text-white sm:text-6xl">
                  {player.number}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sfc-container py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div className="anim-fade-up">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-sfc-n-200 bg-sfc-bone">
              {player.photoUrl ? (
                <Image
                  src={player.photoUrl}
                  alt={player.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="sfc-display text-7xl font-bold text-sfc-n-400">
                    {initials}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className="anim-fade-up space-y-6"
            style={{ ["--anim-delay" as string]: "120ms" }}
          >
            {/* Pub date + author — matches the byline format on the
                official salisburyfc.co.uk player profile pages. */}
            <p className="text-xs text-sfc-n-500">
              Published {formatPublishedDate(PROFILE_PUBLISHED, locale)} by{" "}
              <span className="font-semibold text-sfc-n-700">{PROFILE_AUTHOR}</span>
            </p>

            <section className="rounded-2xl border border-sfc-n-200 bg-white p-5 sm:p-6">
              <h2 className="sfc-display text-lg font-bold">About</h2>
              <p className="mt-3 text-sm leading-relaxed text-sfc-n-700">
                {aboutPlayer(player)}
              </p>
            </section>

            {player.stats && (
              <section className="rounded-2xl border border-sfc-n-200 bg-white p-5 sm:p-6">
                <div className="flex items-baseline justify-between">
                  <h2 className="sfc-display text-lg font-bold">2025/26 stats</h2>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sfc-n-500">
                    National League South
                  </span>
                </div>
                <MotionStagger className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4" stagger={0.05}>
                  <StatTile label="Appearances" value={String(player.stats.appearances)} />
                  <StatTile label="Starts" value={String(player.stats.starts)} />
                  <StatTile label="Mins" value={player.stats.mins} />
                  <StatTile label="Win %" value={player.stats.winPct} />
                  <StatTile label="Goals" value={String(player.stats.goals)} accent />
                  <StatTile label="Bookings" value={String(player.stats.bookings)} />
                  <StatTile label="Sent off" value={String(player.stats.sentOff)} />
                </MotionStagger>
              </section>
            )}

            <section className="rounded-2xl border border-sfc-n-200 bg-white p-5 sm:p-6">
              <h2 className="sfc-display text-lg font-bold">Profile</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <Field
                  label="Position"
                  value={t(`position.${player.position}`, locale)}
                />
                <Field
                  label="Squad number"
                  value={player.number != null ? `#${player.number}` : "—"}
                />
                <Field label="Club" value={t("brand.name", locale)} />
                <Field
                  label="Stadium"
                  value={localize("Raymond McEnhill Stadium", locale)}
                />
              </dl>
            </section>

            <ShareLinks name={player.name} />

            <RelatedNews locale={locale} />

            <section className="flex flex-wrap gap-3">
              <Link href="/tickets" className="sfc-btn sfc-btn--primary press">
                {t("club.buy-tickets", locale)}
              </Link>
              <Link href="/club" className="sfc-btn sfc-btn--ghost press">
                ← Back to squad
              </Link>
            </section>
          </div>
        </div>

        <nav
          aria-label="Squad navigation"
          className="anim-fade-up mt-10 flex items-stretch justify-between gap-3 border-t border-sfc-n-200 pt-6"
        >
          <Link
            href={`/club/squad/${prev.slug}`}
            className="lift flex flex-1 items-center gap-3 rounded-xl border border-sfc-n-200 bg-white p-3"
          >
            <span className="text-2xl text-sfc-n-400">←</span>
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-sfc-n-500">
                Previous {t(`position.${player.position}`, locale)}
              </span>
              <span className="block truncate text-sm font-semibold">{prev.name}</span>
            </span>
          </Link>
          <Link
            href={`/club/squad/${next.slug}`}
            className="lift flex flex-1 items-center justify-end gap-3 rounded-xl border border-sfc-n-200 bg-white p-3 text-right"
          >
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-sfc-n-500">
                Next {t(`position.${player.position}`, locale)}
              </span>
              <span className="block truncate text-sm font-semibold">{next.name}</span>
            </span>
            <span className="text-2xl text-sfc-n-400">→</span>
          </Link>
        </nav>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sfc-n-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-sfc-ink">{value}</div>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <MotionItem
      variant="scaleIn"
      className={`rounded-xl border ${
        accent
          ? "border-sfc-navy bg-sfc-navy text-white"
          : "border-sfc-n-200 bg-sfc-bone text-sfc-ink"
      } p-3 text-center`}
    >
      <div className="sfc-display text-xl font-bold leading-none sm:text-2xl">
        {value}
      </div>
      <div
        className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
          accent ? "text-sfc-sky-light" : "text-sfc-n-500"
        }`}
      >
        {label}
      </div>
    </MotionItem>
  );
}

function formatPublishedDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(
    locale === "ar" ? "ar" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );
}

function ShareLinks({ name }: { name: string }) {
  const url = `https://salisburyfc.vercel.app/club/squad/`;
  const text = `${name} — Salisbury FC`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
  return (
    <section className="rounded-2xl border border-sfc-n-200 bg-white p-5 sm:p-6">
      <h2 className="sfc-display text-lg font-bold">Share</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <ShareLink href={x} label="X" />
        <ShareLink href={fb} label="Facebook" />
        <ShareLink href={wa} label="WhatsApp" />
      </div>
    </section>
  );
}

function ShareLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="rounded-full border border-sfc-n-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-sfc-navy hover:bg-sfc-bone"
    >
      {label}
    </a>
  );
}

function RelatedNews({ locale }: { locale: Locale }) {
  const items = NEWS.slice(0, 3);
  if (items.length === 0) return null;
  return (
    <section className="rounded-2xl border border-sfc-n-200 bg-white p-5 sm:p-6">
      <h2 className="sfc-display text-lg font-bold">Related</h2>
      <ul className="mt-3 divide-y divide-sfc-n-200">
        {items.map((n) => (
          <li key={n.slug}>
            <Link
              href={`/news/${n.slug}`}
              className="block py-3 transition hover:bg-sfc-bone"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sfc-n-500">
                {n.category} · {formatPublishedDate(n.date, locale)}
              </div>
              <div className="mt-0.5 text-sm font-semibold text-sfc-ink">
                {n.title[locale]}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function aboutPlayer(player: { name: string; position: string; number?: number }) {
  const number =
    player.number != null
      ? `wears the number ${player.number} shirt`
      : "is part of the first-team squad";
  switch (player.position) {
    case "Goalkeeper":
      return `${player.name} ${number} for Salisbury FC, lining up between the posts at the Raymond McEnhill Stadium.`;
    case "Defender":
      return `${player.name} ${number} for Salisbury FC, operating across the back-line at the Raymond McEnhill Stadium.`;
    case "Midfielder":
      return `${player.name} ${number} for Salisbury FC, contributing in the engine room of the side at the Raymond McEnhill Stadium.`;
    case "Forward":
      return `${player.name} ${number} for Salisbury FC, leading the line for the Whites at the Raymond McEnhill Stadium.`;
    default:
      return `${player.name} ${number} for Salisbury FC.`;
  }
}
