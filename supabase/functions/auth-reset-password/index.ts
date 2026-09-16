import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/http.ts";
import { createServiceClient } from "../_shared/supabaseClient.ts";
import { hashPassword } from "../_shared/password.ts";
import { ensureProfile } from "../_shared/profile.ts";
import { OTP_MAX_ATTEMPTS } from "../_shared/otp.ts";
import { sha256Hex, timingSafeEqualHex } from "../_shared/hash.ts";

const INVALID_CODE = "That code is invalid or has expired. Request a new one.";
const INVALID_LINK = "This reset link is invalid or has expired. Request a new one.";
const GENERIC_ERROR = "Something went wrong. Please try again.";

interface ResetRow {
  id: number;
  user_id: number;
  otp_hash: string;
  expires_at: string;
  attempts: number;
}

function expired(row: ResetRow): boolean {
  return new Date(row.expires_at).getTime() < Date.now();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => null);
    const password = String(body?.password ?? "");
    const token = String(body?.token ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const code = String(body?.code ?? "").trim();

    if (password.length < 8) {
      return jsonResponse(400, { error: "Use at least 8 characters for your new password." }, corsHeaders);
    }

    const supabase = createServiceClient();
    const columns = "id, user_id, otp_hash, expires_at, attempts";
    let row: ResetRow | null = null;

    if (token) {
      // Emailed-link path: possession of the token is the whole proof, so there is no
      // attempt counter to burn — a wrong token simply matches no row.
      const { data, error } = await supabase
        .from("password_reset_codes")
        .select(columns)
        .eq("link_token_hash", await sha256Hex(token))
        .eq("used", false)
        .maybeSingle();
      if (error) {
        console.error("auth-reset-password: token lookup failed", error);
        return jsonResponse(500, { error: GENERIC_ERROR }, corsHeaders);
      }
      if (!data || expired(data)) return jsonResponse(400, { error: INVALID_LINK }, corsHeaders);
      row = data;
    } else {
      if (!email || !code) {
        return jsonResponse(400, { error: "Email address and code are required." }, corsHeaders);
      }

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, active")
        .eq("email_id", email)
        .maybeSingle();
      if (userError) {
        console.error("auth-reset-password: user lookup failed", userError);
        return jsonResponse(500, { error: GENERIC_ERROR }, corsHeaders);
      }
      if (!user || !user.active) return jsonResponse(400, { error: INVALID_CODE }, corsHeaders);

      const { data, error } = await supabase
        .from("password_reset_codes")
        .select(columns)
        .eq("user_id", user.id)
        .eq("used", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error("auth-reset-password: code lookup failed", error);
        return jsonResponse(500, { error: GENERIC_ERROR }, corsHeaders);
      }
      if (!data || expired(data)) return jsonResponse(400, { error: INVALID_CODE }, corsHeaders);
      if (data.attempts >= OTP_MAX_ATTEMPTS) {
        return jsonResponse(400, { error: "Too many incorrect attempts. Request a new code." }, corsHeaders);
      }
      if (!timingSafeEqualHex(await sha256Hex(code), data.otp_hash)) {
        await supabase
          .from("password_reset_codes")
          .update({ attempts: data.attempts + 1 })
          .eq("id", data.id);
        return jsonResponse(400, { error: "That code is incorrect." }, corsHeaders);
      }
      row = data;
    }

    // Burn the code first and only on a row that is still unused, so two requests racing
    // with the same code can't both go on to set a password.
    const { data: burned, error: burnError } = await supabase
      .from("password_reset_codes")
      .update({ used: true })
      .eq("id", row.id)
      .eq("used", false)
      .select("id")
      .maybeSingle();
    if (burnError) {
      console.error("auth-reset-password: burn failed", burnError);
      return jsonResponse(500, { error: GENERIC_ERROR }, corsHeaders);
    }
    if (!burned) return jsonResponse(400, { error: token ? INVALID_LINK : INVALID_CODE }, corsHeaders);

    // Receiving the email proves the address, so an account still sitting on an unverified
    // sign-up comes out of this verified — otherwise the new password would be unusable.
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({
        password_hash: hashPassword(password),
        verified: true,
        otp: null,
        otp_expires_at: null,
        otp_attempts: 0,
      })
      .eq("id", row.user_id)
      .select("id, first_name, last_name")
      .single();
    if (updateError) {
      console.error("auth-reset-password: password update failed", updateError);
      return jsonResponse(500, { error: GENERIC_ERROR }, corsHeaders);
    }

    // Covers the edge case of resetting a password before ever completing sign-up
    // verification — that path just made the account verified, so it needs a profile too.
    const name = [updatedUser.first_name, updatedUser.last_name].filter(Boolean).join(" ") || null;
    await ensureProfile(supabase, updatedUser.id, name);

    // A reset is the remedy for a compromised account, so every existing session — on any
    // device — has to stop working.
    const { error: revokeError } = await supabase
      .from("user_sessions")
      .update({ revoked: true })
      .eq("user_id", row.user_id);
    if (revokeError) {
      console.error("auth-reset-password: session revoke failed", revokeError);
    }

    return jsonResponse(200, { ok: true }, corsHeaders);
  } catch (err) {
    console.error("auth-reset-password: unhandled error", err);
    return jsonResponse(500, { error: GENERIC_ERROR }, corsHeaders);
  }
});
