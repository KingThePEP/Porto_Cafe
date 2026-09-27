export const siteConfig = {
  name: "Gatchu Coffee",
  shortName: "GATCHU",
  tagline: "Rasa yang datang dari cerita.",
  description:
    "Kedai kopi lokal di Sawahan Timur, Kota Padang. Nikmati kopi di tempat atau bawa pulang.",
  address: {
    street: "Jl. Perintis No.16",
    neighborhood: "Sawahan Tim.",
    district: "Kec. Padang Tim.",
    city: "Kota Padang, Sumatera Barat 25126",
    full: "Jl. Perintis No.16, Sawahan Tim., Kec. Padang Tim., Kota Padang, Sumatera Barat 25126",
  },
  hours: {
    label: "Senin–Sabtu 09.00–23.00 WIB · Minggu 12.00–22.00 WIB",
    weekdays: "09.00–23.00 WIB",
    sunday: "12.00–22.00 WIB",
  },
  services: ["Takeaway", "Dine-in"],
  whatsapp: {
    display: "0823-6482-9497",
    international: "628236482947",
    link: "https://wa.me/628236482947",
    orderLink: "https://wa.me/628236482947?text=Halo%20Gatchu%20Coffee%2C%20saya%20mau%20tanya%20menu%20yang%20tersedia.",
  },
  mapsUrl: "https://maps.app.goo.gl/d6AfRSh3rREWaEGB9",
  logo: "/images/gatchu-logo.jpg",
  menuBoard: "/images/menu-gatchu.png",
  social: {
    instagram: "https://www.instagram.com/gatchucoffee.pdg/",
    instagramHandle: "@gatchucoffee.pdg",
    tiktok: "https://www.tiktok.com/@gatchu.coffee",
    tiktokHandle: "@gatchu.coffee",
  },
} as const;
