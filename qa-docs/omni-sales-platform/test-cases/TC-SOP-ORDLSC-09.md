---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-09
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: edge
title: "Penanganan Order dengan Failed Ship (Partial FS dan Full FS) pada Strip Quantity dan Money"
summary: "Memastikan order yang mengalami kendala Failed Ship (FS) mencatat pemisahan kuantitas gagal kirim dengan benar, di mana pada Partial FS sisa barang tetap dapat ditagihkan/dikirim dan pada Full FS nilai invoiceable dijelaskan bernilai 0."
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
  - omni-sales-platform
  - all-sales-order
test_data:
  - field: "Sales Order Partial / Full FS"
    value: "Order dengan status / riwayat Failed Ship"
steps:
  - "1. Buka dokumen Sales Platform yang memiliki riwayat Failed Ship (Partial FS atau Full FS)"
  - "2. Buka panel Order Lifecycle"
  - "3. Periksa strip Quantity: Amati apakah pengurangan FS (Order - FS) tercatat jelas"
  - "4. Periksa strip Money: Amati apakah pengurang nilai FS (Order - FS Value) terefleksi pada Invoiceable Value"
  - "5. Pada Full FS, pastikan Invoiceable Value bernilai 0 dengan penjelasan status"
expected_result: |
  1. Pada kasus Partial FS: Qty yang berhasil dikirim dihitung dari (Order - FS) dan sisa qty masuk ke Delivered & Invoiced.
  2. Pada kasus Full FS: Nilai invoiceable menjadi 0 dan panel memberikan keterangan penahanan Failed Ship secara transparan.
  3. Dokumen Failed Ship (FS-xxx) terdaftar di section Related Transactions.
test_result:
  status: passed
  started_at: "2026-09-24T21:10:00+07:00"
  finished_at: "2026-09-24T21:17:00+07:00"
  executed_by: "QA - Yemima / OlshopERP"
  environment: staging
  log_summary: "PASSED: Pada order Failed Ship SO-5UGW6O2B (dokumen FS-5UIDIKR5), card Failed Ship berhasil dirender pada section Quantity dan section Money. Dokumen FS-5UIDIKR5 tercatat valid di section Related Transactions (memenuhi AC-11 dan AC-12)."
  report_url: "https://app.betterbugs.io/session/6ab530609a0216b8a623a3d7"
test_data_used:
  - trx_code: "SO-5UGW6O2B"
    fs_code: "FS-5UIDIKR5"
    fs_details: "Product Qty = 2, Restock Qty = 1, Lost Items = 1, Total FS Qty = 2"
    actual_quantity_money: "Card Failed Ship muncul pada section Quantity dan Money."
    actual_related_transactions: "Dokumen FS-5UIDIKR5 muncul di section Related Transactions."
run_history:
  - run_at: "2026-09-24T21:17:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Memenuhi AC-11 & AC-12: Card Failed Ship ter-render di section Quantity & Money, dokumen FS muncul di Related Transactions."
first_execution:
  at: "2026-09-24T21:17:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-24T21:17:00+07:00"
  jira: "ETM-15893"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-09: Penanganan Order dengan Failed Ship (Partial FS dan Full FS) pada Strip Quantity dan Money

## Objective
Memvalidasi kalkulasi dan penyajian data pesanan yang mengalami kegagalan pengiriman (*Failed Ship*) sesuai Acceptance Criteria AC-12, memastikan sisa kuantitas dan nilai penagihan dihitung secara akurat.

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-15893)).
- Dokumen Uji: `SO-5UGW6O2B`
- Dokumen Failed Ship: `FS-5UIDIKR5` (Product Qty = 2, Restock Qty = 1, Lost Items = 1, Total FS Qty = 2).
- Catatan: Order dibuka melalui form edit menu Failed Ship.
- Evidence Session:
  - Section Quantity & Money: [BetterBugs Session 6ab53060](https://app.betterbugs.io/session/6ab530609a0216b8a623a3d7)
  - Section Related Transactions: [BetterBugs Session 6ab530be](https://app.betterbugs.io/session/6ab530be9a0216b8a623a3e8?openedDevTab=info&openedConsoleSubTab=all&openedStepsSubTab=all)

### Hasil Pengujian (Actual vs Expected):
1. **Render Card Failed Ship (AC-11 & AC-12):**
   - *Actual:* Card Failed Ship muncul pada section Quantity dan section Money dengan nilai pengurangan yang merefleksikan kegagalan pengiriman ✅.
   - *Expected:* Order dengan Failed Ship menampilkan card FS pada strip Quantity dan Money.
2. **Pencatatan Dokumen di Section Related Transactions:**
   - *Actual:* Dokumen `FS-5UIDIKR5` muncul di section Related Transactions ✅.
   - *Expected:* Seluruh dokumen Failed Ship yang terbentuk terdaftar pada section Related Transactions.

### Kesimpulan:
**PASSED 🟢.**  
Card Failed Ship pada section Quantity dan Money serta entri dokumen pada section Related Transactions telah terimplementasi dengan baik sesuai kriteria AC-11 dan AC-12.

