"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
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
  isAuthed: boolean;
  displayName: string | null;
  signOutAction: (formData: FormData) => Promise<void>;
};

// Primary destinations — large bold links at the top of the drawer.
const PRIMARY = [
  { href: "/tickets", key: "nav.fixtures" },
  { href: "/club", key: "nav.club" },
  { href: "/club/hospitality", key: "nav.hospitality" },
  { href: "/news", key: "nav.news" },
  { href: "/contact", key: "nav.contact" },
] as const;

// Secondary destinations — slimmer rows below the promo banner.
const SECONDARY = [
  { href: "/live-commentaries", key: "nav.live-commentaries" },
] as const;

export default function MobileNav({
  locale,
  currency,
  isAuthed,
  displayName,
  signOutAction,
}: Props) {
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
              className="absolute end-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl rtl:end-auto rtl:start-0"
            >
              {/* Header — close (X), crest, and Sign in / Sign out pill */}
              <div className="flex items-center gap-3 border-b border-sfc-n-100 px-4 py-3">
                <motion.button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("nav.close-menu", locale)}
                  whileTap={reduce ? undefined : { scale: 0.9, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sfc-ink hover:bg-sfc-bone"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </motion.button>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center"
                  aria-label={t("brand.name", locale)}
                >
                  <Image
                    src="/logo.png"
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9"
                  />
                </Link>
                <div className="ms-auto">
                  {isAuthed ? (
                    <form action={signOutAction}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-full border border-sfc-navy/30 px-3.5 py-1.5 text-[13px] font-semibold text-sfc-navy transition hover:bg-sfc-navy hover:text-white"
                      >
                        <UserGlyph />
                        {displayName ? truncate(displayName, 14) : "Sign out"}
                      </button>
                    </form>
                  ) : (
                    <Link
                      href="/sign-in"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-sfc-navy/30 px-3.5 py-1.5 text-[13px] font-semibold text-sfc-navy transition hover:bg-sfc-navy hover:text-white"
                    >
                      <UserGlyph />
                      Sign in
                    </Link>
                  )}
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto">
                {/* Primary nav — large bold list */}
                <nav className="flex flex-col">
                  {PRIMARY.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="sfc-display flex items-center justify-between border-b border-sfc-n-100 px-5 py-5 text-[22px] font-bold tracking-[-0.01em] text-sfc-ink transition active:bg-sfc-bone"
                    >
                      <span>{t(n.key, locale)}</span>
                      <Chevron />
                    </Link>
                  ))}
                </nav>

                {/* Promo banner — gradient with CTA */}
                <Link
                  href="/tickets"
                  onClick={() => setOpen(false)}
                  className="relative mx-5 my-5 block overflow-hidden rounded-2xl"
                >
                  <div
                    className="relative px-5 py-6 text-white"
                    style={{ background: "var(--grad-band)" }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(ellipse at 90% 20%, rgba(184,212,232,0.55), transparent 60%)",
                      }}
                    />
                    <div className="relative flex items-center gap-4">
                      <Image
                        src="/logo.png"
                        alt=""
                        width={56}
                        height={56}
                        className="h-14 w-14 shrink-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
                      />
                      <div className="min-w-0">
                        <div className="sfc-display text-[18px] font-bold leading-tight">
                          {t("hero.pick-a-seat", locale)}
                        </div>
                        <div className="mt-0.5 text-[12px] text-sfc-sky-light">
                          {t("hero.tickets-on-sale", locale)}
                        </div>
                      </div>
                      <span aria-hidden className="ms-auto text-2xl">→</span>
                    </div>
                  </div>
                </Link>

                {/* Secondary nav — slimmer rows */}
                <nav className="flex flex-col border-t border-sfc-n-100">
                  {SECONDARY.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="sfc-display flex items-center justify-between border-b border-sfc-n-100 px-5 py-4 text-[16px] font-bold text-sfc-ink transition active:bg-sfc-bone"
                    >
                      <span>{t(n.key, locale)}</span>
                      <Chevron />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Bottom strip — locale + currency pills */}
              <div className="space-y-2.5 border-t border-sfc-n-100 bg-sfc-bone px-5 py-4">
                <PillForm
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function Chevron() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="text-sfc-n-400 rtl:scale-x-[-1]"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function UserGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}

function PillForm({
  action,
  name,
  options,
  active,
  labels,
  onSubmit,
}: {
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
      className="relative flex items-center gap-1 rounded-full border border-sfc-n-200 bg-white p-1"
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
                className="absolute inset-0 z-[-1] rounded-full bg-sfc-bone shadow-[0_1px_2px_rgba(12,22,54,0.08)]"
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
