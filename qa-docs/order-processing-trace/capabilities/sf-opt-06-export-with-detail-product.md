---
doc_type: menu-capability
menu: order-processing-trace
id: SF-OPT-06
title: Export With Detail (produk)
aliases: [export detail produk, Bundle SKU, Case D partial, product POV export]
scope: menu
summary: >-
  Export Excel per baris produk order: SKU, qty, Bundle SKU, plus ref Failed
  Ship / Outbound per line — termasuk partial qty pada baris yang sama.
version: 1.0
last_updated: 2026-09-02
status: draft
---

# Export With Detail (produk)

## Apa ini

**Export With Detail** memecah order ke **baris produk**:

| Aspek | Rule |
|-------|------|
| Grain | **1 baris = 1 detail line SO** |
| Kolom produk | SKU, Product Name, Qty |
| **Bundle SKU** | Kode bundle induk untuk komponen child; non-bundle = `-` |
| Failed Ship / Outbound | Ref **sama** untuk semua line dalam satu doc; line tanpa qty FS/OB = `-` |

Header order (Trx, tanggal, ref stage) diulang atau di-prefix per baris produk — konsisten mirror Purchase Report export detail.

## Kapan dipakai

- Analisis **per SKU**: qty mana yang sudah outbound vs failed ship.
- Audit bundle: lihat kolom **Bundle SKU** untuk komponen paket.

## Cara pakai

1. Filter grid header seperti kebutuhan (filter ikut ke export).
2. Pilih **Export With Detail**.
3. **Export All** async — unduh file setelah job selesai.
4. Di Excel: filter kolom SKU / Bundle SKU / ref FS atau OB.

## Catatan

- **1 SO = 1 Failed Ship** dan **1 SO = 1 Outbound** — ref header single; di export detail ref FS/OB **sama** untuk line yang kena qty.
- **Partial qty (Case D):** satu baris produk dengan qty sebagian FS dan sebagian OB → kolom **Failed Ship** dan **Outbound** **both filled on same row** (bukan split baris duplikat SKU).

## Contoh (Case D — partial qty)

Order 1 line SKU-A qty 10: 4 qty Failed Ship, 6 qty Outbound.

| SKU | Qty | Failed Ship Ref | Outbound Ref |
|-----|-----|-----------------|--------------|
| SKU-A | 10 | FS-001 | OB-001 |

Kedua ref tampil **pada satu baris** — qty partial dalam doc yang sama.

## Lihat juga

- [Export Without Detail](#sf-lingo:SF-OPT-05)
- [Grid 1 baris = 1 Sales Order](#sf-lingo:SF-OPT-02)
- [requirement §6](../requirement.md)
