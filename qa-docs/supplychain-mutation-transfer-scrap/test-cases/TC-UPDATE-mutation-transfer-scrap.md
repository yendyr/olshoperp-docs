---
doc_type: e2e-test-case
tc_code: TC-UPDATE-mutation-transfer-scrap
menu: supplychain-mutation-transfer-scrap
menu_name: "Transfer Broken"
title: "Update status + tambah detail Select Product"
summary: "Status Open (jika tersedia) lalu Select Product — description locked AS-IS on edit."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-mutation-transfer-scrap/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-transfer-scrap/mutation-transfer-scrap-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-CREATE-mutation-transfer-scrap (serial); masih can_update; origin punya stock."
test_data: []
steps:
  - "Edit TFS hasil create."
  - "Set status Open jika radio tersedia (description disabled on edit AS-IS)."
  - "Product Transfer Detail → Select Product → opsi pertama."
  - "Verifikasi SKU muncul di detail table."
expected_result: |
  Line detail tersimpan; SKU terlihat di table.
test_result:
  status: pass
  started_at: "2026-07-15T07:47:00Z"
  finished_at: "2026-07-15T07:47:20Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS mutation-transfer-scrap · UPDATE status + Select Product · company lumicharmsid"
  report_url: null
---

# TC-UPDATE-mutation-transfer-scrap

## Catatan automation

- Spec: `@TC-UPDATE-mutation-transfer-scrap` (satu TC — status/Open + Select Product).
- Description FormTextarea: `:disabled` saat `is_edit` — tidak diubah di UPDATE.
- Detail API: `POST mutation-transfer-scrap/{id}/transfer-scrap-middle-detail/bulk-fifo`.
