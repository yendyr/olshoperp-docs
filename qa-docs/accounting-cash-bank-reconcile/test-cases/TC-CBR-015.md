---
doc_type: e2e-test-case
tc_code: TC-CBR-015
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: 'LOCK SCOPE — Account A di tanggal luar Period CBR tetap muncul (Journal, Account Payment, Account Receive)'
summary: 'REOPEN: Account A harus tetap pilihable di D_out (fiscal Open, di luar Period CBR). Transaksi boleh.'
status: draft
owner: QA - Yemima
last_updated: 2026-08-14
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md §6.4 GAP-CBR-08; qa-docs/accounting-fiscal-period/requirement.md §6.4–6.6"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - journal
  - accounting-supplier-payment
  - accounting-customer-payment
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: FAT (id 112)."
  - "Ada dua Master Cash/Bank aktif: Account A (akan di-lock) dan Account B (tidak di-lock)."
  - "Ada dokumen Cash/Bank Reconcile status Approved untuk Account A, Period P_start–P_end (contoh 1 hari: isi saat run). Catat kode BR dan URL edit: https://staging.olshoperp.com/accounting/cash-bank-reconcile/edit/{id}."
  - "Tanggal D_in = tanggal di dalam Period CBR Approved."
  - "Tanggal D_out = tanggal di luar Period CBR, fiscal Open."
  - "Tanggal D_closed = tanggal fiscal Closed (atau tanpa fiscal) — siapkan terpisah dari D_in."
  - "D_out fiscal Open dan di luar Period CBR Approved."
test_data:
  - field: "Account A"
    value: "Cash Bank Account yang di-lock di Period CBR"
  - field: "D_out"
    value: "tanggal luar Period, fiscal Open"
  - field: "Journal"
    value: "https://staging.olshoperp.com/accounting/journal/create"
  - field: "Account Payment"
    value: "https://staging.olshoperp.com/accounting/supplier-payment/create"
  - field: "Account Receive"
    value: "https://staging.olshoperp.com/accounting/customer-payment/create"
steps:
  - "Journal Create: Transaction Date = D_out. Buka pilihan akun cash/bank di detail. Account A harus muncul. Simpan Debit/Credit Account A. Save & Next / Open harus berhasil (tidak kena lock)."
  - "Account Payment Create: tanggal D_out. Pilihan Cash Bank Account menampilkan Account A. Save & Next berhasil."
  - "Account Receive Create: tanggal D_out. Pilihan receiving Cash/Bank menampilkan Account A. Save & Next berhasil."
  - "FAIL jika Account A tidak muncul di dropdown pada D_out (temuan reopen staging)."
expected_result: |
  Lock hanya pada Account A + tanggal di dalam Period CBR Approved (ETM-15522 / GAP-CBR-08 TO-BE).
  Tanggal D_out: Account A tetap muncul; Journal / Account Payment / Account Receive boleh disimpan.
  Bukan: akun di-hide dari master list.

  [CATATAN QA] Reopen staging: Account A hilang di Journal, Account Payment, Account Receive saat tanggal beda dari Period CBR — itu FAIL.
  Referensi: requirement CBR §6.4 TO-BE period lock spesifik COA+tanggal, bukan hide master.
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15522
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-CBR-015

## Skenario

### Journal
1. `/accounting/journal/create` — **Transaction Date** = D_out.
2. Pilih Account A di detail → **Save & Next**.

### Account Payment
1. `/accounting/supplier-payment/create` — tanggal D_out.
2. Fund Account A terlihat → **Save & Next**.

### Account Receive
1. `/accounting/customer-payment/create` — tanggal D_out.
2. Cash/Bank Account A terlihat → **Save & Next**.

Simpan URL edit dokumen yang lolos di Catatan QA saat run.


## Catatan QA — expected vs requirement

- Pesan fiscal: [accounting-fiscal-period/requirement.md](../../accounting-fiscal-period/requirement.md) §6.4 (kutip persis).
- Urutan Journal: fiscal-period requirement §6.6 — Fiscal Period **sebelum** `validate_cash_bank_reconcile_lock`.
- Urutan menu lain (AP, AR, Credit Note, Debit Note, CBR, Instant Settlement Approve): QA lead ETM-15522 (14 Agu 2026) — fiscal dulu, baru CBR Approved lock.
- Lock COA+tanggal: TO-BE [requirement.md](../requirement.md) §6.4 / GAP-CBR-08. AS-IS docs masih "lock belum ada".
- Pesan lock (TO-BE ETM-15522): `Cash/Bank account is locked for reconciliation for {date}. Related Cash & Bank Reconcile: {BR-code}.`
- Instant Settlement: validasi **hanya** di **Approve** (trigger Account Receive), bukan start import.
- Origin: ETM-15522. Jangan run suite auto-match TC-CBRAM-001–014 untuk card ini.

