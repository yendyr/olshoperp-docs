---
doc_type: menu-capability
menu: accounting-debit-note
id: SF-DN-03
title: Use in Account Payment
aliases: [pakai debit note, deposit AP, DN sebagai payment source]
scope: menu
summary: >-
  Setelah DN Approved, saldo dipakai sebagai Payment Source Debit Note di
  Account Payment agar klaim supplier memotong hutang PI tanpa/kurangi kas keluar.
version: 1.0
last_updated: 2026-08-12
status: review
---

# Use in Account Payment

## Apa ini

Tujuan utama Debit Note setelah approve: dipilih di **Account Payment** sebagai **Payment Source — Debit Note**, sehingga hutang Purchase Invoice berkurang tanpa harus mengeluarkan kas penuh.

## Kapan dipakai

- Supplier punya DN outstanding dan akan bayar / clear PI.
- Ingin memakai nilai retur billed atau klaim manual.
- Kombinasi kas + DN di satu payment (multi-source).

## Cara pakai

1. Pastikan DN status **Approved** dan masih punya sisa ([Outstanding](#sf-lingo:SF-DN-02)).
2. Buka **Account Payment** → buat/edit pembayaran untuk **supplier yang sama**.
3. Di **Payment Source**, tambah sumber **Debit Note** — pilih DN (currency cocok).
4. Isi amount ≤ sisa Outstanding DN.
5. Alokasi ke PI, pastikan balancing, lalu **Approve** Account Payment.
6. Kembali ke DN → **Paid** naik; **Outstanding** turun.

## Catatan

- DN Draft / Open / Rejected belum bisa dipakai sebagai sumber final di AP.
- Supplier & currency DN harus cocok dengan header Account Payment.
- Tanggal DN harus sebelum tanggal AP (aturan eligibility).
- Boleh gabung Cash/Bank + Debit Note di satu AP — lihat Payment Source di menu Account Payment.
- Downstream menu: Account Payment (`/accounting/supplier-payment`).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| DN Approved outstanding 2 jt, PI 10 jt | AP: DN 2 jt + kas 8 jt → Approve | Outstanding DN → 0; PI lunas |
| DN Outstanding 2 jt, input 3 jt di AP | Simpan source | Ditolak — melebihi sisa DN |
| DN belum Approve | Cari di modal DN AP | Tidak eligible / tidak muncul |

## Lihat juga

- [Total / Paid / Outstanding](#sf-lingo:SF-DN-02)
- [How DN is created](#sf-lingo:SF-DN-01)
- Account Payment: [../accounting-supplier-payment/](../accounting-supplier-payment/)
- Payment Source AP: [../accounting-supplier-payment/capabilities/sf-src-01-payment-source.md](../accounting-supplier-payment/capabilities/sf-src-01-payment-source.md)
