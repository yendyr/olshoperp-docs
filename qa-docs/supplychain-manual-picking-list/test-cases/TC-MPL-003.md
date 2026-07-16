---
doc_type: e2e-test-case
tc_code: TC-MPL-003
menu: supplychain-manual-picking-list
menu_name: "Manual Picking List"
title: "Add Available Product + Transfer Qty ke detail"
summary: "Menambah line picking via Available Products (atau Select Product fallback); stok di-reserve."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-manual-picking-list/requirement.md"
automated: true
automated_spec: "tests/specs/manual-picking-list/manual-picking-list-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari CREATE (serial); Building Origin valid; stok rack available."
test_data:
  - field: "Transfer Qty"
    value: "1"
steps:
  - "Edit PL → Picking List Detail."
  - "Available Products → Use this Item → Transfer Qty 1 → Save."
  - "(Fallback) Select Product jika Available Products gagal."
  - "Verifikasi SKU muncul di detail."
expected_result: |
  Line detail tersimpan; SKU terlihat di Picking List Detail.
test_result:
  status: pass
  started_at: "2026-07-15T04:45:00Z"
  finished_at: "2026-07-15T04:48:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "3/3 PASS · Available Products → Use this Item + SKU di detail OK · lumicharmsid"
  report_url: null
---

# TC-MPL-003

## Catatan automation

- Spec: `@TC-MPL-003`
- Modal heading: **Use this Item** (bukan Use Product).
- POST: `manual-picking-middle-detail` (bukan resource detail biasa).
