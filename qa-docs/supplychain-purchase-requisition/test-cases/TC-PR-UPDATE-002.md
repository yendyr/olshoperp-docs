---
doc_type: e2e-test-case
tc_code: TC-PR-UPDATE-002
menu: supplychain-purchase-requisition
menu_name: "Purchase Requisition"
title: "Approve PR-6A4F0A91 dari datalist"
summary: "Verifikasi status Open, klik ikon approve di kolom action datalist, konfirmasi modal, verifikasi status Approved."
status: draft
owner: QA - Cursor
last_updated: 2026-07-09
requirement_ref: "qa-docs/supplychain-purchase-requisition/requirement.md"
automated: true
automated_spec: "tests/specs/purchase-requisition/pr-approve-datalist.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (id: 153)."
  - "Sudah berada di menu Purchase Requisition."
  - "PR dengan code PR-6A4F0A91 sudah ada dan berstatus Open."
test_data:
  - field: "Transaction Code"
    value: "PR-6A4F0A91"
steps:
  - "Pastikan dokumen PR-6A4F0A91 berstatus Open di datalist (selain Open, konfirmasi QA dulu)."
  - "Klik button ikon approve pada kolom action baris PR-6A4F0A91 (button class approve-button di datalist)."
  - "Pada modal konfirmasi, klik Approve."
  - "Verifikasi di datalist PR-6A4F0A91 berstatus Approved."
expected_result: |
  Purchase Requisition PR-6A4F0A91 berhasil disetujui.
  Trx status di datalist berubah menjadi Approved.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS — approve dari datalist PR-6A4F0A91, status Approved terverifikasi."
  report_url: null
test_data_used:
  - field: "Runner email"
    value: "playwright@gmail.com"
  - field: "Company"
    value: "lumicharmsid (id: 153)"
  - field: "Run command"
    value: "npx playwright test tests/specs/purchase-requisition/pr-approve-datalist.spec.ts -g @TC-PR-APPROVE-DATALIST --retries=0"
run_history:
  - at: "2026-07-09"
    status: passed
    environment: staging
    note: "Approve ikon datalist + modal Approve — status Approved OK"
---
