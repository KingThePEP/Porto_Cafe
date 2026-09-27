import { beforeEach, describe, expect, it, vi } from "vitest";
import { orderPayloadSchema } from "@/lib/validation/orders";

const inserts: { table: string; payload: unknown }[] = [];
const selectChains: string[] = [];
let insertShouldFail = false;

vi.mock("@/lib/supabase/server", () => ({
  isSupabaseConfigured: () => true,
  createClient: () => ({
    from(table: string) {
      return {
        insert(payload: unknown) {
          if (insertShouldFail) {
            return Promise.resolve({ error: { message: "insert gagal" } });
          }

          inserts.push({ table, payload });

          return Promise.resolve({ error: null });
        },
        select(columns: string) {
          selectChains.push(`${table}.select(${columns})`);

          return { single: () => Promise.resolve({ data: null, error: { message: "dilarang" } }) };
        },
        delete() {
          return { eq: () => Promise.resolve({ error: null }) };
        },
      };
    },
  }),
}));

vi.mock("@/lib/notify", () => ({
  notifyOrder: () => Promise.resolve({ skipped: true }),
}));

const validOrder = {
  customerName: "Budi Santoso",
  customerPhone: "081234567890",
  orderType: "pickup",
  total: 30000,
  items: [
    { productName: "Kopi Susu Gatchu", sizeLabel: "R", price: 15000, qty: 2 },
    { productName: "Matcha", sizeLabel: "L", price: 30000, qty: 1 },
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
  inserts.length = 0;
  selectChains.length = 0;
  insertShouldFail = false;
});

describe("POST /api/orders (dengan database)", () => {
  it("menyimpan pesanan tanpa memakai INSERT ... RETURNING", async () => {
    const { POST } = await import("@/app/api/orders/route");
    const response = await POST(request(validOrder));
    const payload = (await response.json()) as { orderId: string };

    expect(response.status).toBe(201);
    expect(selectChains).toEqual([]);
    expect(inserts.map((entry) => entry.table)).toEqual(["orders", "order_items"]);
  });

  it("mengirim id pesanan yang dibuat server, bukan hasil pembacaan ulang", async () => {
    const { POST } = await import("@/app/api/orders/route");
    const response = await POST(request(validOrder));
    const { orderId } = (await response.json()) as { orderId: string };
    const orderRow = inserts[0].payload as { id: string; status: string; customer_name: string };
    const itemRows = inserts[1].payload as { order_id: string; subtotal: number }[];

    expect(orderPayloadSchema.safeParse(validOrder).success).toBe(true);
    expect(orderRow.id).toBe(orderId);
    expect(orderRow.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(orderRow.status).toBe("pending");
    expect(orderRow.customer_name).toBe("Budi Santoso");
    expect(itemRows).toHaveLength(2);
    expect(itemRows.every((row) => row.order_id === orderId)).toBe(true);
    expect(itemRows.map((row) => row.subtotal)).toEqual([30000, 30000]);
  });

  it("balik 500 tanpa orderId bila insert pesanan gagal", async () => {
    const { POST } = await import("@/app/api/orders/route");
    insertShouldFail = true;

    const response = await POST(request(validOrder));
    const payload = (await response.json()) as { orderId?: string };

    expect(response.status).toBe(500);
    expect(payload.orderId).toBeUndefined();
  });
});
