import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// OAuth callback: Supabase redirects here after the provider (Google) signs
// the user in. We exchange the `code` query param for a session cookie and
// then bounce to the original destination (`?next=/some/path`, default "/").
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";
  const errorParam = url.searchParams.get("error_description") ?? url.searchParams.get("error");

  // Forwarded-host so we land on the user's host (Vercel preview, prod, localhost).
  const forwardedHost = request.headers.get("x-forwarded-host");
  const origin = forwardedHost
    ? `${request.headers.get("x-forwarded-proto") ?? "https"}://${forwardedHost}`
    : url.origin;

  if (errorParam) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent(errorParam)}`,
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent("Missing OAuth code.")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent(error.message)}`,
    );
  }

  // Only bounce to a relative `next` to avoid open-redirect issues.
  const safeNext = next.startsWith("/") ? next : "/";
  return NextResponse.redirect(`${origin}${safeNext}`);
}
