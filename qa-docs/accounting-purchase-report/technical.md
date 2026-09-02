---
doc_type: technical
menu: accounting-purchase-report
menu_name: "Purchase Report"
version: 2.1
last_updated: 2026-09-02
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Purchase Report — Technical Documentation

**Behavior SoT:** [requirement.md](./requirement.md) v2.1 (AS-IS + supplier code-only) · [_meta/sot/…](../_meta/sot/accounting-purchase-report-source-of-truth.md)  
**UI route:** `/accounting/purchase-report`  
**API prefix:** `accounting/purchase-report`  
**Supplier display:** parent [ETM-15721](https://erpintegration.atlassian.net/browse/ETM-15721) · child [ETM-15729](https://erpintegration.atlassian.net/browse/ETM-15729)

---

## 1. Architecture

```mermaid
flowchart LR
  FE[PurchaseReport/Datalist.vue] -->|tabs| PO[DataListByPo]
  FE --> PI[DataListByPi]
  PO -->|select_menu=purchase_order| API[PurchaseReportController]
  PI -->|select_menu=purchase_invoice| API
  API --> POD[PurchaseOrderDetail]
  API --> SID[SupplierInvoiceDetailItem]
  API --> EXP[Export job / ExportFile]
```

- Read-only; query on demand (no snapshot table).  
- **Must not** join PO↔PI for display.  
- Company scope: `owned_by` = token company.

---

## 2. File map

| Layer | Path |
|-------|------|
| FE shell | `olshoperp-frontend/src/pages/Accounting/Report/PurchaseReport/Datalist.vue` |
| FE PO | `…/DataListByPo.vue` |
| FE PI | `…/DataListByPi.vue` |
| BE | `Modules/Accounting/Http/Controllers/PurchaseReportController.php` |
| Export | `Modules/Accounting/Exports/PurchaseReportExport.php` |
| Job | `Modules/Accounting/Jobs/PurchaseReportExportJob.php` |
| Export file entity | `Modules/Accounting/Entities/PurchaseReportExportFile.php` |
| Policy | `Modules/Accounting/Policies/PurchaseReportPolicy.php` |
| Routes | `Modules/Accounting/Routes/api.php` |

---

## 3. API

| Method | Path | Notes |
|--------|------|-------|
| GET | `/accounting/purchase-report` | Datalist; **`select_menu`** = `purchase_order` \| `purchase_invoice` (default BE: `purchase_order`) |
| GET | `/accounting/purchase-report/export-excel` | Export All (batch) |
| GET | `/accounting/purchase-report/export-progress` | Progress; filter by `select_menu` |
| GET | `/accounting/purchase-report/export-file` | Datalist file export; filter by `select_menu` |

Date range untuk total supplier grouping: `resolveStartEndDate($request)` + SearchBuilder criteria dari FE.

---

## 4. Query notes

### Purchase Order (`purchaseOrderReportQuery`)

- From `PurchaseOrderDetail` join PO, product, supplier, currency, unit.  
- Soft-delete header/detail excluded.  
- No filter on PR type or `transaction_status` → With/Without PR + all statuses.  
- Line amounts: `order_quantity * each_price_*` (before/after disc VAT fields).  
- No Other Cost/Disc tables.

### Purchase Invoice (`purchaseInvoiceReportQuery`)

- From `SupplierInvoiceDetailItem` join SI (aliased fields reuse `purchase_order_id` for SI id in link).  
- Parallel soft-delete + company rules.  
- Qty aliased as `order_quantity` from `invoice_quantity`.

### Group total (`supplier_formatted_grouping`)

- Per supplier: sum filtered lines (`price_after_disc_vat` else `price_before_disc_vat`) within date window.  
- Rendered in group header HTML.  
- **ETM-15729:** header label = **Supplier Code** (+ total) saat `SUPPLIER_DISPLAY_MODE=code_only`; group/sort key konsisten ke `supplier_code`. Rollback `code_and_name` mengembalikan label legacy (name).

### Supplier display mode (ETM-15721 / ETM-15729)

| Item | Rule |
|------|------|
| Flag | `SUPPLIER_DISPLAY_MODE=code_only` (rollback: `code_and_name`) |
| Helpers | Shared FE helpers dari foundation — jangan hardcode hide name |
| ColVis / datalist (both tabs) | Code only; no Supplier Name option |
| Group header | **Code** + total |
| Export | Omit name |
| Search/filter | Match name+code; display code |
| Print | Keep name (jika ada) |

### Hyperlink (`code_formatted`)

- PO → `/supplychain/purchase-order/edit/{id}`  
- PI → `/accounting/supplier-invoice/edit/{id}`

---

## 5. FE shell notes

- Tabs HeadlessUI — PO panel vs PI panel are **separate** DataTablesV3 instances.  
- Default date filter (if no saved SearchBuilder): `dayjs` **startOf('month') … endOf('month')** — **GAP-PURREP-01** vs card “30 days”.  
- `additionalData` / export params carry `select_menu`.

---

## 6. Invariants

| ID | Invariant |
|----|-----------|
| INV-01 | Never return mixed PO+PI rows in one response |
| INV-02 | No FK traversal PO↔PI for report columns |
| INV-03 | Currency not auto-converted |
| INV-04 | Soft-deleted excluded |
| INV-05 | Export progress/files scoped by `select_menu` label |
| INV-06 | Group header / supplier column respect `SUPPLIER_DISPLAY_MODE` (code_only → code label) |

---

## 7. Testing notes

- Switch tab → assert only PO- or PI-prefixed codes.  
- PO With + Without PR both appear.  
- Draft/Approved/etc. status appear when in date range.  
- Export All from PO tab does not list under PI export-file query.  
- Regression: group header total vs sum of visible line amounts for one supplier.  
- ETM-15729: group header shows **code** (not name); ColVis has no Supplier Name; export omits name.

---

## 8. Related

- [requirement.md](./requirement.md) · [knowledge-base.md](./knowledge-base.md)  
- Jira: ETM-15673 · ETM-15674 · ETM-15729 · ETM-15721  
