import { normalizeEmail, normalizeWhatsapp } from "@/lib/formatting/locale";

export const throttleWindowMs = 10 * 60 * 1000;

export function getRetryAt(createdAt: Date, windowMs = throttleWindowMs) {
  return new Date(createdAt.getTime() + windowMs);
}

export function normalizeContactForThrottle(email: string, whatsapp: string) {
  return {
    normalizedEmail: normalizeEmail(email),
    normalizedWhatsapp: normalizeWhatsapp(whatsapp),
  };
}

export function isWithinThrottleWindow(createdAt: Date, now = new Date()) {
  return now.getTime() - createdAt.getTime() < throttleWindowMs;
}
