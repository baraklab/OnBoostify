import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

/**
 * Server-only symmetric encryption for secrets we must store at rest:
 * OAuth access/refresh tokens and BYOK AI provider API keys.
 * Never import this from a Client Component.
 */

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error(
      "ENCRYPTION_SECRET is not set. Generate one with `openssl rand -hex 32` and add it to your environment.",
    );
  }
  return scryptSync(secret, "oyekool-secret-store", 32);
}

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("hex"), authTag.toString("hex"), encrypted.toString("hex")].join(".");
}

export function decryptSecret(payload: string): string {
  const [ivHex, authTagHex, dataHex] = payload.split(".");
  if (!ivHex || !authTagHex || !dataHex) {
    throw new Error("Malformed encrypted payload.");
  }
  const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

/** Shows only the last 4 characters, e.g. "sk-••••••••ab12", for display in Settings. */
export function maskSecret(secret: string): string {
  if (secret.length <= 4) return "••••";
  return `••••••••${secret.slice(-4)}`;
}
