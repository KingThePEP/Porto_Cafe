import { siteConfig } from "@/lib/site-config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gatchucoffee.vercel.app";

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${siteUrl}/#warung`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteUrl,
    image: `${siteUrl}${siteConfig.menuBoard}`,
    logo: `${siteUrl}${siteConfig.logo}`,
    telephone: `+${siteConfig.whatsapp.international}`,
    priceRange: "Rp10.000 - Rp60.000",
    currenciesAccepted: "IDR",
    paymentAccepted: "Tunai, QRIS, debit, kredit",
    servesCuisine: ["Kopi", "Minuman", "Snack"],
    hasMenu: `${siteUrl}/menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: "Kota Padang",
      addressRegion: "Sumatera Barat",
      postalCode: "25126",
      addressCountry: "ID",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: "12:00",
        closes: "22:00",
      },
    ],
    sameAs: [siteConfig.social.instagram, siteConfig.social.tiktok],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "WhatsApp order",
        telephone: `+${siteConfig.whatsapp.international}`,
        areaServed: "ID",
        availableLanguage: ["id", "en"],
      },
    ],
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
