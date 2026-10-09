---
doc_type: user-guide
menu: order-processing-trace
menu_name: "Order Processing Trace"
version: 1.0
last_updated: 2026-10-09
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: "1.1"
owner: QA - Yemima
status: review
---

# Order Processing Trace — Panduan Pengguna

**Menu:** Supply Chain → Report → Order Processing Trace  
**Route:** `/supplychain/order-processing-trace`  
**Status fitur:** TO-BE ([ETM-15713](https://erpintegration.atlassian.net/browse/ETM-15713)) — spesifikasi sudah review; implementasi menyusul.

## Apa itu

Laporan **read-only**: satu baris = satu Sales Order (general + platform). Menampilkan dokumen fulfillment yang sudah dilalui — Skip Wave, Picking, Checking, Packing, Delivery Order, Failed Ship, Outbound — beserta tanggalnya.

**Bukan** Sales Order Report (revenue) dan **bukan** All Sales Order (aksi operasional).

## Cara pakai (setelah live)

1. Buka menu dari Supply Chain → Report.
2. Default filter tanggal = bulan berjalan; sesuaikan Advanced Filter bila perlu.
3. Klik kode order / kode dokumen untuk buka sumber.
4. Export Without Detail = sama seperti grid; Export With Detail = per produk (+ Bundle SKU).

## Tips

- Kolom kosong tampil `-` (belum ada dokumen tahap itu).
- Failed Ship: satu referensi FS per order di grid header.
- Soft-deleted dokumen tidak muncul.

Detail: [knowledge-base.md](./knowledge-base.md) · [requirement.md](./requirement.md)
