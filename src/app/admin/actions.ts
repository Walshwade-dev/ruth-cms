"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  requireAuth,
  setSessionCookie,
  signSessionToken,
  SessionPayload,
} from "@/lib/auth";
import {
  verifyAdminPassword,
  saveAdminPassword,
  validatePasswordStrict,
} from "@/lib/credentials";
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from "@/lib/rate-limit";

export interface LoginActionState {
  error?: string;
  success?: boolean;
}

export interface ChangePasswordActionState {
  error?: string;
  success?: boolean;
  message?: string;
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

  // 2. Validate password (checks database AdminCredential first, falls back to env)
  const isValid = await verifyAdminPassword(password);

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
 * Server Action to change the admin password after verifying existing identity.
 */
export async function changeAdminPassword(
  _prevState: ChangePasswordActionState,
  formData: FormData
): Promise<ChangePasswordActionState> {
  // 1. Defense-in-depth: caller must have a valid session
  await requireAuth();

  const currentPassword = formData.get("currentPassword")?.toString() ?? "";
  const newPassword = formData.get("newPassword")?.toString() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

  const ip = await getClientIp();

  // 2. Rate-limiting for password changes
  const rateLimitStatus = checkRateLimit(`pwd_change_${ip}`);
  if (!rateLimitStatus.allowed) {
    return {
      error: `Too many password change attempts. Please wait ${rateLimitStatus.retryAfterSeconds} seconds before trying again.`,
    };
  }

  // 3. Identity Verification: must provide and verify current password
  if (!currentPassword) {
    return { error: "Please enter your current password to verify your identity." };
  }

  const isCurrentValid = await verifyAdminPassword(currentPassword);
  if (!isCurrentValid) {
    await recordFailedAttempt(`pwd_change_${ip}`);
    return { error: "Current password is incorrect. Identity verification failed." };
  }

  // 4. New password confirmation check
  if (!newPassword || !confirmPassword) {
    return { error: "New password and password confirmation are required." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "The new passwords do not match. Please re-enter both." };
  }

  // 5. Difference check
  if (newPassword === currentPassword) {
    return { error: "Your new password must be different from your current password." };
  }

  // 6. Strict complexity validation (min 10 chars, uppercase, lowercase, number, special char)
  const validation = validatePasswordStrict(newPassword);
  if (!validation.valid) {
    return { error: validation.error };
  }

  // 7. Persist to Neon PostgreSQL as a salted scrypt hash
  try {
    await saveAdminPassword(newPassword);
    resetRateLimit(`pwd_change_${ip}`);

    // Re-issue a fresh 7-day session token
    const nowSeconds = Math.floor(Date.now() / 1000);
    const payload: SessionPayload = {
      sub: "admin",
      iat: nowSeconds,
      exp: nowSeconds + 60 * 60 * 24 * 7,
    };
    const token = signSessionToken(payload);
    await setSessionCookie(token);

    return {
      success: true,
      message: "Password changed successfully. Your new credentials are active immediately.",
    };
  } catch (err) {
    console.error("Error saving updated admin password:", err);
    return {
      error: "An unexpected error occurred while updating your password. Please try again.",
    };
  }
}

/**
 * Server Action to log out the CMS owner.
 */
export async function logoutAdmin(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

