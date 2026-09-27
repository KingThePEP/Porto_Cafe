"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/admin/order-status";
import { actionError, actionOk, getAdminClient, type ActionResult } from "@/lib/supabase/admin";
import { uuidSchema } from "@/lib/admin/schemas";

const statusSchema = z.enum(ORDER_STATUSES);

export async function updateOrderStatusAction(input: {
  orderId: string;
  status: string;
}): Promise<ActionResult> {
  const orderId = uuidSchema.safeParse(input.orderId);

  if (!orderId.success) {
    return actionError("ID pesanan tidak valid.");
  }

  const status = statusSchema.safeParse(input.status);

  if (!status.success) {
    return actionError("Status pesanan tidak dikenal.");
  }

  const supabase = await getAdminClient();
  const { error } = await supabase.from("orders").update({ status: status.data }).eq("id", orderId.data);

  if (error) {
    return actionError(`Gagal memperbarui status: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/pesanan");

  return actionOk("Status pesanan diperbarui.");
}

export async function deleteOrderAction(orderId: string): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(orderId);

  if (!parsed.success) {
    return actionError("ID pesanan tidak valid.");
  }

  const supabase = await getAdminClient();
  const { error } = await supabase.from("orders").delete().eq("id", parsed.data);

  if (error) {
    return actionError(`Gagal menghapus pesanan: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/pesanan");

  return actionOk("Pesanan dihapus.");
}
