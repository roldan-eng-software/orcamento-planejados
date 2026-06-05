import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function parseEnv(content) {
  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith("#"))
      .map((line) => {
        const [key, ...rest] = line.split("=");
        const value = rest.join("=").trim().replace(/^\"|\"$/g, "");
        return [key.trim(), value];
      }),
  );
}

function loadEnvFile(path) {
  try {
    return parseEnv(readFileSync(path, "utf8"));
  } catch (error) {
    return {};
  }
}

const envPath = resolve(process.cwd(), ".env");
const env = loadEnvFile(envPath);
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? env.SUPABASE_STORAGE_BUCKET ?? "quotation-photos";

if (!SUPABASE_URL) {
  console.error("Faltando NEXT_PUBLIC_SUPABASE_URL no ambiente ou em .env");
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Faltando SUPABASE_SERVICE_ROLE_KEY no ambiente ou em .env");
  process.exit(1);
}

console.log("Verificando Supabase Storage...");
console.log(`URL: ${SUPABASE_URL}`);
console.log(`Bucket: ${SUPABASE_STORAGE_BUCKET}`);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function run() {
  const bucketName = SUPABASE_STORAGE_BUCKET;

  const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucketName);
  if (bucketError) {
    console.error(`Erro ao buscar bucket '${bucketName}': ${bucketError.message}`);
    process.exit(1);
  }

  if (!bucketData) {
    console.error(`Bucket '${bucketName}' não encontrado.`);
    process.exit(1);
  }

  console.log(`Bucket '${bucketName}' encontrado com sucesso.`);

  const testPath = `storage-check-${Date.now()}.txt`;
  const uploadBody = Buffer.from("Supabase storage verification\n");
  const { error: uploadError } = await supabase.storage.from(bucketName).upload(testPath, uploadBody, {
    contentType: "text/plain",
    upsert: false,
  });

  if (uploadError) {
    console.error(`Falha ao gravar no bucket '${bucketName}': ${uploadError.message}`);
    process.exit(1);
  }

  console.log(`Upload de teste realizado com sucesso em '${testPath}'.`);

  const { data: deleteResult, error: deleteError } = await supabase.storage.from(bucketName).remove([testPath]);
  if (deleteError) {
    console.error(`Upload test foi concluído, mas falha ao remover o arquivo '${testPath}': ${deleteError.message}`);
    process.exit(1);
  }

  console.log(`Arquivo de teste removido com sucesso.`);
  console.log("Verificação de storage concluída. Bucket existe e permissão de escrita está OK.");
}

run().catch((error) => {
  console.error("Erro inesperado:", error);
  process.exit(1);
});
