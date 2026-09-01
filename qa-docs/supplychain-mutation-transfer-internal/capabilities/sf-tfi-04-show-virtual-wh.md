---
doc_type: menu-capability
menu: supplychain-mutation-transfer-internal
id: SF-TFI-04
title: Show Virtual WH
aliases: [show virtual, virtual warehouse, TFI otomatis, trx ref]
scope: menu
summary: >-
  Toggle datalist untuk menampilkan Transfer Internal otomatis dari proses order
  (picking, shipping, assembly) yang biasanya disembunyikan.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Show Virtual WH

## Apa ini

Toggle **Show Virtual WH** di datalist Transfer Internal menampilkan dokumen **TFI otomatis** dari proses lain (sales order fulfillment, assembly, failed ship, dll.) — bukan hanya transfer manual gudang.

## Kapan dipakai

- Audit pergerakan stok order di rantai picking → shipping.
- Cari TFI dengan kolom **Trx. Ref** terisi (SO, Work Order, …).
- Investigasi stok virtual warehouse / proses Omni.

## Cara pakai

1. Buka datalist **Transfer Internal** (legacy atau BETA).
2. Aktifkan **Show Virtual WH**.
3. Filter / cari kode atau **Trx. Ref**.
4. Untuk transfer manual harian, toggle **off** — datalist lebih ringkas.

## Catatan

- Default **off** — hanya TFI manual umum (prefix `TFI-`, tanpa proses khusus).
- Beberapa baris pakai prefix lain (`PL-`, `CL-`, …) tergantung tahap fulfillment.
- Edit/approve aturan berbeda untuk TFI auto — jangan dianggap sama dengan input manual.

## Lihat juga

- [Failed Ship](../../supplychain-failed-ship/README.md) · [Assembly](../../supplychain-assembly/README.md)
- [Technical §8](../technical.md)
