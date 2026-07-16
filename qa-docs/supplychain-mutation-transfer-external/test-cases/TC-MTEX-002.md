---
doc_type: e2e-test-case
tc_code: TC-MTEX-002
menu: supplychain-mutation-transfer-external
menu_name: "External Transfer"
title: "Update header + tambah detail Select Product"
summary: "Ubah description lalu tambah produk via Select Product (satu dokumen edit, sebelum approve)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-mutation-transfer-external/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-transfer-external/mutation-transfer-external-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-MTEX-001 (serial); masih can_update; origin punya stock."
test_data:
  - field: "Description (updated)"
    value: "TFE automation updated {stamp}"
steps:
  - "Edit TFE hasil create."
  - "Ubah Description → Save All; verifikasi form + datalist."
  - "Product Transfer Detail → Select Product → opsi pertama."
  - "Verifikasi SKU muncul di detail table."
expected_result: |
  Description ter-update; line detail tersimpan (SKU terlihat di table).
test_result:
  status: pass
  started_at: "2026-07-15T07:23:00Z"
  finished_at: "2026-07-15T07:24:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS mutation-transfer-external · UPDATE description + Select Product · company lumicharmsid"
  report_url: null
---

# TC-MTEX-002

## Catatan automation

- Spec: `@TC-MTEX-002` (satu TC — description + Select Product).
- Detail API: `POST mutation-transfer-external/{id}/transfer-external-middle-detail/bulk-fifo`.
- Assert: row visible di `#DatalistDetail` table.
