---
doc_type: menu-capability
menu: supplychain-purchase-order
id: SF-PO-03
title: Void vs Delete
aliases: [void, delete, batalkan PO]
scope: menu
summary: >-
  Batalkan PO yang masih Draft/Open/Rejected dengan Delete.
  Void hanya untuk PO Approved yang belum punya inbound.
version: 1.0
last_updated: 2026-07-28
status: draft
---

# Void vs Delete

## Apa ini

Dua cara menghentikan dokumen Purchase Order yang berbeda status. **Delete** untuk dokumen yang masih bisa diedit. **Void** untuk dokumen yang sudah **Approved** tetapi belum pernah menerima barang.

## Kapan dipakai

| Aksi | Pakai jika |
|------|------------|
| **Delete** | Status **Draft**, **Open**, atau **Rejected** |
| **Void** | Status **Approved** dan **belum** ada Purchase Inbound |

## Cara pakai

1. Cek status PO di datalist atau form.
2. Masih draft/open/rejected → aksi **Delete** (bukan Void).
3. Sudah approved, belum inbound → ikon **Void**.
4. Sudah ada inbound (Prepared/Processed) → **Void gagal**; jika partial, gunakan jalur **Closed** setelah Processed.

## Catatan

- Void **belum** mengembalikan qty ke Purchase Requisition (saat ini). Hapus detail **sebelum** approve akan melepaskan qty yang masih direservasi.
- Setelah reject: Save → biasanya Draft → set **Open** lagi sebelum approve ulang.
- Jangan mengharapkan tombol Void muncul di draft/open.

## Contoh

| Status | Tombol yang benar | Yang terjadi jika salah |
|--------|-------------------|-------------------------|
| Open | **Delete** | Void tidak tersedia / bukan jalur yang benar |
| Approved, 0 inbound | **Void** | — |
| Processed (sudah inbound) | Tidak void — **Closed** jika stop sisa | Void ditolak sistem |

## Lihat juga

- [Complete vs Closed](#sf-lingo:SF-PO-02)
- Knowledge Base: [§6 Tombol & fungsi UI](../knowledge-base.md)
