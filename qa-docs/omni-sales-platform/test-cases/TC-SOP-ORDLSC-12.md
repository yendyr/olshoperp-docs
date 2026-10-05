---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-12
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: edge
title: "Breakdown Rincian Nilai Sales Invoice (Line Items + Other Cost - Other Discount = Total Invoice)"
summary: "Memastikan rincian perhitungan nilai pada kartu Sales Invoice (SI) menjabarkan komponen subtotal line items ditambah biaya lain-lain (Other Cost) dan dikurangi diskon lain-lain (Other Discount) menghasilkan Total Invoice yang sinkron."
status: ready
owner: "QA - Yemima"
last_updated: 2026-10-05
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15893
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - accounting-customer-invoice
  - all-sales-order
test_data:
  - field: "Sales Order with SI Breakdown"
    value: "SO-5CV9V480 (SI memiliki Other Cost dan Other Discount)"
steps:
  - "1. Buka dokumen Sales Order SO-5CV9V480 yang telah memiliki Sales Invoice"
  - "2. Buka panel Order Lifecycle"
  - "3. Periksa panel Money, Timeline Payment, dan Related Transactions (Customer Invoice)"
  - "4. Periksa rincian breakdown (Product Value, Other Cost, Other Discount, dan Total SI)"
  - "5. Bandingkan nilai pembentuk breakdown dengan nilai riil di dokumen Sales Invoice"
expected_result: |
  1. Panel Money & Timeline: Total Sales Invoice sinkron sebesar Rp83.500 dan Account Receive = Rp83.500.
  2. Related Transactions (Customer Invoice Breakdown - AC-16): Rincian perhitungan breakdown kartu Customer Invoice menjabarkan Product Value Rp70.000, Other Cost +Rp7.500, Other Discount -Rp1.000 sehingga totalnya tepat Rp83.500 (AC-16: Lines + OC - OD = Total Invoice).
  3. Customers & Terms (AC-7): Menampilkan status pembayaran mengacu pada nilai faktur final ("83.500 of 83.500 already paid").
  4. Money Trail (AC-8 & AC-9): Order Amount = Rp77.000 (nilai komitmen SO), dan Invoiceable Value = Rp83.500 (nilai hak tagih yang sinkron dengan Sales Invoice setelah memperhitungkan Additional Cost & Additional Discount).
test_result:
  status: passed
  started_at: "2026-10-05T16:20:00+07:00"
  finished_at: "2026-10-05T16:35:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED (ETM-16166 Retest): Seluruh perhitungan pada panel Order Lifecycle telah sinkron: (1) Rincian breakdown Customer Invoice mencatat Product Value Rp70.000, Other Cost +Rp7.500, Other Discount -Rp1.000 (Total Rp83.500), (2) Customers & Terms menampilkan 'Cash upon receipt 83.500,00 of 83.500,00 already paid', dan (3) Money Trail Invoiceable Value = Rp83.500 sinkron dengan Sales Invoice."
  report_url: null
test_data_used:
  - trx_code: "SO-5CV9V480"
    product_amount: "70.000"
    so_total_price: "77.000"
    additional_cost: "7.500"
    additional_discount: "1.000"
    sales_invoice_total: "83.500"
    customer_invoice_breakdown: "Product: 70.000 + Other Cost: 7.500 - Other Discount: 1.000 = 83.500"
    customers_and_terms: "Cash upon receipt 83.500,00 of 83.500,00 already paid"
    invoiceable_value: "83.500"
