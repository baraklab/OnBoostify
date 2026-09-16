import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// public.users and every business table have RLS enabled with no anon/authenticated
// policies (see supabase/migrations/) — these functions do their own auth/authorization in
// code (JWT + password/OTP/token checks, then explicit `.eq('user_id', ...)` filters), so
// the service role key (full table access, bypassing RLS) is the right client rather than
// the publishable key. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically
// into every edge function's environment by the platform — no secrets to configure for
// these two specifically.
export function createServiceClient() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}
