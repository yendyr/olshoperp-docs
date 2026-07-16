---
doc_type: e2e-test-case
tc_code: TC-OINB-001
menu: supplychain-other-inbound
menu_name: "Other Inbound"
title: "Create page smoke + bind Open/existing IN fixture"
summary: "AS-IS form create semua field disabled + no submit() — smoke /create lalu bind dokumen existing dari datalist."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-other-inbound/requirement.md"
automated: true
automated_spec: "tests/specs/other-inbound/other-inbound-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-mutation-inbound
  - supplychain-assembly
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Ideal: minimal 1 dokumen di datalist Other Inbound (IN*, sering dari Assembly)."
test_data: []
steps:
  - "Buka /supplychain/other-inbound/create (datalist AS-IS tanpa tombol Create)."
  - "Verifikasi Basic Information: Transaction Code / Date / Location Destination / Description semua disabled; tidak ada Save."
  - "Kembali ke datalist → buka dokumen existing (prefer Open/Draft, else baris pertama)."
  - "Verifikasi URL edit other-inbound + code IN*."
expected_result: |
  Create page load sebagai smoke; fixture existing terikat untuk serial UPDATE.
test_result:
  status: pass
  started_at: "2026-07-15T08:20:00Z"
  finished_at: "2026-07-15T08:20:27Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS CREATE smoke /create · header disabled + no Save · bind IN* existing · company lumicharmsid"
  report_url: null
---

# TC-OINB-001

## Fungsi menu

**Other Inbound** — penerimaan stok tanpa supplier / PO (subset Purchase Inbound). Prefix **IN***. Sering auto-generate dari Assembly Work Order.

## Catatan automation

- Spec: `@TC-OINB-001`
- **AS-IS FE (G-02):** `InventoryOther/Form.vue` — semua header `:disabled="true"`; **tidak ada `submit()`** — create manual via UI tidak viable.
- Datalist **tanpa** tombol Create — deep-link `/create` only.
- Create programmatic: `StockMutationInboundController@store(other: true)` (Assembly job).
