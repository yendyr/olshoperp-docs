---
doc_type: feature-map
menu: supplychain-mutation-transfer-external
menu_name: "Transfer External"
version: 1.0
last_updated: 2026-09-01
owner: QA - Yemima
status: review
aliases: [TF Ext feature map, transfer external features, dual approve]
---

# Transfer External — Feature Map

Indeks sub-feature / capability menu **Transfer External** (produksi **tanpa Colli** + catatan BETA).  
**Klik Label UI** di kolom kedua untuk modal Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — `_meta/shared-capabilities/` |
| **menu** | Khusus TF Ext — card di `capabilities/` |
| **stub / detailed / missing** | Kedalaman card |
| **N/A** | Tidak ada di menu ini |

Produksi: `/supplychain/mutation-transfer-external` · BETA Colli: `/supplychain/new-mutation-transfer-external` (experimental).  
Pasangan penerimaan: [Transfer Inbound](../supplychain-transfer-inbound/feature-map.md).

| ID | Label UI | Jenis | Status | Depth | Card | KB | UG |
|----|----------|-------|--------|-------|------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | shared | AS-IS | stub | shared · export-with-without-detail | — | slice |
| SF-DL-06 | Bulk Delete / Bulk Approve | menu | AS-IS | missing | requirement §3 — belum card | — | pending |
| SF-DL-07 | [Show Virtual WH](#sf-lingo:SF-TFE-03) | menu | TO-BE | detailed | capabilities · sf-tfe-03 | Ya | tips |
| SF-HDR-01 | Create header (Origin / Destination) | menu | AS-IS | stub | KB §4 / requirement §5 | Ya | overview |
| SF-DET-01 | [Select Product / Available Products / Import](#sf-lingo:SF-DET-01) | menu | AS-IS | detailed | capabilities · sf-det-01 | Ya | overview |
| SF-TFE-01 | [Dual approve & In Transit](#sf-lingo:SF-TFE-01) | menu | AS-IS | detailed | capabilities · sf-tfe-01 | Ya | overview |
| SF-TFE-02 | [Single Rack FIFO / FIFO klasik](#sf-lingo:SF-TFE-02) | menu | AS-IS | detailed | capabilities · sf-tfe-02 | Ya | tips |
| SF-VIEW-01 | [Group View / Detail View](#sf-lingo:SF-VIEW-01) | menu | AS-IS | detailed | capabilities · sf-view-01 | Ya | slice |
| SF-IMP-01 | [Import Excel detail](#sf-lingo:SF-IMP-01) | menu | AS-IS | detailed | capabilities · sf-imp-01 | Ya | slice |
| SF-TFE-04 | Colli (BETA only) | menu | experimental | stub | requirement §6.5 — bukan produksi | — | — |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-PRT-01 | Print | menu | AS-IS | missing | technical — print options | — | pending |
| SF-Void | Void | — | N/A | — | Tidak ada Void setelah approve ke-1 | — | — |

**Siap Lingo:** SF-DET-01, SF-TFE-01..03, SF-VIEW-01, SF-IMP-01 + shared datalist/export/log.  
**Backlog:** Bulk datalist card, Print, Colli redesign, Help Center overview.
