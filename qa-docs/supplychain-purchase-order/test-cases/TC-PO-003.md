---
doc_type: e2e-test-case
tc_code: TC-PO-003
menu: supplychain-purchase-order
menu_name: "Purchase Order"
test_type: regression
title: "Memastikan Template Import PO Memiliki Kolom VAT dan File Template Lama Tetap Berhasil Diimport (Backward Compatibility)"
summary: "Verifikasi 3 kolom baru (VAT, VAT Code, VAT Type) di template Excel import PO With PR & Without PR serta backward compatibility file template lama."
status: draft
owner: QA - Playwright
last_updated: 2026-08-19
requirement_ref: "qa-docs/supplychain-purchase-order/requirement.md"
automated: true
automated_spec: tests/specs/purchase-order/po-import-detail-vat-tc1.spec.ts
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - User login ke staging dengan akun yang memiliki hak akses menu Purchase Order
  - Terdapat dokumen Purchase Order status Draft yang belum memiliki detail item
  - Company aktif: lumicharmsid (id: 153)
test_data:
  - field: file_template_new
    value: Template-Import-PO-Without-PR.xlsx (dengan kolom VAT, VAT Code, VAT Type)
  - field: file_template_legacy
    value: Legacy-Template-PO-Without-PR.xlsx (tanpa kolom VAT)
steps:
  - Buka menu Supply Chain Management -> Purchase Order (/supplychain/purchase-order)
  - Buka dokumen Purchase Order target (status Draft) atau klik Create PO baru
  - Klik tombol 'Import Detail' dan unduh template Excel yang disediakan sistem
  - Periksa struktur kolom pada template hasil unduhan
  - Verifikasi bahwa terdapat 3 kolom baru di posisi paling kanan: 'VAT', 'VAT Code', dan 'VAT Type'
  - Siapkan file import menggunakan format template lama (tanpa 3 kolom VAT) dengan data SKU dan Supplier yang memiliki setting Auto Add Tax aktif
  - Upload file template lama tersebut ke form Import Detail PO
  - Periksa detail item PO yang berhasil masuk dan verifikasi nilai pajak yang terbentuk
expected_result: |
  Template Excel import PO (With PR & Without PR) memiliki 3 kolom baru (VAT, VAT Code, VAT Type) di posisi paling kanan. File template lama tanpa ketiga kolom tersebut tetap berhasil diimport (backward compatible) dan nilai pajak otomatis mengikuti konfigurasi default Auto Add Transaction dari Supplier dan System Product.
test_result:
  status: passed
  started_at: "2026-08-19T13:37:00+07:00"
  finished_at: "2026-08-19T13:37:25+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Setup Supplier khusus (Supplier Test PO VAT Auto), System Product (SKU-PO-VAT-TEST01) dengan Purchase VAT, PO Without PR, dan verifikasi template import 3 kolom VAT berhasil dieksekusi di Staging (Company: lumicharmsid)."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15425
first_execution:
  at: "2026-08-19 13:37:25"
  via: "legacy:test_result"
  jira: "ETM-15425"
last_execution:
  at: "2026-08-19 13:37:25"
  jira: "ETM-15425"
  status: passed
  via: "legacy:test_result"
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15425** (AC 1 & AC 2):
- Kolom I: 
- Kolom J:  (misal: PPN12, dll.)
- Kolom K:  (include / exclude)
- Backward compatibility: template tanpa kolom I-K tetap valid dan mengacu ke logic AS-IS.
- Jira Test Case Card: [ETM-15594](https://erpintegration.atlassian.net/browse/ETM-15594) (Done).
