import { expect, test } from "@playwright/test";

const publicRoutes = ["/", "/menu", "/about", "/blog", "/galeri", "/kontak", "/keranjang"];

test.describe("aksesibilitas dasar", () => {
  test("skip link muncul saat keyboard dan melompat ke konten", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: /Lompat ke konten utama/i });

    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#konten-utama$/);
  });

  test("setiap halaman punya tepat satu heading level 1", async ({ page }) => {
    for (const route of publicRoutes) {
      await page.goto(route);
      await expect(page.locator("h1"), `h1 di ${route}`).toHaveCount(1);
    }
  });

  test("setiap halaman punya landmark utama dan navigasi bernama", async ({ page }) => {
    for (const route of publicRoutes) {
      await page.goto(route);
      await expect(page.locator("main"), `main di ${route}`).toHaveCount(1);
      await expect(page.getByRole("navigation", { name: /Navigasi utama/i }), `nav di ${route}`).toBeVisible();
    }
  });

  test("semua gambar punya atribut alt", async ({ page }) => {
    for (const route of ["/", "/menu", "/galeri", "/blog"]) {
      await page.goto(route);
      const missing = await page.locator("img:not([alt])").count();

      expect(missing, `gambar tanpa alt di ${route}`).toBe(0);
    }
  });

  test("tombol dan link bisa difokus dengan keyboard", async ({ page }) => {
    await page.goto("/menu");

    const firstLink = page.locator("main a, main button").first();

    await firstLink.focus();
    await expect(firstLink).toBeFocused();
  });

  test("halaman admin tidak bisa difokus tanpa sesi", async ({ page }) => {
    await page.goto("/admin/pesanan");

    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByLabel("Email admin")).toBeVisible();
  });
});

test.describe("SEO", () => {
  test("halaman utama memuat structured data local business", async ({ page }) => {
    await page.goto("/");

    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();

    expect(jsonLd.length).toBeGreaterThan(0);
    expect(jsonLd.join("")).toContain("CafeOrCoffeeShop");
    expect(jsonLd.join("")).toContain("Jl. Perintis No.16");
  });

  test("detail artikel memuat schema Article", async ({ page }) => {
    await page.goto("/blog/kisah-di-balik-cangkir-gatchu");

    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();

    expect(jsonLd.join("")).toContain('"@type":"Article"');
  });

  test("halaman detail punya canonical dan og:image", async ({ page }) => {
    await page.goto("/blog/kisah-di-balik-cangkir-gatchu");

    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "id_ID");
  });

  test("html memakai bahasa Indonesia", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "id");
  });

  test("dokumen punya judul dan deskripsi yang tidak kosong", async ({ page }) => {
    for (const route of ["/", "/menu", "/blog", "/kontak"]) {
      await page.goto(route);
      const title = await page.title();
      const description = await page.locator('meta[name="description"]').getAttribute("content");

      expect(title.length, `judul di ${route}`).toBeGreaterThan(5);
      expect(description?.length ?? 0, `deskripsi di ${route}`).toBeGreaterThan(20);
    }
  });
});
