---
doc_type: e2e-test-case
tc_code: TC-UPDATE-mutation-inbound
menu: supplychain-mutation-inbound
menu_name: "Purchase Inbound"
title: "Update header + tambah detail Select Product"
summary: "Ubah description lalu tambah produk outstanding PO (satu dokumen edit, sebelum approve)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-mutation-inbound/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-inbound/mutation-inbound-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-CREATE-mutation-inbound (serial); masih can_update; supplier punya outstanding PO."
test_data:
  - field: "Description (updated)"
    value: "IN automation updated {stamp}"
steps:
  - "Edit IN hasil create."
  - "Ubah Description → Save All; verifikasi form + datalist."
  - "Inbound Detail → Select Product → opsi pertama (outstanding PO)."
  - "Verifikasi SKU muncul di detail table."
expected_result: |
  Description ter-update; line detail tersimpan (SKU terlihat).
test_result:
  status: pass
  started_at: "2026-07-15T06:24:00Z"
  finished_at: "2026-07-15T06:25:38Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS mutation-inbound · UPDATE description + Select Product · company lumicharmsid"
  report_url: null
---

# TC-UPDATE-mutation-inbound

## Catatan automation

- Spec: `@TC-UPDATE-mutation-inbound` (satu TC — description + Select Product).
- Draft/Open radio di Form di-comment AS-IS — fokus description + detail.
- Detail API: `POST mutation-inbound-detail/bulk-fifo`.
