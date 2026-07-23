---
doc_type: e2e-test-case
tc_code: TC-JRN-001
menu: journal
menu_name: "Journal"
title: "VIEW — buka datalist Journal"
summary: "Load /accounting/journal; verifikasi Create."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/journal/knowledge-base.md"
automated: true
automated_spec: "tests/specs/journal/journal-manual-create.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-fiscal-period
  - accounting-chart-of-account
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data: []
steps:
  - "Buka /accounting/journal."
  - "Verifikasi tombol Create."
expected_result: |
  Datalist load; Create terlihat.
test_result:
  status: pass
  started_at: "2026-07-20T06:30:00Z"
  finished_at: "2026-07-20T06:31:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "3/3 PASS journal-manual-create.spec.ts � TC-JRN-001 � company lumicharmsid"
  report_url: null
---

# TC-JRN-001

## Fungsi menu

**Journal** — pencatatan jurnal FA (manual / sistem).

## Catatan automation

- Spec: `@TC-JRN-001`
