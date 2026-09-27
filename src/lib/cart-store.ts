import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderSize } from "@/lib/validation/orders";

export type CartItem = {
  key: string;
  // uuid produk di Supabase; null kalau menu berasal dari data fallback lokal.
  productId: string | null;
  slug: string;
  name: string;
  groupName: string;
  size: OrderSize;
  sizeLabel: string;
  sizeNote: string;
  // Hanya untuk tampilan. Saat checkout, harga ini diabaikan dan dihitung ulang
  // oleh server dari tabel products.
  price: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const MAX_QTY = 20;

export function buildCartKey(slug: string, sizeLabel: string) {
  return `${slug}::${sizeLabel}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, qty = 1) =>
        set((state) => {
          const key = buildCartKey(item.slug, item.sizeLabel);
          const existing = state.items.find((entry) => entry.key === key);

          if (existing) {
            return {
              items: state.items.map((entry) =>
                entry.key === key
                  ? { ...entry, qty: Math.min(MAX_QTY, entry.qty + qty) }
                  : entry,
              ),
            };
          }

          return {
            items: [...state.items, { ...item, key, qty: Math.min(MAX_QTY, qty) }],
          };
        }),
      setQty: (key, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((entry) => entry.key !== key)
              : state.items.map((entry) =>
                  entry.key === key ? { ...entry, qty: Math.min(MAX_QTY, qty) } : entry,
                ),
        })),
      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((entry) => entry.key !== key) })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "gatchu-cart",
      // v2: item keranjang menyimpan productId + size. Keranjang versi lama
      // tidak punya kedua field itu, jadi Zustand membuangnya daripada
      // mengirim pesanan tanpa identitas produk.
      version: 2,
    },
  ),
);

export function cartTotals(items: CartItem[]) {
  return items.reduce(
    (totals, item) => ({
      count: totals.count + item.qty,
      total: totals.total + item.price * item.qty,
    }),
    { count: 0, total: 0 },
  );
}
