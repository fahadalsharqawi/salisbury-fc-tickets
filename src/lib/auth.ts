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

export async function signInWithMicrosoftAction(formData: FormData) {
  const next = String(formData.get("next") ?? "/");
  const supabase = await createClient();
  // Supabase calls the Microsoft / Entra ID provider "azure".
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: {
      redirectTo: await callbackUrl(next),
      // openid + email + profile gets us the basic user info we display.
      scopes: "openid email profile",
      queryParams: { prompt: "select_account" },
    },
  });
  if (error || !data.url) {
    redirect(
      "/sign-in?error=" +
        encodeURIComponent(
          error?.message ??
            "Microsoft sign-in isn't configured yet. Use email + password for now.",
        ),
    );
  }
  redirect(data.url);
}

export async function signInWithAppleAction(formData: FormData) {
  const next = String(formData.get("next") ?? "/");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: await callbackUrl(next),
      // Apple returns first/last name only on the very first sign-in,
      // so request both name and email scopes up front.
      scopes: "name email",
    },
  });
  if (error || !data.url) {
    redirect(
      "/sign-in?error=" +
        encodeURIComponent(
          error?.message ??
            "Apple sign-in isn't configured yet. Use email + password for now.",
        ),
    );
  }
  redirect(data.url);
}
