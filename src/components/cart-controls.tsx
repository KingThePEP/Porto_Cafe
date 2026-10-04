"use client";

import { Check, Minus, Plus } from "lucide-react";
import { buildCartKey, useCartStore, type CartItem } from "@/lib/cart-store";
import type { OrderSize } from "@/lib/validation/orders";
import { formatPrice } from "@/lib/menu-data";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  productId: string | null;
  slug: string;
  name: string;
  groupName: string;
  size: OrderSize;
  sizeLabel: string;
  sizeNote: string;
  price: number;
  className?: string;
  label?: string;
};

export function AddToCartButton({
  productId,
  slug,
  name,
  groupName,
  size,
  sizeLabel,
  sizeNote,
  price,
  className,
  label = "Tambah",
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const key = buildCartKey(slug, sizeLabel);
  const inCart = items.find((item) => item.key === key);

  return (
    <button
      type="button"
      onClick={() => addItem({ productId, slug, name, groupName, size, sizeLabel, sizeNote, price })}
      aria-label={`Tambah ${name} ukuran ${sizeLabel} ke keranjang`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-[#241c18] bg-[#241c18] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a24931] hover:border-[#a24931]",
        className,
      )}
    >
      {inCart ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
      {inCart ? `${inCart.qty} di keranjang` : label}
    </button>
  );
}

type CartLineProps = {
  item: CartItem;
};

export function CartLineControls({ item }: CartLineProps) {
  const setQty = useCartStore((state) => state.setQty);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setQty(item.key, item.qty - 1)}
          aria-label={`Kurangi ${item.name} ukuran ${item.sizeLabel}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8c9b8] bg-white text-[#4d3d33] transition-colors hover:border-[#a24931] hover:text-[#a24931]"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-[#30251f]">{item.qty}</span>
        <button
          type="button"
          onClick={() => setQty(item.key, item.qty + 1)}
          aria-label={`Tambah ${item.name} ukuran ${item.sizeLabel}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8c9b8] bg-white text-[#4d3d33] transition-colors hover:border-[#a24931] hover:text-[#a24931]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="text-sm font-semibold text-[#a24931]">{formatPrice(item.price * item.qty)}</p>
      <button
        type="button"
        onClick={() => removeItem(item.key)}
        className="text-xs font-semibold text-[#7d5c4d] transition-colors hover:text-[#a24931]"
      >
        Hapus
      </button>
    </div>
  );
}
