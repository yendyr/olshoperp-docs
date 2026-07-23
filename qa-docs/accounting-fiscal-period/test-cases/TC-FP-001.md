---
doc_type: e2e-test-case
tc_code: TC-FP-001
menu: accounting-fiscal-period
menu_name: "Fiscal Period"
title: "VIEW — buka datalist Fiscal Period"
summary: "Load /accounting/fiscal-period; verifikasi Create dan kolom NAME/PERIOD/DESCRIPTION/STATUS."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-fiscal-period/knowledge-base.md"
automated: true
automated_spec: "tests/specs/fiscal-period/fiscal-period-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Akses view Fiscal Period."
test_data: []
steps:
  - "Buka /accounting/fiscal-period."
  - "Verifikasi tombol Create (link)."
  - "Verifikasi kolom NAME, PERIOD, DESCRIPTION, STATUS."
expected_result: |
  Datalist load; Create terlihat; kolom utama tampil.
test_result:
  status: pass
  started_at: "2026-07-20T05:55:00Z"
  finished_at: "2026-07-20T05:56:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS fiscal-period-crud.spec.ts · TC-FP-001 VIEW · company lumicharmsid"
  report_url: null
---

# TC-FP-001

## Fungsi menu

**Fiscal Period** — master rentang periode akuntansi (FA → Master).

## Catatan automation

- Spec: `@TC-FP-001`
