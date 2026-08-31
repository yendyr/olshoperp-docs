---
doc_type: menu-capability
menu: accounting-customer-invoice
id: SF-SI-04
title: Platform SI limits
aliases: [platform invoice, instant settlement SI, cannot reject platform]
scope: menu
summary: >-
  SI dari Instant Settlement / platform tidak dibuat lewat Create manual.
  Reject dan Delete dari UI normal diblokir; biasanya show-only setelah approved.
version: 1.0
last_updated: 2026-08-31
status: review
---

# Platform SI limits

## Apa ini

Sales Invoice order **platform** biasanya dibuat sistem lewat **Instant Settlement**. Di menu Sales Invoice, dokumen itu sering sudah approved dan **tidak** bisa di-Reject atau dihapus seperti SI General.

## Kapan dipakai

- Mencari SI marketplace di datalist (PLATFORM ORDER / Instant Settlement).
- Saat tombol Reject/Delete tidak muncul atau ditolak pesan platform.
- Memutuskan: koreksi lewat alur settlement / CN / retur — bukan hapus SI platform sembarangan.

## Cara pakai

1. Jangan **Create** manual untuk order platform.
2. Cari SI lewat filter Platform Order / Instant Settlement (kolom settlement default bisa tersembunyi).
3. Gunakan **Show** / **Print** untuk dokumen approved.
4. Pelunasan / alokasi tetap lewat Account Receive sesuai kebijakan.

## Catatan

- Pesan tipikal: tidak bisa rejected/deleted karena from the platform.
- Customer/store pada SI platform biasanya show-only.
- Import Excel juga **menolak** SO platform — hanya General/internal ([Import](#sf-lingo:SF-IMP-01)).

## Contoh

| Situasi | Hasil |
|---------|--------|
| Klik Reject pada SI Instant Settlement | Ditolak / tidak tersedia |
| Create manual untuk order Shopee | Bukan jalur yang benar — pakai settlement |
| SI General Draft | Boleh Edit / Delete / Approve seperti biasa |

## Lihat juga

- [How SI is created](#sf-lingo:SF-SI-01)
- [Import saldo awal](#sf-lingo:SF-IMP-01)
- Feature Map: [feature-map.md](../feature-map.md)
