---
doc_type: e2e-test-case
tc_code: TC-PO-005
menu: supplychain-purchase-order
menu_name: "Purchase Order"
test_type: negative
title: "Memastikan Import Detail PO Bersifat Partial Success Ketika Terdapat Baris Invalid"
summary: "Verifikasi mekanisme partial success: baris invalid ditolak per-baris dan tercatat di Import Log tanpa membatalkan baris yang valid."
status: draft
owner: QA - Playwright
last_updated: 2026-08-19
requirement_ref: "qa-docs/supplychain-purchase-order/requirement.md"
automated: true
automated_spec: tests/specs/purchase-order/po-import-detail-vat-tc3.spec.ts
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - Dokumen Purchase Order berstatus Draft telah dibuat (PO ID: 2565)
  - Company aktif: lumicharmsid (id: 153)
test_data:
  - field: baris_1_valid
    value: "SKU-PO-VAT-TEST01 | Qty: 10 | Price: 50000 | VAT: yes | VAT Code: PPN12 | VAT Type: exclude"
  - field: baris_2_invalid_vat_value
    value: "SKU-PO-VAT-TEST01 | Qty: 5 | Price: 50000 | VAT: maybe | VAT Code: PPN12 | VAT Type: exclude"
  - field: baris_3_override_no
    value: "SKU-PO-VAT-TEST01 | Qty: 8 | Price: 15000 | VAT: no | VAT Code: PPN12 | VAT Type: exclude"
  - field: baris_4_valid_default
    value: "SKU-PO-VAT-TEST01 | Qty: 12 | Price: 50000 | VAT: (empty) | VAT Code: (empty) | VAT Type: (empty)"
steps:
  - Buka menu Supply Chain Management -> Purchase Order (/supplychain/purchase-order)
  - Buat PO status Draft baru dengan deskripsi pengujian
  - Buat file Excel import detail berisi 4 baris data (baris valid, baris invalid VAT='maybe', baris VAT='no', baris VAT default kosong)
  - Upload file Excel tersebut melalui tombol Import Detail
  - Tunggu proses import selesai dieksekusi oleh worker background
  - Periksa notifikasi dan modal Import History / Log
  - Verifikasi baris valid (1, 3, 4) berhasil masuk ke detail PO
  - Verifikasi baris invalid (2) ditolak dengan pesan error yang akurat
expected_result: |
  Import PO detail berjalan dengan mekanisme Partial Success:
  - Baris dengan format/kombinasi VAT invalid gagal secara individual dan tidak membatalkan baris lain.
  - Baris yang valid tetap berhasil masuk ke detail PO.
  - History dan notifikasi import menampilkan jumlah baris sukses dan gagal secara akurat beserta rincian error.
test_result:
  status: passed
  started_at: "2026-08-19T16:20:00+07:00"
  finished_at: "2026-08-19T16:21:10+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Import PO Without PR dengan partial success (3 baris valid, 1 baris invalid) berhasil dieksekusi di Staging (PO Edit ID: 2565, Company: lumicharmsid)."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15425
last_execution:
  at: "2026-08-19 16:21:10"
  jira: "ETM-15425"
  status: passed
  via: "legacy:test_result"
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15425** (AC 5 & AC 6):
- Partial failure per baris: invalid value ditolak individual, baris valid masuk.
- Jira Test Case Card: [ETM-15597](https://erpintegration.atlassian.net/browse/ETM-15597) (Done).
- Terkait Bug Card Kasus D: [ETM-15598](https://erpintegration.atlassian.net/browse/ETM-15598) (Error).
