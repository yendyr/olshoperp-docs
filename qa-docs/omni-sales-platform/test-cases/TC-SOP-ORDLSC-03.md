---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-03
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Tampilan Layout dan Persona Mode Sales Order General pada Order Lifecycle"
summary: "Memastikan panel Order Lifecycle pada order General menampilkan chip General order, identitas B2B (Customer PO, Customer, Salesperson, Payment Term), rail Approval Level, card Customer & Terms, dan tidak menampilkan elemen milik Platform order."
status: draft
owner: "QA - Yemima"
last_updated: 2026-09-24
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15893
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - businessdevelopment-sales-order-general
  - all-sales-order
test_data:
  - field: "Sales Order General Code"
    value: "SO-5UJDJFG0"
steps:
  - "1. Buka form Edit dokumen Sales Order General SO-5UJDJFG0"
  - "2. Klik menu 'Order Lifecycle' di navigasi kanan"
  - "3. Periksa chip tipe order dan identitas header pada panel"
  - "4. Periksa status rail di bagian atas timeline"
  - "5. Periksa section ke-5 untuk memastikan kehadiran card 'Customer & Terms'"
  - "6. Periksa seluruh panel dan pastikan tidak ada chip 'Booking No', card 'Marketplace Connection', atau potongan 'Platform Fee'"
expected_result: |
  1. Header menampilkan chip 'General order'.
  2. Identitas menampilkan: Customer Name, Customer PO, Salesperson, dan Payment Term.
  3. Status rail menampilkan alur general: Approval Level · Delivery · Invoice · Payment Due (+ Internal).
  4. Section ke-5 menampilkan card 'Customer & Terms' yang memuat ketentuan pembayaran, TOP, dan alamat penagihan/pengiriman.
  5. Elemen khusus Platform order (seperti Booking No, Marketplace Connection, dan Platform Fee) disembunyikan secara rapi (tidak muncul).
test_result:
  status: passed
  started_at: "2026-09-24T13:20:00+07:00"
  finished_at: "2026-09-24T13:26:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Panel Order Lifecycle pada SO General (SO-5UJDJFG0) berhasil menampilkan chip 'General order', Customer, Salesperson, Payment Term, dan card Customer & Terms. Komponen khusus Platform (Marketplace Connection, Booking No, Platform Fee) tersembunyi dengan benar."
  report_url: null
test_data_used:
  - trx_code: "SO-5UJDJFG0"
    type: "General order"
    verified_elements:
      - "Chip 'General order'"
      - "Customer Name"
      - "Salesperson"
      - "Payment Term"
      - "Card Customer & Terms"
    hidden_elements_verified:
      - "No Marketplace Connection card"
      - "No Booking No chip"
      - "No Platform Fee deduction"
run_history:
  - run_at: "2026-09-24T13:26:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
first_execution:
  at: "2026-09-24T13:26:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-24T13:26:00+07:00"
  jira: "ETM-15893"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-03: Tampilan Layout dan Persona Mode Sales Order General pada Order Lifecycle

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-15893)).
- Dokumen Uji: `SO-5UJDJFG0` (Sales Order General)
- Status Order: `Approved`
- Environment: Staging

### Actual Result:
1. Teridentifikasi jelas chip tipe pesanan: **General order** ✅.
2. Identitas B2B tampil lengkap: **Customer Name**, **Salesperson**, dan **Payment Term** ✅.
3. Card khusus **Customer & Terms** muncul pada panel ✅.
4. Elemen khusus Platform terisolasi dengan rapi: **TIDAK ADA** card *Marketplace Connection*, chip *Booking No*, maupun potongan *Platform Fee* ✅.
5. **Kesimpulan:** **PASSED 🟢**. Struktur layout dan pemisahan persona identitas General order telah bekerja sesuai spesifikasi AC-7.
