---
doc_type: e2e-test-case
tc_code: TC-PR-DELETE-001
menu: supplychain-purchase-requisition
menu_name: "Purchase Requisition"
title: "Delete PR-6A4DF63B dari datalist"
summary: "Klik ikon delete di kolom action datalist, konfirmasi modal Delete, verifikasi dokumen hilang dari datalist."
status: draft
owner: QA - Cursor
last_updated: 2026-07-09
requirement_ref: "qa-docs/supplychain-purchase-requisition/requirement.md"
automated: true
automated_spec: "tests/specs/purchase-requisition/pr-delete-datalist.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Lumi Charms.id (id: 153)."
  - "Sudah berada di menu Purchase Requisition."
  - "Purchase Requisition dengan code PR-6A4DF63B sudah ada di datalist."
test_data:
  - field: "Transaction Code"
    value: "PR-6A4DF63B"
steps:
  - "Buka datalist Purchase Requisition dan cari PR-6A4DF63B."
  - "Klik button ikon delete (trash) pada kolom action baris PR-6A4DF63B (button class delete-button di datalist)."
  - "Pada modal konfirmasi Are you sure?, klik Delete."
  - "Verifikasi PR-6A4DF63B tidak muncul lagi di datalist setelah pencarian."
expected_result: |
  Purchase Requisition PR-6A4DF63B terhapus dari datalist.
  Pencarian dengan code PR-6A4DF63B tidak menampilkan baris data tersebut.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS — delete dari datalist PR-6A4DF63B, dokumen tidak ditemukan lagi di datalist."
  report_url: null
test_data_used:
  - field: "Runner email"
    value: "playwright@gmail.com"
  - field: "Company"
    value: "lumicharmsid (id: 153)"
  - field: "Run command"
    value: "npx playwright test tests/specs/purchase-requisition/pr-delete-datalist.spec.ts -g @TC-PR-DELETE-DATALIST --retries=0"
run_history:
  - at: "2026-07-09"
    status: passed
    environment: staging
    note: "Delete ikon datalist + modal Delete — PR hilang dari datalist OK"
---
