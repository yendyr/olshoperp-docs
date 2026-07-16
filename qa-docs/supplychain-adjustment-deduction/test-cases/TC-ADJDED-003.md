---
doc_type: e2e-test-case
tc_code: TC-ADJDED-003
menu: supplychain-adjustment-deduction
menu_name: "Stock Deduction"
title: "Add Available Product + Quantity"
summary: "Dari Stock Deduction Detail: Available Products → Use → isi Quantity."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-adjustment-deduction/requirement.md"
automated: true
automated_spec: "tests/specs/adjustment-deduction/adjustment-deduction-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen create serial; Building Origin punya available stock."
test_data:
  - field: "Quantity"
    value: "1"
steps:
  - "Edit dokumen → Stock Deduction Detail."
  - "Klik Available Products → Use baris pertama."
  - "Modal Use Product → Quantity = 1 → Save."
  - "Verifikasi product di grid detail."
expected_result: |
  Product masuk ke Stock Deduction Detail dengan qty.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~50s) — Available Products → Use → Quantity=1 → detail OK.
  report_url: null
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-ADJDED-003 — serial 3/3 PASS"
---

# TC-ADJDED-003

## Catatan automation

- Spec tag: `@TC-ADJDED-003`
- Pola mirip Stock Opname Available Products (bukan Select Product seperti Addition).
