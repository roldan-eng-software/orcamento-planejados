"use client";

import { maxPhotoCount, maxPhotoSizeBytes } from "@/lib/storage/photo-validation";

export function PhotoUploadField() {
  const maxPhotoSizeMb = maxPhotoSizeBytes / 1024 / 1024;

  return (
    <div className="grid gap-2">
      <input
        className="focus-ring w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm"
        type="file"
        name="photos"
        accept="image/jpeg,image/png,image/webp"
        multiple
      />
      <p className="text-xs text-[var(--muted)]">
        Até {maxPhotoCount} imagens, JPG/PNG/WEBP, até {maxPhotoSizeMb} MB cada.
      </p>
    </div>
  );
}
