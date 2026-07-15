---
doc_type: e2e-test-case
tc_code: TC-UPDATE-mutation-transfer-void
menu: supplychain-mutation-transfer-void
menu_name: "Transfer Void"
title: "Update status + tambah detail Select Product"
summary: "Status Open (jika bisa) lalu Select Product pada dokumen Open dari CREATE fixture."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-mutation-transfer-void/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-transfer-void/mutation-transfer-void-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen Open dari TC-CREATE-mutation-transfer-void; masih can_update; origin punya stock."
test_data: []
steps:
  - "Edit dokumen Open."
  - "Set status Open jika radio enabled."
  - "Transfer Product Detail → Select Product → opsi pertama."
  - "Verifikasi SKU di detail table."
expected_result: |
  Line detail tersimpan; SKU terlihat.
test_result:
  status: blocked
  started_at: "2026-07-15T07:59:58Z"
  finished_at: "2026-07-15T08:00:07Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "SKIPPED — datalist Transfer Void kosong di lumicharmsid (tidak ada fixture TFV* Open); form create AS-IS tidak bisa isi Origin"
  report_url: null
---

# TC-UPDATE-mutation-transfer-void

## Catatan automation

- Spec: `@TC-UPDATE-mutation-transfer-void`
- Detail API AS-IS: `POST mutation-transfer/{id}/mutation-transfer-middle-detail/bulk-fifo`.
- Description FormTextarea selalu `:disabled="true"`.
