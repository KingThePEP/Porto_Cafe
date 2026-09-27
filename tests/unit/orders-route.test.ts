import { beforeEach, describe, expect, it, vi } from "vitest";
import { orderPayloadSchema } from "@/lib/validation/orders";

const rpcCalls: { fn: string; args: Record<string, unknown> }[] = [];
let rpcResult: { data: unknown; error: { message: string } | null } = {
  data: {
    order: { id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee", total: 50000 },
    items: [
      { productName: "Cappuccino", sizeLabel: "L", price: 20000, qty: 2, subtotal: 40000 },
      { productName: "Americano", sizeLabel: "R", price: 10000, qty: 1, subtotal: 10000 },
    ],
  },
  error: null,
};

vi.mock("@/lib/supabase/server", () => ({
  isSupabaseConfigured: () => true,
  createClient: () => ({
    from() {
      throw new Error("route tidak boleh memakai .from() untuk membuat pesanan");
    },
    rpc(fn: string, args: Record<string, unknown>) {
      rpcCalls.push({ fn, args });
      return Promise.resolve(rpcResult);
    },
  }),
}));

vi.mock("@/lib/notify", () => ({
  notifyOrder: () => Promise.resolve({ skipped: true }),
}));

const productId = "5668677a-8811-4cfb-88cc-6b930083de90";

const validOrder = {
  customerName: "Budi Santoso",
  customerPhone: "081234567890",
  orderType: "pickup",
  items: [
    { productId, size: "large", qty: 2 },
    { productId, size: "regular", qty: 1 },
  ],
};

function request(body: unknown) {
  return new Request("http://localhost/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  rpcCalls.length = 0;
  rpcResult = {
    data: {
      order: { id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee", total: 50000 },
      items: [
        { productName: "Cappuccino", sizeLabel: "L", price: 20000, qty: 2, subtotal: 40000 },
        { productName: "Americano", sizeLabel: "R", price: 10000, qty: 1, subtotal: 10000 },
      ],
    },
    error: null,
  };
});

describe("POST /api/orders (dengan database)", () => {
  it("membuat pesanan lewat RPC create_order, bukan insert langsung", async () => {
    const { POST } = await import("@/app/api/orders/route");
    const response = await POST(request(validOrder));

    expect(response.status).toBe(201);
    expect(rpcCalls).toHaveLength(1);
    expect(rpcCalls[0].fn).toBe("create_order");
  });

  it("tidak pernah mengirim harga atau total dari client", async () => {
    const { POST } = await import("@/app/api/orders/route");
    await POST(request(validOrder));

    const args = rpcCalls[0].args;
    const serialized = JSON.stringify(args.p_items);

    expect(serialized).not.toContain("price");
    expect(serialized).not.toContain("total");
    expect(args).not.toHaveProperty("p_total");
    expect(args).not.toHaveProperty("p_status");
    expect(args.p_customer_name).toBe("Budi Santoso");
  });

  it("mengabaikan harga palsu yang dicampurkan client", async () => {
    const { POST } = await import("@/app/api/orders/route");
    await POST(
      request({
        ...validOrder,
        total: 1,
        status: "done",
        items: [{ productId, size: "regular", qty: 1, price: 1, subtotal: 1, productName: "Palsu" }],
      }),
    );

    const sent = rpcCalls[0].args.p_items as Record<string, unknown>[];

    expect(sent[0]).toEqual({ productId, size: "regular", qty: 1 });
  });

  it("mengembalikan total dari server, bukan total kiriman client", async () => {
    const { POST } = await import("@/app/api/orders/route");
    const response = await POST(request({ ...validOrder, total: 1 }));
    const payload = (await response.json()) as { orderId: string; total: number };

    expect(payload.total).toBe(50000);
    expect(payload.orderId).toBe("aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee");
  });

  it("balik 400 dengan pesan Postgres yang aman saat menu tidak ada", async () => {
    const { POST } = await import("@/app/api/orders/route");
    rpcResult = { data: null, error: { message: "Menu tidak ditemukan" } };

    const response = await POST(request(validOrder));
    const payload = (await response.json()) as { error: string; orderId?: string };

    expect(response.status).toBe(400);
    expect(payload.error).toBe("Menu tidak ditemukan");
    expect(payload.orderId).toBeUndefined();
  });

  it("menyembunyikan pesan error internal database dari client", async () => {
    const { POST } = await import("@/app/api/orders/route");
    rpcResult = { data: null, error: { message: 'relation "orders" does not exist' } };

    const response = await POST(request(validOrder));
    const payload = (await response.json()) as { error: string };

    expect(response.status).toBe(500);
    expect(payload.error).toBe("Pesanan gagal disimpan. Coba lagi sebentar.");
    expect(payload.error).not.toContain("relation");
  });

  it("tidak mengirim produk tanpa uuid ke server", async () => {
    const { POST } = await import("@/app/api/orders/route");
    const response = await POST(request({ ...validOrder, items: [{ productId: null, size: "regular", qty: 1 }] }));
    const payload = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(payload.error).toBe("Menu tidak valid");
    expect(rpcCalls).toHaveLength(0);
    expect(orderPayloadSchema.safeParse(validOrder).success).toBe(true);
  });
});
