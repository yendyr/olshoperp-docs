---
doc_type: menu-capability
menu: accounting-settlement-upload
id: SF-SETU-08
title: Delete / Revert
aliases: [delete settlement, revert instant settlement, bulk delete settlement]
scope: menu
summary: >-
  Hapus settlement dan dokumen rantai Instant Settlement jika eligible. Blocked jika ada AR luar (Customer Payment di luar IS).
version: 1.0
last_updated: 2026-09-28
status: review
---

# Delete / Revert

## Apa ini

**Delete** menghapus upload settlement beserta dokumen yang digenerate (Outbound, SI, AR dari Approve IS, jurnal) dan merevert stok outbound — **jika eligible**.

## Kapan dipakai

- Batch salah / perlu diulang.
- Revert rantai murni Instant Settlement (termasuk AR dari Approve IS).

## Cara pakai

1. Cek eligibility: tidak ada **AR luar** (pelunasan dari menu Customer Payment independen).
2. **Single:** ikon Delete di Action.
3. **Bulk:** centang hanya baris eligible — jika ada satu tidak eligible, tombol bulk **tidak muncul**.
4. Setelah sukses: stok outbound revert; status gudang (Shipped) **tidak** ikut revert.

## Catatan

| Kondisi | Boleh? |
|---------|--------|
| OB+SI, belum AR | ✅ |
| OB+SI+AR dari Approve IS | ✅ |
| Ada SI dengan AR luar | ❌ |
| Bulk campur eligible + tidak | ❌ tombol hilang |

- Rule Approve disabled (semua SI sudah punya payment) **terpisah** dari rule Delete.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Approve IS selesai, AR = receive settlement | Delete | Rantai termasuk AR settlement terhapus |
| SI dilunasi di Customer Payment luar | Delete | Tidak boleh — reverse AR luar dulu |

## Lihat juga

- [Approve / Bulk Approve](#sf-lingo:SF-SETU-05)
- Requirement: [§9 Delete Settlement](../requirement.md)

