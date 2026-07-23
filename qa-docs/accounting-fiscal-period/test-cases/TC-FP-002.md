---
doc_type: e2e-test-case
tc_code: TC-FP-002
menu: accounting-fiscal-period
menu_name: "Fiscal Period"
title: "CREATE — pastikan periode December 2024 (01–31 Dec 2024)"
summary: "Idempotent: search December 2024; jika belum ada, create Name=December 2024, Start=01-12-2024, End=31-12-2024; Description=automation playwright."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-fiscal-period/knowledge-base.md"
automated: true
automated_spec: "tests/specs/fiscal-period/fiscal-period-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-chart-of-account
preconditions:
  - "Company punya Retained Profit/Loss + Current Profit/Loss COA (syarat create fiscal period)."
test_data:
  - name: "December 2024"
  - period_start: "01-12-2024"
  - period_end: "31-12-2024"
  - description: "automation playwright"
steps:
  - "Search datalist 'December 2024' (atau PERIOD Dec-2024)."
  - "Jika baris sudah ada → buka edit; anggap ensure-exists PASS."
  - "Jika belum: Create → isi Name, Start 01-12-2024, End 31-12-2024, Description automation playwright → Save & Next."
  - "Jika create gagal overlap → search ulang PERIOD Dec 2024 → buka period yang cover."
expected_result: |
  Period covering 01–31 Dec 2024 tersedia (baru dibuat atau sudah ada); form edit terbuka.
test_result:
  status: pass
  started_at: "2026-07-20T05:55:00Z"
  finished_at: "2026-07-20T05:56:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-FP-002 ensure December 2024 (01-12-2024 … 31-12-2024) · lumicharmsid"
  report_url: null
---

# TC-FP-002

## Catatan automation

- Spec: `@TC-FP-002`
- Uniqueness = date overlap, bukan unique name/month.
