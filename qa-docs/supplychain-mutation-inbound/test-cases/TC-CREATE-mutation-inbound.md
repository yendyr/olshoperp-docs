---
doc_type: e2e-test-case
tc_code: TC-CREATE-mutation-inbound
menu: supplychain-mutation-inbound
menu_name: "Purchase Inbound"
title: "Create Purchase Inbound header (IN*)"
summary: "Membuat GRN header: Supplier + Location Destination; code auto IN*."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-mutation-inbound/requirement.md"
automated: true
automated_spec: "tests/specs/mutation-inbound/mutation-inbound-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-purchase-order
  - supplychain-new-purchase-inbound
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Supplier dengan approved PO (PT. Supplier Lumi 001 Taxable)."
  - "Fiscal period aktif untuk tanggal fallback 09-07-2026."
test_data:
  - field: "Supplier"
    value: "PT. Supplier Lumi 001 Taxable"
  - field: "Description"
    value: "IN automation create {stamp}"
steps:
  - "Datalist Purchase Inbound → Create."
  - "Isi/ pastikan Supplier + Location Destination; tanggal jika fiscal error."
  - "Description → Save & Next (atau auto-create)."
  - "Verifikasi code IN* di form + datalist."
expected_result: |
  Header tersimpan dengan code IN-*; tampil di datalist.
test_result:
  status: pass
  started_at: "2026-07-15T06:22:00Z"
  finished_at: "2026-07-15T06:24:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "3/3 PASS mutation-inbound-create-update.spec.ts · CREATE IN* · company lumicharmsid"
  report_url: null
---

# TC-CREATE-mutation-inbound

## Fungsi menu

**Purchase Inbound (GRN)** — penerimaan barang dari supplier ke gudang (Location Destination).
Ikatan PO via outstanding detail; approve menambah item stock. Prefix **IN***.

## Catatan automation

- Spec: `@TC-CREATE-mutation-inbound`
- Helper: `tests/helpers/mutation-inbound.ts`
- Bukan menu BETA `new-purchase-inbound`.
