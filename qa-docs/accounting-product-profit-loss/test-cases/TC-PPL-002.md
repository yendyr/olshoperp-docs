---
doc_type: e2e-test-case
tc_code: TC-PPL-002
menu: accounting-product-profit-loss
menu_name: "Product Profit Loss"
test_type: edge
title: "E2E Kalkulasi Gross Sales Berbasis Price Before VAT pada Transaksi Tax Excluded"
summary: "Eksekusi end-to-end pembuatan produk, PO, inbound, sales order Tax Excluded, outbound, dan verifikasi bahwa Gross Sales pada Product Profit Loss tetap berbasis Price Before VAT (DPP murni tanpa penambahan PPN)."
status: approved
owner: QA - Yemima
last_updated: 2026-09-07
requirement_ref: "qa-docs/accounting-product-profit-loss/requirement.md"
automated: false
automated_spec: null
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
    value: "Tax Excluded"
steps:
  - "1. Create / pilih System Product SKU"
  - "2. Create Purchase Order without PR"
  - "3. Create & Approve Purchase Inbound for this PO"
  - "4. Verify Benchmark Price / COGS updated on Product Benchmark Price menu"
  - "5. Create Sales Order for SKU with Tax Excluded (misal DPP 100.000, VAT 11% 11.000, Selling 111.000)"
  - "6. Process via Send to Default Waves (processing date now)"
  - "7. Process order through Skip Wave Process until completed"
  - "8. Create Delivery Order (DO) matching shipper, add order, approve DO"
  - "9. Create Outbound with type Order, add order, approve Outbound"
  - "10. Open Product Profit Loss report (/accounting/product-profit-loss), verify Gross Sales equals DPP / Price Before VAT (Rp 100.000), bukan harga include PPN (Rp 111.000)"
expected_result: |
  Pada transaksi Tax Excluded, nilai Gross Sales terhitung murni dari Price Before VAT (DPP setelah diskon line, tanpa penambahan PPN). Total COGS akurat dari inbound sebelum PPN, Net Profit = Gross Sales - Total COGS, Profit Margin (%) = (Net Profit / Gross Sales) * 100%, dan Avg. Selling Price = Gross Sales / Qty.
test_result:
  status: passed
  started_at: "2026-09-07T15:46:00+07:00"
  finished_at: "2026-09-07T15:50:00+07:00"
  executed_by: "QA - Yemima"
  environment: staging
  log_summary: "Gross Sales terverifikasi berbasis Price Before VAT (DPP: Rp 100.000,00) pada transaksi Tax Excluded SO-5TO0HEJ7 SKU-ProductPL008 tanpa penambahan PPN, Total COGS Rp 45.000,00, Net Profit Rp 55.000,00, Margin 55.00%, dan Avg Selling Price Rp 100.000,00."
  report_url: null
test_data_used:
  - sku: "SKU-ProductPL008"
    product_id: 89980
    product_name: "Test SKU Product PL VAT Exclude Coef False"
    sales_order_code: "SO-5TO0HEJ7"
    sales_order_id: 2484878
    period: "2026-06-01 s/d 2026-07-31"
    transaction_date: "2026-06-30"
    tax_type: "Tax Excluded"
    selling_price_include_vat: 111000
    price_before_vat_dpp: 100000
    total_qty_sold: 1
    gross_sales_before_vat: 100000
    total_hpp_cogs: 45000
    total_net_sales: 55000
    profit_percentage: 55
    avg_selling_price: 100000
    avg_buying_price: 45000
    module: "Accounting / Product Profit Loss"
run_history:
  - date: "2026-09-07"
    status: passed
    jira_card: "ETM-15659"
origin_jira: ETM-15485
first_execution:
  at: "2026-09-07T15:50:00+07:00"
  via: "manual:Yemima"
  jira: "ETM-15659"
last_execution:
  at: "2026-09-07T15:50:00+07:00"
  jira: "ETM-15659"
  status: passed
  via: "manual:Yemima"
  notes: "Pengujian manual Gross Sales berbasis Price Before VAT teruji sukses."
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15485** ([Product Profit Loss - Gross Sales based on Price Before VAT](https://erpintegration.atlassian.net/browse/ETM-15485)).
- Jira Test Case: [ETM-15659](https://erpintegration.atlassian.net/browse/ETM-15659) (Done ✅).
- Target Testing Company: **lumicharmsid** (ID: 153).
- Filter Periode: `2026-06-01` s/d `2026-07-31`.
- Request ID: `none`.

### Referensi Dokumen Transaksi & Verifikasi Laporan:
1. **Master SKU:** [`SKU-ProductPL008`](https://staging.olshoperp.com/supplychain/product/edit/89980) (ID: `89980` - *Test SKU Product PL VAT Exclude Coef False*)
2. **Sales Order Valid (Tax Excluded):**
   - **`SO-5TO0HEJ7`** (ID: `2484878`, Tanggal: `30-06-2026`, Status: `Processed`):
     - Qty: `1` pcs
     - DPP / Price Before VAT: `Rp 100.000,00`
     - PPN (11% Excluded): `Rp 11.000,00` (Total Selling Price: `Rp 111.000,00`)
     - Total Outbound COGS: `Rp 45.000,00`
3. **Hasil Aktual pada Laporan Product Profit Loss (`/accounting/product-profit-loss`):**
   - **Total Qty Sold:** `1` pcs
   - **Gross Sales:** `Rp 100.000,00` (Terbukti mengambil nilai DPP Before VAT, bukan Rp 111.000).
   - **Total COGS (HPP):** `Rp 45.000,00`
   - **Total Net Sales / Profit:** `Rp 55.000,00`
   - **Profit Margin (%):** `55.00%`
   - **Avg. Selling Price:** `Rp 100.000,00`
   - **Avg. Buying Price:** `Rp 45.000,00`
