import Image from "next/image";
import type { NewsArticle } from "@/lib/club";
import { localize, type Locale } from "@/lib/i18n";

type Variant = {
  /** CSS background — gradient or layered. */
  background: string;
  /** Hex accent for the corner stripe + chip border. */
  accent: string;
  /** Optional decorative pattern overlay (CSS background-image). */
  pattern?: string;
  /** Crest tint — turns the white logo into a near-monochrome wash. */
  crestFilter?: string;
};

const VARIANTS: Record<string, Variant> = {
  "club-shop-opening-times": {
    background:
      "linear-gradient(135deg, #B58A2A 0%, #6B4A1A 55%, #15324A 100%)",
    accent: "#F0BE5C",
    pattern:
      "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 14px, transparent 14px 28px)",
    crestFilter: "brightness(0) invert(1)",
  },
  "retained-released-list": {
    background:
      "linear-gradient(160deg, #1F4A6B 0%, #15324A 50%, #0C2236 100%)",
    accent: "#6898C8",
    pattern:
      "radial-gradient(circle at 80% 15%, rgba(104,152,200,0.35), transparent 55%)",
    crestFilter: "brightness(0) invert(1)",
  },
  "shirt-sleeve-sponsorship": {
    background:
      "linear-gradient(115deg, #6898C8 0%, #1F4A6B 60%, #0C2236 100%)",
    accent: "#FFFFFF",
    pattern:
      "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 14px)",
    crestFilter: "brightness(0) invert(1)",
  },
  "points-shared-final-day": {
    background:
      "linear-gradient(180deg, #4F8534 0%, #355C22 55%, #0C2236 100%)",
    accent: "#FFFFFF",
    pattern:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 24px, transparent 24px 48px)",
    crestFilter: "brightness(0) invert(1)",
  },
  "preview-hemel-hempstead": {
    background:
      "linear-gradient(150deg, #15324A 0%, #1F4A6B 50%, #0C2236 100%)",
    accent: "#D9342B",
    pattern:
      "radial-gradient(ellipse at 20% 80%, rgba(217,52,43,0.35), transparent 55%)",
    crestFilter: "brightness(0) invert(1)",
  },
};

const FALLBACK: Variant = {
  background:
    "linear-gradient(150deg, #1F4A6B 0%, #15324A 60%, #0C2236 100%)",
  accent: "#6898C8",
  pattern:
    "radial-gradient(circle at 80% 20%, rgba(104,152,200,0.25), transparent 60%)",
  crestFilter: "brightness(0) invert(1)",
};

export type NewsPosterSize = "feature" | "card" | "thumb" | "hero";

const TITLE_CLAMP: Record<NewsPosterSize, string> = {
  feature: "clamp(1.5rem, 2.6vw, 2.4rem)",
  hero: "clamp(2rem, 4vw, 3.5rem)",
  card: "clamp(1.05rem, 1.7vw, 1.35rem)",
  thumb: "0", // hide title on small thumbs
};

const PADDING: Record<NewsPosterSize, string> = {
  feature: "28px 32px",
  hero: "36px 40px",
  card: "20px 22px",
  thumb: "10px",
};

export function NewsPoster({
  article,
  locale,
  size,
  showTitle = true,
}: {
  article: NewsArticle;
  locale: Locale;
  size: NewsPosterSize;
  showTitle?: boolean;
}) {
  const variant = VARIANTS[article.slug] ?? FALLBACK;
  const showText = showTitle && size !== "thumb";

  // If the article has a real photo, render it — the gradient poster becomes a
  // typographic fallback for any article missing artwork.
  if (article.image) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-sfc-navy-darker">
        <Image
          src={article.image}
          alt={article.title[locale]}
          fill
          sizes="(min-width: 1024px) 760px, 100vw"
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className="relative isolate h-full w-full overflow-hidden"
      style={{ background: variant.background }}
      aria-hidden
    >
      {variant.pattern && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: variant.pattern }}
        />
      )}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,22,54,0) 0%, rgba(12,22,54,0.55) 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rotate-45"
        style={{ background: variant.accent, opacity: size === "thumb" ? 0.45 : 0.85 }}
      />

      <div
        className={`pointer-events-none absolute ${
          size === "thumb"
            ? "-right-3 -top-3 h-16 w-16"
            : size === "card"
              ? "-right-4 -top-4 h-24 w-24"
              : "-right-8 -bottom-8 h-44 w-44 sm:h-56 sm:w-56"
        }`}
        style={{ opacity: 0.18 }}
      >
        <Image
          src="/logo.png"
          alt=""
          fill
          sizes="240px"
          className="object-contain"
          style={{ filter: variant.crestFilter }}
        />
      </div>

      {size !== "thumb" && (
        <div
          className="absolute left-0 top-0 flex items-center gap-2"
          style={{ padding: PADDING[size] }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm"
            style={{ borderInlineStart: `2px solid ${variant.accent}` }}
          >
            {localize(article.category, locale)}
          </span>
        </div>
      )}

      {showText && (
        <div
          className="absolute inset-x-0 bottom-0 z-10"
          style={{ padding: PADDING[size] }}
        >
          <h3
            className="sfc-display max-w-[18ch] text-white"
            style={{
              fontSize: TITLE_CLAMP[size],
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              textWrap: "balance",
            }}
          >
            {article.title[locale]}
          </h3>
        </div>
      )}
    </div>
  );
}
