---
doc_type: menu-capability
menu: accounting-supplier-payment
id: SF-PAY-02
title: Partial payment
aliases: [bayar sebagian, cicil hutang PI, remaining outstanding]
scope: menu
summary: >-
  Satu Purchase Invoice boleh dibayar bertahap lewat beberapa Account Payment.
  Qty/amount di draft mengunci sisa; setelah approve, hutang PI berkurang.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Partial payment

## Apa ini

Hutang satu **Purchase Invoice** tidak harus dilunasi sekaligus. Kamu bisa membuat beberapa **Account Payment** sampai outstanding PI habis. Amount di payment yang belum approve **mengunci** sisa (Prepared); setelah approve, amount itu final terbayar (Processed).

## Kapan dipakai

- Supplier ditagih penuh tapi kas hanya cukup sebagian.
- Jadwal bayar bertahap (termin).
- Melanjutkan sisa setelah payment sebelumnya approved.

## Cara pakai

1. Buat payment, isi [Source](#sf-lingo:SF-SRC-01) sesuai dana tersedia.
2. Di Outstanding PI, [**Use**](#sf-lingo:SF-DET-01) dengan **To Be Paid** sebagian.
3. [Balance](#sf-lingo:SF-PAY-01) lalu **Approve**.
4. Buat payment berikutnya dari sisa outstanding sampai lunas (atau sesuai rencana).

## Catatan

- PI yang **Already Prepared** di payment lain tidak bisa dialokasi di sini sampai payment itu dihapus/selesai.
- Partial payment **boleh** digabung dengan multi-source (kas + DN).
- Setelah lunas (`processed` = total PI), PI tidak muncul lagi di outstanding.

## Contoh

| Langkah | Outstanding PI | Payment | Sisa setelah approve |
|---------|----------------|---------|----------------------|
| Awal | 100 jt | — | 100 jt |
| PY-A draft 40 jt | 100 | Prepared 40 | 60 (terkunci untuk user lain) |
| Approve PY-A | 100 | Processed 40 | 60 |
| PY-B 60 jt approve | 100 | Processed 60 | 0 (lunas) |

## Lihat juga

- [Outstanding PI Use](#sf-lingo:SF-DET-01)
- [Strict balancing](#sf-lingo:SF-PAY-01)
- Purchase Invoice Feature Map
