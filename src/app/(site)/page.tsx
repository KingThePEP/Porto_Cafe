import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Coffee,
  Leaf,
  MapPin,
  MessageCircle,
  Music2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { MenuPriceTable } from "@/components/menu-price-table";
import { menuGroups } from "@/lib/menu-data";
import { getPublishedPosts } from "@/lib/data/blog";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";



export const dynamic = "force-dynamic";

const journalColors = ["bg-[#e8c4b3]", "bg-[#c2cfb5]", "bg-[#e8c477]"];

export default async function Home() {
  const posts = (await getPublishedPosts()).slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44 lg:min-h-[760px] lg:pb-24">
        <div className="absolute -left-36 top-32 h-80 w-80 rounded-full bg-[#f1d8c7]/60 blur-3xl" />
        <div className="absolute right-[-10rem] top-20 h-[30rem] w-[30rem] rounded-full bg-[#e3e7d3]/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-10">
          <div className="max-w-xl">
            <p className="animate-fade-up mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#a27b68]">
              <span className="h-px w-10 bg-[#c9674b]" />
              Kopi lokal dari Padang
            </p>
            <h1 className="animate-fade-up delay-1 max-w-2xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.07em] text-[#241c18] sm:text-7xl lg:text-[5.7rem]">
              Rasa yang datang dari <span className="text-[#c9674b]">cerita.</span>
            </h1>
            <p className="animate-fade-up delay-2 mt-8 max-w-md text-base leading-8 text-[#6d5b50] sm:text-lg">
              {siteConfig.description}
            </p>
            <div className="animate-fade-up delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#menu"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
              >
                Jelajahi Gatchu
                <ArrowDownRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Lihat di Maps
                <MapPin className="ml-2 h-5 w-5" aria-hidden="true" />
              </a>
            </div>
            <div className="animate-fade-up delay-4 mt-14 flex items-center gap-8 border-t border-[#e3d7ca] pt-6 sm:gap-12">
              <div>
                <p className="text-2xl font-semibold tracking-[-0.05em] text-[#241c18]">Padang</p>
                <p className="mt-1 text-xs font-medium text-[#9a887a]">kota kami</p>
              </div>
              <div className="h-10 w-px bg-[#e3d7ca]" />
              <div>
                <p className="text-2xl font-semibold tracking-[-0.05em] text-[#241c18]">7 hari</p>
                <p className="mt-1 text-xs font-medium text-[#9a887a]">buka setiap hari</p>
              </div>
              <div className="h-10 w-px bg-[#e3d7ca]" />
              <div>
                <p className="text-2xl font-semibold tracking-[-0.05em] text-[#241c18]">09-23</p>
                <p className="mt-1 text-xs font-medium text-[#9a887a]">senin sampai sabtu</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem] animate-float lg:ml-auto">
            <div className="absolute -right-8 top-12 h-24 w-24 animate-drift rounded-full bg-[#e7ad91]/60 blur-sm" />
            <div className="relative aspect-[0.88] overflow-hidden rounded-[2.5rem] bg-[#d6ad91] p-6 shadow-[0_30px_80px_rgba(89,56,38,0.22)] sm:p-10">
              <div className="absolute -right-20 -top-16 h-64 w-64 rounded-full border-[38px] border-[#f4d7c4]/40" />
              <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#b7785c]/50" />
              <div className="relative z-10 flex items-start justify-between">
                <span className="rounded-full bg-[#241c18] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f8f1e8]">
                  Padang coffee
                </span>
                <span className="font-mono text-xs font-bold tracking-[0.18em] text-[#754b3c]">GC / 001</span>
              </div>
              <div className="relative z-10 mt-14 flex flex-1 items-center justify-center">
                <div className="relative h-64 w-72 animate-float [animation-delay:1s]">
                  <div className="absolute bottom-0 left-4 h-48 w-60 rounded-b-[5rem] rounded-t-3xl border-[10px] border-[#f9eee3] bg-[#c9674b] shadow-[0_28px_0_rgba(91,50,34,0.15)] sm:left-10" />
                  <div className="absolute bottom-7 left-16 h-32 w-40 rounded-b-[3rem] rounded-t-2xl bg-[#f5e6d7] sm:left-24" />
                  <div className="absolute bottom-10 -right-12 h-28 w-32 rounded-full border-[14px] border-[#f9eee3] sm:-right-14" />
                  <div className="absolute left-24 top-[-2.5rem] h-24 w-28 rounded-[50%] border-t-[10px] border-[#f9eee3]/80 sm:left-28" />
                  <div className="absolute left-32 top-[-4.5rem] h-20 w-20 rounded-[50%] border-t-[8px] border-[#f9eee3]/55 sm:left-36" />
                  <div className="absolute left-24 top-16 h-4 w-24 rounded-full bg-white/35 sm:left-28" />
                  <div className="absolute bottom-6 right-7 h-3 w-3 rounded-full bg-[#e8bd71] shadow-[14px_8px_0_#8eaa75]" />
                </div>
              </div>
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#754b3c]">Gatchu Coffee</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#fff8ef]">Sawahan Timur, Padang</p>
                </div>
                <span className="rounded-full border border-[#f9eee3]/50 px-3 py-2 text-xs font-bold text-[#fff8ef]">Buka 7 hari</span>
              </div>
            </div>
            <div className="soft-shadow-sm absolute -bottom-6 -left-3 flex items-center gap-3 rounded-2xl border border-white/70 bg-[#fffaf4]/90 px-4 py-3 backdrop-blur sm:-left-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dce6d0] text-[#496044]">
                <Leaf className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a887a]">Layanan</span>
                <span className="mt-0.5 block text-sm font-semibold text-[#4d3d33]">Takeaway &amp; dine-in</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-[#e3d7ca] bg-[#241c18] py-4 text-[#f8f1e8]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 text-[10px] font-bold uppercase tracking-[0.24em] sm:justify-between sm:px-8 lg:px-10">
          <span>Padang coffee</span>
          <span className="text-[#e7ad91]">✳</span>
          <span>Takeaway &amp; dine-in</span>
          <span className="text-[#e7ad91]">✳</span>
          <span>Good conversations</span>
          <span className="text-[#e7ad91]">✳</span>
          <span>Open every day</span>
        </div>
      </div>

      <section id="menu" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#a27b68]">
              <span className="h-px w-8 bg-[#c9674b]" />
              Menu Gatchu
            </p>
            <h2 className="mt-5 max-w-xl text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#241c18] sm:text-5xl">
              Pilih ukuran sesuai <span className="text-[#c9674b]">ritmemu.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#806e61]">
              R = Reguler, L = Large, dan 1 Liter untuk dibawa pulang.
            </p>
          </div>
          <a
            href={siteConfig.whatsapp.orderLink}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#6d5b50] transition-colors hover:text-[#c9674b]"
          >
            Tanya menu via WhatsApp
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <figure className="overflow-hidden rounded-[2rem] border border-[#e2d5c7] bg-white p-3">
            <Image
              src={siteConfig.menuBoard}
              alt="Menu Gatchu Coffee"
              width={2000}
              height={1414}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="h-full w-full rounded-[1.5rem] object-cover"
            />
            <figcaption className="px-2 py-4 text-xs text-[#806e61]">
              Menu resmi Gatchu Coffee. Harga berlaku selama belum ada pembaruan.
            </figcaption>
          </figure>

          <div className="space-y-6">
            {menuGroups.map((group) => (
              <MenuPriceTable key={group.id} group={group} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[2rem] border border-[#e2d5c7] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold text-[#30251f]">Mau order atau mau tahu menu terbaru?</p>
            <p className="mt-1 text-sm text-[#806e61]">
              Chat {siteConfig.whatsapp.display} untuk ketersediaan menu hari ini.
            </p>
          </div>
          <a
            href={siteConfig.whatsapp.orderLink}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group w-full sm:w-auto")}
          >
            <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
            Order via WhatsApp
            <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section id="story" className="scroll-mt-24 bg-[#e6eadc]">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-24 lg:px-10">
          <div className="relative min-h-[25rem] overflow-hidden rounded-[2.5rem] bg-[#aebd9e] p-7 sm:min-h-[31rem] sm:p-10">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[32px] border-[#e6eadc]/40" />
            <div className="absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-[#8da47f]/70" />
            <div className="relative z-10 flex h-full min-h-[21rem] flex-col justify-between sm:min-h-[25rem]">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f1e8]/70 text-[#496044]">
                <Coffee className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-7xl font-light leading-none text-[#f8f1e8]/80">“</p>
                <p className="max-w-sm text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#fffaf4] sm:text-3xl">
                  Dari Sawahan Timur, kami mau bikin harimu sedikit lebih panjang.
                </p>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#f8f1e8]/70">— The Gatchu note</p>
              </div>
            </div>
          </div>

          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#6c8064]">
              <span className="h-px w-8 bg-[#6c8064]" />
              Cerita di balik cangkir
            </p>
            <h2 className="mt-5 max-w-lg text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#2e3d2c] sm:text-5xl">
              Setiap tegukan punya tempatnya sendiri.
            </h2>
            <p className="mt-7 max-w-lg text-base leading-8 text-[#5f6d59]">
              Berada di Sawahan Timur, Kecamatan Padang Timur, Gatchu adalah tempat untuk menikmati kopi di tempat atau membawanya pulang. Kami buka setiap hari, jadi selalu ada waktu untuk singgah.
            </p>
            <div className="mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-[#c4d0bb] pt-7 sm:grid-cols-3">
              <div>
                <p className="text-3xl font-semibold tracking-[-0.06em] text-[#3f593e]">Padang</p>
                <p className="mt-2 text-xs font-semibold text-[#71806b]">Kota kami</p>
              </div>
              <div>
                <p className="text-3xl font-semibold tracking-[-0.06em] text-[#3f593e]">7 hari</p>
                <p className="mt-2 text-xs font-semibold text-[#71806b]">Buka setiap hari</p>
              </div>
              <div>
                <p className="text-3xl font-semibold tracking-[-0.06em] text-[#3f593e]">2</p>
                <p className="mt-2 text-xs font-semibold text-[#71806b]">Takeaway &amp; dine-in</p>
              </div>
            </div>
            <Link href="#journal" className={cn(buttonVariants({ variant: "dark", size: "default" }), "mt-10")}>
              Baca cerita kami
              <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section id="journal" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#a27b68]">
              <span className="h-px w-8 bg-[#c9674b]" />
              Catatan dari Gatchu
            </p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#241c18] sm:text-5xl">
              Diracik, ditulis, <span className="text-[#c9674b]">dibagikan.</span>
            </h2>
          </div>
          <Link href="/blog" className="group inline-flex items-center gap-2 text-sm font-bold text-[#6d5b50] transition-colors hover:text-[#c9674b]">
            Buka journal
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-14 rounded-[2rem] border border-dashed border-[#d8c9b8] bg-[#fffaf4] px-6 py-12 text-center text-sm text-[#a27b68]">
            Belum ada artikel yang dipublikasikan. Admin bisa menambahkannya lewat dashboard.
          </p>
        ) : (
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-[#e2d5c7] bg-[#fffaf4] transition-all duration-300 hover:-translate-y-1 hover:shadow-warm"
              >
                <div className={cn("relative flex h-48 items-end overflow-hidden p-6", journalColors[index % journalColors.length])}>
                  <span className="font-mono text-7xl font-light leading-none text-white/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-[#6d5b50] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="absolute -bottom-10 right-8 h-32 w-32 rounded-full border-[18px] border-white/20" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a27b68]">
                    <span>{post.tags[0] ?? "Journal"}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold leading-tight tracking-[-0.04em] text-[#30251f]">
                    {post.title}
                  </h3>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#6d5b50] transition-colors group-hover:text-[#c9674b]">
                    Baca cerita
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="location" className="scroll-mt-24 border-y border-[#e3d7ca] bg-[#fffaf4]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#a27b68]">
              <span className="h-px w-8 bg-[#c9674b]" />
              Temukan kami
            </p>
            <h2 className="mt-5 max-w-lg text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#241c18] sm:text-5xl">
              Mampir, ngobrol, lalu bawa <span className="text-[#c9674b]">pulang.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-[#6d5b50]">
              Gatchu ada di Sawahan Timur, Kota Padang. Buka Senin sampai Sabtu pukul 09.00 dan Minggu pukul 12.00 WIB.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
              >
                Buka di Google Maps
                <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                Pesan via WhatsApp
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-[#e2d5c7] bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2e6da] text-[#c9674b]">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a27b68]">Alamat</p>
              <p className="mt-3 text-sm leading-7 text-[#4d3d33]">{siteConfig.address.full}</p>
            </div>
            <div className="rounded-[2rem] border border-[#e2d5c7] bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e6eadc] text-[#496044]">
                <Clock3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a27b68]">Jam buka</p>
              <p className="mt-3 text-sm leading-7 text-[#4d3d33]">Senin–Sabtu {siteConfig.hours.weekdays}</p>
              <p className="text-sm leading-7 text-[#4d3d33]">Minggu {siteConfig.hours.sunday}</p>
            </div>
            <div className="rounded-[2rem] border border-[#e2d5c7] bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7ece4] text-[#b9573e]">
                <Coffee className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a27b68]">Layanan</p>
              <p className="mt-3 text-sm leading-7 text-[#4d3d33]">Takeaway dan dine-in, buka 7 hari seminggu.</p>
            </div>
            <div className="rounded-[2rem] border border-[#e2d5c7] bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e6eadc] text-[#496044]">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a27b68]">WhatsApp</p>
              <a
                href={siteConfig.whatsapp.orderLink}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-sm font-semibold text-[#4d3d33] transition-colors hover:text-[#c9674b]"
              >
                {siteConfig.whatsapp.display}
              </a>
              <p className="mt-1 text-xs text-[#806e61]">Untuk order dan tanya menu</p>
            </div>
            <div className="rounded-[2rem] border border-[#e2d5c7] bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef0e4] text-[#5c6b45]">
                <Music2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a27b68]">Sosial</p>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-sm font-semibold text-[#4d3d33] transition-colors hover:text-[#c9674b]"
              >
                {siteConfig.social.instagramHandle}
              </a>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-sm font-semibold text-[#4d3d33] transition-colors hover:text-[#c9674b]"
              >
                {siteConfig.social.tiktokHandle}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="visit" className="scroll-mt-20 px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
        <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#c9674b] px-6 py-14 sm:px-12 sm:py-20 lg:px-20">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[40px] border-white/10" />
          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#b9573e]/60 blur-2xl" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#f9d5c6]">
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                Waktu untuk santai
              </p>
              <h2 className="mt-5 max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-white sm:text-6xl">
                Di tempat atau bawa pulang?
              </h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-[#ffe8dc]/85">
                Kami siap迎接 kamu dengan kopi Gatchu. Order lewat WhatsApp, datang mampir, atau pilih takeaway untuk dibawa pulang.
              </p>
            </div>
            <a
              href={siteConfig.whatsapp.orderLink}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "group w-full border-transparent bg-[#fffaf4] text-[#30251f] hover:bg-white sm:w-auto")}
            >
              <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
              Pesan via WhatsApp
              <span className="ml-2 text-sm font-normal opacity-80">{siteConfig.whatsapp.display}</span>
              <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
