---
doc_type: menu-capability
menu: accounting-debit-note
id: SF-DN-01
title: How DN is created
aliases: [asal debit note, manual DN, auto DN, purchase return DN, AP import DN]
scope: menu
summary: >-
  Debit Note bisa dibuat manual, otomatis dari Purchase Return billed, atau
  dari Import Account Payment Adjustment DEBIT NOTE — status awal Open; approve manual.
version: 1.0
last_updated: 2026-08-12
status: review
---

# How DN is created

## Apa ini

Debit Note (DN) bisa muncul dari beberapa jalur. Yang sama di semua jalur: status awal biasanya **Open** dan kamu masih perlu **Approve** sendiri sebelum bisa dipakai di Account Payment.

## Kapan dipakai

| Jalur | Hasil status | Kapan |
|-------|--------------|--------|
| **Manual** di menu ini | **Open** — approve sendiri | Klaim/deposit supplier tanpa dokumen retur |
| **Purchase Return** billed | **Open** — approve sendiri | Retur ke PI yang sudah ditagih |
| **Import Account Payment** — Adjustment `DEBIT NOTE` | **Open** — approve sendiri | Massal dari file import AP |

## Cara pakai

1. Tentukan jalur: manual, selesaikan Purchase Return billed, atau import AP dengan Adjustment DEBIT NOTE.
2. Manual: **Create** → isi header → [Payment Source](#sf-lingo:SF-DET-01) → **Open** → **Approve**.
3. Dari retur: lihat [From Purchase Return](#sf-lingo:SF-DN-04).
4. Dari import AP: proses import di Account Payment → cek list DN (Trx Ref ke AP).
5. Pakai saldo di [Account Payment](#sf-lingo:SF-DN-03).

## Catatan

- Supplier DN = **General Company** yang recognize as supplier — bukan toko marketplace.
- Create bisa **auto-save** dari DN terakhir lalu redirect ke edit; kalau gagal (mis. fiscal period), tetap di create + pesan error.
- Trx Ref terisi untuk jalur PR / import AP; manual biasanya kosong atau Reference Doc bebas.
- Tidak seperti Credit Note dari Sales Return billed: DN dari PR **tidak** auto-approved.

## Contoh

| Situasi | Jalur | Yang kamu lihat |
|---------|-------|-----------------|
| Klaim supplier tanpa retur | Manual | DN Open → isi Payment Source → Approve |
| Retur barang ke PI | Purchase Return billed | DN Open + Return Deposit + Trx Ref PR |
| Import AP baris Adjustment DEBIT NOTE | Import AP | DN Open + fund + Trx Ref AP |

## Lihat juga

- [Payment Source — Cash/Bank](#sf-lingo:SF-DET-01)
- [From Purchase Return](#sf-lingo:SF-DN-04)
- [Use in Account Payment](#sf-lingo:SF-DN-03)
- Credit Note (mirror AR): [../accounting-credit-note/](../accounting-credit-note/)
