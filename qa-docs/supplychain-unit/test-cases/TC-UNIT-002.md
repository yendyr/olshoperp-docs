---
doc_type: e2e-test-case
tc_code: TC-UNIT-002
menu: supplychain-unit
menu_name: "Unit"
title: "Update unit"
summary: "Mengubah data pada sebuah unit yang pernah dibuat sebelumnya (Code/Name + Show for all company)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: "qa-docs/supplychain-unit/requirement.md"
automated: true
automated_spec: "tests/specs/unit/unit-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Unit hasil create sebelumnya (`BOX-AT-{stamp}`) tersedia di datalist; jika tidak ada, automation create dulu."
  - "User memiliki akses update Unit."
test_data:
  - field: "Code (source)"
    value: "BOX-AT-{stamp} (unit dari TC Create)"
  - field: "Description"
    value: "Satuan untuk kardus besar isi produk"
  - field: "Show for all company"
    value: "ON (toggle aktif)"
  - field: "Code (updated)"
    value: "BOX-UP-{stamp} (disesuaikan automation)"
  - field: "Name (updated)"
    value: "Box Updated {stamp}"
steps:
  - "Klik action show/edit pada unit yang ditentukan di test data (Code BOX-AT-{stamp})."
  - "Update field Code (dari BOX-AT-{stamp} ke code baru) dan Name sesuai keputusan automation."
  - "Pastikan Description tetap sesuai test data."
  - "Aktifkan toggle Show for all company."
  - "Klik tombol Save (UI: Save All)."
  - "Buka datalist Unit; verifikasi baris tampil dengan Code/Name terbaru."
expected_result: |
  Data unit yang diubah berhasil tersimpan ke sistem.
  Unit tampil di datalist sesuai Code dan Name terbaru.
  Toggle Show for all company dalam keadaan aktif.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~44s) — update Unit di lumicharmsid (153).
    Source BOX-AT-* → Code BOX-UP-{stamp} / Name Box Updated {stamp},
    Description dipertahankan, Show for all company ON, Save All,
    data terbaru tampil di datalist.
  report_url: null
test_data_used:
  - field: "Code (source)"
    value: "BOX-AT-* (dari create sebelumnya)"
  - field: "Code (updated)"
    value: "BOX-UP-{stamp}"
  - field: "Name (updated)"
    value: "Box Updated {stamp}"
  - field: "Description"
    value: "Satuan untuk kardus besar isi produk"
  - field: "Show for all company"
    value: "ON"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-UNIT-002 — tests/specs/unit/unit-update.spec.ts"
---

# TC-UNIT-002

## Catatan automation

- Spec: `tests/specs/unit/unit-update.spec.ts` (tag `@TC-UNIT-002`)
- Helper: `tests/helpers/unit.ts`
- Registry: `tests/pom-registry/unit.yaml`
- Bergantung pada unit `BOX-AT-*` dari create; jika tidak ditemukan, spec membuatnya dulu.
