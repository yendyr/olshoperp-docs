---
doc_type: e2e-test-case
tc_code: TC-CREATE-warehouse-level
menu: supplychain-warehouse-type
menu_name: "Warehouse Level"
title: "Create Warehouse Level"
summary: "Membuat tingkatan hierarki gudang baru secara valid untuk mengatur tingkatan struktur penempatan aset atau area operasional logistik."
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
  - "Sudah di halaman datalist Warehouse Level (`/supplychain/warehouse-type`)."
  - "User memiliki akses create Warehouse Level."
  - "Angka Level belum terpakai (unique) — prefer 88, fallback jika bentrok."
test_data:
  - field: "Warehouse Level Name"
    value: "Rungkut (lokasi Surabaya; fallback Rungkut AT-{stamp} jika exists)"
  - field: "Level"
    value: "88 (fallback level bebas jika unique gagal)"
  - field: "Description"
    value: "Hierarki gudang — area operasional logistik Surabaya (Rungkut)"
  - field: "Active"
    value: "ON"
  - field: "Show in Reports"
    value: "ON"
steps:
  - "Klik button Create di halaman datalist Warehouse Level."
  - "Input data pada field Warehouse Level Name dan Level secara valid."
  - "Input catatan pelengkap pada field Description."
  - "Klik toggle Active hingga hijau/aktif."
  - "Klik toggle Show in Reports hingga aktif."
  - "Klik button Save & Next."
  - "Verifikasi data tampil di datalist Warehouse Level; Show in Reports masih ON di edit."
expected_result: |
  Data Warehouse Level baru berhasil disimpan dan tampil di datalist.
  Toggle Show in Reports aktif (level ini tersedia sebagai filter di Inventory Detail / Real Time Stock — verifikasi filter laporan di luar scope automation CRUD ini).
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~35s) — create Warehouse Level di lumicharmsid (153).
    Name prefer Rungkut (suffix AT-{stamp} jika exists), Level prefer 88
    (fallback level bebas jika unique), Description diisi, Active ON,
    Show in Reports ON, Save & Next → redirect edit → tampil di datalist.
  report_url: null
test_data_used:
  - field: "Warehouse Level Name"
    value: "Rungkut (atau Rungkut AT-{stamp})"
  - field: "Level"
    value: "88 (atau fallback unique)"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-CREATE-warehouse-level — 2/2 serial PASS (~1.2m total)"
---

# TC-CREATE-warehouse-level

## Catatan automation

- Spec: `tests/specs/warehouse-type/warehouse-type-create-update.spec.ts` (tag `@TC-CREATE-warehouse-level`)
- Helper: `tests/helpers/warehouse-type.ts`
- Registry: `tests/pom-registry/warehouse-type.yaml`
- Level wajib unique (AS-IS V-02); jika `88` sudah ada → automation pilih level bebas.
- Nama prefer lokasi Surabaya: **Rungkut**.
- Chain: hasil create dipakai `@TC-UPDATE-warehouse-level` dalam `describe.serial`.
