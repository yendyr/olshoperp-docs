---
doc_type: e2e-test-case
tc_code: TC-TAX-001
menu: accounting-tax
menu_name: "Tax"
title: "VIEW — buka datalist Tax"
summary: "Load /accounting/tax; verifikasi Create + kolom code/Name/Tariff."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-tax/knowledge-base.md"
automated: true
automated_spec: "tests/specs/tax/tax-crud.spec.ts"
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
  - "Buka /accounting/tax."
  - "Verifikasi tombol Create."
  - "Verifikasi kolom code, Name, Tariff."
expected_result: |
  Datalist load; Create terlihat; kolom utama tampil.
test_result:
  status: pass
  started_at: "2026-07-20T04:32:30Z"
  finished_at: "2026-07-20T04:33:30Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS tax-crud.spec.ts · TC-TAX-001 VIEW · company lumicharmsid"
  report_url: null
---

# TC-TAX-001

## Fungsi menu

**Tax** — master tarif pajak + mapping Purchase/Sales COA untuk transaksi.

## Catatan automation

- Spec: `@TC-TAX-001`
