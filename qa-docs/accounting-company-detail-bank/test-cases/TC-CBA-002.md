---
doc_type: e2e-test-case
tc_code: TC-CBA-002
menu: accounting-company-detail-bank
menu_name: "Cash/Bank Account"
title: "CREATE — Label + Currency + COA Binding"
summary: "Create account unik AT-CBA-*; Type Bank; pilih COA Assets bebas; Description automation playwright; Save & Next."
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
  - "Minimal 1 leaf Assets COA belum terikat cash/bank lain."
test_data:
  - label_prefix: "AT-CBA-"
  - description: "automation playwright"
steps:
  - "Klik Create."
  - "Isi Label unik (≤30); Type Bank (default OK); Currency default/isi."
  - "Pilih COA Binding (Assets belum terpakai)."
  - "Description = automation playwright; Active ON; Save & Next."
expected_result: |
  Redirect /edit/{id}; account tersimpan.
test_result:
  status: pass
  started_at: "2026-07-20T04:42:30Z"
  finished_at: "2026-07-20T04:43:10Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-CBA-002 CREATE (patch is_default=0 staging AS-IS)"
  report_url: null
---

# TC-CBA-002

## Catatan automation

- Spec: `@TC-CBA-002`
- COA harus unik per company (belum dipakai account lain).
