---
doc_type: e2e-test-case
tc_code: TC-ARCN-003
menu: accounting-credit-note
menu_name: "Credit Note"
title: "EDIT — campur baris Cash/Bank dan Free COA dalam satu CN"
summary: "Satu CN menampilkan type COA (Equity) dan type Cash/Bank tanpa duplikat GL."
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
  - accounting-company-detail-bank
  - accounting-chart-of-account
card_ref: "ETM-15442"
preconditions:
  - "CN Draft sudah punya 1 baris Cash/Bank."
  - "TC add Free COA Equity sudah dijalankan (atau tambah Free COA berbeda GL)."
test_data:
  - field: "CN"
    value: "CN-5TU8OCFD (id 3089)"
  - field: "Cash/Bank row"
    value: "type Cash/Bank, 1-10015 Bank BCA 001"
  - field: "Free COA row"
    value: "type COA, 3-30001 Tambahan Modal Disetor"
steps:
  - "Buka edit CN yang sudah punya baris Cash/Bank."
  - "Tambah Free COA dengan GL berbeda."
  - "Cek kolom type dan GL kedua baris."
expected_result: |
  Satu CN boleh mencampur baris Cash/Bank dan Free COA.
  Tidak ada COA duplikat lintas jalur.
  Kolom type membedakan Cash/Bank vs COA (requirement §5.2).
test_result:
  status: passed
  started_at: "2026-08-13 14:14"
  finished_at: "2026-08-13 14:14"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: "Tabel Receiving Destination: row COA 3-30001 (bank -) + row Cash/Bank 1-10015 Bank Central Asia 001-22222222."
  report_url: null
test_data_used:
  - field: "CN"
    value: "CN-5TU8OCFD"
run_history:
  - at: "2026-08-13 14:14"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
last_execution:
  at: "2026-08-13"
  jira: null
  status: passed
  via: "legacy:test_result"
---

## Catatan QA

ETM-15442 AC: satu CN bisa mencampur Cash/Bank dan Free COA tanpa duplikat COA.
