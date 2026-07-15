---
doc_type: e2e-test-case
tc_code: TC-FILTER-inventory-detail
menu: supplychain-inventory-detail
menu_name: "Inventory Detail"
title: "Quick filter card Out of Stock"
summary: "Klik card Out of Stock merefresh datalist dengan query filter=."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-inventory-detail/requirement.md"
automated: true
automated_spec: "tests/specs/inventory-detail/inventory-detail-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Inventory Detail sudah load dengan warehouse_space_type terisi."
test_data: []
steps:
  - "Buka Inventory Detail."
  - "Klik card Out of Stock."
  - "Verifikasi GET datalist menyertakan filter=; tabel reload."
expected_result: |
  Request filter sukses; tabel menampilkan subset OOS atau empty.
test_result:
  status: pass
  started_at: "2026-07-15T03:37:00Z"
  finished_at: "2026-07-15T03:38:14Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS · FILTER Out of Stock card → filter= OK · company lumicharmsid"
  report_url: null
---

# TC-FILTER-inventory-detail

## Catatan automation

- Spec: `@TC-FILTER-inventory-detail`
- Cards lain: Total Availability, Warning, Transit — pola sama (`filterStock`).
