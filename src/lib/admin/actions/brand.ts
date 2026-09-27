"use server";

import { revalidatePath } from "next/cache";
import { actionError, actionOk, getAdminClient, type ActionResult } from "@/lib/supabase/admin";
import { brandSchema } from "@/lib/admin/schemas";

export async function saveBrandProfileAction(input: {
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  address: string;
  mapsUrl: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
  hours: string;
}): Promise<ActionResult> {
  const parsed = brandSchema.safeParse(input);

  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Data brand tidak valid");
  }

  const supabase = await getAdminClient();
  const { data: existing } = await supabase
    .from("brand_profile")
    .select("id, social_links")
    .limit(1)
    .maybeSingle();

  const previousLinks =
    existing && typeof existing.social_links === "object" && existing.social_links !== null
      ? (existing.social_links as Record<string, unknown>)
      : {};

  const socialLinks: Record<string, unknown> = {
    ...previousLinks,
    instagram: parsed.data.instagram,
    tiktok: parsed.data.tiktok,
    whatsapp: parsed.data.whatsapp,
    hours: parsed.data.hours,
  };

  const payload = {
    name: parsed.data.name,
    tagline: parsed.data.tagline,
    description: parsed.data.description,
    logo_url: parsed.data.logoUrl || null,
    address: parsed.data.address,
    maps_url: parsed.data.mapsUrl || null,
    social_links: socialLinks,
  };

  const { error } = existing
    ? await supabase.from("brand_profile").update(payload).eq("id", existing.id)
    : await supabase.from("brand_profile").insert(payload);

  if (error) {
    return actionError(`Gagal menyimpan profil brand: ${error.message}`);
  }

  revalidatePath("/admin/profil");
  revalidatePath("/about");
  revalidatePath("/");

  return actionOk("Profil brand tersimpan.");
}
