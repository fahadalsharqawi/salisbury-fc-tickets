"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitBookingAction } from "@/lib/actions";
import {
  MAIN_STAND_SURCHARGE,
  SEAT_PX,
  type BlockConfig,
  blocksOnSide,
  colsOf,
  findAdjacentSeats,
  isMainStand,
  parseSeatId,
  rowsOf,
  seatId,
} from "@/lib/seats";
import { formatMoney, type Currency } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import { calcTotal, tierPrices } from "@/lib/pricing";
import type { MatchWithAvailability } from "@/lib/types";

const SEAT_GAP = 3;
const BLOCK_GAP = 6; // gap between adjacent blocks on the same side
const STAND_PADDING = 6;
// Vertical room reserved above north blocks / below south blocks for their
// outside labels (NE / X / Y / SE / NW / A–H / SW). Sized so the 9px label
// + py-1 padding fit even after iOS Safari's minimum-font-size kicks in.
const LABEL_ROW_H = 18;

// Width of a row of `n` seats (px), including the gaps between them.
function unit(n: number): number {
  return n * SEAT_PX + Math.max(0, n - 1) * SEAT_GAP;
}

// Width of a side-strip (sum of block lengths + per-block gaps + padding).
function sideAcross(blocks: BlockConfig[]): number {
  if (blocks.length === 0) return 0;
  const seats = blocks.reduce((sum, b) => sum + unit(b.length), 0);
  const gaps = (blocks.length - 1) * BLOCK_GAP;
  return seats + gaps + STAND_PADDING * 2;
}

// Depth of a side-strip = max depth of its blocks.
function sideDepth(blocks: BlockConfig[]): number {
  if (blocks.length === 0) return 0;
  const maxDepth = Math.max(...blocks.map((b) => b.depth));
  return unit(maxDepth) + STAND_PADDING * 2;
}

const NORTH = blocksOnSide("north");
const SOUTH = blocksOnSide("south");
const EAST = blocksOnSide("east");
const WEST = blocksOnSide("west");

// Pitch width is constrained by the longer of north/south side. Pitch height
// is constrained by the longer side of west (a single full-length block).
const NORTH_W = sideAcross(NORTH);
const SOUTH_W = sideAcross(SOUTH);
const PITCH_W = Math.max(NORTH_W, SOUTH_W);
const PITCH_H = unit(WEST[0]?.length ?? 26) + STAND_PADDING * 2;
// Outside labels live above north blocks / below south blocks, so each
// strip needs room for them on top of the seat rows.
const NORTH_H = sideDepth(NORTH) + LABEL_ROW_H;
const SOUTH_H = sideDepth(SOUTH) + LABEL_ROW_H;
const WEST_W = sideDepth(WEST);
const EAST_W = sideDepth(EAST);

const TOTAL_BOWL_WIDTH = WEST_W + PITCH_W + EAST_W + STAND_PADDING * 2;
const TOTAL_BOWL_HEIGHT = NORTH_H + PITCH_H + SOUTH_H + STAND_PADDING * 2;
// Allow shrinking down to 0.35 — at 24px base × 0.35 = ~8px seats, tight
// but tappable on a high-DPI phone. Below this we let the bowl overflow.
// Don't lock the bowl to 0.35× — on phones with 360–390 px viewports the
// bowl was ~916 px wide and needed horizontal scroll to see all blocks.
// Allow it to scale further down so the whole stadium fits.
const MIN_BOWL_SCALE = 0.22;
// On phone-width viewports we deliberately render the bowl narrower than
// the container so the pitch doesn't dominate. Below this width is "phone".
const MOBILE_BREAKPOINT = 640;
const MOBILE_BOWL_FRACTION = 0.95;

type Props = {
  match: MatchWithAvailability;
  error?: string;
  currency: Currency;
  locale: Locale;
  prefill?: { name: string; email: string };
};

