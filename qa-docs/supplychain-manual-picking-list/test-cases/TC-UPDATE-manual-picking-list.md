---
doc_type: e2e-test-case
tc_code: TC-UPDATE-manual-picking-list
menu: supplychain-manual-picking-list
menu_name: "Manual Picking List"
title: "Update description + status Open"
summary: "Ubah description via Save All; set status Open (syarat Start Picking)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-manual-picking-list/requirement.md"
automated: true
automated_spec: "tests/specs/manual-picking-list/manual-picking-list-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-CREATE-manual-picking-list (serial)."
test_data:
  - field: "Description (updated)"
    value: "MPL automation updated {stamp}"
steps:
  - "Edit PL hasil create."
  - "Ubah Description; set Open."
  - "Save All; verifikasi datalist."
expected_result: |
  Description ter-update; status Open tersimpan.
test_result:
  status: pass
  started_at: "2026-07-15T04:45:00Z"
  finished_at: "2026-07-15T04:48:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "3/3 PASS · UPDATE description + Open OK · company lumicharmsid"
  report_url: null
---

# TC-UPDATE-manual-picking-list

## Catatan automation

- Spec: `@TC-UPDATE-manual-picking-list`
- Name/Description tidak autosave — wajib Save All.
