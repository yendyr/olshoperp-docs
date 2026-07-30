---
doc_type: menu-capability
menu: supplychain-purchase-requisition
id: SF-PR-03
title: Process to Purchase Order
aliases: [with PR, outstanding PR, PR ke PO]
scope: menu
summary: >-
  Setelah PR Approved, procurement membuat Purchase Order tipe With PR
  dan mengambil baris outstanding. Qty ke PO mengubah PR menjadi Processed.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Process to Purchase Order

## Apa ini

Tujuan utama PR setelah di-approve: menjadi sumber baris di **Purchase Order** tipe **With PR**. Baris yang masih punya sisa qty muncul sebagai **outstanding PR** di modal PO.

## Kapan dipakai

- PR sudah **Approved** (atau masih outstanding setelah partial).
- Procurement siap membuat PO ke supplier berdasarkan PR.

## Cara pakai

1. Pastikan PR **Approved** (status **Open** dulu sebelum Approve).
2. Buka **Purchase Order → Create** → pilih **With PR**.
3. Dari **Available Product / Outstanding PR**, ambil baris (Use / Allocate Full / Import sesuai menu PO).
4. Setelah qty masuk PO, PR biasanya **Processed**.
5. Full ke PO approved → PR **Complete**; atau stop sisa → **Closed** di PR ([Complete vs Closed](#sf-lingo:SF-PR-01)).

## Catatan

- PR **Complete** / **Closed** / **Void** tidak muncul di outstanding PO.
- Tanggal PR harus sebelum tanggal PO (aturan PO).
- PR bukan pesanan ke supplier — PO-lah dokumen ke supplier.
- Detail Lingo di sisi PO: [With PR / Without PR](../../supplychain-purchase-order/capabilities/sf-po-01-with-without-pr.md).

## Contoh

| PR | Aksi PO | Status PR setelahnya |
|----|---------|----------------------|
| Approved 100 pcs | PO ambil 40 | Processed |
| Processed sisa 60 | PO ambil 60 + approve | Complete (auto) |
| Processed sisa 60 | User Closed | Closed — sisa tidak ke PO |

## Lihat juga

- [Complete vs Closed](#sf-lingo:SF-PR-01)
- Purchase Order Feature Map: [../../supplychain-purchase-order/feature-map.md](../../supplychain-purchase-order/feature-map.md)
