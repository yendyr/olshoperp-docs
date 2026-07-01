---
doc_type: knowledge-base
menu: supplychain-bundle-stock-report
menu_name: "Bundle Stock Report"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Bundle Stock Report — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Bundle Stock Report?

Menu **Bundle Stock** (sidebar: *Bundle Stock*) menampilkan daftar **produk header bundle** (BOM parent) beserta stok yang dapat dirakit dari komponen anak. Setiap baris menunjukkan SKU bundle, ketersediaan fisik (**Availability**), dan ketersediaan jual (**ATS Qty**). Menu ini read-only — tidak ada aksi create/edit/delete di datalist.

| Atribut | Nilai |
|---------|-------|
| Route UI | `/supplychain/bundle-stock-report` |
| API datalist | `GET supplychain/bundle-stock-report` |
| Permission entity | `BundleStockReport` (extends `ItemStock`) |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Bundle / BOM header | Produk dengan Bill of Material; `header_product_bom_id` null, `is_bom = 0` |
| Komponen BOM | Produk anak di BOM; dipakai untuk hitung qty bundle |
| Availability (Avl. Qty) | Qty bundle yang bisa dirakit dari `available_quantity` komponen (minimum `avail_stock / bom_qty`) |
| ATS Qty | Available to Sell — qty bundle dari ATS komponen (`getATS`) |
| Filter Product | Select2 opsional: tampilkan hanya header bundle yang memuat SKU komponen tertentu |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- Lihat daftar produk bundle per company (scoped token)
- Filter berdasarkan komponen produk (multiselect SKU)
- Sort/search kolom SKU, nama, unit, update at
- Klik SKU → buka halaman edit produk (`/supplychain/product/edit/{id}`) di tab baru
- Lihat tooltip definisi kolom Availability dan ATS Qty

### Tidak Bisa

- Create / edit / delete bundle dari menu ini
- Pilih warehouse (tidak ada filter warehouse di implementasi aktif controller)
- Export Excel dari halaman ini (tidak ada export di FE aktif)
- Lihat detail sertifikat / interchange (route API terdaftar tetapi controller tidak mengimplementasikan method tersebut)

## 4. Cara Pakai (How-To)

### Skenario: Cek stok bundle yang bisa dirakit

1. Buka **SCM → Report → Bundle Stock**.
2. (Opsional) Pilih produk komponen di filter **Choose Product** — datalist hanya menampilkan header bundle yang BOM-nya memuat komponen tersebut.
3. Baca kolom **Availability** (stok fisik komponen) dan **ATS Qty** (stok siap jual; kolom tersembunyi default di FE).
4. Klik SKU untuk membuka master produk jika perlu cek BOM detail.

### Skenario: Cari bundle berdasarkan komponen

1. Ketik SKU/nama di filter Product.
2. Pilih entri `SKU | Name`.
3. Tabel refresh otomatis (`product_id` query param).

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Daftar kosong | Tidak ada produk dengan BOM header valid | Pastikan produk punya BOM (`is_bom=0`, parent null) |
| Availability = 0 | Komponen tidak punya `available_quantity` | Cek Stock Monitoring / inbound komponen |
| ATS berbeda dari Availability | ATS memakai logika booked/reserved Omni | Normal — ATS lebih ketat untuk penjualan |
| Filter product tidak mengubah data | `product_id` tidak terkirim | Pastikan memilih dari dropdown, bukan hanya mengetik |
| 403 Forbidden | Role tanpa `viewAny` BundleStockReport | Minta admin Gate role |

## 6. FAQ

**Q: Apa beda Bundle Stock Report dengan Stock Monitoring?**  
A: Bundle Stock menghitung **kapasitas rakit bundle** dari BOM komponen (per produk header). Stock Monitoring menampilkan **item stock per warehouse** dengan qty inbound/transfer/used/reserved.

**Q: Kenapa ATS Qty tidak terlihat?**  
A: Kolom `ats_quantity_formatted` diset `visible: false` di `BundleStockReportTable.vue`. Bisa diaktifkan lewat column visibility DataTables.

**Q: Apakah menu ini push stok ke marketplace?**  
A: Tidak. Perhitungan BOM dipakai juga di Omni (`ProductController::BomAtsQty`) tetapi menu ini hanya laporan.

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
