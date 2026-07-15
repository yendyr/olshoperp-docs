---
doc_type: e2e-test-case
tc_code: TC-UPDATE-mutation-transfer-internal
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
title: "Update header + tambah detail Select Product"
summary: "Ubah description lalu tambah produk via Select Product (satu dokumen edit, sebelum approve)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-transfer-internal/mutation-transfer-internal-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-CREATE-mutation-transfer-internal (serial); masih can_update; origin punya stock."
test_data:
  - field: "Description (updated)"
    value: "TFI automation updated {stamp}"
steps:
  - "Edit TFI hasil create."
  - "Ubah Description → Save All; verifikasi form + datalist."
  - "Product Transfer Detail → Select Product → opsi pertama."
  - "Verifikasi SKU muncul di detail table."
expected_result: |
  Description ter-update; line detail tersimpan (SKU terlihat di table).
test_result:
  status: pass
  started_at: "2026-07-15T07:13:10Z"
  finished_at: "2026-07-15T07:14:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS mutation-transfer-internal · UPDATE description + Select Product · company lumicharmsid"
  report_url: null
---

# TC-UPDATE-mutation-transfer-internal

## Catatan automation

- Spec: `@TC-UPDATE-mutation-transfer-internal` (satu TC — description + Select Product).
- Detail API: `POST mutation-transfer/{id}/mutation-transfer-middle-detail/bulk-fifo`.
- Assert: row visible di `#DatalistDetail` table.
