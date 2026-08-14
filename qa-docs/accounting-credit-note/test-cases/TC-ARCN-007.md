---
doc_type: e2e-test-case
tc_code: TC-ARCN-007
menu: accounting-credit-note
menu_name: "Credit Note"
title: "IMPORT — Excel tetap bank-only; Free COA di GL Acc ditolak"
summary: "Import GL Acc Equity ditolak; import GL Acc Master Cash/Bank tetap sukses Open type Cash/Bank."
status: draft
owner: QA - Yemima
last_updated: 2026-08-13
requirement_ref: "qa-docs/accounting-credit-note/requirement.md §5.2 Import bank-only; §6.5; §7.1 #16–19"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-chart-of-account
  - accounting-company-detail-bank
card_ref: "ETM-15442"
preconditions:
  - "Company FAT, primary currency IDR sudah ter-set."
  - "Customer General aktif dengan kode DS-CORNELSTORE (COA tagging lengkap)."
  - "Ada COA Equity leaf aktif yang bukan Master Cash/Bank (3-102)."
  - "Ada COA terdaftar Master Cash/Bank aktif IDR (1-102-01)."
  - "Tidak ada import Credit Note lain yang sedang process."
test_data:
  - field: "Customer Code"
    value: "DS-CORNELSTORE"
  - field: "Trx Date"
    value: "13-08-2026"
  - field: "Reject GL Acc"
    value: "3-102 (Tambahan Modal Disetor, Free COA / Equity)"
  - field: "OK GL Acc"
    value: "1-102-01 (BCA 8620132277, Master Cash/Bank)"
  - field: "Amount"
    value: "10000"
  - field: "Reject file"
    value: "ETM-15442-CN-import-free-coa-reject.xlsx"
  - field: "OK file"
    value: "ETM-15442-CN-import-bank-ok.xlsx"
steps:
  - "Buka /accounting/credit-note (company FAT)."
  - "Import → Upload file reject (GL Acc 3-102)."
  - "Cek Import History / View Error Logs."
  - "Import → Upload file OK (GL Acc 1-102-01)."
  - "Buka CN hasil import; cek Receiving Destination type dan GL Acc."
expected_result: |
  Import Excel tetap bank-only (requirement §5.2): GL Acc harus Master Cash/Bank — Free COA UI saja.
  File Free COA: upload 422, pesan Row 2: COA code is not registered in Master Cash/Bank. Tidak ada CN terbentuk (all-or-nothing §6.5 / §7.1 #16–19).
  File Cash/Bank: import success, CN Open, currency primary, fund type Cash/Bank (bukan COA), GL Acc = COA Master Cash/Bank.
test_result:
  status: pass
  started_at: "2026-08-13 16:16"
  finished_at: "2026-08-13 16:26"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "FAT. Reject 3-102 → POST /upload 422, log Row 2: COA code is not registered in Master Cash/Bank. Control 1-102-01 → history id 75 success 1 row; CN-5U4419A6 (id 3182) Open, type Cash/Bank, GL 1-102-01 BCA 8620132277, amount 10.000,00. Percobaan control pertama pakai 1-10015 gagal COA code not found (kode bukan chart FAT) — bukan FAIL AC. Login Yemima Staging."
  report_url: null
test_data_used:
  - field: "Reject file"
    value: "ETM-15442-CN-import-free-coa-reject.xlsx (GL Acc 3-102)"
  - field: "OK file"
    value: "ETM-15442-CN-import-bank-ok.xlsx (GL Acc 1-102-01)"
  - field: "CN"
    value: "CN-5U4419A6 / accounting/credit-note/edit/3182"
run_history:
  - at: "2026-08-13 16:26"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
---

## Catatan QA

Skenario ETM-15442 AC: Import Excel CN tetap hanya menerima COA yang terdaftar di Master Cash/Bank (tidak diperluas ke Free COA).

CN-5U4419A6 dibiarkan **Open** di staging (hasil import control). Fixture Excel: `test-cases/fixtures/`.
