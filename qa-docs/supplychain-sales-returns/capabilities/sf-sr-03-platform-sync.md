---
doc_type: menu-capability
menu: supplychain-sales-returns
id: SF-SR-03
title: Sales Return Platform & Sync
aliases: [platform return, sync marketplace return, return bucket]
scope: menu
summary: >-
  Pill Sales Return Platform menampilkan order marketplace refund/cancelled.
  Sync menarik status retur terbaru dari marketplace sebelum diproses.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Sales Return Platform & Sync

## Apa ini

**Sales Return Platform** adalah daftar order marketplace refund/cancelled yang belum dipakai untuk SR. **Sync** menarik pembaruan retur terbaru dari API marketplace.

## Kapan dipakai

- Memproses retur marketplace tanpa mengetik nomor order manual.
- Daftar return platform belum menampilkan status terbaru.

## Cara pakai

1. Buka pill **Sales Return Platform**.
2. Klik **Sync** bila perlu memperbarui data marketplace.
3. Tunggu proses sync selesai.
4. Pilih order eligible lalu klik **Continue**.
5. Isi qty retur di halaman edit.

## Catatan

- Order tetap harus sudah outbound dan invoiced.
- Order yang sudah memiliki SR tidak muncul sebagai unused.
- Sync yang masih berjalan tidak boleh diduplikasi.
- Platform return sebelum outbound diarahkan ke Failed Ship.

## Lihat juga

- [Scan Order & eligibility](#sf-lingo:SF-SR-01)
- [Save & handoff to Finance](#sf-lingo:SF-SR-05)
