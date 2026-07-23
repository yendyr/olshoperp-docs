---
doc_type: e2e-test-case
tc_code: TC-SINV-001
menu: accounting-customer-invoice
menu_name: "Sales Invoice"
title: "CREATE — Customer Supplier China + Outstanding SO SKUSINGLE-194/195 + Approve"
summary: "Create SI; customer supplier china; Save All; Outstanding Sales Order Use 2 SKU; Open; Approve; search datalist Approved."
status: executed
owner: QA - Cursor
last_updated: 2026-07-23
requirement_ref: "qa-docs/accounting-customer-invoice/knowledge-base.md"
automated: true
automated_spec: "tests/specs/sales-invoice/sales-invoice-china-so-skus.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - businessdevelopment-sales-order-general
preconditions:
  - "Customer supplier china tersedia."
  - "Outstanding SO dengan SKUSINGLE-194 dan SKUSINGLE-195 untuk customer tersebut."
test_data:
  - customer: "supplier china"
  - skus: ["SKUSINGLE-194", "SKUSINGLE-195"]
  - description: "automation playwright"
steps:
  - "Create Sales Invoice → land edit (auto-create)."
  - "Pilih customer supplier china → Save All."
  - "Klik Outstanding Sales Order → ceklis SKUSINGLE-194 & SKUSINGLE-195 → Use."
  - "Set status Open → Approve."
  - "Search invoice di datalist status Approved."
expected_result: |
  Detail invoice berisi kedua SKU; invoice Approved di datalist (eligible Outstanding SI / AR).
test_result:
  status: pass
  started_at: 2026-07-20T15:53:00+07:00
  finished_at: 2026-07-23
  executed_by: Cursor automation
  environment: staging
  log_summary: "SI-5TVBTC4Y Approved (2026-07-23) — Open→Approve follow-up after create 2026-07-20."
  report_url: null
---

# TC-SINV-001

## Catatan automation

- Spec: `@TC-SINV-001` (+ approve existing `@TC-SINV-001-APPROVE` untuk SI seed lama)
- UI field **Customer** (bukan supplier); nilai test: `supplier china`.
- **Approve wajib** sebelum dipakai di Account Receive / CBR auto-match.
