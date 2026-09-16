import { generateLinkToken, generateOtp, otpExpiresAt } from "./otp.ts";
import { sha256Hex } from "./hash.ts";
import { sendOtpEmail } from "./email.ts";
import { verifyEmailUrl } from "./site.ts";

/**
 * Starts an email-verification challenge. The typed OTP and the emailed one-click link are
 * two proofs of the same thing, issued together and sharing one deadline — so they are
 * created here rather than at each of the three call sites (sign-up, sign-in while
 * unverified, resend), which would otherwise drift apart.
 *
 * Spread `columns` into the users insert/update that starts the challenge, then `send()`.
 */
export async function newVerificationChallenge(): Promise<{
  columns: {
    otp: string;
    otp_expires_at: string;
    otp_attempts: number;
    verification_token_hash: string;
  };
  send: (email: string) => Promise<void>;
}> {
  const otp = generateOtp();
  const token = generateLinkToken();

  return {
    columns: {
      otp,
      otp_expires_at: otpExpiresAt(),
      otp_attempts: 0,
      verification_token_hash: await sha256Hex(token),
    },
    send: (email: string) => sendOtpEmail(email, otp, verifyEmailUrl(token)),
  };
}
