"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminUser } from "@/lib/supabase/auth-utils";
import { actionError, type ActionResult } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { safeNextPath, signInSchema } from "@/lib/admin/schemas";

export async function signInAction(input: {
  email: string;
  password: string;
  next?: string;
}): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return actionError(
      "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.",
    );
  }

  const parsed = signInSchema.safeParse(input);

  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Data login tidak valid");
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return actionError("Email atau password salah.");
  }

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    return actionError("Akun ini tidak punya akses admin.");
  }

  revalidatePath("/admin", "layout");
  redirect(safeNextPath(parsed.data.next));
}

export async function signOutAction(): Promise<ActionResult> {
  if (isSupabaseConfigured()) {
    await createClient().auth.signOut();
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}
