---
doc_type: menu-capability
menu: accounting-debit-note
id: SF-DN-04
title: From Purchase Return
aliases: [DN dari purchase return, return deposit, retur billed DN]
scope: menu
summary: >-
  Purchase Return yang billed ke Purchase Invoice membuat Debit Note Open
  dengan baris Return Deposit (bukan Cash/Bank); user tetap Approve manual.
version: 1.0
last_updated: 2026-08-12
status: review
---

# From Purchase Return

## Apa ini

Saat **Purchase Return** ke PI (billed) disetujui / selesai sesuai alur Finance, sistem membuat **Debit Note** status **Open**. Nilai ada di section **Return Deposit** — bukan di Payment Source kas/bank. Kamu tetap harus **Approve** DN sebelum dipakai di Account Payment.

## Kapan dipakai

- Supplier mengembalikan barang yang sudah masuk tagihan PI.
- Ingin potong hutang berikutnya dengan nilai retur, tanpa transfer kas dulu.
- Audit jejak: Trx Ref di DN menunjuk ke kode Purchase Return.

## Cara pakai

1. Selesaikan alur **Purchase Return** billed ke PI (sesuai menu Purchase Return).
2. Buka list **Debit Note** — cari DN baru (status Open, Trx Ref = kode PR).
3. Buka detail → cek **Return Deposit** (read-only); total mengikuti nilai retur.
4. **Approve** DN (Deposit of Purchase Return + Inventory COA harus siap di master).
5. Pakai di [Account Payment](#sf-lingo:SF-DN-03).

## Catatan

- Tidak perlu isi **Payment Source** Cash/Bank untuk jalur ini.
- DN dari PR **tidak** auto-approved (beda dengan sebagian jalur Credit Note dari Sales Return billed).
- Export Excel **With Details** untuk DN PR bisa kosong/tidak lengkap — pakai Without Details jika perlu laporan cepat.
- Supplier / currency / rate mengikuti dokumen asal (PI / PR).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Retur billed Rp 2.000.000 ke PI | Complete/approve alur PR | DN Open Rp 2 jt + Return Deposit |
| DN Open dari PR | Approve | Jurnal terbentuk; DN siap di AP |
| Bayar PI 10 jt | AP: DN 2 jt + kas 8 jt | Hutang potong nilai retur |

## Lihat juga

- [How DN is created](#sf-lingo:SF-DN-01)
- [Use in Account Payment](#sf-lingo:SF-DN-03)
- Purchase Return: [../accounting-purchase-return/](../accounting-purchase-return/)
- Purchase Invoice: [../accounting-supplier-invoice/](../accounting-supplier-invoice/)
