import { describe, expect, it } from "vitest";
import {
  buildCartKey,
  cartTotals,
  type CartItem,
} from "@/lib/cart-store";
import { createOrderLink, formatPrice, menuGroups, slugifyMenuItem } from "@/lib/menu-data";
import { siteConfig } from "@/lib/site-config";

function item(overrides: Partial<CartItem> = {}): CartItem {
  return {
    key: buildCartKey("kopi-susu-gatchu", "R"),
    slug: "kopi-susu-gatchu",
    name: "Kopi Susu Gatchu",
    groupName: "Kopi Susu Gatchu",
    sizeLabel: "R",
    sizeNote: "Ukuran R",
    price: 12000,
    qty: 1,
    ...overrides,
  };
}

describe("buildCartKey", () => {
  it("menggabungkan slug dan ukuran supaya varian berbeda tidak tercampur", () => {
    expect(buildCartKey("matcha", "R")).toBe("matcha::R");
    expect(buildCartKey("matcha", "L")).not.toBe(buildCartKey("matcha", "R"));
  });
});

describe("cartTotals", () => {
  it("mengembalikan nol untuk keranjang kosong", () => {
    expect(cartTotals([])).toEqual({ count: 0, total: 0 });
  });

  it("menjumlahkan jumlah item dan subtotal", () => {
    const totals = cartTotals([
      item({ price: 12000, qty: 2 }),
      item({ key: buildCartKey("matcha", "L"), name: "Matcha", sizeLabel: "L", price: 20000, qty: 1 }),
    ]);

    expect(totals).toEqual({ count: 3, total: 44000 });
  });
});

describe("formatPrice", () => {
  it("memakai format rupiah tanpa desimal", () => {
    expect(formatPrice(12000)).toBe("Rp12.000");
    expect(formatPrice(0)).toBe("Rp0");
  });
});

describe("slugifyMenuItem", () => {
  it("mengubah nama menu menjadi slug URL yang aman", () => {
    expect(slugifyMenuItem("Kopi Susu Gatchu")).toBe("kopi-susu-gatchu");
    expect(slugifyMenuItem("Butterscotch Aren Latte")).toBe("butterscotch-aren-latte");
    expect(slugifyMenuItem("  Lychee   Tea  ")).toBe("lychee-tea");
  });

  it("tidak menghasilkan slug kosong untuk nama dengan simbol saja", () => {
    expect(slugifyMenuItem("!!!")).toBe("");
  });
});

describe("createOrderLink", () => {
  it("menyertakan ukuran pesan order ke WhatsApp", () => {
    const link = createOrderLink("Kopi Susu Gatchu", "L");

    expect(link.startsWith(siteConfig.whatsapp.link)).toBe(true);
    expect(decodeURIComponent(link)).toContain("Kopi Susu Gatchu ukuran L");
  });
});

describe("menuGroups (fallback lokal)", () => {
  it("semua item punya harga ukuran R", () => {
    for (const group of menuGroups) {
      for (const entry of group.items) {
        expect(entry.regular, `${group.id}/${entry.name}`).toBeTypeOf("number");
        expect(entry.regular).toBeGreaterThan(0);
      }
    }
  });

  it("harga L dan 1 Liter tidak lebih murah dari ukuran R", () => {
    for (const group of menuGroups) {
      for (const entry of group.items) {
        if (entry.large !== undefined) {
          expect(entry.large).toBeGreaterThanOrEqual(entry.regular ?? 0);
        }

        if (entry.liter !== undefined) {
          expect(entry.liter).toBeGreaterThanOrEqual(entry.regular ?? 0);
        }
      }
    }
  });

  it("slug tiap item unik", () => {
    const slugs = menuGroups.flatMap((group) => group.items.map((entry) => slugifyMenuItem(entry.name)));

    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
