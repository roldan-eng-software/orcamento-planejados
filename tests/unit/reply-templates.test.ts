import { describe, expect, it } from "vitest";
import { buildEmailReply, buildWhatsappReply } from "@/lib/admin/reply-templates";

describe("reply templates", () => {
  it("builds mailto with protocol", () => {
    const href = buildEmailReply({ email: "cliente@example.com", protocol: "ORC-20260605-0001" });
    expect(href).toContain("cliente%40example.com");
    expect(href).toContain("ORC-20260605-0001");
  });

  it("builds WhatsApp deep link with normalized Brazil number", () => {
    const href = buildWhatsappReply({ whatsapp: "(11) 91234-5678", protocol: "ORC-20260605-0001" });
    expect(href).toContain("https://wa.me/5511912345678");
    expect(href).toContain("ORC-20260605-0001");
  });
});