run_history:
  - run_at: "2026-09-24T21:33:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Defect AC-4 & AC-16: Hyperlink SI Code salah routing ke /finance/sales-invoice/edit/{id} (404 Page Not Found)."
  - run_at: "2026-09-30T10:15:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-16098"
    note: "Retest PASSED (AC-04, AC-16): Tautan SI-5TBWFWT2 mengarah ke rute valid /accounting/customer-invoice/{id} tanpa 404."
  - run_at: "2026-10-05T10:40:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-16166"
    note: "FAILED: (1) Other Cost di breakdown Customer Invoice terduplikasi 2x (+15.000 dari riil 7.500), (2) Customers & Terms '83.500 of 77.000', (3) Invoiceable Value belum include Other Cost & Discount SI."
  - run_at: "2026-10-05T16:35:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-16166"
    note: "Retest PASSED: (1) Other Cost breakdown sinkron (+7.500), (2) Customers & Terms '83.500,00 of 83.500,00 already paid', (3) Invoiceable Value = 83.500."
  - run_at: "2026-10-05T16:38:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-16221"
    note: "PASSED: Money strip konsisten dengan Money Trail, breakdown SI (lines + OC - OD = Invoice Total), dan status pembayaran sinkron dengan SI/RC."
first_execution:
  at: "2026-09-24T21:33:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-10-05T16:38:00+07:00"
  jira: "ETM-16221"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-12: Breakdown Rincian Nilai Sales Invoice (Line Items + Other Cost - Other Discount = Total Invoice)

## Objective
Memverifikasi ketepatan formula kalkulasi dan penjabaran detail tagihan penjualan (*Sales Invoice breakdown*) pada panel Order Lifecycle sesuai kriteria AC-7, AC-8, AC-9, dan AC-16 (ETM-16166 / ETM-16221).

## Rujukan Requirement Card (ETM-16166 / ETM-15893)
* **AC-7 (Customer & Terms):** Panel ke-5 pada General Order menampilkan kartu *Customer & Terms* yang memuat perbandingan nilai pembayaran terhadap dokumen penagihan.
* **AC-8 & AC-9 (Money Strip & Money Trail):** Total kartu kiri dan alur perhitungan harus konsisten tanpa pembulatan dan merefleksikan nilai invoice riil:  
  `Order Amount -> Invoiceable Value = Sales Invoice - Platform Fee = Received in Bank`
* **AC-16 (SI Breakdown):** Formula rincian tagihan wajib sinkron:  
  `Lines + Other Cost (OC) - Other Discount (OD) = Total Invoice`

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893**, **ETM-16098**, dan retest **ETM-16166** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-16166)).
- Dokumen Uji: `SO-5CV9V480`
- Detail Sales Order: Total Price = Rp77.000 (Product Amount = Rp70.000)
- Detail Sales Invoice: Additional Cost = Rp7.500, Additional Discount = Rp1.000, Total SI = Rp83.500

### Hasil Pengujian Retest Pasca-Fix Backend (ETM-16166):
1. **Breakdown Related Transaction (Customer Invoice - AC-16):** **PASSED 🟢**  
   - Rincian kalkulasi breakdown kartu Customer Invoice menjabarkan komponen dengan presisi:
     - `Product Value`: **Rp70.000**
     - `Other Cost`: **+Rp7.500** *(sudah diperbaiki, tidak terduplikasi)*
     - `Other Discount`: **-Rp1.000**
   - Total kalkulasi rincian breakdown: $70.000 + 7.500 - 1.000 = \mathbf{Rp83.500}$ (100% sinkron dengan Total Customer Invoice).
2. **Customers & Terms (AC-7):** **PASSED 🟢**  
   - Menampilkan status: *"Cash upon receipt 83.500,00 of 83.500,00 already paid"*.
   - Basis pembanding penagihan sudah tepat mengacu pada total Sales Invoice final (Rp83.500), tidak lagi terdistorsi total SO awal (Rp77.000).
3. **Money Trail (AC-8 & AC-9):** **PASSED 🟢**  
   - `Invoiceable Value` = **Rp83.500**.
   - Nilai *Invoiceable Value* telah memasukkan Additional Cost (+7.500) dan Additional Discount (-1.000), sinkron dengan nilai faktur Sales Invoice yang terbentuk.

### Kesimpulan:
**PASSED 🟢**  
Perbaikan backend pada `OrderLifecycleService.php` telah menyelesaikan seluruh desinkronisasi nilai. Rincian breakdown Customer Invoice, status pembayaran Customers & Terms, dan Money Trail Invoiceable Value kini 100% konsisten dengan nilai transaksi riil.


