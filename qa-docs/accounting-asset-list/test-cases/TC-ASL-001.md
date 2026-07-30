---
doc_type: e2e-test-case
tc_code: TC-ASL-001
menu: accounting-asset-list
menu_name: "Asset List"
title: "VIEW — shell warehouse gate tanpa Create"
summary: "Load /accounting/asset-list; verifikasi Choose Warehouse + Apply; tidak ada Create."
status: pass
owner: QA - Cursor
last_updated: 2026-07-24
requirement_ref: "qa-docs/accounting-asset-list/knowledge-base.md"
automated: true
automated_spec: "tests/specs/asset-list/asset-list-view.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-asset-category
  - supplychain-stock-monitoring
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data: []
steps:
  - "Buka /accounting/asset-list."
  - "Verifikasi breadcrumb Asset List."
  - "Verifikasi Choose Warehouse + Apply terlihat."
  - "Verifikasi tidak ada tombol Create."
expected_result: |
  Shell filter warehouse tampil; Create tidak ada.
test_result:
  status: pass
  environment: staging
  log_summary: "5/5 PASS asset-list-view.spec.ts · TC-ASL-001 · company lumicharmsid"
---

# TC-ASL-001

## Catatan automation

- Spec: `@TC-ASL-001`
