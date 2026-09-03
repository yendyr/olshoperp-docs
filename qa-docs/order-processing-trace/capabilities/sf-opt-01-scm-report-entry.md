---
doc_type: menu-capability
menu: order-processing-trace
id: SF-OPT-01
title: Entry SCM Report
aliases: [SCM sidebar, SupplyChain Report entry, navigasi OPT]
scope: menu
summary: >-
  Order Processing Trace hanya muncul di SupplyChain → Report;
  route tunggal `/supplychain/order-processing-trace`. Data tetap general + platform.
version: 1.1
last_updated: 2026-09-03
status: draft
---

# Entry SCM Report

## Apa ini

**Order Processing Trace** hanya masuk sidebar **SupplyChain → Report**.

| Entry | Route |
|-------|-------|
| SupplyChain → Report | `/supplychain/order-processing-trace` |

**Tidak** ada entry / alias route di OmniChannel. Satu komponen Vue + satu API di modul SCM.

Data grid tetap mencakup Sales Order **general + platform** (placement modul ≠ filter data).

## Kapan dipakai

- Tim fulfillment / warehouse / support membuka laporan dari modul SupplyChain.
- Bookmark / deep-link hanya path SCM di atas.

## Cara pakai

1. Buka **SupplyChain → Report → Order Processing Trace**.
2. Terapkan filter / export seperti biasa.
3. Order platform tetap muncul di grid yang sama — tidak perlu menu Omni terpisah.

## Catatan

- Keputusan 2026-09-03: dual entry Omni dibatalkan (sebelumnya SF-OPT-01 dual SCM & Omni).
- Privilege `viewAny` per company tetap berlaku (pola report SCM lain).

## Lihat juga

- [Grid 1 baris = 1 Sales Order](#sf-lingo:SF-OPT-02)
- [requirement §2.1](../requirement.md)
