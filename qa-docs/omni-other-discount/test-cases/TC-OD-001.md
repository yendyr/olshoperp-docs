---
doc_type: e2e-test-case
tc_code: TC-OD-001
menu: omni-other-discount
menu_name: "Other Discount"
title: "VIEW — buka datalist Other Discount"
summary: "Load /omni/other-discount; verifikasi Create dan kolom code/Name/Description/COA/Applied Stores."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/omni-other-discount/knowledge-base.md"
automated: true
automated_spec: "tests/specs/other-discount/other-discount-crud.spec.ts"
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
  - "Buka /omni/other-discount."
  - "Verifikasi tombol Create (link)."
  - "Verifikasi kolom code, Name, Description."
expected_result: |
  Datalist load; Create terlihat; kolom utama tampil.
test_result:
  status: pass
  started_at: "2026-07-20T06:15:00Z"
  finished_at: "2026-07-20T06:16:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS other-discount-crud.spec.ts � TC-OD-001 � company lumicharmsid"
  report_url: null
---

# TC-OD-001

## Fungsi menu

**Other Discount** — master diskon tambahan + mapping COA untuk transaksi Omni/FA.

## Catatan automation

- Spec: `@TC-OD-001`
