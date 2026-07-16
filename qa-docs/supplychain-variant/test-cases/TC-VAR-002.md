---
doc_type: e2e-test-case
tc_code: TC-VAR-002
menu: supplychain-variant
menu_name: "Variant"
title: "Update Variant Group"
summary: "Mengubah code, nama kelompok varian, serta menambah/mengurangi daftar pilihan opsi variasi yang sudah terdaftar sebelumnya."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: null
automated: true
automated_spec: "tests/specs/variant/variant-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Variant Group dari TC Create tersedia — automation serial memakai state create."
  - "User memiliki akses update."
test_data:
  - field: "Source"
    value: "COL{stamp} / Color-{stamp} / options Red, Blue, Green"
  - field: "Code (updated)"
    value: "CU{stamp}"
  - field: "Variant Group Name (updated)"
    value: "ClrUp-{stamp} (≤14 chars)"
  - field: "Option removed"
    value: "Green"
steps:
  - "Klik action show/edit pada Variant Group hasil create."
  - "Update Code dan Variant Group Name."
  - "Hapus salah satu option (Green) dari field Option Name."
  - "Klik Save All."
  - "Verifikasi datalist menampilkan Code/Name terbaru; option Green tidak lagi ada."
expected_result: |
  Perubahan data Variant Group berhasil tersimpan dan langsung terbarui pada halaman datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~45s) — update di lumicharmsid (153).
    COL* → CU{stamp} / ClrUp-{stamp}, hapus option Green, Save All,
    Red+Blue tetap, Green hilang dari datalist.
  report_url: null
test_data_used:
  - field: "Code (updated)"
    value: "CU{stamp}"
  - field: "Name (updated)"
    value: "ClrUp-{stamp}"
  - field: "Option removed"
    value: "Green"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-VAR-002 — re-run lumicharmsid"
---

# TC-VAR-002

## Catatan automation

- Spec tag: `@TC-VAR-002`
- Draft title "Update Dimension & Weight Label" diabaikan (copy-paste).
- Name/option max **14** karakter (AS-IS `VariantController`).
- Company: **lumicharmsid (153)**.
