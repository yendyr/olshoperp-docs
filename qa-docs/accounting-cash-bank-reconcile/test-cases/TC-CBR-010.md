---
doc_type: e2e-test-case
tc_code: TC-CBR-010
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
test_type: cross-menu
title: 'ACCOUNT RECEIVE IMPORT — urutan fiscal dulu, lalu CBR lock'
summary: 'Import Account Receive: D_closed gagal fiscal; D_in + Account A gagal lock di awal import (bukan lolos create lalu gagal Approve).'
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
  - accounting-customer-payment
  - accounting-fiscal-period
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: FAT (id 112)."
  - "Ada dua Master Cash/Bank aktif: Account A (akan di-lock) dan Account B (tidak di-lock)."
  - "Ada dokumen Cash/Bank Reconcile status Approved untuk Account A, Period P_start–P_end (contoh 1 hari: isi saat run). Catat kode BR dan URL edit: https://staging.olshoperp.com/accounting/cash-bank-reconcile/edit/{id}."
  - "Tanggal D_in = tanggal di dalam Period CBR Approved."
  - "Tanggal D_out = tanggal di luar Period CBR, fiscal Open."
  - "Tanggal D_closed = tanggal fiscal Closed (atau tanpa fiscal) — siapkan terpisah dari D_in."
  - "Menu Account Receive: user punya hak create/import."
test_data:
  - field: "Cash Bank Account locked"
    value: "Account A (sama dengan CBR Approved)"
  - field: "Tanggal D_closed"
    value: "fiscal Closed / tanpa fiscal Open"
  - field: "Tanggal D_in"
    value: "di dalam Period CBR Approved, fiscal Open"
  - field: "CBR"
    value: "BR-… Approved — isi URL edit saat run"
  - field: "UI"
    value: "https://staging.olshoperp.com/accounting/customer-payment"
steps:
  - "Datalist Account Receive → Import."
  - "Bagian A: file tanggal D_closed + Account A → gagal pesan fiscal. Tidak ada AR baru."
  - "Bagian B: file tanggal D_in + Account A → gagal pesan lock + BR di awal import. FAIL jika import sukses dan dokumen AR ter-create lalu gagal Approve (temuan reopen)."
expected_result: |
  Urutan validasi wajib di Account Receive (Import):
  1. Fiscal Period dulu. Jika tanggal tanpa fiscal / fiscal Closed → STOP. Pesan fiscal (§6.4). Jangan tampilkan pesan CBR lock.
  2. Fiscal Open → baru cek CBR Approved lock untuk Cash Bank Account + tanggal. Jika kena lock → STOP. Pesan lock + kode BR. Bukan pesan fiscal.
  3. Fiscal Open dan tidak kena lock → transaksi boleh dilanjutkan.

  [CATATAN QA] Requirement Cash/Bank Reconcile AS-IS masih GAP-CBR-08 (lock belum terimplementasi). Expected di TC ini = TO-BE ETM-15522 + urutan fiscal-period §6.6 / QA lead 14 Agu 2026.
  Referensi: qa-docs/accounting-fiscal-period/requirement.md §6.4–6.6; qa-docs/accounting-cash-bank-reconcile/requirement.md §6.4 GAP-CBR-08.
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

# TC-CBR-010

## Skenario

### Bagian A — Fiscal dulu
1. **Import** AR. Tanggal D_closed + Account A. Pesan fiscal.

### Bagian B — CBR lock
1. **Import** AR. Tanggal D_in + Account A.
2. Gagal di awal import, pesan lock + BR.
3. FAIL jika AR ter-create (reopen staging).


## Catatan QA — expected vs requirement

- Pesan fiscal: [accounting-fiscal-period/requirement.md](../../accounting-fiscal-period/requirement.md) §6.4 (kutip persis).
- Urutan Journal: fiscal-period requirement §6.6 — Fiscal Period **sebelum** `validate_cash_bank_reconcile_lock`.
- Urutan menu lain (AP, AR, Credit Note, Debit Note, CBR, Instant Settlement Approve): QA lead ETM-15522 (14 Agu 2026) — fiscal dulu, baru CBR Approved lock.
- Lock COA+tanggal: TO-BE [requirement.md](../requirement.md) §6.4 / GAP-CBR-08. AS-IS docs masih "lock belum ada".
- Pesan lock (TO-BE ETM-15522): `Cash/Bank account is locked for reconciliation for {date}. Related Cash & Bank Reconcile: {BR-code}.`
- Instant Settlement: validasi **hanya** di **Approve** (trigger Account Receive), bukan start import.
- Origin: ETM-15522. Jangan run suite auto-match TC-CBRAM-001–014 untuk card ini.

