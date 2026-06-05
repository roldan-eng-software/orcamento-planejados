import { describe, expect, it } from "vitest";
import { anonymizeText, anonymizedCustomerName } from "@/lib/privacy/anonymize";

describe("anonymization", () => {
  it("removes personal identifiers from text", () => {
    expect(anonymizeText("Enviar para maria@example.com ou (11) 91234-5678")).toContain("[email anonimizado]");
    expect(anonymizedCustomerName()).toBe("Cliente anonimizado");
  });
});
