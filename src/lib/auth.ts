import crypto from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "ruth_cms_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  sub: "admin";
  iat: number;
  exp: number;
}

/**
 * Safely compares two strings in constant time to prevent timing attacks.
 * Both inputs are hashed with SHA-256 first, ensuring equal buffer lengths
 * and preventing RangeErrors or length-based side-channel leaks.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Retrieves the cryptographic secret used to sign session cookies.
 */
export function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SESSION_SECRET is required in production");
    }
    return "dev-local-session-secret-ruth-cms-32-chars-minimum-key";
  }
  return secret;
}

/**
 * Retrieves the configured admin password.
 */
export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_PASSWORD is required in production");
    }
    return "admin_ruth_cms_development_password_2026";
  }
  return password;
}

/**
 * Generates an HMAC-SHA256 signed session token: base64url(payload).base64url(signature)
 */
export function signSessionToken(payload: SessionPayload, secret = getSessionSecret()): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Verifies a session token string.
 * Validates HMAC signature using constant-time comparison and checks expiration.
 */
export function verifySessionToken(token: string | undefined, secret = getSessionSecret()): SessionPayload | null {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [dataPart, signaturePart] = parts;
  const expectedSignature = crypto.createHmac("sha256", secret).update(dataPart).digest("base64url");

  if (!timingSafeEqualString(signaturePart, expectedSignature)) {
    return null;
  }

  try {
    const rawPayload = Buffer.from(dataPart, "base64url").toString("utf-8");
    const payload = JSON.parse(rawPayload) as SessionPayload;

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < nowSeconds) {
      return null;
    }

    if (payload.sub !== "admin") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Sets the secure HTTP-only session cookie in response headers.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Clears the session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Retrieves the current session from incoming request cookies.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/**
 * Guard utility for Server Actions and Server Components.
 * Throws an Error if no valid session is present.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
