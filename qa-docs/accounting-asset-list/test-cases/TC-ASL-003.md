---
doc_type: e2e-test-case
tc_code: TC-ASL-003
menu: accounting-asset-list
menu_name: "Asset List"
title: "SEARCH + Availability modal"
summary: "Search SKU baris pertama (jika ada); klik Availability → modal Available."
status: pass
owner: QA - Cursor
last_updated: 2026-07-24
requirement_ref: "qa-docs/accounting-asset-list/knowledge-base.md"
automated: true
automated_spec: "tests/specs/asset-list/asset-list-view.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "TC-ASL-002 warehouse sudah dipilih."
  - "Jika tidak ada fixed-asset stock di warehouse: assert empty + PASS dengan catatan."
test_data: []
steps:
  - "Pastikan warehouse terpilih dan datalist load."
  - "Jika ada baris: ambil SKU baris pertama → search → klik Availability."
  - "Jika kosong: verifikasi empty state datalist."
expected_result: |
  Modal Available tampil (ada data) ATAU empty state jelas (tanpa data).
test_result:
  status: pass
  environment: staging
  log_summary: "5/5 PASS · TC-ASL-003 · data AST-KND-0001 · company lumicharmsid"
---

# TC-ASL-003

## Catatan automation

- Spec: `@TC-ASL-003`
