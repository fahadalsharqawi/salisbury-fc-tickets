"use client";

import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that watches every `[data-reveal]`
 * element on the page and adds `is-revealed` once it scrolls into view. Any
 * `[data-reveal]` already inside the initial viewport gets revealed on mount,
 * so above-the-fold content still animates on page load.
 *
 * To stagger children:  <div data-reveal style={{ ['--reveal-delay' as string]: `${i*60}ms` }}>
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Reduced-motion users get the final state immediately.
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (seen.has(entry.target)) continue;
          seen.add(entry.target);
          (entry.target as HTMLElement).classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const observe = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)")
        .forEach((el) => io.observe(el));
    };
    observe();

    // Re-scan when the DOM changes (route navigation, dynamic lists).
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
