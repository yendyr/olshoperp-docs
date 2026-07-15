---
doc_type: e2e-test-case
tc_code: TC-UPDATE-other-inbound
menu: supplychain-other-inbound
menu_name: "Other Inbound"
title: "Verify edit + Inbound Detail (Select Product bila ada)"
summary: "Buka dokumen dari CREATE fixture; verifikasi Basic Info + Inbound Detail; Select Product jika slot UI ada (AS-IS sering absen)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-other-inbound/requirement.md"
automated: true
automated_spec: "tests/specs/other-inbound/other-inbound-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-CREATE-other-inbound (edit URL + code)."
test_data: []
steps:
  - "Buka edit dokumen Other Inbound."
  - "Verifikasi Basic Information: code IN*, Transaction Date, Location Destination terisi (read-only AS-IS)."
  - "Expand Inbound Detail — tabel detail visible."
  - "Jika Select Product muncul dan can_update: pilih opsi pertama → assert SKU di table."
  - "Jika Select Product absen (AS-IS InventoryOther tanpa slot): assert detail existing / tabel siap; catat gap."
expected_result: |
  Edit form + Inbound Detail terverifikasi. Detail baru hanya jika Select Product viable.
test_result:
  status: pass
  started_at: "2026-07-15T08:20:27Z"
  finished_at: "2026-07-15T08:20:38Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS UPDATE verify Basic Info + Inbound Detail · Select Product slot AS-IS absen · detail existing OK · company lumicharmsid"
  report_url: null
---

# TC-UPDATE-other-inbound

## Catatan automation

- Spec: `@TC-UPDATE-other-inbound`
- Detail API AS-IS: `POST mutation-inbound/{id}/mutation-inbound-detail` (+ `/bulk-fifo`).
- **AS-IS gap:** `InventoryOther/DatalistDetail.vue` punya `createFifoBulk` tetapi **tidak** merender slot `select-product-transfer` (beda `InventoryIn`) — Select Product sering tidak muncul di UI.
- Header always disabled — UPDATE = detail / verifikasi, bukan Save All header.
