import { expect, test } from "@playwright/test";

const adminRoutes = ["/admin", "/admin/pesanan", "/admin/menu", "/admin/artikel", "/admin/pesan", "/admin/galeri", "/admin/profil"];

test.describe("proteksi dashboard admin", () => {
  test("halaman login terbuka untuk tamu", async ({ page }) => {
    const response = await page.goto("/admin/login");

    expect(response?.status()).toBe(200);
    await expect(page.getByLabel("Email admin")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  for (const route of adminRoutes) {
    test(`${route} tidak bisa diakses tanpa sesi admin`, async ({ page }) => {
      await page.goto(route);

      await expect(page).toHaveURL(/\/admin\/login/);
      await expect(page.getByLabel("Email admin")).toBeVisible();
    });
  }

  test("form login menolak email tidak valid", async ({ page }) => {
    await page.goto("/admin/login");

    await page.getByLabel("Email admin").fill("bukan-email");
    await page.getByLabel("Password").fill("rahasia123");
    await page.getByRole("button", { name: /Masuk dashboard/i }).click();

    await expect(page.locator('form [role="alert"]')).toContainText(/Email tidak valid/i);
  });

  test("form login menampilkan instruksi setup untuk akun non-admin", async ({ page }) => {
    await page.goto("/admin/login");

    await expect(page.getByText(/app_metadata/i)).toBeVisible();
  });

  test("halaman admin tidak diindeks mesin pencari", async ({ page }) => {
    await page.goto("/admin/login");

    const robots = await page.locator('meta[name="robots"]').getAttribute("content");

    expect(robots).toContain("noindex");
  });
});
