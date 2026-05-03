import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Admin
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Salisbury FC ticketing</h1>
        </div>
        <nav className="flex flex-wrap gap-1 rounded-full border border-stone-200 bg-white p-1 text-sm font-medium">
          <AdminLink href="/admin">Dashboard</AdminLink>
          <AdminLink href="/admin/bookings">Bookings</AdminLink>
          <AdminLink href="/admin/matches">Fixtures</AdminLink>
        </nav>
      </div>
      {children}
    </div>
  );
}

function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-4 py-1.5 text-stone-700 hover:bg-stone-100"
    >
      {children}
    </Link>
  );
}
