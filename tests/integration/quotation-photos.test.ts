import { describe, expect, it } from "vitest";
import { validatePhotos } from "@/lib/storage/photo-validation";

describe("photo validation", () => {
  it("rejects too many images", () => {
    const files = Array.from({ length: 4 }, (_, index) => new File(["x"], `${index}.jpg`, { type: "image/jpeg" }));
    expect(validatePhotos(files).ok).toBe(false);
  });

  it("accepts supported images under the limit", () => {
    const files = [new File(["x"], "ambiente.webp", { type: "image/webp" })];
    expect(validatePhotos(files).ok).toBe(true);
  });
});
