import { createServerSupabaseClient } from "@/lib/supabase/server";
import { validatePhotos } from "./photo-validation";

export type StoredPhoto = {
  storagePath: string;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
};

function getStorageBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET ?? "quotation-photos";
}

export async function ensureStorageBucketAvailable() {
  const bucket = getStorageBucketName();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.storage.getBucket(bucket);

  if (error) {
    return {
      ok: false as const,
      message: `Falha ao acessar bucket Supabase "${bucket}": ${error.message}`,
    };
  }

  if (!data) {
    return {
      ok: false as const,
      message: `Bucket Supabase "${bucket}" não foi encontrado. Verifique SUPABASE_STORAGE_BUCKET.`,
    };
  }

  return { ok: true as const, bucket };
}

export async function storeQuotationPhotos(protocol: string, files: File[]) {
  const validation = validatePhotos(files);
  if (!validation.ok) {
    return { ok: false as const, message: validation.message };
  }

  if (files.length === 0) return { ok: true as const, photos: [] satisfies StoredPhoto[] };

  const bucket = getStorageBucketName();
  const bucketCheck = await ensureStorageBucketAvailable();
  if (!bucketCheck.ok) {
    return bucketCheck;
  }

  const supabase = await createServerSupabaseClient();
  const photos: StoredPhoto[] = [];

  for (const [index, file] of files.entries()) {
    const extension = file.name.split(".").pop() ?? "jpg";
    const storagePath = `${protocol}/${index + 1}-${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      const message = /bucket.*not found|not found/i.test(error.message)
        ? `Bucket Supabase "${bucket}" não encontrado. Verifique SUPABASE_STORAGE_BUCKET.`
        : /permission|access denied|not authorized|forbidden/i.test(error.message)
        ? `Sem permissão de gravação no bucket Supabase "${bucket}". Verifique SUPABASE_SERVICE_ROLE_KEY e as regras do bucket.`
        : `Erro ao enviar a foto: ${error.message}`;
      return { ok: false as const, message };
    }

    photos.push({
      storagePath,
      originalFileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    });
  }

  return { ok: true as const, photos };
}
