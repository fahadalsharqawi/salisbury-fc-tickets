import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STAFF, getStaff } from "@/lib/club";
import { localize, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

type Params = { slug: string };

export function generateStaticParams() {
  return STAFF.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const staff = getStaff(slug);
  if (!staff) return { title: "Staff — Salisbury FC" };
  return {
    title: `${staff.name} — Salisbury FC`,
    description: `${staff.name} · ${staff.role} · Salisbury FC.`,
  };
}

export default async function StaffPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const staff = getStaff(slug);
  if (!staff) notFound();
  const locale = await getLocale();

  const idx = STAFF.findIndex((s) => s.slug === staff.slug);
  const prev = STAFF[(idx - 1 + STAFF.length) % STAFF.length];
  const next = STAFF[(idx + 1) % STAFF.length];

  const initials = staff.name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <div className="sfc-band">
        <div className="sfc-container py-4 sm:py-6">
          <Link
            href="/club"
            className="sfc-display text-[11px] font-semibold uppercase tracking-[0.14em] text-sfc-sky-light hover:text-white sm:text-[12px]"
          >
            ← {t("club.title", locale)}
          </Link>
          <div className="mt-2 sm:mt-3">
            <div className="sfc-eyebrow sfc-eyebrow--on-dark">
              {localize(staff.role, locale)}
            </div>
            <h1 className="sfc-display mt-1.5 text-3xl font-bold leading-[1.05] sm:mt-2 sm:text-5xl">
              {staff.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="sfc-container py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div className="anim-fade-up">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-sfc-n-200 bg-sfc-bone">
              {staff.photoUrl ? (
                <Image
                  src={staff.photoUrl}
                  alt={staff.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="sfc-display text-7xl font-bold text-sfc-n-400">
                    {initials}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="anim-fade-up space-y-6" style={{ ["--anim-delay" as string]: "120ms" }}>
            <section className="rounded-2xl border border-sfc-n-200 bg-white p-5 sm:p-6">
              <h2 className="sfc-display text-lg font-bold">Role</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <Field label="Title" value={localize(staff.role, locale)} />
                <Field label="Club" value={t("brand.name", locale)} />
                <Field label="Stadium" value={localize("Raymond McEnhill Stadium", locale)} />
              </dl>
            </section>

            <section className="flex flex-wrap gap-3">
              <Link href="/tickets" className="sfc-btn sfc-btn--primary press">
                {t("club.buy-tickets", locale)}
              </Link>
              <Link href="/club" className="sfc-btn sfc-btn--ghost press">
                ← Back to staff
              </Link>
            </section>
          </div>
        </div>

        <nav
          aria-label="Staff navigation"
          className="anim-fade-up mt-10 flex items-stretch justify-between gap-3 border-t border-sfc-n-200 pt-6"
        >
          <Link
            href={`/club/staff/${prev.slug}`}
            className="lift flex flex-1 items-center gap-3 rounded-xl border border-sfc-n-200 bg-white p-3"
          >
            <span className="text-2xl text-sfc-n-400">←</span>
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-sfc-n-500">
                Previous
              </span>
              <span className="block truncate text-sm font-semibold">{prev.name}</span>
            </span>
          </Link>
          <Link
            href={`/club/staff/${next.slug}`}
            className="lift flex flex-1 items-center justify-end gap-3 rounded-xl border border-sfc-n-200 bg-white p-3 text-right"
          >
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-sfc-n-500">
                Next
              </span>
              <span className="block truncate text-sm font-semibold">{next.name}</span>
            </span>
            <span className="text-2xl text-sfc-n-400">→</span>
          </Link>
        </nav>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sfc-n-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-sfc-ink">{value}</div>
    </div>
  );
}
