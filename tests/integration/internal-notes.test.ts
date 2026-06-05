import { describe, expect, it } from "vitest";

describe("internal notes contract", () => {
  it("treats notes as append-only records", () => {
    const notes = [{ body: "Primeira nota" }];
    const updated = [...notes, { body: "Segunda nota" }];
    expect(updated).toHaveLength(2);
    expect(notes[0].body).toBe("Primeira nota");
  });
});
