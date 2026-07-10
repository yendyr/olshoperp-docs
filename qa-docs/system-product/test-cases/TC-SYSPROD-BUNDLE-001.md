---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-BUNDLE-001
menu: system-product
menu_name: "System Product"
title: Membuat parent SKU bundle dari detail variant + single parent (TRUZZ Doll Collectors Pack)
summary: Buat SKU variant detail bundle → buat SKU single parent → aktifkan Product Bundle → tambah 2 SKU variant child → toggle Active bundle
status: review
owner: QA - Playwright
last_updated: "2026-07-10"
requirement_ref: "requirement.md §3 Product Details — Bundle"
automated: true
automated_spec: tests/specs/system-product/sysprod-bundle-truzz.spec.ts
execution_company:
  code: lumicharmsid
  id: 153
related_menus:
  - menu_slug: system-product
    menu_name: "System Product"
    role: primary
    note: Datalist & form create/edit `/supplychain/product`
preconditions:
  - Akun **playwright@gmail.com** aktif dengan akses company **lumicharmsid (id 153)**.
  - User punya privilege **create/update** System Product di company tersebut.
  - Master variant type **Colours** / **Warna** / **Color** dengan opsi **white** dan **yellow** tersedia.
test_data:
  - field: Datalist URL
    value: https://staging.olshoperp.com/supplychain/product
  - field: Variant parent SKU (detail bundle)
    value: SKU-TRUZV1
  - field: Variant parent name
    value: TRUZZ TRSR DOLL
  - field: Variant options
    value: "white, yellow"
  - field: Expected variant SKUs
    value: "SKU-TRUZV1, SKU-TRUZV1-white, SKU-TRUZV1-yellow"
  - field: Bundle parent SKU
    value: BDL-TRUZ-SET01
  - field: Bundle parent name
    value: Bundle TRUZZ Doll Collectors Pack
  - field: Bundle detail SKUs
    value: "SKU-TRUZV1-white, SKU-TRUZV1-yellow"
steps:
  - Login staging dengan akun E2E runner.
  - Switch company ke **lumicharmsid** (id 153).
  - Buka datalist **System Product**.
  - Buat SKU variant **SKU-TRUZV1** / **TRUZZ TRSR DOLL** dengan 2 opsi warna (**white**, **yellow**) → Save All.
  - Buat SKU single **BDL-TRUZ-SET01** / **Bundle TRUZZ Doll Collectors Pack** → Save (tetap di halaman edit).
  - Scroll ke section **Product Details**.
  - Aktifkan toggle **Set as Product Bundle**.
  - Klik kotak disclosure bundle yang muncul (header **Bundle TRUZZ Doll Collectors Pack**).
  - Pada field **Bundle Detail** / **Select Product**, tambahkan **SKU-TRUZV1-white** dan **SKU-TRUZV1-yellow**.
  - Aktifkan toggle **Active** pada header bundle.
expected_result: |
  - SKU variant **SKU-TRUZV1**, **SKU-TRUZV1-white**, **SKU-TRUZV1-yellow** tersedia di datalist.
  - Bundle parent **BDL-TRUZ-SET01** tersimpan dengan 2 baris detail bundle.
  - Saat toggle **Active** diaktifkan, muncul pesan **success** dan bundle **Bundle TRUZZ Doll Collectors Pack** aktif.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: Playwright local (olshoperp-docs)
  environment: staging
  log_summary: "PASS ~51s — lumicharmsid, bundle TRUZZ Doll Collectors Pack"
  report_url: null
test_data_used:
  - field: Runner email
    value: playwright@gmail.com
  - field: Company
    value: lumicharmsid (id 153)
  - field: Spec file
    value: tests/specs/system-product/sysprod-bundle-truzz.spec.ts
  - field: POM helper
    value: tests/helpers/system-product.ts
run_history:
  - at: "2026-07-10"
    status: passed
    environment: staging
    note: Execute otomatis Playwright — create variant + bundle parent + activate bundle
---

## Catatan QA

- Variant type di lumicharmsid: coba urutan **Colours** → **Warna** → **Color** (helper `selectVariantTypeFromCandidates`).
- Field **Bundle Detail** memakai `SystemProductSelect` (Multiselect) — ketik di `.multiselect-search` scoped ke section bundle, bukan field SKU header (hindari `select2-category`).
- Selector bundle: toggle **Set as Product Bundle**, disclosure `[aria-current="BundleProduct"]`, toggle Active `#bundle-toggle-header`.
- API: `deactivate-bundle` (enable bundle), `create-select` (tambah detail), `activate-bundle` (aktifkan bundle).
- Test idempotent: skip create jika SKU sudah ada; skip tambah detail jika baris sudah ada / pesan "already included".
