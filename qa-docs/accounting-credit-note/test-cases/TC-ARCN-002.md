---
doc_type: e2e-test-case
tc_code: TC-ARCN-002
menu: accounting-credit-note
menu_name: "Credit Note"
title: "EDIT — Free COA picker exclude COA terikat Master Cash/Bank"
summary: "Search GL Cash/Bank bound (1-10015) di Select Free COA; list kosong."
status: draft
owner: QA - Yemima
last_updated: 2026-08-13
requirement_ref: "qa-docs/accounting-credit-note/requirement.md §5.2 Free COA picker"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-company-detail-bank
  - accounting-chart-of-account
card_ref: "ETM-15442"
preconditions:
  - "CN Draft/Open dengan baris Cash/Bank yang GL-nya terikat Master Cash/Bank aktif."
  - "COA Bound contoh: 1-10015 Bank BCA 001."
test_data:
  - field: "CN"
    value: "CN-5TU8OCFD (id 3089)"
  - field: "Bound COA"
    value: "1-10015 Bank BCA 001"
steps:
  - "Buka edit CN."
  - "Di Select Free COA, ketik 1-10015."
  - "Cek opsi yang muncul."
expected_result: |
  COA yang sudah terikat Master Cash Bank aktif tidak muncul di pilihan Free COA.
  Bound Cash/Bank harus lewat field Cash/Bank (requirement §5.2).
test_result:
  status: pass
  started_at: "2026-08-13 14:14"
  finished_at: "2026-08-13 14:15"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "Search Free COA 1-10015 → The list is empty. COA ini juga sudah ada sebagai baris Cash/Bank di CN yang sama."
  report_url: null
test_data_used:
  - field: "search"
    value: "1-10015"
run_history:
  - at: "2026-08-13 14:15"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
---

## Catatan QA

List kosong bisa karena exclude bound **dan/atau** COA sudah dipakai di CN (no duplicate). Keduanya sesuai §5.2.

Observasi (bukan FAIL TC ini): saat picker dibuka sebelum ketik, sempat muncul 1-10003 Petty Cash Offline Store Cemong dan 1-10008 Petty Cash Store Upload Settlement. Perlu cek terpisah apakah COA itu terikat Master Cash/Bank.
