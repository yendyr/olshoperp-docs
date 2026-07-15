---
doc_type: e2e-test-case
tc_code: TC-CREATE-master-brand
menu: supplychain-master-brand
menu_name: "Master Brand"
title: "Create Brand baru"
summary: "Mendaftarkan master merek produk (name + description + Active)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-master-brand/requirement.md"
automated: true
automated_spec: "tests/specs/master-brand/master-brand-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - system-product
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Akses create Brand (Gate 188)."
test_data:
  - field: "Name"
    value: "BR-AT-{stamp}"
  - field: "Description"
    value: "Brand automation — master merek produk"
  - field: "Active"
    value: "ON"
steps:
  - "Datalist Brand → Create."
  - "Isi Name (+ Description); pastikan Active ON."
  - "Save & Next → catat name; verifikasi datalist."
expected_result: |
  Brand tersimpan; name tampil di datalist; redirect edit.
test_result:
  status: pass
  started_at: "2026-07-15T05:57:00Z"
  finished_at: "2026-07-15T05:58:50Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "2/2 PASS master-brand-create-update.spec.ts · CREATE Brand OK · company lumicharmsid"
  report_url: null
---

# TC-CREATE-master-brand

## Fungsi menu

Master **merek produk** (`omni_brands`) untuk dipilih di System Product / config via select2-brand.
Inactive → hilang dari dropdown transaksi.

## Catatan automation

- Spec: `@TC-CREATE-master-brand`
- Helper: `tests/helpers/master-brand.ts`
- API: `POST supplychain/brand` · UI path `/supplychain/master-brand`
