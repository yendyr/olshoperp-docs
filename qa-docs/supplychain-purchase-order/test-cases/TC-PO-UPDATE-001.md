---
doc_type: e2e-test-case
tc_code: TC-PO-UPDATE-001
menu: supplychain-purchase-order
menu_name: "Purchase Order"
title: "Set PO-6A4F5E97 status Open dari show datalist"
summary: "Buka PO dari ikon show di datalist, pilih radio Open, Save All, verifikasi status Open di datalist."
status: draft
owner: QA - Cursor
last_updated: 2026-07-09
requirement_ref: "qa-docs/supplychain-purchase-order/requirement.md"
automated: true
automated_spec: "tests/specs/purchase-order/po-open-datalist.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (id: 153)."
  - "Sudah berada di menu Purchase Order."
  - "PO dengan code PO-6A4F5E97 sudah ada di datalist dan berstatus Draft."
test_data:
  - field: "Transaction Code"
    value: "PO-6A4F5E97"
  - field: "Trx. Status"
    value: "Open"
steps:
  - "Buka datalist Purchase Order dan cari PO-6A4F5E97."
  - "Klik button ikon show pada kolom action baris PO-6A4F5E97 (selector datalist: #updateButton)."
  - "Pilih radio Open pada status transaksi."
  - "Klik button Save All."
  - "Kembali ke datalist Purchase Order, cari PO-6A4F5E97."
  - "Verifikasi PO tampil dengan trx status Open."
expected_result: |
  Purchase Order PO-6A4F5E97 berhasil disimpan ke sistem.
  Data transaksi tampil di datalist Purchase Order dengan trx status Open.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS — show datalist PO-6A4F5E97, radio Open + Save All, status Open terverifikasi di datalist."
  report_url: null
test_data_used:
  - field: "Runner email"
    value: "playwright@gmail.com"
  - field: "Company"
    value: "lumicharmsid (id: 153)"
  - field: "Automation tag"
    value: "@TC-PO-OPEN-DATALIST"
  - field: "Run command"
    value: "npx playwright test tests/specs/purchase-order/po-open-datalist.spec.ts -g @TC-PO-OPEN-DATALIST --retries=0"
run_history:
  - at: "2026-07-09"
    status: passed
    environment: staging
    note: "Show datalist + radio Open + Save All — status Open OK"
---
