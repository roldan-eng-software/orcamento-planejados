import { createServerSupabaseClient } from "@/lib/supabase/server";
import { validatePhotos } from "./photo-validation";

export type StoredPhoto = {
  storagePath: string;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
};

export async function storeQuotationPhotos(protocol: string, files: File[]) {
  const validation = validatePhotos(files);
  if (!validation.ok) {
    return { ok: false as const, message: validation.message };
  }

  if (files.length === 0) return { ok: true as const, photos: [] satisfies StoredPhoto[] };

  const supabase = await createServerSupabaseClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "quotation-photos";
  const photos: StoredPhoto[] = [];

  for (const [index, file] of files.entries()) {
    const extension = file.name.split(".").pop() ?? "jpg";
    const storagePath = `${protocol}/${index + 1}-${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) return { ok: false as const, message: error.message };
    photos.push({
      storagePath,
      originalFileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    });
  }

  return { ok: true as const, photos };
}
