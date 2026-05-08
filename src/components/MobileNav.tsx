"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Currency } from "@/lib/format";
import { setCurrencyAction, setLocaleAction } from "@/lib/actions";
import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  t,
  type Locale,
} from "@/lib/i18n";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

type Props = {
  locale: Locale;
  currency: Currency;
};

const NAV_KEYS = [
  { href: "/tickets", key: "nav.fixtures" },
  { href: "/club", key: "nav.club" },
  { href: "/club/hospitality", key: "nav.hospitality" },
  { href: "/live-commentaries", key: "nav.live-commentaries" },
  { href: "/news", key: "nav.news" },
  { href: "/contact", key: "nav.contact" },
] as const;

const linkItem: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function MobileNav({ locale, currency }: Props) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkStagger: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.04,
        delayChildren: reduce ? 0 : 0.08,
      },
    },
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("nav.open-menu", locale)}
        aria-expanded={open}
        whileTap={reduce ? undefined : { scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sfc-ink hover:bg-sfc-bone lg:hidden"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-sfc-navy-darker/60 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("nav.menu", locale)}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute end-0 top-0 flex h-full w-[88vw] max-w-sm flex-col rounded-s-3xl bg-gradient-to-b from-white via-sfc-sky-light/30 to-sfc-sky-light shadow-2xl rtl:end-auto rtl:start-0 rtl:rounded-e-3xl rtl:rounded-s-none"
            >
              <div className="flex items-center justify-between border-b border-sfc-n-200 bg-sfc-bone px-5 py-4">
                <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-sfc-navy">
                  Menu
                </span>
                <motion.button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("nav.close-menu", locale)}
                  whileTap={reduce ? undefined : { scale: 0.9, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sfc-ink hover:bg-sfc-bone"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </motion.button>
              </div>

              <motion.nav
                variants={linkStagger}
                initial="hidden"
                animate="visible"
                className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
              >
                {NAV_KEYS.map((n) => (
                  <motion.div key={n.href} variants={linkItem}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 text-[15px] font-semibold text-sfc-ink hover:bg-sfc-bone"
                    >
                      {t(n.key, locale)}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              <div className="space-y-3 border-t border-sfc-n-200 px-5 py-4">
                <PillForm
                  label={t("nav.menu", locale)}
                  action={setLocaleAction}
                  name="locale"
                  options={SUPPORTED_LOCALES}
                  active={locale}
                  labels={LOCALE_LABELS}
                  onSubmit={() => setOpen(false)}
                />
                <PillForm
                  action={setCurrencyAction}
                  name="currency"
                  options={SUPPORTED_CURRENCIES}
                  active={currency}
                  labels={Object.fromEntries(
                    SUPPORTED_CURRENCIES.map((c) => [c, c]),
                  ) as Record<string, string>}
                  onSubmit={() => setOpen(false)}
                />
                <Link
                  href="/tickets"
                  onClick={() => setOpen(false)}
                  className="sfc-btn sfc-btn--primary press w-full"
                >
                  {t("nav.fixtures", locale)}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function PillForm({
  action,
  name,
  options,
  active,
  labels,
  onSubmit,
}: {
  label?: string;
  action: (formData: FormData) => Promise<void>;
  name: string;
  options: readonly string[];
  active: string;
  labels: Record<string, string>;
  onSubmit?: () => void;
}) {
  return (
    <form
      action={action}
      onSubmit={onSubmit}
      className="relative flex items-center gap-1 rounded-full border border-sfc-n-200 bg-sfc-bone p-1"
    >
      {options.map((opt) => {
        const isActive = active === opt;
        return (
          <button
            key={opt}
            type="submit"
            name={name}
            value={opt}
            aria-pressed={isActive}
            className={`relative flex-1 rounded-full px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] transition ${
              isActive ? "text-sfc-navy" : "text-sfc-n-500 hover:text-sfc-ink"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={`mobile-pill-${name}`}
                aria-hidden
                className="absolute inset-0 z-[-1] rounded-full bg-white shadow-[0_1px_2px_rgba(12,22,54,0.08)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {labels[opt]}
          </button>
        );
      })}
    </form>
  );
}
