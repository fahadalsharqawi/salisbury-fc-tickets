"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Counts a number from `from` (default 0) up to `to` when the element
 * scrolls into view. Honors `prefers-reduced-motion` by snapping straight
 * to the target. Format strings (e.g. "4,000" or "53") are preserved by
 * formatting inside `format`.
 */
export default function NumberCounter({
  to,
  from = 0,
  duration = 1.4,
  format,
  className,
  suffix,
  prefix,
}: {
  to: number;
  from?: number;
  duration?: number;
  /** Formats the live numeric value. Default: `Math.round(v).toLocaleString()`. */
  format?: (value: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionValue = useMotionValue(reduce ? to : from);
  const fmt = format ?? ((v: number) => Math.round(v).toLocaleString());
  const display = useTransform(motionValue, (v) =>
    `${prefix ?? ""}${fmt(v)}${suffix ?? ""}`,
  );

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      motionValue.set(to);
      return;
    }
    const controls = animate(motionValue, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce, motionValue]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
