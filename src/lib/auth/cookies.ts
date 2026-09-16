export const ACCESS_TOKEN_COOKIE = "ob_access_token";
export const REFRESH_TOKEN_COOKIE = "ob_refresh_token";
export const TEMPORARY_TOKEN_COOKIE = "ob_temporary_token";

// Matches the JWT TTLs in supabase/functions/_shared/jwt.ts and session.ts.
export const ACCESS_TOKEN_MAX_AGE = 30 * 60; // 30 minutes
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
export const TEMPORARY_TOKEN_MAX_AGE = 30 * 60; // 30 minutes
