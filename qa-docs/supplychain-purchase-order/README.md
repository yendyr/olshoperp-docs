# Purchase Order — Dokumentasi QA

Menu **Purchase Order** (Supply Chain / Procurement).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal (Notion/Lark) | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo-style SF Entry | draft |

**UI route:** `/supplychain/purchase-order`  
**Help Center overview:** [`_meta/docs-hub/menus/supplychain-purchase-order/`](../_meta/docs-hub/menus/supplychain-purchase-order/) (`overview.en.md` / `overview.id.md`)  
**SoT / PM source:** `purchase_order_requirement.md` v1.0 (2026-07-05); Import VAT locked 5 Agu 2026  
**Rounding SoT:** [../_meta/dpp-vat-rounding-calculation.md](../_meta/dpp-vat-rounding-calculation.md) (**27 Jul 2026** final)  
**3 layer version:** 3.0 · **User-guide:** v1.8 · `source_version` 3.0 · **Feature Map:** 1.0 · **Last updated:** 2026-09-02 16:30

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | 2026-09-02 16:30 | Supplier on screen and export shows **code only** (search still finds by name; print PDF may still show name). Why: privacy / display policy for all roles — no supplier name on UI or Excel. |
| 2.9 | 2026-08-12 10:35 | Clearer product pickers: Without PR uses Select Multiple Products; With PR uses Select Outstanding PR Products — Available Products stays for one-by-one. Why: operators mixed the two flows when adding PO lines. |
| 1.0 | 2026-06-19 | Initial draft from codebase auto-analysis |
| 2.0 | 2026-07-05 | Full rewrite: PM merge, import/export/print/pricing, UI buttons, gaps |
| 2.1 | 2026-07-05 | GAP clarifications; Pending Items Major; import expanded |
| 2.2 | 2026-07-10 | Cross-ref PI COA override; koreksi posisi jurnal Other Cost/Disc |
| 2.3 | 2026-07-17 | Compliance qa-docs-standard (5-file); trim requirement; technical invariants/failure modes; tambah user-guide v1.0 |
| 2.4 | 2026-07-22 | DPP/VAT: detail ↔ Totals konsisten (truncate 4dp × qty, ETM-15313); GAP-PO-08 sort residual; UG v1.1 |
| 2.5 | 2026-07-23 | Rounding SoT: variable DPP/VAT, tie ±1 sen, rantai jurnal Inbound→PI; GAP-PO-09; UG v1.2 |
| 2.6 | 2026-07-27 | Rounding SoT **final**: UI-only +0,01 known behavior; Total/Journal exact; export 4dp TO-BE (GAP-PO-10); UG v1.3 |
| 2.7 | 2026-07-27 | Contoh Case 4/5 (38.000×25) di KB + UG; Lingo shared SF-PRICE-01 |
| 2.7b | 2026-07-28 | Feature Map + 6 capability cards; UG v1.5 (SF tags, status review); Help Center overview en/id |
| HC 1.1 | 2026-07-29 | Help Center overview PO diperluas (ramah end-user): tipe With/Without PR, import Excel, field reference, gaps, troubleshooting, FAQ — en + id |
| HC 1.1a | 2026-07-30 | Help Center overview id/en — embed screenshot Lokasi Menu & Workspace (Drive hotlink) |
| 2.8 | 2026-08-05 | Import VAT columns TO-BE locked (I–K, partial success, Align Allocate Full); GAP-PO-11; SF-IMP-01 / SF-DET-01 v1.1; UG v1.6 |

## Related menus

| Menu | Link |
|------|------|
| Purchase Requisition | [../supplychain-purchase-requisition/](../supplychain-purchase-requisition/) — sumber detail With PR |
| Purchase Inbound | [../supplychain-new-purchase-inbound/](../supplychain-new-purchase-inbound/) — penerimaan barang |
| General Company | [../generalsetting-general-company/](../generalsetting-general-company/) — master supplier |
| Other Cost / Discount | [../omni-other-cost/](../omni-other-cost/) · [../omni-other-discount/](../omni-other-discount/) |
| Purchase Invoice | [../accounting-supplier-invoice/](../accounting-supplier-invoice/) — tagihan + Other Cost/Disc |

**Maintenance owner:** QA — Yemima

> Test cases (non-canonical): [test-cases/](./test-cases/)
