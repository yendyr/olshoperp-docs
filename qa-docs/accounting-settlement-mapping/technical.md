---
doc_type: technical
menu: accounting-settlement-mapping
menu_name: "Settlement Mapping"
version: 2.0
last_updated: 2026-10-09
owner: QA - Yemima
status: review
aliases: [settlement mapping API, accounting_settlement_mappings, ImportSettlementJob mapping]
---

# Settlement Mapping — Technical Documentation

**API prefix:** `accounting/settlement-mapping`  
**Module:** `Modules/Accounting`  
**Behavior SoT:** [requirement.md](./requirement.md) v2.0  
**Consumer:** Instant Settlement (`SettlementSheet`, `ImportSettlementJob`)

---

## 1. File Map

### Backend

| Layer | Path |
|-------|------|
| Routes | `Modules/Accounting/Routes/api.php` — prefix `settlement-mapping` |
| Controller | `Modules/Accounting/Http/Controllers/SettlementMappingController.php` |
| Model | `Modules/Accounting/Entities/SettlementMapping.php` → `accounting_settlement_mappings` |
| Import log | `Modules/Accounting/Entities/SettlementMappingImportLog.php` |
| Import job / class | `SettlementMappingImport` (plus/minus, platform, COA rules) |
| Policy | `SettlementMappingPolicy` |
| Parse settlement | `SettlementSheet` — `mapped_headers` keyBy `excel_column_name` |
| Apply amounts | `ImportSettlementJob` — skip `amount == 0`; positive/negative × sign |

### Frontend

| Layer | Path |
|-------|------|
| Route | `/accounting/settlement-mapping` |
| Pages | `olshoperp-frontend/src/pages/Accounting/Settlement/Mapping/DataList.vue` |
| | `PlatformTable.vue`, `MappingTable.vue` |
| Value Type UI | `TypeSelect` — labels Plus / Minus; values `positive` / `negative` |
| COA | `CoaSelect` (create/inline; tanpa fromClass ketat seperti import) |

---

## 2. API Routes

| Method | Path | Action |
|--------|------|--------|
| GET | `accounting/settlement-mapping` | Index / datatable |
| POST | `accounting/settlement-mapping` | Store |
| PUT | `accounting/settlement-mapping/{id}/inline` | Inline update |
| DELETE | `accounting/settlement-mapping/{id}` | Soft delete |
| GET | `…/export-excel` | Export |
| GET | `…/download-template` | Template import |
| POST | `…/upload` | Import Excel |
| GET | `…/progress` | Import progress |
| GET | `…/import-log` | Import log |
| GET | `…/cek-import-log` | Cek status log |
| GET | `…/audit` | Audit datatable |

---

## 3. Database

**Table:** `accounting_settlement_mappings` (SoftDeletes via MainModel)

| Column | Notes |
|--------|-------|
| `label` | Internal Label |
| `excel_column_name` | Source Column — unique with `platform_id` (+ company scope) |
| `type` | `positive` \| `negative` |
| `coa_id` | FK COA |
| `platform_id` | FK platform |
| `owned_by` | Company owner |
| `is_all_company` | AS-IS always `0` (private) |
| `deleted_at` | Soft delete |

---

## 4. Invariants

| ID | Rule |
|----|------|
| INV-SM-01 | Unique `(excel_column_name, platform_id)` within company (`owned_by`) |
| INV-SM-02 | `is_all_company = 0` |
| INV-SM-03 | Instant Settlement loads mappings where `platform_id` = upload platform **and** `owned_by` = `store.data_owner_id` |
| INV-SM-04 | Soft-deleted rows excluded from Instant Settlement header map |
| INV-SM-05 | Fee column match uses trimmed original cell vs `excel_column_name` — **case-sensitive**; important columns (order id, date, total, type) are separate constants, case-insensitive |

---

## 5. Instant Settlement integration

1. Build `mapped_headers` = collection of SettlementMapping for platform + store data owner, keyed by `excel_column_name`.
2. For each Excel header cell: trim; if important column → special path; else if `$mapped_headers->has($original_cell)` → treat as mapped fee column.
3. For mapped amount: if `amount == 0` → `continue`.
4. Sign logic:
   - `type === positive` && amount ≥ 0 → Other Cost  
   - `type === positive` && amount &lt; 0 → Other Discount  
   - `type === negative` && amount ≥ 0 → Other Discount  
   - `type === negative` && amount &lt; 0 → Other Cost  
5. Persist abs(amount), description = `label`, COA = mapping `coa_id` onto SI other cost/discount lines.

**General / Other platform:** not driven by this accordion; uses `OC:` / `OD:` other cost/discount masters.

---

## 6. Validation & failure modes

| Area | Behavior |
|------|----------|
| Store | Missing fields → `… is missing`; duplicate → `Unable to create duplicate {column} for {platform}`; bad COA/platform → unable to find |
| Inline | Empty value → `The inputted value cannot be empty` |
| Import | Value Type plus/minus only; platform shopee/tiktok/lazada; COA active, child, allowed classes (Expense, Other Revenue & Expenses, COGS, Revenue), company ownership; concurrent import blocked |
| UI vs import COA | See [GAP-SM-01](./requirement.md#9-gaps--keputusan) — UI store softer than import |

---

## 7. Audit & data lifecycle

- Audit trail on create/update/delete (label, source column, value type, COA, platform, owner).
- Soft delete does **not** rewrite historical SI lines; lines already store COA + description at Instant Settlement generate time.
- Changing mapping affects **subsequent** Instant Settlement uploads only.

---

## 8. Gaps (tech refs)

| ID | Note |
|----|------|
| GAP-SM-01 | Create/inline: `ChartOfAccount::where('id')->exists()` (+ model company scope). Import: child + class allow-list + active |
| GAP-SM-03 | FE tippy may still say Addition/Deduction while select shows Plus/Minus |

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Instant Settlement technical | [../accounting-settlement-upload/technical.md](../accounting-settlement-upload/technical.md) |
