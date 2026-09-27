
---

## 📄 File 2: `Agents.md`

```markdown
# Agents – Pola Read → Ask → Thinking → Build → Review → Fix

## Tim & Tanggung Jawab

| Agen | Tanggung Jawab |
|------|----------------|
| **Product Owner (PO)** | Menentukan prioritas fitur, menerjemahkan kebutuhan Gatchu Coffee ke user story, memastikan produk sesuai visi brand. |
| **Developer (Dev)** | Implementasi frontend & backend, integrasi Supabase, debugging, dan optimasi performa. |
| **Quality Assurance (QA)** | Menyusun test case, menguji fungsionalitas, dan memastikan tidak ada regresi. |
| **Designer (Opsional)** | Menyiapkan design system, warna brand, tipografi, dan aset visual Gatchu Coffee. |

---

## Siklus Penerapan pada Setiap User Story

### 1. Read
- **PO** membaca user story + acceptance criteria (mis. "Sebagai pelanggan, saya bisa pre-order kopi").
- **Dev** membaca skema database, API Supabase, dan kode existing.
- **QA** membaca dokumen pengujian & kriteria keberhasilan fitur.

### 2. Ask
Semua agen mengajukan pertanyaan klarifikasi:
- **PO**: "Apakah pesanan bisa diubah setelah dikirim? Bagaimana skema diskon?"
- **Dev**: "Apakah stok otomatis berkurang? Bagaimana validasi nomor WA?"
- **QA**: "Bagaimana skenario jika produk habis atau koneksi gagal?"

### 3. Thinking
- **PO** memikirkan dampak fitur terhadap pengalaman pelanggan & brand.
- **Dev** merancang arsitektur: struktur komponen, endpoint Supabase, alur state keranjang.
- **QA** merancang test case: unit, integrasi, E2E (Playwright/Cypress).
- **Designer** menyiapkan mockup UI & design token (warna coklat khas Gatchu).

### 4. Build
- **Dev** membuat branch `feature/xxx`, menulis kode, melakukan commit atomik.
- **PO** update backlog & dokumentasi user flow.
- **QA** menyiapkan environment testing (staging Supabase).
- **Designer** mengekspor aset (SVG, gambar produk).

### 5. Review
- **Dev** melakukan code review (pull request) & memastikan linting bersih.
- **QA** menjalankan test suite, menguji edge case, dan melaporkan bug.
- **PO** meninjau hasil terhadap acceptance criteria & konsistensi brand.

### 6. Fix
- **Dev** memperbaiki bug, refactor jika perlu, dan push perbaikan.
- **QA** verifikasi perbaikan + regression test.
- **PO** memberi approval akhir sebelum merge ke `develop`.

> Siklus diulang untuk setiap user story sampai **Definition of Done** terpenuhi:
> kode ter-merge, lulus test, dan sesuai acceptance criteria.