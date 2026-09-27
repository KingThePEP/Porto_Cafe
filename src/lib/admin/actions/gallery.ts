"use server";

import { revalidatePath } from "next/cache";
import { actionError, actionOk, getAdminClient, type ActionResult } from "@/lib/supabase/admin";
import { gallerySchema, uuidSchema } from "@/lib/admin/schemas";

export async function saveGalleryItemAction(input: {
  id?: string;
  imageUrl: string;
  caption: string;
}): Promise<ActionResult> {
  const parsed = gallerySchema.safeParse(input);

  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Data galeri tidak valid");
  }

  const supabase = await getAdminClient();
  const payload = {
    image_url: parsed.data.imageUrl,
    caption: parsed.data.caption || null,
  };

  const { error } = parsed.data.id
    ? await supabase.from("gallery").update(payload).eq("id", parsed.data.id)
    : await supabase.from("gallery").insert(payload);

  if (error) {
    return actionError(`Gagal menyimpan foto galeri: ${error.message}`);
  }

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");

  return actionOk("Galeri tersimpan.");
}

export async function deleteGalleryItemAction(itemId: string): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(itemId);

  if (!parsed.success) {
    return actionError("ID galeri tidak valid.");
  }

  const supabase = await getAdminClient();
  const { error } = await supabase.from("gallery").delete().eq("id", parsed.data);

  if (error) {
    return actionError(`Gagal menghapus foto galeri: ${error.message}`);
  }

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");

  return actionOk("Foto galeri dihapus.");
}
