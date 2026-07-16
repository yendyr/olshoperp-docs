---
doc_type: e2e-test-case
tc_code: TC-WHTYPE-002
menu: supplychain-warehouse-type
menu_name: "Warehouse Level"
title: "Update Warehouse Level"
summary: "Mengubah informasi nama, angka tingkatan, atau status aktif pada data tingkatan gudang yang sudah terdaftar sebelumnya."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: "qa-docs/supplychain-warehouse-type/requirement.md"
automated: true
automated_spec: "tests/specs/warehouse-type/warehouse-type-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Warehouse Level dari TC Create (Rungkut / Level 88+) sudah ada — automation serial memakai state create."
  - "User memiliki akses update Warehouse Level."
  - "Field Level masih editable (tidak `have_relation`)."
test_data:
  - field: "Source (dari create)"
    value: "Name Rungkut(+), Level 88(+)"
  - field: "Warehouse Level Name (updated)"
    value: "Gubeng UP-{stamp} (lokasi Surabaya)"
  - field: "Level (updated)"
    value: "2 (sesuai steps TC; fallback jika unique bentrok)"
steps:
  - "Klik action edit/show pada Warehouse Level hasil create."
  - "Update Warehouse Level Name (Gubeng) dan Level menjadi 2 (atau level bebas jika 2 sudah dipakai)."
  - "Klik tombol Save (UI AS-IS edit: Save All — TC menyebut Save & Next)."
  - "Verifikasi datalist menampilkan Name/Level terbaru."
expected_result: |
  Perubahan data Warehouse Level berhasil tersimpan dan langsung terbarui pada halaman datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~31s) — update setelah create di lumicharmsid.
    Source dari create → Name Gubeng UP-{stamp}, Level 2 (atau fallback
    unique), Save All (AS-IS edit), datalist terbarui; name lama hilang.
  report_url: null
test_data_used:
  - field: "Warehouse Level Name (updated)"
    value: "Gubeng UP-{stamp}"
  - field: "Level (updated)"
    value: "2 (atau fallback unique)"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-WHTYPE-002 — chain setelah TC-WHTYPE-001"
---

# TC-WHTYPE-002

## Catatan automation

- Spec: `tests/specs/warehouse-type/warehouse-type-create-update.spec.ts` (tag `@TC-WHTYPE-002`)
- Harus dijalankan setelah create dalam `describe.serial`.
- UI edit button = **Save All** (bukan Save & Next).
- Test data create Level `"1"` di draft TC diabaikan; ikut **steps**: Level → `2`.
