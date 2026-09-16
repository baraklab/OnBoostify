/** Every response — success or error — is JSON, so the caller has one place to read a
 * human-readable message from. Mirrors contact/index.ts's `respond` helper. */
export function jsonResponse(status: number, body: unknown, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}
