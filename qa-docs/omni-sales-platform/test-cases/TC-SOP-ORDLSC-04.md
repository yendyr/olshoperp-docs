---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-04
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Kalkulasi dan Integritas Strip Quantity dan Strip Money pada Order Lifecycle"
summary: "Memastikan strip ringkasan Quantity dan Money menghitung saldo akhir sesuai formula masing-masing tipe order (Platform: Kept by buyer / Money kept; General: Still to deliver / Outstanding receivable) dengan operator aritmatika yang konsisten."
status: ready
owner: "QA - Yemima"
last_updated: 2026-09-30
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
  status: passed
  started_at: "2026-09-30T10:00:00+07:00"
  finished_at: "2026-09-30T10:10:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Pada SO General (SO-5UJDJFG0 / SO-5UJF5WID), kartu akhir di strip Quantity sudah benar 'still to deliver' (nilai 0) dan di strip Money adalah 'outstanding receivable' (Rp25.000). Sesuai dengan spesifikasi formula persona B2B (AC-08)."
  report_url: "https://drive.google.com/file/d/13zK7UwzeRzjEA9xlPw6zA4z_Gae6zCOV/view?usp=drive_link"
test_data_used:
  - trx_code_platform: "SO-5TBW8NFJ"
    actual_qty_strip: "total order qty = delivered & invoiced = kept by buyer"
    actual_money_strip: "order amount, invoiceable value = sales invoice - platform fee = received in bank = money kept from this order"
  - trx_code_general: "SO-5UJDJFG0"
    actual_qty_strip: "Order - Delivered - Returned = Still to deliver (0)"
    actual_money_strip: "Order - Not Yet Invoiced = Invoiced - Paid = Outstanding receivable (Rp25.000)"
run_history:
  - run_at: "2026-09-24T13:30:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Defect: Label kartu strip Qty & Money pada SO General masih mengadopsi wording Platform (kept by buyer & money kept)"
  - run_at: "2026-09-30T10:10:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-16098"
    note: "Retest PASSED (AC-08): Strip Quantity berakhir di 'Still to deliver' dan strip Money berakhir di 'Outstanding receivable'."
first_execution:
  at: "2026-09-24T13:30:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-30T10:10:00+07:00"
  jira: "ETM-16098"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-04: Kalkulasi dan Integritas Strip Quantity dan Strip Money pada Order Lifecycle

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** dan retest pada **ETM-16098** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-16098)).
- Dokumen Uji:
  - Platform: `SO-5TBW8NFJ`
  - General: `SO-5UJDJFG0` / `SO-5UJF5WID`
- Evidence Retest: https://drive.google.com/file/d/13zK7UwzeRzjEA9xlPw6zA4z_Gae6zCOV/view?usp=drive_link

### Hasil Pengujian Retest (ETM-16098):
1. **Mode Sales Platform (`SO-5TBW8NFJ`):**
   - Strip Qty: `total order qty = delivered & invoiced = kept by buyer` ✅
   - Strip Money: `order amount, invoiceable value = sales invoice - platform fee = received in bank = money kept from this order` ✅
   - Status untuk Platform: Sesuai spesifikasi.

2. **Mode Sales Order General (`SO-5UJDJFG0` / `SO-5UJF5WID`):**
   - **Quantity Strip:** Menampilkan alur B2B `Order − Delivered − Returned = Still to deliver` (nilai 0) ✅.
   - **Money Strip:** Menampilkan alur piutang B2B `Order − Not Yet Invoiced = Invoiced − Paid = Outstanding receivable` (nilai Rp25.000) ✅.

### Kesimpulan:
**PASSED 🟢 (AC-08 Terpenuhi).**  
Pemisahan persona General (B2B) dan formula strip Quantity ("Still to deliver") serta strip Money ("Outstanding receivable") telah terimplementasi dengan tepat dan sinkron.
