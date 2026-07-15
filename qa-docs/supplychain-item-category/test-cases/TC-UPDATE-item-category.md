---
doc_type: e2e-test-case
tc_code: TC-UPDATE-item-category
menu: supplychain-item-category
menu_name: "Item Category"
title: "Update Item Category"
summary: "Update Code/Name Item Category hasil create sebelumnya; verifikasi datalist data terbaru."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: "qa-docs/supplychain-item-category/requirement.md"
automated: true
automated_spec: "tests/specs/item-category/item-category-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Item Category dari TC Create (`CAT029` / `CAT029-AT-{stamp}`) sudah ada — automation serial memakai state create."
  - "User memiliki akses update Item Category."
test_data:
  - field: "Code (source)"
    value: "dari hasil create (CAT029 atau CAT029-AT-{stamp})"
  - field: "Name (source)"
    value: "Baterai AAA (+ stamp jika create fallback)"
  - field: "Code (updated)"
    value: "CAT029-UP-{stamp}"
  - field: "Name (updated)"
    value: "BATERAI AAA UPD {stamp}"
steps:
  - "Klik action show/edit pada Item Category hasil create sebelumnya."
  - "Update field Code dan Name ke nilai unik sesuai automation."
  - "Klik tombol Save (UI edit: Save All)."
  - "Verifikasi datalist menampilkan Code/Name terbaru; code lama tidak lagi jadi baris exact."
expected_result: |
  Data Item Category yang diubah berhasil tersimpan.
  Datalist menampilkan Code dan Name terbaru.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~28s) — update setelah create di lumicharmsid.
    Source dari create → CAT029-UP-{stamp} / BATERAI AAA UPD {stamp},
    Save All, verifikasi datalist.
  report_url: null
test_data_used:
  - field: "Code (updated)"
    value: "CAT029-UP-{stamp}"
  - field: "Name (updated)"
    value: "BATERAI AAA UPD {stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-UPDATE-item-category — chain setelah TC-CREATE-item-category"
---

# TC-UPDATE-item-category

## Catatan automation

- Spec: `tests/specs/item-category/item-category-create-update.spec.ts` (tag `@TC-UPDATE-item-category`)
- Harus dijalankan setelah create dalam `describe.serial` (shared `createdCode`).
