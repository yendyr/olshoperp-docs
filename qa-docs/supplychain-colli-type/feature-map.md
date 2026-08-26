---
doc_type: feature-map
menu: supplychain-colli-type
menu_name: "Colli Type"
version: 1.0
last_updated: 2026-08-14
owner: QA - Yemima
status: review
aliases: [colli type feature map, jenis colli features]
---

# Colli Type — Feature Map

Indeks sub-feature / capability di menu ini.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus Colli Type — card di `capabilities/` bila ada |
| **stub / detailed / missing** | Kedalaman dokumen card |
| **N/A** | Menu tidak punya fitur ini |

Proposal: [`_meta/proposals/feature-map-and-capability-lingo.md`](../_meta/proposals/feature-map-and-capability-lingo.md).  
Konsumen: [Purchase Inbound](../supplychain-new-purchase-inbound/). CRUD UI masih **WIP**.

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | TO-BE | stub | shared · datalist-search-filter | — | slice |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | TO-BE | stub | shared · datalist-search-filter | — | slice |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | TO-BE | stub | shared · show-deleted | Ya | tips |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | TO-BE | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | Export | — | N/A | — | Out of scope | — | — |
| SF-CT-01 | [Create Colli Type](#sf-lingo:SF-CT-01) | menu | TO-BE | detailed | capabilities · sf-ct-01 | Ya | overview |
| SF-CT-02 | [Set as Default Data](#sf-lingo:SF-CT-02) | menu | TO-BE | detailed | capabilities · sf-ct-02 | Ya | overview |
| SF-CT-03 | [Active vs used](#sf-lingo:SF-CT-03) | menu | TO-BE | detailed | capabilities · sf-ct-03 | Ya | tips |
| SF-CT-04 | [Delete when unused](#sf-lingo:SF-CT-04) | menu | TO-BE | detailed | capabilities · sf-ct-04 | Ya | tips |
| SF-CT-05 | [Use in New Colli](#sf-lingo:SF-CT-05) | menu | TO-BE | detailed | capabilities · sf-ct-05 | Ya | overview |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | TO-BE | stub | shared · approval-audit-log | — | slice |
| SF-HDR-01 | Approve / Reject | — | N/A | — | Master tanpa approval | — | — |

**Siap Lingo (ada card):** Create, Default Data, Active vs used, Delete when unused, Use in New Colli.  
**Backlog:** Audit depth setelah CRUD live; unique-code copy exact.
