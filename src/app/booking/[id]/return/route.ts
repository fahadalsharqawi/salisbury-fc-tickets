import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import {
  confirmBookingPayment,
  expirePendingBooking,
  getBooking,
} from "@/lib/db";
import {
  getCardBrand,
  getCardLast4,
  isCaptured,
  isFinalFailure,
  mapPaymentMethod,
  retrieveCharge,
} from "@/lib/tap";

// GET /booking/{id}/return?tap_id=chg_xxx
//
// Tap appends a `tap_id` query parameter when redirecting the customer back
// after they finish (or abandon) the hosted payment page. We look the
// charge up server-side, then transition the booking accordingly.
//
// Both this handler and the webhook route call into the same idempotent
// RPCs, so whichever wins the race is fine.
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await ctx.params;
  const tapId = req.nextUrl.searchParams.get("tap_id");

  const booking = await getBooking(id);
  if (!booking) {
    return NextResponse.redirect(new URL("/tickets", req.url));
  }

  // No tap_id (customer hit Back / closed the tab and reopened the URL):
  // bounce back to the booking page so they see whatever state we have.
  if (!tapId) {
    return NextResponse.redirect(new URL(`/booking/${id}`, req.url));
  }

  let charge;
  try {
    charge = await retrieveCharge(tapId);
  } catch (err) {
    console.error("[tap] retrieveCharge failed:", err);
    return NextResponse.redirect(
      new URL(
        `/tickets/${booking.matchId}?error=${encodeURIComponent(
          "We could not verify your payment. Please try again.",
        )}`,
        req.url,
      ),
    );
  }

  if (isCaptured(charge)) {
    await confirmBookingPayment(
      id,
      charge.id,
      mapPaymentMethod(charge),
      getCardBrand(charge),
      getCardLast4(charge),
    );
    revalidatePath("/");
    revalidatePath("/tickets");
    revalidatePath(`/tickets/${booking.matchId}`);
    revalidatePath(`/booking/${id}`);
    return NextResponse.redirect(new URL(`/booking/${id}`, req.url));
  }

  if (isFinalFailure(charge)) {
    await expirePendingBooking(id);
    revalidatePath("/tickets");
    revalidatePath(`/tickets/${booking.matchId}`);
    return NextResponse.redirect(
      new URL(
        `/tickets/${booking.matchId}?error=${encodeURIComponent(
          "Your payment did not complete. Please try again.",
        )}`,
        req.url,
      ),
    );
  }

  // Charge is still IN_PROGRESS / INITIATED — show the booking page; the
  // webhook will flip it to confirmed once Tap finalises.
  return NextResponse.redirect(new URL(`/booking/${id}`, req.url));
}
