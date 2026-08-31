---
doc_type: feature-map
menu: accounting-opening-stock
menu_name: "Opening Stock"
version: 1.0
last_updated: 2026-08-31
owner: QA - Yemima
status: review
aliases: [OS feature map, opening stock features, saldo awal features]
---

# Opening Stock — Feature Map

Indeks sub-feature / capability di menu **Opening Stock**.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus Opening Stock — card di `capabilities/` |
| **stub / detailed / missing** | Kedalaman dokumen card |

Proposal: [`_meta/proposals/feature-map-and-capability-lingo.md`](../_meta/proposals/feature-map-and-capability-lingo.md).

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | hybrid | AS-IS | stub | shared · export-with-without-detail | — | slice |
| SF-DL-06 | Action / bulk approve-delete | menu | AS-IS | stub | requirement · Datalist toolbar | Ya | overview |
| SF-HDR-01 | Create header (Date + Description) | menu | AS-IS | stub | KB · Alur kerja | Ya | overview |
| SF-OS-01 | [Opening Balance COA](#sf-lingo:SF-OS-01) | menu | AS-IS | detailed | capabilities · sf-os-01 | Ya | overview |
| SF-OS-02 | [Expected Stock & Adjustment](#sf-lingo:SF-OS-02) | menu | AS-IS | detailed | capabilities · sf-os-02 | Ya | overview |
| SF-OS-03 | [Generated Trx](#sf-lingo:SF-OS-03) | menu | AS-IS | detailed | capabilities · sf-os-03 | Ya | overview |
| SF-OS-04 | [Item Stock Status](#sf-lingo:SF-OS-04) | menu | AS-IS | detailed | capabilities · sf-os-04 | Ya | tips |
| SF-OS-05 | [Beda dari Stock Opname](#sf-lingo:SF-OS-05) | menu | AS-IS | detailed | capabilities · sf-os-05 | Ya | tips |
| SF-IMP-01 | Import detail Excel | menu | AS-IS | stub | KB/requirement · Import skip max 500 | Ya | overview |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |

**Siap Lingo (ada card):** Opening Balance COA, Expected Stock & Adjustment, Generated Trx, Item Stock Status, Beda dari Stock Opname.  
**Backlog card:** Import depth, bulk actions depth.
