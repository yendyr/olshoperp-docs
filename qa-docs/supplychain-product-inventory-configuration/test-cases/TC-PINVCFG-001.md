---
doc_type: e2e-test-case
tc_code: TC-PINVCFG-001
menu: supplychain-product-inventory-configuration
menu_name: "Product Inventory Configuration"
title: "Create Product Inventory Configuration"
summary: "Seed product via Product General Configuration (workaround), pastikan SKU tampil di datalist Product Inventory Configuration."
status: draft
owner: QA - Cursor
last_updated: 2026-07-14
requirement_ref: "qa-docs/supplychain-product-inventory-configuration/requirement.md"
automated: true
automated_spec: "tests/specs/product-inventory-configuration/product-inventory-configuration-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - menu_slug: supplychain-product-general-configuration
    menu_name: Product General Configuration
    role: seed identity (SKU/Name/Sales Category/COA)
    note: "AS-IS PIC tidak punya tombol Create + showGeneral=false"
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "Akses Product General Configuration (create) dan Product Inventory Configuration (datalist)."
test_data:
  - field: "System Product SKU"
    value: "SKU-PIC-{stamp}"
  - field: "System Product Name"
    value: "PIC Stock Item {stamp}"
  - field: "Sales Category"
    value: "autofill (contoh: Home & Living)"
  - field: "Product Coa Group"
    value: "autofill (contoh: Product Accessories)"
steps:
  - "Buka Product General Configuration → Create."
  - "Input System Product SKU dan System Product Name."
  - "Amati Sales Category + Product Coa Group sudah auto-fill."
  - "Klik Save di PGC."
  - "Buka datalist Product Inventory Configuration, search SKU yang baru dibuat."
  - "Verifikasi SKU tampil di datalist PIC."
expected_result: |
  Product hasil seed tampil di datalist Product Inventory Configuration dan siap di-edit untuk inventory.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~33s) — seed via PGC di lumicharmsid, SKU muncul di PIC datalist.
    Workaround: PIC Form `showGeneral=false` + datalist tanpa Create button (isProductInventoryMode).
  report_url: null
test_data_used:
  - field: "SKU"
    value: "SKU-PIC-{stamp}"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-PINVCFG-001 — 2/2 serial PASS (~1.3m)"
---

# TC-PINVCFG-001

## Catatan automation

- Spec: `tests/specs/product-inventory-configuration/product-inventory-configuration-create-update.spec.ts`
- Helper: `tests/helpers/system-product.ts` (`PRODUCT_GENERAL_CONFIGURATION_PATHS` + `PRODUCT_INVENTORY_CONFIGURATION_PATHS`)
- **Workaround wajib:** create identity di PGC; PIC inventory-only (tanpa Create di UI datalist).
