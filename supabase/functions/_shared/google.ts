export interface GoogleProfile {
  email: string;
  firstName: string | null;
  lastName: string | null;
}

/**
 * Validates a Google Identity Services ID token via Google's tokeninfo endpoint — no
 * signature-verification library needed at the cost of an extra network hop and Google's
 * documented rate limit on that endpoint (fine at this scale). Set GOOGLE_CLIENT_ID as a
 * function secret (`npx supabase secrets set GOOGLE_CLIENT_ID=...`) — same value as the
 * frontend's NEXT_PUBLIC_GOOGLE_CLIENT_ID; this checks the token's audience against it so a
 * token minted for a different app can't be replayed here.
 *
 * Every rejection path logs *why* — a bare `return null` here is otherwise indistinguishable
 * from any other failure in auth-google's generic "Google sign-in failed" response, which
 * makes misconfiguration (the usual cause locally) impossible to diagnose from the client.
 */
export async function verifyGoogleIdToken(credential: string): Promise<GoogleProfile | null> {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  if (!clientId) {
    console.error("verifyGoogleIdToken: GOOGLE_CLIENT_ID secret not configured");
    return null;
  }

  let res: Response;
  try {
    res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
  } catch (err) {
    console.error("verifyGoogleIdToken: tokeninfo request failed", err);
    return null;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "<unreadable>");
    console.error("verifyGoogleIdToken: tokeninfo returned non-OK status", res.status, body);
    return null;
  }

  const payload = await res.json();

  if (payload.aud !== clientId) {
    console.error("verifyGoogleIdToken: audience mismatch", { expected: clientId, got: payload.aud });
    return null;
  }
  // tokeninfo returns every field as a string, including booleans.
  if (payload.email_verified !== "true" || !payload.email) {
    console.error("verifyGoogleIdToken: email missing or unverified", {
      email: payload.email,
      email_verified: payload.email_verified,
    });
    return null;
  }

  return {
    email: payload.email,
    firstName: payload.given_name ?? null,
    lastName: payload.family_name ?? null,
  };
}
