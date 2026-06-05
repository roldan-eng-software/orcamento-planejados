"use client";

export function PhotoUploadField() {
  return (
    <input
      className="focus-ring w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm"
      type="file"
      name="photos"
      accept="image/jpeg,image/png,image/webp"
      multiple
    />
  );
}
