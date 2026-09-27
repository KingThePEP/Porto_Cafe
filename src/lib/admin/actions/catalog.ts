"use server";

import { revalidatePath } from "next/cache";
import { actionError, actionOk, getAdminClient, type ActionResult } from "@/lib/supabase/admin";
import { categorySchema, productSchema, uuidSchema } from "@/lib/admin/schemas";

function firstIssue(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message ?? "Data tidak valid";
}

export async function saveCategoryAction(input: {
  id?: string;
  name: string;
  slug: string;
  sortOrder: number;
}): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(input);

  if (!parsed.success) {
    return actionError(firstIssue(parsed.error));
  }

  const supabase = await getAdminClient();
  const payload = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    sort_order: parsed.data.sortOrder,
  };

  const { error } = parsed.data.id
    ? await supabase.from("categories").update(payload).eq("id", parsed.data.id)
    : await supabase.from("categories").insert(payload);

  if (error) {
    return actionError(`Gagal menyimpan kategori: ${error.message}`);
  }

  revalidatePath("/admin/menu");
  revalidatePath("/menu");

  return actionOk("Kategori tersimpan.");
}

export async function deleteCategoryAction(categoryId: string): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(categoryId);

  if (!parsed.success) {
    return actionError("ID kategori tidak valid.");
  }

  const supabase = await getAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", parsed.data);

  if (error) {
    return actionError(`Gagal menghapus kategori: ${error.message}`);
  }

  revalidatePath("/admin/menu");
  revalidatePath("/menu");

  return actionOk("Kategori dihapus. Produk di dalamnya kini tanpa kategori.");
}

export async function saveProductAction(input: {
  id?: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  note: string;
  price: number;
  priceLarge: number | null;
  priceLiter: number | null;
  imageUrl: string;
  isAvailable: boolean;
  isSignature: boolean;
}): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);

  if (!parsed.success) {
    return actionError(firstIssue(parsed.error));
  }

  const supabase = await getAdminClient();
  const payload = {
    category_id: parsed.data.categoryId,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    note: parsed.data.note || null,
    price: parsed.data.price,
    price_large: parsed.data.priceLarge,
    price_liter: parsed.data.priceLiter,
    image_url: parsed.data.imageUrl || null,
    is_available: parsed.data.isAvailable,
    is_signature: parsed.data.isSignature,
  };

  const { error } = parsed.data.id
    ? await supabase.from("products").update(payload).eq("id", parsed.data.id)
    : await supabase.from("products").insert(payload);

  if (error) {
    return actionError(`Gagal menyimpan produk: ${error.message}`);
  }

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/");

  return actionOk("Produk tersimpan.");
}

export async function toggleProductAvailabilityAction(input: {
  productId: string;
  isAvailable: boolean;
}): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(input.productId);

  if (!parsed.success) {
    return actionError("ID produk tidak valid.");
  }

  const supabase = await getAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ is_available: input.isAvailable })
    .eq("id", parsed.data);

  if (error) {
    return actionError(`Gagal memperbarui produk: ${error.message}`);
  }

  revalidatePath("/admin/menu");
  revalidatePath("/menu");

  return actionOk("Status ketersediaan diperbarui.");
}

export async function deleteProductAction(productId: string): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(productId);

  if (!parsed.success) {
    return actionError("ID produk tidak valid.");
  }

  const supabase = await getAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", parsed.data);

  if (error) {
    return actionError(`Gagal menghapus produk: ${error.message}`);
  }

  revalidatePath("/admin/menu");
  revalidatePath("/menu");

  return actionOk("Produk dihapus.");
}
