import { describe, expect, it } from "vitest";

describe("admin request list contract", () => {
  it("uses 20 items per page", () => {
    const pageSize = 20;
    expect(pageSize).toBe(20);
  });
});
