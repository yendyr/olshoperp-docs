---
doc_type: menu-capability
menu: accounting-credit-note
id: SF-CN-01
title: How CN is created
aliases: [asal credit note, manual CN, auto CN, sales return billed]
scope: menu
summary: >-
  Credit Note bisa dibuat manual, diimpor, otomatis dari Sales Return Billed,
  atau terkait kelebihan bayar Account Receive — status awal berbeda per jalur.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# How CN is created

## Apa ini

Credit Note (CN) bisa muncul dari beberapa jalur. Yang berbeda: apakah kamu harus **Approve** sendiri, dan apakah **Trx Ref** terisi ke dokumen asal.

## Kapan dipakai

| Jalur | Hasil status | Kapan |
|-------|--------------|--------|
| **Manual** di menu ini | **Open** — approve sendiri | Catat kredit/deposit customer |
| **Import** Excel/CSV | **Open** — approve sendiri | Massal customer General |
| **Sales Return Billed** (Finance Complete) | Langsung **Approved** + jurnal | Retur untuk invoice yang sudah pernah dibayar |
| Kelebihan bayar / import Account Receive | Mengikuti proses AR | Overpayment yang menghasilkan CN |

## Cara pakai

1. Tentukan jalur: manual, import, atau selesaikan Sales Return **Billed**.
2. Manual: Create → isi header → [Receiving Destination](#sf-lingo:SF-DET-01) → Approve.
3. Import: lihat [Import Credit Note](#sf-lingo:SF-IMP-01).
4. Dari retur: Complete return billed di Sales Return Approval → cek list CN (biasanya sudah Approved + Trx Ref).
5. Pakai saldo di [Account Receive](#sf-lingo:SF-CN-03).

## Catatan

- Return **Unbilled** (invoice belum dibayar) **tidak** membuat CN — itu jalur jurnal sales/AR lain.
- CN dari retur billed sering tidak perlu approve manual.
- Trx Ref kosong = biasanya dibuat manual tanpa dokumen asal.

## Contoh

| Situasi | Jalur | Yang kamu lihat |
|---------|-------|-----------------|
| Kompensasi customer tanpa retur | Manual | CN Open → Approve |
| 20 CN customer General | Import | Banyak CN Open |
| Retur setelah invoice lunas | Sales Return Billed | CN Approved otomatis |

## Lihat juga

- [Receiving Destination](#sf-lingo:SF-DET-01)
- [Use in Account Receive](#sf-lingo:SF-CN-03)
- Sales Return Approval: [../accounting-sales-return/](../accounting-sales-return/)
