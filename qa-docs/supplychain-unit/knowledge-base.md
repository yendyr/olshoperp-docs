---
doc_type: knowledge-base
menu: supplychain-unit
menu_name: "Unit"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Unit — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Unit?

**Unit** mendefinisikan satuan ukuran produk (PCS, BOX, KG, dll.) dalam **unit class** tertentu. Setiap class punya **base unit** (`is_base_unit`) dan unit lain dengan **conversion rate** terhadap base (nilai ≤ 1).

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Unit Class** | Kelompok satuan sejenis (mis. quantity, weight) |
| **Base Unit** | Satuan acuan dalam class; `conversion_rate = 1` |
| **Conversion Rate** | Faktor konversi ke base unit (≤ 1) |
| **Default Primary Unit** | Satuan default saat buat produk baru |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Buat unit dengan code, name, unit class, conversion rate
- Set default primary unit (satu per scope company/sistem)
- Edit unit yang belum punya relasi transaksi
- Hapus unit non-base yang belum dipakai produk
- Lihat audit log

### Tidak Bisa
- Hapus **base unit** dari datalist (tombol delete disembunyikan)
- Ubah `conversion_rate` atau `unit_class_id` jika unit sudah punya relasi
- Hapus unit yang dipakai `Product.stock_unit_id` atau `ProductAlternativeUnit`

## 4. Cara Pakai (How-To)

1. **SCM → Master → Unit** → **Create**.
2. Isi Code, Name, pilih **Unit Class**.
3. Isi **Conversion Rate** jika bukan base (harus > 0, ≤ 1).
4. Opsional: **Default Primary Unit**, **Active**, **All Company**.
5. Sistem otomatis menetapkan base unit pertama per class jika belum ada.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| "Conversion rate must be greater than 0" | Rate = 0 | Isi rate valid |
| "Data already have relations" | Unit dipakai produk | Buat unit baru, jangan ubah rate/class |
| Delete tidak muncul | Row adalah base unit | Normal — base unit protected |

## 6. FAQ

**Q: Apa bedanya base unit dan default primary?**
A: Base unit = acuan konversi dalam class; default primary = pilihan awal di form produk.

**Q: Apakah unit GR khusus?**
A: Update unit code `GR` menghapus cache `get_unit_gram`.
