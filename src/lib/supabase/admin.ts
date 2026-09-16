import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Service-role client. Bypasses Row Level Security — this is now the ONLY way any Next.js
 * server code (route handlers, server actions, background jobs) talks to Postgres. Auth is
 * no longer Supabase's own (see src/lib/auth/), so there is no Supabase session JWT for
 * auth.uid()-based RLS to key off — every table's policies were dropped in
 * supabase/migrations/0007_custom_auth.sql, and authorization instead means filtering every
 * query by the user id from src/lib/auth/session.ts's getCurrentUserId(). NEVER import this
 * file into a Client Component or expose its output to the browser.
 */
export function createAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase service role is not configured on this server.");
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
