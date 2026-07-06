# Purchase Requisition — QA Documentation

| Layer | File | Status |
|-------|------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | review |
| Requirement | [requirement.md](./requirement.md) | review |
| Technical | [technical.md](./technical.md) | review |

**Menu:** Purchase Requisition · **Route:** `supplychain/purchase-requisition` · **Prefix:** `PR-`  
**PM source:** `purchase_requisition_requirement.md` v1.0 (2026-07-04)  
**Maintenance owner:** QA — Yemima

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Initial draft from codebase |
| 2.0 | 2026-07-05 | Full rewrite: PM merge, import/export/print/duplicate, UI buttons, gaps §13–§18 |
| 2.1 | 2026-07-05 | Codebase canonical (100 rows, ref 30, delete draft/open, qty int, single approval); §2.3 closure paths; import validation expanded |

## Related menus

| Menu | Relasi |
|------|--------|
| [Purchase Order](../supplychain-purchase-order/) | Consumer PO With PR; qty tracking |
| [System Product](../system-product/) | Sumber SKU detail |

## Key notes (v2.1)

- PR selesai: **complete** (auto full PO qty) **atau** **closed** (manual) — keduanya tidak bisa ke PO baru
- Max **100** detail per PR; reference max **30**; delete **draft/open** only
- Qty manual **integer**; import qty ≥ 1 (int/double)
- Approval **single-level** (`gate_menus.approval = 1`)
- Import: 5 kolom template; pre-validation all-or-nothing; duplicate SKU = baris baru (no merge)
- Close manual: datalist ✅ · form ClosedDialog kirim void → **DEV-PR-01**

## Route & code

- FE: `olshoperp-frontend/src/pages/SCM/PurchaseRequisition/`
- BE: `PurchaseRequisitionController.php`, `PurchaseRequisitionDetailController.php`, `PurchaseRequisitionImport.php`
