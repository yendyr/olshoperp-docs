---
doc_type: e2e-test-case
tc_code: TC-CANORD-002
menu: supplychain-cancelled-order
menu_name: "Cancelled Order"
title: "Search Cancelled Order by SO code"
summary: "Mencari SO di datalist Cancelled Order; baris tetap Void/Rejected."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-cancelled-order/requirement.md"
automated: true
automated_spec: "tests/specs/cancelled-order/cancelled-order-view-search.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Hasil serial dari TC-CANORD-001 (sample SO code) atau token 'void'."
test_data:
  - field: "Search"
    value: "{sample SO code} atau void"
steps:
  - "Buka Cancelled Order."
  - "Isi searchbox dengan SO code dari VIEW (atau 'void')."
  - "Verifikasi tabel reload; baris berisi query / status Void|Rejected."
expected_result: |
  Search berhasil; baris relevan tampil (atau empty jika tidak ada match).
test_result:
  status: pass
  started_at: "2026-07-15T03:29:30Z"
  finished_at: "2026-07-15T03:31:18Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS · SEARCH by SO code OK · company lumicharmsid"
  report_url: null
---

# TC-CANORD-002

## Catatan automation

- Spec: `@TC-CANORD-002`
- Filter kolom SearchBuilder tersedia di FE (`advanced_filter: true`) — TC ini fokus searchbox global.
