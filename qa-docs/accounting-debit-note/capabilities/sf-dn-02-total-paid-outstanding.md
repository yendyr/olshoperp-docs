---
doc_type: menu-capability
menu: accounting-debit-note
id: SF-DN-02
title: Total / Paid / Outstanding
aliases: [outstanding debit note, paid DN, remaining DN]
scope: menu
summary: >-
  Membaca angka di list: Total = nilai DN; Paid = sudah dipakai di Account
  Payment approved; Outstanding = Total − Paid (sisa yang masih bisa dipakai).
version: 1.0
last_updated: 2026-08-12
status: review
---

# Total / Paid / Outstanding

## Apa ini

Tiga angka utama di datalist Debit Note untuk melihat berapa nilai DN dan berapa yang sudah / masih bisa dipakai di Account Payment.

## Kapan dipakai

- Cek sisa klaim supplier sebelum membuat Account Payment.
- Audit DN mana yang sudah habis dipakai.
- Troubleshooting saat AP menolak karena melebihi sisa DN.

## Cara pakai

1. Buka list Debit Note.
2. Baca kolom:
   - **Total Amount** — manual: jumlah Payment Source; dari PR: nilai retur (grand total).
   - **Paid** — sudah dipakai di Account Payment yang **sudah di-approve**.
   - **Outstanding** — Total dikurangi Paid (sisa di list).
3. DN **Approved** dengan Outstanding > 0 = masih bisa dipilih di AP.

## Catatan

- Paid hanya naik setelah AP **Approved** — AP draft/open belum menambah Paid di list.
- Outstanding 0 = DN penuh terpakai; tidak bisa dipakai lagi di AP.
- Kalau AP menolak melebihi sisa: turunkan amount DN di Payment Source AP.

## Contoh

| Total | Paid (AP approved) | Outstanding | Arti |
|-------|--------------------|-------------|------|
| 5 jt | 0 | 5 jt | Belum dipakai |
| 5 jt | 2 jt | 3 jt | Sebagian terpakai |
| 5 jt | 5 jt | 0 | Habis di list |

## Lihat juga

- [Use in Account Payment](#sf-lingo:SF-DN-03)
- [How DN is created](#sf-lingo:SF-DN-01)
- Knowledge Base: [knowledge-base.md](../knowledge-base.md)
