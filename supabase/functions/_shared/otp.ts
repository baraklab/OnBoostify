const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const PASSWORD_RESET_TTL_MS = 15 * 60 * 1000; // 15 minutes
export const OTP_MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function otpExpiresAt(): string {
  return new Date(Date.now() + OTP_TTL_MS).toISOString();
}

/** Slightly longer than the sign-up OTP: the emailed reset link shares this deadline, and
 *  clicking a link from an inbox is a slower round trip than typing a code already on screen. */
export function passwordResetExpiresAt(): string {
  return new Date(Date.now() + PASSWORD_RESET_TTL_MS).toISOString();
}

/** The one-click alternative to typing an OTP, for both email verification and password
 *  reset. Two UUIDs so it has plenty of unguessable width, and it is only ever stored hashed. */
export function generateLinkToken(): string {
  return crypto.randomUUID() + crypto.randomUUID();
}
