---
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082601
title: "POV Purchase Order — Datalist Detail PO per SKU Grouped by Supplier & Running Total Tagihan"
module: Accounting
menu: Purchase Report
menu_slug: accounting-purchase-report
type: functional
priority: high
automated: false
automated_spec: null
origin_jira: ETM-15487
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-purchase-order
preconditions:
  - "User login ke OlshopERP pada company target (misal Dev Staging ID 13)"
  - "Navigasi ke menu Purchase Report (https://staging.olshoperp.com/accounting/purchase-report)"
  - "Terdapat data transaksi Purchase Order (With PR & Without PR) di database"
---

# Test Case: POV Purchase Order — Datalist Detail PO per SKU Grouped by Supplier & Running Total Tagihan

## 📋 Summary
Memastikan saat Type = Purchase Order, datalist menampilkan hanya data Purchase Order per SKU yang di-group per Supplier dengan running total tagihan & header group yang akurat.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu Finance / Accounting Report.
- Berada di halaman `/accounting/purchase-report`.

## 🧪 Test Steps
1. Buka menu Accounting -> Report -> Purchase Report (https://staging.olshoperp.com/accounting/purchase-report).
2. Pilih Type = "Purchase Order".
3. Tentukan Date Range (misal 30 hari terakhir) dan klik "Apply / Search".
4. Verifikasi struktur datalist dan pengelompokan baris data per Supplier.

## ✅ Expected Result
- Datalist menampilkan data per SKU yang dikelompokkan (Grouped) berdasarkan Supplier.
- Setiap grup Supplier memiliki header group dengan akumulasi total tagihan running yang sesuai.
- Setiap baris SKU menampilkan detail spesifik PO (Trx Code, SKU, Product Name, Qty, Unit Price, Total Price).
