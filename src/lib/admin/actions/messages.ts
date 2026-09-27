"use server";

import { revalidatePath } from "next/cache";
import { actionError, actionOk, getAdminClient, type ActionResult } from "@/lib/supabase/admin";
import { uuidSchema } from "@/lib/admin/schemas";

export async function setMessageReadAction(input: {
  messageId: string;
  isRead: boolean;
}): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(input.messageId);

  if (!parsed.success) {
    return actionError("ID pesan tidak valid.");
  }

  const supabase = await getAdminClient();
  const { error } = await supabase
    .from("messages")
    .update({ read: input.isRead })
    .eq("id", parsed.data);

  if (error) {
    return actionError(`Gagal memperbarui pesan: ${error.message}`);
  }

  revalidatePath("/admin/pesan");

  return actionOk("Status pesan diperbarui.");
}

export async function deleteMessageAction(messageId: string): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(messageId);

  if (!parsed.success) {
    return actionError("ID pesan tidak valid.");
  }

  const supabase = await getAdminClient();
  const { error } = await supabase.from("messages").delete().eq("id", parsed.data);

  if (error) {
    return actionError(`Gagal menghapus pesan: ${error.message}`);
  }

  revalidatePath("/admin/pesan");

  return actionOk("Pesan dihapus.");
}
