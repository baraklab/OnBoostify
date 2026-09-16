import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/http.ts";
import { createServiceClient } from "../_shared/supabaseClient.ts";
import { hashRefreshToken } from "../_shared/session.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => null);
    const refreshToken = String(body?.refreshToken ?? "").trim();
    if (!refreshToken) return jsonResponse(200, { ok: true }, corsHeaders);

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("user_sessions")
      .update({ revoked: true })
      .eq("refresh_token_hash", await hashRefreshToken(refreshToken));
    if (error) console.error("auth-logout: revoke failed", error);

    return jsonResponse(200, { ok: true }, corsHeaders);
  } catch (err) {
    console.error("auth-logout: unhandled error", err);
    return jsonResponse(200, { ok: true }, corsHeaders);
  }
});
