import Image from "next/image";
import { getTeamBadge } from "@/lib/club";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE: Record<Size, { box: number; font: number; ring: number }> = {
  xs: { box: 20, font: 9,  ring: 1 },
  sm: { box: 28, font: 10, ring: 1 },
  md: { box: 40, font: 12, ring: 2 },
  lg: { box: 56, font: 15, ring: 2 },
  xl: { box: 72, font: 18, ring: 2 },
};

// Round crest for a team. Renders the registered logo image when present,
// otherwise a coloured monogram. Latin glyphs only — always rendered LTR.
export function TeamBadge({
  team,
  size = "sm",
  className = "",
}: {
  team: string;
  size?: Size;
  className?: string;
}) {
  const badge = getTeamBadge(team);
  const { box, font, ring } = SIZE[size];

  if (badge.logo) {
    return (
      <span
        className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
        style={{ width: box, height: box }}
        aria-hidden
      >
        <Image
          src={badge.logo}
          alt=""
          width={box}
          height={box}
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{
        width: box,
        height: box,
        background: badge.bg,
        color: badge.fg,
        boxShadow: `inset 0 0 0 ${ring}px rgba(255,255,255,0.12)`,
      }}
      aria-hidden
      dir="ltr"
    >
      <span
        className="font-mono font-bold leading-none tracking-tight"
        style={{ fontSize: font }}
      >
        {badge.short}
      </span>
    </span>
  );
}
