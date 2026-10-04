import type { Metadata } from "next";
import { Clock3, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kontak & Reservasi",
  description: `Hubungi ${siteConfig.name} untuk pertanyaan menu, reservasi meja, atau kerja sama. ${siteConfig.address.full}. ${siteConfig.hours.label}.`,
  alternates: {
    canonical: "/kontak",
  },
};

export default function ContactPage() {
  return (
    <>
    <JsonLd data={buildBreadcrumbJsonLd([{"name": "Beranda", "path": "/"}, {"name": "Kontak", "path": "/kontak"}])} />
    <main className="pt-32 sm:pt-36">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <p className="animate-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#7d5c4d]">
          <span className="h-px w-8 bg-[#a24931]" />
          Kontak
        </p>
        <h1 className="animate-fade-up delay-1 mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#241c18] sm:text-6xl">
          Reservasi meja atau <span className="text-[#a24931]">tanya menu.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[#6d5b50]">
          Isi form di samping atau langsung chat kami di WhatsApp. Balasan paling cepat lewat WhatsApp
          karena barista kami juga on duty saat jam buka.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="rounded-[2rem] border border-[#e2d5c7] bg-white/70 p-6 sm:p-8">
          <ContactForm />
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] bg-[#e6eadc] p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-[#496044]">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#7d5c4d]">Alamat</h2>
            <p className="mt-3 text-sm leading-7 text-[#4d3d33]">{siteConfig.address.full}</p>
            <a
              href={siteConfig.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.12em] text-[#a24931] hover:underline"
            >
              Buka di Maps
            </a>
          </div>

          <div className="rounded-[2rem] bg-[#f2e6da] p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-[#a24931]">
              <Clock3 className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#7d5c4d]">Jam buka</h2>
            <p className="mt-3 text-sm leading-7 text-[#4d3d33]">Senin–Sabtu {siteConfig.hours.weekdays}</p>
            <p className="text-sm leading-7 text-[#4d3d33]">Minggu {siteConfig.hours.sunday}</p>
          </div>

          <div className="rounded-[2rem] bg-[#241c18] p-6 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[#e7ad91]">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#c9b6a5]">WhatsApp</h2>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{siteConfig.whatsapp.display}</p>
            <a
              href={siteConfig.whatsapp.orderLink}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "mt-5 border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20 hover:text-white",
              )}
            >
              Chat sekarang
            </a>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
