---
doc_type: e2e-test-case
tc_code: TC-PO-004
menu: supplychain-purchase-order
menu_name: "Purchase Order"
title: "Memastikan Penentuan VAT Melalui Import Excel Berfungsi Eksplisit (Override Auto Add dan VAT No)"
summary: "Verifikasi override eksplisit nilai VAT pada file import Excel (VAT=yes + VAT Code vs VAT=no) mengabaikan auto-add default supplier."
status: draft
owner: QA - Playwright
last_updated: 2026-08-19
requirement_ref: "qa-docs/supplychain-purchase-order/requirement.md"
automated: true
automated_spec: tests/specs/purchase-order/po-import-detail-vat-tc2.spec.ts
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - Dokumen Purchase Order berstatus Draft telah dibuat (PO ID: 2563)
  - Terdapat Supplier dengan setting Auto Add Tax = Active (Supplier Test PO VAT Auto)
  - Produk target memiliki konfigurasi Pajak Purchase VAT (SKU-PO-VAT-TEST01 dengan Tax Code: PPN12)
  - Company aktif: lumicharmsid (id: 153)
test_data:
  - field: baris_1_override_yes
    value: "SKU-PO-VAT-TEST01 | Qty: 10 | Price: 50000 | VAT: yes | VAT Code: PPN12 | VAT Type: exclude"
  - field: baris_2_override_no
    value: "SKU-PO-VAT-TEST01 | Qty: 5 | Price: 50000 | VAT: no | VAT Code: (empty) | VAT Type: (empty)"
steps:
  - Buka menu Supply Chain Management -> Purchase Order (/supplychain/purchase-order)
  - Buat PO Without PR status Draft
  - Buat file Excel import detail dengan skenario:
    1. Baris 1: SKU-PO-VAT-TEST01 diisi VAT=yes, VAT Code=PPN12, VAT Type=exclude
    2. Baris 2: SKU-PO-VAT-TEST01 diisi VAT=no (Code & Type kosong)
  - Upload file Excel tersebut melalui tombol Import Detail
  - Tunggu proses import selesai dan refresh detail PO
  - Verifikasi baris 1: pajak PPN12 diterapkan pada item
  - Verifikasi baris 2: tidak ada pajak yang diterapkan pada item (0% tax)
expected_result: |
  Input VAT pada file Excel mengalahkan (override) setting default supplier/produk:
  - Baris dengan VAT=yes dan VAT Code valid akan menerapkan pajak sesuai kode tersebut.
  - Baris dengan VAT=no tidak akan memiliki pajak sama sekali meskipun supplier aslinya mengaktifkan auto add tax.
test_result:
  status: passed
  started_at: "2026-08-19T15:55:00+07:00"
  finished_at: "2026-08-19T15:55:25+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Import PO Without PR dengan explicit VAT override (Row 1: VAT=yes, Row 2: VAT=no) berhasil dieksekusi di Staging (PO Edit ID: 2563, Company: lumicharmsid)."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15425
last_execution:
  at: "2026-08-19 15:55:25"
  jira: ETM-15425
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15425** (AC 3 & AC 4):
- Explicit  +  -> apply tax code specified.
- Explicit  -> no tax applied.
- Jira Test Case Card: [ETM-15595](https://erpintegration.atlassian.net/browse/ETM-15595) (Done).
