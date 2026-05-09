"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Desktop-only cursor accent — a small dot that follows the pointer
 * exactly, plus a softer ring that lags behind on a spring. Hides itself
 * on touch devices and under prefers-reduced-motion.
 *
 * Mounted once near the root of the layout; uses position:fixed so it
 * lives above all page content but behind menu drawers (z-[55]).
 */
export default function CursorDotTrail() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  // Raw pointer coordinates (no smoothing) for the small dot.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Spring-smoothed coordinates for the trailing ring.
  const ringX = useSpring(x, { stiffness: 220, damping: 24, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 220, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    // Touch / coarse pointer: skip entirely. Also bail on mobile widths.
    if (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 1024
    ) {
      return;
    }
    setEnabled(true);
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{
          translateX: x,
          translateY: y,
          x: "-50%",
          y: "-50%",
        }}
        className="pointer-events-none fixed left-0 top-0 z-[55] h-2 w-2 rounded-full bg-sfc-navy mix-blend-multiply"
      />
      <motion.div
        aria-hidden
        style={{
          translateX: ringX,
          translateY: ringY,
          x: "-50%",
          y: "-50%",
        }}
        className="pointer-events-none fixed left-0 top-0 z-[55] h-9 w-9 rounded-full border border-sfc-navy/40"
      />
    </>
  );
}
