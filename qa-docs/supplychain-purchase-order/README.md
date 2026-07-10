# Purchase Order — QA Documentation

| Layer | File | Status |
|-------|------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | review |
| Requirement | [requirement.md](./requirement.md) | review |
| Technical | [technical.md](./technical.md) | review |
| Test Cases | [test-cases/](./test-cases/) | in progress |

**Menu:** Purchase Order · **Route:** `supplychain/purchase-order` · **Prefix:** `PO-`  
**PM source:** `purchase_order_requirement.md` v1.0 (2026-07-05)  
**Maintenance owner:** QA — Yemima

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Initial draft from codebase auto-analysis |
| 2.0 | 2026-07-05 | Full rewrite: PM merge, import/export/print/pricing, UI buttons, gaps §19–§20 |
| 2.1 | 2026-07-05 | GAP clarifications; §21 Pending Items Major; import §12 expanded |
| 2.2 | 2026-07-10 | Cross-ref PI COA override; koreksi posisi jurnal Other Cost/Disc |

## Related menus

| Menu | Relasi |
|------|--------|
| [Purchase Requisition](../supplychain-purchase-requisition/) | Source detail With PR; qty tracking |
| [Purchase Inbound (GRN)](../supplychain-new-purchase-inbound/README.md) | GRN → processed/complete |
| [General Company](../generalsetting-general-company/) | Supplier master |
| [Other Cost](../omni-other-cost/) | Additional cost COA |
| [Purchase Invoice](../accounting-supplier-invoice/requirement.md) | Penjurnalan other cost/disc; dynamic allocation; **COA override** di PI (v2.1) |

## Key notes (v2.0)

- PO selesai: **complete** (auto full inbound) atau **closed** (manual dari processed)
- Max **500** detail per PO (`max_child_500`)
- Import: class **With PR only**; deteksi tipe dari kolom A baris 2; template files **missing** di public/files
- **P-PO-01 (Highest — Finance):** Void PO tidak revert qty PR
- **P-PO-02 (Major — End user):** Print PDF exclude Other Cost/Disc
- Closed dari **processed** = stop sisa inbound (bukan gap)
- Import §12: kolom A–H detail + template 404 (GAP-PO-05)
- Single-level approval; pricing via `PurchaseOrderDetailPrice`

## Route & code

- FE: `olshoperp-frontend/src/pages/SCM/PurchaseOrder/`
- BE: `PurchaseOrderController.php`, `PurchaseOrderDetailController.php`, `PurchaseOrderWithPrImport.php`
