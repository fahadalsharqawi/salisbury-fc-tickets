"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Spring-hovered card wrapper. On hover the card lifts slightly and its
 * shadow deepens; on tap it presses back down. Same response on touch
 * devices via whileTap.
 *
 * Designed to wrap an existing card layout — it just adds motion to the
 * outer element and otherwise stays out of the way.
 */
export default function MotionCard({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  const reduce = useReducedMotion();
  const hover = reduce
    ? {}
    : {
        y: -4,
        boxShadow:
          "0 18px 36px -18px rgba(12, 22, 54, 0.32), 0 4px 10px -4px rgba(12, 22, 54, 0.18)",
      };
  const tap = reduce ? {} : { y: -1, scale: 0.995 };

  if (href) {
    return (
      <motion.a
        href={href}
        className={className}
        whileHover={hover}
        whileTap={tap}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div
      className={className}
      whileHover={hover}
      whileTap={tap}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      {children}
    </motion.div>
  );
}
