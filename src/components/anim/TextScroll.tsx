"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ElementType, type ReactNode } from "react";

/**
 * Word-by-word reveal as the element enters the viewport. Each word slides
 * up from its line and fades in, staggered so a heading reads in like a
 * sentence. Reduced-motion users see plain text.
 *
 * Pass either `text` (string) or `children` (ReactNode). Strings get
 * tokenized into words; node children are revealed as a single block.
 */
type Props = {
  className?: string;
  as?: ElementType;
  stagger?: number;
  delay?: number;
} & ({ text: string; children?: never } | { children: ReactNode; text?: never });

export default function TextScroll({
  className,
  as: As = "h2",
  stagger = 0.06,
  delay = 0.05,
  ...rest
}: Props) {
  const reduce = useReducedMotion();
  const Tag = As as "h2";
  if (reduce) {
    return <Tag className={className}>{"text" in rest ? rest.text : rest.children}</Tag>;
  }
  if ("text" in rest && rest.text) {
    const words = rest.text.split(/(\s+)/);
    let idx = 0;
    return (
      <Tag className={className}>
        {words.map((token, i) => {
          if (/^\s+$/.test(token)) return token;
          const j = idx++;
          return (
            <span
              key={i}
              className="inline-block overflow-hidden align-baseline"
            >
              <motion.span
                className="inline-block will-change-transform"
                initial={{ y: "1.05em", opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.55,
                  delay: delay + j * stagger,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              >
                {token}
              </motion.span>
            </span>
          );
        })}
      </Tag>
    );
  }
  return (
    <motion.h2
      className={className}
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
    >
      {(rest as { children: ReactNode }).children}
    </motion.h2>
  );
}
