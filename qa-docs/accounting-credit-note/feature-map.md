---
doc_type: feature-map
menu: accounting-credit-note
menu_name: "Credit Note"
version: 1.0
last_updated: 2026-07-29
owner: QA - Yemima
status: draft
aliases: [CN feature map, credit note features, nota kredit features]
---

# Credit Note — Feature Map

Indeks sub-feature / capability di menu ini.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus Credit Note — card di `capabilities/` bila ada |
| **stub / detailed / missing** | Kedalaman dokumen card |
| **N/A** | Menu tidak punya fitur ini |

Proposal: [`_meta/proposals/feature-map-and-capability-lingo.md`](../_meta/proposals/feature-map-and-capability-lingo.md).

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | hybrid | AS-IS | stub | shared · export-with-without-detail | — | slice |
| SF-DL-06 | Action rules | menu | AS-IS | stub | requirement · Datalist actions | — | overview |
| SF-HDR-01 | Create / header lock | menu | AS-IS | stub | KB · Status / requirement field lock | Ya | overview |
| SF-CN-01 | [How CN is created](#sf-lingo:SF-CN-01) | menu | AS-IS | detailed | capabilities · sf-cn-01 | Ya | overview |
| SF-DET-01 | [Receiving Destination — Use / Bulk Use](#sf-lingo:SF-DET-01) | menu | AS-IS | detailed | capabilities · sf-det-01 | Ya | overview |
| SF-CN-02 | [Total / Paid / Outstanding](#sf-lingo:SF-CN-02) | menu | AS-IS | detailed | capabilities · sf-cn-02 | Ya | tips |
| SF-CN-03 | [Use in Account Receive](#sf-lingo:SF-CN-03) | menu | AS-IS | detailed | capabilities · sf-cn-03 | Ya | overview |
| SF-IMP-01 | [Import Credit Note](#sf-lingo:SF-IMP-01) | menu | AS-IS | detailed | capabilities · sf-imp-01 | Ya | overview |
| SF-CN-04 | Auto from Sales Return Billed | menu | AS-IS | stub | KB/UG · Complete billed return | Ya | overview |
| SF-CN-05 | Void / Close | menu | AS-IS | stub | requirement · privilege after approved | Ya | slice |
| SF-PRT-01 | Print | menu | GAP | stub | UI ada — print belum siap (GAP-CN-01) | Ya | tips |
| SF-ATT-01 | Attachment | — | N/A | — | Belum jadi fokus AS-IS docs | — | — |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-DET-02 | Detail Related Transaction | menu | AS-IS | stub | KB · pemakaian di AR | Ya | slice |

**Siap Lingo (ada card):** shared datalist/export/log + How CN is created, Receiving Destination Use/Bulk Use, Total/Paid/Outstanding, Use in Account Receive, Import.  
**Backlog card:** Auto from Sales Return (depth), Void/Close, Print (setelah fix), Related Transaction.
