---
doc_type: menu-capability
menu: accounting-credit-note
id: SF-CN-03
title: Use in Account Receive
aliases: [pakai credit note, deposit AR, CN sebagai deposit]
scope: menu
summary: >-
  Setelah CN Approved, saldo dipakai sebagai deposit di Account Receive.
  TO-BE ETM-16764: COA deposit di AR = setting by asal CN (bukan selalu
  Customer's Deposit / bukan historis jurnal CN).
version: 1.1
last_updated: 2026-10-26
status: review
---

# Use in Account Receive

## Apa ini

Tujuan utama Credit Note setelah approve: dipilih di **Account Receive** sebagai **deposit / sumber kredit**, sehingga tidak harus mengembalikan uang tunai dulu atau untuk mengurangi piutang berikutnya.

**Akun deposit (TO-BE · [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764)):** saat CN dipakai di AR, sistem **identifikasi asal CN** lalu baca **field setting** — **bukan** menyalin COA dari dokumen/jurnal CN:

| Asal CN | Setting yang dibaca |
|---------|---------------------|
| Sales Return billed | **Deposit of Sales Return** |
| Manual / AR import overpay | **Customer's Deposit** / store `deposit_coa_id` |

Satu AR boleh campur beberapa CN beda asal → baris GL boleh beda akun. Setting diganti setelah CN Approve → ikut **setting saat consume**.

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
- **AS-IS gap:** AR selalu stamp Customer's Deposit / store deposit — termasuk CN dari Sales Return → mismatch GL (GAP-AR-CN-COA / ETM-16764).
- Downstream menu: Account Receive (`/accounting/customer-payment`).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| CN Approved outstanding 5 jt | AR pakai CN 5 jt lalu Approve | Outstanding CN → 0; Paid 5 jt |
| CN dari SR + CN manual di satu AR | Approve AR | **TO-BE:** Debit dua akun deposit berbeda sesuai asal |
| CN Outstanding 5 jt, AR draft lain sudah 3 jt | AR baru isi 3 jt | Bisa ditolak / sisa efektif hanya 2 jt |

## Lihat juga

- [Total / Paid / Outstanding](#sf-lingo:SF-CN-02)
- [How CN is created](#sf-lingo:SF-CN-01)
- Account Receive: [../accounting-customer-payment/](../accounting-customer-payment/)
