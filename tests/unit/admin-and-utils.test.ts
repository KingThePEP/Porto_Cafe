import { describe, expect, it } from "vitest";
import {
  isAdminMetadata,
  isAdminUser,
  isProtectedAdminPath,
  isPublicAdminPath,
} from "@/lib/supabase/auth-utils";
import { isOrderStatus, ORDER_STATUSES, orderStatusMeta } from "@/lib/admin/order-status";
import { safeNextPath, signInSchema, postSchema, productSchema } from "@/lib/admin/schemas";
import { cn, formatDate, formatDateTime } from "@/lib/utils";

describe("isAdminMetadata", () => {
  it("hanya menerima peran admin", () => {
    expect(isAdminMetadata({ role: "admin" })).toBe(true);
    expect(isAdminMetadata({ role: "user" })).toBe(false);
    expect(isAdminMetadata({})).toBe(false);
    expect(isAdminMetadata(null)).toBe(false);
    expect(isAdminMetadata(undefined)).toBe(false);
    expect(isAdminMetadata("admin" as unknown as Record<string, unknown>)).toBe(false);
  });
});

describe("isAdminUser", () => {
  it("menolak user null dan user tanpa app_metadata", () => {
    expect(isAdminUser(null)).toBe(false);
    expect(isAdminUser({ app_metadata: undefined })).toBe(false);
    expect(isAdminUser({ app_metadata: { role: "admin" } })).toBe(true);
  });
});

describe("route admin", () => {
  it("mengenali path yang harus dilindungi", () => {
    expect(isProtectedAdminPath("/admin")).toBe(true);
    expect(isProtectedAdminPath("/admin/pesanan")).toBe(true);
    expect(isProtectedAdminPath("/menu")).toBe(false);
    expect(isProtectedAdminPath("/administrator")).toBe(false);
  });

  it("login adalah path publik", () => {
    expect(isPublicAdminPath("/admin/login")).toBe(true);
    expect(isPublicAdminPath("/admin/pesanan")).toBe(false);
  });
});

describe("safeNextPath", () => {
  it("membolehkan path internal admin", () => {
    expect(safeNextPath("/admin/pesanan")).toBe("/admin/pesanan");
  });

  it("memblokir redirect ke luar situs", () => {
    expect(safeNextPath("https://evil.example")).toBe("/admin");
    expect(safeNextPath("//evil.example")).toBe("/admin");
    expect(safeNextPath("/menu")).toBe("/admin");
    expect(safeNextPath(undefined)).toBe("/admin");
  });
});

describe("signInSchema", () => {
  it("menolak email tidak valid dan password pendek", () => {
    expect(signInSchema.safeParse({ email: "bukan-email", password: "rahasia123" }).success).toBe(false);
    expect(signInSchema.safeParse({ email: "admin@gatchu.co", password: "123" }).success).toBe(false);
    expect(signInSchema.safeParse({ email: "admin@gatchu.co", password: "rahasia123" }).success).toBe(true);
  });
});

describe("isOrderStatus", () => {
  it("mengenali keempat status pesanan", () => {
    for (const status of ORDER_STATUSES) {
      expect(isOrderStatus(status)).toBe(true);
      expect(orderStatusMeta[status].label).toBeTruthy();
    }

    expect(isOrderStatus("unknown")).toBe(false);
    expect(isOrderStatus("")).toBe(false);
  });
});

describe("postSchema", () => {
  it("menolak slug dengan huruf besar dan artikel terlalu pendek", () => {
    const base = {
      title: "Tips memilih biji kopi",
      slug: "tips-memilih-biji-kopi",
      content: "Isi artikel yang cukup panjang untuk lolos validasi minimal karakter.",
      tags: ["kopi"],
      published: true,
    };

    expect(postSchema.safeParse({ ...base, slug: "Tips-Memilih" }).success).toBe(false);
    expect(postSchema.safeParse({ ...base, content: "pendek" }).success).toBe(false);
    expect(postSchema.safeParse(base).success).toBe(true);
  });
});

describe("productSchema", () => {
  const base = {
    categoryId: "1b6f5c1e-4b2a-4f1e-9d3a-0f2c1b6e5a70",
    name: "Kopi Susu Gatchu",
    slug: "kopi-susu-gatchu",
    description: "Susu kopi andalan Gatchu.",
    note: "",
    price: 12000,
    priceLarge: 15000,
    priceLiter: null,
    imageUrl: "",
    isAvailable: true,
    isSignature: true,
  };

  it("menerima produk dengan harga varian opsional", () => {
    const result = productSchema.parse(base);

    expect(result.priceLarge).toBe(15000);
    expect(result.priceLiter).toBeNull();
  });

  it("mengubah string kosong dan NaN menjadi null untuk harga varian", () => {
    const result = productSchema.parse({ ...base, priceLarge: null, priceLiter: Number.NaN });

    expect(result.priceLarge).toBeNull();
    expect(result.priceLiter).toBeNull();
  });

  it("menolak harga negatif dan kategori yang bukan uuid", () => {
    expect(productSchema.safeParse({ ...base, price: -1 }).success).toBe(false);
    expect(productSchema.safeParse({ ...base, categoryId: "bukan-uuid" }).success).toBe(false);
  });
});

describe("formatDateTime", () => {
  it("memakai zona waktu Asia/Jakarta dan format id-ID", () => {
    const value = formatDateTime("2026-03-15T10:30:00.000Z");

    expect(value).toContain("2026");
    expect(formatDate("2026-03-15T10:30:00.000Z")).toContain("Mar");
  });

  it("mengembalikan tanda hubung untuk tanggal tidak valid", () => {
    expect(formatDateTime("bukan-tanggal")).toBe("-");
    expect(formatDate(new Date("bukan-tanggal"))).toBe("-");
  });
});

describe("cn", () => {
  it("menggabungkan dan menyelesaikan konflik kelas Tailwind", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe("text-sm font-bold");
  });
});
