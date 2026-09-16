import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/http.ts";
import { createServiceClient } from "../_shared/supabaseClient.ts";
import { hashPassword } from "../_shared/password.ts";
import { newVerificationChallenge } from "../_shared/verification.ts";
import { signTemporaryToken } from "../_shared/jwt.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => null);
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    if (!name || !email || !password) {
      return jsonResponse(400, { error: "Name, email, and password are required." }, corsHeaders);
    }
    if (password.length < 8) {
      return jsonResponse(400, { error: "Use at least 8 characters for your password." }, corsHeaders);
    }

    const [firstName, ...rest] = name.split(/\s+/);
    const lastName = rest.join(" ") || null;
    const challenge = await newVerificationChallenge();

    const supabase = createServiceClient();
    const { data: inserted, error } = await supabase
      .from("users")
      .insert({
        email_id: email,
        password_hash: hashPassword(password),
        ...challenge.columns,
        first_name: firstName,
        last_name: lastName,
        verified: false,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return jsonResponse(400, { error: "An account with this email already exists." }, corsHeaders);
      }
      console.error("auth-signup: insert failed", error);
      return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
    }

    await challenge.send(email);
    const temporaryToken = await signTemporaryToken(inserted.id);
    return jsonResponse(200, { requiresVerification: true, temporaryToken, email, name }, corsHeaders);
  } catch (err) {
    console.error("auth-signup: unhandled error", err);
    return jsonResponse(500, { error: "Something went wrong. Please try again." }, corsHeaders);
  }
});
