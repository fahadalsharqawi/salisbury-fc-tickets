"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";

// Compute the absolute callback URL based on the request — works locally
// (http://localhost:3002/auth/callback) and in production (https://...).
async function callbackUrl(next: string = "/"): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "salisburyfc.vercel.app";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}/auth/callback?next=${encodeURIComponent(next)}`;
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/sign-in?error=" + encodeURIComponent("Email and password are required."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/sign-in?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUpAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    redirect("/sign-up?error=" + encodeURIComponent("Name, email and password are required."));
  }
  if (password.length < 8) {
    redirect("/sign-up?error=" + encodeURIComponent("Password must be at least 8 characters."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    redirect("/sign-up?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGoogleAction(formData: FormData) {
  const next = String(formData.get("next") ?? "/");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: await callbackUrl(next),
      // Force account chooser so users on shared devices can pick.
      queryParams: { prompt: "select_account" },
    },
  });
  if (error || !data.url) {
    redirect(
      "/sign-in?error=" +
        encodeURIComponent(
          error?.message ??
            "Google sign-in isn't configured yet. Use email + password for now.",
        ),
    );
  }
  redirect(data.url);
}

// Apple and Microsoft providers aren't wired to a real OAuth app for the
// demo. The buttons just round-trip the form submission so the page
// "refreshes" — no error, no redirect to an unconfigured provider.
export async function signInWithMicrosoftAction(formData: FormData) {
  // Redirect back to the page the form was submitted from so the
  // browser ends up exactly where it started.
  const referer = (await headers()).get("referer");
  redirect(referer && safeReferer(referer) ? referer : "/sign-in");
}

export async function signInWithAppleAction(formData: FormData) {
  const referer = (await headers()).get("referer");
  redirect(referer && safeReferer(referer) ? referer : "/sign-in");
}

// Only follow the referer when it points back at our own host — guards
// against an attacker-controlled Referer header redirecting somewhere else.
function safeReferer(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === "salisburyfc.vercel.app" ||
      u.hostname.endsWith(".vercel.app") ||
      u.hostname === "localhost" ||
      u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}
