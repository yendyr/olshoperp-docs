---
doc_type: e2e-test-case
tc_code: TC-GC-CRAWL-SUPPLIER-ONLY-20260823082955
menu: generalsetting-general-company
menu_name: "General Company"
title: "Create New General Company Recognized ONLY as Supplier via Web UI Crawling"
summary: "Pengujian crawling web UI untuk membuat General Company baru yang secara spesifik HANYA berperan sebagai Supplier (mematikan toggle Customer, Shipper, Manufacturer)."
status: approved
owner: QA - Yemima
last_updated: 2026-08-23
requirement_ref: "qa-docs/generalsetting-general-company/requirement.md"
automated: true
automated_spec: "tests/specs/product-profit-loss/create-supplier-only-ui-crawl.spec.ts"
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
  - "3. Matikan (turn OFF) toggle Customer, Shipper, dan Manufacturer"
  - "4. Pastikan toggle Supplier menyala (turn ON)"
  - "5. Klik tombol Save & Next pada form UI"
  - "6. Navigasi ke datalist /generalsetting/general-company dan cari code yang dibuat"
  - "7. Verifikasi kolom Customer = No, Supplier = Yes, Shipper = No, dan Status = Yes (Active)"
expected_result: |
  Data General Company baru berhasil tersimpan ke database, muncul di Datalist dengan peran murni Supplier ONLY (Customer = No, Supplier = Yes), dan status Active.
test_result:
  status: passed
  started_at: "2026-08-23T08:29:47+07:00"
  finished_at: "2026-08-23T08:30:05+07:00"
  executed_by: "playwright@gmail.com"
  environment: staging
  log_summary: "General Company berhasil dibuat via UI crawling dengan recognize murni sebagai Supplier ONLY."
test_data_used:
  - code: "SUPP-ONLY-1787448592996"
    name: "PT Murni Supplier 1787448592996"
    is_customer: false
    is_supplier: true
    is_shipper: false
    status: 1
    company_scope: "Lumi Charms.id (ID: 153)"
---

# Catatan Testing & Referensi Data (Evidence)
- **Company Code:** 
- **Company Name:** 
- **Recognize As:** Customer (No), Supplier (Yes), Shipper (No)
- **Status di Web UI:** Active (Yes)
- **Created At:** 23-08-2026 08:29:55
- **Created By:** Playwright User
