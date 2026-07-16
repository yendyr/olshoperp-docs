---
doc_type: e2e-test-case
tc_code: TC-WHSTR-001
menu: supplychain-warehouse-structure
menu_name: "Warehouse Structure"
title: "Create Warehouse Structure"
summary: "Membuat struktur atau area gudang baru untuk memetakan hierarki tata letak fisik tempat penyimpanan barang di dalam sistem ERP."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: "qa-docs/supplychain-warehouse-structure/requirement.md"
automated: true
automated_spec: "tests/specs/warehouse-structure/warehouse-structure-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Sudah di halaman datalist Warehouse Structure (`/supplychain/warehouse-structure`)."
  - "User memiliki akses create Warehouse Structure."
  - "Type `40. Rack` tersedia; ada Warehouse Level dengan level > 40 (syarat Drop Off)."
test_data:
  - field: "Code"
    value: "RACK01-Rungkut-{stamp} (tanpa spasi; lokasi Surabaya)"
  - field: "Name"
    value: "Rack 01 WH Rungkut {stamp}"
  - field: "Type"
    value: "40. Rack"
  - field: "Parent Group Name"
    value: "(kosong — opsional; kosongkan agar Show for all company tampil)"
  - field: "Drop Off"
    value: "ON"
  - field: "Active"
    value: "ON"
  - field: "Show for all company"
    value: "ON"
steps:
  - "Klik button Create di halaman datalist Warehouse Structure."
  - "Input Code dan Name secara valid (lokasi Surabaya)."
  - "Parent Group Name opsional — biarkan kosong; pilih Type = 40. Rack."
  - "Aktifkan toggle Drop Off."
  - "Aktifkan toggle Active dan Show for all company."
  - "Klik Save & Next."
  - "Verifikasi baris tampil di datalist; child Drop Off tercipta dan tidak selectable sebagai Parent."
expected_result: |
  Struktur gudang baru berhasil disimpan dan tampil di datalist.
  Sistem membuat child Drop Off (`{code}DROPOFF`) sebagai anak.
  Child Drop Off tidak muncul sebagai opsi Parent Group Name.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~46s) — create + Drop Off di lumicharmsid.
    Code RACK01-Rungkut-{stamp}, Type 40. Rack, Drop Off/Active/Show for all company ON,
    Save & Next → datalist OK; child DROPOFF terverifikasi via select2 is_drop_off=1
    dan excluded dari Parent dropdown.
  report_url: null
test_data_used:
  - field: "Code"
    value: "RACK01-Rungkut-{stamp}"
  - field: "Type"
    value: "40. Rack"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-WHSTR-001 — 2/2 serial PASS"
---

# TC-WHSTR-001

## Catatan automation

- Spec: `tests/specs/warehouse-structure/warehouse-structure-create-update.spec.ts`
- Helper: `tests/helpers/warehouse-structure.ts`
- Registry: `tests/pom-registry/warehouse-structure.yaml`
- Owned By / Manage By mengikuti default (company aktif / Internal).
- Code tidak boleh mengandung spasi.
