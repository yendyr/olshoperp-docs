# Purchase Invoice — Dokumentasi

Menu **Purchase Invoice** (Accounting) — faktur pembelian / hutang usaha (AP).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Route & code

- FE: `/accounting/supplier-invoice` → `olshoperp-frontend/src/pages/Accounting/AccountPayable/SupplierInvoice/`
- BE: `Modules/Accounting/Http/Controllers/SupplierInvoiceController.php`
- Tabel: `accounting_supplier_invoices` — prefix kode **PI**

## Related menus

| Menu | Relasi |
|------|--------|
| Purchase Inbound | Baris invoice dari `InboundMutationDetail` |
| Purchase Order | Referensi PO pada detail; other cost/discount dari PO |
| Account Payment (Supplier Payment) | Alokasi pembayaran ke invoice approved |
| Journal | Auto-generate saat approve |
