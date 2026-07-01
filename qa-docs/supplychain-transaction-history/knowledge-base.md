---
doc_type: knowledge-base
menu: supplychain-transaction-history
menu_name: "BETA - Transaction History"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# BETA - Transaction History — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu BETA - Transaction History?

Menu **BETA - Transaction History** adalah laporan lintas-mutasi yang menggabungkan baris detail dari **inbound**, **outbound**, dan **transfer** menjadi satu datalist kronologis. Operator memfilter berdasarkan **Building** (warehouse level building), **periode tanggal**, dan **tipe transaksi**. Menu berlabel BETA — behavior dan export masih evolusi.

| Atribut | Nilai |
|---------|-------|
| Route UI | `/supplychain/transaction-history` |
| API datalist | `GET supplychain/transaction-history` |
| Permission entity (menu) | `ItemTransactionHistory` — **controller tidak memanggil authorize()** |
| Beda dari Product Transaction History | Menu terpisah (`supplychain/product-transaction-history`) — fokus KPI per produk, pakai `ScmReport` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Building | Warehouse level `config('warehouse.building_level')` — filter origin atau destination |
| Detail union | Query `UNION ALL` inbound + outbound + transfer mutation details |
| Trx. Code | Kode `scm_stock_mutations.code` (IN-, OT-, TFI-, dll.) |
| Trx. Ref | `transaction_reference` (SO, PO, Wave, dll.) atau PO code untuk purchase inbound |
| Type | Label human-readable dari prefix kode (Purchase Inbound, Transfer Internal, dll.) |
| Description | Kolom `new_description_formatted` — deskripsi mutasi atau referensi |
| is_visible | Hanya mutasi `is_visible = 1` masuk laporan |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- Filter multi Building (PrimeVue MultiSelect, data dari `real-stock/select2-warehouse`)
- Filter periode tanggal (range date picker)
- Filter multi Transaction Type (17 tipe di FE)
- Search / advanced filter per kolom
- Klik Trx. Code → buka form edit mutasi terkait
- Klik Trx. Ref → buka dokumen referensi (SO, PO, Wave, dll.)
- Export all async (chunk 1000 baris/file, combine ZIP)

### Tidak Bisa

- Filter per produk dedicated (hanya search kolom Product)
- Lihat Stock Opname di filter type (dikomentari di FE & BE)
- Lihat kolom Quantity default (hidden di FE)
- Andalkan policy `ItemTransactionHistory` di controller (belum di-wire)

## 4. Cara Pakai (How-To)

### Skenario: Audit mutasi warehouse bulan ini

1. Buka **SCM → Report → BETA - Transaction History**.
2. Pilih satu atau lebih **Building**.
3. Set **Select Period** (contoh: 01-06-2026 s/d 30-06-2026).
4. (Opsional) Pilih **Transaction Type** (mis. Transfer Internal + Outbound External).
5. Klik **Apply**.
6. Sort by Date descending (default kolom index 1).

### Skenario: Export data terfilter

1. Set filter yang diinginkan, Apply.
2. Buka slider Export All.
3. Trigger export — tunggu batch jobs selesai.
4. Download dari daftar file export.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Data terlalu banyak / lambat | Union 3 tabel detail tanpa index filter | Persempit periode + building |
| Type "Other Inbound" vs "Purchase Inbound" | IN- dengan/tanpa `supplier_id` | Cek master supplier di mutasi |
| Trx. Ref "-" | Tidak ada `transaction_reference_id` dan bukan PO inbound | Normal untuk mutasi standalone |
| Export gagal "no data" | Filter menghasilkan 0 baris | Longgarkan filter |
| Export URL 404 | FE memanggil `.../export` bukan `.../export-excel` | Known gap — lihat requirement |
| Building tidak match | Warehouse bukan level building | Pilih warehouse level building |

## 6. FAQ

**Q: Beda dengan Dev - Product Transaction History?**  
A: **Transaction History (BETA)** = semua mutasi per baris detail (multi produk). **Product Transaction History** = dashboard KPI + tab PR/PO/mutation **per satu produk** via `ItemTransactionHistoryController` + `ScmReport`.

**Q: Apakah hanya mutasi approved?**  
A: Tidak ada filter approval aktif di query (join approval dikomentari). Semua mutasi `is_visible=1` company aktif tampil.

**Q: Kenapa label BETA?**  
A: Sesuai `menu_text` di seeder Gate — fitur masih dalam tahap uji (export path, auth, opname belum lengkap).

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Product-centric report | [supplychain-product-transaction-history/knowledge-base.md](../supplychain-product-transaction-history/knowledge-base.md) |
