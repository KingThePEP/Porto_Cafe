import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, MapPin, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pesanan Diterima",
  description: `Konfirmasi pesanan ${siteConfig.name}.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderSuccessPage() {
  return (
    <main className="pt-32 sm:pt-36">
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8 lg:px-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e6eadc] text-[#496044]">
          <Check className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#241c18] sm:text-5xl">
          Pesanan sudah <span className="text-[#c9674b]">dikirim.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-[#6d5b50]">
          Terima kasih. Pesanan tercatat dan akan kami cek. Untuk konfirmasi fastest, kirim ringkasan pesanan ke
          WhatsApp {siteConfig.whatsapp.display}.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={siteConfig.whatsapp.link}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
          >
            <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
            Konfirmasi via WhatsApp
          </a>
          <a
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            <MapPin className="mr-2 h-5 w-5" aria-hidden="true" />
            Lihat lokasi outlet
          </a>
        </div>

        <div className="mt-10 rounded-[2rem] border border-[#e2d5c7] bg-[#fffaf4] p-6 sm:p-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#a27b68]">Pengambilan</h2>
          <p className="mt-3 text-sm leading-7 text-[#4d3d33]">{siteConfig.address.full}</p>
          <p className="mt-3 text-sm leading-7 text-[#4d3d33]">{siteConfig.hours.label}</p>
        </div>

        <Link
          href="/menu"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#6d5b50] transition-colors hover:text-[#c9674b]"
        >
          Kembali ke menu
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
