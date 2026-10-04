import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Test E2E untuk checkout dan form kontak benar-benar menulis ke Supabase lewat
// RPC production. Tanpa pembersihan, tiap `npx playwright test` meninggalkan
// order dan pesan palsu di dashboard admin.
//
// Pembersihan dijalankan lewat `globalTeardown`, bukan `afterAll` di dalam spec.
// Alasannya: Playwright menjalankan test secara paralel di beberapa worker, dan
// `afterAll` di dalam spec hanya dijamin selesai setelah test milik SATU worker.
// Worker yang selesai lebih dulu akan menghapus data sebelum worker lain sempat
// menulis, sehingga baris yang baru dibuat bisa tertinggal. `globalTeardown`
// baru berjalan setelah semua worker selesai.
//
// Penanda data test disimpan di berkas supaya proses teardown bisa membacanya;
// modul di dalam worker tidak berbagi state dengan proses teardown.

const MARKER_DIR = "test-results";
const MARKER_FILE = join(MARKER_DIR, "e2e-test-marker.json");

export type TestMarker = { customerName: string; customerPhone: string };

let cached: TestMarker | null = null;

function createMarker(): TestMarker {
  return {
    // Nomor harus lolos validasi "minimal 9 digit" dan hanya berisi angka.
    customerPhone: `0899${Date.now().toString().slice(-7)}`,
    customerName: `E2E Bot ${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
  };
}

/**
 * Penanda unik untuk run test ini. Disimpan ke berkas supaya `globalTeardown`
 * di proses lain bisa menemukan baris yang sama.
 */
export function testMarker(): TestMarker {
  if (cached) return cached;

  if (existsSync(MARKER_FILE)) {
    cached = JSON.parse(readFileSync(MARKER_FILE, "utf8")) as TestMarker;
    return cached;
  }

  cached = createMarker();
  mkdirSync(MARKER_DIR, { recursive: true });
  writeFileSync(MARKER_FILE, JSON.stringify(cached), "utf8");

  return cached;
}

type SupabaseServiceEnv = { url: string; serviceKey: string };

function loadSupabaseServiceEnv(): SupabaseServiceEnv | null {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && existsSync(".env.local")) {
    try {
      process.loadEnvFile(".env.local");
    } catch {
      // Berkas ada tapi tidak terbaca. Lanjut supaya pesan error lain tidak tertutup.
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Tanpa service role key, RLS akan menolak hapus dari anon. Itu kondisi normal
  // di CI: Supabase tidak dikonfigurasi di sana sehingga test memakai jalur
  // fallback WhatsApp dan tidak pernah menulis apa pun ke database.
  if (!url || !serviceKey) return null;

  return { url, serviceKey };
}

/**
 * Hapus order, item order, dan pesan yang dibuat oleh test pada run ini saja.
 * Aman dipanggil berulang kali karena hanya menyentuh baris berpenanda.
 */
export async function purgeTestRows(): Promise<void> {
  try {
    if (!existsSync(MARKER_FILE)) return;
  } catch {
    return;
  }

  const marker = testMarker();

  try {
    rmSync(MARKER_FILE, { force: true });
  } catch {
    // Berkas teardown tetap dibersihkan oleh Playwright.
  }

  const env = loadSupabaseServiceEnv();

  if (!env) {
    console.warn(
      "[e2e] SUPABASE_SERVICE_ROLE_KEY tidak ada, data test tidak dibersihkan otomatis. " +
        `Hapus manual baris dengan customer_name="${marker.customerName}".`,
    );
    return;
  }

  const headers = {
    apikey: env.serviceKey,
    Authorization: `Bearer ${env.serviceKey}`,
    "Content-Type": "application/json",
  };

  const orderMarker =
    `customer_name=eq.${encodeURIComponent(marker.customerName)}` +
    `&customer_phone=eq.${encodeURIComponent(marker.customerPhone)}`;

  const orders = (await (
    await fetch(`${env.url}/rest/v1/orders?select=id&${orderMarker}`, { headers })
  ).json()) as { id: string }[];

  // order_items dihapus lebih dulu karena orders menjadi parent-nya.
  for (const order of orders) {
    await fetch(`${env.url}/rest/v1/order_items?order_id=eq.${order.id}`, {
      method: "DELETE",
      headers,
    });
    await fetch(`${env.url}/rest/v1/orders?id=eq.${order.id}`, { method: "DELETE", headers });
  }

  const messageMarker =
    `name=eq.${encodeURIComponent(marker.customerName)}` +
    `&phone=eq.${encodeURIComponent(marker.customerPhone)}`;
  const messages = (await (
    await fetch(`${env.url}/rest/v1/messages?select=id&${messageMarker}`, { headers })
  ).json()) as { id: string }[];

  for (const message of messages) {
    await fetch(`${env.url}/rest/v1/messages?id=eq.${message.id}`, {
      method: "DELETE",
      headers,
    });
  }

  console.log(
    `[e2e] Pembersihan data test: ${orders.length} order, ${messages.length} pesan dihapus` +
      (orders.length + messages.length === 0 ? " (tidak ada yang perlu dihapus)" : ""),
  );
}
