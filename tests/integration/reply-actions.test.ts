import { describe, expect, it } from "vitest";
import { getReplyActions } from "@/lib/admin/reply-actions";

describe("reply actions", () => {
  it("derives preferred channel actions", () => {
    const actions = getReplyActions({
      protocol: "ORC-20260605-0001",
      customerEmail: "cliente@example.com",
      customerWhatsapp: "(11) 91234-5678",
      preferredContactChannel: "WHATSAPP",
    } as never);
    expect(actions.whatsapp?.preferred).toBe(true);
    expect(actions.email?.preferred).toBe(false);
  });
});
