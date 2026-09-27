# Gatchu Coffee

Website portofolio + platform pre-order untuk **Gatchu Coffee**, kedai kopi lokal di Sawahan Timur, Kota Padang.

Dibangun dengan Next.js 14 (App Router), TypeScript, Tailwind CSS, dan Supabase (PostgreSQL + Auth + Storage + RLS).

---

## Fitur

| Modul | Rute | Keterangan |
|-------|------|------------|
| Landing page | `/` | Hero, signature menu, testimoni, journal terbaru, CTA |
| Menu | `/menu`, `/menu/[slug]` | Filter kategori, detail produk, harga R/L/1 Liter |
| Pre-order | `/keranjang`, `/keranjang/selesai` | Keranjang Zustand (persist), checkout Zod + RHF, simpan ke DB |
| Journal | `/blog`, `/blog/[slug]` | Daftar, detail artikel Markdown, filter tag, pencarian |
| Galeri | `/galeri` | Foto outlet dari Supabase Storage |
| Kontak & Reservasi | `/kontak` | Form kontak/reservasi → tabel `messages` |
| About | `/about` | Cerita brand, jam buka, Google Maps embed |
| **Admin** | `/admin` | Login, dashboard, pesanan, menu, artikel, pesan, galeri, profil brand |

## Prasyarat

- Node.js 20+
- Supabase project (gratis cukup)

## Setup lokal

```bash
npm install
cp .env.example .env.local   # lalu isi nilainya
npm run dev
```

Isi `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...   # anon key / publishable key
NOTIFY_SECRET=                                     # opsional, untuk Edge Function
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Pengambilan URL dan key: Supabase → **Project Settings → API**. Pastikan bagian **Data API**
berstatus aktif; kalau dimatikan, seluruh query `.from(...)` akan gagal dengan `PGRST205`.

Tanpa variabel Supabase, situs tetap jalan memakai data fallback lokal (`src/lib/menu-data.ts`),
tetapi admin, blog, galeri, dan penyimpanan pesanan tidak aktif.

## Setup database

Opsi_termasuk lewat `psql` (butuh password database dari **Settings → Database**):

```bash
CONN="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"
psql "$CONN" -v ON_ERROR_STOP=1 -f supabase/schema.sql
psql "$CONN" -v ON_ERROR_STOP=1 -f supabase/seed.sql
```

Atau lewat Supabase → **SQL Editor**, jalankan berurutan:

1. `supabase/schema.sql` — tabel, index, trigger, RLS policy, storage bucket, dan
   fungsi `create_order()` yang menghitung harga pesanan di server.
2. `supabase/seed.sql` — brand profile, kategori, produk, artikel contoh.

`supabase/setup.sql` adalah gabungan keduanya dalam satu file, berguna untuk di-paste
langsung ke SQL Editor.

Skrip bersifat idempotent (`if not exists`, `on conflict`, dan `drop ... if exists`
untuk trigger/policy), jadi aman dijalankan berulang kali. Zhiplah jua agar tidak ada
`ERROR: policy ... already exists`.
Untuk database lama, `schema.sql` sudah membawa kolom baru lewat `alter table ... add column if not exists`
(`products.price_large`, `products.price_liter`, `products.note`).

Cek cepat setelah setup:

```bash
curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/categories?select=slug" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

Yang diharapkan: `200` berisi data. `404 PGRST205` artinya tabel belum ada, `401/403`
berarti RLS menutup akses.

## Membuat akun admin

