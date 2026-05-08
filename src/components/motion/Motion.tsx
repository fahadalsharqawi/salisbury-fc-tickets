"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition,
  type Variants,
} from "motion/react";
import { useMemo, type ReactNode } from "react";

const EASE_OUT: Transition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: EASE_OUT },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: EASE_OUT },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: EASE_OUT },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: EASE_OUT },
};

const VARIANTS = { fadeUp, fadeIn, scaleIn, slideRight } as const;
export type MotionVariant = keyof typeof VARIANTS;

// Whitelisted motion-wrapped HTML elements. We only let callers pick from this
// fixed set rather than passing arbitrary components into `motion(...)` at
// render time — that pattern (e.g. `motion(Link)` in a render function) creates
// a new wrapped component on every render and previously caused production
// SSR crashes.
const TAGS = {
  div: motion.div,
  span: motion.span,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  p: motion.p,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  aside: motion.aside,
  nav: motion.nav,
  dl: motion.dl,
  dt: motion.dt,
  dd: motion.dd,
} as const;
type Tag = keyof typeof TAGS;

// ---------- MotionSection ----------
type SectionProps<T extends Tag = "div"> = HTMLMotionProps<T> & {
  variant?: MotionVariant;
  delay?: number;
  as?: T;
  once?: boolean;
};

export function MotionSection<T extends Tag = "div">({
  variant = "fadeUp",
  delay = 0,
  once = true,
  as,
  children,
  ...rest
}: SectionProps<T>) {
  const reduce = useReducedMotion();
  const Component = (TAGS[(as ?? "div") as Tag] as unknown) as typeof motion.div;
  if (reduce) {
    return (
      <Component {...(rest as Record<string, unknown>)}>
        {children}
      </Component>
    );
  }
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      variants={VARIANTS[variant]}
      transition={{ ...EASE_OUT, delay }}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Component>
  );
}

// ---------- MotionStagger ----------
type StaggerProps<T extends Tag = "div"> = HTMLMotionProps<T> & {
  stagger?: number;
  delay?: number;
  once?: boolean;
  as?: T;
};

export function MotionStagger<T extends Tag = "div">({
  stagger = 0.06,
  delay = 0,
  once = true,
  as,
  children,
  ...rest
}: StaggerProps<T>) {
  const reduce = useReducedMotion();
  const variants: Variants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduce ? 0 : stagger,
          delayChildren: reduce ? 0 : delay,
        },
      },
    }),
    [stagger, delay, reduce],
  );
  const Component = (TAGS[(as ?? "div") as Tag] as unknown) as typeof motion.div;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={variants}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Component>
  );
}

// ---------- MotionItem ----------
type ItemProps<T extends Tag = "div"> = HTMLMotionProps<T> & {
  variant?: MotionVariant;
  as?: T;
};

export function MotionItem<T extends Tag = "div">({
  variant = "fadeUp",
  as,
  children,
  ...rest
}: ItemProps<T>) {
  const Component = (TAGS[(as ?? "div") as Tag] as unknown) as typeof motion.div;
  return (
    <Component variants={VARIANTS[variant]} {...(rest as Record<string, unknown>)}>
      {children}
    </Component>
  );
}

// ---------- AnimatePresence re-export for callers ----------
export { AnimatePresence };

// ---------- A safe wrapper for "wrap a Link with a stagger reveal" ----------
// This deliberately renders a motion.div around the children. Use when you
// would otherwise be tempted to do `<MotionItem as={Link}>` — wrap the Link
// inside instead.
export function MotionWrap({
  variant = "fadeUp",
  className,
  children,
  whileHover,
  whileTap,
  transition,
}: {
  variant?: MotionVariant;
  className?: string;
  children: ReactNode;
  whileHover?: HTMLMotionProps<"div">["whileHover"];
  whileTap?: HTMLMotionProps<"div">["whileTap"];
  transition?: HTMLMotionProps<"div">["transition"];
}) {
  return (
    <motion.div
      variants={VARIANTS[variant]}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
