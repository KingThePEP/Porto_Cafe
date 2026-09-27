import "server-only";

import { cache } from "react";
import type { OrderStatus } from "@/lib/admin/order-status";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

export type { OrderStatus } from "@/lib/admin/order-status";

export type AdminOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: "pickup" | "delivery";
  address: string | null;
  notes: string | null;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: AdminOrderItem[];
};

export type AdminOrderItem = {
  id: string;
  productName: string;
  price: number;
  qty: number;
  subtotal: number;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  productCount: number;
};

export type AdminProduct = {
  id: string;
  categoryId: string | null;
  name: string;
  slug: string;
  description: string;
  price: number;
  priceLarge: number | null;
  priceLiter: number | null;
  imageUrl: string | null;
  isAvailable: boolean;
  isSignature: boolean;
  updatedAt: string;
};

export type AdminPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminMessage = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  type: "contact" | "reservation";
  isRead: boolean;
  createdAt: string;
};

export type AdminGalleryItem = {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
};

export type BrandProfile = {
  name: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  address: string | null;
  mapsUrl: string | null;
  socialLinks: Record<string, unknown>;
};

type OrderRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  order_type: "pickup" | "delivery";
  address: string | null;
  notes: string | null;
  total: number | string;
  status: OrderStatus;
  created_at: string;
  order_items: { id: string; product_name: string; price: number | string; qty: number; subtotal: number | string }[] | null;
};

function mapOrder(row: OrderRow): AdminOrder {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    orderType: row.order_type,
    address: row.address,
    notes: row.notes,
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at,
    items: (row.order_items ?? []).map((item) => ({
      id: item.id,
      productName: item.product_name,
      price: Number(item.price),
      qty: item.qty,
      subtotal: Number(item.subtotal),
    })),
  };
}

export const getOrders = cache(async (status?: OrderStatus): Promise<AdminOrder[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await getAdminClient();
  let query = supabase
    .from("orders")
    .select(
      "id, customer_name, customer_phone, order_type, address, notes, total, status, created_at, order_items(id, product_name, price, qty, subtotal)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return (data as unknown as OrderRow[]).map(mapOrder);
});

export const getDashboardStats = cache(async () => {
  const orders = await getOrders();
  const pending = orders.filter((order) => order.status === "pending");
  const unreadMessages = await getMessages();

  let products = 0;
  let posts = 0;
  let categories = 0;
  let galleryCount = 0;

  if (isSupabaseConfigured()) {
    const supabase = await getAdminClient();
    const [productCount, postCount, categoryCount, gallery] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("gallery").select("id", { count: "exact", head: true }),
    ]);

    products = productCount.count ?? 0;
    posts = postCount.count ?? 0;
    categories = categoryCount.count ?? 0;
    galleryCount = gallery.count ?? 0;
  }

  return {
    totalOrders: orders.length,
    pendingOrders: pending.length,
    revenue: orders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.total, 0),
    unreadMessages: unreadMessages.filter((message) => !message.isRead).length,
    products,
    posts,
    categories,
    gallery: galleryCount,
    recentOrders: orders.slice(0, 5),
  };
});

export const getCategories = cache(async (): Promise<AdminCategory[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await getAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order, products(count)")
    .order("sort_order", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    sortOrder: row.sort_order,
    productCount: Array.isArray(row.products) ? row.products.length : 0,
  }));
});

export const getProducts = cache(async (): Promise<AdminProduct[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await getAdminClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, category_id, name, slug, description, price, price_large, price_liter, image_url, is_available, is_signature, updated_at",
    )
    .order("name", { ascending: true });

  return (data ?? []).map((row) => ({
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    priceLarge: row.price_large === null ? null : Number(row.price_large),
    priceLiter: row.price_liter === null ? null : Number(row.price_liter),
    imageUrl: row.image_url,
    isAvailable: row.is_available,
    isSignature: row.is_signature,
    updatedAt: row.updated_at,
  }));
});

export const getPosts = cache(async (): Promise<AdminPost[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await getAdminClient();
  const { data } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, content, cover_image, tags, published, created_at, updated_at")
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    tags: row.tags ?? [],
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
});

export const getMessages = cache(async (): Promise<AdminMessage[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await getAdminClient();
  const { data } = await supabase
    .from("messages")
    .select("id, name, email, phone, subject, message, type, read, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    type: row.type,
    isRead: row.read,
    createdAt: row.created_at,
  }));
});

export const getGallery = cache(async (): Promise<AdminGalleryItem[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await getAdminClient();
  const { data } = await supabase
    .from("gallery")
    .select("id, image_url, caption, created_at")
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    imageUrl: row.image_url,
    caption: row.caption,
    createdAt: row.created_at,
  }));
});

export const getBrandProfile = cache(async (): Promise<BrandProfile | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await getAdminClient();
  const { data } = await supabase
    .from("brand_profile")
    .select("name, tagline, description, logo_url, address, maps_url, social_links")
    .limit(1)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    name: data.name,
    tagline: data.tagline,
    description: data.description,
    logoUrl: data.logo_url,
    address: data.address,
    mapsUrl: data.maps_url,
    socialLinks: (data.social_links ?? {}) as Record<string, unknown>,
  };
});

export async function uploadImage(file: File, bucket: string, folder: string) {
  if (!file || file.size === 0) {
    return { url: null, error: "Pilih file gambar terlebih dahulu." };
  }

  if (!file.type.startsWith("image/")) {
    return { url: null, error: "File harus berupa gambar." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { url: null, error: "Ukuran gambar maksimal 5 MB." };
  }

  const supabase = await getAdminClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    return { url: null, error: `Upload gagal: ${error.message}` };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return { url: data.publicUrl, error: null };
}
