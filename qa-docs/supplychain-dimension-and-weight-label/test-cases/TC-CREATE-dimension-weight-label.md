---
doc_type: e2e-test-case
tc_code: TC-CREATE-dimension-weight-label
menu: supplychain-dimension-and-weight-label
menu_name: "Dimension & Weight Label"
title: "Create new Dimension & Weight Label"
summary: "Membuat label dimensi dan berat baru secara valid untuk mengelompokkan standar ukuran volume dan bobot paket atau produk di dalam sistem."
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
  - "Sudah di halaman datalist Dimension & Weight Label (`/supplychain/dimension-and-weight-label`)."
  - "User memiliki akses create."
test_data:
  - field: "Code"
    value: "DW-AT-{stamp}"
  - field: "Name"
    value: "Parcel Standard {stamp}"
  - field: "Active"
    value: "ON"
  - field: "Show for all company"
    value: "ON"
steps:
  - "Klik button Create di halaman datalist Dimension & Weight Label."
  - "Input Code dan Name secara valid."
  - "Aktifkan toggle Active dan Show for all company."
  - "Klik Save & Next."
  - "Verifikasi data tampil di datalist."
expected_result: |
  Dimension & Weight Label baru berhasil disimpan dan tampil di halaman datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~50s) — create di lumicharmsid.
    Code DW-AT-{stamp} / Name Parcel Standard {stamp}, Active + Show for all company ON,
    Save & Next → tampil di datalist.
  report_url: null
test_data_used:
  - field: "Code"
    value: "DW-AT-{stamp}"
  - field: "Name"
    value: "Parcel Standard {stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-CREATE-dimension-weight-label — 2/2 serial PASS (~1.8m)"
---

# TC-CREATE-dimension-weight-label

## Catatan automation

- Spec: `tests/specs/dimension-and-weight/dimension-and-weight-create-update.spec.ts`
- Helper: `tests/helpers/dimension-and-weight.ts`
- Registry: `tests/pom-registry/dimension-and-weight.yaml`
- Chain: hasil create dipakai `@TC-UPDATE-dimension-weight-label`.
