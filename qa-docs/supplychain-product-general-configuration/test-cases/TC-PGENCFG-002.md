---
doc_type: e2e-test-case
tc_code: TC-PGENCFG-002
menu: supplychain-product-general-configuration
menu_name: "Product General Configuration"
title: "Update Product General Configuration"
summary: "Update System Product SKU dan Retail Price pada PGC hasil create."
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
  - "SKU dari TC Create tersedia — automation serial memakai state create."
  - "User memiliki akses update."
test_data:
  - field: "Source SKU"
    value: "dari create (SKU-KABEL / SKU-KBL-{stamp})"
  - field: "System Product SKU (updated)"
    value: "SKU-KBL-UP-{stamp}"
  - field: "Retail Price"
    value: "125000"
steps:
  - "Klik SKU hasil create di datalist Product General Configuration."
  - "Ubah field System Product SKU."
  - "Input Retail Price di section Product Details."
  - "Klik Save All."
  - "Verifikasi SKU terbaru di datalist."
expected_result: |
  Konfigurasi product berhasil di-update dan data terbaru tersimpan.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~18s) — update di lumicharmsid.
    Rename SKU → SKU-KBL-UP-{stamp}, Retail Price 125000, Save All, datalist OK.
  report_url: null
test_data_used:
  - field: "SKU (updated)"
    value: "SKU-KBL-UP-{stamp}"
  - field: "Retail Price"
    value: "125000"
  - field: "Company"
    value: "lumicharmsid (153)"
run_history:
  - at: "2026-07-14"
    status: passed
    note: "Playwright @TC-PGENCFG-002 — chain setelah create"
---

# TC-PGENCFG-002

## Catatan automation

- Spec tag: `@TC-PGENCFG-002`
- Retail Price = `#price` di accordion Product Details (bukan Accounting).
- Draft title "Update system product" diikuti sebagai update PGC.
