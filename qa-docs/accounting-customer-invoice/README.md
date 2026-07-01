# Sales Invoice — Dokumentasi

Menu **Sales Invoice** (Accounting) — faktur penjualan / piutang usaha (AR).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Route & code

- FE: `/accounting/customer-invoice` → `olshoperp-frontend/src/pages/Accounting/AccountReceivable/CustomerInvoice/`
- BE: `Modules/Accounting/Http/Controllers/CustomerInvoiceController.php`
- Tabel: `accounting_customer_invoices` — prefix kode **SI**

## Related menus

| Menu | Relasi |
|------|--------|
| Sales Order | Baris invoice dari `SalesOrderDetail` (outstanding SO) |
| Account Receive (Customer Payment) | Alokasi pembayaran ke invoice approved |
| Journal | Auto-generate saat approve |
| Instant Settlement | Invoice platform dari settlement upload |
