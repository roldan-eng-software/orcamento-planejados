import { describe, expect, it } from "vitest";
import { getRetryAt, isWithinThrottleWindow, normalizeContactForThrottle } from "@/lib/quotation/throttle";

describe("throttle helpers", () => {
  it("normalizes email and WhatsApp for repeat-submission checks", () => {
    expect(normalizeContactForThrottle(" USER@EXAMPLE.COM ", "(11) 91234-5678")).toEqual({
      normalizedEmail: "user@example.com",
      normalizedWhatsapp: "5511912345678",
    });
  });

  it("detects a submission inside the 10-minute window", () => {
    const createdAt = new Date("2026-06-05T10:00:00Z");
    expect(isWithinThrottleWindow(createdAt, new Date("2026-06-05T10:09:00Z"))).toBe(true);
    expect(getRetryAt(createdAt).toISOString()).toBe("2026-06-05T10:10:00.000Z");
  });
});
