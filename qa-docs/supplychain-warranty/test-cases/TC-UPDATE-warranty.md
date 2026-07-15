---
doc_type: e2e-test-case
tc_code: TC-UPDATE-warranty
menu: supplychain-warranty
menu_name: "Warranty"
title: "Update Master Warranty"
summary: "Mengubah Code, Name, dan Description pada Warranty yang sudah terdaftar."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-warranty/requirement.md"
automated: true
automated_spec: "tests/specs/warranty/warranty-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Warranty dari TC Create tersedia — automation serial memakai state create."
  - "User memiliki akses update."
test_data:
  - field: "Source Code"
    value: "dari create (WRT{stamp})"
  - field: "Code (updated)"
    value: "WRU{stamp}"
  - field: "Name (updated)"
    value: "6 Month {stamp}"
  - field: "Description (updated)"
    value: "Warranty di-update — garansi diperpanjang 6 bulan"
steps:
  - "Cari Code hasil create di datalist Warranty."
  - "Klik ikon show/edit (#updateButton) pada baris tersebut."
  - "Ubah Code, Name, dan Description."
  - "Klik Save All."
  - "Verifikasi Code/Name terbaru di datalist; Code lama tidak lagi ada."
expected_result: |
  Perubahan Warranty berhasil tersimpan dan langsung terbarui pada halaman datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~35s) — update di lumicharmsid.
    WRT* → WRU{stamp} / 6 Month {stamp}, Save All, datalist sync; code lama hilang.
  report_url: null
test_data_used:
  - field: "Code / Name (updated)"
    value: "WRU{stamp} / 6 Month {stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-UPDATE-warranty — chain setelah create"
---

# TC-UPDATE-warranty

## Step to reproduce (manual)

1. Login staging → company **Lumi Charms.id**.
2. Menu **Warranty** → search Code dari create (contoh `WRT…`).
3. Klik ikon **show/edit** pada kolom Action.
4. Ubah **Code** → `WRU{unik}`, **Name** → `6 Month {unik}`, update Description.
5. Klik **Save All**.
6. Di datalist: search Code baru → muncul; search Code lama → tidak muncul / sudah diganti.

## Catatan automation

- Spec tag: `@TC-UPDATE-warranty`
- Chain serial setelah `@TC-CREATE-warranty`.
