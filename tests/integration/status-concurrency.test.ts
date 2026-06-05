import { describe, expect, it } from "vitest";

function isStale(currentVersion: number, expectedVersion: number) {
  return currentVersion !== expectedVersion;
}

describe("status concurrency", () => {
  it("detects stale status markers", () => {
    expect(isStale(2, 1)).toBe(true);
    expect(isStale(2, 2)).toBe(false);
  });
});
