---
doc_type: e2e-test-case
tc_code: TC-PO-UPDATE-002
menu: supplychain-purchase-order
menu_name: "Purchase Order"
title: "Menyetujui dokumen PO-6A4F5E97 melalui datalist"
summary: "Pastikan status Open, klik ikon approve pada datalist, verifikasi status berubah menjadi Approved."
status: draft
owner: QA - Cursor
last_updated: 2026-07-09
requirement_ref: "qa-docs/supplychain-purchase-order/requirement.md"
automated: true
automated_spec: "tests/specs/purchase-order/po-approve-datalist.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (id: 153)."
  - "Sudah masuk ke menu Purchase Order."
  - "PO dengan code PO-6A4F5E97 sudah ada dan berstatus Open."
test_data:
  - field: "Transaction Code"
    value: "PO-6A4F5E97"
steps:
  - "Buka datalist Purchase Order dan cari PO-6A4F5E97."
  - "Pastikan trx status dokumen PO-6A4F5E97 adalah Open."
  - "Klik button ikon approve pada kolom action baris PO-6A4F5E97."
  - "Pada modal konfirmasi, klik Approve."
  - "Verifikasi di datalist trx status PO-6A4F5E97 berubah menjadi Approved."
expected_result: |
  Purchase Order PO-6A4F5E97 berhasil disetujui.
  Trx status di datalist berubah menjadi Approved.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS — approve dari datalist PO-6A4F5E97, status berubah menjadi Approved."
  report_url: null
test_data_used:
  - field: "Runner email"
    value: "playwright@gmail.com"
  - field: "Company"
    value: "lumicharmsid (id: 153)"
  - field: "Automation tag"
    value: "@TC-PO-APPROVE-DATALIST"
  - field: "Run command"
    value: "npx playwright test tests/specs/purchase-order/po-approve-datalist.spec.ts -g @TC-PO-APPROVE-DATALIST --retries=0"
run_history:
  - at: "2026-07-09"
    status: passed
    environment: staging
    note: "Approve ikon datalist + modal Approve — status Approved OK"
---
