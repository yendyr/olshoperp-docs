---
doc_type: menu-capability
menu: order-processing-trace
id: SF-OPT-03
title: Hyperlink Trx & Ref
aliases: [clickable ref, link ke edit SO, link dokumen proses]
scope: menu
summary: >-
  Kode Trx Code dan setiap kode referensi proses dapat diklik menuju halaman
  edit dokumen sumber di menu asalnya.
version: 1.0
last_updated: 2026-09-02
status: draft
---

# Hyperlink Trx & Ref

## Apa ini

Setiap kode yang tampil di grid **Order Processing Trace** yang merujuk dokumen aktif **wajib** bisa diklik:

| Klik | Menuju |
|------|--------|
| **Trx Code** | Edit Sales Order (general atau platform) |
| Skip Wave / Picking / Checking / Packing / DO | Edit dokumen di menu sumber |
| Failed Ship / Outbound | Edit Failed Ship / Outbound |

Menu ini tetap **read-only** — hyperlink hanya navigasi, bukan aksi approve dari sini.

## Kapan dipakai

- Drill-down cepat ke dokumen proses setelah lihat ref di grid.
- QA verifikasi tanggal/ref match dengan dokumen asli.

## Cara pakai

1. Temukan baris order di grid.
2. Klik kode di kolom yang ingin dicek (mis. **Picking Ref**).
3. Tab/route terbuka ke halaman edit menu sumber.
4. Selesai review — kembali ke trace via sidebar SCM atau Omni.

## Catatan

- Dokumen soft-deleted **tidak** muncul sebagai ref aktif.
- Jika kolom `-`, tidak ada link.

## Lihat juga

- [Grid 1 baris = 1 Sales Order](#sf-lingo:SF-OPT-02)
- [requirement §2.2](../requirement.md)
