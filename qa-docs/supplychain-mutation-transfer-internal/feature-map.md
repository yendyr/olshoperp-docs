---
doc_type: feature-map
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
version: 1.0
last_updated: 2026-09-01
owner: QA - Yemima
status: review
aliases: [TFI feature map, transfer internal features, colli v2 TF]
---

# Transfer Internal — Feature Map

Indeks sub-feature / capability menu **Transfer Internal** (legacy + **BETA Colli v2**).  
**Klik Label UI** di kolom kedua untuk modal Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — `_meta/shared-capabilities/` |
| **menu** | Khusus TFI — card di `capabilities/` |
| **stub / detailed / missing** | Kedalaman card |
| **N/A** | Tidak ada di menu ini |

Legacy: `/supplychain/mutation-transfer-internal` · BETA Colli: `/supplychain/new-mutation-transfer-internal` (API sama).

| ID | Label UI | Jenis | Status | Depth | Card | KB | UG |
|----|----------|-------|--------|-------|------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | shared | AS-IS | stub | shared · export-with-without-detail | — | slice |
| SF-DL-06 | Bulk Delete / Bulk Approve | menu | AS-IS | missing | requirement §4 A-TFI-07 — belum card | — | pending |
| SF-DL-07 | [Show Virtual WH](#sf-lingo:SF-TFI-04) | menu | AS-IS | detailed | capabilities · sf-tfi-04 | Ya | tips |
| SF-HDR-01 | Create header (Origin / Location Destination) | menu | AS-IS | stub | KB §4 / requirement §5 | Ya | overview |
| SF-DET-01 | [Select Product / Available Product / Import](#sf-lingo:SF-DET-01) | menu | AS-IS | detailed | capabilities · sf-det-01 | Ya | overview |
| SF-TFI-01 | [Fulfill-after-FIFO](#sf-lingo:SF-TFI-01) | menu | AS-IS | detailed | capabilities · sf-tfi-01 | Ya | tips |
| SF-VIEW-01 | [Group View / Detail View](#sf-lingo:SF-VIEW-01) | menu | AS-IS | detailed | capabilities · sf-view-01 | Ya | slice |
| SF-TFI-02 | [Colli v2 (BETA)](#sf-lingo:SF-TFI-02) | menu | AS-IS | detailed | capabilities · sf-tfi-02 | Ya | overview |
| SF-TFI-03 | [Relocate whole colli](#sf-lingo:SF-TFI-03) | menu | AS-IS | detailed | capabilities · sf-tfi-03 | Ya | overview |
| SF-IMP-01 | [Import Excel detail](#sf-lingo:SF-IMP-01) | menu | hybrid | detailed | capabilities · sf-imp-01 | Ya | slice |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-PRT-01 | Print | menu | AS-IS | missing | technical — print route | — | pending |
| SF-Void | Void | — | N/A | — | TFI manual tidak punya Void | — | — |

**Siap Lingo:** SF-DET-01, SF-TFI-01..04, SF-VIEW-01, SF-IMP-01 + shared datalist/export/log.  
**Backlog:** Bulk datalist card, Print, Help Center overview.
