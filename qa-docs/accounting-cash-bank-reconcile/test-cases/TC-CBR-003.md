---
doc_type: e2e-test-case
tc_code: TC-CBR-003
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: 'CBR CREATE/APPROVE — fiscal missing atau Closed dulu, belum ke lock'
summary: 'Create atau Approve Cash/Bank Reconcile gagal di Fiscal Period (pesan fiscal). Jangan muncul pesan CBR lock.'
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
  - accounting-fiscal-period
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: FAT (id 112)."
  - "Ada dua Master Cash/Bank aktif: Account A (akan di-lock) dan Account B (tidak di-lock)."
  - "Siapkan Period CBR yang salah satu tanggalnya tanpa fiscal Open, ATAU fiscal Closed."
  - "Belum ada CBR Approved overlapping untuk Account A di period uji (atau pakai period baru)."
test_data:
  - field: "Cash Bank Account"
    value: "Account A"
  - field: "Period"
    value: "rentang yang menyentuh tanggal tanpa fiscal Open / fiscal Closed"
  - field: "UI"
    value: "https://staging.olshoperp.com/accounting/cash-bank-reconcile/create"
steps:
  - "Buka /accounting/cash-bank-reconcile → Create."
  - "Isi Period (datepicker) yang mencakup tanggal tanpa fiscal Open atau fiscal Closed."
  - "Pilih Cash Bank Account = Account A."
  - "Klik Save & Next."
  - "Jika header tersimpan: set status Open, import minimal 1 baris Bank Statement (syarat Approve), lalu klik Approve."
  - "Catat pesan error di Create dan/atau Approve. Pastikan bukan pesan lock CBR."
expected_result: |
  Urutan validasi wajib di Cash/Bank Reconcile (Create / Approve):
  1. Fiscal Period dulu. Jika tanggal tanpa fiscal / fiscal Closed → STOP. Pesan fiscal (§6.4). Jangan tampilkan pesan CBR lock.
  2. Fiscal Open → baru cek CBR Approved lock untuk Cash Bank Account + tanggal. Jika kena lock → STOP. Pesan lock + kode BR. Bukan pesan fiscal.
  3. Fiscal Open dan tidak kena lock → transaksi boleh dilanjutkan.

  [CATATAN QA] Requirement Cash/Bank Reconcile AS-IS masih GAP-CBR-08 (lock belum terimplementasi). Expected di TC ini = TO-BE ETM-15522 + urutan fiscal-period §6.6 / QA lead 14 Agu 2026.
  Referensi: qa-docs/accounting-fiscal-period/requirement.md §6.4–6.6; qa-docs/accounting-cash-bank-reconcile/requirement.md §6.4 GAP-CBR-08.

  Create/Approve ditolak karena Fiscal Period.
  Pesan salah satu dari §6.4: `To create any transaction in OlshopERP, an active fiscal period must exist.` atau `Fiscal period {date} is already closed.` atau `Date must be in an active fiscal period.`.
  Tidak ada pesan lock CBR.
  Lock Account A tidak aktif (CBR tidak Approved).
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

# TC-CBR-003

## Skenario

Uji gerbang CBR sendiri: Fiscal Period dicek **sebelum** overlap CBR / lock (fiscal-period requirement §6.6 Create CBR).

### Langkah detail
1. Datalist Cash/Bank Reconcile → **Create**.
2. Field **Period**: pilih rentang yang sengaja menyentuh tanggal fiscal Closed atau di luar period Open.
3. Field **Cash Bank Account**: Account A.
4. **Save & Next**.
5. Jika tertolak di sini → PASS bagian Create (pesan fiscal).
6. Jika lolos Create: **Open** → **Import** Bank Statement (minimal 1 baris dalam Period) → **Approve**.
7. Approve harus ditolak dengan pesan fiscal, bukan lock.


## Catatan QA — expected vs requirement

- Pesan fiscal: [accounting-fiscal-period/requirement.md](../../accounting-fiscal-period/requirement.md) §6.4 (kutip persis).
- Urutan Journal: fiscal-period requirement §6.6 — Fiscal Period **sebelum** `validate_cash_bank_reconcile_lock`.
- Urutan menu lain (AP, AR, Credit Note, Debit Note, CBR, Instant Settlement Approve): QA lead ETM-15522 (14 Agu 2026) — fiscal dulu, baru CBR Approved lock.
- Lock COA+tanggal: TO-BE [requirement.md](../requirement.md) §6.4 / GAP-CBR-08. AS-IS docs masih "lock belum ada".
- Pesan lock (TO-BE ETM-15522): `Cash/Bank account is locked for reconciliation for {date}. Related Cash & Bank Reconcile: {BR-code}.`
- Instant Settlement: validasi **hanya** di **Approve** (trigger Account Receive), bukan start import.
- Origin: ETM-15522. Jangan run suite auto-match TC-CBRAM-01–14 untuk card ini.

