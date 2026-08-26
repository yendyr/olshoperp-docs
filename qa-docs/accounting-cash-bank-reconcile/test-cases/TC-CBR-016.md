---
doc_type: e2e-test-case
tc_code: TC-CBR-016
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
test_type: cross-menu
title: 'LOCK SCOPE — Account B (COA lain) di tanggal Period CBR tetap boleh'
summary: 'Tanggal D_in (period lock Account A): Account B tidak kena lock; Journal/AP/AR boleh.'
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
  - "Account B ≠ Account A; COA berbeda; tidak ada CBR Approved untuk Account B di D_in."
test_data:
  - field: "Account A"
    value: "locked"
  - field: "Account B"
    value: "tidak locked"
  - field: "D_in"
    value: "tanggal dalam Period CBR Account A"
  - field: "Journal"
    value: "https://staging.olshoperp.com/accounting/journal/create"
steps:
  - "Journal Create: Transaction Date = D_in. Detail memakai Account B (bukan A). Save & Next / Open berhasil."
  - "Account Payment Create: tanggal D_in, fund Account B. Save & Next berhasil."
  - "Account Receive Create: tanggal D_in, receiving Account B. Save & Next berhasil."
  - "Ulangi Journal dengan Account A di D_in — harus tetap ditolak lock (kontrol bahwa lock Account A masih hidup)."
expected_result: |
  Lock spesifik per Cash Bank Account + tanggal Period (ETM-15522).
  Account B di D_in: transaksi Journal / Account Payment / Account Receive boleh.
  Account A di D_in: tetap ditolak lock (kontrol).

  [CATATAN QA] GAP-CBR-08 TO-BE; requirement AS-IS lock belum ada.
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

# TC-CBR-016

## Skenario

1. Journal D_in + **Account B** → boleh.
2. Account Payment D_in + Account B → boleh.
3. Account Receive D_in + Account B → boleh.
4. Kontrol: Journal D_in + **Account A** → lock.


## Catatan QA — expected vs requirement

- Pesan fiscal: [accounting-fiscal-period/requirement.md](../../accounting-fiscal-period/requirement.md) §6.4 (kutip persis).
- Urutan Journal: fiscal-period requirement §6.6 — Fiscal Period **sebelum** `validate_cash_bank_reconcile_lock`.
- Urutan menu lain (AP, AR, Credit Note, Debit Note, CBR, Instant Settlement Approve): QA lead ETM-15522 (14 Agu 2026) — fiscal dulu, baru CBR Approved lock.
- Lock COA+tanggal: TO-BE [requirement.md](../requirement.md) §6.4 / GAP-CBR-08. AS-IS docs masih "lock belum ada".
- Pesan lock (TO-BE ETM-15522): `Cash/Bank account is locked for reconciliation for {date}. Related Cash & Bank Reconcile: {BR-code}.`
- Instant Settlement: validasi **hanya** di **Approve** (trigger Account Receive), bukan start import.
- Origin: ETM-15522. Jangan run suite auto-match TC-CBRAM-001–014 untuk card ini.

