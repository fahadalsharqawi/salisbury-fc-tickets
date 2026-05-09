"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { type ReactNode, type CSSProperties, useRef } from "react";

/**
 * 3D tilt-on-hover card. Tracks the cursor over the card and rotates around
 * X/Y axes for a parallax feel. Reduced-motion users and touch devices fall
 * back to a static container.
 *
 * Wraps `children` in a motion.div without imposing layout — pass any
 * className for sizing / borders / shadow, the same way you'd wrap
 * `<MotionItem>`.
 */
export default function TiltCard({
  children,
  className,
  intensity = 8,
  style,
}: {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees on each axis. Higher = more tilt. */
  intensity?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0); // -0.5 ... 0.5
  const y = useMotionValue(0);
  const rx = useSpring(y, { stiffness: 200, damping: 22 });
  const ry = useSpring(x, { stiffness: 200, damping: 22 });

  const transform = useMotionTemplate`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        // Rotate inversely on Y to match natural feel: cursor right → tilt right.
        x.set(px * intensity);
        y.set(-py * intensity);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ transform, transformStyle: "preserve-3d", ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
