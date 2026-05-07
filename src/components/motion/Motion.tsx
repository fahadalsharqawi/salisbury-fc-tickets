"use client";

import {
  AnimatePresence,
  type HTMLMotionProps,
  type Transition,
  type Variants,
  motion,
  useReducedMotion,
} from "motion/react";
import { usePathname } from "next/navigation";
import {
  type ComponentProps,
  type ElementType,
  type ReactNode,
  useMemo,
} from "react";

const SPRING: Transition = { type: "spring", stiffness: 320, damping: 30, mass: 0.6 };
const EASE_OUT: Transition = { duration: 0.45, ease: [0.16, 1, 0.3, 1] };
const QUICK: Transition = { duration: 0.22, ease: [0.16, 1, 0.3, 1] };

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

type SectionProps = HTMLMotionProps<"div"> & {
  variant?: MotionVariant;
  delay?: number;
  as?: ElementType;
  once?: boolean;
};

export function MotionSection({
  variant = "fadeUp",
  delay = 0,
  once = true,
  as,
  children,
  ...rest
}: SectionProps) {
  const reduce = useReducedMotion();
  const Component = as
    ? (motion(as) as typeof motion.div)
    : motion.div;
  if (reduce) {
    return <Component {...rest}>{children}</Component>;
  }
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      variants={VARIANTS[variant]}
      transition={{ ...EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delay?: number;
  once?: boolean;
  as?: ElementType;
};

export function MotionStagger({
  stagger = 0.06,
  delay = 0,
  once = true,
  as,
  children,
  ...rest
}: StaggerProps) {
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
  const Component = as
    ? (motion(as) as typeof motion.div)
    : motion.div;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={variants}
      {...rest}
    >
      {children}
    </Component>
  );
}

type ItemProps = HTMLMotionProps<"div"> & {
  variant?: MotionVariant;
  as?: ElementType;
  // Allow extra props (e.g. `href` when as={Link}) to pass through.
  [key: string]: unknown;
};

export function MotionItem({
  variant = "fadeUp",
  as,
  children,
  ...rest
}: ItemProps) {
  const Component = as
    ? (motion(as) as typeof motion.div)
    : motion.div;
  return (
    <Component variants={VARIANTS[variant]} {...(rest as Record<string, unknown>)}>
      {children}
    </Component>
  );
}

type PressProps = ComponentProps<typeof motion.button> & {
  scale?: number;
  lift?: number;
};

export function MotionPress({
  scale = 0.97,
  lift = 0,
  children,
  ...rest
}: PressProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      whileHover={reduce ? undefined : lift ? { y: lift } : undefined}
      whileTap={reduce ? undefined : { scale }}
      transition={SPRING}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

type PageTransitionProps = { children: ReactNode };

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={QUICK}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
