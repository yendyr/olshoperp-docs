---
doc_type: e2e-test-case
tc_code: TC-OC-001
menu: omni-other-cost
menu_name: "Other Cost"
title: "VIEW — buka datalist Other Cost"
summary: "Load /omni/other-cost; verifikasi Create dan kolom code/Name/Description/COA/Applied Store."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/omni-other-cost/knowledge-base.md"
automated: true
automated_spec: "tests/specs/other-cost/other-cost-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-chart-of-account
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data: []
steps:
  - "Buka /omni/other-cost."
  - "Verifikasi tombol Create (link)."
  - "Verifikasi kolom code, Name, Description, COA, Applied Store."
expected_result: |
  Datalist load; Create terlihat; kolom utama tampil.
test_result:
  status: pass
  started_at: "2026-07-20T06:00:00Z"
  finished_at: "2026-07-20T06:01:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS other-cost-crud.spec.ts � TC-OC-001 � company lumicharmsid"
  report_url: null
---

# TC-OC-001

## Fungsi menu

**Other Cost** — master biaya tambahan + mapping Expense COA untuk transaksi Omni/FA.

## Catatan automation

- Spec: `@TC-OC-001`
