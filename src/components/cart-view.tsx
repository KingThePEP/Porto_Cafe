"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShoppingBag, Trash2 } from "lucide-react";
import { CartLineControls } from "@/components/cart-controls";
import { CheckoutForm } from "@/components/checkout-form";
import { cartTotals, useCartStore, type CartItem } from "@/lib/cart-store";
import { formatPrice } from "@/lib/menu-data";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const { count, total } = cartTotals(items);

  if (!hydrated) {
    return <p className="mt-10 text-sm text-[#806e61]">Memuat keranjang...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-[2rem] border border-[#e2d5c7] bg-[#fffaf4] p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2e6da] text-[#c9674b]">
          <ShoppingBag className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-semibold tracking-[-0.04em] text-[#30251f]">Keranjang masih kosong</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#806e61]">
          Pilih menu dan ukuran favoritmu dulu, lalu lanjutkan ke form pemesanan.
        </p>
        <Link
          href="/menu"
          className={cn(
            "mt-6 inline-flex items-center rounded-full bg-[#241c18] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c9674b]",
          )}
        >
          Lihat menu
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-[-0.04em] text-[#30251f]">
            Pesananmu ({count} item)
          </h2>
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a27b68] transition-colors hover:text-[#c9674b]"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Kosongkan
          </button>
        </div>

        <ul className="mt-4 space-y-3">
          {items.map((item: CartItem) => (
            <li
              key={item.key}
              className="flex flex-wrap items-start justify-between gap-4 rounded-[1.5rem] border border-[#e2d5c7] bg-[#fffaf4] p-5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#30251f]">{item.name}</p>
                <p className="mt-1 text-xs text-[#a27b68]">
                  {item.groupName} · {item.sizeNote} ({item.sizeLabel}) · {formatPrice(item.price)} / item
                </p>
              </div>
              <CartLineControls item={item} />
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-[1.5rem] border border-[#e2d5c7] bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a27b68]">Ringkasan</p>
          <div className="mt-3 flex items-center justify-between text-sm text-[#6d5b50]">
            <span>Total item</span>
            <span className="font-semibold text-[#30251f]">{count}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-lg font-semibold text-[#30251f]">
            <span>Total</span>
            <span className="text-[#c9674b]">{formatPrice(total)}</span>
          </div>
          <p className="mt-3 text-xs text-[#806e61]">Belum termasuk biaya antar. Pesanan tanpa antar (takeaway) tidak ada ongkir.</p>
        </div>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[2rem] border border-[#e2d5c7] bg-[#fffaf4] p-6 sm:p-8">
          <h2 className="text-lg font-semibold tracking-[-0.04em] text-[#30251f]">Data pemesan</h2>
          <p className="mt-2 text-sm text-[#806e61]">
            Pesanan dicatat ke dashboard Gatchu. Konfirmasi akhir tetap lewat WhatsApp {siteConfig.whatsapp.display}.
          </p>
          <CheckoutForm total={total} />
        </div>

        <a
          href={`${siteConfig.whatsapp.link}?text=${encodeURIComponent(`Halo ${siteConfig.name}, saya mau konfirmasi pesanan.`)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[#d8c9b8] bg-white px-5 py-3 text-sm font-semibold text-[#30251f] transition-colors hover:border-[#c9674b] hover:text-[#c9674b]"
        >
          <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
          Konfirmasi via WhatsApp
        </a>
      </div>
    </div>
  );
}
