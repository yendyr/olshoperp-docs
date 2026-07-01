---
doc_type: e2e-test-case
tc_code: TC-ARCP-003
menu: accounting-customer-payment
menu_name: Account Receive
title: Bulk use — insert beberapa SI dari modal Available (checkbox + Use)
summary: Centang beberapa SI di modal Available → Use footer → detail terinsert full amount
status: review
owner: QA - Yemima
last_updated: "2026-06-26"
requirement_ref: "§1 (alokasi ke SI outstanding)"
automated: true
automated_spec: e2e/account-receive-bulk-use-available-si.spec.ts
execution_company:
  code: FAT
  id: 112
related_menus:
  - menu_slug: accounting-customer-payment
    menu_name: Account Receive
    role: primary
    note: Modal Available Sales Invoice, bulk Use footer
  - menu_slug: accounting-customer-invoice
    menu_name: Sales Invoice
    role: involved
    note: Beberapa SI outstanding
preconditions:
  - User login FAT dengan hak update Account Receive.
  - AR open (`can_update`), minimal **dua** SI outstanding untuk customer/store yang sama.
  - SI yang dipilih belum ada di detail AR.
test_data:
  - field: Transaksi AR
    value: AR open di FAT dengan ≥2 outstanding SI (bisa sama fixture RC-5TM6UX14 jika masih valid)
steps:
  - Buka form edit AR open.
  - Klik **Available Sales Invoice**.
  - Centang checkbox pada **dua atau lebih** baris SI (kolom pertama).
  - Klik tombol **Use** di area bulk action footer tabel (bukan Use per baris).
  - Periksa tabel detail AR setelah proses selesai.
expected_result: |
  - Pesan sukses (bulk insert).
  - Setiap SI terpilih muncul sebagai baris detail baru dengan alokasi **full outstanding** (`is_full_amount` di backend).
  - **Tidak** membuka sub-modal alokasi per SI (beda dengan single use).
  - Jika satu SI gagal validasi, backend mengembalikan ringkasan sukses/gagal sesuai `PaymentDetailController@bulkStore`.
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

- API: `POST /api/accounting/customer-payment/{id}/customer-payment-detail-bulk` body `invoice_ids` (comma-separated).
- Tiap invoice tetap lewat validasi strict `store()` di backend.
- **Jangan** gunakan tombol Use per baris — itu alur single use ([TC-ARCP-001](./TC-ARCP-001.md)).
