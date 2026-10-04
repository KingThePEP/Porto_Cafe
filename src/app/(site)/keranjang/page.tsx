import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Keranjang",
  description: `Keranjang pre-order ${siteConfig.name}. Pilih menu, isi data pemesan, dan konfirmasi via WhatsApp.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return (
    <main className="pt-32 sm:pt-36">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <p className="animate-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#7d5c4d]">
          <span className="h-px w-8 bg-[#a24931]" />
          Pre-order
        </p>
        <h1 className="animate-fade-up delay-1 mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#241c18] sm:text-6xl">
          Keranjang <span className="text-[#a24931]">pesananmu.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[#6d5b50]">
          Pesanan takeaway di ambil langsung di outlet {siteConfig.address.street}, atau delivery ke alamat yang kamu
          cantumkan. Ketersediaan menu dikonfirmasi lewat WhatsApp {siteConfig.whatsapp.display}.
        </p>

        <CartView />
      </section>
    </main>
  );
}
