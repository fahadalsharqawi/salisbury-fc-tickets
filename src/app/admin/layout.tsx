import Link from "next/link";
import { adminSignOutAction, countPendingRequests, getAdminSession } from "@/lib/admin-auth";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const session = await getAdminSession();
  const pendingCount = session?.role === "super-admin" ? await countPendingRequests() : 0;

  return (
    <>
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
            {session && (
              <div className="flex flex-wrap items-center gap-3">
                <nav className="flex flex-wrap items-stretch overflow-hidden rounded-full border border-white/20 bg-white/5 text-sm font-medium">
                  <AdminLink href="/admin">{t("admin.tab.dashboard", locale)}</AdminLink>
                  <AdminLink href="/admin/bookings">{t("admin.tab.bookings", locale)}</AdminLink>
                  <AdminLink href="/admin/matches">{t("admin.tab.fixtures", locale)}</AdminLink>
                  {session.role === "super-admin" && (
                    <AdminLink href="/admin/requests">
                      Requests
                      {pendingCount > 0 && (
                        <span className="ms-1.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-sfc-navy">
                          {pendingCount}
                        </span>
                      )}
                    </AdminLink>
                  )}
                </nav>
                <form action={adminSignOutAction}>
                  <div className="text-xs text-white/70">
                    {session.name}{" "}
                    <span className="text-white/50">({session.role})</span>
                  </div>
                  <button
                    type="submit"
                    className="text-xs font-medium text-white/80 underline-offset-2 hover:text-white hover:underline"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            )}
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
