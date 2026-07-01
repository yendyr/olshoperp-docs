---
doc_type: e2e-test-case
tc_code: TC-ARCP-001
menu: accounting-customer-payment
menu_name: Account Receive
title: Single use — insert Sales Invoice dari modal Available Sales Invoice
summary: Use per baris di modal Available SI → alokasi amount → detail AR terinsert
status: review
owner: QA - Yemima
last_updated: "2026-06-26"
requirement_ref: "§1 (alokasi ke SI outstanding)"
automated: true
automated_spec: e2e/account-receive-single-use-available-si.spec.ts
execution_company:
  code: FAT
  id: 112
related_menus:
  - menu_slug: accounting-customer-payment
    menu_name: Account Receive
    role: primary
    note: Form edit AR, section Detail Account Receive
  - menu_slug: accounting-customer-invoice
    menu_name: Sales Invoice
    role: involved
    note: SI outstanding yang dipilih dari modal Available
preconditions:
  - User login company **FAT (id 112)** dengan hak update Account Receive.
  - Transaksi AR status **open**, `can_update = true` (belum approved).
  - Customer/store AR punya minimal satu **Sales Invoice outstanding** (belum full prepared/paid).
  - SI yang akan dipilih **belum** ada di detail AR ini.
test_data:
  - field: Transaksi AR (referensi investigasi)
    value: RC-5TM6UX14 (id 3016, staging FAT) — ganti jika data sudah berubah; cari AR open dengan outstanding SI
  - field: URL edit
    value: https://staging.olshoperp.com/accounting/customer-payment/edit/3016
  - field: Contoh SI outstanding (per 2026-06-26)
    value: SI-5TM6UPNM (id 6597) — verifikasi masih outstanding & belum ada di detail AR
steps:
  - Login staging → pilih company **FAT**.
  - Buka form edit AR (contoh `/accounting/customer-payment/edit/3016` atau cari kode **RC-5TM6UX14**).
  - Scroll ke section **Detail Account Receive**.
  - Klik link **Available Sales Invoice** (buka modal daftar SI outstanding).
  - Pada satu baris SI, klik tombol **Use** (bukan checkbox bulk di kolom pertama).
  - Pastikan sub-modal **Use this to Payment Process** terbuka dan tetap bisa diinteraksi (tidak tertutup otomatis).
  - Isi **to be Paid Amount** atau klik **Allocate Full Amount (Clearing)**.
  - Klik **Save** pada sub-modal.
  - Tutup modal Available jika masih terbuka; periksa tabel detail AR di form.
expected_result: |
  - Response sukses (toast/message success).
  - Baris detail baru muncul di tabel **Detail Account Receive** dengan referensi SI yang dipilih.
  - Paid amount sesuai input/alokasi; SI tidak lagi hanya outstanding di modal (atau outstanding berkurang).
  - Sub-modal dan modal Available tertutup / tabel ter-refresh tanpa perlu reload halaman penuh.
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

### Root cause investigasi (2026-06-26)

| Lapisan | Temuan |
|---------|--------|
| Backend | `POST /api/accounting/customer-payment/{id}/customer-payment-detail` **berhasil** jika `amount_before_discount_before_vat` terisi valid. |
| UI — alur wajib single use | Sub-modal alokasi **tidak** auto-insert; user harus isi amount atau klik **Allocate Full Amount** sebelum Save. |
| UI — regresi ETM-14949 | Modal parent (`Dialog.vue`) dapat menutup saat interaksi sub-modal (`child-modal`) jika guard click-outside tidak mengabaikan `[child-modal]` — gejala insert “tidak jalan”. |

### Verifikasi API opsional (dev/QA)

Jika UI gagal, isolasi backend dengan token FAT:

1. `GET /api/accounting/customer-payment/{id}` — pastikan `can_update: true`.
2. `GET /api/accounting/customer-payment/{id}/outstanding-customer-invoice` — pastikan SI ada & `action.updateable: true`.
3. `POST /api/accounting/customer-payment/{id}/customer-payment-detail` dengan `transaction_reference_id`, `amount_before_discount_before_vat`, `is_full_amount` — expect success.

### File terkait (debug)

- FE: `olshoperp-frontend/src/pages/Accounting/AccountReceivable/Receive/DatalistDetail.vue`
- FE: `olshoperp-frontend/src/pages/Accounting/AccountReceivable/Receive/AvailableData.vue`
- FE: `olshoperp-frontend/src/base-components/project/Dialog/Dialog.vue`
- BE: `Modules/Accounting/Http/Controllers/PaymentDetailController.php` (`store`)

### Pemisahan alur

TC ini **hanya single use**. Bulk use → [TC-ARCP-003](./TC-ARCP-003.md). Bulk select → [TC-ARCP-004](./TC-ARCP-004.md).
