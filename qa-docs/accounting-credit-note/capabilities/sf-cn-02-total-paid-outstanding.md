---
doc_type: menu-capability
menu: accounting-credit-note
id: SF-CN-02
title: Total / Paid / Outstanding
aliases: [outstanding credit note, paid CN, remaining CN]
scope: menu
summary: >-
  Membaca angka di list: Total = jumlah fund; Paid = sudah dipakai di Account
  Receive approved; Outstanding = Total − Paid (sisa di list).
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Total / Paid / Outstanding

## Apa ini

Tiga angka utama di datalist Credit Note untuk melihat berapa nilai CN dan berapa yang sudah / masih bisa dipakai.

## Kapan dipakai

- Cek sisa kredit customer sebelum membuat Account Receive.
- Audit CN mana yang sudah habis dipakai.
- Troubleshooting saat AR menolak karena melebihi sisa.

## Cara pakai

1. Buka list Credit Note.
2. Baca kolom:
   - **Total Amount** — jumlah semua baris Receiving Destination.
   - **Paid** — sudah dipakai di Account Receive yang **sudah di-approve**.
   - **Outstanding** — Total dikurangi Paid (sisa di list).
3. Untuk pemakaian aktual di AR, ingat juga AR **draft/open** yang sedang mengalokasikan CN (mengunci sisa meski belum masuk Paid).

## Catatan

- **Remaining** di footer fund ≈ sisa yang masih bisa dialokasikan (memperhitungkan yang sedang dipakai di penerimaan belum final).
- Kalau AR menolak melebihi sisa: turunkan amount atau selesaikan/batalkan alokasi AR lama.
- CN **Approved** dengan Outstanding 0 = sudah penuh terpakai di AR approved.

## Contoh

| Total | Paid (AR approved) | Outstanding | Arti |
|-------|--------------------|-------------|------|
| 10 jt | 0 | 10 jt | Belum dipakai |
| 10 jt | 4 jt | 6 jt | Sebagian terpakai |
| 10 jt | 10 jt | 0 | Habis di list |

## Lihat juga

- [Use in Account Receive](#sf-lingo:SF-CN-03)
- Knowledge Base: [§4 Membaca angka di list](../knowledge-base.md)
