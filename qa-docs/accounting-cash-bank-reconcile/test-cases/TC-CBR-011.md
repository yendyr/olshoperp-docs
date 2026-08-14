---
doc_type: e2e-test-case
tc_code: TC-CBR-011
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: 'CREDIT NOTE CREATE — urutan fiscal dulu, lalu CBR lock (manual)'
summary: 'Credit Note create: D_closed gagal fiscal; D_in + fund Cash/Bank Account A gagal lock + BR.'
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
  - accounting-credit-note
  - accounting-fiscal-period
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: FAT (id 112)."
  - "Ada dua Master Cash/Bank aktif: Account A (akan di-lock) dan Account B (tidak di-lock)."
  - "Ada dokumen Cash/Bank Reconcile status Approved untuk Account A, Period P_start–P_end (contoh 1 hari: isi saat run). Catat kode BR dan URL edit: https://staging.olshoperp.com/accounting/cash-bank-reconcile/edit/{id}."
  - "Tanggal D_in = tanggal di dalam Period CBR Approved."
  - "Tanggal D_out = tanggal di luar Period CBR, fiscal Open."
  - "Tanggal D_closed = tanggal fiscal Closed (atau tanpa fiscal) — siapkan terpisah dari D_in."
  - "Menu Credit Note: user punya hak create/import."
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
    value: "https://staging.olshoperp.com/accounting/credit-note/create"
steps:
  - "Bagian A: buka /accounting/credit-note/create. Tanggal = D_closed. Receiving Destination / fund pilih Cash/Bank Account A (bukan Free COA). Save & Next."
  - "Pesan fiscal, bukan lock CBR."
  - "Bagian B: create baru, tanggal D_in, fund Account A. Save & Next / Approve."
  - "Pesan lock + BR, bukan fiscal."
expected_result: |
  Urutan validasi wajib di Credit Note (Create manual):
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
---

# TC-CBR-011

## Skenario

Label UI: **Receiving Destination**, **Save & Next**, **Approve**. Fund harus jalur **Cash/Bank**, bukan Free COA (Free COA di luar lock akun master cash/bank kecuali COA-nya kebetulan sama).

### Bagian A — Fiscal dulu
1. Create Credit Note. Tanggal D_closed. Fund Cash/Bank Account A. **Save & Next**. Pesan fiscal.

### Bagian B — CBR lock
1. Create baru. Tanggal D_in. Fund Account A. **Save & Next** / **Approve**. Pesan lock + BR.


## Catatan QA — expected vs requirement

- Pesan fiscal: [accounting-fiscal-period/requirement.md](../../accounting-fiscal-period/requirement.md) §6.4 (kutip persis).
- Urutan Journal: fiscal-period requirement §6.6 — Fiscal Period **sebelum** `validate_cash_bank_reconcile_lock`.
- Urutan menu lain (AP, AR, Credit Note, Debit Note, CBR, Instant Settlement Approve): QA lead ETM-15522 (14 Agu 2026) — fiscal dulu, baru CBR Approved lock.
- Lock COA+tanggal: TO-BE [requirement.md](../requirement.md) §6.4 / GAP-CBR-08. AS-IS docs masih "lock belum ada".
- Pesan lock (TO-BE ETM-15522): `Cash/Bank account is locked for reconciliation for {date}. Related Cash & Bank Reconcile: {BR-code}.`
- Instant Settlement: validasi **hanya** di **Approve** (trigger Account Receive), bukan start import.
- Origin: ETM-15522. Jangan run suite auto-match TC-CBRAM-001–014 untuk card ini.

