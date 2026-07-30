---
doc_type: menu-capability
menu: accounting-supplier-payment
id: SF-PAY-01
title: Strict balancing
aliases: [balancing, total source, total detail, approval failed balance]
scope: menu
summary: >-
  Saat Approve, Total Payment Source harus sama persis dengan Total Payment Detail
  (setelah adjustment). Kalau tidak balance, Approve ditolak.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Strict balancing

## Apa ini

Aturan wajib sebelum **Approve**: jumlah uang di **Payment Source** (kas/bank + Debit Note) harus **sama** dengan total yang dialokasi ke PI di **Detail Payment** (setelah memperhitungkan **Adjustment**).

## Kapan dipakai

- Setiap kali mau Approve payment.
- Saat troubleshooting error *Total Payment Source must be equal to Total Payment Detail*.

## Cara pakai

1. Jumlahkan semua amount di [Payment Source](#sf-lingo:SF-SRC-01) → **Total Source**.
2. Jumlahkan alokasi PI di Detail (± efek [Adjustment](#sf-lingo:SF-ADJ-01)) → **Total Detail**.
3. Samakan keduanya (koreksi amount source, To Be Paid, atau adjustment).
4. Pastikan ada minimal 1 baris detail PI **dan** minimal satu source (fund atau DN).
5. Status **Open** → **Save All** → **Approve**.

## Catatan

- Status masih **Draft** → set **Open** dulu; balancing dicek saat Approve.
- Selisih kecil dari konversi/full clearing bisa muncul sebagai **Cash Diff** di grid — tetap ikuti total yang ditampilkan sistem.
- Jangan Approve jika belum yakin: **Void setelah approve belum tersedia**.

## Contoh

| Source | Detail PI | Adjustment | Approve? |
|--------|-----------|------------|----------|
| Kas 10 jt | 10 jt | — | Ya |
| Kas 10 jt | 9 jt | — | Tidak — beda 1 jt |
| Kas 10 jt | 11 jt | Credit adj 1 jt (mengurangi detail) | Ya jika grand total jadi 10 jt |

## Lihat juga

- [Payment Source](#sf-lingo:SF-SRC-01)
- [Outstanding PI Use](#sf-lingo:SF-DET-01)
- [Adjustment](#sf-lingo:SF-ADJ-01)
