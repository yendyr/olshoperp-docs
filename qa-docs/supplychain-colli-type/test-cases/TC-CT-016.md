---
doc_type: e2e-test-case
tc_code: TC-CT-016
menu: supplychain-colli-type
menu_name: "Colli Type"
test_type: cross-menu
title: "Colli Type Active OFF tidak muncul pada pilihan New Colli di Purchase Inbound"
summary: "Memastikan Colli Type yang berstatus Active OFF tidak dapat dipilih pada dropdown opsi Colli Type saat pembuatan New Colli di menu Purchase Inbound."
status: draft
owner: QA - Yemima
last_updated: 2026-08-26
requirement_ref: "qa-docs/supplychain-colli-type/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-new-purchase-inbound
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "User punya privilege view + create menu Colli Type dan Purchase Inbound."
  - "Terdapat Colli Type dengan status Active OFF (misal: CT-INACT-01)."
  - "Terdapat PO berstatus Approved / Open dengan outstanding inbound barang."
test_data:
  - field: "Colli Type (Active OFF)"
    value: "CT-INACT-01 (Active: OFF, Set as Default Data: OFF)"
  - field: "PO Reference"
    value: "PO dengan outstanding inbound aktif di company FAT"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/colli-type"
  - "Pastikan Colli Type dengan Code 'CT-INACT-01' berstatus Active = OFF (atau buat/edit data agar Active OFF)."
  - "Buka menu Purchase Inbound (https://staging.olshoperp.com/supplychain/new-purchase-inbound/create atau /supplychain/purchase-inbound/create)."
  - "Pilih PO dan masukkan item barang ke daftar inbound."
  - "Buka dialog / modal pembuatan New Colli pada baris barang."
  - "Klik dropdown pilihan 'Colli Type'."
  - "Cari dan periksa apakah Code 'CT-INACT-01' muncul dalam daftar pilihan."
  - "Verifikasi bahwa 'CT-INACT-01' tidak tersedia / tidak muncul di daftar pilihan Colli Type."
expected_result: |
  Sesuai requirement supplychain-colli-type §3, §6.2, §6.4 kasus 8, dan capability SF-CT-05:
  1. Hanya Colli Type yang berstatus Active ON yang muncul dan dapat dipilih di dropdown pilihan Colli Type saat pembuatan New Colli di transaksi inbound.
  2. Colli Type dengan Active OFF (misalnya 'CT-INACT-01') TIDAK muncul pada opsi dropdown Colli Type di Purchase Inbound.
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15528
first_execution:
  at: null
  via: null
  jira: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-CT-DRAFT-20260826110000

## Catatan QA

- Skenario menguji integrasi lintas menu (*cross-menu / side-effect*) antara master Colli Type dan transaksi Purchase Inbound (konsumen Colli v2, card [ETM-15528](https://erpintegration.atlassian.net/browse/ETM-15528)).
- Mengacu pada `qa-docs/supplychain-colli-type/requirement.md` §6.4 Kasus 8 & SF-CT-05.
