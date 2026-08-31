---
doc_type: e2e-test-case
tc_code: TC-PPL-002
menu: accounting-product-profit-loss
menu_name: "Product Profit Loss"
test_type: edge
title: "E2E Kalkulasi Gross Sales Berbasis Price Before VAT pada Transaksi Tax Excluded"
summary: "Eksekusi end-to-end pembuatan produk, PO, inbound, sales order Tax Excluded, outbound, dan verifikasi bahwa Gross Sales pada Product Profit Loss tetap berbasis Price Before VAT (DPP murni tanpa penambahan PPN)."
status: draft
owner: QA - Yemima
last_updated: 2026-08-26
requirement_ref: "qa-docs/accounting-product-profit-loss/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 110
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
  - "Company aktif: lumicharmsid (ID: 110)"
test_data:
  - field: vat_type
    value: "Tax Excluded"
steps:
  - "1. Create new System Product SKU"
  - "2. Create Purchase Order without PR (tanggal H-1)"
  - "3. Create & Approve Purchase Inbound for this PO"
  - "4. Verify Benchmark Price / COGS updated on Product Benchmark Price menu"
  - "5. Create Sales Order for SKU with Tax Excluded (tanggal H-1, misal DPP 100.000, VAT 10% 10.000, Selling 110.000)"
  - "6. Process via Send to Default Waves (processing date now)"
  - "7. Process order through Skip Wave Process until completed"
  - "8. Create Delivery Order (DO) matching shipper, add order, approve DO"
  - "9. Create Outbound with type Order, add order, approve Outbound"
  - "10. Open Product Profit Loss report (/accounting/product-profit-loss), verify Gross Sales equals DPP / Price Before VAT (Rp 100.000), bukan harga include PPN (Rp 110.000)"
expected_result: |
  Pada transaksi Tax Excluded, nilai Gross Sales terhitung murni dari Price Before VAT (DPP setelah diskon line, tanpa penambahan PPN). Total COGS akurat dari inbound sebelum PPN, Net Profit = Gross Sales - Total COGS, Profit Margin (%) = (Net Profit / Gross Sales) * 100%, dan Avg. Selling Price = Gross Sales / Qty.
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
origin_jira: ETM-15485
first_execution:
  at: null
  via: null
  jira: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15485** ([Product Profit Loss - Gross Sales based on Price Before VAT](https://erpintegration.atlassian.net/browse/ETM-15485)).
- Jira Test Case: [ETM-15659](https://erpintegration.atlassian.net/browse/ETM-15659).
- Target Testing Company: **lumicharmsid** (ID: 110).
- Request ID: `none`.
