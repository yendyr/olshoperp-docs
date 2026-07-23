---
doc_type: e2e-test-case
tc_code: TC-FP-004
menu: accounting-fiscal-period
menu_name: "Fiscal Period"
title: "SEARCH — December 2024 di datalist"
summary: "Searchbox 'December 2024' atau Dec-2024; baris dengan name dan/atau PERIOD 01-Dec-2024 - 31-Dec-2024 tampil."
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
  - "TC-FP-002: period Dec 2024 tersedia."
test_data:
  - search: "December 2024"
steps:
  - "Buka datalist Fiscal Period."
  - "Ketik search December 2024."
  - "Verifikasi baris name December 2024 dan/atau PERIOD mengandung Dec-2024."
expected_result: |
  Minimal 1 baris period Dec 2024 tampil.
test_result:
  status: pass
  started_at: "2026-07-20T05:55:00Z"
  finished_at: "2026-07-20T05:56:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-FP-004 SEARCH December 2024"
  report_url: null
---

# TC-FP-004

## Catatan automation

- Spec: `@TC-FP-004`
- Prefer search by name (PERIOD search punya quirk length).
