/* eslint-disable @next/next/no-img-element */
import type { PaymentMethod } from "@/lib/types";

// Visual mark for whichever wallet or card scheme captured the payment.
//
// Driven by the bookings row: `payment_method` (card/apple/google) plus
// `card_brand` ("Visa" / "Mastercard" / "Amex" / etc. — captured from
// Tap's `card.brand` field on charge confirmation).
//
// Each mark is rendered as <img src="/payment-icons/<key>.svg" />. Drop
// official brand SVGs into /public/payment-icons/ — see the README in
// that directory for which files are expected.

type IconKey =
  | "visa"
  | "mastercard"
  | "amex"
  | "mada"
  | "knet"
  | "benefit"
  | "meeza"
  | "apple-pay"
  | "google-pay"
  | "card";

const LABEL: Record<IconKey, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  mada: "mada",
  knet: "KNET",
  benefit: "Benefit",
  meeza: "meeza",
  "apple-pay": "Apple Pay",
  "google-pay": "Google Pay",
  card: "Card",
};

function iconKey(method: PaymentMethod, brand?: string | null): IconKey {
  if (method === "apple") return "apple-pay";
  if (method === "google") return "google-pay";
  const key = (brand ?? "").toLowerCase().trim();
  if (key === "visa") return "visa";
  if (key === "mastercard" || key === "master card") return "mastercard";
  if (key === "amex" || key === "american express") return "amex";
  if (key === "mada") return "mada";
  if (key === "knet") return "knet";
  if (key === "benefit") return "benefit";
  if (key === "meeza") return "meeza";
  return "card";
}

export function PaymentMethodLogo({
  method,
  brand,
  size = 18,
  className = "",
}: {
  method: PaymentMethod;
  brand?: string | null;
  size?: number;
  className?: string;
}) {
  const key = iconKey(method, brand);
  return <Icon name={key} size={size} className={className} />;
}

// Row of every payment mark we accept — used in the site footer so visitors
// can see what's supported before they reach checkout.
export function PaymentMethodsStrip({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const keys: IconKey[] = [
    "visa",
    "mastercard",
    "amex",
    "mada",
    "knet",
    "benefit",
    "meeza",
    "apple-pay",
    "google-pay",
  ];
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 ${className}`}
      dir="ltr"
    >
      {keys.map((k) => (
        <Icon key={k} name={k} size={size} />
      ))}
    </div>
  );
}

function Icon({
  name,
  size,
  className = "",
}: {
  name: IconKey;
  size: number;
  className?: string;
}) {
  return (
    <img
      src={`/payment-icons/${name}.png`}
      alt={LABEL[name]}
      height={size}
      style={{ height: size, width: "auto" }}
      className={className}
      decoding="async"
      loading="lazy"
    />
  );
}
