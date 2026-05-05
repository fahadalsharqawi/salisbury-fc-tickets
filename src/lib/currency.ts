import { cookies } from "next/headers";
import type { Currency } from "./format";

export const SUPPORTED_CURRENCIES: Currency[] = ["GBP", "KWD"];

export async function getCurrency(): Promise<Currency> {
  const cookieStore = await cookies();
  const value = cookieStore.get("currency")?.value;
  return value === "KWD" ? "KWD" : "GBP";
}
