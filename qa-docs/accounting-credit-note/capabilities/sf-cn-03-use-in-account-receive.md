---
doc_type: menu-capability
menu: accounting-credit-note
id: SF-CN-03
title: Use in Account Receive
aliases: [pakai credit note, deposit AR, CN sebagai deposit]
scope: menu
summary: >-
  Setelah CN Approved, saldo dipakai sebagai sumber deposit di Account Receive
  agar kredit customer mengurangi tagihan/penerimaan berikutnya.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Use in Account Receive

## Apa ini

Tujuan utama Credit Note setelah approve: dipilih di **Account Receive** sebagai **deposit / sumber kredit**, sehingga tidak harus mengembalikan uang tunai dulu atau untuk mengurangi piutang berikutnya.

## Kapan dipakai

- Customer punya CN outstanding dan akan bayar / clear invoice.
- Ingin memakai sisa kredit retur billed.
- Melacak pemakaian di section **Detail Related Transaction** pada CN.

## Cara pakai

1. Pastikan CN status **Approved** dan masih punya sisa ([Outstanding](#sf-lingo:SF-CN-02)).
2. Buka **Account Receive** → buat/edit penerimaan untuk customer yang sama.
3. Pilih Credit Note sebagai sumber deposit (sesuai UI AR).
4. Isi amount ≤ sisa yang masih bisa dialokasi.
5. Balance & Approve Account Receive — **Paid** di CN naik; Outstanding turun.
6. Kembali ke CN → cek **Detail Related Transaction** untuk jejak pemakaian.

## Catatan

- CN Draft/Open belum bisa dipakai sebagai deposit final.
- Amount AR tidak boleh melebihi sisa (termasuk yang sedang di AR draft/open lain).
- Customer / currency harus cocok dengan aturan Account Receive.
- Downstream menu: Account Receive (`/accounting/customer-payment`).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| CN Approved outstanding 5 jt | AR pakai CN 5 jt lalu Approve | Outstanding CN → 0; Paid 5 jt |
| CN Outstanding 5 jt, AR draft lain sudah 3 jt | AR baru isi 3 jt | Bisa ditolak / sisa efektif hanya 2 jt |

## Lihat juga

- [Total / Paid / Outstanding](#sf-lingo:SF-CN-02)
- [How CN is created](#sf-lingo:SF-CN-01)
- Account Receive: [../accounting-customer-payment/](../accounting-customer-payment/)
