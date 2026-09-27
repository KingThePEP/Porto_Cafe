import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, MessageCircle } from "lucide-react";
import { MenuBrowser } from "@/components/menu-browser";
import { buttonVariants } from "@/components/ui/button";
import { getMenuGroups } from "@/lib/data/menu";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Menu & Harga",
  description: `Menu dan harga resmi ${siteConfig.name}: Kopi Susu Gatchu dan Premium Coffee ukuran Reguler, Large, dan 1 Liter.`,
  alternates: {
    canonical: "/menu",
  },
};

export default async function MenuPage() {
  const groups = await getMenuGroups();

  return (
    <>
    <JsonLd data={buildBreadcrumbJsonLd([{"name": "Beranda", "path": "/"}, {"name": "Menu", "path": "/menu"}])} />
    <main className="pt-32 sm:pt-36">
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-8 lg:px-10">
        <p className="animate-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#a27b68]">
          <span className="h-px w-8 bg-[#c9674b]" />
          Menu Gatchu
        </p>
        <h1 className="animate-fade-up delay-1 mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#241c18] sm:text-6xl">
          Daftar menu dan <span className="text-[#c9674b]">harga</span> terbaru.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[#6d5b50]">
          R = Reguler, L = Large, dan 1 Liter untuk dibawa pulang. Harga bisa berubah sewaktu-waktu, jadi
          konfirmasi dulu ke {siteConfig.name} sebelum order.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={siteConfig.whatsapp.orderLink}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
          >
            <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
            Order via WhatsApp
            <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
          </a>
          <a
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            <MapPin className="mr-2 h-5 w-5" aria-hidden="true" />
            Lihat lokasi
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <MenuBrowser groups={groups} />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-[#e2d5c7] bg-white p-6 sm:p-8">
          <p className="text-sm text-[#806e61]">
            Ingin tahu menu harian atau promo terbaru?             Lihat{" "}
            <Link href="/about" className="font-semibold text-[#c9674b] hover:underline">
              halaman tentang kami
            </Link>
            .
          </p>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-[#c9674b] hover:underline"
          >
            {siteConfig.social.instagramHandle}
          </a>
        </div>
      </section>
    </main>
    </>
  );
}
