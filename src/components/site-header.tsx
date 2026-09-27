import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Menu as MenuIcon, ShoppingBag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CartBadge } from "@/components/cart-badge";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Menu", href: "/menu" },
  { label: "Journal", href: "/blog" },
  { label: "Galeri", href: "/galeri" },
  { label: "Tentang", href: "/about" },
  { label: "Kontak", href: "/kontak" },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3 text-[#241c18]"
          aria-label={`${siteConfig.name} home`}
        >
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#241c18] text-[#f8f1e8] transition-transform duration-300 group-hover:rotate-12">
            <Image
              src={siteConfig.logo}
              alt={`${siteConfig.name} logo`}
              width={40}
              height={40}
              className="h-10 w-10 object-cover"
            />
          </span>
          <span className="text-lg font-black tracking-[0.18em]">{siteConfig.shortName}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#6d5b50] transition-colors hover:text-[#c9674b]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "bg-transparent")}
          >
            <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
            Lihat lokasi
          </a>
          <CartBadge className="h-9 w-9" />
          <Link href="/menu" className={buttonVariants({ variant: "primary", size: "sm" })}>
            Lihat menu
            <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <details className="relative md:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-[#d8c9b8] bg-white/70 text-[#241c18] [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Buka menu navigasi</span>
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-14 w-56 rounded-3xl border border-[#e2d5c7] bg-[#fffaf4] p-3 shadow-[0_20px_50px_rgba(56,36,25,0.15)]">
            <nav className="flex flex-col gap-1" aria-label="Navigasi seluler">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#6d5b50] transition-colors hover:bg-[#f2e6da] hover:text-[#241c18]"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "mt-2 w-full")}
              >
                <MapPin className="mr-2 h-4 w-4" aria-hidden="true" />
                Lihat lokasi
              </a>
              <Link
                href="/keranjang"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "w-full")}
              >
                <ShoppingBag className="mr-2 h-4 w-4" aria-hidden="true" />
                Keranjang
              </Link>
              <Link
                href="/menu"
                className={cn(buttonVariants({ variant: "primary", size: "sm" }), "w-full")}
              >
                Lihat menu
                <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