export default function BookingForm({ match, error, currency, locale, prefill }: Props) {
  const booked = useMemo(() => new Set(match.bookedSeats), [match.bookedSeats]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [adultCount, setAdultCount] = useState(0);
  const [concessionCount, setConcessionCount] = useState(0);
  const [under17Count, setUnder17Count] = useState(0);
  const [under5Count, setUnder5Count] = useState(0);

  // Persist seat selection across refreshes so a tab reload doesn't wipe what
  // the user already picked. Scoped per match so different matches don't
  // share state. Drop any persisted seats that have since been booked by
  // someone else.
  const storageKey = `sfc-seats:${match.id}`;
  const hydrated = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;
      const restored = new Set(
        parsed.filter((s): s is string => typeof s === "string" && !booked.has(s)),
      );
      if (restored.size > 0) setSelected(restored);
    } catch {
      // ignore — storage may be unavailable, malformed, etc.
    } finally {
      hydrated.current = true;
    }
    // Only run on mount; `booked` is stable for the lifetime of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      if (selected.size === 0) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, JSON.stringify([...selected]));
      }
    } catch {
      // ignore
    }
  }, [selected, storageKey]);

  // Auto-fit the bowl. On phone viewports we target a fraction of the
  // container width so the pitch + stands stay compact. We use
  // transform: scale (with a properly-sized wrapper) rather than CSS
  // `zoom` because Safari's `zoom` doesn't shrink the element's layout
  // box, so the parent ended up scrolling horizontally even when the
  // bowl visually fit.
  const bowlContainerRef = useRef<HTMLDivElement>(null);
  const [bowlScale, setBowlScale] = useState<number>(1);
  useEffect(() => {
    const el = bowlContainerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const isPhone = w < MOBILE_BREAKPOINT;
      const target = isPhone ? w * MOBILE_BOWL_FRACTION : Math.min(w, TOTAL_BOWL_WIDTH);
      if (target >= TOTAL_BOWL_WIDTH) {
        setBowlScale(1);
      } else {
        setBowlScale(Math.max(MIN_BOWL_SCALE, target / TOTAL_BOWL_WIDTH));
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function toggle(id: string) {
    if (booked.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function quickPick(count: number) {
    const taken = new Set([...booked, ...selected]);
    const found = findAdjacentSeats(count, taken);
    if (found.length === 0) return;
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of found) next.add(id);
      return next;
    });
  }

  // Auto-rebalance: when seat count changes, top up / draw down adults.
  useEffect(() => {
    const target = selected.size;
    const others = concessionCount + under17Count + under5Count;
    if (others > target) {
      setConcessionCount(0);
      setUnder17Count(0);
      setUnder5Count(0);
      setAdultCount(target);
      return;
    }
    setAdultCount(Math.max(0, target - others));
  }, [selected.size, concessionCount, under17Count, under5Count]);

  const ordered = useMemo(() => sortSeatIds([...selected]), [selected]);

  const tiers = tierPrices(match.pricePerSeat);
  const totalCount = adultCount + concessionCount + under17Count + under5Count;
  const total = calcTotal({
    basePerSeat: match.pricePerSeat,
    counts: { adultCount, concessionCount, under17Count, under5Count },
    seats: ordered,
  });

  const countsMatch = totalCount === selected.size;
  const canPay = selected.size > 0 && !match.isSoldOut && countsMatch;

  return (
    <form
      action={submitBookingAction}
      onSubmit={() => {
        // The form action redirects on success — clear the persisted
        // selection so a "back" navigation to the booking page doesn't
        // re-show the seats they just bought.
        try {
          localStorage.removeItem(storageKey);
        } catch {
          // ignore
        }
      }}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <input type="hidden" name="matchId" value={match.id} />
      <input type="hidden" name="seats" value={ordered.join(",")} />
      <input type="hidden" name="adultCount" value={adultCount} />
      <input type="hidden" name="concessionCount" value={concessionCount} />
      <input type="hidden" name="under17Count" value={under17Count} />
      <input type="hidden" name="under5Count" value={under5Count} />

      <div className="min-w-0 space-y-4">
        <QuickPick
          onPick={quickPick}
          onClear={clearSelection}
          selectedCount={selected.size}
          remaining={match.remaining}
          locale={locale}
        />
        <div className="anim-scale-in rounded-2xl border border-stone-200 bg-stone-100 p-2 sm:p-6">
          <div ref={bowlContainerRef} className="flex justify-center overflow-hidden">
            {/* Visible layout box — sized to the scaled bowl so the parent
                doesn't think the content is wider than it is. */}
            <div
              style={{
                width: TOTAL_BOWL_WIDTH * bowlScale,
                height: TOTAL_BOWL_HEIGHT * bowlScale,
              }}
            >
              {/* Natural-size bowl, scaled into the visible box. */}
              <div
                style={{
                  width: TOTAL_BOWL_WIDTH,
                  height: TOTAL_BOWL_HEIGHT,
                  transform: `scale(${bowlScale})`,
                  transformOrigin: "top left",
                }}
              >
                <Bowl booked={booked} selected={selected} toggle={toggle} locale={locale} />
              </div>
            </div>
          </div>
          <Legend currency={currency} locale={locale} />
        </div>
        <div
          className="anim-fade-up"
          style={{ ['--anim-delay' as string]: '180ms' }}
        >
          <TierBreakdown
            seatCount={selected.size}
            tiers={tiers}
            counts={{ adultCount, concessionCount, under17Count, under5Count }}
            setAdult={setAdultCount}
            setConcession={setConcessionCount}
            setUnder17={setUnder17Count}
            setUnder5={setUnder5Count}
            countsMatch={countsMatch}
            totalCount={totalCount}
            currency={currency}
          />
        </div>
        <div
          className="anim-fade-up"
          style={{ ['--anim-delay' as string]: '220ms' }}
        >
          <Summary
            selected={ordered}
            total={total}
            currency={currency}
            locale={locale}
          />
        </div>
      </div>

      <aside
        id="checkout"
        className="lg:sticky lg:top-6 h-fit space-y-5 rounded-2xl border border-stone-200 bg-white p-5 scroll-mt-6"
      >
        <h2 className="text-base font-semibold">{t("form.your-details", locale)}</h2>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <Field
          label={t("form.full-name", locale)}
          name="customerName"
          required
          autoComplete="name"
          defaultValue={prefill?.name}
        />
        <Field
          label={t("form.email", locale)}
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={prefill?.email}
        />
        <Field label={t("form.phone", locale)} name="phone" type="tel" required autoComplete="tel" />

        <label className="block text-sm font-medium text-stone-700">
          {t("form.notes-optional", locale)}
          <textarea
            name="notes"
            rows={2}
            placeholder={t("form.notes-placeholder", locale)}
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>

        <div className="border-t border-stone-200 pt-5">
          <p className="text-xs text-stone-500">
            {t("pay.tap-note", locale)}
          </p>
        </div>

        <PayButton total={total} disabled={!canPay} currency={currency} locale={locale} />

        <p className="text-xs text-stone-500">{t("form.no-reserve", locale)}</p>
      </aside>

      <MobileCheckoutBar
        count={selected.size}
        total={total}
        disabled={!canPay}
        currency={currency}
        locale={locale}
      />
    </form>
  );
}

// ---- seat bowl ----

function Bowl({
  booked,
  selected,
  toggle,
  locale,
}: {
  booked: Set<string>;
  selected: Set<string>;
  toggle: (id: string) => void;
  locale: Locale;
}) {
  const totalWidth = WEST_W + PITCH_W + EAST_W + STAND_PADDING * 2;
  return (
    <div
      className="mx-auto"
      style={{
        display: "grid",
        gap: STAND_PADDING,
        gridTemplateColumns: `${WEST_W}px ${PITCH_W}px ${EAST_W}px`,
        gridTemplateRows: `${NORTH_H}px ${PITCH_H}px ${SOUTH_H}px`,
        width: totalWidth,
      }}
    >
      <Corner />
      <SideStrip side="north" booked={booked} selected={selected} toggle={toggle} locale={locale} />
      <Corner />

      <SideStrip side="west"  booked={booked} selected={selected} toggle={toggle} locale={locale} />
      <Pitch />
      <SideStrip side="east"  booked={booked} selected={selected} toggle={toggle} locale={locale} />

      <Corner />
      <SideStrip side="south" booked={booked} selected={selected} toggle={toggle} locale={locale} />
      <Corner />
    </div>
  );
}

function Corner() {
  // Empty bowl corners — kept as a grid placeholder so the layout still
  // reserves space, but with no fill so the page background reads through.
  return <div aria-hidden />;
}

type SeatGridProps = {
  booked: Set<string>;
  selected: Set<string>;
  toggle: (id: string) => void;
  locale: Locale;
};

// Renders all blocks on a given side, laid out parallel to the pitch edge,
// with a small gap between adjacent blocks. Each block has its own frame
// (and its own roof stripe + label).
function SideStrip({
  side,
  ...p
}: SeatGridProps & { side: "north" | "south" | "east" | "west" }) {
  const blocks = blocksOnSide(side);
  const horizontal = side === "north" || side === "south";
  // For east/west sides the "across" axis runs vertically; we rotate the
  // flex direction accordingly. We also align the blocks so that their
  // pitch-facing rows sit next to the pitch — north blocks bottom-align,
  // south top-align, west right-align, east left-align.
  const layout = horizontal
    ? "flex h-full items-stretch justify-center"
    : "flex h-full w-full flex-col items-stretch justify-center";
  return (
    <div
      className={layout}
      style={{
        gap: BLOCK_GAP,
        padding: STAND_PADDING,
      }}
    >
      {blocks.map((b) => (
        <Block key={b.id} block={b} side={side} {...p} />
      ))}
    </div>
  );
}

function Block({
  block,
  side,
  booked,
  selected,
  toggle,
}: SeatGridProps & {
  block: BlockConfig;
  side: "north" | "south" | "east" | "west";
}) {
  const horizontal = side === "north" || side === "south";
  // Rows go from "front" (pitch-facing) to "back". The pitch-facing row sits
  // closest to the pitch; we align children so it ends up adjacent.
  const rows = rowsOf(block);
  // Reverse for north/west so row A is closest to the pitch (bottom-most for
  // a north stand, right-most for the west stand). South/east render in
  // natural order so row A is again pitch-facing (top-most / left-most).
  const orderedRows = side === "north" || side === "west" ? rows.slice().reverse() : rows;

  // The "frame" is the per-block rectangle: light fill for terraces, slightly
  // darker for all-seater main-stand blocks, with a navy roof stripe on the
  // seated blocks.
  const frameClass = block.isSeated
    ? "relative rounded-md bg-stone-200 shadow-[inset_0_2px_0_rgba(0,0,0,0.08)] ring-1 ring-stone-300"
    : "relative rounded-md bg-white/65 ring-1 ring-stone-200";

  const frame = (
    <div className={frameClass} style={{ padding: STAND_PADDING }}>
      {block.isSeated && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-1 top-0 h-1 rounded-t-md bg-sfc-navy/85"
        />
      )}
      {!horizontal && <BlockLabel block={block} side={side} />}
      <div
        className={
          horizontal
            ? "flex flex-col items-center"
            : "flex h-full items-stretch"
        }
        style={{
          gap: SEAT_GAP,
          // Anchor pitch-facing edge to the pitch.
          justifyContent: side === "north"
            ? "flex-end"
            : side === "south"
              ? "flex-start"
              : side === "west"
                ? "flex-end"
                : "flex-start",
          height: horizontal ? "100%" : undefined,
        }}
      >
        {orderedRows.map((row) => (
          <SeatRow
            key={row}
            block={block}
            row={row}
            direction={horizontal ? "row" : "col"}
            booked={booked}
            selected={selected}
            toggle={toggle}
          />
        ))}
      </div>
    </div>
  );

  // For north/south, render the label as a sibling row above (north) or
  // below (south) the seat frame so it always has its own dedicated space
  // and never overlaps seats — even when the bowl is CSS-zoomed on phones.
  if (horizontal) {
    return (
      <div className="flex flex-col items-stretch">
        {side === "north" && <OutsideLabel block={block} />}
        {frame}
        {side === "south" && <OutsideLabel block={block} />}
      </div>
    );
  }
  return frame;
}

