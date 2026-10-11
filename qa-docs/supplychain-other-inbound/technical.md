---
doc_type: technical
menu: supplychain-other-inbound
menu_name: "Other Inbound"
version: 2.0
last_updated: 2026-10-11
owner: QA - Yemima
status: review
aliases: [other inbound API, OtherInboundController]
---

# Other Inbound — Technical Documentation

**API prefix:** `supplychain/other-inbound`  
**Behavior:** [requirement.md](./requirement.md) v2.0  
**Jira:** ETM-16440 · ETM-16441

---

## 1. File Map

| Layer | Path |
|-------|------|
| Controller | `Modules/SupplyChain/Http/Controllers/OtherInboundController.php` — index/show/export only |
| Shared index | `StockMutationInboundController::index(..., other: true)` → `whereNull(supplier_id)` |
| Generator | `Modules/SupplyChain/Jobs/WorkOrderApprovalJob.php` |
| Export | `OtherInboundExportJob`, `OtherInboundExportExcelJob` |
| FE | `olshoperp-frontend/src/pages/SCM/StockMutation/InventoryOther/` |

---

## 2. API

| Method | Path | Notes |
|--------|------|-------|
| GET | `other-inbound` | List other |
| GET | `other-inbound/{id}` | Show |
| GET | `other-inbound/export-file` / `export-excel` / `export-progress` | Export other-only |
| — | store/update/destroy/approve/print | **Tidak** di OtherInboundController; print TO-BE ETM-16441 |

Shared writes still reachable from FE leftovers: `mutation-inbound/*` (GAP-OI-01/03).

---

## 3. List filter

`other: true`: warehouse_origin null, type null, non-adjustment, non-return, **`supplier_id` null**.  
Purchase Inbound: `supplier_id` not null.

---

## 4. Invariants

| ID | Rule |
|----|------|
| INV-OI-01 | Export Other ⊆ supplier_id null |
| INV-OI-02 | PI ∩ Other = ∅ on supplier_id |
| INV-OI-03 | Intended: no mutate from this menu (enforce incomplete — ETM-16440) |

---

## 5. Assembly generate

`WorkOrderApprovalJob`: store inbound `other:true`, `supplier_id` null, ref WorkOrder, desc `Auto generated from Assembly {code}`, detail FG, approve system.

---

## 6. Gaps

| ID | Jira |
|----|------|
| GAP-OI-01 / 03 | ETM-16440 |
| GAP-OI-02 | ETM-16441 |

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Assembly technical | [../supplychain-assembly/technical.md](../supplychain-assembly/technical.md) |
