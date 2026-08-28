---
doc_type: e2e-test-case
tc_code: TC-SOPNAME-006
menu: supplychain-stock-opname
menu_name: "Stock Opname"
test_type: edge
title: "Print Detail — dokumen tanpa baris detail tetap generate"
summary: "Stock Opname Open qty 0 tetap bisa Print Detail; tabel menampilkan No data available."
status: draft
owner: QA - Yemima
last_updated: 2026-08-14
requirement_ref: "qa-docs/supplychain-stock-opname/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login staging, company FAT (112)."
  - "Ada Stock Opname tanpa detail (qty 0)."
  - "URL edit: https://staging.olshoperp.com/supplychain/stock-opname/edit/130271"
test_data:
  - field: "Transaction Code"
    value: "SP-5U423JG2"
  - field: "Trx. Status"
    value: "Open"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/stock-opname/edit/130271"
  - "Klik **Print Detail**."
  - "Cek print tidak error; tabel kosong."
expected_result: |
  Print sukses. Header Transaction Code tetap tampil. Body tabel **No data available**. Approved By `-` jika belum approve.
test_result:
  status: passed
  started_at: "2026-08-14 07:14"
  finished_at: "2026-08-14 07:14"
  executed_by: "QA - Yemima (Cursor browser)"
  environment: staging
  log_summary: |
    SP-5U423JG2 print OK. Header: 23-07-2026 12:51:51, Gudang Seruni FAT. Body: No data available. Approved By - -.
  report_url: null
test_data_used:
  - field: "URL edit"
    value: "https://staging.olshoperp.com/supplychain/stock-opname/edit/130271"
run_history:
  - at: "2026-08-14 07:14"
    status: pass
    note: "ETM-15479 — empty detail print"
origin_jira: ETM-15479
first_execution:
  at: "2026-08-14 07:14"
  via: "legacy:test_result"
  jira: "ETM-15479"
last_execution:
  at: "2026-08-14 07:14"
  jira: "ETM-15479"
  status: passed
  via: "legacy:test_result"
---

# TC-SOPNAME-006

## Catatan QA

Variasi dataset sedikit/nol dari AC re-test Jira — generate tanpa error.