// Sibling-row label for north/south sides — sits above (north) or below
// (south) the seat frame in its own row, never inside the seat strip.
function OutsideLabel({ block }: { block: BlockConfig }) {
  return (
    <span
      className={`block text-center text-[9px] font-bold uppercase tracking-[0.16em] leading-[1] py-1 ${
        block.isSeated ? "text-sfc-navy" : "text-stone-500"
      }`}
    >
      {block.short ?? block.name}
    </span>
  );
}

function BlockLabel({
  block,
  side,
}: {
  block: BlockConfig;
  side: "north" | "south" | "east" | "west";
}) {
  // The bowl gets CSS-zoomed on phone-width viewports (often below 0.5x),
  // and iOS Safari enforces a minimum on-screen font size that leaves the
  // labels too big for the zoomed-down seats — they end up overlapping the
  // seat tiles. Hide labels on mobile and only show them at sm+.
  const cls = `pointer-events-none absolute hidden sm:block text-[8px] font-bold uppercase tracking-[0.18em] [-webkit-text-size-adjust:100%] ${
    block.isSeated ? "text-sfc-navy" : "text-stone-400"
  }`;
  if (side === "north" || side === "south") {
    return (
      <span
        className={cls}
        style={{
          top: side === "north" ? 1 : undefined,
          bottom: side === "south" ? 1 : undefined,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        {block.short ?? block.name}
      </span>
    );
  }
  return (
    <span
      className={cls}
      style={{
        top: "50%",
        left: 4,
        transform: "translateY(-50%) rotate(-90deg)",
        transformOrigin: "left center",
        whiteSpace: "nowrap",
      }}
    >
      {block.short ?? block.name}
    </span>
  );
}

function SeatRow({
  block,
  row,
  direction,
  booked,
  selected,
  toggle,
}: {
  block: BlockConfig;
  row: string;
  direction: "row" | "col";
  booked: Set<string>;
  selected: Set<string>;
  toggle: (id: string) => void;
}) {
  return (
    <div
      className={direction === "row" ? "flex" : "flex flex-col"}
      style={{ gap: SEAT_GAP }}
    >
      {colsOf(block).map((col) => {
        const id = seatId(block.id, row, col);
        const isBooked = booked.has(id);
        const isSelected = selected.has(id);
        return (
          <SeatBtn
            key={id}
            id={id}
            label={col.toString()}
            booked={isBooked}
            selected={isSelected}
            seated={block.isSeated}
            side={block.side}
            onClick={() => toggle(id)}
          />
        );
      })}
    </div>
  );
}

function SeatBtn({
  id,
  label,
  booked,
  selected,
  seated,
  side,
  onClick,
}: {
  id: string;
  label: string;
  booked: boolean;
  selected: boolean;
  seated: boolean;
  side: "north" | "south" | "east" | "west";
  onClick: () => void;
}) {
  // Round the pitch-facing edge of the seat so seats look like they "face"
  // the pitch (the rounded edge is on the pitch side).
  const facingClass =
    side === "north"
      ? "rounded-b-md"
      : side === "south"
        ? "rounded-t-md"
        : side === "west"
          ? "rounded-r-md"
          : "rounded-l-md";

  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Seat ${id}${booked ? " (taken)" : ""}`}
      aria-pressed={selected}
      disabled={booked}
      whileHover={reduce || booked ? undefined : { scale: 1.08 }}
      whileTap={reduce || booked ? undefined : { scale: 0.88 }}
      animate={
        reduce || booked
          ? undefined
          : selected
            ? { scale: [1, 1.18, 1] }
            : { scale: 1 }
      }
      transition={
        selected
          ? { duration: 0.32, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
          : { type: "spring", stiffness: 600, damping: 26 }
      }
      className={[
        "flex items-center justify-center",
        facingClass,
        "border text-[7px] sm:text-[9px] font-semibold leading-none",
        booked
          ? "cursor-not-allowed border-sfc-n-300 bg-sfc-n-200 text-sfc-n-400"
          : selected
            ? "border-sfc-navy-deep bg-sfc-navy text-white shadow-sm"
            : seated
              ? "border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200"
              : "border-sfc-n-300 bg-white text-sfc-n-600 hover:bg-sfc-n-100",
      ].join(" ")}
      style={{ width: SEAT_PX, height: SEAT_PX }}
    >
      <span className="sr-only">{id}</span>
      {booked ? (
        // SVG × scales cleanly with the seat tile and never overflows the
        // border the way the text "×" character did at small sizes.
        <svg
          aria-hidden
          viewBox="0 0 10 10"
          className="text-sfc-n-500"
          style={{ width: SEAT_PX * 0.5, height: SEAT_PX * 0.5 }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M2.5 2.5 L7.5 7.5" />
          <path d="M7.5 2.5 L2.5 7.5" />
        </svg>
      ) : (
        <span aria-hidden className="hidden sm:inline">
          {label}
        </span>
      )}
    </motion.button>
  );
}

function Pitch() {
  // Landscape pitch: long axis horizontal, goals on the left and right ends.
  // viewBox is 156×100, the real FA-regulation 105m × 68m ratio (≈1.54).
  // The container is forced to a similar ratio by the bowl grid, so
  // preserveAspectRatio="none" only stretches a few percent on either axis.
  return (
    <div className="relative h-full w-full overflow-hidden rounded-md shadow-inner ring-1 ring-emerald-900/30">
      {/* Base turf — diagonal-ish gradient gives a slight depth feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700" />
      {/* Vertical mowing stripes — parallel to the goal-to-goal long axis */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0) 0 36px, rgba(255,255,255,0.10) 36px 72px)",
        }}
      />
      {/* Soft vignette so the centre reads brighter */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 60%)",
        }}
      />
      <svg
        viewBox="0 0 156 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {/* Outer touchline + goal line */}
        <rect
          x="2" y="2" width="152" height="96"
          fill="none" stroke="white" strokeWidth="0.45" strokeOpacity="0.9"
        />
        {/* Halfway line + centre circle + centre spot */}
        <line x1="78" y1="2" x2="78" y2="98" stroke="white" strokeWidth="0.35" strokeOpacity="0.9" />
        <circle cx="78" cy="50" r="9.15" fill="none" stroke="white" strokeWidth="0.35" strokeOpacity="0.9" />
        <circle cx="78" cy="50" r="0.7" fill="white" />

        {/* Left penalty area (16.5m × 40.3m) and goal area (5.5m × 18.3m) */}
        <rect x="2"  y="29.85" width="16.5" height="40.3" fill="none" stroke="white" strokeWidth="0.35" strokeOpacity="0.9" />
        <rect x="2"  y="40.85" width="5.5"  height="18.3" fill="none" stroke="white" strokeWidth="0.35" strokeOpacity="0.9" />
        <circle cx="13" cy="50" r="0.7" fill="white" />
        {/* Left penalty arc — only the part outside the box is drawn (the "D"). */}
        <path
          d="M 19.65,42.85 a 9.15,9.15 0 0 1 0,14.3"
          fill="none" stroke="white" strokeWidth="0.35" strokeOpacity="0.9"
        />

        {/* Right penalty area + goal area */}
        <rect x="137.5" y="29.85" width="16.5" height="40.3" fill="none" stroke="white" strokeWidth="0.35" strokeOpacity="0.9" />
        <rect x="148.5" y="40.85" width="5.5"  height="18.3" fill="none" stroke="white" strokeWidth="0.35" strokeOpacity="0.9" />
        <circle cx="143" cy="50" r="0.7" fill="white" />
        <path
          d="M 136.35,42.85 a 9.15,9.15 0 0 0 0,14.3"
          fill="none" stroke="white" strokeWidth="0.35" strokeOpacity="0.9"
        />

        {/* Corner arcs */}
        <path d="M 2,4 a 2,2 0 0 1 2,-2"     fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.9" />
        <path d="M 154,4 a 2,2 0 0 0 -2,-2"  fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.9" />
        <path d="M 2,96 a 2,2 0 0 0 2,2"     fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.9" />
        <path d="M 154,96 a 2,2 0 0 1 -2,2"  fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.9" />
      </svg>
    </div>
  );
}

function Legend({ currency, locale }: { currency: Currency; locale: Locale }) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-stone-600">
      <Chip className="border-stone-300 bg-white">{t("seats.legend.terrace", locale)}</Chip>
      <Chip className="border-amber-300 bg-amber-100 text-amber-900">
        {t("seats.legend.main-stand", locale, {
          amount: formatMoney(MAIN_STAND_SURCHARGE, currency),
        })}
      </Chip>
      <Chip className="border-sfc-navy-deep bg-sfc-navy text-white">
        {t("seats.legend.selected", locale)}
      </Chip>
      <Chip className="border-stone-300 bg-stone-200 text-stone-400">
        {t("seats.legend.taken", locale)}
      </Chip>
    </div>
  );
}

function Chip({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-3.5 w-3.5 rounded-sm border ${className}`} />
      {children}
    </span>
  );
}

