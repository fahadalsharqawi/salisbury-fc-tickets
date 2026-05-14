import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentMethod } from "./types";

// Tap Payments — server-side client.
//
// Docs:
//   • Create a Charge:    https://developers.tap.company/reference/create-a-charge
//   • Retrieve a Charge:  https://developers.tap.company/reference/retrieve-a-charge
//   • Webhooks (post.url): payload + `hashstring` HMAC verification
//
// We talk to the live API for both sandbox and production — the secret key
// itself selects the environment (`sk_test_…` vs `sk_live_…`).
const TAP_API_BASE = "https://api.tap.company/v2";

function secretKey(): string {
  const key = process.env.TAP_SECRET_KEY;
  if (!key) {
    throw new Error(
      "TAP_SECRET_KEY is not set. Add it to .env.local (sk_test_… for sandbox).",
    );
  }
  return key;
}

// Tap charge statuses we care about. Anything not in this set is treated as
// non-final. See the Charge object docs for the full list.
const CAPTURED_STATUSES = new Set(["CAPTURED", "AUTHORIZED"]);
const FAILED_STATUSES = new Set([
  "ABANDONED",
  "CANCELLED",
  "FAILED",
  "DECLINED",
  "RESTRICTED",
  "VOID",
  "TIMEDOUT",
]);

export type TapCharge = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  reference?: { transaction?: string | null; order?: string | null } | null;
  source?: {
    id?: string | null;
    payment_method?: string | null;
    type?: string | null;
  } | null;
  card?: {
    brand?: string | null;
    scheme?: string | null;
    last_four?: string | null;
    last_4_digits?: string | null;
  } | null;
  transaction?: { url?: string | null } | null;
  metadata?: Record<string, string> | null;
};

export type CreateChargeInput = {
  amount: number;
  currency: "KWD" | "GBP" | string;
  description: string;
  reference: string;
  customer: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: { countryCode: string; number: string };
  };
  redirectUrl: string;
  postUrl?: string;
  metadata?: Record<string, string>;
};

export async function createCharge(input: CreateChargeInput): Promise<TapCharge> {
  const body: Record<string, unknown> = {
    amount: input.amount,
    currency: input.currency,
    threeDSecure: true,
    save_card: false,
    description: input.description,
    statement_descriptor: "Salisbury FC",
    reference: { transaction: input.reference, order: input.reference },
    customer: {
      first_name: input.customer.firstName,
      last_name: input.customer.lastName ?? "",
      email: input.customer.email,
      ...(input.customer.phone
        ? {
            phone: {
              country_code: input.customer.phone.countryCode,
              number: input.customer.phone.number,
            },
          }
        : {}),
    },
    // src_all = let Tap's hosted page show every method enabled on the
    // merchant account (cards, KNET, Apple Pay, Google Pay, etc.).
    source: { id: "src_all" },
    redirect: { url: input.redirectUrl },
    ...(input.postUrl ? { post: { url: input.postUrl } } : {}),
    ...(input.metadata ? { metadata: input.metadata } : {}),
  };

  const res = await fetch(`${TAP_API_BASE}/charges/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Tap createCharge failed (${res.status}): ${text}`);
  }
  return (await res.json()) as TapCharge;
}

export async function retrieveCharge(id: string): Promise<TapCharge> {
  const res = await fetch(`${TAP_API_BASE}/charges/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${secretKey()}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Tap retrieveCharge failed (${res.status}): ${text}`);
  }
  return (await res.json()) as TapCharge;
}

export function isCaptured(charge: TapCharge): boolean {
  return CAPTURED_STATUSES.has(charge.status);
}

export function isFinalFailure(charge: TapCharge): boolean {
  return FAILED_STATUSES.has(charge.status);
}

// Verify the `hashstring` header on a Tap webhook. Tap signs with HMAC-SHA256
// over a fixed concatenation of charge fields, keyed with the secret API key.
// See the webhook docs for the field order.
export function verifyWebhookSignature(
  payload: {
    id: string;
    amount: number | string;
    currency: string;
    gateway_reference?: string | null;
    payment_reference?: string | null;
    status: string;
    created: number | string;
  },
  hashstringHeader: string | null,
): boolean {
  if (!hashstringHeader) return false;
  const toBeHashed =
    `x_id${payload.id}` +
    `x_amount${formatAmountForHash(payload.amount, payload.currency)}` +
    `x_currency${payload.currency}` +
    `x_gateway_reference${payload.gateway_reference ?? ""}` +
    `x_payment_reference${payload.payment_reference ?? ""}` +
    `x_status${payload.status}` +
    `x_created${payload.created}`;

  const computed = createHmac("sha256", secretKey())
    .update(toBeHashed)
    .digest("hex");

  // Constant-time comparison.
  const a = Buffer.from(computed, "utf8");
  const b = Buffer.from(hashstringHeader, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Tap requires the amount to be hashed using the currency's standard decimal
// places (KWD = 3, GBP = 2). The webhook payload sends the amount as a
// number; we re-stringify to the right precision.
function formatAmountForHash(amount: number | string, currency: string): string {
  const n = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(n)) return String(amount);
  const decimals = currencyDecimals(currency);
  return n.toFixed(decimals);
}

function currencyDecimals(currency: string): number {
  switch (currency.toUpperCase()) {
    case "KWD":
    case "BHD":
    case "OMR":
    case "JOD":
      return 3;
    default:
      return 2;
  }
}

// Map Tap's reported payment method (e.g. "VISA", "MASTERCARD", "APPLE_PAY",
// "GOOGLE_PAY", "KNET", "MADA") to the narrow enum we store on the booking.
// Anything we can't classify falls back to "card" since cards cover the
// long tail of branded card schemes.
export function mapPaymentMethod(charge: TapCharge): PaymentMethod {
  const raw = (
    charge.source?.payment_method ??
    charge.source?.type ??
    charge.source?.id ??
    ""
  )
    .toString()
    .toUpperCase();
  if (raw.includes("APPLE")) return "apple";
  if (raw.includes("GOOGLE")) return "google";
  return "card";
}

// Title-cased brand for display, e.g. "Visa" / "Mastercard". Tap reports
// these in upper-case ("VISA"); we lower-case then capitalise the first
// letter so they sit nicely next to the masked digits on the receipt.
export function getCardBrand(charge: TapCharge): string | null {
  const raw = (charge.card?.brand ?? charge.card?.scheme ?? "").toString().trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower === "mastercard") return "Mastercard";
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function getCardLast4(charge: TapCharge): string | null {
  const raw = (
    charge.card?.last_four ??
    charge.card?.last_4_digits ??
    ""
  ).toString();
  return /^\d{4}$/.test(raw) ? raw : null;
}
