---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-01
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Entry Point Navigasi Form Edit dan Pembukaan Slideover Order Lifecycle XL"
summary: "Memastikan menu navigasi Order Lifecycle tampil di posisi paling atas form edit SO (Sales Platform, General, maupun via All Sales Order) dan berhasil membuka panel Slideover ukuran XL."
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
  - field: "Sales Order Platform"
    value: "SO-5TBW8NFJ"
  - field: "Sales Order General"
    value: "SO-5UJDJFG0"
steps:
  - "1. Buka menu Sales Platform (/omnichannel/sales-order) atau All Sales Order (/businessdevelopment/all-sales-order)"
  - "2. Buka form Edit dokumen Sales Platform (SO-5TBW8NFJ)"
  - "3. Periksa section navigasi di sebelah kanan form, pastikan item 'Order Lifecycle' berada di posisi teratas"
  - "4. Klik item 'Order Lifecycle' dan amati respons UI"
  - "5. Buka form Edit dokumen Sales Order General (SO-5UJDJFG0) dan lakukan klik 'Order Lifecycle'"
  - "6. Klik tombol 'Done' atau area overlay untuk menutup Slideover"
expected_result: |
  1. Item navigasi 'Order Lifecycle' muncul di posisi teratas pada navigasi kanan form edit.
  2. Saat diklik, panel Slideover berukuran ekstra besar (size='xl') terbuka mulus dari sisi kanan layar tanpa error 500.
  3. Header Slideover memuat judul 'Order Lifecycle' serta tombol aksi 'Print' dan 'Done'.
  4. Slideover dapat ditutup kembali dengan lancar menggunakan tombol 'Done'.
test_result:
  status: passed
  started_at: "2026-09-24T10:45:00+07:00"
  finished_at: "2026-09-24T10:56:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Menu Order Lifecycle tampil di navigasi kanan form edit SO-5TBW8NFJ dan berhasil membuka panel Slideover XL lengkap dengan tombol Print Summary, Done, serta seluruh struktur section."
  report_url: "https://app.betterbugs.io/session/6ab4a303587953ccdcfdaece"
test_data_used:
  - trx_code: "SO-5TBW8NFJ"
    status_order: "Approved"
    sections_rendered:
      - "Print Summary & Done buttons"
      - "Detail Sales Order Platform"
      - "Quantity Strip (total order qty = delivered & invoiced = kept by buyer)"
      - "Money Strip (order amount, invoiceable value = sales invoice - platform fee = received in bank = money kept from this order)"
      - "Order Lifecycle Timeline (order arrives from marketplace -> warehouse process -> shipping -> failed ship -> settlement & payment -> return after settlement)"
      - "Related Transactions (approval, warehouse & delivery, invoice & payment)"
      - "Marketplace Connection (platform order only)"
      - "Money Trail"
      - "What Held This Order Up"
run_history:
  - run_at: "2026-09-24T10:56:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
first_execution:
  at: "2026-09-24T10:56:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-24T10:56:00+07:00"
  jira: "ETM-15893"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-01: Entry Point Navigasi Form Edit dan Pembukaan Slideover Order Lifecycle XL

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-15893)).
- Dokumen Uji: `SO-5TBW8NFJ` (Sales Platform)
- Environment: Staging

### Actual Result:
1. Tombol menu navigasi **Order Lifecycle** tampil di sisi kanan form edit dan dapat diklik dengan responsif.
2. Panel Slideover XL berhasil terbuka mulus tanpa error 500.
3. Seluruh section utama berhasil di-render dengan lengkap:
   - Header & Tombol Aksi: **Print Summary** dan **Done**.
   - Identitas: **Detail Sales Order Platform**.
   - Strip Ringkasan: **Quantity** (`total order qty = delivered & invoiced = kept by buyer`) dan **Money** (`order amount, invoiceable value = sales invoice - platform fee = received in bank = money kept from this order`).
   - Alur Kronologis: **Order Lifecycle Timeline** (*Order arrives from marketplace ➔ Warehouse process ➔ Shipping ➔ Failed ship (no failed ship recorded) ➔ Settlement & payment ➔ Return after settlement (no return requested)*).
   - Dokumen Terkait: **Related Transactions** (*Approval, Warehouse & Delivery, Invoice & Payment*).
   - Integrasi: **Marketplace Connection** (*Platform order only*).
   - Detail Keuangan: **Money Trail**.
   - Catatan Kendala: **What Held This Order Up**.
4. **Status:** **PASSED** ✅.