1. Di Supabase → **Authentication → Users**, buat user baru (email + password).
2. Beri peran admin lewat SQL Editor:

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'admin@gatchucoffee.com';
   ```

3. Login di `/admin/login`. JWT baru hanya berlaku setelah user logout/login ulang.

Peran dibaca oleh fungsi SQL `public.is_admin()` yang mengecek klaim `role`, jadi RLS tetap
mengatur hak akses di level database, bukan hanya di UI.

## Perintah

```bash
npm run dev          # server pengembangan
npm run build        # build produksi
npm run start        # jalankan hasil build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run check        # lint + typecheck
npm run test         # unit test (Vitest)
npm run test:watch   # unit test mode watch
npm run test:e2e     # end-to-end (Playwright, build + start otomatis)
npm run test:all     # check + unit + e2e
```

E2E butuh browser Chromium sekali saja:

```bash
npx playwright install chromium
```

Test E2E yang mengirim pesanan/pesan nyata menulis ke database. Test otomatis bercabang
mengecek hasil `201` (database tersambung) atau pesan fallback (database belum ada),
jadi suite tetap hijau di CI tanpa kredensial Supabase.

## Notifikasi admin (opsional)

Pesanan baru dan pesan kontak bisa mengirim email ke admin lewat Edge Function
`supabase/functions/notify-admin` (pakai Resend). Tanpa konfigurasi ini, alur tetap
berjalan normal dan notifikasi dilewati diam-diam.

```bash
supabase functions deploy notify-admin
supabase secrets set NOTIFY_SECRET=$(openssl rand -hex 32)
supabase secrets set RESEND_API_KEY=re_xxxxxxxx
supabase secrets set ADMIN_EMAIL=admin@gatchucoffee.com
supabase secrets set RESEND_FROM="Gatchu Coffee <notifikasi@domain-anda.com>"
```

Lalu salin `NOTIFY_SECRET` yang sama ke `.env.local` (server Next) dan isi
`NEXT_PUBLIC_SUPABASE_URL`. Domain pengirim harus sudah terverifikasi di Resend;
selama belum, pakai `onboarding@resend.dev` (hanya ke email akun Resend itu).

## Aksesibilitas & SEO

- `skip link` "Lompat ke konten utama" di awal halaman, plus navigasi keyboard penuh.
- `:focus-visible` global memakai ring brand, jadi fokus tidak pernah hilang.
- `prefers-reduced-motion: reduce` mematikan semua animasi dan smooth scroll.
- Animasi masuk memakai CSS murni (`animate-fade-up` / `animate-fade-in` di `globals.css`),
  tanpa Framer Motion, sehingga bundle tetap ringan.
- JSON-LD: `CafeOrCoffeeShop` (root layout), `Product` + `BreadcrumbList` (detail menu),
  `Article` + `BreadcrumbList` (detail artikel).
- Canonical URL, Open Graph, Twitter Card, dan `viewport` terisi di setiap halaman.

## Struktur penting

```
src/
  app/
    layout.tsx            # root layout (html/body, font, metadata)
    (site)/               # route group halaman publik (pakai header + footer)
    admin/
      login/              # login (tanpa proteksi)
      (dashboard)/        # route group terproteksi (butuh session admin)
    api/
      orders/route.ts     # POST pre-order
      messages/route.ts   # POST kontak/reservasi
  components/
    admin/                # komponen dashboard (client)
  lib/
    admin/                # server actions + skema Zod shared
    data/                 # query server (menu, blog, galeri, admin)
    supabase/             # client/server/public/middleware + helper auth
    notify.ts             # pemanggil Edge Function notifikasi
    validation/           # skema Zod untuk payload API
  middleware.ts           # proteksi rute /admin
supabase/
  schema.sql              # tabel, RLS, storage bucket, create_order()
  seed.sql                # data awal
  setup.sql               # schema + seed dalam satu file
  functions/notify-admin/ # Edge Function notifikasi via Resend
tests/
  unit/                   # Vitest
  e2e/                    # Playwright
```

Teks brand (alamat, jam buka, WhatsApp, sosial) ada di dua tempat yang harus dijaga sinkron:

- `src/lib/site-config.ts` — sumber tunggal untuk frontend, dipakai sebagai fallback.
- `supabase/seed.sql` (`brand_profile`) — sumber data yang bisa diedit dari dashboard admin.

## Deployment

### Vercel

1. Push repo ke GitHub, lalu **Import Project** di Vercel.
2. Tambahkan environment variables yang sama dengan `.env.local` (sesuaikan `NEXT_PUBLIC_SITE_URL`).
3. Deploy. Build command default (`npm run build`) sudah cocok.

### Domain kustom

1. Vercel → **Settings → Domains**, tambahkan `gatchucoffee.com`.
2. Arahkan DNS sesuai instruksi Vercel.
3. SSL otomatis terbit begitu DNS tervalidasi.
4. Update `NEXT_PUBLIC_SITE_URL` ke domain final agar sitemap & canonical benar.

### GitHub Actions

`.github/workflows/ci.yml` menjalankan lint, typecheck, dan build pada setiap push/PR ke `main`.

## Catatan operasional

- Gambar produk/artikel/galeri diunggah lewat dashboard ke bucket Storage
  (`product-images`, `post-covers`, `gallery`) dan otomatis dapat URL publik.
- Harga varian disimpan terpisah: `price` (R), `price_large` (L), `price_liter` (1 Liter).
  Kosongkan L/1 Liter bila tidak tersedia.
- **Harga pesanan tidak pernah dipercaya dari browser.** Client hanya mengirim
  `productId`, `size`, dan `qty`. Fungsi SQL `public.create_order()` menghitung
  ulang harga dari tabel `products`, menulis `orders` + `order_items` dalam satu
  transaksi, lalu mengembalikan `total` yang benar-benar tersimpan. Route
  `/api/orders` tidak lagi bisa insert langsung, dan policy anon untuk
  `orders`/`order_items` sengaja dihapus supaya tidak ada jalur lain.
  Efek sampingnya: `order_items.product_id` selalu terisi, dan tidak pernah ada
  order yatim kalau insert detail pesanan gagal.
- Notifikasi email untuk pesanan baru sudah disiapkan lewat Edge Function
  `supabase/functions/notify-admin/index.ts` (Resend), tapi masih dormant sampai
  `NOTIFY_SECRET`, `RESEND_API_KEY`, dan `ADMIN_EMAIL` diisi lalu Edge Function
  di-deploy. Sampai itu terjadi, admin harus membuka `/admin/pesanan` secara berkala.
- Mengubah harga di dashboard langsung berlaku untuk pesanan baru. Pesanan yang
  sudah tersimpan tidak ikut berubah, karena harga disimpan sebagai snapshot di
  `order_items` saat pesanan dibuat.
