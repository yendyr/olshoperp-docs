---
doc_type: menu-capability
menu: supplychain-new-purchase-inbound
id: SF-IMP-01
title: Import Excel
aliases: [import GRN, import colli, template inbound]
scope: menu
summary: >-
  Upload Excel untuk menambah banyak baris GRN sekaligus.
  Ada template standard dan template COLLI (qty = koli × isi).
version: 1.0
last_updated: 2026-07-28
status: draft
---

# Import Excel

## Apa ini

**Import** mengunggah file Excel agar banyak baris Outstanding PO masuk ke GRN tanpa klik Use satu per satu. Ada dua jalur template: **standard** dan **colli**.

## Kapan dipakai

- Penerimaan banyak SKU / banyak baris.
- Data sudah ada di spreadsheet gudang/purchasing.
- Penerimaan berbasis koli → pakai **template colli**.

## Cara pakai

1. Simpan header GRN (supplier harus cocok dengan PO di file).
2. Buka **Import** → pilih template **standard** atau **colli**.
3. Isi sesuai kolom template (PO, SKU, Qty, Unit, ± batch/serial/expired; colli: koli × isi).
4. Upload file.
5. Perbaiki baris yang ditolak lalu upload ulang jika perlu.

## Catatan

| Aturan | Detail |
|--------|--------|
| PO | Harus approved (dan outstanding) |
| SKU | Harus ada di PO tersebut |
| Qty | ≤ sisa outstanding |
| Supplier | Harus cocok dengan header GRN |
| Colli template | Qty mengikuti koli × isi |

- Jangan campur asumsi template standard vs colli.
- Jika ada import masih berjalan / proses approve lain, Approve bisa ditolak.

## Contoh

| File | Hasil |
|------|--------|
| Standard: PO + SKU + qty ≤ sisa | Baris masuk keranjang |
| Colli: 5 koli × 20 | Qty 100 jika sisa mencukupi |
| SKU tidak di PO | Baris/file ditolak sesuai validasi |

## Lihat juga

- [COLLI / Group view](#sf-lingo:SF-INB-01)
- [Bulk Use / Single Use](#sf-lingo:SF-DET-01)
- Knowledge Base: [§6 Import Excel](../knowledge-base.md)
