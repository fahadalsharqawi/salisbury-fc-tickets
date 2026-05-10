import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import {
  confirmBookingPayment,
  expirePendingBooking,
  getBooking,
} from "@/lib/db";
import {
  isCaptured,
  isFinalFailure,
  mapPaymentMethod,
  verifyWebhookSignature,
  type TapCharge,
} from "@/lib/tap";

// POST /api/tap/webhook
//
// Tap calls this server-to-server with the final state of a charge. We use
// it as a backstop for the redirect-back route (which can miss if the
// customer closes the tab before bouncing back). Both handlers call into
// the same idempotent DB RPCs.
export async function POST(req: NextRequest): Promise<NextResponse> {
  const raw = await req.text();
  let payload: TapCharge & {
    gateway_reference?: string | null;
    payment_reference?: string | null;
    created?: number | string;
  };
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Verify the HMAC. Reject anything that doesn't match — even rejected
  // payloads return 200 so Tap doesn't keep retrying with broken data, but
  // we log loudly.
  const ok = verifyWebhookSignature(
    {
      id: payload.id,
      amount: payload.amount,
      currency: payload.currency,
      gateway_reference: payload.gateway_reference ?? null,
      payment_reference: payload.payment_reference ?? null,
      status: payload.status,
      created: payload.created ?? "",
    },
    req.headers.get("hashstring"),
  );
  if (!ok) {
    console.warn("[tap webhook] signature mismatch for charge", payload.id);
    return NextResponse.json({ ok: false, error: "bad_signature" }, { status: 401 });
  }

  const bookingId =
    payload.metadata?.booking_id ??
    payload.reference?.transaction ??
    payload.reference?.order ??
    null;
  if (!bookingId) {
    console.warn("[tap webhook] no booking_id on charge", payload.id);
    return NextResponse.json({ ok: true, ignored: true });
  }

  const booking = await getBooking(bookingId);
  if (!booking) {
    console.warn("[tap webhook] booking not found:", bookingId);
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (isCaptured(payload)) {
    await confirmBookingPayment(bookingId, payload.id, mapPaymentMethod(payload));
    revalidatePath(`/booking/${bookingId}`);
    revalidatePath(`/tickets/${booking.matchId}`);
  } else if (isFinalFailure(payload)) {
    await expirePendingBooking(bookingId);
    revalidatePath(`/tickets/${booking.matchId}`);
  }
  // INITIATED / IN_PROGRESS: nothing to do — wait for the next event.

  return NextResponse.json({ ok: true });
}
