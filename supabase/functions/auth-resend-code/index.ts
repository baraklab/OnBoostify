import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/http.ts";
import { createServiceClient } from "../_shared/supabaseClient.ts";
import { newVerificationChallenge } from "../_shared/verification.ts";
import { readBearerToken } from "../_shared/session.ts";
import { signTemporaryToken, verifyTemporaryToken } from "../_shared/jwt.ts";

const SESSION_EXPIRED = "Your verification session has expired. Please sign in again.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const token = readBearerToken(req);
    const userId = token ? await verifyTemporaryToken(token) : null;
    if (!userId) return jsonResponse(401, { error: SESSION_EXPIRED }, corsHeaders);

    const supabase = createServiceClient();
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email_id, active, verified")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.error("auth-resend-code: lookup failed", error);
      return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
    }
    if (!user || !user.active) return jsonResponse(401, { error: SESSION_EXPIRED }, corsHeaders);
    if (user.verified) return jsonResponse(400, { error: "This account is already verified." }, corsHeaders);

    const challenge = await newVerificationChallenge();
    await supabase.from("users").update(challenge.columns).eq("id", user.id);
    await challenge.send(user.email_id);

    const temporaryToken = await signTemporaryToken(user.id);
    return jsonResponse(200, { requiresVerification: true, temporaryToken }, corsHeaders);
  } catch (err) {
    console.error("auth-resend-code: unhandled error", err);
    return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
  }
});
