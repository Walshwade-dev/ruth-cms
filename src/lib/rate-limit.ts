interface RateLimitRecord {
  attempts: number;
  resetAt: number;
}

const attemptStore = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const FAILURE_DELAY_MS = 1000; // 1 second artificial delay on failure

/**
 * Checks whether an IP address is currently rate-limited.
 */
export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = attemptStore.get(ip);

  if (!record) {
    return { allowed: true };
  }

  if (now > record.resetAt) {
    attemptStore.delete(ip);
    return { allowed: true };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true };
}

/**
 * Records a failed login attempt for the given IP and applies an artificial delay.
 */
export async function recordFailedAttempt(ip: string): Promise<void> {
  const now = Date.now();
  const record = attemptStore.get(ip);

  if (!record || now > record.resetAt) {
    attemptStore.set(ip, {
      attempts: 1,
      resetAt: now + WINDOW_MS,
    });
  } else {
    record.attempts += 1;
  }

  // Artificial delay to starve automated rapid dictionary attacks
  await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
}

/**
 * Resets the attempt counter for an IP address upon successful authentication.
 */
export function resetRateLimit(ip: string): void {
  attemptStore.delete(ip);
}
