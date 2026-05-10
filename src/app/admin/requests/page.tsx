import {
  approveRequestAction,
  listPendingRequests,
  rejectRequestAction,
  requireSuperAdmin,
  type AdminAccessRequest,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ error?: string; approved?: string }>;

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireSuperAdmin();
  const { error, approved } = await searchParams;
  const requests = await listPendingRequests();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Access requests</h2>
        <p className="mt-1 text-sm text-stone-500">
          Approve a request by giving the new admin a username and password,
          then share those credentials with them out-of-band.
        </p>
      </div>

      {approved && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-800">
          Created admin user <span className="font-mono font-semibold">{approved}</span>.
          Share the credentials with them now.
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-12 text-center text-sm text-stone-500">
          No pending requests.
        </div>
      ) : (
        <ul className="space-y-4">
          {requests.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </ul>
      )}
    </div>
  );
}

function RequestCard({ request }: { request: AdminAccessRequest }) {
  const requestedAt = new Date(request.requested_at).toLocaleString();
  const suggestedUsername = request.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 32);

  return (
    <li className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold">{request.name}</div>
          <div className="mt-0.5 text-xs text-stone-500">
            Requested {requestedAt} ·{" "}
            <span className="rounded-full bg-stone-100 px-2 py-0.5 font-medium text-stone-700">
              {request.role}
            </span>
          </div>
          {request.notes && (
            <p className="mt-3 max-w-prose whitespace-pre-line rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-700">
              {request.notes}
            </p>
          )}
        </div>

        <form action={rejectRequestAction}>
          <input type="hidden" name="requestId" value={request.id} />
          <button
            type="submit"
            className="text-xs font-medium text-stone-500 underline-offset-2 hover:text-red-600 hover:underline"
          >
            Reject
          </button>
        </form>
      </div>

      <form
        action={approveRequestAction}
        className="mt-4 grid gap-3 border-t border-stone-200 pt-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <input type="hidden" name="requestId" value={request.id} />
        <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
          Username
          <input
            name="username"
            required
            defaultValue={suggestedUsername}
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-mono shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
          Password (≥ 8 chars)
          <input
            name="password"
            type="text"
            required
            minLength={8}
            autoComplete="off"
            className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-mono shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>
        <button type="submit" className="sfc-btn sfc-btn--primary press">
          Approve & create
        </button>
      </form>
    </li>
  );
}
