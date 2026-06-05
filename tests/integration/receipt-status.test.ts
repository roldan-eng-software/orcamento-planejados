import { describe, expect, it } from "vitest";
import { sendQuotationReceipt } from "@/lib/email/quotation-receipt";

describe("receipt status", () => {
  it("returns FAILED when Resend is not configured", async () => {
    const oldKey = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;
    await expect(sendQuotationReceipt({ to: "a@b.com", name: "Ana", protocol: "ORC-20260605-0001" })).resolves.toMatchObject({
      status: "FAILED",
    });
    process.env.RESEND_API_KEY = oldKey;
  });
});
