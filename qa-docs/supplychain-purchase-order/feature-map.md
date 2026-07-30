---
doc_type: feature-map
menu: supplychain-purchase-order
menu_name: "Purchase Order"
version: 1.0
last_updated: 2026-07-28
owner: QA - Yemima
status: draft
aliases: [PO feature map, purchase order features, sub feature PO]
---

# Purchase Order — Feature Map

Indeks sub-feature / capability di menu ini.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo. Di belakang layar tiap label terikat ID stabil `SF-…` agar relasi tidak bentrok antar menu/docs.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus PO — card di `capabilities/` bila ada |
| **stub / detailed / missing** | Kedalaman dokumen card |
| **N/A** | Menu tidak punya fitur ini |

Proposal: [`_meta/proposals/feature-map-and-capability-lingo.md`](../_meta/proposals/feature-map-and-capability-lingo.md).

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | hybrid | AS-IS | stub | shared · export-with-without-detail · Export Detail di form | — | slice |
| SF-PRICE-01 | [DPP & VAT di detail](#sf-lingo:SF-PRICE-01) | shared | AS-IS | detailed | shared · dpp-vat-breakdown-display · Case 4/5 | Ya | tips |
| SF-DL-06 | [Action rules](#sf-lingo:SF-DL-06) | menu | AS-IS | detailed | KB · Tombol & fungsi UI / requirement Datalist | Ya | overview |
| SF-DL-07 | Bulk Approve / Bulk Delete | menu | AS-IS | missing | FE DataList — belum ada card | — | pending |
| SF-PO-01 | [With PR / Without PR](#sf-lingo:SF-PO-01) | menu | AS-IS | detailed | capabilities · sf-po-01 | Ya | overview |
| SF-HDR-01 | Create / Save & Next / Save All | menu | AS-IS | stub | KB · Form create/edit | Ya | overview |
| SF-DET-01 | [Use / Allocate Full Qty Clearing](#sf-lingo:SF-DET-01) | menu | AS-IS | detailed | capabilities · sf-det-01 | Ya | overview |
| SF-COST-01 | [Additional Cost & Discount](#sf-lingo:SF-COST-01) | menu | AS-IS | detailed | capabilities · sf-cost-01 | Ya | overview |
| SF-PO-02 | [Complete vs Closed](#sf-lingo:SF-PO-02) | menu | AS-IS | detailed | capabilities · sf-po-02 | Ya | overview |
| SF-PO-03 | [Void vs Delete](#sf-lingo:SF-PO-03) | menu | AS-IS | detailed | capabilities · sf-po-03 | Ya | tips |
| SF-IMP-01 | [Import Detail](#sf-lingo:SF-IMP-01) | menu | AS-IS | detailed | capabilities · sf-imp-01 | Ya | overview |
| SF-PRT-01 | Print PO | menu | AS-IS | stub | KB/UG — print belum include Other Cost/Disc | Ya | tips |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-ATT-01 | Attachment | — | N/A | — | PO tidak punya attachment di AS-IS docs | — | — |

**Siap Lingo (ada card):** shared search/filter/show-deleted/column/export/log + **DPP & VAT** + With/Without PR, Use/Allocate Full, Additional Cost/Disc, Complete vs Closed, Void vs Delete, Import Detail.  
**Backlog card:** Bulk datalist actions, Print (depth naik).
