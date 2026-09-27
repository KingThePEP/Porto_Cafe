import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { actionError, actionOk, type ActionResult } from "@/lib/admin/types";
import { isAdminUser } from "@/lib/supabase/auth-utils";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export { actionError, actionOk, type ActionResult };

export function isAdminConfigured() {
  return isSupabaseConfigured();
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user ?? null;
  } catch {
    return null;
  }
});

export async function requireAdmin(): Promise<User> {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?error=not-configured");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdminUser(user)) {
    redirect("/admin/login?error=forbidden");
  }

  return user;
}

export async function getAdminClient(): Promise<SupabaseClient> {
  await requireAdmin();
  return createClient();
}
