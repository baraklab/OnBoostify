import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/http.ts";
import { readBearerToken } from "../_shared/session.ts";
import { verifyAccessToken } from "../_shared/jwt.ts";
import { createServiceClient } from "../_shared/supabaseClient.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const token = readBearerToken(req);
    const userId = token ? await verifyAccessToken(token) : null;
    if (!userId) return jsonResponse(401, { error: "Not authenticated." }, corsHeaders);

    const supabase = createServiceClient();
    const { data: user, error } = await supabase
      .from("users")
      .select("id, first_name, last_name, email_id, verified, active")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("auth-user: lookup failed", error);
      return jsonResponse(500, { error: "Something went wrong." }, corsHeaders);
    }
    if (!user || !user.active) return jsonResponse(401, { error: "Not authenticated." }, corsHeaders);

    const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || null;
    return jsonResponse(
      200,
      { user: { id: String(user.id), name, email: user.email_id, verified: user.verified } },
      corsHeaders,
    );
  } catch (err) {
    console.error("auth-user: unhandled error", err);
    return jsonResponse(500, { error: "Something went wrong." }, corsHeaders);
  }
});
