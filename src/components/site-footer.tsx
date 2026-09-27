import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, AtSign, MapPin, MessageCircle, Music2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#eadfd2] bg-[#f8f2ea]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-3 lg:px-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#241c18]">
              <Image
                src={siteConfig.logo}
                alt={`${siteConfig.name} logo`}
                width={48}
                height={48}
                className="h-12 w-12 object-cover"
              />
            </span>
            <p className="text-lg font-black tracking-[0.18em] text-[#241c18]">{siteConfig.shortName}</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#6d5b50]">
            {siteConfig.description}
          </p>
          <a
            href={siteConfig.whatsapp.orderLink}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#c9674b] transition-colors hover:text-[#b9573e]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp {siteConfig.whatsapp.display}
          </a>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#241c18]">
              Kunjungi
            </p>
            <div className="mt-4 space-y-1 text-sm text-[#6d5b50]">
              <p>{siteConfig.address.street}</p>
              <p>{siteConfig.address.neighborhood}, {siteConfig.address.district}</p>
              <p>{siteConfig.address.city}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#241c18]">
              Jam buka
            </p>
            <p className="mt-4 text-sm text-[#6d5b50]">{siteConfig.hours.label}</p>
            <p className="mt-1 text-sm text-[#6d5b50]">Layanan {siteConfig.services.join(" & ")}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#241c18]">
              Ikuti kami
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#d8c9b8] bg-[#fffaf4] px-4 py-2 text-sm font-semibold text-[#241c18] transition-colors hover:border-[#c9674b] hover:text-[#c9674b]"
              >
                <AtSign className="h-4 w-4" aria-hidden="true" />
                {siteConfig.social.instagramHandle}
              </a>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#d8c9b8] bg-[#fffaf4] px-4 py-2 text-sm font-semibold text-[#241c18] transition-colors hover:border-[#c9674b] hover:text-[#c9674b]"
              >
                <Music2 className="h-4 w-4" aria-hidden="true" />
                {siteConfig.social.tiktokHandle}
              </a>
            </div>
          </div>
          <a
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "bg-[#fffaf4]")}
          >
            <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
            Buka di Google Maps
            <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="border-t border-[#eadfd2] py-6 text-center text-xs text-[#8a7466]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5 sm:px-8 lg:flex-row lg:justify-between lg:px-10">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Diracik di {siteConfig.address.city.split(",")[0]}.
          </p>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2" aria-label="Navigasi footer">
            <Link href="/menu" className="hover:text-[#c9674b]">
              Menu
            </Link>
            <Link href="/blog" className="hover:text-[#c9674b]">
              Journal
            </Link>
            <Link href="/galeri" className="hover:text-[#c9674b]">
              Galeri
            </Link>
            <Link href="/kontak" className="hover:text-[#c9674b]">
              Kontak
            </Link>
            <Link href="/admin/login" className="hover:text-[#c9674b]">
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
