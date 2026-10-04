import { expect, test } from "@playwright/test";
import { testMarker } from "./support/test-data";

// Dua test di bawah ini benar-benar menulis ke database Supabase. Baris yang
// mereka buat dihapus lagi oleh `globalTeardown` setelah semua worker selesai.
const marker = testMarker();

test("keranjang kosong menampilkan ajakan untuk memilih menu", async ({ page }) => {
  await page.goto("/keranjang");

  await expect(page.getByRole("heading", { name: /keranjang/i }).first()).toBeVisible();
  await expect(page.getByText(/Keranjang masih kosong/i)).toBeVisible();
});

test("menambah menu dari halaman detail memperbarui badge keranjang", async ({ page }) => {
  await page.goto("/menu/kopi-susu-gatchu");

  await page.getByRole("button", { name: /Tambah Kopi Susu Gatchu ukuran R ke keranjang/i }).click();

  await expect(page.getByText(/1 di keranjang/i)).toBeVisible();

  const stored = await page.evaluate(() => window.localStorage.getItem("gatchu-cart"));
  expect(stored).toContain("kopi-susu-gatchu");
});

test("item di keranjang bisa ditambah, dikurangi, dan dihapus", async ({ page }) => {
  await page.goto("/menu/kopi-susu-gatchu");
  await page.getByRole("button", { name: /Tambah Kopi Susu Gatchu ukuran R ke keranjang/i }).click();

  await page.goto("/keranjang");

  await expect(page.getByText(/Kopi Susu Gatchu/).first()).toBeVisible();

  await page.getByRole("button", { name: /Tambah Kopi Susu Gatchu ukuran R/i }).click();
  await expect(page.getByText("Rp24.000").first()).toBeVisible();

  await page.getByRole("button", { name: /Kurangi Kopi Susu Gatchu ukuran R/i }).click();
  await expect(page.getByText("Rp12.000").first()).toBeVisible();

  await page.getByRole("button", { name: "Hapus" }).first().click();
  await expect(page.getByText(/Keranjang masih kosong/i)).toBeVisible();
});

test("keranjang menyimpan productId dan ukuran agar server bisa menghitung harga sendiri", async ({ page }) => {
  await page.goto("/menu/kopi-susu-gatchu");
  await page.getByRole("button", { name: /Tambah Kopi Susu Gatchu ukuran R ke keranjang/i }).click();

  const stored = await page.evaluate(() => window.localStorage.getItem("gatchu-cart"));
  const parsed = JSON.parse(stored ?? "{}") as { state?: { items?: Record<string, unknown>[] } };
  const first = parsed.state?.items?.[0];

  expect(first).toBeDefined();
  // Kalau uuid tidak ikut tersimpan, server tidak bisa mengecek harga dan pesanan ditolak.
  expect(typeof first?.productId).toBe("string");
  expect(first?.productId).toMatch(/^[0-9a-f-]{36}$/);
  expect(first?.size).toBe("regular");
});

test("form checkout menolak data tidak lengkap", async ({ page }) => {
  await page.goto("/menu/kopi-susu-gatchu");
  await page.getByRole("button", { name: /Tambah Kopi Susu Gatchu ukuran R ke keranjang/i }).click();
  await page.goto("/keranjang");

  await page.getByRole("button", { name: /Kirim pesanan/i }).click();

  await expect(page.getByText("Nama minimal 3 karakter")).toBeVisible();
  await expect(page.getByText("Nomor WhatsApp minimal 9 digit")).toBeVisible();
});

test("checkout delivery meminta alamat", async ({ page }) => {
  await page.goto("/menu/kopi-susu-gatchu");
  await page.getByRole("button", { name: /Tambah Kopi Susu Gatchu ukuran R ke keranjang/i }).click();
  await page.goto("/keranjang");

  await expect(page.getByText("Alamat pengiriman")).toHaveCount(0);

  await page.getByRole("button", { name: "Delivery" }).click();

  await expect(page.getByText("Alamat pengiriman")).toBeVisible();
});

test("form kontak menampilkan pesan error bila kontak kosong", async ({ page }) => {
  await page.goto("/kontak");

  await page.getByRole("button", { name: /Kirim pesan/i }).click();

  await expect(page.getByText("Nama minimal 3 karakter")).toBeVisible();
  await expect(page.getByText("Isi email atau nomor WhatsApp agar kami bisa membalas")).toBeVisible();
});

test("pesanan yang valid tersimpan, atau memberi jalan keluar lewat WhatsApp", async ({ page }) => {
  await page.goto("/menu/kopi-susu-gatchu");
  await page.getByRole("button", { name: /Tambah Kopi Susu Gatchu ukuran R ke keranjang/i }).click();
  await page.goto("/keranjang");

  const waLink = page.getByRole("link", { name: /Lewati form, order via WhatsApp/i });
  await expect(waLink).toHaveAttribute("href", /wa\.me/);

  await page.getByLabel("Nama").fill(marker.customerName);
  await page.getByLabel("Nomor WhatsApp").fill(marker.customerPhone);

  const apiResponse = page.waitForResponse((response) => response.url().includes("/api/orders"));
  await page.getByRole("button", { name: /Kirim pesanan/i }).click();
  const status = (await apiResponse).status();

  if (status === 201) {
    await expect(page).toHaveURL(/\/keranjang\/selesai/);
    await expect(page.getByRole("heading", { name: /Pesanan sudah/i })).toBeVisible();

    // Server mengembalikan total yang benar-benar tersimpan, dan halaman
    // konfirmasi harus memakainya, bukan total kiriman browser.
    const body = (await apiResponse).json() as Promise<{ total?: number }>;
    const { total } = await body;

    expect(typeof total).toBe("number");
    expect(total).toBeGreaterThan(0);
    return;
  }

  const alert = page.locator('form [role="alert"]');

  await expect(alert).toBeVisible();
  await expect(alert).toContainText(/WhatsApp|gagal disimpan/i);
  await expect(waLink).toBeVisible();
});

test("pesan kontak terkirim, atau memberi jalan keluar lewat WhatsApp", async ({ page }) => {
  await page.goto("/kontak");

  await page.getByLabel("Nama", { exact: true }).fill(marker.customerName);
  await page.getByLabel("WhatsApp", { exact: true }).fill(marker.customerPhone);
  await page.getByLabel("Pesan", { exact: true }).fill("Mau pesan untuk acara kecil besok sore.");

  const apiResponse = page.waitForResponse((response) => response.url().includes("/api/messages"));
  await page.getByRole("button", { name: /Kirim pesan/i }).click();
  const status = (await apiResponse).status();

  const notice = page.locator('form [role="status"]');

  await expect(notice).toBeVisible();

  if (status === 201) {
    await expect(notice).toContainText(/terima kasih|terkirim/i);
    return;
  }

  await expect(notice).toContainText(/WhatsApp|gagal|belum terhubung/i);
});
