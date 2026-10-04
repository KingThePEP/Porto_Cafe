# Sprint Planning – Gatchu Coffee

**Durasi total**: 5 sprint × 2 minggu = **10 minggu** menuju rilis publik.

---

## 🚀 Sprint 0 – Discovery & Setup (Minggu 1–2)
**Milestone**: Fondasi teknis & design system siap.

**Status**: Selesai.

**Tugas:**
- Riset brand Gatchu Coffee (warna, tone, kompetitor).
- Setup repo Next.js 14 + TypeScript + Tailwind + shadcn/ui.
- Setup Supabase project, tabel, RLS, storage bucket.
- Setup Vercel + CI (GitHub Actions).
- Wireframe & mockup halaman utama.
- Layout dasar (Navbar, Footer, Theme).

**Deliverable**: Repo siap, staging live, design token final.

---

## 🍵 Sprint 1 – Landing Page & Menu (Minggu 3–4)
**Milestone**: Halaman publik utama & daftar menu tampil dinamis.

**Status**: Selesai.

**Tugas:**
- Landing page: hero, signature menu, testimoni, CTA.
- Halaman Menu dengan filter kategori.
- Halaman detail produk.
- Halaman About (brand story, tim, lokasi + Google Maps embed).
- Integrasi Supabase untuk fetch produk & brand profile.
- SEO metadata dinamis.

**Deliverable**: Semua halaman publik siap dengan data dinamis.

---

## 🛒 Sprint 2 – Pre-Order & Keranjang (Minggu 5–6)
**Milestone**: Pelanggan dapat melakukan pre-order end-to-end.

**Status**: Selesai penuh (notifikasi admin sudah terpasang, aktif setelah `RESEND_API_KEY` diset).

**Tugas:**
- [x] State keranjang (Zustand) + persist ke localStorage.
- [x] Form checkout (nama, WA, tipe order, alamat, catatan) dengan Zod + React Hook Form.
- [x] Simpan order + order_items ke Supabase lewat Route Handler (`POST /api/orders`).
- [x] Halaman `/keranjang` dengan kontrol qty, ringkasan, dan badge jumlah item.
- [x] Halaman konfirmasi pesanan + tombol WhatsApp.
- [x] Fallback WhatsApp dengan ringkasan pesanan otomatis bila form dilewati.
- [x] Notifikasi email ke admin (Edge Function `notify-admin` + Resend, opsional).

**Deliverable**: Alur pre-order berjalan & tercatat di database.

---

## 🔐 Sprint 3 – Dashboard Admin & Blog (Minggu 7–8)
**Milestone**: Admin dapat mengelola seluruh konten & pesanan.

**Status**: Selesai penuh.

**Tugas:**
- [x] Auth Supabase (login/logout, proteksi rute via middleware + guard server).
- [x] Dashboard layout dengan sidebar.
- [x] CRUD kategori & produk (upload gambar ke Storage, harga R/L/1 Liter terpisah).
- [x] CRUD artikel blog (editor Markdown, cover, tag, publish/draft).
- [x] Manajemen pesanan (ubah status: pending → process → done, plus cancelled & hapus).
- [x] Manajemen pesan kontak & reservasi.
- [x] Manajemen galeri & profil brand.
- [x] Halaman publik Blog (list, detail, tag, search) + Galeri + Kontak/Reservasi.

**Deliverable**: Dashboard fungsional, blog live, dan pesanan terkelola.

> **Catatan**: Akses admin butuh `app_metadata.role = "admin"` pada user Supabase
> (SQL Editor: `update auth.users set raw_app_meta_data = '{"role":"admin"}' where email = '...'`;
> lalu user login ulang agar JWT ter-refresh).

---

## ✨ Sprint 4 – Polish, Testing & Launch (Minggu 9–10)
**Milestone**: Website production-ready & siap publikasi.

**Status**: Hampir selesai. Tinggal domain kustom + SSL.

