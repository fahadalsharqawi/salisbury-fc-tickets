export type Currency = "GBP" | "KWD";

export const CURRENCY_RATES: Record<Currency, number> = {
  GBP: 1,
  KWD: 0.39,
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  GBP: "GBP",
  KWD: "KWD",
};

const CURRENCY_FRACTION: Record<Currency, number> = {
  GBP: 0,
  KWD: 3,
};

export function formatKickoff(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatLongKickoff(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMoney(amountGBP: number, currency: Currency = "GBP"): string {
  const rate = CURRENCY_RATES[currency];
  const fraction = CURRENCY_FRACTION[currency];
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(amountGBP * rate);
}

export function dateInput(iso: string): string {
  return iso.slice(0, 10);
}

export function timeInput(iso: string): string {
  const d = new Date(iso);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}
