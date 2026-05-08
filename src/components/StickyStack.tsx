"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Children, cloneElement, isValidElement, useRef, type ReactElement, type ReactNode } from "react";

/**
 * Webflow-inspired "sticky stacking cards". Each direct child becomes sticky
 * at the top of the viewport with an offset that grows per card, so as the
 * user scrolls, later cards slide up and stack on top of earlier ones. We add
 * a subtle scale-down on outgoing cards via scroll progress.
 *
 * Usage:
 *   <StickyStack offset={80} gap={20}>
 *     <Card />
 *     <Card />
 *   </StickyStack>
 *
 * Each child is rendered inside a position:sticky wrapper — the child itself
 * stays a normal block, no special markup needed.
 */
export default function StickyStack({
  children,
  offset = 88,
  step = 16,
  className,
}: {
  children: ReactNode;
  /** Top offset of the first card when sticky (px). Account for nav height. */
  offset?: number;
  /** Per-card additional offset (px). Higher = more visible stack edge. */
  step?: number;
  className?: string;
}) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement[];
  const total = items.length;
  return (
    <div className={className}>
      {items.map((child, i) => (
        <StickyItem key={i} index={i} total={total} offset={offset} step={step}>
          {child}
        </StickyItem>
      ))}
    </div>
  );
}

function StickyItem({
  index,
  total,
  offset,
  step,
  children,
}: {
  index: number;
  total: number;
  offset: number;
  step: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const isLast = index === total - 1;

  // Track scroll within this card's own viewport range — when the card's top
  // hits the sticky offset, progress = 0; once it's been pushed up by the
  // next card's height, progress = 1.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Outgoing cards (everything except the last) get a soft scale-down as the
  // next card covers them. Last card stays put.
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast || reduce ? 1 : 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, isLast || reduce ? 1 : 0.6]);

  const top = offset + index * step;
  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top, paddingTop: index === 0 ? 0 : step }}
    >
      <motion.div
        style={reduce ? undefined : { scale, opacity }}
        className="origin-top will-change-transform"
      >
        {cloneElement(children as ReactElement)}
      </motion.div>
    </div>
  );
}
