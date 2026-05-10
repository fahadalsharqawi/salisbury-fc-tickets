import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "./supabase/admin";

export type AdminRole = "super-admin" | "admin" | "match-day";
export type AdminRequestStatus = "pending" | "approved" | "rejected";

export type AdminUser = {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
};

export type AdminAccessRequest = {
  id: string;
  name: string;
  role: AdminRole;
  notes: string | null;
  status: AdminRequestStatus;
  requested_at: string;
  decided_at: string | null;
  decided_by: string | null;
};

const COOKIE_NAME = "sfc-admin-session";
const SESSION_TTL_DAYS = 14;

function getJwtSecret(): Uint8Array {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s) throw new Error("ADMIN_JWT_SECRET is not set");
  return new TextEncoder().encode(s);
}

async function signSessionToken(user: AdminUser): Promise<string> {
  return new SignJWT({ sub: user.id, username: user.username, role: user.role, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_DAYS}d`)
    .sign(getJwtSecret());
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      id: String(payload.sub),
      username: String(payload.username),
      name: String(payload.name),
      role: payload.role as AdminRole,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminSession();
  if (!user) redirect("/admin/sign-in");
  return user;
}

export async function requireSuperAdmin(): Promise<AdminUser> {
  const user = await requireAdmin();
  if (user.role !== "super-admin") redirect("/admin?error=" + encodeURIComponent("Super-admin access required."));
  return user;
}

// ────────────────────────────────────────────────────────────────────────────
// Server actions
// ────────────────────────────────────────────────────────────────────────────

export async function adminSignInAction(formData: FormData) {
  "use server";
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    redirect("/admin/sign-in?error=" + encodeURIComponent("Username and password are required."));
  }

  const supabase = createAdminClient();
  const { data: row } = await supabase
    .from("admin_users")
    .select("id, username, password_hash, name, role")
    .ilike("username", username)
    .maybeSingle();

  // Run bcrypt either way to avoid timing-leaking whether the username exists.
  const hash = row?.password_hash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalida";
  const ok = await bcrypt.compare(password, hash);

  if (!row || !ok) {
    redirect("/admin/sign-in?error=" + encodeURIComponent("Invalid username or password."));
  }

  await supabase.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", row.id);

  const token = await signSessionToken({
    id: row.id,
    username: row.username,
    name: row.name,
    role: row.role as AdminRole,
  });

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });

  redirect("/admin");
}

export async function adminSignOutAction() {
  "use server";
  (await cookies()).delete(COOKIE_NAME);
  redirect("/admin/sign-in");
}

export async function requestAccessAction(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "") as AdminRole;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name || !["super-admin", "admin", "match-day"].includes(role)) {
    redirect("/admin/request-access?error=" + encodeURIComponent("Name and role are required."));
  }

  const supabase = createAdminClient();
  await supabase.from("admin_access_requests").insert({ name, role, notes });

  redirect("/admin/request-access?submitted=1");
}

export async function approveRequestAction(formData: FormData) {
  "use server";
  const approver = await requireSuperAdmin();
  const requestId = String(formData.get("requestId") ?? "");
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!requestId || !username || !password) {
    redirect("/admin/requests?error=" + encodeURIComponent("Username and password are required to approve."));
  }
  if (password.length < 8) {
    redirect("/admin/requests?error=" + encodeURIComponent("Password must be at least 8 characters."));
  }

  const supabase = createAdminClient();
  const { data: req } = await supabase
    .from("admin_access_requests")
    .select("id, name, role, status")
    .eq("id", requestId)
    .maybeSingle();

  if (!req || req.status !== "pending") {
    redirect("/admin/requests?error=" + encodeURIComponent("Request not found or already decided."));
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { error: insErr } = await supabase.from("admin_users").insert({
    username,
    password_hash: passwordHash,
    name: req.name,
    role: req.role,
  });

  if (insErr) {
    const msg = insErr.message.includes("admin_users_username_key")
      ? "That username is already taken."
      : "Could not create admin user.";
    redirect("/admin/requests?error=" + encodeURIComponent(msg));
  }

  await supabase
    .from("admin_access_requests")
    .update({ status: "approved", decided_at: new Date().toISOString(), decided_by: approver.id })
    .eq("id", requestId);

  redirect("/admin/requests?approved=" + encodeURIComponent(username));
}

export async function rejectRequestAction(formData: FormData) {
  "use server";
  const approver = await requireSuperAdmin();
  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) redirect("/admin/requests");

  const supabase = createAdminClient();
  await supabase
    .from("admin_access_requests")
    .update({ status: "rejected", decided_at: new Date().toISOString(), decided_by: approver.id })
    .eq("id", requestId);

  redirect("/admin/requests");
}

export async function listPendingRequests(): Promise<AdminAccessRequest[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("admin_access_requests")
    .select("*")
    .eq("status", "pending")
    .order("requested_at", { ascending: false });
  return (data ?? []) as AdminAccessRequest[];
}

export async function countPendingRequests(): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("admin_access_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  return count ?? 0;
}
