import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function assertSupabaseEnv(name: string, value: string | undefined, placeholder?: string) {
  if (!value || (placeholder && value === placeholder)) {
    throw new Error(
      `${name} is not configured or is using the placeholder value. Set this env var in Vercel and redeploy.`,
    );
  }

  return value;
}

const SUPABASE_URL = assertSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL, "https://example.supabase.co");
const SUPABASE_PUBLISHABLE_KEY = assertSupabaseEnv(
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  "publishable-key",
);

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}
