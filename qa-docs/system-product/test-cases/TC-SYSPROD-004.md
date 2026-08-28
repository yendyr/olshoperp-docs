---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-004
menu: system-product
menu_name: "System Product"
test_type: happy
title: "Create New System Product via Web UI Crawling (Form Input, Default Variant, & Active Status)"
summary: "Pengujian pembuatan System Product baru secara end-to-end melalui simulasi browser crawling UI (isi SKU, Name, Category, COA Group, Unit, Condition) dan verifikasi status produk langsung Active di Datalist."
status: approved
owner: QA - Yemima
last_updated: 2026-08-23
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 GAP-SP-17 V-01"
automated: true
automated_spec: "tests/specs/product-profit-loss/create-product-ui-crawl.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - system-product
  - supplychain-variant
preconditions:
  - "User login ke staging: playwright@gmail.com / 12345678"
  - "Company aktif: Lumi Charms.id (ID: 153 / code: lumicharmsid)"
  - "SKU uji belum pernah terdaftar sebelumnya"
test_data:
  - field: "UI Path"
    value: "https://staging.olshoperp.com/supplychain/product/create"
  - field: "SKU Input"
    value: "LUMI-CRAWL-1787447920177"
  - field: "Product Name"
    value: "Produk Crawl Lumi 1787447920177"
  - field: "Unit"
    value: "Pieces"
  - field: "Condition"
    value: "Brand New"
  - field: "Product COA Group"
    value: "Purchased Item (GRP001)"
steps:
  - "1. Buka browser dan navigasikan ke halaman /supplychain/product/create pada company Lumi Charms.id (ID: 153)"
  - "2. Isi field System Product SKU dengan format unik e.g. LUMI-CRAWL-{timestamp}"
  - "3. Isi field System Product Name"
  - "4. Pilih Sales Category dari dropdown multiselect (default: Home & Living)"
  - "5. Pilih Product COA Group dari dropdown multiselect (GRP001 / Purchased Item)"
  - "6. Pilih Primary Unit (Pieces)"
  - "7. Pilih Condition (Brand New)"
  - "8. Tekan tombol Save pada form web UI"
  - "9. Buka halaman Datalist /supplychain/product dan lakukan pencarian berdasarkan SKU yang baru dibuat"
  - "10. Verifikasi baris data produk muncul di tabel dengan status Active (Yes / 1)"
expected_result: |
  1. Data System Product baru berhasil disimpan ke database tanpa error validasi.
  2. Form UI web secara otomatis mengirimkan payload status aktif sehingga produk di datalist memiliki Status: Active (Yes).
  3. Parent SKU dan informasi master data (Unit, Category, COA Group) terpasang dengan benar.
test_result:
  status: passed
  started_at: "2026-08-23T08:18:38+07:00"
  finished_at: "2026-08-23T08:18:54+07:00"
  executed_by: "playwright@gmail.com"
  environment: staging
  log_summary: "Berhasil membuat System Product baru via Web UI Crawling pada company Lumi Charms.id (ID: 153). Produk terverifikasi muncul di datalist dengan status Active (Yes / 1)."
  report_url: null
test_data_used:
  - sku: "LUMI-CRAWL-1787447920177"
    name: "Produk Crawl Lumi 1787447920177"
    company_id: 153
    company_name: "Lumi Charms.id"
    unit: "Pieces"
    condition: "Brand New"
    status: 1
    created_at: "23-08-2026 08:18:44"
    created_by: "Playwright User"
run_history:
  - date: "2026-08-23"
    status: passed
    jira_card: "ETM-15554"
    execution_evidence: "LUMI-CRAWL-1787447920177"
origin_jira: ETM-15495
jira_key: ETM-15554
first_execution:
  at: "2026-08-23T08:18:54+07:00"
  via: "legacy:test_result"
  jira: "ETM-15554"
last_execution:
  at: "2026-08-23T08:18:54+07:00"
  jira: "ETM-15554"
  status: passed
  via: "legacy:test_result"
---

## Catatan QA & Analisa Teknis

### 1. Bukti Eksekusi Web UI Crawling (Evidence)
- **Target Company:** **Lumi Charms.id** (, )
- **Nomor SKU Dibuat:** ****
- **Nama Produk:** 
- **Status di Web UI Datalist:** **** ✅
- **Unit:** 
- **Waktu Pembuatan:** 

### 2. Perilaku Form UI Web vs Direct API Request
- **Form UI Web:** Pada komponen , saat menekan tombol *Save*, frontend secara default mengirim . Oleh karena itu, semua produk yang dibuat melalui alur UI web otomatis tersimpan dengan status **Active ()**.
- **Automated Spec:** Pengujian crawling otomatis dijalankan menggunakan Playwright pada file .
