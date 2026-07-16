---
doc_type: e2e-test-case
tc_code: TC-WHSTR-002
menu: supplychain-warehouse-structure
menu_name: "Warehouse Structure"
title: "Update Warehouse Structure"
summary: "Mengubah informasi kode, nama, tipe, atau status relasi kompabilitas distribusi pada data struktur gudang yang telah terdaftar."
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
  - "User memiliki akses update Warehouse Structure."
  - "AS-IS: warehouse yang punya child Drop Off tidak bisa Save All — child code di-set `{code} - Drop OFF` (mengandung spasi) → ditolak. Automation update memakai WH sekunder tanpa Drop Off."
test_data:
  - field: "Code (source)"
    value: "RACK01-Gubeng-{stamp} (WH baru tanpa Drop Off)"
  - field: "Code (updated)"
    value: "RACK01-Gubeng-UP-{stamp}"
steps:
  - "Buat Warehouse Structure tanpa Drop Off sebagai subject update (workaround AS-IS defect)."
  - "Klik action edit/show pada Warehouse Structure tersebut."
  - "Update field Code (tanpa spasi)."
  - "Klik tombol Save All."
  - "Verifikasi datalist menampilkan Code terbaru; WH Drop Off dari create tetap ada."
expected_result: |
  Perubahan Code berhasil tersimpan dan langsung terbarui di datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~1.4m) — create WH sekunder tanpa Drop Off lalu update Code
    RACK01-Gubeng-{stamp} → RACK01-Gubeng-UP-{stamp}, Save All, datalist OK.
    Drop Off parent dari TC-CREATE tetap tampil (sanity).
  report_url: null
test_data_used:
  - field: "Code (updated)"
    value: "RACK01-Gubeng-UP-{stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-WHSTR-002 — chain setelah create; workaround Drop Off update bug"
---

# TC-WHSTR-002

## Catatan automation

- Spec tag: `@TC-WHSTR-002`
- **Known AS-IS defect:** `WarehouseController::update_warehouse` untuk drop-off set `code = "{code} - Drop OFF"` → gagal `MainModelObserver` (no spaces). Update Code pada parent hasil TC-CREATE (Drop Off ON) **tidak viable** sampai bug diperbaiki.
- Workaround automation: subject update = WH baru **tanpa** Drop Off (lokasi Surabaya: Gubeng).
