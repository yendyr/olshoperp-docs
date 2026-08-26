---
doc_type: e2e-test-case
tc_code: TC-GC-CRAWL-DEFAULT-20260823082354
menu: generalsetting-general-company
menu_name: "General Company"
title: "Create New General Company with Default Recognize as Customer & Supplier via Web UI Crawling"
summary: "Pengujian crawling web UI untuk membuat General Company baru dengan toggle default Recognize As yang menyalakan peran Customer dan Supplier secara bersamaan."
status: approved
owner: QA - Yemima
last_updated: 2026-08-23
requirement_ref: "qa-docs/generalsetting-general-company/requirement.md"
automated: true
automated_spec: "tests/specs/product-profit-loss/create-supplier-ui-crawl.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - generalsetting-general-company
preconditions:
  - "User login ke staging dengan akun yang memiliki hak akses menu General Setting -> Master General Company"
  - "Company aktif: Lumi Charms.id (ID: 153)"
steps:
  - "1. Buka halaman form create /generalsetting/general-company/create via browser crawling"
  - "2. Isi field Code dan Name"
  - "3. Biarkan toggle default Recognize As tetap menyala (Customer = ON, Supplier = ON)"
  - "4. Klik tombol Save & Next pada form UI"
  - "5. Navigasi ke datalist /generalsetting/general-company dan cari code yang dibuat"
  - "6. Verifikasi kolom Customer = Yes, Supplier = Yes, dan Status = Yes (Active)"
expected_result: |
  Data General Company baru berhasil tersimpan ke database, muncul di Datalist dengan peran Customer = Yes, Supplier = Yes, dan status Active.
test_result:
  status: passed
  started_at: "2026-08-23T08:23:45+07:00"
  finished_at: "2026-08-23T08:24:03+07:00"
  executed_by: "playwright@gmail.com"
  environment: staging
  log_summary: "General Company berhasil dibuat via UI crawling dengan default recognize as Customer & Supplier."
test_data_used:
  - code: "SUPP-1787448228795"
    name: "PT Supplier Lumi 1787448228795"
    is_customer: true
    is_supplier: true
    status: 1
    company_scope: "Lumi Charms.id (ID: 153)"
last_execution:
  at: "2026-08-23"
  jira: null
  status: passed
  via: "legacy:test_result"
---

# Catatan Testing & Referensi Data (Evidence)
- **Company Code:** 
- **Company Name:** 
- **Recognize As:** Customer (Yes), Supplier (Yes)
- **Status di Web UI:** Active (Yes)
- **Created At:** 23-08-2026 08:23:54
- **Created By:** Playwright User
