---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-04
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Kalkulasi dan Integritas Strip Quantity dan Strip Money pada Order Lifecycle"
summary: "Memastikan strip ringkasan Quantity dan Money menghitung saldo akhir sesuai formula masing-masing tipe order (Platform: Kept by buyer / Money kept; General: Still to deliver / Outstanding receivable) dengan operator aritmatika yang konsisten."
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
  - "1. Buka panel Order Lifecycle untuk Sales Platform (SO-5TBW8NFJ)"
  - "2. Amati kartu-kartu pada strip Quantity dan periksa operator antar kartu (Order − FS = Delivered & Invoiced − Returned = Kept by Buyer)"
  - "3. Amati kartu-kartu pada strip Money dan periksa operator antar kartu (Order − FS Value = Invoiced − Platform Fee = Received − Refund = Money Kept)"
  - "4. Buka panel Order Lifecycle untuk Sales Order General (SO-5UJDJFG0)"
  - "5. Amati strip Quantity General (Expected: Order − Delivered − Returned = Still to Deliver)"
  - "6. Amati strip Money General (Expected: Order − Not Yet Invoiced = Invoiced − Paid = Outstanding Receivable)"
expected_result: |
  1. Pada Platform order (SO-5TBW8NFJ): Strip Qty berakhir pada 'Kept by Buyer' dan Strip Money berakhir pada 'Money Kept'.
  2. Pada General order (SO-5UJDJFG0): Strip Qty berakhir pada 'Still to deliver' (bukan kept by buyer) dan Strip Money berakhir pada 'Outstanding receivable' (bukan money kept).
  3. Operator aritmatika konsisten dan nilai nominal tidak drift.
test_result:
  status: failed
  started_at: "2026-09-24T13:20:00+07:00"
  finished_at: "2026-09-24T13:30:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "FAILED: Pada SO General (SO-5UJDJFG0), label kartu akhir strip Quantity masih menampilkan terminologi Platform 'kept by buyer' (seharusnya: Still to deliver), dan kartu akhir strip Money masih menampilkan 'money kept from this order' (seharusnya: Outstanding receivable). Komponen FE belum membedakan wording strip antara Platform vs General."
  report_url: "https://app.betterbugs.io/session/6ab4d22f587953ccdcfdb27f"
test_data_used:
  - trx_code_platform: "SO-5TBW8NFJ"
    actual_qty_strip: "total order qty = delivered & invoiced = kept by buyer"
    actual_money_strip: "order amount, invoiceable value = sales invoice - platform fee = received in bank = money kept from this order"
  - trx_code_general: "SO-5UJDJFG0"
    actual_qty_strip: "total order qty = delivered & invoiced = kept by buyer"
    expected_qty_strip: "Order - Delivered - Returned = Still to deliver"
    actual_money_strip: "order amount (55.000), invoiceable value (55.000) = received in bank (0) = money kept from this order (0)"
    expected_money_strip: "Order - Not Yet Invoiced = Invoiced - Paid = Outstanding receivable"
run_history:
  - run_at: "2026-09-24T13:30:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Defect: Label kartu strip Qty & Money pada SO General masih mengadopsi wording Platform (kept by buyer & money kept)"
first_execution:
  at: "2026-09-24T13:30:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-24T13:30:00+07:00"
  jira: "ETM-15893"
  status: failed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-04: Kalkulasi dan Integritas Strip Quantity dan Strip Money pada Order Lifecycle

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-15893)).
- Dokumen Uji:
  - Platform: `SO-5TBW8NFJ`
  - General: `SO-5UJDJFG0`

### Hasil Pengujian (Actual vs Expected):
1. **Mode Sales Platform (`SO-5TBW8NFJ`):**
   - Strip Qty: `total order qty = delivered & invoiced = kept by buyer` ✅
   - Strip Money: `order amount, invoiceable value = sales invoice - platform fee = received in bank = money kept from this order` ✅
   - Status untuk Platform: Sesuai spesifikasi.

2. **Mode Sales Order General (`SO-5UJDJFG0`):**
   - **Quantity Strip:**
     - *Actual:* Menampilkan 3 kartu: `total order qty = delivered & invoiced = kept by buyer` ❌.
     - *Expected:* Seharusnya menampilkan alur B2B: `Order − Delivered − Returned = Still to deliver`.
   - **Money Strip:**
     - *Actual:* Menampilkan: `order amount (55.000), invoiceable value (55.000) = received in bank (0) = money kept from this order (0)` ❌.
     - *Expected:* Seharusnya menampilkan alur piutang B2B: `Order − Not Yet Invoiced = Invoiced − Paid = Outstanding receivable`.

### Kesimpulan:
**FAILED ❌ (Defect Wording / Persona Mismatch).**  
Komponen strip kartu ringkasan di Frontend belum mengimplementasikan logika pemisahan teks label untuk mode General, sehingga pesanan General masih menampilkan terminologi marketplace (*kept by buyer* dan *money kept from this order*).
