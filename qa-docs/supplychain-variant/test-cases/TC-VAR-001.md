---
doc_type: e2e-test-case
tc_code: TC-VAR-001
menu: supplychain-variant
menu_name: "Variant"
title: "Create new Variant Group"
summary: "Menambahkan jenis variasi baru (seperti warna atau ukuran) beserta pilihan opsinya agar produk bisa dibedakan jenisnya dengan rapi di sistem."
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
  - "Sudah di halaman datalist Variant (`/supplychain/variant`)."
  - "User memiliki akses create Variant Group."
  - "AS-IS: Name & Option Name max 14 karakter."
test_data:
  - field: "Code"
    value: "COL{stamp}"
  - field: "Variant Group Name"
    value: "Color-{stamp} (≤14 chars)"
  - field: "Option Name"
    value: "Red, Blue, Green (tiap opsi + Enter)"
  - field: "Active"
    value: "ON"
steps:
  - "Klik button Create di halaman datalist Variant."
  - "Input Code dan Variant Group Name secara valid."
  - "Input Option Name satu per satu; tekan Enter agar setiap opsi tersimpan sebagai tag."
  - "Aktifkan toggle Active."
  - "Klik Save & Next."
  - "Verifikasi Variant Group tampil di datalist."
expected_result: |
  Variant Group berhasil disimpan ke sistem dan tampil di halaman datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~1.1m) — create di lumicharmsid (153).
    Code COL{stamp} / Name Color-{stamp}, options Red+Blue+Green via Enter,
    Active ON, Save & Next → tampil di datalist.
  report_url: null
test_data_used:
  - field: "Code"
    value: "COL{stamp}"
  - field: "Name"
    value: "Color-{stamp}"
  - field: "Options"
    value: "Red, Blue, Green"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-VAR-001 — re-run lumicharmsid"
---

# TC-VAR-001

## Catatan automation

- Spec: `tests/specs/variant/variant-create-update.spec.ts` (tag `@TC-VAR-001`)
- Helper: `tests/helpers/variant.ts`
- Registry: `tests/pom-registry/variant.yaml`
- Company: **lumicharmsid (153)**.
- Chain: hasil create dipakai `@TC-VAR-002`.
