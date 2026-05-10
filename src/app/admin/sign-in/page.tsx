import Link from "next/link";
import { redirect } from "next/navigation";
import { adminSignInAction, getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ error?: string }>;

export default async function AdminSignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight">Sign in</h2>
        <p className="mt-1 text-sm text-stone-500">
          Use your admin username and password.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form action={adminSignInAction} className="mt-6 space-y-4">
          <Field label="Username" name="username" required autoComplete="username" autoFocus />
          <Field
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
          <button type="submit" className="sfc-btn sfc-btn--primary press w-full">
            Sign in
          </button>
        </form>

        <div className="mt-6 border-t border-stone-200 pt-5 text-sm">
          <p className="text-stone-600">Don&apos;t have an account?</p>
          <Link
            href="/admin/request-access"
            className="mt-1 inline-block font-medium text-emerald-700 hover:underline"
          >
            Request access →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      <input
        {...props}
        className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </label>
  );
}
