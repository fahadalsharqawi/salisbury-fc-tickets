"use client";

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
  { href: "/news", key: "nav.news" },
  { href: "/contact", key: "nav.contact" },
  // /admin intentionally not surfaced — accessible by typing the URL.
] as const;

export default function MobileNav({ locale, currency }: Props) {
  const [open, setOpen] = useState(false);

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
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("nav.open-menu", locale)}
        aria-expanded={open}
        className="press inline-flex h-10 w-10 items-center justify-center rounded-full text-sfc-ink hover:bg-sfc-bone lg:hidden"
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
      </button>

      {/* Sheet — invisible + pointer-events-none when closed so the panel
          can't render visibly even if the slide-out transform fails. */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          open ? "" : "invisible pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Scrim */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-sfc-navy-darker/60 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.menu", locale)}
          className={`absolute end-0 top-0 flex h-full w-[88vw] max-w-sm flex-col rounded-s-3xl bg-white shadow-2xl transition-transform duration-300 ${
            open
              ? "translate-x-0"
              : "translate-x-full rtl:-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-sfc-n-200 bg-sfc-bone px-5 py-4">
            <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-sfc-navy">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("nav.close-menu", locale)}
              className="press inline-flex h-9 w-9 items-center justify-center rounded-full text-sfc-ink hover:bg-sfc-bone"
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
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
            {NAV_KEYS.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-[15px] font-semibold text-sfc-ink hover:bg-sfc-bone"
              >
                {t(n.key, locale)}
              </Link>
            ))}
          </nav>

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
        </div>
      </div>
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
      className="flex items-center gap-1 rounded-full border border-sfc-n-200 bg-sfc-bone p-1"
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
            className={`flex-1 rounded-full px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] transition ${
              isActive
                ? "bg-white text-sfc-navy shadow-[0_1px_2px_rgba(12,22,54,0.08)]"
                : "text-sfc-n-500 hover:text-sfc-ink"
            }`}
          >
            {labels[opt]}
          </button>
        );
      })}
    </form>
  );
}
