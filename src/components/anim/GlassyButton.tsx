"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Glassmorphism button — translucent fill, blurred background, soft border,
 * and a hover that lifts and brightens. Drop-in replacement for an anchor
 * or a Next.js Link on dark surfaces (the home hero, page bands, etc.).
 */
type Common = {
  children: ReactNode;
  className?: string;
};

export default function GlassyButton({
  href,
  external,
  children,
  className,
}: Common & { href: string; external?: boolean }) {
  const reduce = useReducedMotion();
  const tap = reduce ? undefined : { scale: 0.97 };
  const hover = reduce ? undefined : { y: -2 };
  const spring = { type: "spring" as const, stiffness: 380, damping: 26 };
  const cls =
    "relative inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:bg-white/20 " +
    (className ?? "");

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        whileHover={hover}
        whileTap={tap}
        transition={spring}
        className={cls}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <Link href={href} legacyBehavior={false} passHref={false} className="contents">
      <motion.span
        whileHover={hover}
        whileTap={tap}
        transition={spring}
        className={cls}
      >
        {children}
      </motion.span>
    </Link>
  );
}
