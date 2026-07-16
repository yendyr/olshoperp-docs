---
doc_type: e2e-test-case
tc_code: TC-DWL-002
menu: supplychain-dimension-and-weight-label
menu_name: "Dimension & Weight Label"
title: "Update Dimension & Weight Label"
summary: "Mengubah Code dan Name pada Dimension & Weight Label yang sudah dibuat sebelumnya."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: "qa-docs/supplychain-dimension-and-weight-label/requirement.md"
automated: true
automated_spec: "tests/specs/dimension-and-weight/dimension-and-weight-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Label dari TC Create (`DW-AT-{stamp}`) sudah ada — automation serial memakai state create."
  - "User memiliki akses update."
test_data:
  - field: "Source"
    value: "DW-AT-{stamp} / Parcel Standard {stamp}"
  - field: "Code (updated)"
    value: "DW-UP-{stamp}"
  - field: "Name (updated)"
    value: "Parcel Updated {stamp}"
steps:
  - "Klik action show/edit pada Dimension & Weight Label hasil create."
  - "Update field Code dan Name."
  - "Klik tombol Save All."
  - "Verifikasi datalist menampilkan Code/Name terbaru."
expected_result: |
  Perubahan data Dimension & Weight Label berhasil tersimpan dan langsung terbarui pada halaman datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~44s) — update setelah create di lumicharmsid.
    DW-AT-* → DW-UP-{stamp} / Parcel Updated {stamp}, Save All, datalist OK.
  report_url: null
test_data_used:
  - field: "Code (updated)"
    value: "DW-UP-{stamp}"
  - field: "Name (updated)"
    value: "Parcel Updated {stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-DWL-002 — chain setelah create"
---

# TC-DWL-002

## Catatan automation

- Spec tag: `@TC-DWL-002`
- Draft TC menyebut "Warehouse Level" di steps — diabaikan (copy-paste); subject = Dimension & Weight Label.
