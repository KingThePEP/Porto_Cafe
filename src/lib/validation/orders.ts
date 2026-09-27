import { z } from "zod";

export const orderSizeSchema = z.enum(["regular", "large", "liter"]);

// Client hanya mengirim identitas produk, ukuran, dan jumlah. Harga SENGAJA
// tidak ada di sini: server menghitung ulang dari tabel products, jadi nilai
// yang dikirim browser tidak pernah dipakai. Field tambahan dari client juga
// diabaikan oleh .strip() default Zod.
export const orderItemSchema = z.object({
  // Zod 4 memakai satu parameter `error` untuk semua jenis kegagalan, termasuk
  // nilai null yang bisa muncul dari menu fallback lokal tanpa uuid produk.
  productId: z.string({ error: "Menu tidak valid" }).trim().uuid("Menu tidak valid"),
  size: orderSizeSchema,
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
  items: z.array(orderItemSchema).min(1, "Keranjang masih kosong").max(50, "Terlalu banyak item"),
});

export type OrderPayload = z.infer<typeof orderPayloadSchema>;
export type OrderSize = z.infer<typeof orderSizeSchema>;

export function firstIssueMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Data tidak valid";
}
