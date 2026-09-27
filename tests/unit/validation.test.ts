import { describe, expect, it } from "vitest";
import { firstIssueMessage, orderPayloadSchema } from "@/lib/validation/orders";
import { messagePayloadSchema } from "@/lib/validation/messages";

function issueOf(result: ReturnType<typeof orderPayloadSchema.safeParse>) {
  if (result.success) {
    throw new Error("validasi seharusnya gagal");
  }

  return firstIssueMessage(result.error);
}

const validOrder = {
  customerName: "Budi Santoso",
  customerPhone: "081234567890",
  orderType: "pickup" as const,
  total: 27000,
  items: [{ productName: "Kopi Susu Gatchu", sizeLabel: "R", price: 15000, qty: 1 }],
};

describe("orderPayloadSchema", () => {
  it("menerima pesanan yang valid", () => {
    const result = orderPayloadSchema.safeParse(validOrder);

    expect(result.success).toBe(true);
  });

  it("menolak nama terlalu pendek", () => {
    const result = orderPayloadSchema.safeParse({ ...validOrder, customerName: "Bu" });

    expect(result.success).toBe(false);
    expect(issueOf(result)).toBe("Nama minimal 3 karakter");
  });

  it("menolak nomor WhatsApp berhuruf", () => {
    const result = orderPayloadSchema.safeParse({ ...validOrder, customerPhone: "0812abc" });

    expect(result.success).toBe(false);
  });

  it("menolak tipe pesanan di luar pickup/delivery", () => {
    const result = orderPayloadSchema.safeParse({ ...validOrder, orderType: "dinein" });

    expect(result.success).toBe(false);
  });

  it("menolak keranjang kosong", () => {
    const result = orderPayloadSchema.safeParse({ ...validOrder, items: [] });

    expect(result.success).toBe(false);
    expect(issueOf(result)).toBe("Keranjang masih kosong");
  });

  it("menolak total nol atau negatif", () => {
    expect(orderPayloadSchema.safeParse({ ...validOrder, total: 0 }).success).toBe(false);
    expect(orderPayloadSchema.safeParse({ ...validOrder, total: -5 }).success).toBe(false);
  });

  it("menolak qty pecahan dan qty di luar batas", () => {
    const withQty = (qty: number) => ({
      ...validOrder,
      items: [{ ...validOrder.items[0], qty }],
    });

    expect(orderPayloadSchema.safeParse(withQty(1.5)).success).toBe(false);
    expect(orderPayloadSchema.safeParse(withQty(0)).success).toBe(false);
    expect(orderPayloadSchema.safeParse(withQty(51)).success).toBe(false);
  });

  it("membuang spasi berlebih di nama dan nomor", () => {
    const result = orderPayloadSchema.parse({ ...validOrder, customerName: "  Budi  " });

    expect(result.customerName).toBe("Budi");
  });
});

describe("messagePayloadSchema", () => {
  it("menerima pesan kontak yang valid", () => {
    const result = messagePayloadSchema.safeParse({
      name: "Siti Aminah",
      email: "siti@email.com",
      message: "Mau tanya menu untuk 4 orang besok.",
    });

    expect(result.success).toBe(true);
  });

  it("menerima pesan hanya dengan nomor WhatsApp", () => {
    const result = messagePayloadSchema.safeParse({
      name: "Siti Aminah",
      phone: "081234567890",
      message: "Mau tanya menu untuk 4 orang besok.",
    });

    expect(result.success).toBe(true);
  });

  it("menolak pesan tanpa email maupun nomor", () => {
    const result = messagePayloadSchema.safeParse({
      name: "Siti Aminah",
      message: "Mau tanya menu untuk 4 orang besok.",
    });

    expect(result.success).toBe(false);
  });

  it("menolak pesan terlalu pendek", () => {
    const result = messagePayloadSchema.safeParse({
      name: "Siti Aminah",
      phone: "081234567890",
      message: "halo",
    });

    expect(result.success).toBe(false);
  });

  it("default tipe pesan menjadi contact", () => {
    const result = messagePayloadSchema.parse({
      name: "Siti Aminah",
      phone: "081234567890",
      message: "Mau tanya menu untuk 4 orang besok.",
    });

    expect(result.type).toBe("contact");
  });
});
