---
doc_type: technical
menu: accounting-customer-invoice
menu_name: "Sales Invoice"
version: 2.4
last_updated: 2026-11-09
owner: QA - Yemima
status: review
aliases: [SI technical, customer invoice API, sales invoice code]
---

# Sales Invoice — Technical Documentation

**API prefix:** `accounting/customer-invoice`  
**Module:** `Modules/Accounting`  
**Behavior SoT:** [requirement.md](./requirement.md) v2.4  
**Source SoT:** [../_meta/sot/accounting-customer-invoice-source-of-truth.md](../_meta/sot/accounting-customer-invoice-source-of-truth.md) v1.0

> **2.4 (2026-11-09):** Export All With/Without Details requires `export_filename` — [requirement §6.7](./requirement.md); ETM-16771. `CustomerInvoiceController::exportAllExcel` + `sanitizeExportFileName`. Chunks via `getExportStoragePath('exports/customer_invoice', export id, file)`. `ZipOrMoveExportJob` is constructed with `use_export_file_directory: true` (no timestamp suffix). History action from `export_type` via `getExportActionName`.

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Controller | `Modules/Accounting/Http/Controllers/CustomerInvoiceController.php` |
| Detail items | `Modules/Accounting/Http/Controllers/CustomerInvoiceDetailItemController.php` |
| Entity header | `Modules/Accounting/Entities/CustomerInvoice.php` |
| Detail / tax / other | `CustomerInvoiceDetailItem`, taxes, other cost/discount entities |
| Journal | `app/Helpers/Accounting/JournalProcess.php` → `customerInvoiceAutoJournal` |
| Import | `Modules/Accounting/Imports/CustomerInvoiceImport.php` · `Jobs/CustomerInvoiceImportJob.php` |
| Export All | `Modules/Accounting/Http/Controllers/CustomerInvoiceController.php` `exportAllExcel` — `sanitizeExportFileName($request->export_filename)`; empty → `File name is required.` |
| Export job | `Modules/Accounting/Jobs/CustomerInvoiceExportJob.php` — part file `{file_name} {from} - {to}.xlsx` at `getExportStoragePath('exports/customer_invoice', export id, file)`; chunk 5000; chain `ZipOrMoveExportJob` (`use_export_file_directory: true`) |
| Export row / action | `Modules/Accounting/Entities/CustomerInvoiceExportFile.php` (`file_name`, `export_type`); `getExportActionName` in `app/Helpers/MainHelper.php` |
| Nama file | `app/Helpers/MainHelper.php` `sanitizeExportFileName`, `getExportStoragePath` |
| Policy | `CustomerInvoicePolicy` |
| Routes | `Modules/Accounting/Routes/api.php` — `customer-invoice*` · outstanding detail routes |

### Frontend

| Layer | Path |
|-------|------|
| Pages | `olshoperp-frontend/src/pages/Accounting/AccountReceivable/CustomerInvoice/**` |
| Pinia | `src/stores/project/SalesInvoices/` |
| Route UI | `/accounting/customer-invoice` |

---

## 2. API (utama)

| Method | Path | Action |
|--------|------|--------|
| CRUD | `accounting/customer-invoice` | Index/store/show/update/destroy |
| POST | `…/{id}/approve` | Approve / reject |
| GET/POST | detail / outstanding / group Use | Lines dari SO |
| POST | import upload + progress/log | Import saldo awal |
| GET | `…/export-excel` | Export All With/Without Details. Query `export_filename` wajib. Kosong setelah `sanitizeExportFileName` → `File name is required.` **Export Active Page Only** tidak lewat gerbang ini |
| GET | `…/export-file` | Riwayat Export File. Kolom aksi `action_name_formatted` dari `getExportActionName(file_name, export_type)` — `export_type` menang atas parse nama file |
| GET | print | PDF |

---

## 3. Data model (konsep)

| Table / area | Notes |
|--------------|-------|
| `accounting_customer_invoices` | Header; prefix **SI**; status draft/open/approved/rejected (+ badge void/closed/…) |
| Detail items | FK `sales_order_detail_id`; qty = remaining on Use |
| SO detail counters | `prepared_to_invoice_quantity` / `processed_to_invoice_quantity` |
| AR COA | `store_id` → Store AR; else Company AR |
| Soft delete | Show deleted di datalist |
| `accounting_customer_invoice_export_files` | `file_name` (hasil `sanitizeExportFileName`, maks. 150), `export_type` (`with_details` / `without_details`). Kolom `export_type` ditambah di migration create `Modules/Accounting/Database/Migrations/2025_01_14_133245_create_customer_invoice_export_files_table.php` |

---

## 4. Approve flow

```mermaid
sequenceDiagram
    participant FE
    participant CTL as CustomerInvoiceController
    participant SO as SalesOrderDetail
    participant JP as JournalProcess

    FE->>CTL: POST approve
    CTL->>CTL: fiscal, detail>=1, COA, qty prepared
    alt reject platform
        CTL-->>FE: cannot reject platform
    else approve
        CTL->>SO: prepared↓ processed↑
        CTL->>JP: customerInvoiceAutoJournal autoApprove=true
        CTL-->>FE: approved + journal approved
    end
```

**Import path:** job creates SI **open**; intent journal **not** final to GL until SI Approve. Residual: job may still call `customerInvoiceAutoJournal($si, false, 'Opening Balance')` — see GAP-SI-02.

---

## 5. Invariants

