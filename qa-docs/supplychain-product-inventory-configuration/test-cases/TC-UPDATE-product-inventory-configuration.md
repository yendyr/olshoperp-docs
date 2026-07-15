---
doc_type: e2e-test-case
tc_code: TC-UPDATE-product-inventory-configuration
menu: supplychain-product-inventory-configuration
menu_name: "Product Inventory Configuration"
title: "Update Product Inventory Configuration"
summary: "Set Expired Date warning days dan Minimum Stock Qty di Inventory Management, lalu Save All."
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
    role: sumber SKU seed (create)
    note: "-"
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (lumicharmsid, id: 153)."
  - "SKU dari TC Create tersedia — automation serial memakai state create."
  - "User memiliki akses update PIC."
test_data:
  - field: "Source SKU"
    value: "dari create (SKU-PIC-{stamp})"
  - field: "Expired Date (days)"
    value: "30"
  - field: "Minimum Stock Qty"
    value: "5"
steps:
  - "Klik System Product SKU di datalist Product Inventory Configuration."
  - "Buka Product Details → Inventory Management."
  - "Checklist Expired Date; input sisa hari (30)."
  - "Input Minimum Stock Qty (5)."
  - "Klik Save All."
  - "Re-open form; verifikasi days=30 dan min stock=5 tersimpan."
expected_result: |
  Konfigurasi inventory berhasil di-update dan data terbaru tersimpan.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~39s) — Expired Date 30 days + Minimum Stock Qty 5, Save All, re-open assert OK.
  report_url: null
test_data_used:
  - field: "Expired Date days"
    value: "30"
  - field: "Minimum Stock Qty"
    value: "5"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-UPDATE-product-inventory-configuration — chain setelah create"
---

# TC-UPDATE-product-inventory-configuration

## Catatan automation

- Spec tag: `@TC-UPDATE-product-inventory-configuration`
- Helper: `fillInventoryManagement` + `assertInventoryManagement` di `system-product.ts`
- Expired Date checkbox tanpa accessible name → enable via preceding checkbox dari placeholder `e.g: 15`.
