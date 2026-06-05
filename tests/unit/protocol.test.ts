import { describe, expect, it } from "vitest";
import { generateProtocol } from "@/lib/quotation/protocol";

describe("generateProtocol", () => {
  it("generates the required protocol format", () => {
    expect(generateProtocol(new Date("2026-06-05T12:00:00Z"), 42)).toBe("ORC-20260605-0042");
  });
});
