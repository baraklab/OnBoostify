// No credentialed (cookie) requests — the Next.js app talks to these functions server-side
// and forwards the result to its own httpOnly cookie, so a plain wildcard is fine here.
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
