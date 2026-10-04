import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, MapPin, MessageCircle } from "lucide-react";
import { AddToCartButton } from "@/components/cart-controls";
import { JsonLd } from "@/components/json-ld";
import { buttonVariants } from "@/components/ui/button";
import { getMenuEntries, getMenuEntry } from "@/lib/data/menu";
import { createOrderLink, formatPrice, sizeLabels } from "@/lib/menu-data";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import type { OrderSize } from "@/lib/validation/orders";
import { cn } from "@/lib/utils";

type Params = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const entries = await getMenuEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const entry = await getMenuEntry(params.slug);

  if (!entry) {
    return { title: "Menu tidak ditemukan" };
  }

  const prices = [
    entry.regular ? `${sizeLabels.regular} ${formatPrice(entry.regular)}` : null,
    entry.large ? `${sizeLabels.large} ${formatPrice(entry.large)}` : null,
    entry.liter ? `${sizeLabels.liter} ${formatPrice(entry.liter)}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title: entry.name,
    description: `${entry.name} dari ${siteConfig.name}. ${prices}. Order via WhatsApp ${siteConfig.whatsapp.display}.`,
    alternates: {
      canonical: `/menu/${entry.slug}`,
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: `/menu/${entry.slug}`,
      siteName: siteConfig.name,
      title: `${entry.name} — ${siteConfig.name}`,
      description: `${entry.description ?? entry.name}. ${prices}.`,
      images: entry.imageUrl ? [{ url: entry.imageUrl, alt: entry.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.name} — ${siteConfig.name}`,
      description: `${entry.description ?? entry.name}. ${prices}.`,
    },
  };
}

function buildProductJsonLd(entry: Awaited<ReturnType<typeof getMenuEntry>>) {
  if (!entry) {
    return null;
  }

  const offerList: { label: string; price?: number }[] = [
    { label: sizeLabels.regular, price: entry.regular },
    { label: sizeLabels.large, price: entry.large },
    { label: sizeLabels.liter, price: entry.liter },
  ];

  const offers = offerList.filter(
    (offer): offer is { label: string; price: number } => typeof offer.price === "number",
  );

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: entry.name,
    description: entry.description ?? entry.name,
    image: entry.imageUrl ?? undefined,
    category: entry.groupName,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: offers.map((offer) => ({
      "@type": "Offer",
      name: offer.label,
      price: offer.price,
      priceCurrency: "IDR",
      availability: entry.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `/menu/${entry.slug}`,
      seller: { "@type": "Organization", name: siteConfig.name },
    })),
  };
}

export default async function MenuDetailPage({ params }: Params) {
  const entry = await getMenuEntry(params.slug);

  if (!entry) {
    notFound();
  }

  const sizes = [
    { key: "regular", label: sizeLabels.regular, value: entry.regular, note: "Reguler" },
    { key: "large", label: sizeLabels.large, value: entry.large, note: "Large" },
    { key: "liter", label: sizeLabels.liter, value: entry.liter, note: "1 Liter" },
  ].filter((size) => size.value) as {
    key: OrderSize;
    label: string;
    value: number;
    note: string;
  }[];

  const productJsonLd = buildProductJsonLd(entry);

  return (
    <main className="pt-32 sm:pt-36">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Beranda", path: "/" }, { name: "Menu", path: "/menu" }, { name: entry.name, path: `/menu/${entry.slug}` }])} />
      {productJsonLd ? <JsonLd data={productJsonLd} /> : null}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6d5b50] transition-colors hover:text-[#a24931]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke menu
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <div>
            <p className="animate-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#7d5c4d]">
              <span className="h-px w-8 bg-[#a24931]" />
              {entry.groupName}
            </p>
            <h1 className="animate-fade-up delay-1 mt-5 text-balance text-4xl font-semibold leading-tight tracking-[-0.06em] text-[#241c18] sm:text-5xl">
              {entry.name}
            </h1>
            {entry.note ? <p className="mt-4 text-sm text-[#7d5c4d]">{entry.note}</p> : null}

            <div className="mt-10 space-y-3">
              {sizes.map((size) => (
                <div
                  key={size.label}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-[#e2d5c7] bg-[#fffaf4] px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#30251f]">{size.note}</p>
                    <p className="text-xs text-[#7d5c4d]">Ukuran {size.label}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg font-semibold tracking-[-0.04em] text-[#a24931]">
                      {formatPrice(size.value)}
                    </span>
                    <AddToCartButton
                      productId={entry.productId}
                      slug={entry.slug}
                      name={entry.name}
                      groupName={entry.groupName}
                      size={size.key}
                      sizeLabel={size.label}
                      sizeNote={size.note}
                      price={size.value}
                    />
                    <a
                      href={createOrderLink(entry.name, size.label)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Order ${entry.name} ukuran ${size.label} via WhatsApp`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8c9b8] bg-white text-[#4d3d33] transition-colors hover:border-[#a24931] hover:text-[#a24931]"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={siteConfig.whatsapp.orderLink}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group")}
              >
                <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                Order {entry.name}
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
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[#e2d5c7] bg-white p-3">
            <Image
              src={siteConfig.menuBoard}
              alt={`Menu ${siteConfig.name} yang memuat ${entry.name}`}
              width={2000}
              height={1414}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="h-full w-full rounded-[1.5rem] object-cover"
            />
            <p className="px-2 py-4 text-xs text-[#706155]">
              Foto menu {siteConfig.name}. Harga berlaku selama belum ada pembaruan.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
