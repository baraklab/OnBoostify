import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Service-role client. Bypasses Row Level Security — use ONLY in trusted
 * server contexts (route handlers, server actions, background jobs) for
 * operations that must cross user boundaries (e.g. the OAuth callback
 * writing a token before the user's session cookie is fully established).
 * NEVER import this file into a Client Component or expose its output to
 * the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase service role is not configured on this server.");
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
