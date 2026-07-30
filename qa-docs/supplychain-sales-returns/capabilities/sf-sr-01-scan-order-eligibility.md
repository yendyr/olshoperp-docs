---
doc_type: menu-capability
menu: supplychain-sales-returns
id: SF-SR-01
title: Scan Order & eligibility
aliases: [scan sales return, eligible return, failed ship vs return]
scope: menu
summary: >-
  Scan SO internal atau platform order untuk membuat retur. Order harus sudah
  outbound dan invoiced, IDR, tanpa payment atau retur lain yang masih pending.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Scan Order & eligibility

## Apa ini

Langkah awal membuat Sales Return: scan/ketik nomor SO internal atau platform order ID. Sistem mengecek apakah order sudah layak masuk jalur retur.

## Kapan dipakai

- Barang sudah keluar (**Outbound Approved**) dan Sales Invoice sudah terbit.
- Customer mengembalikan barang setelah settlement.
- Jika belum outbound/invoice, gunakan **Failed Ship**.

## Cara pakai

1. Pilih [Return WH & CCTV Location](#sf-lingo:SF-SR-02).
2. Scan atau ketik nomor SO / platform order ID.
3. Sistem memvalidasi invoice, outbound, mata uang, payment, dan retur pending.
4. Jika valid, sistem membuka halaman edit SR.

## Catatan

- Hanya transaksi **IDR**; foreign currency diarahkan ke manual settlement.
- Payment invoice yang masih pending harus diselesaikan dulu.
- Jika sudah ada SR open, sistem mengarahkan ke dokumen tersebut.
- Saat ini satu SR dibuat dari **satu order per scan**.

## Contoh

| Kondisi | Hasil |
|---------|-------|
| Outbound + invoice selesai, IDR | Bisa buat SR |
| Belum outbound | Pesan untuk memakai Failed Ship |
| SR open sudah ada | Lanjut ke SR yang ada |

## Lihat juga

- [Return WH & CCTV Location](#sf-lingo:SF-SR-02)
- [Save & handoff to Finance](#sf-lingo:SF-SR-05)
