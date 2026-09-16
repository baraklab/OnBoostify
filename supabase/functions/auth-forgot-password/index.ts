import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/http.ts";
import { createServiceClient } from "../_shared/supabaseClient.ts";
import { generateOtp, generateLinkToken, passwordResetExpiresAt } from "../_shared/otp.ts";
import { sendPasswordResetEmail } from "../_shared/email.ts";
import { sha256Hex } from "../_shared/hash.ts";
import { passwordResetUrl } from "../_shared/site.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    if (!email) return jsonResponse(400, { error: "Email address is required." }, corsHeaders);

    const supabase = createServiceClient();
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email_id, active, password_hash")
      .eq("email_id", email)
      .maybeSingle();

    if (error) {
      console.error("auth-forgot-password: lookup failed", error);
      return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
    }

    // Every outcome below returns the same 200, so this endpoint can't be used to test which
    // email addresses have accounts. Google-only accounts (no password_hash) fall in here
    // too — there is no password to reset, so nothing is sent.
    if (user && user.active) {
      // A new request supersedes any code still outstanding for this account, so an old
      // email can't be used after the user asks for a fresh one.
      const { error: supersedeError } = await supabase
        .from("password_reset_codes")
        .update({ used: true })
        .eq("user_id", user.id)
        .eq("used", false);
      if (supersedeError) {
        console.error("auth-forgot-password: supersede failed", supersedeError);
        return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
      }

      const otp = generateOtp();
      const linkToken = generateLinkToken();
      const { error: insertError } = await supabase.from("password_reset_codes").insert({
        user_id: user.id,
        otp_hash: await sha256Hex(otp),
        link_token_hash: await sha256Hex(linkToken),
        expires_at: passwordResetExpiresAt(),
      });

      if (insertError) {
        console.error("auth-forgot-password: insert failed", insertError);
        return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
      }

      await sendPasswordResetEmail(user.email_id, otp, passwordResetUrl(linkToken));
    }

    return jsonResponse(200, { ok: true }, corsHeaders);
  } catch (err) {
    console.error("auth-forgot-password: unhandled error", err);
    return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
  }
});