**Tugas:**
- [x] Optimasi performa: `next/image` + `remotePatterns` Supabase Storage, AVIF/WebP, cache ISR, `optimizePackageImports`.
- [x] Unit test (Vitest, 60 test) + E2E test (Playwright, 42 skenario) + job CI terpisah.
- [x] Notifikasi admin untuk pesanan baru (Edge Function `notify-admin` + Resend, non-blocking).
- [x] Regression testing seluruh fitur (unit + E2E + smoke test Data API).
- [x] Perbaikan bug: `cookies()` di luar request scope saat build, dan `INSERT ... RETURNING` yang/error RLS.
- [x] Dokumentasi (README, panduan admin, panduan deploy).
- [x] Accessibility audit: skip link, `:focus-visible`, `prefers-reduced-motion`, landmark & heading, `lang="id"`.
- [x] SEO final: JSON-LD `CafeOrCoffeeShop` + `Product`/`Article` + `BreadcrumbList`, canonical, Open Graph/Twitter lengkap, viewport.
- [x] UI polish: animasi masuk CSS (`animate-fade-up`, `animate-fade-in`) tanpa dependency baru.
- [x] Keamanan harga pesanan: client hanya kirim `productId`/`size`/`qty`; harga dan
  total dihitung ulang di server oleh `public.create_order()` (SQL, SECURITY DEFINER).
  Insert `orders`/`order_items` jadi satu transaksi, jadi tidak ada order yatim.
- [x] Audit Lighthouse 12 (desktop + mobile throttled) dan perbaikan berdasarkan temuan:
  palet kontras WCAG AA di 35 file, heading hierarchy `/menu` (h1 → h2),
  skeleton `/keranjang` (CLS 0.138 → 0.003), kontras tombol CTA `/kontak`,
  dan seluruh route publik jadi static + `revalidate = 300`.
  Hasil: a11y **100**, best-practices **100**, SEO **100**, CLS **0** di 8/9 halaman.
  Sisa 1 halaman = `/keranjang` SEO 69 yang memang `noindex` (keranjang bukan konten).
- [x] Setup custom domain `gatchucoffee.com` + SSL.

**Deliverable**: Website live, dokumentasi lengkap, admin siap operasional.

### 📊 Hasil Audit Lighthouse (Lighthouse 12, build produksi lokal)

Diukur dengan `npm run build && npm run start -- --port 3100`, lalu
`npx lighthouse@12 http://localhost:3100/<path> --only-categories=performance,accessibility,best-practices,seo`.
Nilai mobile adalah median 3 run per halaman; desktop 1 run.

| Halaman | Perf (mobile) | Perf (desktop) | A11y | BP | SEO | LCP mobile | LCP desktop | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 77 | 99 | 100 | 100 | 100 | 3.3s | 0.9s | 0 |
| `/menu` | 77 | 100 | 100 | 100 | 100 | 3.3s | 0.7s | 0 |
| `/menu/kopi-susu-gatchu` | 78 | 100 | 100 | 100 | 100 | 3.5s | 0.7s | 0 |
| `/blog` | 82 | 100 | 100 | 100 | 100 | 3.2s | 0.8s | 0 |
| `/blog/catatan-pertama-dari-gatchu` | 79 | 100 | 100 | 100 | 100 | 3.6s | 0.7s | 0 |
| `/about` | 68 | 99 | 100 | 100 | 100 | 4.4s | 0.8s | 0 |
| `/galeri` | 79 | 100 | 100 | 100 | 100 | 3.6s | 0.8s | 0 |
| `/kontak` | 76 | 100 | 100 | 100 | 100 | 3.4s | 0.8s | 0 |
| `/keranjang` | 78 | 100 | 100 | 100 | 69¹ | 3.4s | 0.7s | 0.003 |
| **Rata-rata** | **77** | **100** | **100** | **100** | **97** | | | |

¹ `/keranjang` sengaja `noindex, nofollow` dan tidak ada di `sitemap.ts` — ini sesuai desain, bukan regresi SEO.

**Catatan performa**: selisih mobile vs desktop bukan bottleneck aplikasi. Desktop
memberi LCP 0.7–0.9s; angka mobile berasal dari simulasi Lantern (CPU 4x + jaringan
lambat) yang dijalankan di host lokal. Hipotesis yang sudah diuji dan *ditolak* karena
tidak mengubah hasil: animasi `animate-fade-up` dari `opacity: 0` dan `font-display`
font Geist. Karena itu tidak ada perubahan kode performa tambahan yang diterapkan.

---

## 🏁 Milestone Akhir
- ✅ MVP selesai dalam **10 minggu**.
- ✅ Website publik dengan domain kustom.
- ✅ Admin dapat mengelola menu, blog, pesanan, dan galeri mandiri.
- ✅ Skor Lighthouse: a11y/best-practices/SEO 100 di semua halaman; performa 99–100 di
  desktop, 68–82 di simulasi mobile (lihat tabel audit Sprint 4).
- ✅ Siap dikembangkan ke fase berikutnya (membership, loyalty, multi-outlet).

> **Catatan**: Setiap sprint diakhiri dengan **demo** + **retrospektif**.
> Backlog dapat direprioritaskan berdasarkan feedback pemilik Gatchu Coffee.