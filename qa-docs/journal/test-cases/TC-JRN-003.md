---
doc_type: e2e-test-case
tc_code: TC-JRN-003
menu: journal
menu_name: "Journal"
title: "SEARCH — journal code di datalist"
summary: "Search code journal yang dibuat TC-JRN-002; baris tampil."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/journal/knowledge-base.md"
automated: true
automated_spec: "tests/specs/journal/journal-manual-create.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "TC-JRN-002 selesai."
test_data: []
steps:
  - "Buka datalist Journal."
  - "Search code journal."
  - "Verifikasi baris tampil."
expected_result: |
  Journal code ditemukan di datalist.
test_result:
  status: pass
  started_at: "2026-07-20T06:30:00Z"
  finished_at: "2026-07-20T06:31:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "3/3 PASS journal-manual-create.spec.ts � TC-JRN-003 � company lumicharmsid"
  report_url: null
---

# TC-JRN-003

## Catatan automation

- Spec: `@TC-JRN-003`
