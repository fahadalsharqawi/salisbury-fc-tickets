import Link from "next/link";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <>
      {/* Page strip */}
      <div className="sfc-band">
        <div className="sfc-container py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="sfc-eyebrow sfc-eyebrow--on-dark">
                {t("admin.eyebrow", locale)}
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {t("admin.title", locale)}
              </h1>
            </div>
            <nav className="flex flex-wrap items-stretch overflow-hidden rounded-full border border-white/20 bg-white/5 text-sm font-medium">
              <AdminLink href="/admin">{t("admin.tab.dashboard", locale)}</AdminLink>
              <AdminLink href="/admin/bookings">{t("admin.tab.bookings", locale)}</AdminLink>
              <AdminLink href="/admin/matches">{t("admin.tab.fixtures", locale)}</AdminLink>
            </nav>
          </div>
        </div>
      </div>

      <div className="sfc-container py-10">{children}</div>
    </>
  );
}

function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="border-r border-white/10 px-4 py-2 text-[13px] font-semibold text-white/80 transition last:border-r-0 hover:bg-white hover:text-sfc-navy"
    >
      {children}
    </Link>
  );
}
