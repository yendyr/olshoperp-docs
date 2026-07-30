---
doc_type: menu-capability
menu: supplychain-sales-returns
id: SF-SR-02
title: Return WH & CCTV Location
aliases: [return warehouse, cctv location, lokasi retur]
scope: menu
summary: >-
  Pilih gudang tujuan retur dan lokasi CCTV sebelum scan. Pilihan disimpan
  untuk sesi berikutnya; Reset mengosongkan keduanya.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Return WH & CCTV Location

## Apa ini

Dua lokasi wajib sebelum scan: **Return WH Location** sebagai tujuan barang layak restock, dan **CCTV Location** sebagai lokasi kamera saat proses retur.

## Kapan dipakai

- Setiap memulai proses Sales Return di gudang.
- Saat operator berpindah gedung, area, atau kamera.

## Cara pakai

1. Pilih **Return WH Location** yang sudah ditandai sebagai Return Location.
2. Pilih **CCTV Location** tempat retur diproses.
3. Scan order.
4. Gunakan **Reset** bila ingin mengosongkan pilihan.

## Catatan

- Gudang yang tersedia harus sesuai Warehouse Setting dan bukan virtual.
- Pilihan disimpan otomatis per user/company untuk sesi berikutnya.
- Broken akan dipindah ke scrap saat Finance Complete; Lost diproses sebagai deduction.

## Lihat juga

- [Scan Order & eligibility](#sf-lingo:SF-SR-01)
- [Restock / Broken / Lost](#sf-lingo:SF-SR-04)
