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
- [x] Unit test (Vitest, 53 test) + E2E test (Playwright, 30 skenario) + job CI terpisah.
- [x] Notifikasi admin untuk pesanan baru (Edge Function `notify-admin` + Resend, non-blocking).
- [x] Regression testing seluruh fitur (unit + E2E + smoke test Data API).
- [x] Perbaikan bug: `cookies()` di luar request scope saat build, dan `INSERT ... RETURNING` yang/error RLS.
- [x] Dokumentasi (README, panduan admin, panduan deploy).
- [x] Accessibility audit: skip link, `:focus-visible`, `prefers-reduced-motion`, landmark & heading, `lang="id"`.
- [x] SEO final: JSON-LD `CafeOrCoffeeShop` + `Product`/`Article` + `BreadcrumbList`, canonical, Open Graph/Twitter lengkap, viewport.
- [x] UI polish: animasi masuk CSS (`animate-fade-up`, `animate-fade-in`) tanpa dependency baru.
- [ ] Setup custom domain `gatchucoffee.com` + SSL.

**Deliverable**: Website live, dokumentasi lengkap, admin siap operasional.

---

## 🏁 Milestone Akhir
- ✅ MVP selesai dalam **10 minggu**.
- ✅ Website publik dengan domain kustom.
- ✅ Admin dapat mengelola menu, blog, pesanan, dan galeri mandiri.
- ✅ Skor Lighthouse ≥ 90 di semua kategori.
- ✅ Siap dikembangkan ke fase berikutnya (membership, loyalty, multi-outlet).

> **Catatan**: Setiap sprint diakhiri dengan **demo** + **retrospektif**.
> Backlog dapat direprioritaskan berdasarkan feedback pemilik Gatchu Coffee.