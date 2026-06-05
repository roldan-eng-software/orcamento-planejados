import { describe, expect, it } from "vitest";
import { sendQuotationReceipt } from "@/lib/email/quotation-receipt";

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }
  process.env[key] = value;
}

describe("receipt status", () => {
  it("returns FAILED when SMTP is not configured", async () => {
    const oldUser = process.env.SMTP_USER;
    const oldPassword = process.env.SMTP_PASSWORD;
    const oldFrom = process.env.SMTP_FROM_EMAIL;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASSWORD;
    delete process.env.SMTP_FROM_EMAIL;
    await expect(sendQuotationReceipt({ to: "a@b.com", name: "Ana", protocol: "ORC-20260605-0001" })).resolves.toMatchObject({
      status: "FAILED",
    });
    restoreEnv("SMTP_USER", oldUser);
    restoreEnv("SMTP_PASSWORD", oldPassword);
    restoreEnv("SMTP_FROM_EMAIL", oldFrom);
  });
});
