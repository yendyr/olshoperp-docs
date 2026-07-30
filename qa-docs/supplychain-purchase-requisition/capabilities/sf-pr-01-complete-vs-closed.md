---
doc_type: menu-capability
menu: supplychain-purchase-requisition
id: SF-PR-01
title: Complete vs Closed
aliases: [complete PR, closed PR, tutup PR]
scope: menu
summary: >-
  Dua cara PR selesai: Complete otomatis jika semua qty sudah ke PO approved,
  atau Closed manual dari Processed jika sisa tidak dilanjutkan.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Complete vs Closed

## Apa ini

Setelah PR masuk ke Purchase Order, PR bisa **selesai** dengan dua jalur. Keduanya membuat PR **tidak muncul lagi** di outstanding PO dan menjadi read-only.

## Kapan dipakai

| Jalur | Pakai jika |
|-------|------------|
| **Complete** (otomatis) | Semua qty PR sudah terpenuhi di PO yang **approved** |
| **Closed** (manual) | PR sudah **Processed**, tapi sisa qty **tidak** akan dilanjutkan ke PO |

## Cara pakai

1. Approve PR → buat [PO With PR](#sf-lingo:SF-PR-03) dari outstanding.
2. Saat qty masuk PO → PR biasanya **Processed**.
3. Jika semua qty ke PO approved → status jadi **Complete** (otomatis).
4. Jika stop sisa: dari datalist, klik **Closed** saat status **Processed**.
5. **Jangan** andalkan tombol Close di form edit — pakai aksi **Closed di datalist** (form dialog punya known issue).

## Catatan

- Complete vs Closed = sama-sama **selesai**, trigger berbeda.
- Setelah Complete/Closed: tidak bisa diproses ke PO baru.
- Jika PO dihapus/void dan qty kembali 0, PR bisa revert ke **Approved** (perilaku sistem).

## Contoh

| Langkah | Status PR |
|---------|-----------|
| Approved, belum ke PO | Approved |
| Sebagian qty ke PO | Processed |
| Semua qty ke PO approved | **Complete** (auto) |
| Partial ke PO, sisa dihentikan | Klik **Closed** → **Closed** |

## Lihat juga

- [Process to Purchase Order](#sf-lingo:SF-PR-03)
- Purchase Order: [Complete vs Closed](../../supplychain-purchase-order/capabilities/sf-po-02-complete-vs-closed.md)
