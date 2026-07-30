---
doc_type: menu-capability
menu: accounting-supplier-payment
id: SF-DET-01
title: Outstanding PI — Use / Bulk Use / Allocate Full
aliases: [outstanding purchase invoice, allocate full, bulk use PI, to be paid]
scope: menu
summary: >-
  Dari Outstanding Purchase Invoice, alokasikan hutang PI ke payment.
  Use = satu PI dengan To Be Paid bisa sebagian; Bulk Use = banyak PI;
  Allocate Full = lunas outstanding baris itu.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Outstanding PI — Use / Bulk Use / Allocate Full

## Apa ini

Cara mengisi **Detail Payment** dari modal **Outstanding Purchase Invoice**. Kamu memilih PI yang masih punya sisa hutang, lalu menentukan berapa yang **To Be Paid** di payment ini.

## Kapan dipakai

| Cara | Pakai jika |
|------|------------|
| **Use** | Satu PI; qty/amount bisa sebagian |
| **Allocate Full Amount** | Lunasi seluruh outstanding PI tersebut |
| **Bulk Use** | Banyak PI sekaligus tanpa edit modal per baris |

## Cara pakai

1. Pastikan header + [Payment Source](#sf-lingo:SF-SRC-01) sudah ada (atau isi source setelah — yang penting balance sebelum Approve).
2. Buka link / panel **Outstanding Purchase Invoice**.
3. Filter mengikuti supplier header; PI date sebelum tanggal payment; status approved/processed dengan outstanding > 0.
4. Pilih:
   - **Use** — isi **To Be Paid** ≤ outstanding.
   - **Allocate Full** — To Be Paid = outstanding penuh.
   - **Bulk Use** — beberapa PI masuk dengan alokasi default penuh per baris.
5. Cek kolom Paid Amount di Detail; samakan total dengan Source ([Strict balancing](#sf-lingo:SF-PAY-01)).

## Catatan

- Label **Already Prepared** = outstanding terkunci di payment draft/open lain — selesaikan payment itu atau pilih PI lain.
- PI yang sudah ditambahkan tidak bisa ditambah lagi di payment yang sama.
- Due date PI hanya info — tidak memblok pembayaran.
- Setelah ada detail, header terkunci sampai detail/source/adjustment dikosongkan.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| PI outstanding 10 jt | Use To Be Paid 4 jt | Detail 4 jt; sisa PI 6 jt untuk payment lain |
| PI outstanding 10 jt | Allocate Full | Detail 10 jt |
| 3 PI outstanding | Bulk Use | Tiga baris masuk detail |

## Lihat juga

- [Partial payment](#sf-lingo:SF-PAY-02)
- [Strict balancing](#sf-lingo:SF-PAY-01)
- Purchase Invoice: [feature-map.md](../../accounting-supplier-invoice/feature-map.md)
