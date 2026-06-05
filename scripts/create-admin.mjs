import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`Variaveis ausentes: ${missingEnv.join(", ")}`);
  process.exit(1);
}

const role = process.env.ADMIN_ROLE || "ADMIN";

if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
  console.error('ADMIN_ROLE deve ser "ADMIN" ou "SUPER_ADMIN".');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role },
  });

  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error("Usuario nao retornado pelo Supabase Auth.");

  await prisma.adminUser.upsert({
    where: { email },
    update: { id: user.id, role },
    create: { id: user.id, email, role },
  });

  console.log("Admin criado:", { id: user.id, email, role });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
