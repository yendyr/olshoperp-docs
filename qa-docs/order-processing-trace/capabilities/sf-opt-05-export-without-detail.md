---
doc_type: menu-capability
menu: order-processing-trace
id: SF-OPT-05
title: Export Without Detail
aliases: [export header, mirror grid, export tanpa detail produk]
scope: menu
summary: >-
  Export Excel mirror grid: satu baris = satu Sales Order, kolom sama dengan
  tampilan layar; respect filter aktif.
version: 1.0
last_updated: 2026-09-02
status: draft
---

# Export Without Detail

## Apa ini

**Export Without Detail** mengunduh file Excel yang **sama persis** dengan grid header:

- **1 baris = 1 Sales Order**
- Kolom: Trx, tanggal, Skip Wave, Picking … Outbound (mirror § grid)
- **Export All** (async) + **This Page Only**

Filter, search, dan Advanced Filter yang aktif **ikut** ke file export.

## Kapan dipakai

- Kirim daftar order + ref proses ke tim ops (tanpa pecahan SKU).
- Lampiran QA regression: snapshot header trace per periode.

## Cara pakai

1. Set filter/grid seperti yang ingin diekspor.
2. Pilih **Export Without Detail**.
3. **Export All** untuk seluruh hasil filter · **This Page** untuk halaman aktif saja.
4. Pantau progress / tab Export File — unduh saat selesai.

## Catatan

- Butuh detail per produk / Bundle SKU → pakai [Export With Detail](#sf-lingo:SF-OPT-06).
- Read-only — export tidak mengubah data.

## Lihat juga

- [Export With Detail (produk)](#sf-lingo:SF-OPT-06)
- [Export All / This Page](#sf-lingo:SF-DL-05)
