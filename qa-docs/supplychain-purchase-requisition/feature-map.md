---
doc_type: feature-map
menu: supplychain-purchase-requisition
menu_name: "Purchase Requisition"
version: 1.0
last_updated: 2026-07-29
owner: QA - Yemima
status: draft
aliases: [PR feature map, purchase requisition features, sub feature PR]
---

# Purchase Requisition — Feature Map

Indeks sub-feature / capability di menu ini.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus PR — card di `capabilities/` bila ada |
| **stub / detailed / missing** | Kedalaman dokumen card |

Downstream: [Purchase Order](../supplychain-purchase-order/). Proposal: [`_meta/proposals/feature-map-and-capability-lingo.md`](../_meta/proposals/feature-map-and-capability-lingo.md).

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter · Product hidden | Ya | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | hybrid | AS-IS | stub | shared · export · This Page Only | Ya | slice |
| SF-DL-07 | Bulk Approve / Bulk Delete | menu | AS-IS | missing | FE DataList — belum card | Ya | pending |
| SF-HDR-01 | Create / Save / header lock | menu | AS-IS | stub | KB · Basic Information | Ya | overview |
| SF-DET-01 | [Add / edit detail SKU](#sf-lingo:SF-DET-01) | menu | AS-IS | detailed | capabilities · sf-det-01 | Ya | overview |
| SF-IMP-01 | [Import Detail](#sf-lingo:SF-IMP-01) | menu | AS-IS | detailed | capabilities · sf-imp-01 | Ya | overview |
| SF-PR-01 | [Complete vs Closed](#sf-lingo:SF-PR-01) | menu | AS-IS | detailed | capabilities · sf-pr-01 | Ya | overview |
| SF-PR-02 | [Void vs Delete](#sf-lingo:SF-PR-02) | menu | AS-IS | detailed | capabilities · sf-pr-02 | Ya | tips |
| SF-PR-03 | [Process to Purchase Order](#sf-lingo:SF-PR-03) | menu | AS-IS | detailed | capabilities · sf-pr-03 | Ya | overview |
| SF-PR-04 | Duplicate | menu | AS-IS | stub | KB · Duplicate → Draft baru | Ya | slice |
| SF-PRT-01 | Print PR | menu | AS-IS | stub | KB · Print PDF | Ya | slice |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-ATT-01 | Attachment | menu | AS-IS | missing | Belum card | — | pending |

**Siap Lingo (ada card):** shared datalist/export/log + Add detail, Import, Complete vs Closed, Void vs Delete, Process to PO.  
**Backlog:** Bulk actions, Duplicate/Print depth, Attachment.
