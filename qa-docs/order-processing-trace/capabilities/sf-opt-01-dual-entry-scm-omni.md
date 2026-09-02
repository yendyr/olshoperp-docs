---
doc_type: menu-capability
menu: order-processing-trace
id: SF-OPT-01
title: Dual entry SCM & Omni
aliases: [dual sidebar, SCM Omni same page, dua pintu report]
scope: menu
summary: >-
  Menu yang sama dibuka dari SupplyChain → Report dan OmniChannel → Report;
  route berbeda, data dan komponen identik.
version: 1.0
last_updated: 2026-09-02
status: draft
---

# Dual entry SCM & Omni

## Apa ini

**Order Processing Trace** muncul di **dua** sidebar:

| Entry | Route |
|-------|-------|
| SupplyChain → Report | `/supplychain/order-processing-trace` |
| OmniChannel → Report | `/omni/order-processing-trace` |

Kedua route menampilkan **halaman yang sama** — satu API, satu grid, filter & export identik.

## Kapan dipakai

- Tim fulfillment SCM membuka dari modul SupplyChain.
- Tim omni/platform membuka dari modul OmniChannel.
- QA regression: pastikan hasil grid sama dari kedua pintu.

## Cara pakai

1. Buka menu dari sidebar modul yang nyaman (SCM atau Omni).
2. Terapkan filter / export seperti biasa.
3. Bookmark route mana pun — data tidak berubah.

## Catatan

- Bukan dua menu terpisah dan bukan duplikasi implementasi.
- Privilege `viewAny` per company tetap berlaku (sama pola report lain).

## Lihat juga

- [Grid 1 baris = 1 Sales Order](#sf-lingo:SF-OPT-02)
- [requirement §2.1](../requirement.md)
