import { expect, test } from "@playwright/test";

const publicRoutes = [
  { path: "/", heading: /kopi/i },
  { path: "/menu", heading: /menu/i },
  { path: "/about", heading: /kedai kopi lokal|sawahan timur/i },
  { path: "/blog", heading: /cangkir kopi|journal/i },
  { path: "/galeri", heading: /suasana/i },
  { path: "/kontak", heading: /reservasi|kontak/i },
];

test.describe("halaman publik", () => {
  for (const route of publicRoutes) {
    test(`${route.path} terbuka tanpa error`, async ({ page }) => {
      const response = await page.goto(route.path);

      expect(response?.status()).toBe(200);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  test("halaman menu menampilkan daftar produk", async ({ page }) => {
    await page.goto("/menu");

    await expect(page.getByText("Kopi Susu Gatchu", { exact: true }).first()).toBeVisible();
  });

  test("halaman detail menu bisa dibuka dari daftar", async ({ page }) => {
    await page.goto("/menu/kopi-susu-gatchu");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Kopi Susu Gatchu");
  });

  test("halaman utama punya tautan navigasi lengkap", async ({ page }) => {
    await page.goto("/");

    for (const href of ["/menu", "/blog", "/galeri", "/kontak", "/about"]) {
      await expect(page.locator(`header a[href="${href}"]`).first()).toBeVisible();
    }
  });

  test("sitemap dan robots dapat diakses", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    const robots = await request.get("/robots.txt");

    expect(sitemap.status()).toBe(200);
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Disallow: /admin");
  });
});

test.describe("halaman tidak ditemukan", () => {
  test("slug artikel yang tidak ada menampilkan 404", async ({ page }) => {
    const response = await page.goto("/blog/artikel-yang-tidak-ada");

    expect(response?.status()).toBe(404);
  });
});
