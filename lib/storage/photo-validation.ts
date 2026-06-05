export const allowedPhotoTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const maxPhotoSizeBytes = 5 * 1024 * 1024;
export const maxPhotoCount = 3;

export type PhotoValidationResult =
  | { ok: true; files: File[] }
  | { ok: false; message: string };

export function validatePhotos(files: File[]): PhotoValidationResult {
  if (files.length > maxPhotoCount) {
    return { ok: false, message: "Envie no máximo 3 imagens." };
  }

  for (const file of files) {
    if (!allowedPhotoTypes.includes(file.type as (typeof allowedPhotoTypes)[number])) {
      return { ok: false, message: "Use apenas imagens JPG, PNG ou WEBP." };
    }
    if (file.size > maxPhotoSizeBytes) {
      return { ok: false, message: "Cada imagem deve ter no máximo 5 MB." };
    }
  }

  return { ok: true, files };
}
