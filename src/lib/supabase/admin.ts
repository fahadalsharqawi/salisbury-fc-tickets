import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client. Bypasses RLS — never import from client components.
// Used by server actions and server components for trusted operations.
//
// Custom fetch overrides Next.js's default caching. By default Next.js
// memoises every fetch() in the React render pass (and persists to the
// Data Cache for static-ish pages), which means seat-availability counts
// would be served from a frozen response forever. Forcing no-store keeps
// every render of /tickets and / honest.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, cache: "no-store" }),
      },
    },
  );
}
