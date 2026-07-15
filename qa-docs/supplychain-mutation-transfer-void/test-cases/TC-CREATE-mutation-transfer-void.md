---
doc_type: e2e-test-case
tc_code: TC-CREATE-mutation-transfer-void
menu: supplychain-mutation-transfer-void
menu_name: "Transfer Void"
title: "Create page smoke + bind Open TFV fixture"
summary: "AS-IS form create tanpa Origin picker — smoke /create lalu pakai TFV Open existing."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-mutation-transfer-void/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-transfer-void/mutation-transfer-void-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-mutation-transfer-scrap
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Minimal 1 dokumen Open di datalist Transfer Void (TFV*)."
test_data: []
steps:
  - "Buka /create — verifikasi Basic Information + Choose Location; Origin Multiselect absen (AS-IS)."
  - "Kembali ke datalist → buka dokumen Open (prefer TFV*)."
  - "Verifikasi URL edit void + code."
expected_result: |
  Create page load; fixture Open terikat untuk serial UPDATE.
test_result:
  status: pass
  started_at: "2026-07-15T07:59:40Z"
  finished_at: "2026-07-15T07:59:58Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS CREATE smoke /create · AS-IS Origin Multiselect absent · datalist Void kosong di lumicharmsid · company lumicharmsid"
  report_url: null
---

# TC-CREATE-mutation-transfer-void

## Fungsi menu

**Transfer Void** — kembalikan stok dari virtual warehouse voided order ke gudang fisik. Prefix docs **TFV***.

## Catatan automation

- **AS-IS FE:** Multiselect Building Origin di Form create di-comment — Save create tidak viable.
- TFV* biasanya auto-generate (bukan manual create).
- Spec: `@TC-CREATE-mutation-transfer-void`
