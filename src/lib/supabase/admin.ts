import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client. Bypasses RLS — never import from client components.
// Used by server actions and server components for trusted operations.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
