---
doc_type: e2e-test-case
tc_code: TC-LOC-001
menu: supplychain-location
menu_name: "Location"
title: "Create Processing Location baru"
summary: "Mendaftarkan master lokasi proses gudang (code + name) untuk Failed Ship / Picking set-location."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-location/requirement.md"
automated: true
automated_spec: "tests/specs/location/location-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-failed-ship
  - supplychain-manual-picking-list
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Akses create Processing Location."
test_data:
  - field: "Code"
    value: "LOC{stamp}"
  - field: "Name"
    value: "East Side {stamp}"
  - field: "Description"
    value: "Location automation — area picking east"
  - field: "Active"
    value: "ON"
  - field: "Show for all company"
    value: "ON (jika toggle visible)"
steps:
  - "Datalist Location → Create."
  - "Isi Code + Name (+ Description)."
  - "Pastikan Active ON; opsional Show for all company ON."
  - "Save & Next → catat code; verifikasi datalist."
expected_result: |
  Location tersimpan; code+name tampil di datalist.
test_result:
  status: pass
  started_at: "2026-07-15T03:06:18Z"
  finished_at: "2026-07-15T03:09:12Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS location-create-update.spec.ts (~2.4m) · CREATE ~49.8s · company lumicharmsid"
  report_url: null
---


# TC-LOC-001

## Catatan automation

- Spec: `@TC-LOC-001`
- Helper: `tests/helpers/location.ts`
- Registry: `tests/pom-registry/location.yaml`
- Accordion: **Processing Location** · placeholder Code `e.g: ES001`
