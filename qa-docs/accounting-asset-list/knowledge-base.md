---
doc_type: knowledge-base
menu: accounting-asset-list
menu_name: "Asset List"
version: 1.1
last_updated: 2026-07-24
owner: QA - Cursor
status: draft
audience: operator
---

# Asset List — Knowledge Base

## Ringkasan

**Asset List** (FA → Asset) menampilkan stock item yang ditandai **fixed asset** (`is_fix_asset`), berbasis komponen Stock Monitoring. Bukan master CRUD — tidak ada Create/Edit form kategori.

**Route:** `/accounting/asset-list` · Detail: `/accounting/asset-list/{item_stock_id}`  
**API:** `/accounting/asset-list` (+ export-file / export-progress / export-excel)

## Fitur UI

### Datalist (`StockMonitoringTable`, `is_asset=true`, `with_price_column=true`)
- Gate: pilih **Warehouse** + **Apply** (sama pola Stock Monitoring)
- Tidak ada tombol Create
- Kolom ekstra: **Asset Code / Trx. Date** (link → detail asset-list)
- Kolom harga: Unit Price, Price in Primary Unit
- Kolom qty: Inbound, Transfer, Used, Availability, On Hand, Unit, …
- **Latest Calculation**
- Search / advanced filter
- Klik **Availability** → modal breakdown
- **Export** (All / Active Page) via ExportFileTable

### Detail (read-only)
- Basic Information
- Product Trx History (+ filter Choose Status)
- Certificate
- Product Interchange

## Status dokumentasi

- Knowledge Base: **draft** (dari FE/BE)
- Test cases: lihat `test-cases/`
