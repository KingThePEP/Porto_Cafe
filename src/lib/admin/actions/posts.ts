"use server";

import { revalidatePath } from "next/cache";
import { actionError, actionOk, getAdminClient, type ActionResult } from "@/lib/supabase/admin";
import { postSchema, uuidSchema } from "@/lib/admin/schemas";

function firstIssue(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message ?? "Data tidak valid";
}

export async function savePostAction(input: {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  published: boolean;
}): Promise<ActionResult> {
  const parsed = postSchema.safeParse(input);

  if (!parsed.success) {
    return actionError(firstIssue(parsed.error));
  }

  const supabase = await getAdminClient();
  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    cover_image: parsed.data.coverImage || null,
    tags: parsed.data.tags,
    published: parsed.data.published,
  };

  const { error } = parsed.data.id
    ? await supabase.from("posts").update(payload).eq("id", parsed.data.id)
    : await supabase.from("posts").insert(payload);

  if (error) {
    return actionError(`Gagal menyimpan artikel: ${error.message}`);
  }

  revalidatePath("/admin/artikel");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);

  return actionOk(parsed.data.published ? "Artikel published." : "Artikel disimpan sebagai draft.");
}

export async function togglePostPublishedAction(input: {
  postId: string;
  published: boolean;
}): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(input.postId);

  if (!parsed.success) {
    return actionError("ID artikel tidak valid.");
  }

  const supabase = await getAdminClient();
  const { error } = await supabase
    .from("posts")
    .update({ published: input.published })
    .eq("id", parsed.data);

  if (error) {
    return actionError(`Gagal memperbarui artikel: ${error.message}`);
  }

  revalidatePath("/admin/artikel");
  revalidatePath("/blog");

  return actionOk("Status publikasi diperbarui.");
}

export async function deletePostAction(postId: string): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(postId);

  if (!parsed.success) {
    return actionError("ID artikel tidak valid.");
  }

  const supabase = await getAdminClient();
  const { error } = await supabase.from("posts").delete().eq("id", parsed.data);

  if (error) {
    return actionError(`Gagal menghapus artikel: ${error.message}`);
  }

  revalidatePath("/admin/artikel");
  revalidatePath("/blog");

  return actionOk("Artikel dihapus.");
}