function Summary({
  selected,
  total,
  currency,
  locale,
}: {
  selected: string[];
  total: number;
  currency: Currency;
  locale: Locale;
}) {
  const formatted = formatMoney(total, currency);
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            {t("seats.your-selection", locale)}
          </div>
          <div className="mt-1 text-sm font-semibold text-stone-900 min-h-[1.25rem]">
            <AnimatePresence mode="wait" initial={false}>
              {selected.length === 0 ? (
                <motion.span
                  key="empty"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  className="text-stone-500"
                >
                  {t("seats.no-seats-selected", locale)}
                </motion.span>
              ) : (
                <motion.span
                  key="list"
                  layout
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-1.5"
                >
                  <AnimatePresence initial={false}>
                    {selected.map((id) => (
                      <motion.span
                        key={id}
                        layout
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="inline-flex items-center rounded-md bg-sfc-bone px-1.5 py-0.5 text-[11px] font-mono text-sfc-navy"
                      >
                        {id}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            {t("common.total", locale)}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={formatted}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="text-2xl font-semibold tabular-nums"
            >
              {formatted}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function TierBreakdown({
  seatCount,
  tiers,
  counts,
  setAdult,
  setConcession,
  setUnder17,
  setUnder5,
  countsMatch,
  totalCount,
  currency,
}: {
  seatCount: number;
  tiers: ReturnType<typeof tierPrices>;
  counts: {
    adultCount: number;
    concessionCount: number;
    under17Count: number;
    under5Count: number;
  };
  setAdult: (n: number) => void;
  setConcession: (n: number) => void;
  setUnder17: (n: number) => void;
  setUnder5: (n: number) => void;
  countsMatch: boolean;
  totalCount: number;
  currency: Currency;
}) {
  if (seatCount === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-5 text-sm text-stone-500">
        Pick seats from the map to set ticket types.
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-stone-900">Ticket types</h3>
        <span
          className={`text-xs font-medium ${
            countsMatch ? "text-stone-500" : "text-red-600"
          }`}
        >
          {totalCount} / {seatCount}
        </span>
      </div>
      <p className="mt-1 text-xs text-stone-500">
        Counts must add up to {seatCount} seat{seatCount === 1 ? "" : "s"}.
      </p>
      <ul className="mt-4 space-y-2.5">
        <TierRow label="Adult" price={tiers.adult} value={counts.adultCount} onChange={setAdult} currency={currency} />
        <TierRow label="Concession" price={tiers.concession} value={counts.concessionCount} onChange={setConcession} currency={currency} />
        <TierRow label="Age 5–17" price={tiers.under17} value={counts.under17Count} onChange={setUnder17} currency={currency} />
        <TierRow label="Under 5" price={tiers.under5} value={counts.under5Count} onChange={setUnder5} currency={currency} />
      </ul>
      {!countsMatch && (
        <p className="mt-3 text-xs font-medium text-red-600">
          {totalCount > seatCount
            ? `Trim ${totalCount - seatCount} ticket${totalCount - seatCount === 1 ? "" : "s"}.`
            : `Add ${seatCount - totalCount} more ticket${seatCount - totalCount === 1 ? "" : "s"}.`}
        </p>
      )}
    </div>
  );
}

function TierRow({
  label,
  price,
  value,
  onChange,
  currency,
}: {
  label: string;
  price: number;
  value: number;
  onChange: (n: number) => void;
  currency: Currency;
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium text-stone-900">{label}</div>
        <div className="text-xs text-stone-500">
          {price === 0 ? "Free" : `${formatMoney(price, currency)} each`}
        </div>
      </div>
      <div className="inline-flex items-center gap-2">
        <motion.button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          aria-label={`Reduce ${label}`}
          whileTap={value === 0 ? undefined : { scale: 0.85 }}
          transition={{ type: "spring", stiffness: 500, damping: 26 }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-xl leading-none text-stone-700 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9 sm:text-lg"
        >
          −
        </motion.button>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="w-7 text-center text-base font-semibold tabular-nums sm:w-6 sm:text-sm"
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <motion.button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={`Add ${label}`}
          whileTap={{ scale: 0.85 }}
          transition={{ type: "spring", stiffness: 500, damping: 26 }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-xl leading-none text-stone-700 hover:bg-stone-100 sm:h-9 sm:w-9 sm:text-lg"
        >
          +
        </motion.button>
      </div>
    </li>
  );
}

// ---- payment ----

function QuickPick({
  onPick,
  onClear,
  selectedCount,
  remaining,
  locale,
}: {
  onPick: (n: number) => void;
  onClear: () => void;
  selectedCount: number;
  remaining: number;
  locale: Locale;
}) {
  const presets = [1, 2, 4, 6].filter((n) => n <= remaining);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {t("seats.quick-pick", locale)}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((n) => (
          <motion.button
            key={n}
            type="button"
            onClick={() => onPick(n)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="rounded-full border border-sfc-n-200 bg-sfc-bone px-3 py-1 text-xs font-semibold text-sfc-n-700 hover:border-sfc-navy hover:bg-white hover:text-sfc-navy"
          >
            {t("seats.together", locale, { n })}
          </motion.button>
        ))}
      </div>
      <span className="ms-auto text-xs text-stone-500">
        {selectedCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="font-medium text-stone-700 hover:text-red-600 hover:underline"
          >
            {t("seats.clear", locale, { n: selectedCount })}
          </button>
        ) : (
          <>{t("seats.or-individually", locale)}</>
        )}
      </span>
    </div>
  );
}

function MobileCheckoutBar({
  count,
  total,
  disabled,
  currency,
  locale,
}: {
  count: number;
  total: number;
  disabled: boolean;
  currency: Currency;
  locale: Locale;
}) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-md shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.18)] lg:hidden"
        >
          <div className="mx-auto flex max-w-md items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                {t("pay.mobile-cta-line", locale, {
                  n: count,
                  seats: count === 1 ? t("common.seat", locale) : t("common.seats", locale),
                  amount: formatMoney(total, currency),
                })}
              </div>
              <div className="truncate text-xs text-stone-500">
                {t("pay.mobile-cta-sub", locale)}
              </div>
            </div>
            <motion.a
              href="#checkout"
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className={`sfc-btn sfc-btn--primary sfc-btn--sm ${
                disabled ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {t("common.continue", locale)}
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PayButton({
  total,
  disabled,
  currency,
  locale,
}: {
  total: number;
  disabled: boolean;
  currency: Currency;
  locale: Locale;
}) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;
  const amount = formatMoney(total, currency);

  const press = isDisabled ? undefined : { scale: 0.97 };
  const hover = isDisabled ? undefined : { scale: 1.01 };
  const spring = { type: "spring" as const, stiffness: 380, damping: 26 };

  return (
    <motion.button
      type="submit"
      disabled={isDisabled}
      whileHover={hover}
      whileTap={press}
      transition={spring}
      className="sfc-btn sfc-btn--primary w-full disabled:cursor-not-allowed disabled:bg-sfc-n-300 disabled:shadow-none"
    >
      {pending ? (
        <PendingLabel text={t("pay.pending.continue", locale)} />
      ) : (
        <span>{t("pay.button.continue", locale, { amount })}</span>
      )}
    </motion.button>
  );
}

function PendingLabel({ text, tone }: { text: string; tone?: "dark" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Spinner tone={tone} />
      <span>{text}</span>
    </span>
  );
}

function Spinner({ tone }: { tone?: "dark" }) {
  const stroke = tone === "dark" ? "currentColor" : "currentColor";
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 animate-spin"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={stroke}
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      <input
        {...props}
        className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </label>
  );
}

function sortSeatIds(ids: string[]): string[] {
  const order: Record<string, number> = { W: 0, N: 1, E: 2, S: 3 };
  return [...ids].sort((a, b) => {
    const [sa, ra, ca] = a.split("-");
    const [sb, rb, cb] = b.split("-");
    if (sa !== sb) return (order[sa] ?? 9) - (order[sb] ?? 9);
    if (ra !== rb) return ra.localeCompare(rb);
    return Number(ca) - Number(cb);
  });
}
