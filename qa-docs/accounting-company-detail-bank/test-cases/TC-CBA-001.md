---
doc_type: e2e-test-case
tc_code: TC-CBA-001
menu: accounting-company-detail-bank
menu_name: "Cash/Bank Account"
title: "VIEW — buka datalist Cash/Bank Account"
summary: "Load /accounting/company-detail-bank; verifikasi Create + kolom Type/Label/Curr/COA."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-company-detail-bank/"
automated: true
automated_spec: "tests/specs/company-detail-bank/company-detail-bank-crud.spec.ts"
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
  - "Buka /accounting/company-detail-bank."
  - "Verifikasi tombol Create."
  - "Verifikasi kolom Type, Label, Curr., COA."
expected_result: |
  Datalist load; Create terlihat; kolom utama tampil.
test_result:
  status: pass
  started_at: "2026-07-20T04:42:30Z"
  finished_at: "2026-07-20T04:43:10Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS company-detail-bank-crud.spec.ts · TC-CBA-001 VIEW · company lumicharmsid"
  report_url: null
---

# TC-CBA-001

## Fungsi menu

**Cash/Bank Account** — master rekening kas/bank perusahaan + binding COA Assets.

## Catatan automation

- Spec: `@TC-CBA-001`
- UI route AS-IS: `company-detail-bank` (bukan `cash/bank-account`).
