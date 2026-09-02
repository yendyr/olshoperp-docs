---
doc_type: feature-map
menu: supplychain-transfer-inbound
menu_name: "Transfer Inbound"
version: 1.0
last_updated: 2026-09-01
owner: QA - Yemima
status: review
aliases: [TF Inbound feature map, transfer inbound features, penerimaan TF Ext]
---

# Transfer Inbound — Feature Map

Indeks sub-feature / capability menu **Transfer Inbound** (approval ke-2 atas Transfer External).  
**Klik Label UI** di kolom kedua untuk modal Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — `_meta/shared-capabilities/` |
| **menu** | Khusus Inbound — card di `capabilities/` |
| **stub / detailed / missing** | Kedalaman card |
| **N/A** | Tidak ada di menu ini |

Route: `/supplychain/transfer-inbound` (share FE TF Ext + flag inbound).  
Pasangan kirim: [Transfer External](../supplychain-mutation-transfer-external/feature-map.md).

| ID | Label UI | Jenis | Status | Depth | Card | KB | UG |
|----|----------|-------|--------|-------|------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | shared | AS-IS | stub | shared · export-with-without-detail | — | slice |
| SF-DL-06 | Bulk Approve | menu | AS-IS | missing | requirement §3 — belum card | — | pending |
| SF-DL-07 | [Show Virtual WH](#sf-lingo:SF-TFINB-03) | menu | TO-BE | detailed | capabilities · sf-tfinb-03 | Ya | tips |
| SF-HDR-01 | Create | — | N/A | — | Tidak ada Create — dokumen dari TF Ext | — | — |
| SF-TFINB-01 | [Qty Received / Lost / Broken](#sf-lingo:SF-TFINB-01) | menu | AS-IS | detailed | capabilities · sf-tfinb-01 | Ya | overview |
| SF-TFINB-02 | [Approve ke-2 & Delivered](#sf-lingo:SF-TFINB-02) | menu | AS-IS | detailed | capabilities · sf-tfinb-02 | Ya | overview |
| SF-VIEW-01 | [Group View / Detail View](#sf-lingo:SF-VIEW-01) | menu | AS-IS | detailed | capabilities · sf-view-01 | Ya | slice |
| SF-DET-01 | Select Product / Import | — | N/A | — | Tidak menambah SKU di inbound | — | — |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-Void | Void / Reject penerimaan | — | N/A | — | Koreksi angka sebelum Approve ke-2 | — | — |

**Siap Lingo:** SF-TFINB-01..03, SF-VIEW-01 + shared datalist/export/log.  
**Backlog:** Bulk Approve card, Help Center overview.
