import { describe, expect, it } from "vitest";
import { POST as postOrder } from "@/app/api/orders/route";
import { POST as postMessage } from "@/app/api/messages/route";

function jsonRequest(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validOrder = {
  customerName: "Budi Santoso",
  customerPhone: "081234567890",
  orderType: "pickup",
  items: [{ productId: "5668677a-8811-4cfb-88cc-6b930083de90", size: "regular", qty: 1 }],
};

describe("POST /api/orders", () => {
  it("menolak body yang bukan JSON dengan 400", async () => {
    const response = await postOrder(
      new Request("http://localhost/api/orders", { method: "POST", body: "bukan json" }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Payload tidak valid." });
  });

  it("menolak pesanan tidak lengkap dengan 400", async () => {
    const response = await postOrder(jsonRequest("http://localhost/api/orders", { customerName: "Bu" }));

    expect(response.status).toBe(400);
  });

  it("meminta konfirmasi WhatsApp dengan 503 saat Supabase belum dikonfigurasi", async () => {
    const response = await postOrder(jsonRequest("http://localhost/api/orders", validOrder));
    const payload = (await response.json()) as { code?: string; error?: string };

    expect(response.status).toBe(503);
    expect(payload.code).toBe("SUPABASE_NOT_CONFIGURED");
    expect(payload.error).toContain("WhatsApp");
  });
});

describe("POST /api/messages", () => {
  it("menolak body yang bukan JSON dengan 400", async () => {
    const response = await postMessage(
      new Request("http://localhost/api/messages", { method: "POST", body: "bukan json" }),
    );

    expect(response.status).toBe(400);
  });

  it("menolak pesan tanpa kontak dengan 400", async () => {
    const response = await postMessage(
      jsonRequest("http://localhost/api/messages", {
        name: "Siti Aminah",
        message: "Mau tanya menu untuk 4 orang.",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Isi email atau nomor WhatsApp agar kami bisa membalas",
    });
  });

  it("meminta hubungi WhatsApp dengan 503 saat Supabase belum dikonfigurasi", async () => {
    const response = await postMessage(
      jsonRequest("http://localhost/api/messages", {
        name: "Siti Aminah",
        phone: "081234567890",
        message: "Mau tanya menu untuk 4 orang besok.",
      }),
    );
    const payload = (await response.json()) as { code?: string };

    expect(response.status).toBe(503);
    expect(payload.code).toBe("SUPABASE_NOT_CONFIGURED");
  });
});
