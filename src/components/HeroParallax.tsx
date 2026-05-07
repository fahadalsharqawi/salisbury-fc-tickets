"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * Parallax diagonal grid lines for the home hero. As the page scrolls the
 * grid drifts upward at ~30% of scroll speed, giving the hero a subtle
 * "depth" feel without intruding on the actual content.
 *
 * Renders the same linear-gradient pattern that was previously a static
 * pseudo-element. Drop-in replacement.
 */
export default function HeroParallax({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  // Translate up to 120px upward across the first 600px of scroll. After
  // that we leave it parked — no point computing past the hero.
  const y = useTransform(scrollY, [0, 600], [0, prefersReducedMotion ? 0 : -120]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={className}
      style={{
        y,
        backgroundImage:
          "linear-gradient(135deg, white 1px, transparent 1px), linear-gradient(45deg, white 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}
