import "server-only";
import { cookies } from "next/headers";
import type { Currency } from "./format";

export async function getCurrency(): Promise<Currency> {
  const cookieStore = await cookies();
  const value = cookieStore.get("currency")?.value;
  return value === "KWD" ? "KWD" : "GBP";
}
