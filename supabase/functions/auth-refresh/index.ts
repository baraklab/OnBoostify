import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/http.ts";
import { createServiceClient } from "../_shared/supabaseClient.ts";
import { generateRefreshToken, refreshTokenExpiresAt, hashRefreshToken, deviceInfoFrom } from "../_shared/session.ts";
import { signAccessToken } from "../_shared/jwt.ts";

const SESSION_EXPIRED = "Session expired. Please sign in again.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => null);
    const refreshToken = String(body?.refreshToken ?? "").trim();
    if (!refreshToken) return jsonResponse(400, { error: "Missing refresh token." }, corsHeaders);

    const supabase = createServiceClient();
    const { data: session, error } = await supabase
      .from("user_sessions")
      .select("id, user_id, expires_at, revoked")
      .eq("refresh_token_hash", await hashRefreshToken(refreshToken))
      .maybeSingle();

    if (error) {
      console.error("auth-refresh: session lookup failed", error);
      return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
    }
    const sessionExpired = !session || session.revoked || new Date(session.expires_at).getTime() < Date.now();
    if (sessionExpired) return jsonResponse(401, { error: SESSION_EXPIRED }, corsHeaders);

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, active, verified")
      .eq("id", session.user_id)
      .maybeSingle();
    if (userError) {
      console.error("auth-refresh: user lookup failed", userError);
      return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
    }
    if (!user || !user.active || !user.verified) {
      return jsonResponse(401, { error: SESSION_EXPIRED }, corsHeaders);
    }

    const newRefreshToken = generateRefreshToken();
    const info = deviceInfoFrom(req);
    const update: Record<string, string | null> = {
      refresh_token_hash: await hashRefreshToken(newRefreshToken),
      expires_at: refreshTokenExpiresAt(),
      last_used_at: new Date().toISOString(),
      ip_address: info.ipAddress,
    };
    if (info.platform) {
      update.device_type = info.deviceType;
      update.platform = info.platform;
      update.app_version = info.appVersion;
      update.arch = info.arch;
    }
    const { error: updateError } = await supabase.from("user_sessions").update(update).eq("id", session.id);
    if (updateError) {
      console.error("auth-refresh: session update failed", updateError);
      return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
    }

    const accessToken = await signAccessToken(user.id);
    return jsonResponse(200, { requiresVerification: false, accessToken, refreshToken: newRefreshToken }, corsHeaders);
  } catch (err) {
    console.error("auth-refresh: unhandled error", err);
    return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
  }
});
