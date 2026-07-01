---
doc_type: e2e-test-case
tc_code: TC-ARCP-004
menu: accounting-customer-payment
menu_name: Account Receive
title: Bulk select — insert SI dari dropdown Select Invoice
summary: Pilih SI di multiselect header detail → langsung insert full amount tanpa modal Available
status: review
owner: QA - Yemima
last_updated: "2026-06-26"
requirement_ref: "§1 (alokasi ke SI outstanding)"
automated: true
automated_spec: e2e/account-receive-bulk-select-invoice.spec.ts
execution_company:
  code: FAT
  id: 112
related_menus:
  - menu_slug: accounting-customer-payment
    menu_name: Account Receive
    role: primary
    note: Dropdown Select Invoice di section Detail Account Receive
  - menu_slug: accounting-customer-invoice
    menu_name: Sales Invoice
    role: involved
    note: SI muncul di opsi select2 outstanding
preconditions:
  - User login FAT dengan hak update Account Receive.
  - AR open; ada SI outstanding pada tanggal transaksi AR (muncul di dropdown).
  - SI belum ada di detail AR.
test_data:
  - field: Transaksi AR
    value: RC-5TM6UX14 (id 3016) atau AR open setara
steps:
  - Buka form edit AR open.
  - Di section **Detail Account Receive**, pada field **Select Invoice** (multiselect di header tabel), cari dan pilih satu SI outstanding.
  - Tunggu proses selesai (tanpa membuka modal Available Sales Invoice).
  - Periksa tabel detail AR.
expected_result: |
  - Pesan sukses.
  - Baris detail baru untuk SI terpilih dengan alokasi full outstanding.
  - Dropdown kembali kosong setelah sukses.
  - API: `POST /api/accounting/customer-payment/{id}/bulk-select` → delegasi ke `store()` dengan `is_full_amount = 1`.
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
---

## Catatan QA

- Alur ini **berbeda** dari modal Available (TC-ARCP-001/003).
- FE handler: `DatalistDetail.vue` → `createSelect()` → endpoint `bulk-select`.
- Validasi backend: cek invoice belum fully prepared + semua rule `PaymentDetailController@store`.
