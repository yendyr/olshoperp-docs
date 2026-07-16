---
doc_type: e2e-test-case
tc_code: TC-REALSTK-005
menu: supplychain-real-stock
menu_name: "Real Time Stock"
title: "By SKU — shell WH/Sales/ALL + Buildings Multiselect"
summary: "Switch tab By SKU; verifikasi tombol WH Team / Sales Team / ALL; placeholder Buildings (max 5)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-real-stock/requirement.md"
automated: true
automated_spec: "tests/specs/real-stock/real-stock-by-sku.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login playwright@gmail.com / company lumicharmsid."
test_data: []
steps:
  - "Buka Real Time Stock → tab By SKU."
  - "Verifikasi WH Team, Sales Team, ALL."
  - "Verifikasi Multiselect You can choose up to 5 Buildings (default WH Team)."
expected_result: |
  Shell By SKU siap; data belum load sampai WH dipilih atau mode ALL.
test_result:
  status: pass
  started_at: "2026-07-16T01:53:00Z"
  finished_at: "2026-07-16T01:53:15Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS VIEW By SKU shell WH/Sales/ALL + Buildings Multiselect · company lumicharmsid"
  report_url: null
---

# TC-REALSTK-005

Tab **By SKU** — pivot stok per SKU × warehouse columns (dynamic).
