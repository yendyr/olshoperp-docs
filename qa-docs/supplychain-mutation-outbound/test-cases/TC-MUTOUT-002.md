---
doc_type: e2e-test-case
tc_code: TC-MUTOUT-002
menu: supplychain-mutation-outbound
menu_name: "Outbound External"
title: "Update header + tambah detail Select Product"
summary: "Ubah description lalu tambah produk via Select Product (satu dokumen edit, sebelum approve)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-mutation-outbound/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-outbound/mutation-outbound-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-MUTOUT-001 (serial); masih can_update; type Other; origin punya stock."
test_data:
  - field: "Description (updated)"
    value: "OT automation updated {stamp}"
steps:
  - "Edit OT hasil create."
  - "Ubah Description → Save All; verifikasi form + datalist."
  - "Outbound External Detail → Select Product → opsi pertama (available stock)."
  - "Verifikasi SKU muncul di detail table."
expected_result: |
  Description ter-update; line detail tersimpan (SKU terlihat di table, bukan opsi Multiselect hidden).
test_result:
  status: pass
  started_at: "2026-07-15T06:36:25Z"
  finished_at: "2026-07-15T06:37:15Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS mutation-outbound · UPDATE description + Select Product · company lumicharmsid"
  report_url: null
---

# TC-MUTOUT-002

## Catatan automation

- Spec: `@TC-MUTOUT-002` (satu TC — description + Select Product).
- Description: placeholder `Add description or notes...` / `#BasicInformation textarea`.
- Detail API: `POST outbound-middle-detail/{id}/bulk-create`.
- Assert detail: row visible di `#DatalistDetail` table.
