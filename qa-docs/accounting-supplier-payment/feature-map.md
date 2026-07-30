---
doc_type: feature-map
menu: accounting-supplier-payment
menu_name: "Account Payment"
version: 1.0
last_updated: 2026-07-29
owner: QA - Yemima
status: draft
aliases: [AP payment feature map, account payment features, PY features]
---

# Account Payment — Feature Map

Indeks sub-feature / capability di menu ini.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus Account Payment — card di `capabilities/` bila ada |
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
| SF-DL-06 | Action rules | menu | AS-IS | stub | requirement · Datalist | — | overview |
| SF-DL-07 | Bulk delete / Bulk approve | menu | AS-IS | missing | FE DataList — belum ada card | — | pending |
| SF-HDR-01 | Create / header lock | menu | AS-IS | stub | requirement · Header locking | Ya | overview |
| SF-SRC-01 | [Payment Source — Cash/Bank & Debit Note](#sf-lingo:SF-SRC-01) | menu | AS-IS | detailed | capabilities · sf-src-01 | Ya | overview |
| SF-DET-01 | [Outstanding PI — Use / Bulk Use / Allocate Full](#sf-lingo:SF-DET-01) | menu | AS-IS | detailed | capabilities · sf-det-01 | Ya | overview |
| SF-PAY-01 | [Strict balancing](#sf-lingo:SF-PAY-01) | menu | AS-IS | detailed | capabilities · sf-pay-01 | Ya | overview |
| SF-PAY-02 | [Partial payment](#sf-lingo:SF-PAY-02) | menu | AS-IS | detailed | capabilities · sf-pay-02 | Ya | overview |
| SF-ADJ-01 | [Adjustment](#sf-lingo:SF-ADJ-01) | menu | AS-IS | detailed | capabilities · sf-adj-01 | Ya | slice |
| SF-IMP-01 | [Import Account Payment](#sf-lingo:SF-IMP-01) | menu | AS-IS | detailed | capabilities · sf-imp-01 | Ya | overview |
| SF-PAY-03 | Exchange Diff / Cash Diff | menu | AS-IS | stub | requirement · forex & cash diff on approve | — | tips |
| SF-PAY-04 | Void approved payment | menu | GAP | stub | UI ada; API broken — jangan andalkan | Ya | tips |
| SF-ATT-01 | Attachment | menu | AS-IS | missing | Header bukti bayar — belum card | — | pending |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-PRT-01 | Print | — | N/A | — | Belum jadi fokus AS-IS docs | — | — |

**Siap Lingo (ada card):** shared datalist/export/log + Payment Source, Outstanding PI Use/Bulk/Allocate Full, Strict balancing, Partial payment, Adjustment, Import.  
**Backlog card:** Bulk datalist actions, Attachment, Exchange/Cash Diff (depth naik), Void (setelah fix).
