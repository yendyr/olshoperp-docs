---
doc_type: e2e-test-case
tc_code: TC-SOPNAME-007
menu: supplychain-stock-opname
menu_name: "Stock Opname"
test_type: happy
title: "Print opsi detail — COLLI DEV muncul di action Print"
summary: "Pada Stock Opname Detail, opsi print COLLI DEV tersedia (SKU / COLLI ID / SID / COLLI DEV)."
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
  - "Stock Opname Approved dengan adjustment > 0 agar baris printable."
  - "URL edit: https://staging.olshoperp.com/supplychain/stock-opname/edit/112699"
test_data:
  - field: "Transaction Code"
    value: "SP-5TXSFQRN"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/stock-opname/edit/112699"
  - "Di tab Stock Opname Detail, buka action Print pada baris / bulk."
  - "Cek opsi **COLLI DEV** ada di daftar."
expected_result: |
  Opsi print **COLLI DEV** (`sku_qr_qty_dev`) tampil bersama opsi print detail lain (SKU, COLLI ID/BOX, SID jika Approved).
test_result:
  status: passed
  started_at: "2026-08-14 07:12"
  finished_at: "2026-08-14 07:13"
  executed_by: "QA - Yemima (Cursor browser)"
  environment: staging
  log_summary: |
    Di Edit 112699, list print options: SKU, COLLI ID, SID, COLLI DEV. Generate isi label COLLI DEV tidak di-klik (scope utama card = document printout).
  report_url: null
test_data_used:
  - field: "URL edit"
    value: "https://staging.olshoperp.com/supplychain/stock-opname/edit/112699"
run_history:
  - at: "2026-08-14 07:13"
    status: pass
    note: "ETM-15479 — COLLI DEV option visible"
origin_jira: ETM-15479
last_execution:
  at: "2026-08-14 07:13"
  jira: "ETM-15479"
  status: passed
  via: "legacy:test_result"
---

# TC-SOPNAME-007

## Catatan QA

Commit ETM-15479 juga menambah `COLLI DEV` ke print_options detail. Bukan bagian template Excel document print, tapi ikut di-deploy di card yang sama.