| ID | Invariant |
|----|-----------|
| INV-SI-01 | 1 Use from outstanding SO line = **full remaining** invoicable qty |
| INV-SI-02 | Platform SI: no reject / no delete |
| INV-SI-03 | Approve: bump processed qty + post journal (auto-approved on normal approve) |
| INV-SI-04 | AR COA from store if `store_id`, else customer company |
| INV-SI-05 | Manual create only General customer + General SO outstanding |
| INV-SI-06 | Import: General SO only; result status **open**; all-or-nothing rows |
| INV-SI-07 | Header customer/currency/dates locked after detail exists |
| INV-SI-08 | Primary currency → exchange rate must be 1 |
| INV-SI-09 | Other cost/discount outside product VAT base |
| INV-SI-10 | Void × SI lifecycle details deferred outside this doc if not in SoT |
| INV-SI-11 | Draft/Open, non-platform release on delete: `CustomerInvoiceDetailItemController::deleteCustomerInvoiceDetailItemRow` and `CustomerInvoiceController::deleteCustomerInvoice` include the header SO ref in the release ids; `prepared_to_invoice_quantity` drops by the row qty and is floored at 0; SO `transaction_status` becomes `approved` when no other detail still references that SO; `transaction_reference_id/class/text/url` are nulled (row delete: only if no detail remains for the header ref; header delete: nulled before the SI is destroyed) |
| INV-SI-12 | Export All With/Without Details stores a non-empty `sanitizeExportFileName(export_filename)` (max 150) on `accounting_customer_invoice_export_files.file_name`, and `getExportActionName` prefers `export_type` (`with_details` / `without_details`) over the file name. Each export is stored under a folder keyed by export id (`getExportStoragePath`). `ZipOrMoveExportJob` `use_export_file_directory` true, so the final `.xlsx` or `.zip` has no timestamp suffix. One part → `exports/customer_invoice/excels/{id}/{file_name}.xlsx`; more than one part → `exports/customer_invoice/zips/{id}/{file_name}.zip` |

---

## 6. Journal mapping (approve)

| Side | COA | Amount |
|------|-----|--------|
| Dr | AR (company/store) | Net = credits − other discount |
| Cr | Sales (product COA group) | Before VAT local |
| Cr | Tax sales COA | VAT |
| Cr | Other cost COA | Other cost |
| Dr | Other discount COA | Other discount |

---

## 7. Failure modes

| Mode | Expected |
|------|----------|
| Fiscal closed | Block store/update date/approve |
| Missing AR / Sales / Tax COA | Approve error with configure message |
| Insufficient prepared qty | Cannot approve — SKU message |
| Platform reject/delete | Hard block message |
| Import 1 bad row | Entire import failed + log |
| Update after approved | Blocked |
| Change customer/currency/date with details | Blocked until details cleared |
| Export filename empty after sanitize | `File name is required.`; no export row and no file |

---

## 8. Import rules (code-facing)

| Rule | Behavior |
|------|----------|
| Template | Transaction Date · Order Number · Platform Order ID |
| XOR keys | Exactly one of Order Number / Platform Order ID |
| SO type | General only |
| Status out | **open** |
| Journal | Intent: on SI approve; verify GAP-SI-02 residual Open journal call |
| Already invoiced | `CustomerInvoiceImportSheet1` (`Modules/Accounting/Import/CustomerInvoiceImportSheet1.php`) `is_invoiced` requires `whereHas('customer_invoice_detail_items')` — a non-void SI with no detail rows does not block import |

---

## 9. Frontend behaviors

| Behavior | Note |
|----------|------|
| Auto-save create | Last saved customer/currency/rate |
| Status radio | Draft/Open; rejected → FE forces draft on edit save |
| Qty with-SO | Disabled — full remaining on Use |
| Platform form | Customer/store show-only; no reject/delete |
| Column Instant Settlement | Default hidden |
| Export File Name dialog | **Export Without Details** / **Export With Details**. Suggestion `Sales Invoice - {With Details Export\|Without Details Export} {dd-mm-yyyy_HH.MM.SS}`, max 150, placeholder **Enter file name**. Sends `export_filename`. **Export Active Page Only** skips the dialog |

---

## 10. Tests & QA notes

1. Create → draft (AS-IS) → Open → Approve → journal approved + SO processed↑  
2. Use one of two SKUs → partial SO; qty not partially editable  
3. Approve missing COA / no detail → error  
4. Platform SI reject/delete blocked  
5. Import General → open; Approve → journal  
6. Import platform → rejected  
7. GAP-SI-01: document TO-BE Open on create vs AS-IS draft  
8. Export All: empty `export_filename` → `File name is required.` Same title twice → two export ids, two folders, two downloads. Action label follows `export_type`, not the typed name (ETM-16771, INV-SI-12)  

---

## 11. Known gaps

| ID | Issue |
|----|-------|
| GAP-SI-01 | Create default Open (TO-BE) vs draft (AS-IS) |
| GAP-SI-02 | Import journal call residual vs “no journal until Approve” |
| GAP-SI-03 | FE xlsx vs BE csv/xls |
| GAP-SI-05 | Currency error text may say “purchase order” |

Full registry: [requirement §9](./requirement.md).

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Account Receive | [../accounting-customer-payment/technical.md](../accounting-customer-payment/technical.md) |
| Credit Note | [../accounting-credit-note/technical.md](../accounting-credit-note/technical.md) |
| Journal helper | `app/Helpers/Accounting/JournalProcess.php` |

