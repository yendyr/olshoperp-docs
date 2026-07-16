---
doc_type: e2e-test-case
tc_code: TC-UNIT-001
menu: supplychain-unit
menu_name: "Unit"
title: "Create new unit"
summary: "Buat unit baru (Code, Name, Unit Class, Conversion Rate, Description, Active) lalu verifikasi tampil di datalist."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: "qa-docs/supplychain-unit/requirement.md"
automated: true
automated_spec: "tests/specs/unit/unit-create.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Sudah berada di halaman datalist Unit (`/supplychain/unit`)."
  - "User memiliki akses create Unit."
  - "Unit Class Pieces tersedia di dropdown Choose Unit Class."
test_data:
  - field: "Code"
    value: "BOX"
  - field: "Name"
    value: "Box Besar"
  - field: "Unit Class"
    value: "Pieces"
  - field: "Conversion Rate to Base Unit"
    value: "1"
  - field: "Description"
    value: "Satuan untuk kardus besar isi produk"
  - field: "Active"
    value: "ON (toggle aktif)"
steps:
  - "Klik button Create di halaman datalist Unit."
  - "Input data pada field Code dan Name sesuai test data."
  - "Pilih opsi pada dropdown Unit Class sesuai test data (Pieces)."
  - "Input angka pada field Conversion Rate to Base Unit sesuai test data."
  - "Input catatan pada field Description (opsional) sesuai test data."
  - "Klik komponen toggle Active hingga berubah aktif/hijau (unit dapat digunakan di menu terkait)."
  - "Klik tombol Save & Next."
  - "Buka kembali datalist Unit, cari berdasarkan Code; verifikasi baris unit baru tampil."
expected_result: |
  Data unit baru berhasil tersimpan ke sistem.
  Setelah Save & Next, sistem mengarahkan ke halaman edit unit.
  Unit dengan Code/Name sesuai data tersimpan tampil di halaman utama datalist Unit.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~21s) — create Unit di lumicharmsid (153).
    Code TC "BOX" sudah ada di datalist → automation memakai Code/Name unik
    BOX-AT-{stamp} / Box Besar {stamp} (Pieces, rate 1, Active ON, description sesuai TC).
    Save & Next → redirect edit → unit tampil di datalist.
  report_url: null
test_data_used:
  - field: "Code"
    value: "BOX-AT-{stamp} (fallback; TC value BOX sudah exists)"
  - field: "Name"
    value: "Box Besar {stamp}"
  - field: "Unit Class"
    value: "Pieces"
  - field: "Conversion Rate to Base Unit"
    value: "1"
  - field: "Description"
    value: "Satuan untuk kardus besar isi produk"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-UNIT-001 — tests/specs/unit/unit-create.spec.ts"
---

# TC-UNIT-001

## Catatan automation

- Spec: `tests/specs/unit/unit-create.spec.ts` (tag `@TC-UNIT-001`)
- Helper: `tests/helpers/unit.ts`
- Registry: `tests/pom-registry/unit.yaml`
- Jika Code `BOX` sudah terpakai, automation mengubah ke `BOX-AT-{stamp}`.
