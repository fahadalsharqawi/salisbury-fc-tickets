"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Reveals a string word-by-word with a staggered slide-up, Webflow-style.
 * Reduced-motion users see the plain text rendered as-is. The wrapper
 * preserves the surrounding element's styling (font, color, leading)
 * because the words are inline-block spans inside it.
 */
export default function WordsReveal({
  text,
  className,
  as: As = "h1",
  stagger = 0.08,
  delay = 0.1,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  stagger?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Tag = As as "h1";
    return <Tag className={className}>{text}</Tag>;
  }
  const words = text.split(/(\s+)/); // keep whitespace as separate tokens
  let wordIndex = 0;
  return (
    <As className={className}>
      {words.map((token, i) => {
        if (/^\s+$/.test(token)) return token;
        const idx = wordIndex++;
        return (
          <span key={i} className="inline-block overflow-hidden align-baseline">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "1.1em", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: delay + idx * stagger,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
            >
              {token}
            </motion.span>
          </span>
        );
      })}
    </As>
  );
}
