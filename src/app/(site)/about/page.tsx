import type { Metadata } from "next";
import { Clock3, Coffee, MapPin, MessageCircle, Music2, ArrowUpRight, AtSign } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tentang & Lokasi",
  description: `${siteConfig.name} adalah kedai kopi lokal di ${siteConfig.address.city}. ${siteConfig.address.full}. ${siteConfig.hours.label}.`,
  alternates: {
    canonical: "/about",
  },
};

const mapsEmbedUrl = "https://www.google.com/maps?q=Gatchu+Coffee&output=embed";

export default function AboutPage() {
  return (
    <>
    <JsonLd data={buildBreadcrumbJsonLd([{"name": "Beranda", "path": "/"}, {"name": "About", "path": "/about"}])} />
    <main className="pt-32 sm:pt-36">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <p className="animate-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#7d5c4d]">
          <span className="h-px w-8 bg-[#a24931]" />
          Tentang Gatchu
        </p>
        <h1 className="animate-fade-up delay-1 mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#241c18] sm:text-6xl">
          Kedai kopi lokal di <span className="text-[#a24931]">Sawahan Timur.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[#6d5b50]">
          {siteConfig.name} berada di {siteConfig.address.neighborhood}, {siteConfig.address.district.replace("Kec. ", "")}{" "}
          Kota Padang. Kami melayani takeaway dan dine-in, buka setiap hari.
        </p>
      </section>

      <section className="bg-[#e6eadc]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-3 lg:px-10">
          <div className="rounded-[2rem] bg-white/70 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2e6da] text-[#a24931]">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#7d5c4d]">Alamat</h2>
            <p className="mt-3 text-sm leading-7 text-[#4d3d33]">{siteConfig.address.full}</p>
          </div>
          <div className="rounded-[2rem] bg-white/70 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dce6d0] text-[#496044]">
              <Clock3 className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#7d5c4d]">Jam buka</h2>
            <p className="mt-3 text-sm leading-7 text-[#4d3d33]">Senin–Sabtu {siteConfig.hours.weekdays}</p>
            <p className="text-sm leading-7 text-[#4d3d33]">Minggu {siteConfig.hours.sunday}</p>
          </div>
          <div className="rounded-[2rem] bg-white/70 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7ece4] text-[#8f3d26]">
              <Coffee className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#7d5c4d]">Layanan</h2>
            <p className="mt-3 text-sm leading-7 text-[#4d3d33]">Takeaway dan dine-in, buka 7 hari seminggu.</p>
          </div>
        </div>
      </section>

      <section id="lokasi" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[#241c18] sm:text-4xl">Lokasi outlet</h2>
        <p className="mt-3 max-w-2xl text-base leading-8 text-[#6d5b50]">{siteConfig.address.full}</p>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#e2d5c7]">
          <iframe
            title={`Peta lokasi ${siteConfig.name}`}
            src={mapsEmbedUrl}
            width="100%"
            height="420"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
          >
            <MapPin className="mr-2 h-5 w-5" aria-hidden="true" />
            Buka di Google Maps
            <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
          </a>
          <a
            href={siteConfig.whatsapp.orderLink}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
            {siteConfig.whatsapp.display}
          </a>
        </div>
      </section>

      <section className="border-t border-[#eadfd2] bg-[#f8f2ea]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#241c18]">Ikuti keseharian Gatchu</h2>
            <p className="mt-2 text-sm text-[#6d5b50]">Menu harian, promo, dan kabar terbaru dari outlet.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "bg-white")}
            >
              <AtSign className="mr-2 h-4 w-4" aria-hidden="true" />
              {siteConfig.social.instagramHandle}
            </a>
            <a
              href={siteConfig.social.tiktok}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "bg-white")}
            >
              <Music2 className="mr-2 h-4 w-4" aria-hidden="true" />
              {siteConfig.social.tiktokHandle}
            </a>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
