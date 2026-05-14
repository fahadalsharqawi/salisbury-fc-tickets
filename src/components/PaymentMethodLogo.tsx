import type { PaymentMethod } from "@/lib/types";

// Visual mark for whichever wallet or card scheme captured the payment.
//
// Driven by the bookings row: `payment_method` (card/apple/google) plus
// `card_brand` ("Visa" / "Mastercard" / "Amex" / etc. — captured from
// Tap's `card.brand` field on charge confirmation).
//
// All marks are inline SVG so we don't need to ship trademarked assets
// and the receipt stays crisp at any size. Heights default to 18px which
// matches the booking-confirmation "Paid with" line.
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
  const shared = {
    height: size,
    width: "auto" as const,
    "aria-hidden": true,
    className,
  };

  if (method === "apple") return <ApplePay {...shared} />;
  if (method === "google") return <GooglePay {...shared} />;

  const key = (brand ?? "").toLowerCase().trim();
  if (key === "visa") return <Visa {...shared} />;
  if (key === "mastercard" || key === "master card") return <Mastercard {...shared} />;
  if (key === "amex" || key === "american express") return <Amex {...shared} />;
  if (key === "mada") return <Mada {...shared} />;
  if (key === "knet") return <Knet {...shared} />;
  if (key === "benefit") return <Benefit {...shared} />;
  if (key === "meeza") return <Meeza {...shared} />;

  // Generic card fallback when we have no brand (or one we don't recognise).
  return <GenericCard {...shared} />;
}

// ─── Wallet marks ────────────────────────────────────────────────────────

function ApplePay(props: React.SVGProps<SVGSVGElement>) {
  // Black pill with Apple glyph + "Pay" wordmark — matches Apple's
  // approved monochrome lockup for non-button surfaces.
  return (
    <svg viewBox="0 0 48 24" {...props}>
      <rect x="0" y="0" width="48" height="24" rx="4" fill="#000" />
      <path
        d="M14.8 9.4c.5-.6.8-1.4.7-2.3-.7 0-1.5.5-2 1.1-.4.5-.8 1.4-.7 2.2.8.1 1.6-.4 2-1zm.7.7c-1.1-.1-2 .6-2.5.6-.6 0-1.4-.6-2.2-.6-1.2 0-2.2.7-2.8 1.8-1.2 2-.3 5 .8 6.6.6.8 1.2 1.7 2.1 1.6.8 0 1.2-.5 2.2-.5s1.3.5 2.2.5c.9 0 1.5-.8 2.1-1.6.7-.9 1-1.7 1-1.8 0 0-1.9-.7-1.9-3 0-1.8 1.5-2.7 1.6-2.7-.9-1.3-2.3-1.4-2.7-1.4z"
        fill="#fff"
      />
      <text
        x="20"
        y="16"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="9"
        fontWeight="600"
        fill="#fff"
      >
        Pay
      </text>
    </svg>
  );
}

function GooglePay(props: React.SVGProps<SVGSVGElement>) {
  // White pill with Google's four-colour G + "Pay" wordmark.
  return (
    <svg viewBox="0 0 54 24" {...props}>
      <rect x="0" y="0" width="54" height="24" rx="4" fill="#fff" stroke="#dadce0" strokeWidth="1" />
      <g transform="translate(5 6) scale(0.5)">
        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.46-1.12 2.7-2.38 3.53v2.93h3.84c2.25-2.07 3.55-5.13 3.55-8.7z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.84-2.93c-1.07.72-2.43 1.16-4.09 1.16-3.14 0-5.8-2.12-6.75-4.97H1.29v3.12C3.26 21.3 7.31 24 12 24z" />
        <path fill="#FBBC05" d="M5.25 14.33c-.24-.72-.38-1.49-.38-2.33s.14-1.61.38-2.33V6.55H1.29C.47 8.18 0 10.04 0 12s.47 3.82 1.29 5.45l3.96-3.12z" />
        <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.41-3.41C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.55l3.96 3.12C6.2 6.89 8.86 4.77 12 4.77z" />
      </g>
      <text x="22" y="16" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="9" fontWeight="600" fill="#3c4043">
        Pay
      </text>
    </svg>
  );
}

// ─── Card scheme marks ───────────────────────────────────────────────────

