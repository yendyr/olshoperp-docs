---
doc_type: e2e-test-case
tc_code: TC-PI-001
menu: accounting-supplier-invoice
menu_name: "Purchase Invoice"
title: "CREATE — PI dari inbound PO-6A589088 (Draft)"
summary: "Create PI; supplier PT Supplier IDR; modal Inbound Transaction search PO-6A589088; ceklis; Use; Save All; verifikasi Draft di datalist."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-supplier-invoice/knowledge-base.md"
automated: true
automated_spec: "tests/specs/purchase-invoice/purchase-invoice-create-from-inbound.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-purchase-inbound
preconditions:
  - "Supplier: PT Supplier IDR tersedia."
  - "PO-6A589088 punya outstanding inbound untuk supplier tersebut."
  - "Fiscal period Open cover Transaction Date."
test_data:
  - supplier: "pt supplier idr"
  - inbound_po: "PO-6A589088"
  - description: "automation playwright"
steps:
  - "Buka /accounting/supplier-invoice → Create."
  - "Pilih supplier PT Supplier IDR; Description = automation playwright; Save & Next (atau land edit)."
  - "Klik teks Inbound Transaction → modal."
  - "Search PO-6A589088; ceklis baris; klik Use."
  - "Save All."
  - "Datalist: search code PI; status Draft."
expected_result: |
  Purchase Invoice Draft terbuat dan tampil di datalist.
test_result:
  status: pass
  started_at: "2026-07-20T06:55:00Z"
  finished_at: "2026-07-20T06:56:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS � PI-6A5DC78E Draft � supplier PT. Supplier IDR � PO-6A589088 � lumicharmsid"
  report_url: null
---

# TC-PI-001

## Catatan automation

- Spec: `@TC-PI-001`
- Menu UI = Purchase Invoice; route = supplier-invoice (bukan purchase-inbound).
