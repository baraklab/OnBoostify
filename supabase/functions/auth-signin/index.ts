import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/http.ts";
import { createServiceClient } from "../_shared/supabaseClient.ts";
import { verifyPassword } from "../_shared/password.ts";
import { newVerificationChallenge } from "../_shared/verification.ts";
import { generateRefreshToken, refreshTokenExpiresAt, hashRefreshToken, deviceInfoFrom } from "../_shared/session.ts";
import { signAccessToken, signTemporaryToken } from "../_shared/jwt.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    if (!email || !password) {
      return jsonResponse(400, { error: "Email and password are required." }, corsHeaders);
    }

    const supabase = createServiceClient();
    const { data: user, error } = await supabase
      .from("users")
      .select("id, password_hash, verified, active, first_name, last_name")
      .eq("email_id", email)
      .maybeSingle();

    if (error) {
      console.error("auth-signin: lookup failed", error);
      return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
    }
    if (!user || !user.active || !user.password_hash || !verifyPassword(password, user.password_hash)) {
      return jsonResponse(400, { error: "Invalid email or password." }, corsHeaders);
    }

    if (!user.verified) {
      const challenge = await newVerificationChallenge();
      await supabase.from("users").update(challenge.columns).eq("id", user.id);
      await challenge.send(email);
      const temporaryToken = await signTemporaryToken(user.id);
      const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || null;
      return jsonResponse(200, { requiresVerification: true, temporaryToken, email, name }, corsHeaders);
    }

    const refreshToken = generateRefreshToken();
    const info = deviceInfoFrom(req);
    const { error: sessionError } = await supabase.from("user_sessions").insert({
      user_id: user.id,
      refresh_token_hash: await hashRefreshToken(refreshToken),
      device_type: info.deviceType,
      platform: info.platform,
      app_version: info.appVersion,
      arch: info.arch,
      ip_address: info.ipAddress,
      expires_at: refreshTokenExpiresAt(),
    });
    if (sessionError) {
      console.error("auth-signin: session insert failed", sessionError);
      return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
    }

    const accessToken = await signAccessToken(user.id);
    return jsonResponse(200, { requiresVerification: false, accessToken, refreshToken }, corsHeaders);
  } catch (err) {
    console.error("auth-signin: unhandled error", err);
    return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
  }
});
