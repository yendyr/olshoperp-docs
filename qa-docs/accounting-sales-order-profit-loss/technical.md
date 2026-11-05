---
doc_type: technical
menu: accounting-sales-order-profit-loss
menu_name: "Sales Order Profit Loss"
version: 1.0
last_updated: 2026-11-05
owner: QA - Yemima
status: review
audience: developer
---

# Sales Order Profit Loss — Technical Documentation

**UI:** `/accounting/sales-order-profit-loss`  
**Controller:** `Modules/Accounting/Http/Controllers/SalesOrderProfitLossController.php`  
**FE:** `olshoperp-frontend/src/pages/Accounting/Report/SalesOrderProfitLoss/`

---

## 1. Endpoints (AS-IS)

| Method path (prefix accounting) | FE consumer | Grain |
|---------------------------------|-------------|-------|
| `…/sales-order-profit-loss/daily` | `DailyTable.vue` | per day |
| `…/sales-order-profit-loss/daily-per-store` | `StoreTable.vue` | day + store + platform |
| `…/sales-order-profit-loss/daily-per-platform` | `PlatformTable.vue` | day + platform |
| `…/sales-order-profit-loss/daily-per-so` | `OrderTable.vue` | **per Sales Order** |
| Chart helpers (`daily` chart, donut per platform/store) | `DataList.vue` | aggregates |

Filter query umum: `datePeriod` (`start,end`) dan/atau `storeIds[]` / chart `startDate`+`endDate`.

SO filter status: `Approved` | `Processed`; `deleted_at` null.

---

## 2. Kalkulasi (AS-IS)

### 2.1 Order totals — `getTotalOrderQuery()`

Aggregate per `sales_order_id` dari Sales Order Detail:

- `total_order_qty`
- `total_order_price` (SO)
- `total_invoice_price` (SI portion from prepared/processed to invoice qty × price)

### 2.2 COGS — `getTotalHppQuery()`

Join path:

`OutboundMutationDetail` → `SalesOrderDetail` (`transaction_reference_class = SalesOrderDetail`)  
→ `ItemStock`  
→ `StockMutationOutbound` where `code LIKE 'OT-%'` and not deleted  

`SUM(outbound_quantity_in_base_unit * each_price_before_vat)` grouped by `sales_order_id`.

### 2.3 Default select metrics — `getDefaultSelect()`

P/L = `SUM(invoice) − SUM(hpp)`; % with `∞` / `0%` edge cases (see requirement §1).

### 2.4 `dailyPerSo` select (AS-IS)

Columns include SO `code`, `transaction_date`, `store_name`, `platform_name` + metrics.  
`code_formatted` = link via `renderTransactionCode`.  
**No outbound code/date columns.**

---

## 3. FE OrderTable (AS-IS → TO-BE)

File: `components/OrderTable.vue`  
UI title: **"Daily Total P/L in Period per Store"** (naming quirk — rows are SO).

AS-IS columns: `code_formatted`, `store_name`, `platform_name`, qty, COGS, SO, SI, P/L, %.

**TO-BE ETM-17074:** add after SO identity columns (recommended after Platform / before qty):

| `data` (suggested) | UI title |
|--------------------|----------|
| `outbound_code_formatted` (or equiv.) | Trx. Code Outbound |
| `outbound_date_formatted` | Trx. Date Outbound |

Backend must extend `dailyPerSo` (join/subquery outbound headers for that SO, same OT-% + SOD ref rule as HPP). Multi-OT: see requirement §5.3 / GAP-SOPL-01.

---

## 4. Code globs

```
Modules/Accounting/Http/Controllers/SalesOrderProfitLossController.php
olshoperp-frontend/src/pages/Accounting/Report/SalesOrderProfitLoss/**/*
```

---

## 5. Related entities

| Entity | Role |
|--------|------|
| `SalesOrder` / `SalesOrderDetail` | Order grain & SI/SO amounts |
| `StockMutationOutbound` / `OutboundMutationDetail` | COGS + outbound identity (TO-BE) |
| `ItemStock` | `each_price_before_vat` for HPP |
| `Store` / `Platform` | Filter & display |

---

## 6. Notes for implementers (ETM-17074)

1. Reuse the same outbound eligibility as `getTotalHppQuery` (OT-%, SOD ref) so code/date tidak “asing” dari COGS.
2. Jangan ubah formula P/L hanya untuk menambah kolom.
3. Scope UI: **OrderTable / daily-per-so only** unless product expands later.
