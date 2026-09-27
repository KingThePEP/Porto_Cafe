import { z } from "zod";
import { ADMIN_ROLE, isAdminMetadata, isProtectedAdminPath, isPublicAdminPath } from "@/lib/supabase/auth-utils";
import { ORDER_STATUSES, isOrderStatus, orderStatusMeta } from "@/lib/admin/order-status";

export const signInSchema = z.object({
  email: z.string().trim().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  next: z.string().optional(),
});

export function safeNextPath(value?: string) {
  if (!value || !value.startsWith("/admin") || value.startsWith("//")) {
    return "/admin";
  }

  return value;
}

const optionalNumber = z
  .union([z.number(), z.nan(), z.null()])
  .optional()
  .transform((value) => (value === null || value === undefined || Number.isNaN(value) ? null : value));

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Nama kategori minimal 2 karakter").max(80),
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda -"),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  categoryId: z.string().uuid("Kategori tidak valid"),
  name: z.string().trim().min(2, "Nama menu minimal 2 karakter").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda -"),
  description: z.string().trim().max(600).default(""),
  note: z.string().trim().max(120).default(""),
  price: z.coerce.number().min(0, "Harga tidak valid").max(10_000_000),
  priceLarge: optionalNumber,
  priceLiter: optionalNumber,
  imageUrl: z.string().trim().url("URL gambar tidak valid").or(z.literal("")).default(""),
  isAvailable: z.boolean().default(true),
  isSignature: z.boolean().default(false),
});

export const postSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(4, "Judul minimal 4 karakter").max(160),
  slug: z
    .string()
    .trim()
    .min(4, "Slug minimal 4 karakter")
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda -"),
  excerpt: z.string().trim().max(320, "Ringkasan maksimal 320 karakter").default(""),
  content: z.string().trim().min(20, "Isi artikel minimal 20 karakter"),
  coverImage: z.string().trim().url("URL cover tidak valid").or(z.literal("")).default(""),
  tags: z.array(z.string().trim().min(1).max(30)).max(10, "Maksimal 10 tag").default([]),
  published: z.boolean().default(false),
});

export const gallerySchema = z.object({
  id: z.string().uuid().optional(),
  imageUrl: z.string().trim().url("URL gambar tidak valid"),
  caption: z.string().trim().max(160).default(""),
});

export const brandSchema = z.object({
  name: z.string().trim().min(2, "Nama brand minimal 2 karakter").max(80),
  tagline: z.string().trim().min(2, "Tagline minimal 2 karakter").max(160),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter").max(600),
  logoUrl: z.string().trim().url("URL logo tidak valid").or(z.literal("")).default(""),
  address: z.string().trim().min(5, "Alamat minimal 5 karakter").max(300),
  mapsUrl: z.string().trim().url("URL maps tidak valid").or(z.literal("")).default(""),
  instagram: z.string().trim().url("URL Instagram tidak valid").or(z.literal("")).default(""),
  tiktok: z.string().trim().url("URL TikTok tidak valid").or(z.literal("")).default(""),
  whatsapp: z.string().trim().url("URL WhatsApp tidak valid").or(z.literal("")).default(""),
  hours: z.string().trim().max(160).default(""),
});

export const uuidSchema = z.string().uuid();

export {
  ADMIN_ROLE,
  isAdminMetadata,
  isOrderStatus,
  isProtectedAdminPath,
  isPublicAdminPath,
  ORDER_STATUSES,
  orderStatusMeta,
};
