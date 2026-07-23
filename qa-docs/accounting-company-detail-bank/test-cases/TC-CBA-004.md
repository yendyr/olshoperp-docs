---
doc_type: e2e-test-case
tc_code: TC-CBA-004
menu: accounting-company-detail-bank
menu_name: "Cash/Bank Account"
title: "SEARCH — cari Label di datalist"
summary: "Search Label account automation; baris ditemukan."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-company-detail-bank/"
automated: true
automated_spec: "tests/specs/company-detail-bank/company-detail-bank-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Account dari TC-CBA-002/003 ada."
test_data: []
steps:
  - "Buka datalist; search by Label."
  - "Verifikasi baris Label tampil."
expected_result: |
  Search menemukan account.
test_result:
  status: pass
  started_at: "2026-07-20T04:42:30Z"
  finished_at: "2026-07-20T04:43:10Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-CBA-004 SEARCH Label"
  report_url: null
---

# TC-CBA-004

## Catatan automation

- Spec: `@TC-CBA-004`
