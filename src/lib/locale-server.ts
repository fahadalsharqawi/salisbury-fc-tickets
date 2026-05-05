import "server-only";
import { cookies } from "next/headers";
import type { Locale } from "./i18n";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("locale")?.value;
  return value === "ar" ? "ar" : "en";
}
