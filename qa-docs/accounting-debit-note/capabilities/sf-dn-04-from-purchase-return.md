---
doc_type: menu-capability
menu: accounting-debit-note
id: SF-DN-04
title: From Purchase Return
aliases: [DN dari purchase return, return deposit, retur billed DN]
scope: menu
summary: >-
  Purchase Return billed membuat DN Open + Return Deposit; Approve pakai
  Deposit of Purchase Return. TO-BE ETM-16761: saat DN dipakai di AP, COA =
  setting Deposit of Purchase Return (bukan Deposit to Supplier).
version: 1.1
last_updated: 2026-10-26
status: review
---

# From Purchase Return

## Apa ini

Saat **Purchase Return** ke PI (billed) disetujui / selesai sesuai alur Finance, sistem membuat **Debit Note** status **Open**. Nilai ada di section **Return Deposit** — bukan di Payment Source kas/bank. Kamu tetap harus **Approve** DN sebelum dipakai di Account Payment.

**COA:** Approve DN dari PR → **Deposit of Purchase Return**. Saat DN itu dipakai di Account Payment (**TO-BE** [ETM-16761](https://erpintegration.atlassian.net/browse/ETM-16761)), sistem baca lagi **setting** Deposit of Purchase Return by asal PR — **bukan** selalu Deposit to Supplier, **bukan** menyalin COA historis dari jurnal DN.

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
- Master **Deposit of Purchase Return** harus terisi sebelum Approve DN dari PR.
- **AS-IS:** AP yang memakai DN PR masih Credit Deposit to Supplier → gap ETM-16761.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Retur billed Rp 2.000.000 ke PI | Complete/approve alur PR | DN Open Rp 2 jt + Return Deposit |
| DN Open dari PR | Approve | Jurnal Dr Deposit of Purchase Return; DN siap di AP |
| Bayar PI 10 jt pakai DN PR | AP: DN 2 jt + kas 8 jt | **TO-BE:** Credit Deposit of Purchase Return (bukan Deposit to Supplier) |

## Lihat juga

- [How DN is created](#sf-lingo:SF-DN-01)
- [Use in Account Payment](#sf-lingo:SF-DN-03)
- Purchase Return: [../accounting-purchase-return/](../accounting-purchase-return/)
- Purchase Invoice: [../accounting-supplier-invoice/](../accounting-supplier-invoice/)
