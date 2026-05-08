import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Noto_Sans_Arabic, Oswald } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { setCurrencyAction, setLocaleAction } from "@/lib/actions";
import MobileNav from "@/components/MobileNav";
import ScrollReveal from "@/components/ScrollReveal";
import SitePreloader from "@/components/SitePreloader";
import { signOutAction } from "@/lib/auth";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { getCurrency } from "@/lib/currency-server";
import {
  LOCALE_DIR,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  t,
} from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Salisbury FC — match tickets",
  description: "Reserve your seat for the Whites' next fixture.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1F4A6B",
};

type Partner = { name: string; logo: string; href?: string };

const PARTNERS: Partner[] = [
  { name: "Retain Healthcare", logo: "/partners/retain-healthcare.png", href: "https://retainhealthcare.co.uk" },
  { name: "Cara Glass", logo: "/partners/cara-glass.jpg" },
  { name: "Complete Construction", logo: "/partners/complete-construction.png" },
  { name: "The Boss Corporation", logo: "/partners/the-boss.png" },
  { name: "New Hall Hospital", logo: "/partners/new-hall.png" },
  { name: "TIC Health", logo: "/partners/tic-health.png" },
  { name: "DAZN", logo: "/partners/dazn.png", href: "https://www.dazn.com" },
  { name: "Enterprise", logo: "/partners/enterprise.png", href: "https://www.enterprise.co.uk" },
  { name: "Mitre", logo: "/partners/mitre.png", href: "https://www.mitre.com" },
  { name: "Erreà", logo: "/partners/errea.jpg", href: "https://www.errea.com" },
];

const SOCIALS = [
  { name: "X", href: "https://x.com/SalisburyFC", path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" },
  { name: "Facebook", href: "https://www.facebook.com/SalisburyFCOfficial", path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" },
  { name: "Instagram", href: "https://www.instagram.com/salisburyfc", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" },
  { name: "TikTok", href: "https://www.tiktok.com/@salisburyfc", path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" },
  { name: "YouTube", href: "https://www.youtube.com/@SalisburyFC", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
];

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const currency = await getCurrency();
  const locale = await getLocale();
  // getClaims() validates the JWT locally via the project's JWKS (no network round-trip
  // for asymmetric ES256 keys, which the project uses) — getUser() would hit the Auth
  // server on every render.
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  const user = claims ? { id: claims.sub } : null;
  const displayName =
    ((claims?.user_metadata as Record<string, unknown> | undefined)?.name as
      | string
      | undefined) ??
    (claims?.email as string | undefined) ??
    null;
  return (
    <html
      lang={locale}
      dir={LOCALE_DIR[locale]}
      className={`${inter.variable} ${oswald.variable} ${manrope.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-sfc-ink">
        <SitePreloader />
        <ScrollReveal />
        <header className="sticky top-0 z-50 border-b border-sfc-n-200/70 bg-white/85 backdrop-blur-md">
          <div className="sfc-container flex h-16 items-center gap-3 sm:h-[72px]">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={t("nav.crest-alt", locale)}
                width={44}
                height={44}
                priority
                className="h-11 w-11"
              />
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="text-[15px] font-bold tracking-tight text-sfc-ink">
                  {t("brand.name", locale)}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sfc-n-500">
                  {t("brand.tagline", locale)}
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex lg:ms-6">
              <NavLink href="/tickets">{t("nav.fixtures", locale)}</NavLink>
              <NavLink href="/club">{t("nav.club", locale)}</NavLink>
              <NavLink href="/news">{t("nav.news", locale)}</NavLink>
              <NavLink href="/contact">{t("nav.contact", locale)}</NavLink>
              {/* /admin intentionally not linked — accessible by typing the URL. */}
            </nav>

            <div className="ms-auto flex items-center gap-2">
              <PillForm
                action={setLocaleAction}
                name="locale"
                options={SUPPORTED_LOCALES}
                active={locale}
                labels={LOCALE_LABELS}
              />
              <PillForm
                action={setCurrencyAction}
                name="currency"
                options={SUPPORTED_CURRENCIES}
                active={currency}
                labels={Object.fromEntries(
                  SUPPORTED_CURRENCIES.map((c) => [c, c]),
                ) as Record<string, string>}
              />
              {user ? (
                <form action={signOutAction} className="hidden sm:flex sm:items-center sm:gap-2">
                  <span
                    className="max-w-[140px] truncate text-xs font-medium text-sfc-n-600"
                    title={displayName ?? undefined}
                  >
                    {displayName}
                  </span>
                  <button
                    type="submit"
                    className="sfc-btn sfc-btn--ghost sfc-btn--sm"
                  >
                    Sign out
                  </button>
                </form>
              ) : (
                <Link
                  href="/sign-in"
                  className="sfc-btn sfc-btn--ghost sfc-btn--sm hidden sm:inline-flex"
                >
                  Sign in
                </Link>
              )}
              <Link
                href="/tickets"
                className="sfc-btn sfc-btn--live sfc-btn--sm hidden sm:inline-flex"
              >
                {t("nav.fixtures", locale)}
              </Link>
              <MobileNav locale={locale} currency={currency} />
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-sfc-navy-darker text-white">
          {/* Partners band */}
          <div className="bg-sfc-bone py-12">
            <div className="sfc-container">
              <div className="text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-sfc-n-500" style={{ fontFamily: "var(--ff-display)" }}>
                {t("footer.partners", locale)}
              </div>
              <div className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
                {PARTNERS.map((p) => (
                  <a
                    key={p.name}
                    href={p.href ?? "#"}
                    target={p.href ? "_blank" : undefined}
                    rel={p.href ? "noreferrer noopener" : undefined}
                    className="group flex h-14 items-center justify-center"
                    aria-label={p.name}
                    title={p.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.logo}
                      alt={p.name}
                      width={140}
                      height={56}
                      loading="lazy"
                      className="max-h-14 w-auto max-w-[140px] object-contain opacity-80 transition group-hover:opacity-100"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Footer info */}
          <div className="sfc-container grid gap-10 px-6 py-12 lg:grid-cols-[1fr_2fr]">
            <div className="flex gap-4">
              <Image
                src="/logo.png"
                alt={t("nav.crest-alt", locale)}
                width={80}
                height={80}
                className="h-20 w-20 flex-none"
              />
              <div>
                <div className="sfc-display text-lg font-bold">{t("brand.name", locale)}</div>
                <p className="mt-2 text-sm leading-relaxed text-sfc-sky-light">
                  Raymond McEnhill Stadium<br />
                  Partridge Way, Old Sarum<br />
                  Salisbury, SP4 6PU
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-end">
              <div className="flex items-center gap-5">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.name}
                    className="text-white/70 transition hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Legal strip */}
          <div className="border-t border-white/10">
            <div className="sfc-container flex flex-col gap-2 px-6 py-4 text-[12px] text-sfc-n-400 sm:flex-row sm:justify-between">
              <span>{t("footer.disclaimer", locale)}</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-sfc-n-700 transition hover:bg-sfc-bone hover:text-sfc-navy"
    >
      {children}
    </Link>
  );
}

function PillForm({
  action,
  name,
  options,
  active,
  labels,
}: {
  action: (formData: FormData) => Promise<void>;
  name: string;
  options: readonly string[];
  active: string;
  labels: Record<string, string>;
}) {
  return (
    <form
      action={action}
      className="hidden items-center gap-0.5 rounded-full border border-sfc-n-200 bg-sfc-bone p-0.5 sm:flex"
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
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] transition ${
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
