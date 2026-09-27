"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowUpRight, Loader2, MessageCircle } from "lucide-react";
import { useCartStore, type CartItem } from "@/lib/cart-store";
import { formatPrice } from "@/lib/menu-data";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const orderSchema = z.object({
  customerName: z.string().trim().min(3, "Nama minimal 3 karakter"),
  customerPhone: z
    .string()
    .trim()
    .min(9, "Nomor WhatsApp minimal 9 digit")
    .regex(/^[0-9+\-\s]+$/, "Nomor hanya boleh berisi angka, spasi, atau tanda -"),
  orderType: z.enum(["pickup", "delivery"]),
  address: z.string().trim().max(300, "Alamat terlalu panjang").optional(),
  notes: z.string().trim().max(300, "Catatan terlalu panjang").optional(),
});

export type OrderFormValues = z.infer<typeof orderSchema>;

const fieldClass =
  "w-full rounded-2xl border border-[#d8c9b8] bg-white px-4 py-3 text-sm text-[#30251f] outline-none transition-colors placeholder:text-[#a27b68] focus:border-[#c9674b]";

function buildWhatsappLink(items: CartItem[], values: OrderFormValues, total: number) {
  const lines = items.map(
    (item) => `- ${item.name} (${item.sizeNote}/${item.sizeLabel}) x${item.qty} = ${formatPrice(item.price * item.qty)}`,
  );

  const message = [
    `Halo ${siteConfig.name}, saya mau konfirmasi pesanan:`,
    "",
    ...lines,
    "",
    `Total: ${formatPrice(total)}`,
    `Nama: ${values.customerName}`,
    `Tipe: ${values.orderType === "pickup" ? "Takeaway / ambil di outlet" : "Delivery"}`,
    values.address ? `Alamat: ${values.address}` : null,
    values.notes ? `Catatan: ${values.notes}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return `${siteConfig.whatsapp.link}?text=${encodeURIComponent(message)}`;
}

export function CheckoutForm({ total }: { total: number }) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      orderType: "pickup",
      address: "",
      notes: "",
    },
  });

  const orderType = watch("orderType");
  const whatsappLink = buildWhatsappLink(items, watch(), total);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        total,
        items: items.map((item) => ({
          productName: item.name,
          sizeLabel: item.sizeLabel,
          price: item.price,
          qty: item.qty,
        })),
      }),
    });

    const payload = (await response.json()) as { orderId?: string; error?: string; code?: string };

    if (!response.ok) {
      setServerError(payload.error ?? "Pesanan gagal dikirim. Coba lagi atau konfirmasi via WhatsApp.");
      return;
    }

    clearCart();
    router.push(`/keranjang/selesai?order=${encodeURIComponent(payload.orderId ?? "manual")}`);
  });

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
      <div>
        <label htmlFor="customerName" className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a27b68]">
          Nama
        </label>
        <input
          id="customerName"
          type="text"
          placeholder="Nama lengkap"
          className={cn(fieldClass, "mt-2")}
          aria-invalid={Boolean(errors.customerName)}
          {...register("customerName")}
        />
        {errors.customerName ? <p className="mt-1 text-xs text-[#c9674b]">{errors.customerName.message}</p> : null}
      </div>

      <div>
        <label htmlFor="customerPhone" className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a27b68]">
          Nomor WhatsApp
        </label>
        <input
          id="customerPhone"
          type="tel"
          inputMode="tel"
          placeholder="08xx-xxxx-xxxx"
          className={cn(fieldClass, "mt-2")}
          aria-invalid={Boolean(errors.customerPhone)}
          {...register("customerPhone")}
        />
        {errors.customerPhone ? <p className="mt-1 text-xs text-[#c9674b]">{errors.customerPhone.message}</p> : null}
      </div>

      <div>
        <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a27b68]">Tipe pesanan</span>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            { value: "pickup", label: "Takeaway" },
            { value: "delivery", label: "Delivery" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue("orderType", option.value as "pickup" | "delivery")}
              aria-pressed={orderType === option.value}
              className={cn(
                "rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors",
                orderType === option.value
                  ? "border-[#241c18] bg-[#241c18] text-white"
                  : "border-[#d8c9b8] bg-white text-[#4d3d33] hover:border-[#c9674b]",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {orderType === "delivery" ? (
        <div>
          <label htmlFor="address" className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a27b68]">
            Alamat pengiriman
          </label>
          <textarea
            id="address"
            rows={3}
            placeholder="Alamat lengkap"
            className={cn(fieldClass, "mt-2 resize-none")}
            aria-invalid={Boolean(errors.address)}
            {...register("address")}
          />
          {errors.address ? <p className="mt-1 text-xs text-[#c9674b]">{errors.address.message}</p> : null}
        </div>
      ) : null}

      <div>
        <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a27b68]">
          Catatan (opsional)
        </label>
        <textarea
          id="notes"
          rows={2}
          placeholder="Misal: less sugar, ambil jam 15.00"
          className={cn(fieldClass, "mt-2 resize-none")}
          aria-invalid={Boolean(errors.notes)}
          {...register("notes")}
        />
        {errors.notes ? <p className="mt-1 text-xs text-[#c9674b]">{errors.notes.message}</p> : null}
      </div>

      <div className="rounded-2xl bg-[#f2e6da] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a27b68]">Total</p>
        <p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[#c9674b]">{formatPrice(total)}</p>
      </div>

      {serverError ? (
        <p role="alert" className="rounded-2xl border border-[#e2b7a8] bg-[#fdeee9] px-4 py-3 text-sm text-[#a4462f]">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-full bg-[#241c18] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#c9674b] disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Mengirim pesanan...
          </>
        ) : (
          <>
            Kirim pesanan
            <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-center rounded-full border border-[#d8c9b8] bg-white px-5 py-3.5 text-sm font-semibold text-[#30251f] transition-colors hover:border-[#c9674b] hover:text-[#c9674b]"
      >
        <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
        Lewati form, order via WhatsApp
      </a>
    </form>
  );
}
