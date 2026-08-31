---
doc_type: feature-map
menu: accounting-customer-invoice
menu_name: "Sales Invoice"
version: 1.0
last_updated: 2026-08-31
owner: QA - Yemima
status: review
aliases: [SI feature map, sales invoice features, customer invoice features]
---

# Sales Invoice — Feature Map

Indeks sub-feature / capability di menu **Sales Invoice**.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus Sales Invoice — card di `capabilities/` |
| **stub / detailed / missing** | Kedalaman dokumen card |

Proposal: [`_meta/proposals/feature-map-and-capability-lingo.md`](../_meta/proposals/feature-map-and-capability-lingo.md).  
Mirror AP: [Purchase Invoice Feature Map](../accounting-supplier-invoice/feature-map.md).

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | hybrid | AS-IS | stub | shared · export-with-without-detail | — | slice |
| SF-DL-06 | Action rules | menu | AS-IS | stub | requirement · Datalist actions | Ya | overview |
| SF-HDR-01 | Create / auto-save last trx | menu | AS-IS | stub | KB · Create draft → Open | Ya | tips |
| SF-SI-01 | [How SI is created](#sf-lingo:SF-SI-01) | menu | AS-IS | detailed | capabilities · sf-si-01 | Ya | overview |
| SF-DET-01 | [Outstanding SO Use](#sf-lingo:SF-DET-01) | menu | AS-IS | detailed | capabilities · sf-det-01 | Ya | overview |
| SF-SI-02 | [Other Cost / Other Discount](#sf-lingo:SF-SI-02) | menu | AS-IS | detailed | capabilities · sf-si-02 | Ya | overview |
| SF-SI-03 | [Net Sales](#sf-lingo:SF-SI-03) | menu | AS-IS | detailed | capabilities · sf-si-03 | Ya | tips |
| SF-SI-04 | [Platform SI limits](#sf-lingo:SF-SI-04) | menu | AS-IS | detailed | capabilities · sf-si-04 | Ya | tips |
| SF-IMP-01 | [Import saldo awal](#sf-lingo:SF-IMP-01) | menu | AS-IS | detailed | capabilities · sf-imp-01 | Ya | overview |
| SF-SI-05 | Reject → Save = Draft | menu | AS-IS | stub | KB/UG · Reject lalu Save | Ya | tips |
| SF-PRT-01 | Print | menu | AS-IS | stub | requirement · Print semua status | Ya | slice |
| SF-ATT-01 | Attachment | menu | AS-IS | stub | requirement · Attachment opsional | — | — |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |

**Siap Lingo (ada card):** How SI is created, Outstanding SO Use, Other Cost/Discount, Net Sales, Platform SI limits, Import saldo awal.  
**Backlog card:** Reject→Draft depth, Print/Attachment depth.
