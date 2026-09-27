import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isNotifyConfigured, notifyMessage, notifyOrder } from "@/lib/notify";

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.supabase.co";
  process.env.NOTIFY_SECRET = "secret-token";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  process.env = { ...originalEnv };
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("isNotifyConfigured", () => {
  it("butuh URL Supabase dan NOTIFY_SECRET", () => {
    expect(isNotifyConfigured()).toBe(true);

    delete process.env.NOTIFY_SECRET;
    expect(isNotifyConfigured()).toBe(false);
  });
});

describe("notifyOrder", () => {
  const payload = {
    kind: "order" as const,
    orderId: "11111111-1111-4111-8111-111111111111",
    customerName: "Budi Santoso",
    customerPhone: "081234567890",
    orderType: "pickup",
    total: 27000,
    items: [{ productName: "Kopi Susu Gatchu", sizeLabel: "R", price: 15000, qty: 2 }],
  };

  it("mengirim ke Edge Function dengan header rahasia", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ delivered: true, id: "mail_1" }), { status: 200 }),
    );

    const result = await notifyOrder(payload);
    const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];

    expect(url).toBe("https://project.supabase.co/functions/v1/notify-admin");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["x-notify-secret"]).toBe("secret-token");
    expect(JSON.parse(String(init.body))).toMatchObject({ kind: "order", total: 27000 });
    expect(result).toEqual({ delivered: true, id: "mail_1" });
  });

  it("melewati panggilan bila NOTIFY_SECRET belum diatur", async () => {
    delete process.env.NOTIFY_SECRET;

    const result = await notifyOrder(payload);

    expect(result).toEqual({ skipped: true });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("tidak melempar saat Edge Function gagal", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network down"));

    await expect(notifyOrder(payload)).resolves.toEqual({ error: "network down" });
  });

  it("melaporkan status error dari Edge Function", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("Unauthorized", { status: 401 }));

    const result = await notifyOrder(payload);

    expect(result).toEqual({ error: "Edge Function merespons 401" });
  });
});

describe("notifyMessage", () => {
  it("meneruskan isi pesan ke Edge Function", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ skipped: true }), { status: 200 }),
    );

    const result = await notifyMessage({
      kind: "message",
      name: "Siti Aminah",
      message: "Mau pesan untuk 4 orang.",
      type: "contact",
      phone: "081234567890",
    });
    const [, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];

    expect(JSON.parse(String(init.body))).toMatchObject({ kind: "message", name: "Siti Aminah" });
    expect(result).toEqual({ skipped: true });
  });
});