function Visa(props: React.SVGProps<SVGSVGElement>) {
  // Visa blue wordmark on white pill.
  return (
    <svg viewBox="0 0 48 24" {...props}>
      <rect x="0" y="0" width="48" height="24" rx="4" fill="#fff" stroke="#e1e4e8" strokeWidth="1" />
      <text x="24" y="17" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontStyle="italic" fontWeight="900" fill="#1A1F71" letterSpacing="0.5">
        VISA
      </text>
    </svg>
  );
}

function Mastercard(props: React.SVGProps<SVGSVGElement>) {
  // Two overlapping circles — Mastercard's intersecting mark.
  return (
    <svg viewBox="0 0 36 24" {...props}>
      <rect x="0" y="0" width="36" height="24" rx="4" fill="#fff" stroke="#e1e4e8" strokeWidth="1" />
      <circle cx="14" cy="12" r="6" fill="#EB001B" />
      <circle cx="22" cy="12" r="6" fill="#F79E1B" />
      <path
        d="M18 7.5a6 6 0 0 1 0 9 6 6 0 0 1 0-9z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function Amex(props: React.SVGProps<SVGSVGElement>) {
  // Blue square with white AMEX wordmark.
  return (
    <svg viewBox="0 0 36 24" {...props}>
      <rect x="0" y="0" width="36" height="24" rx="4" fill="#1F72CD" />
      <text x="18" y="15" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="8" fontWeight="700" fill="#fff" letterSpacing="1">
        AMEX
      </text>
    </svg>
  );
}

function Mada(props: React.SVGProps<SVGSVGElement>) {
  // Saudi Mada mark — stylised with the three brand bars.
  return (
    <svg viewBox="0 0 44 24" {...props}>
      <rect x="0" y="0" width="44" height="24" rx="4" fill="#fff" stroke="#e1e4e8" strokeWidth="1" />
      <rect x="6"  y="6"  width="3" height="12" fill="#84BD00" />
      <rect x="10" y="6"  width="3" height="12" fill="#005EB8" />
      <rect x="14" y="6"  width="3" height="12" fill="#E5006A" />
      <text x="30" y="15" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="8" fontWeight="700" fill="#1a1a1a">
        mada
      </text>
    </svg>
  );
}

function Knet(props: React.SVGProps<SVGSVGElement>) {
  // Kuwait KNET — orange-red wordmark on white pill.
  return (
    <svg viewBox="0 0 44 24" {...props}>
      <rect x="0" y="0" width="44" height="24" rx="4" fill="#fff" stroke="#e1e4e8" strokeWidth="1" />
      <text x="22" y="16" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fontWeight="800" fill="#E94E1B" letterSpacing="0.5">
        KNET
      </text>
    </svg>
  );
}

function Benefit(props: React.SVGProps<SVGSVGElement>) {
  // Bahrain Benefit — green wordmark.
  return (
    <svg viewBox="0 0 56 24" {...props}>
      <rect x="0" y="0" width="56" height="24" rx="4" fill="#fff" stroke="#e1e4e8" strokeWidth="1" />
      <text x="28" y="16" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="9" fontWeight="700" fill="#00853E">
        Benefit
      </text>
    </svg>
  );
}

function Meeza(props: React.SVGProps<SVGSVGElement>) {
  // Egypt meeza — red wordmark.
  return (
    <svg viewBox="0 0 50 24" {...props}>
      <rect x="0" y="0" width="50" height="24" rx="4" fill="#fff" stroke="#e1e4e8" strokeWidth="1" />
      <text x="25" y="16" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fontWeight="800" fill="#E32B2D">
        meeza
      </text>
    </svg>
  );
}

function GenericCard(props: React.SVGProps<SVGSVGElement>) {
  // Generic credit-card icon when we have no brand info.
  return (
    <svg viewBox="0 0 36 24" {...props}>
      <rect x="0" y="0" width="36" height="24" rx="4" fill="#fff" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="0" y="5" width="36" height="4" fill="#1F4A6B" />
      <rect x="4" y="14" width="10" height="2" rx="1" fill="#cbd5e1" />
      <rect x="4" y="17.5" width="6" height="1.5" rx="0.75" fill="#cbd5e1" />
    </svg>
  );
}
