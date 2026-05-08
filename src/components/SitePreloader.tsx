"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * One-time logo preloader. Sticks around for ~700ms on first visit, then
 * fades out. Persists a flag in sessionStorage so it doesn't replay on every
 * client-side navigation. Webflow-inspired "Site Preloader" pattern.
 *
 * Renders a fixed full-screen overlay above everything; pointer-events become
 * none after exit so it never blocks the page.
 */
export default function SitePreloader() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reduce) return;
    try {
      if (sessionStorage.getItem("sfc-preload-shown") === "1") return;
      sessionStorage.setItem("sfc-preload-shown", "1");
    } catch {
      // sessionStorage may be unavailable (private mode, sandboxed iframes).
      // Fall through and still show the preloader once for this mount.
    }
    setShow(true);
    const t = setTimeout(() => setShow(false), 900);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-sfc-navy-deep via-sfc-navy to-sfc-navy-darker"
          aria-hidden
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.15, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="flex flex-col items-center"
          >
            <Image
              src="/logo.png"
              alt=""
              width={96}
              height={96}
              priority
              className="h-24 w-24 drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            />
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4 }}
              className="sfc-display mt-4 text-[11px] font-bold uppercase tracking-[0.4em] text-white/80"
            >
              Salisbury FC
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
