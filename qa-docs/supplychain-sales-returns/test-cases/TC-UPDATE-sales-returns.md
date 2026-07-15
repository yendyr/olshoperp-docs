---
doc_type: e2e-test-case
tc_code: TC-UPDATE-sales-returns
menu: supplychain-sales-returns
menu_name: "Sales Return"
title: "Update Restock Qty — auto-save + toast Finance"
summary: "Di edit SR open: ubah Restock Qty (NumberSpinner); verifikasi PATCH details + toast Waiting for Finance; tanpa tombol Complete."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-sales-returns/requirement.md"
automated: true
automated_spec: "tests/specs/sales-returns/sales-returns-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-sales-return
preconditions:
  - "SR open (can_update) dari CREATE atau Continue di datalist."
test_data: []
steps:
  - "Buka edit Sales Return SCM."
  - "Verifikasi Order Details + Sales Return No + kolom Restock Qty / Lost / Broken."
  - "Verifikasi tidak ada tombol Complete (hanya Finance)."
  - "Increment Restock Qty (atau toggle −/+ jika sudah max)."
  - "Tunggu PATCH …/details/{id} + toast Return data saved / Waiting for Finance."
expected_result: |
  Qty tersimpan; status tetap open; menunggu Finance Complete.
test_result:
  status: pass
  started_at: "2026-07-15T09:36:06Z"
  finished_at: "2026-07-15T09:36:35Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS UPDATE Restock↔Lost fill → PATCH details + toast Waiting for Finance · company lumicharmsid"
  report_url: null
---

# TC-UPDATE-sales-returns

## Catatan automation

- Spec: `@TC-UPDATE-sales-returns`
- Auto-save debounce ~1200ms → toast +750ms.
- Detail (Restock/Lost/Broken) digabung ke UPDATE sesuai protokol transaksi.
