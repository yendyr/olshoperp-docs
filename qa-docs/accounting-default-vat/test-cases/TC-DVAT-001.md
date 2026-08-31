---
doc_type: e2e-test-case
tc_code: TC-DVAT-001
menu: accounting-default-vat
menu_name: "Default VAT"
test_type: happy
title: "Setup Purchase VAT default dengan Tax aktif"
summary: "Memilih Tax aktif pada Purchase VAT accordion, mengatur VAT Type (Include/Exclude) dan Auto Add Trx, serta memverifikasi auto-save dan field mirror terisi."
status: draft
owner: QA - Yemima
last_updated: 2026-08-26
requirement_ref: "qa-docs/accounting-default-vat/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-tax
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "Master Tax berstatus Active tersedia di company FAT dengan mapping Purchase COA."
test_data:
  - field: "Select VAT"
    value: "PPN 11% (Active: ON, Purchase COA terpetakan)"
  - field: "VAT Type"
    value: "Include"
  - field: "Auto Add Trx"
    value: "YES"
steps:
  - "Buka https://staging.olshoperp.com/accounting/default-vat"
  - "Buka accordion 'Purchase VAT' (default open)."
  - "Klik dropdown 'Select VAT' pada bagian Purchase VAT."
  - "Pilih opsi Tax aktif (misal: PPN 11%)."
  - "Pilih radio button 'VAT Type' (misal: Include)."
  - "Pilih dropdown 'Auto Add Trx' menjadi 'YES'."
  - "Periksa notifikasi toast sukses setelah setiap perubahan nilai (auto-save)."
  - "Verifikasi bahwa field Code, Name, Tariff, Coefficient, Purchase COA, dan Description terisi otomatis sesuai data Tax dan berstatus disabled."
  - "Periksa status checklist 'Purchase VAT' pada Sidenav sebelah kanan berstatus tercentang (checked)."
expected_result: |
  Sesuai requirement.md §5.1, §6.1, §7 #4, & AC DV-01:
  1. Perubahan konfigurasi Select VAT, VAT Type, dan Auto Add Trx tersimpan otomatis via auto-save (toast sukses muncul tanpa perlu klik tombol Save).
  2. Field mirror (Code, Name, Tariff, Coefficient, Purchase COA, Description) terisi otomatis dan disabled (read-only).
  3. Purchase COA menampilkan akun aset/pembelian dari master Tax terkait.
  4. Sidenav item 'Purchase VAT' berubah menjadi tercentang (checked).
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
origin_jira: null
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

# TC-DVAT-DRAFT-20260826162201

## Catatan QA

- Skenario memverifikasi *happy path* konfigurasi Purchase VAT default pada menu Default VAT.
- Memastikan mekanisme *auto-save* berjalan saat memilih VAT, mengganti VAT Type (Include/Exclude), atau mengubah opsi Auto Add Trx.
- Menguji pengisian *mirror fields* dan pemetaan Purchase COA yang bersifat *read-only*.
