import type { Metadata } from "next";
import { getPublicGallery } from "@/lib/data/gallery";
import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Galeri",
  description: `Foto suasana, menu, dan sudut kedai Gatchu Coffee di ${siteConfig.address.city}.`,
  alternates: {
    canonical: "/galeri",
  },
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await getPublicGallery();

  return (
    <>
    <JsonLd data={buildBreadcrumbJsonLd([{"name": "Beranda", "path": "/"}, {"name": "Galeri", "path": "/galeri"}])} />
    <main className="pt-32 sm:pt-36">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <p className="animate-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#a27b68]">
          <span className="h-px w-8 bg-[#c9674b]" />
          Galeri
        </p>
        <h1 className="animate-fade-up delay-1 mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#241c18] sm:text-6xl">
          Suasana <span className="text-[#c9674b]">Gatchu.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[#6d5b50]">
          Sudut bar dan suasana kedai di {siteConfig.address.neighborhood}. Foto ditambahkan dari
          dashboard admin.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        {items.length === 0 ? (
          <p className="rounded-[2rem] border border-dashed border-[#d8c9b8] bg-[#fdfaf6] px-6 py-16 text-center text-sm text-[#a27b68]">
            Belum ada foto galeri. Admin bisa menambahkan lewat dashboard.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="group relative overflow-hidden rounded-[2rem] border border-[#e2d5c7] bg-[#f2e6da]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.caption ?? `Suasana ${siteConfig.name}`}
                  loading="lazy"
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.caption ? (
                  <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#241c18]/80 to-transparent px-5 pb-4 pt-10 text-sm font-semibold text-white">
                    {item.caption}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
    </>
  );
}
