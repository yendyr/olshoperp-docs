---
doc_type: e2e-test-case
tc_code: TC-CREATE-product-general-configuration
menu: supplychain-product-general-configuration
menu_name: "Product General Configuration"
title: "Create Product General Configuration"
summary: "Buat Product General Configuration baru dengan tipe single."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: "qa-docs/supplychain-product-general-configuration/requirement.md"
automated: true
automated_spec: "tests/specs/product-general-configuration/product-general-configuration-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Sudah di halaman datalist Product General Configuration."
  - "User memiliki akses create."
test_data:
  - field: "System Product SKU"
    value: "SKU-KABEL (fallback SKU-KBL-{stamp} jika already taken)"
  - field: "System Product Name"
    value: "kabel tembaga asli"
  - field: "Sales Category"
    value: "Hobbies & Collections"
  - field: "Product Coa Group"
    value: "Purchased Item"
steps:
  - "Klik button Create di halaman datalist Product General Configuration."
  - "Amati field Sales Category — pastikan auto-fill; ensure sesuai test data."
  - "Input/select System Product SKU, Name, Sales Category, Product Coa Group sesuai test data."
  - "Klik tombol Save."
  - "Verifikasi SKU tampil di datalist PGC."
expected_result: |
  Product General Configuration berhasil disimpan dan tampil di datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~21s) — create di lumicharmsid.
    Reuse SystemProductPage + PRODUCT_GENERAL_CONFIGURATION_PATHS.
    Sales Category Hobbies & Collections, COA Purchased Item, Save → datalist OK.
    Jika SKU-KABEL sudah exists → idempotent pakai data existing / fallback unique.
  report_url: null
test_data_used:
  - field: "SKU"
    value: "SKU-KABEL atau SKU-KBL-{stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-CREATE-product-general-configuration — 2/2 serial PASS (~43s)"
---

# TC-CREATE-product-general-configuration

## Catatan automation

- Spec: `tests/specs/product-general-configuration/product-general-configuration-create-update.spec.ts`
- Helper: `tests/helpers/system-product.ts` + `PRODUCT_GENERAL_CONFIGURATION_PATHS`
- Registry: `tests/pom-registry/product-general-configuration.yaml`
- Blocker familiar (System Product): Sales Category autofill, COA Purchased Item + Asset Category, alias/tagging clear, API path PGC (bukan `/product` full).
