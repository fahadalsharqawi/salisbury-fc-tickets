import Link from "next/link";
import { requestAccessAction } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ error?: string; submitted?: string }>;

export default async function RequestAccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, submitted } = await searchParams;

  if (submitted) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-emerald-900">
            Request submitted
          </h2>
          <p className="mt-2 text-sm text-emerald-800">
            A super-admin will review your request and share credentials with you
            once approved.
          </p>
          <Link
            href="/admin/sign-in"
            className="mt-4 inline-block text-sm font-medium text-emerald-800 hover:underline"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight">Request access</h2>
        <p className="mt-1 text-sm text-stone-500">
          Tell us who you are and the role you need. A super-admin will review
          and share credentials with you out-of-band.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form action={requestAccessAction} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-stone-700">
            Your name
            <input
              name="name"
              required
              autoComplete="name"
              autoFocus
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Role you need
            <select
              name="role"
              required
              defaultValue=""
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="" disabled>
                Choose a role…
              </option>
              <option value="match-day">Match-day staff</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Super-admin</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Why you need access (optional)
            <textarea
              name="notes"
              rows={3}
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>

          <button type="submit" className="sfc-btn sfc-btn--primary press w-full">
            Submit request
          </button>
        </form>

        <div className="mt-6 border-t border-stone-200 pt-5 text-sm">
          <Link href="/admin/sign-in" className="text-stone-600 hover:underline">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
