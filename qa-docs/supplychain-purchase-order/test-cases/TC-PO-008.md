---
doc_type: e2e-test-case
tc_code: TC-PO-008
menu: supplychain-purchase-order
menu_name: "Purchase Order"
title: "Memastikan Penanganan Kolom VAT Type Terisi Saat System Product Tanpa Setting VAT atau Setting Auto Add Supplier = NO"
summary: "Verifikasi perilaku kolom VAT Type terisi parsial saat supplier atau produk tidak memiliki master konfigurasi auto-add pajak aktif."
status: draft
owner: QA - Cursor
last_updated: 2026-08-19
requirement_ref: "qa-docs/supplychain-purchase-order/requirement.md"
automated: true
automated_spec: tests/specs/purchase-order/po-import-vat-tc6-tc7.spec.ts
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - Dokumen Purchase Order berstatus Draft telah dibuat
  - Terdapat Supplier dengan setting Auto Add VAT = NO
  - Terdapat System Product tanpa master konfigurasi Purchase VAT
  - Company aktif: lumicharmsid (id: 153)
test_data:
  - field: skenario_1_supplier_no
    value: "Supplier Auto Add NO | SKU dengan Tax | VAT: (kosong), VAT Code: (kosong), VAT Type: exclude"
  - field: skenario_2_product_no_tax
    value: "Supplier Auto Add YES | SKU tanpa master Tax | VAT: (kosong), VAT Code: (kosong), VAT Type: exclude"
steps:
  - Buka menu Supply Chain Management -> Purchase Order (/supplychain/purchase-order)
  - Buat dokumen PO Without PR baru
  - Siapkan file Excel import dengan kolom VAT kosong, VAT Code kosong, namun VAT Type diisi 'exclude'
  - Upload file Excel melalui Import Detail
  - Tunggu proses import selesai dan verifikasi hasil detail item PO
expected_result: |
  Jika setting Auto Add Supplier adalah NO atau produk tidak memiliki master konfigurasi Purchase VAT, sistem tidak menerapkan pajak (0% tax) meskipun kolom VAT Type terisi, karena tidak ada basis pajak yang aktif pada relasi supplier/produk tersebut.
test_result:
  status: passed
  started_at: "2026-08-19T21:36:50+07:00"
  finished_at: "2026-08-19T21:37:25+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Automated Playwright E2E test PASSED pada dokumen PO Without PR (#2573) di Staging (Company: lumicharmsid): Kolom VAT Type terisi tanpa basis master tax menghasilkan 0% tax."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15425
last_execution:
  at: "2026-08-19 21:37:25"
  jira: ETM-15425
---

# Catatan QA & Referensi
Mengacu pada pembahasan skenario edge-case card **ETM-15425** (TC-6):
- Validasi perilaku kolom VAT Type terisi parsial saat supplier/produk tidak memiliki setting auto-add tax.
