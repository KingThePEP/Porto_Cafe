"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cartTotals, useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

export function CartBadge({ className }: { className?: string }) {
  const items = useCartStore((state) => state.items);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(cartTotals(items).count);
  }, [items]);

  return (
    <Link
      href="/keranjang"
      aria-label={`Keranjang, ${count} item`}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full border border-[#d8c9b8] bg-white/70 text-[#241c18] transition-colors hover:border-[#a24931] hover:text-[#a24931]",
        className,
      )}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a24931] px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
