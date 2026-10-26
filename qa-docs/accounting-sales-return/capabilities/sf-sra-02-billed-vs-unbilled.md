---
doc_type: menu-capability
menu: accounting-sales-return
id: SF-SRA-02
title: Billed vs Unbilled
aliases: [billed return, unbilled return, credit note from return]
scope: menu
summary: >-
  Unbilled = jurnal sales/AR; Billed = Credit Note otomatis. TO-BE ETM-16764:
  CN dari Billed memakai Deposit of Sales Return (bukan Customer's Deposit).
version: 1.1
last_updated: 2026-10-26
status: review
---

# Billed vs Unbilled

## Apa ini

Setiap Sales Return punya tipe akuntansi yang menentukan dampak Finance saat [Complete](#sf-lingo:SF-SRA-01). Sistem menetapkan tipe dari status pembayaran invoice terkait — bukan pilihan tombol terpisah di form.

**COA CN (TO-BE · [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764)):** Complete **Billed** → CN memakai **Deposit of Sales Return**. Saat CN dipakai di Account Receive, COA resolve dari **setting by asal** (bukan selalu Customer's Deposit).

## Kapan dipakai

| Type | Kapan | Dampak Finance saat Complete |
|------|-------|------------------------------|
| **Unbilled** | Invoice belum ada payment dari customer | Jurnal penyesuaian Sales & AR (bukan Credit Note) |
| **Billed** | Invoice sudah pernah dibayar (ada payment) | **Credit Note** otomatis (**Deposit of Sales Return** TO-BE) + jurnal persediaan / AR |

Jika dalam satu order ada campuran invoice dan **satu** sudah billed → tipe retur dianggap **billed**.

## Cara pakai

1. Saat review SR, kenali apakah invoice order sudah pernah dibayar.
2. Complete seperti biasa.
3. **Billed:** cek menu [Credit Note](../accounting-credit-note/) — biasanya sudah Approved + Trx Ref.
4. **Unbilled:** jangan mengharapkan Credit Note; cek jurnal sales/AR.

## Catatan

- Unbilled ≠ “belum ada Sales Invoice” saja — fokusnya **belum ada payment** pada invoice.
- Retur Unbilled tidak membuat deposit customer via CN.
- Detail pemakaian CN lanjut di Account Receive — Lingo: [Use in Account Receive](../accounting-credit-note/capabilities/sf-cn-03-use-in-account-receive.md).

## Contoh

| Situasi | Type | Setelah Complete |
|---------|------|------------------|
| SI sudah lunas, customer retur | Billed | CN Approved; **TO-BE** akun Deposit of Sales Return |
| SI belum dibayar, retur | Unbilled | Jurnal sales/AR; tanpa CN |

## Lihat juga

- [Complete](#sf-lingo:SF-SRA-01)
- Credit Note: [How CN is created](../accounting-credit-note/capabilities/sf-cn-01-how-cn-is-created.md)
