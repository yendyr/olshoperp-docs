---
doc_type: e2e-test-case
tc_code: TC-ARCN-001
menu: accounting-credit-note
menu_name: "Credit Note"
title: "EDIT — tambah Receiving Destination via Free COA Equity (modal)"
summary: "Di CN Draft, pilih Free COA Equity; baris tersimpan type COA amount 0."
status: draft
owner: QA - Yemima
last_updated: 2026-08-13
requirement_ref: "qa-docs/accounting-credit-note/requirement.md §5.2"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-chart-of-account
card_ref: "ETM-15442"
preconditions:
  - "CN Draft/Open, header sudah tersimpan (ada id), currency IDR."
  - "Ada COA leaf aktif class Equity, contoh 3-30001 Tambahan Modal Disetor."
  - "User bisa update CN (can_update)."
test_data:
  - field: "CN"
    value: "CN-5TU8OCFD (id 3089)"
  - field: "Customer"
    value: "Buyer Umum Offline Store"
  - field: "Currency"
    value: "IDR"
  - field: "Free COA search"
    value: "modal"
  - field: "COA"
    value: "3-30001 Tambahan Modal Disetor"
steps:
  - "Buka /accounting/credit-note/edit/{id} (CN Draft)."
  - "Di Receiving Destination, klik Select Free COA."
  - "Ketik search modal."
  - "Pilih 3-30001 Tambahan Modal Disetor."
expected_result: |
  Baris fund baru tersimpan dengan type COA (bukan Cash/Bank).
  GL Account menampilkan COA Equity yang dipilih (termasuk modal awal).
  Bank account / Swift tampil "-" (jalur free COA).
  Amount seed 0 diizinkan pada add (requirement §5.2).
test_result:
  status: pass
  started_at: "2026-08-13 14:12"
  finished_at: "2026-08-13 14:14"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "CN-5TU8OCFD; search modal → 3-30001 Tambahan Modal Disetor; type COA; bank/swift -; amount 0,00. Staging FE 2026-08-13 14:08, API 14:07. Login sesi Yemima Staging (bukan playwright@gmail.com)."
  report_url: null
test_data_used:
  - field: "CN"
    value: "CN-5TU8OCFD / accounting/credit-note/edit/3089"
  - field: "COA"
    value: "3-30001 Tambahan Modal Disetor"
run_history:
  - at: "2026-08-13 14:14"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
---

## Catatan QA

Skenario ETM-15442 AC: user bisa menambah Receiving Destination via Free COA (leaf, semua class, termasuk Equity/modal awal).

Baris ini dibiarkan di CN-5TU8OCFD setelah tes (amount 0) — hapus manual jika tidak dipakai.
