---
doc_type: menu-capability
menu: supplychain-new-purchase-inbound
id: SF-IMP-01
title: Import Excel
aliases: [import GRN, import colli, template inbound]
scope: menu
summary: >-
  Upload Excel untuk menambah banyak baris GRN sekaligus.
  Kolom Colli v2: numbering sama = satu New Colli; kode existing = Existing.
version: 1.1
last_updated: 2026-08-14
status: review
---

# Import Excel

## Apa ini

**Import** mengunggah file Excel agar banyak baris Outstanding PO masuk ke GRN tanpa klik Use satu per satu. Kolom **Colli** (v2) opsional: numbering yang sama di banyak baris = satu New Colli bersama; isi kode yang sudah ada = Existing.

## Kapan dipakai

- Penerimaan banyak SKU / banyak baris.
- Data sudah ada di spreadsheet gudang/purchasing.
- Beberapa SKU masuk satu wadah lewat numbering yang sama di kolom Colli.

## Cara pakai

1. Simpan header GRN (supplier harus cocok dengan PO di file).
2. Buka **Import** → isi template (PO, SKU, Qty, Unit, ± batch/serial/expired).
3. Kolom **Colli**: numbering sama / kode existing / kosong.
4. Upload file.
5. Perbaiki baris yang ditolak lalu upload ulang jika perlu.

## Catatan

| Aturan | Detail |
|--------|--------|
| PO | Harus approved (dan outstanding) |
| SKU | Harus ada di PO tersebut |
| Qty | ≤ sisa outstanding |
| Supplier | Harus cocok dengan header GRN |
| Colli existing | Gudang colli harus sama dengan header |
| Kosong | Baris tanpa colli |

- Jika ada import masih berjalan / proses approve lain, Approve bisa ditolak.

## Contoh

| File | Hasil |
|------|--------|
| Standard: PO + SKU + qty ≤ sisa | Baris masuk keranjang |
| Lima baris numbering `1` | Satu New Colli bersama |
| Dua baris kode `COL-ABC` (gudang sama) | Existing |
| Existing colli gudang lain | Baris ditolak |

## Lihat juga

- [Colli v2](#sf-lingo:SF-INB-01)
- [Bulk Use / Single Use](#sf-lingo:SF-DET-01)
- Knowledge Base: [§6 Import Excel](../knowledge-base.md)
