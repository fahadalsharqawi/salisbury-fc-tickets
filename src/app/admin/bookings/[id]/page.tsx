import Link from "next/link";
import { notFound } from "next/navigation";
import { setBookingStatusAction } from "@/lib/actions";
import { bookingTotal, getBooking, getMatch } from "@/lib/db";
import { formatLongKickoff, formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function AdminBookingDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) notFound();
  const match = await getMatch(booking.matchId);
  const total = match ? bookingTotal(booking, match) : 0;

  return (
    <div className="space-y-6">
      <Link href="/admin/bookings" className="text-sm text-emerald-700 hover:underline">
        ← All bookings
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <Label>Booking</Label>
                <div className="mt-1 font-mono text-sm">
                  #{booking.id.slice(0, 8).toUpperCase()}
                </div>
                <h2 className="mt-3 text-2xl font-semibold">{booking.customerName}</h2>
                <div className="mt-1 text-sm text-stone-600">
                  {booking.email} · {booking.phone}
                </div>
              </div>
              <StatusPill status={booking.status} />
            </div>

            <hr className="my-5 border-stone-200" />

            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <Row label="Tickets" value={`${booking.seats.length}`} />
              <Row label="Total" value={match ? formatMoney(total) : "—"} />
              <Row label="Payment" value={paymentLabel(booking.paymentMethod)} />
              <Row label="Created" value={new Date(booking.createdAt).toLocaleString()} />
              <Row label="Match" value={match ? `vs ${match.opponent}` : "deleted"} />
            </dl>

            <div className="mt-5">
              <Label>Seats</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {booking.seats.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-stone-900 px-3 py-1 text-xs font-medium text-white"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {booking.notes && (
              <div className="mt-5 rounded-lg bg-stone-50 p-4 text-sm text-stone-700">
                <Label>Notes</Label>
                <div className="mt-1">{booking.notes}</div>
              </div>
            )}
          </section>

          {match && (
            <section className="rounded-2xl border border-stone-200 bg-white p-6">
              <Label>Match</Label>
              <div className="mt-1 text-lg font-semibold">
                Salisbury FC <span className="text-stone-400">vs</span> {match.opponent}
              </div>
              <div className="text-stone-600">{match.competition}</div>
              <div className="mt-1 text-stone-600">{formatLongKickoff(match.kickoff)}</div>
              <div className="text-stone-600">{match.venue}</div>
            </section>
          )}
        </div>

        <aside className="space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
          <Label>Update status</Label>
          <StatusForm id={booking.id} target="confirmed" disabled={booking.status === "confirmed"}>
            Mark confirmed
          </StatusForm>
          <StatusForm id={booking.id} target="pending" disabled={booking.status === "pending"}>
            Mark pending
          </StatusForm>
          <StatusForm
            id={booking.id}
            target="cancelled"
            disabled={booking.status === "cancelled"}
            variant="danger"
          >
            Cancel booking
          </StatusForm>
        </aside>
      </div>
    </div>
  );
}

function StatusForm({
  id,
  target,
  disabled,
  variant,
  children,
}: {
  id: string;
  target: "confirmed" | "pending" | "cancelled";
  disabled?: boolean;
  variant?: "danger";
  children: React.ReactNode;
}) {
  const base =
    "block w-full rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";
  const colors =
    variant === "danger"
      ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
      : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100";
  return (
    <form action={setBookingStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={target} />
      <button type="submit" disabled={disabled} className={`${base} ${colors}`}>
        {children}
      </button>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-0.5 font-medium text-stone-900">{value}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
      {children}
    </div>
  );
}

function paymentLabel(m: "card" | "apple" | "google"): string {
  return m === "apple" ? "Apple Pay" : m === "google" ? "Google Pay" : "Card";
}

function StatusPill({ status }: { status: "pending" | "confirmed" | "cancelled" }) {
  const styles =
    status === "confirmed"
      ? "bg-emerald-100 text-emerald-800"
      : status === "pending"
        ? "bg-amber-100 text-amber-800"
        : "bg-stone-200 text-stone-600";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${styles}`}>
      {status}
    </span>
  );
}
