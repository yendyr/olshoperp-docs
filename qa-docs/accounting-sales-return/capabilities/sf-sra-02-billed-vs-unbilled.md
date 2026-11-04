---
doc_type: menu-capability
menu: accounting-sales-return
id: SF-SRA-02
title: Billed vs Unbilled
aliases: [billed return, unbilled return, credit note from return, ada SI, belum ada SI]
scope: menu
summary: >-
  Billed = sudah ada Sales Invoice (SI); Unbilled = belum ada SI.
  Tidak berhubungan dengan AR/payment. Billed → Credit Note (parity Purchase Return → Debit Note).
  TO-BE ETM-16764: CN memakai Deposit of Sales Return. Fix code ETM-17064.
version: 1.2
last_updated: 2026-11-04
status: review
---

# Billed vs Unbilled

## Apa ini

Setiap Sales Return punya tipe akuntansi yang menentukan dampak Finance saat [Complete](#sf-lingo:SF-SRA-01). Definisi **wajib sama dengan Purchase Return**: yang menentukan adalah **sudah ada invoice penjualan (SI) atau belum** — **bukan** apakah customer sudah bayar lewat Account Receive.

**COA CN (TO-BE · [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764)):** Complete **Billed** → CN memakai **Deposit of Sales Return**. Saat CN dipakai di Account Receive, COA resolve dari **setting by asal** (bukan selalu Customer's Deposit).

## Kapan dipakai

| Type | Kapan | Dampak Finance saat Complete |
|------|-------|------------------------------|
| **Unbilled** | SKU/baris **belum punya Sales Invoice** | Jurnal penyesuaian Sales & AR (bukan Credit Note) |
| **Billed** | SKU/baris **sudah punya Sales Invoice** | **Credit Note** otomatis (**Deposit of Sales Return** TO-BE) + jurnal — mirror Debit Note di Purchase Return billed |

Campuran SI sudah dilunasi AR + SI belum ada AR dalam satu order → selama keduanya punya SI, keduanya **Billed**.

## Cara pakai

1. Saat review SR, kenali apakah baris retur sudah punya **Sales Invoice** (bukan status AR).
2. Complete seperti biasa.
3. **Billed:** cek menu [Credit Note](../accounting-credit-note/) — biasanya sudah Approved + Trx Ref.
4. **Unbilled:** jangan mengharapkan Credit Note; cek jurnal sales/AR.

## Catatan

- **Billed ≠ “sudah ada payment”.** Fokus: **sudah ada SI**.
- **Unbilled ≠ “SI belum dibayar”.** Fokus: **belum ada SI**.
- Retur Unbilled tidak membuat deposit customer via CN.
- Bug code yang masih cek payment: [ETM-17064](https://erpintegration.atlassian.net/browse/ETM-17064).
- Detail pemakaian CN lanjut di Account Receive — Lingo: [Use in Account Receive](../accounting-credit-note/capabilities/sf-cn-03-use-in-account-receive.md).

## Contoh

| Situasi | Type | Setelah Complete |
|---------|------|------------------|
| SI sudah ada (meski AR belum ada), customer retur | Billed | CN; **TO-BE** akun Deposit of Sales Return |
| SI sudah ada dan sudah dilunasi AR, customer retur | Billed | CN; sama |
| Belum ada SI sama sekali | Unbilled | Jurnal sales/AR; tanpa CN |

## Lihat juga

- [Complete](#sf-lingo:SF-SRA-01)
- Credit Note: [How CN is created](../accounting-credit-note/capabilities/sf-cn-01-how-cn-is-created.md)
- Purchase Return (acuan parity billed/unbilled)
