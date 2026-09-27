import { z } from "zod";

export const orderItemSchema = z.object({
  productName: z.string().trim().min(1, "Nama menu tidak boleh kosong").max(160),
  sizeLabel: z.string().trim().min(1, "Ukuran tidak boleh kosong").max(20),
  price: z.number().nonnegative("Harga tidak valid"),
  qty: z.number().int("Jumlah harus bilangan bulat").min(1).max(50, "Jumlah maksimal 50"),
});

export const orderPayloadSchema = z.object({
  customerName: z.string().trim().min(3, "Nama minimal 3 karakter").max(120),
  customerPhone: z
    .string()
    .trim()
    .min(9, "Nomor WhatsApp minimal 9 digit")
    .max(30)
    .regex(/^[0-9+\-\s]+$/, "Nomor hanya boleh berisi angka, spasi, atau tanda -"),
  orderType: z.enum(["pickup", "delivery"]),
  address: z.string().trim().max(300, "Alamat terlalu panjang").optional(),
  notes: z.string().trim().max(300, "Catatan terlalu panjang").optional(),
  total: z.number().positive("Total tidak valid"),
  items: z.array(orderItemSchema).min(1, "Keranjang masih kosong"),
});

export type OrderPayload = z.infer<typeof orderPayloadSchema>;

export function firstIssueMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Data tidak valid";
}
