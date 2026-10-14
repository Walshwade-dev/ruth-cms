import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { getAdminPassword, timingSafeEqualString } from "@/lib/auth";

export interface PasswordValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates strict password complexity requirements:
 * - Minimum 10 characters
 * - At least one uppercase letter [A-Z]
 * - At least one lowercase letter [a-z]
 * - At least one digit [0-9]
 * - At least one special character [^A-Za-z0-9]
 */
export function validatePasswordStrict(password: string): PasswordValidationResult {
  if (password.length < 10) {
    return { valid: false, error: "Password must be at least 10 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter (A-Z)." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter (a-z)." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number (0-9)." };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one special character (e.g. !@#$%^&*).",
    };
  }
  return { valid: true };
}

/**
 * Hashes a plaintext password using crypto.scrypt with a cryptographically secure 16-byte salt.
 */
export async function hashPassword(password: string): Promise<{ passwordHash: string; salt: string }> {
  const salt = crypto.randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve({ passwordHash: derivedKey.toString("hex"), salt });
    });
  });
}

/**
 * Verifies a candidate password against an existing scrypt hash and salt in constant time.
 */
export async function verifyPasswordHash(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  return new Promise((resolve) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return resolve(false);
      try {
        const storedBuffer = Buffer.from(storedHash, "hex");
        if (derivedKey.length !== storedBuffer.length) {
          return resolve(false);
        }
        resolve(crypto.timingSafeEqual(derivedKey, storedBuffer));
      } catch {
        resolve(false);
      }
    });
  });
}

/**
 * Verifies candidate credentials against the primary AdminCredential in Neon PostgreSQL.
 * If no custom credential record exists yet, gracefully falls back to process.env.ADMIN_PASSWORD.
 */
export async function verifyAdminPassword(candidate: string): Promise<boolean> {
  try {
    const cred = await prisma.adminCredential.findUnique({
      where: { id: "default" },
    });

    if (cred) {
      return await verifyPasswordHash(candidate, cred.passwordHash, cred.salt);
    }
  } catch (err) {
    console.error("Error retrieving AdminCredential from database:", err);
  }

  // Fallback to bootstrap environment variable
  const envPassword = getAdminPassword();
  return timingSafeEqualString(candidate, envPassword);
}

/**
 * Persists an updated admin password to Neon PostgreSQL as a salted scrypt hash.
 */
export async function saveAdminPassword(newPassword: string): Promise<void> {
  const { passwordHash, salt } = await hashPassword(newPassword);

  await prisma.adminCredential.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      passwordHash,
      salt,
    },
    update: {
      passwordHash,
      salt,
    },
  });
}
