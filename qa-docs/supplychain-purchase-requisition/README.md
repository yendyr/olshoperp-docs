# Purchase Requisition — QA Documentation

| Layer | File | Status |
|-------|------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | review |
| Feature Map | [feature-map.md](./feature-map.md) | draft |
| Requirement | [requirement.md](./requirement.md) | review |
| Technical | [technical.md](./technical.md) | review |
| User Guide | [user-guide.md](./user-guide.md) | review |
| Capability cards | [capabilities/](./capabilities/) | draft |

**Menu:** Purchase Requisition · **Route:** `/supplychain/purchase-requisition` · **Prefix:** `PR-`  
**Help Center overview:** [`_meta/docs-hub/menus/supplychain-purchase-requisition/`](../_meta/docs-hub/menus/supplychain-purchase-requisition/)  
**PM source:** `purchase_requisition_requirement.md` v1.0 (2026-07-04)  
**3 layer version:** 2.2 · **User-guide:** v1.1 · `source_version` 2.2 · **Feature Map:** 1.0 · **Last updated:** 2026-08-12  
**Maintenance owner:** QA — Yemima

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.2 | 2026-08-12 | **Select Multiple Products** modal (checkbox bulk add) · GAP-PR-01 |
| 1.0 | 2026-06-19 | Initial draft from codebase |
| 2.0 | 2026-07-05 | Full rewrite: PM merge, import/export/print/duplicate, UI buttons, gaps §13–§18 |
| 2.1 | 2026-07-05 | Codebase canonical (100 rows, ref 30, delete draft/open, qty int, single approval); §2.3 closure paths; import validation expanded |
| 2.1b | 2026-07-29 | Feature Map + 5 capability cards; user-guide v1.0 (review); Help Center overview en/id |

## Related menus

| Menu | Relasi |
|------|--------|
| [Purchase Order](../supplychain-purchase-order/) | Consumer PO With PR; qty tracking |
| [System Product](../system-product/) | Sumber SKU detail |

## Key notes (v2.2)

- PR selesai: **complete** (auto full PO qty) **atau** **closed** (manual) — keduanya tidak bisa ke PO baru
- Max **100** detail per PR; reference max **30**; delete **draft/open** only
- Qty manual **integer**; import qty ≥ 1 (int/double)
- Approval **single-level**
- Import: 5 kolom template; pre-validation all-or-nothing; duplicate SKU = baris baru (no merge)
- **Select Multiple Products (TO-BE):** text button + modal checkbox di edit Draft/Open/Rejected — qty 1; reject all if >100 · GAP-PR-01

- Close manual: datalist ✅ · form ClosedDialog kirim void → **DEV-PR-01**

## Route & code

- FE: `olshoperp-frontend/src/pages/SCM/PurchaseRequisition/`
- BE: `PurchaseRequisitionController.php`, `PurchaseRequisitionDetailController.php`, `PurchaseRequisitionImport.php`

> Test cases (non-canonical): [test-cases/](./test-cases/)
