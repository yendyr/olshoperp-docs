---
doc_type: feature-map
menu: accounting-debit-note
menu_name: "Debit Note"
version: 1.0
last_updated: 2026-08-12
owner: QA - Yemima
status: review
aliases: [DN feature map, debit note features, nota debit features]
---

# Debit Note — Feature Map

Indeks sub-feature / capability di menu ini.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus Debit Note — card di `capabilities/` bila ada |
| **stub / detailed / missing** | Kedalaman dokumen card |
| **N/A** | Menu tidak punya fitur ini |

Proposal: [`_meta/proposals/feature-map-and-capability-lingo.md`](../_meta/proposals/feature-map-and-capability-lingo.md).  
Mirror AR: [Credit Note Feature Map](../accounting-credit-note/feature-map.md).

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | hybrid | AS-IS | stub | shared · export-with-without-detail | — | tips |
| SF-DL-06 | Action rules | menu | AS-IS | stub | requirement · Datalist actions | — | overview |
| SF-HDR-01 | Create / auto-save last trx | menu | AS-IS | stub | KB · Create / requirement auto-save | Ya | tips |
| SF-DN-01 | [How DN is created](#sf-lingo:SF-DN-01) | menu | AS-IS | detailed | capabilities · sf-dn-01 | Ya | overview |
| SF-DET-01 | [Payment Source — Cash/Bank](#sf-lingo:SF-DET-01) | menu | AS-IS | detailed | capabilities · sf-det-01 | Ya | overview |
| SF-DN-02 | [Total / Paid / Outstanding](#sf-lingo:SF-DN-02) | menu | AS-IS | detailed | capabilities · sf-dn-02 | Ya | tips |
| SF-DN-03 | [Use in Account Payment](#sf-lingo:SF-DN-03) | menu | AS-IS | detailed | capabilities · sf-dn-03 | Ya | overview |
| SF-DN-04 | [From Purchase Return](#sf-lingo:SF-DN-04) | menu | AS-IS | detailed | capabilities · sf-dn-04 | Ya | overview |
| SF-DN-05 | Reject → Save status | menu | AS-IS | stub | KB/UG · Reject lalu Save | Ya | tips |
| SF-IMP-01 | From AP Import Adjustment | menu | AS-IS | stub | SF-DN-01 · Account Payment Import | Ya | overview |
| SF-DN-06 | Void / Close | menu | deferred | stub | requirement · Void/Closed deferred | Ya | — |
| SF-PRT-01 | Print | menu | AS-IS | stub | requirement · Print selalu ada | Ya | slice |
| SF-ATT-01 | Attachment | menu | AS-IS | stub | requirement · Attachment opsional | — | — |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |

**Siap Lingo (ada card):** How DN is created, Payment Source Cash/Bank, Total/Paid/Outstanding, Use in Account Payment, From Purchase Return.  
**Backlog card:** Reject→Save depth, AP Import Adjustment depth, Void/Close (setelah definisi), Export PR detail bug note di tips.
