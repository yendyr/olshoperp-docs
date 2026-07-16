---
doc_type: e2e-test-case
tc_code: TC-ADJADD-003
menu: supplychain-adjustment-addition
menu_name: "Stock Addition"
title: "Add product detail + In Qty"
summary: "Pada dokumen hasil create, pilih product via Select Product (bulk-create) lalu isi In Qty."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-adjustment-addition/requirement.md"
automated: true
automated_spec: "tests/specs/adjustment-addition/adjustment-addition-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-ADJADD-001 tersedia (serial)."
  - "Minimal 1 System Product searchable (contoh LUMI00001)."
  - "AS-IS: product yang sudah ada di Stock Addition status open lain tidak bisa dipakai lagi sampai finalized/removed."
test_data:
  - field: "Product search"
    value: "LUMI (retry opsi jika locked)"
  - field: "In Qty"
    value: "1"
steps:
  - "Buka edit dokumen hasil create."
  - "Section Stock Addition Detail → Multiselect Select Product → cari LUMI00001 → pilih."
  - "Tunggu bulk-create sukses; baris muncul di grid."
  - "Isi / ubah In Qty = 1 (inline edit)."
expected_result: |
  Product muncul di Stock Addition Detail dengan In Qty = 1.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS — Select Product (retry jika locked di AI open lain) + In Qty=1.
    Catatan: SKU di <strong> opsi; product lock error "is used in an open Stock Addition".
  report_url: null
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-ADJADD-003 — serial 3/3 PASS"
---

# TC-ADJADD-003

## Step to reproduce (manual)

1. Edit dokumen Stock Addition (AI*).
2. Section **Stock Addition Detail**.
3. **Select Product** → ketik SKU → pilih.
4. Setelah baris muncul, set **In Qty** = 1.

## Catatan automation

- Spec tag: `@TC-ADJADD-003`
- Helper: `addProductViaSelectProduct` + `setInQtyOnDetailRow`
- Registry: `select_product`, `in_qty`
