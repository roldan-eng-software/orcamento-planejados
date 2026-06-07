import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

function assertEnv(name: string, value: string | undefined, placeholders: string[] = []) {
  if (!value || placeholders.includes(value)) {
    throw new Error(
      `${name} is not configured or is using the placeholder value. Set this env var in Vercel and redeploy.`,
    );
  }

  return value;
}

function getSupabaseUrl() {
  return assertEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL, [
    "https://example.supabase.co",
    "https://your-project.supabase.co",
  ]);
}

function getSupabasePublishableKey() {
  return assertEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ["publishable-key", "your-publishable-key", "anon-key", "your-anon-key"],
  );
}

function getSupabaseServiceRoleKey() {
  return assertEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY, [
    "service-role-key",
    "your-service-role-key",
  ]);
}

export async function createServerSupabaseClient({
  allowCookieWrites = false,
}: {
  allowCookieWrites?: boolean;
} = {}) {
  const cookieStore = await cookies();
  type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<typeof cookieStore.set>[2];
  };
  const cookieMethods = {
    getAll() {
      return cookieStore.getAll();
    },
    ...(allowCookieWrites
      ? {
          setAll(cookiesToSet: CookieToSet[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        }
      : {}),
  };

  return createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: cookieMethods,
  });
}

export function createServiceRoleSupabaseClient() {
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
