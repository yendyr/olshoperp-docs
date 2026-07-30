---
doc_type: menu-capability
menu: supplychain-purchase-order
id: SF-PO-02
title: Complete vs Closed
aliases: [complete, closed, partial inbound, stop sisa qty]
scope: menu
summary: >-
  Dua cara PO selesai untuk inbound: Complete otomatis jika semua qty diterima,
  atau Closed manual dari status Processed jika sisa tidak dilanjutkan.
version: 1.0
last_updated: 2026-07-28
status: draft
---

# Complete vs Closed

## Apa ini

Setelah PO **approved**, barang diterima lewat Purchase Inbound. PO bisa **selesai** dengan dua jalur: **Complete** (sistem, semua qty sudah diterima) atau **Closed** (manual, sisa qty tidak akan di-inbound lagi).

## Kapan dipakai

| Jalur | Pakai jika |
|-------|------------|
| **Complete** | Supplier sudah kirim semua qty — sistem set otomatis setelah inbound penuh |
| **Closed** | Sudah pernah terima sebagian (**Processed**), tapi sisa **tidak** akan dikirim |

## Cara pakai

1. Approve PO → buat **Purchase Inbound** sesuai barang yang datang.
2. Inbound sebagian → status PO jadi **Processed**.
3. Inbound penuh semua qty → status jadi **Complete** (otomatis).
4. Atau, dari **Processed**, klik ikon **Closed** jika sisa dihentikan.
5. Setelah Complete/Closed: inbound baru untuk sisa qty **ditolak**; header & detail read-only.

## Catatan

- Tombol **Closed** muncul saat status **Processed** — **tidak** muncul dari **Approved** yang belum pernah inbound.
- **Complete** dan **Closed** sama-sama artinya proses inbound untuk sisa sudah selesai; trigger-nya berbeda.
- Void hanya untuk **Approved** tanpa inbound — bukan pengganti Closed.

## Contoh

| Langkah | Qty PO | Inbound | Status PO |
|---------|--------|---------|-----------|
| Approve | 100 | — | Approved |
| Inbound 40 | 100 | 40 | Processed |
| Inbound sisa 60 | 100 | 100 | **Complete** (otomatis) |
| *(alternatif)* Inbound 40 lalu stop | 100 | 40 | Klik **Closed** → **Closed** |

## Lihat juga

- [Void vs Delete](#sf-lingo:SF-PO-03)
- Knowledge Base: [§4 Status](../knowledge-base.md)
- Purchase Inbound: [../supplychain-new-purchase-inbound/](../supplychain-new-purchase-inbound/)
