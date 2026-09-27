# Gatchu Coffee – Product Requirements Document (PRD)

## 1. Latar Belakang & Tujuan
**Gatchu Coffee** adalah brand coffee shop lokal yang ingin memperluas jangkauan digital
melalui website portofolio sekaligus platform pemesanan online. Website ini berfungsi
sebagai *company profile*, *digital menu*, dan *content hub* (blog & cerita kopi), serta
menyediakan dashboard admin untuk mengelola konten dan pesanan.

**Tujuan utama:**
- Menampilkan identitas brand Gatchu Coffee secara profesional.
- Mempermudah pelanggan melihat menu, harga, dan melakukan pre-order.
- Menyediakan kanal publikasi artikel seputar kopi, event, dan promo.
- Memberi admin kontrol penuh atas konten & data pelanggan melalui dashboard.

## 2. Target Pengguna
- **Pengunjung / Pelanggan**: melihat menu, cerita brand, artikel, dan melakukan pre-order.
- **Member (opsional)**: menyimpan riwayat pesanan & favorit.
- **Admin / Barista**: mengelola menu, artikel, pesanan, dan pesan kontak.

## 2.1 Data Outlet (terverifikasi)
| Data | Nilai |
|------|-------|
| Alamat | Jl. Perintis No.16, Sawahan Tim., Kec. Padang Tim., Kota Padang, Sumatera Barat 25126 |
| Jam buka | Senin–Sabtu 09.00–23.00 WIB, Minggu 12.00–22.00 WIB |
| Layanan | Takeaway & dine-in, buka 7 hari |
| WhatsApp | 0823-6482-9497 |
| Instagram | @gatchucoffee.pdg |
| TikTok | @gatchu.coffee |
| Google Maps | https://maps.app.goo.gl/d6AfRSh3rREWaEGB9 |

Sumber data outlet: `src/lib/site-config.ts` (sumber tunggal untuk frontend) dan
`supabase/seed.sql` (brand_profile). Harga menu disimpan di `src/lib/menu-data.ts`.

## 3. Fitur Utama

| Modul | Deskripsi |
|-------|-----------|
| **Landing Page** | Hero dengan branding Gatchu Coffee, highlight menu signature, CTA pre-order, testimoni pelanggan. |
| **Menu & Produk** | Daftar menu kopi & non-kopi dengan kategori (Kopi Susu Gatchu, Premium Coffee), filter, ukuran (Reguler, Large, 1 Liter), dan detail produk (harga, deskripsi, gambar). |
| **Pre-Order / Keranjang** | Pengunjung dapat memilih produk, atur jumlah, isi data pemesan (nama, no. WA, alamat/pickup), lalu kirim pesanan ke dashboard admin. |
| **Cerita Brand (About)** | Sejarah Gatchu Coffee, visi misi, tim barista, dan lokasi outlet. |
| **Blog / Journal** | Artikel seputar kopi, tips brewing, event, dan promo. Dilengkapi tag & pencarian. |
| **Galeri** | Foto outlet, produk, dan suasana kedai (via Supabase Storage). |
| **Kontak & Reservasi** | Form kontak & reservasi meja dengan penyimpanan ke database + notifikasi. |
| **Dashboard Admin** | Login Supabase Auth, CRUD menu, CRUD artikel, kelola pesanan (status: pending, diproses, selesai), kelola pesan kontak, kelola profil brand & galeri. |
| **Keamanan** | Supabase Auth (JWT), middleware Next.js untuk proteksi rute admin, Row Level Security (RLS). |
| **Integrasi Tambahan** | Google Maps embed untuk lokasi, WhatsApp link untuk konfirmasi pesanan, integrasi Instagram feed (opsional). |

## 4. Teknologi
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion.
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions).
- **State & Data Fetching**: React Query / SWR, Zustand untuk keranjang.
- **Form & Validasi**: React Hook Form + Zod.
- **Deployment**: Vercel + Supabase Cloud.
- **Lainnya**: ESLint, Prettier, Husky, GitHub Actions (CI).

## 5. Arsitektur Data (Tabel Supabase)

```sql
-- Profil brand (hanya 1 baris)
brand_profile (
  id uuid primary key,
  name text,
  tagline text,
  description text,
  logo_url text,
  address text,
  maps_url text,
  social_links jsonb,
  updated_at timestamp
)

-- Kategori menu
categories (
  id uuid primary key,
  name text,
  slug text unique,
  sort_order int
)

-- Menu / produk
products (
  id uuid primary key,
  category_id uuid references categories(id),
  name text,
  slug text unique,
  description text,
  price numeric,
  image_url text,
  is_available boolean default true,
  is_signature boolean default false,
  created_at timestamp,
  updated_at timestamp
)

-- Pesanan
orders (
  id uuid primary key,
  customer_name text,
  customer_phone text,
  order_type text, -- 'pickup' | 'delivery'
  address text,
  notes text,
  total numeric,
  status text default 'pending', -- pending | process | done | cancelled
  created_at timestamp
)

-- Item pesanan
order_items (
  id uuid primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text,
  price numeric,
  qty int,
  subtotal numeric
)

-- Artikel blog
posts (
  id uuid primary key,
  title text,
  slug text unique,
  excerpt text,
  content text,
  cover_image text,
  tags text[],
  published boolean default false,
  author_id uuid,
  created_at timestamp,
  updated_at timestamp
)

-- Galeri
gallery (
  id uuid primary key,
  image_url text,
  caption text,
  created_at timestamp
)

-- Pesan kontak / reservasi
messages (
  id uuid primary key,
  name text,
  email text,
  phone text,
  subject text,
  message text,
  type text, -- 'contact' | 'reservation'
  read boolean default false,
  created_at timestamp
)