"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * Thin gradient progress bar pinned to the top of the viewport. Tracks
 * window scroll progress (0 → 1) and renders the matching width via a
 * spring-smoothed scaleX so it feels physical, not jerky. Reduced-motion
 * users get a plain (non-spring) line.
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      aria-hidden
      style={{
        scaleX: reduce ? scrollYProgress : scaleX,
        transformOrigin: "0% 50%",
        background: "var(--grad-accent)",
      }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left"
    />
  );
}
