import Link from "next/link";
import { submitContactAction } from "@/lib/actions";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

const PHONE = "01722 776655";
const PHONE_INTL = "+441722776655";
const EMAIL = "info@salisburyfc.co.uk";
const ADDRESS_LINE_1 = "Raymond McEnhill Stadium";
const ADDRESS_LINE_2 = "Partridge Way, Old Sarum";
const ADDRESS_LINE_3 = "Salisbury, SP4 6PU";
const MAP_QUERY = "Raymond McEnhill Stadium Salisbury";

type SearchParams = { error?: string; sent?: string };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { error, sent } = await searchParams;
  const locale = await getLocale();

  return (
    <>
      {/* Page strip */}
      <div className="sfc-band">
        <div className="sfc-container py-8">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">
            {t("contact.eyebrow", locale)}
          </div>
          <h1 className="sfc-display mt-2 text-[clamp(2.25rem,5vw,4rem)]">
            {t("contact.title", locale)}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            {t("contact.subtitle", locale)}
          </p>
        </div>
      </div>

      <div className="sfc-container py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Left column — info */}
          <div className="flex flex-col gap-6">
            <section className="anim-fade-up rounded-2xl border border-sfc-n-200 bg-white p-7">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                {t("contact.club-office", locale)}
              </h2>

              <dl className="mt-6 space-y-5 text-sm">
                <InfoRow icon="pin" label={t("contact.address", locale)}>
                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sfc-ink hover:text-sfc-navy hover:underline hover:underline-offset-4"
                  >
                    {ADDRESS_LINE_1}
                    <br />
                    {ADDRESS_LINE_2}
                    <br />
                    {ADDRESS_LINE_3}
                  </a>
                </InfoRow>
                <InfoRow icon="phone" label={t("contact.phone", locale)}>
                  <a
                    href={`tel:${PHONE_INTL}`}
                    className="text-sfc-ink hover:text-sfc-navy"
                    dir="ltr"
                  >
                    {PHONE}
                  </a>
                </InfoRow>
                <InfoRow icon="mail" label={t("contact.email", locale)}>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-sfc-ink hover:text-sfc-navy"
                    dir="ltr"
                  >
                    {EMAIL}
                  </a>
                </InfoRow>
                <InfoRow icon="clock" label={t("contact.hours", locale)}>
                  <span className="text-sfc-n-700">
                    {t("contact.hours-weekdays", locale)}
                    <br />
                    {t("contact.hours-matchday", locale)}
                  </span>
                </InfoRow>
              </dl>
            </section>

            {/* Map placeholder */}
            <section className="anim-fade-up overflow-hidden rounded-2xl border border-sfc-n-200">
              <a
                href={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="group relative block aspect-[16/10] bg-gradient-to-br from-sfc-navy via-sfc-navy-deep to-sfc-navy-darker"
              >
                <div
                  className="absolute inset-0 opacity-[0.18]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 22px)",
                  }}
                />
                {/* Pin */}
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <span className="block grid h-12 w-12 place-items-center rounded-full bg-sfc-live shadow-[0_8px_22px_-8px_rgba(217,52,43,0.7)] ring-4 ring-white/40">
                    <span className="block h-3 w-3 rounded-full bg-white" />
                  </span>
                </span>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sfc-navy-darker via-sfc-navy-darker/40 to-transparent">
                  <div className="flex items-end justify-between gap-3 px-5 py-4 text-white">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-sfc-sky-light">
                        {t("contact.find-us", locale)}
                      </div>
                      <div className="mt-1 font-semibold">
                        {ADDRESS_LINE_1}
                      </div>
                    </div>
                    <span className="text-[12px] font-semibold text-sfc-sky-light transition group-hover:text-white">
                      {t("contact.directions", locale)} →
                    </span>
                  </div>
                </div>
              </a>
            </section>
          </div>

          {/* Right column — form */}
          <section className="anim-fade-up rounded-2xl border border-sfc-n-200 bg-white p-7 sm:p-9">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              {t("contact.send-message", locale)}
            </h2>
            <p className="mt-2 text-sm text-sfc-n-600">
              {t("contact.form-help", locale)}
            </p>

            {sent ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
                <div className="text-base font-semibold">
                  {t("contact.thanks", locale, { name: sent })}
                </div>
                <p className="mt-1 text-sm">
                  {t("contact.thanks-body", locale)}
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-block text-[12px] font-semibold uppercase tracking-[0.14em] text-sfc-navy hover:underline hover:underline-offset-4"
                >
                  {t("contact.send-another", locale)} →
                </Link>
              </div>
            ) : (
              <form action={submitContactAction} className="mt-6 grid gap-4">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label={t("contact.field.name", locale)}
                    name="contactName"
                    required
                    autoComplete="name"
                  />
                  <Field
                    label={t("contact.field.email", locale)}
                    name="contactEmail"
                    type="email"
                    required
                    autoComplete="email"
                  />
                </div>
                <Field
                  label={t("contact.field.subject", locale)}
                  name="contactSubject"
                  required
                />
                <label className="block text-sm font-semibold text-sfc-n-700">
                  {t("contact.field.message", locale)}
                  <textarea
                    name="contactMessage"
                    rows={6}
                    required
                    placeholder={t("contact.field.message-placeholder", locale)}
                    className="mt-1.5 w-full rounded-xl border border-sfc-n-300 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-sfc-navy focus:outline-none focus:ring-2 focus:ring-sfc-sky-light"
                  />
                </label>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-sfc-n-500">
                    {t("contact.demo-note", locale)}
                  </p>
                  <button type="submit" className="sfc-btn sfc-btn--primary press">
                    {t("contact.send", locale)}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: "pin" | "phone" | "mail" | "clock";
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[40px_1fr] items-start gap-3">
      <span
        aria-hidden
        className="mt-0.5 grid h-10 w-10 place-items-center rounded-full bg-sfc-bone text-sfc-navy"
      >
        <Icon name={icon} />
      </span>
      <div>
        <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-sfc-n-500">
          {label}
        </dt>
        <dd className="mt-1 text-[14px] leading-relaxed text-sfc-n-800">
          {children}
        </dd>
      </div>
    </div>
  );
}

function Icon({ name }: { name: "pin" | "phone" | "mail" | "clock" }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "pin":
      return (
        <svg {...common}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.05a2 2 0 0 1-.45 2.11L8.09 10.2a16 16 0 0 0 6 6l1.32-1.32a2 2 0 0 1 2.11-.45c.98.35 2 .59 3.05.72A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 6-10 7L2 6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
  }
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-semibold text-sfc-n-700">
      {label}
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-sfc-n-300 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-sfc-navy focus:outline-none focus:ring-2 focus:ring-sfc-sky-light"
      />
    </label>
  );
}
