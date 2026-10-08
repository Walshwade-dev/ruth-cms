"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  getAdminPassword,
  setSessionCookie,
  signSessionToken,
  timingSafeEqualString,
  SessionPayload,
} from "@/lib/auth";
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from "@/lib/rate-limit";

export interface LoginActionState {
  error?: string;
  success?: boolean;
}

/**
 * Extracts the remote client IP for rate limiting from request headers.
 */
async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headerStore.get("x-real-ip") ?? "127.0.0.1";
}

/**
 * Server Action to authenticate the CMS owner.
 */
export async function loginAdmin(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const password = formData.get("password")?.toString() ?? "";
  const next = formData.get("next")?.toString() ?? "/admin";
  const ip = await getClientIp();

  // 1. Check rate limit
  const rateLimitStatus = checkRateLimit(ip);
  if (!rateLimitStatus.allowed) {
    return {
      error: `Too many failed login attempts. Please wait ${rateLimitStatus.retryAfterSeconds} seconds before trying again.`,
    };
  }

  // 2. Validate password in constant time
  const adminPassword = getAdminPassword();
  const isValid = timingSafeEqualString(password, adminPassword);

  if (!isValid) {
    // Record failed attempt and apply artificial delay
    await recordFailedAttempt(ip);
    return {
      error: "Invalid passphrase. Please verify your admin password and try again.",
    };
  }

  // 3. Reset rate limit on success
  resetRateLimit(ip);

  // 4. Issue cryptographic session token (7 days)
  const nowSeconds = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: "admin",
    iat: nowSeconds,
    exp: nowSeconds + 60 * 60 * 24 * 7,
  };

  const token = signSessionToken(payload);
  await setSessionCookie(token);

  // 5. Redirect to destination (or /admin)
  const destination = next.startsWith("/admin") ? next : "/admin";
  redirect(destination);
}

/**
 * Server Action to log out the CMS owner.
 */
export async function logoutAdmin(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}
