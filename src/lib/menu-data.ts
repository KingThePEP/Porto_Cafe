import { siteConfig } from "@/lib/site-config";

export type MenuItem = {
  name: string;
  regular?: number;
  large?: number;
  liter?: number;
  note?: string;
};

export type MenuGroup = {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
};

export const sizeLabels = {
  regular: "R",
  large: "L",
  liter: "1 Liter",
} as const;

export const menuGroups: MenuGroup[] = [
  {
    id: "kopi-susu-gatchu",
    name: "Kopi Susu Gatchu",
    description: "Menu susu andalan Gatchu. Tersedia juga dalam kemasan 1 liter.",    items: [
      { name: "Kopi Susu Gatchu", regular: 12000, large: 15000, liter: 60000 },
      { name: "Kopi Susu Gatchu Strong", regular: 15000, large: 18000 },
    ],
  },
  {
    id: "premium-coffee",
    name: "Premium Coffee",
    description: "Pilihan kopi premium dengan ukuran reguler dan large.",
    items: [
      { name: "Americano", regular: 10000, large: 15000 },
      { name: "Cappuccino", regular: 15000, large: 20000 },
      { name: "Latte", regular: 15000, large: 20000 },
      { name: "Mochaccino", regular: 15000, large: 20000 },
      { name: "Butterscotch Aren Latte", regular: 15000, note: "Tersedia ukuran R" },
      { name: "Chocolate", regular: 15000, large: 20000 },
      { name: "Matcha", regular: 15000, large: 20000 },
      { name: "Thai Tea", regular: 12000, large: 15000 },
      { name: "Lychee Tea", regular: 12000, large: 15000 },
    ],
  },
];

export function slugifyMenuItem(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatPrice(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

export function createOrderLink(itemName: string, sizeLabel?: string) {
  const target = sizeLabel ? `${itemName} ukuran ${sizeLabel}` : itemName;
  const message = `Halo ${siteConfig.name}, saya mau order ${target}.`;
  return `${siteConfig.whatsapp.link}?text=${encodeURIComponent(message)}`;
}
