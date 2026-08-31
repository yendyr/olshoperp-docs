---
doc_type: menu-capability
menu: accounting-customer-invoice
id: SF-SI-01
title: How SI is created
aliases: [asal sales invoice, manual SI, instant settlement SI, create SI]
scope: menu
summary: >-
  Sales Invoice dibuat manual dari Sales Order General, atau otomatis dari
  Instant Settlement (platform). Manual biasanya Draft dulu — set Open sebelum Approve.
version: 1.0
last_updated: 2026-08-31
status: review
---

# How SI is created

## Apa ini

Sales Invoice (SI) bisa muncul dari **dua jalur utama**: create manual di menu ini (customer General + SO General), atau otomatis dari **Instant Settlement** untuk order platform.

## Kapan dipakai

| Jalur | Hasil tipikal | Kapan |
|-------|---------------|--------|
| **Manual** Create | **Draft** → set **Open** → Approve | Tagih SO General/internal |
| **Instant Settlement** | Sering **Approved** + show-only | Order marketplace sudah settle |

## Cara pakai

1. Manual: **Create** → cek customer/tanggal/kurs (sering auto dari SI terakhir) → simpan.
2. Jika status **Draft**, pilih **Open** + Save sebelum Approve.
3. Tambah barang lewat [Outstanding SO Use](#sf-lingo:SF-DET-01).
4. Opsional [Other Cost / Discount](#sf-lingo:SF-SI-02) → **Approve**.
5. Platform: jangan create manual — cek SI dari Instant Settlement ([batas platform](#sf-lingo:SF-SI-04)).

## Catatan

- Create manual hanya untuk **customer General** dengan SO outstanding — bukan store platform.
- Setelah Approve: jurnal AR + penjualan, lalu outstanding di Account Receive.
- Import saldo awal = jalur lain → [Import](#sf-lingo:SF-IMP-01).

## Contoh

| Situasi | Jalur | Yang kamu lihat |
|---------|-------|-----------------|
| Tagih SO General | Manual | SI Draft/Open → isi detail → Approve |
| Order Shopee settle | Instant Settlement | SI sudah ada; sering tidak bisa Reject/Delete |

## Lihat juga

- [Outstanding SO Use](#sf-lingo:SF-DET-01)
- [Platform SI limits](#sf-lingo:SF-SI-04)
- [Import saldo awal](#sf-lingo:SF-IMP-01)
