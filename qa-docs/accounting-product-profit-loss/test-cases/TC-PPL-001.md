---
doc_type: e2e-test-case
tc_code: TC-PPL-001
menu: accounting-product-profit-loss
menu_name: "Product Profit Loss"
test_type: cross-menu
title: "E2E Kalkulasi Gross Sales Berbasis Price Before VAT pada Transaksi Tax Included"
summary: "Eksekusi end-to-end pembuatan produk baru, PO without PR, purchase inbound, verifikasi benchmark COGS, sales order Tax Included (H-1), wave process, DO, outbound, dan verifikasi report Product Profit Loss berbasis Price Before VAT."
status: approved
owner: QA - Yemima
last_updated: 2026-08-21
requirement_ref: "qa-docs/accounting-product-profit-loss/requirement.md"
automated: true
automated_spec: "tests/specs/product-profit-loss/ppl-gross-sales-before-vat-e2e.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-product-profit-loss
  - supplychain-purchase-order
  - supplychain-new-purchase-inbound
  - accounting-product-benchmark-price
  - all-sales-order
  - omni-waves-management
  - supplychain-delivery-order
  - supplychain-mutation-outbound
preconditions:
  - "User login ke staging dengan akun yang memiliki hak akses menu lengkap"
  - "Company aktif: lumicharmsid (ID: 153)"
test_data:
  - field: vat_type
    value: "Tax Included"
steps:
  - "1. Create new System Product SKU"
  - "2. Create Purchase Order without PR (tanggal H-1)"
  - "3. Create & Approve Purchase Inbound for this PO"
  - "4. Verify Benchmark Price / COGS updated on Product Benchmark Price menu"
  - "5. Create Sales Order for SKU with Tax Included (tanggal H-1)"
  - "6. Process via Send to Default Waves (processing date now)"
  - "7. Process order through Skip Wave Process until completed"
  - "8. Create Delivery Order (DO) matching shipper, add order, approve DO"
  - "9. Create Outbound with type Order, add order, approve Outbound"
  - "10. Open Product Profit Loss report (/accounting/product-profit-loss), verify Gross Sales equals Price Before VAT (DPP)"
expected_result: |
  Gross Sales terhitung murni dari Price Before VAT (DPP setelah diskon line, tanpa PPN), Total COGS akurat dari inbound, Net Profit = Gross Sales - COGS, Profit Margin (%) = (Net Profit / Gross Sales) * 100%, dan Avg. Selling Price = Gross Sales / Qty.
test_result:
  status: passed
  started_at: "2026-08-21T17:23:37+07:00"
  finished_at: "2026-08-21T17:23:45+07:00"
  executed_by: "playwright@gmail.com"
  environment: staging
  log_summary: "Gross Sales terverifikasi berbasis Price Before VAT (DPP) pada SKU CHARM-BEAR-BEADS-Green (Total Qty 3 pcs dari SO-5U46819A & SO-5U45Y9MD, Gross Sales Rp 27.027,03 IDR), tooltip header terverifikasi tidak lagi menyebutkan including VAT, dan seluruh metrik turunan konsisten."
  report_url: null
test_data_used:
  - sku: "CHARM-BEAR-BEADS-Green"
    product_id: 58479
    product_name: "[SKU Platform milik LUMICHARMS] Beads manik manik - Green"
    sales_orders:
      - code: "SO-5U46819A"
        qty: 1
        transaction_date: "2026-08-12"
      - code: "SO-5U45Y9MD"
        qty: 2
        transaction_date: "2026-08-13"
    period: "2026-07-01 s/d 2026-09-07"
    total_qty_sold: 3
    gross_sales_before_vat: 27027.0270
    avg_selling_price: 9009.0090
    module: "Accounting / Product Profit Loss"
run_history:
  - date: "2026-09-07"
    status: passed
    jira_card: "ETM-15635"
origin_jira: ETM-15485
request_id: none
first_execution:
  at: "2026-08-21T17:23:45+07:00"
  via: "legacy:test_result"
  jira: "ETM-15635"
last_execution:
  at: "2026-09-07T15:40:00+07:00"
  jira: "ETM-15635"
  status: passed
  via: "manual:QA - Yemima"
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15485** ([Product Profit Loss - Gross Sales based on Price Before VAT](https://erpintegration.atlassian.net/browse/ETM-15485)).
- Jira Test Case: [ETM-15635](https://erpintegration.atlassian.net/browse/ETM-15635) (Done ✅).
- Target Testing Company: **lumicharmsid** (ID: 153).
- Periode Filter: `2026-07-01` s/d `2026-09-07`.
- Request ID: `none`.

### Referensi Dokumen Transaksi & Verifikasi Laporan:
1. **Master SKU:** `CHARM-BEAR-BEADS-Green` (ID: `58479` - *[SKU Platform milik LUMICHARMS] Beads manik manik - Green*)
2. **Sales Order Valid dalam Periode:**
   - **`SO-5U46819A`** (ID: `2515560`, Tanggal: `12-08-2026`, Status: `Processed`): Qty `1` pcs, Selling Price `Rp 10.000` (Tax Included) $\rightarrow$ Price Before VAT = `Rp 9.009,0090`. Outbound COGS = `Rp 5.000,00`.
   - **`SO-5U45Y9MD`** (ID: `2515556`, Tanggal: `13-08-2026`, Status: `Approved`): Qty `2` pcs (2 line items @ 1 pcs), Selling Price `Rp 10.000` (Tax Included) $\rightarrow$ Price Before VAT = `Rp 9.009,0090` / pcs. Total Gross = `Rp 18.018,0180`.
3. **Hasil Verifikasi Laporan Product Profit Loss (Datalist UI):**
   - **Total Qty Sold:** `3` pcs
   - **Gross Sales (Before VAT):** `Rp 27.027,03` (`27.027,0270` IDR $\rightarrow$ murni dari $3 \times 9.009,0090$ DPP, bukan Rp 30.000 include VAT).
   - **Total COGS (HPP):** `Rp 5.000,00`
   - **Total Net Sales / Profit:** `Rp 22.027,03`
   - **Avg. Selling Price:** `Rp 9.009,01` (`9.009,0090` IDR $\rightarrow$ Gross Sales Before VAT ÷ Qty Sold).
