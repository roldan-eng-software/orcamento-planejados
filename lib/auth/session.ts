import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminRole } from "./roles";

export async function getAdminSession() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const role = user?.app_metadata?.role as string | undefined;

  if (!user || !isAdminRole(role)) {
    return null;
  }

  return { user, role };
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
