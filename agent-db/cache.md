# Agent DB cache — Menu → tabel

Aturan pakai & write-back: [`README.md`](README.md) (S0–S6). Kunci unik = **Menu + Table**.
Baris baru masuk ke section modulnya. Sudah ada & benar → jangan ditambah lagi.

Kolom: **Menu** | **Tebakan** | **Table** | **Catatan**

## Supply Chain

| Menu | Tebakan | Table | Catatan |
|------|---------|-------|---------|
| System Product | products / SKU | `scm_products` | ≠ `omni_products` |
| Purchase Order | PO / purchase_orders | `scm_purchase_orders` | status dokumen = `transaction_status` |
| Purchase Requisition | PR / purchase_requisitions | `scm_purchase_requisitions` | detail singular `scm_purchase_requisition_detail` |
| New Purchase Inbound | GRN / inbound / inbounds | `scm_stock_mutations` | filter inbound di bawah; **bukan** `type='in'` |
| Outbound | outbound | `scm_stock_mutations` | `code LIKE 'OT-%' AND is_inventory_adjustment = 0 AND is_return_process = 0` |
| Transfer Internal | TFI | `scm_stock_mutations` | `type = 'tf internal'` |
| Transfer External | TFE | `scm_stock_mutations` | `type = 'tf external'` |
| Stock Opname | opname / SP | `scm_stock_mutations` | header sama tabel mutasi; detail `scm_opname_details`; deduction/addition otomatis juga `scm_stock_mutations` (`transaction_reference_class` StockOpname). Bukan tabel `scm_stock_opnames` |
| Warehouse | warehouses | `scm_warehouses` | |
| Sales Return (Supply Chain) | sales return / SR | `scm_stock_mutations` | `is_return_process = 1`, `code LIKE 'SR-%'`. **Bukan** `omni_sales_returns` |
| (stok) | item stock / stok | `scm_item_stocks` | large — jangan `SELECT *` |

Filter New Purchase Inbound:

```sql
warehouse_origin IS NULL
AND supplier_id IS NOT NULL
AND type IS NULL
AND is_inventory_adjustment = 0
AND is_return_process = 0
```

## Omni Channel

| Menu | Tebakan | Table | Catatan |
|------|---------|-------|---------|
| Manage Platform Product | platform product | `omni_products` | ≠ System Product (`scm_products`) |
| Sales Order / All Sales Order | SO / sales_orders | `omni_sales_orders` | large; banyak kolom `*status*` → DESCRIBE wajib |
| Store Binding | stores / toko | `omni_stores` | |
| Waves Management | waves | `omni_waves` | |
| Sales Return (Omni) | platform return | `omni_sales_returns` | detail `omni_sales_return_details`; `code LIKE 'SRP-%'` |

## Accounting

| Menu | Tebakan | Table | Catatan |
|------|---------|-------|---------|
| Journal | journals / acc_journals / gl | `accounting_journals` | prefix `accounting_` bukan `acc_`; detail `accounting_journal_details` |
| Chart of Account | coa / acc_coa | `accounting_chart_of_accounts` | |
| Purchase Invoice | supplier invoice / PI | `accounting_supplier_invoices` | |
| Sales Invoice | customer invoice / SI | `accounting_customer_invoices` | |
| Benchmark COGS | product benchmark / b.cogs / benchmark_cogs | `accounting_product_benchmark_prices` | Snapshot di baris SO = `omni_sales_order_details.benchmark_cogs` (bukan update live dari master) |
| Customer Payment / Supplier Payment / Credit Note / Debit Note | payments / CN / DN | `accounting_payments` | `type`: `Payment from Customer` / `Payment to Supplier` / `Credit Note` / `Debit Note` — bukan tabel terpisah |
| Instant Settlement | settlement upload / ST | `accounting_settlement_uploads` | detail order `accounting_settlements`; generate AR = `accounting_payments` type Payment from Customer (`receive_id`) |
| Tax | taxes | `accounting_taxes` | |
| Sales Return (Accounting) | sales return / SR | `scm_stock_mutations` | `is_return_process = 1`, `code LIKE 'SR-%'`. **Bukan** `omni_sales_returns` |
| Purchase Return (Accounting) | purchase return | `scm_stock_mutations` | `is_return_process = 1 AND supplier_id IS NOT NULL AND customer_id IS NULL AND warehouse_destination IS NULL` |

## Gate / General Setting

| Menu | Tebakan | Table | Catatan |
|------|---------|-------|---------|
| User | users | `gate_users` | |
| Role | roles | `gate_roles` | |
| Company | companies | `gs_companies` | |
| Global Audit Log | audits / audit trail | `audits` | tanpa `company_id`; `auditable_type` = class Eloquent (`LIKE '%NamaModel%'`) |
