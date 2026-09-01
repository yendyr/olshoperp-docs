---
doc_type: feature-map
menu: accounting-purchase-report
menu_name: "Purchase Report"
version: 1.0
last_updated: 2026-09-01
owner: QA - Yemima
status: review
aliases: [Purchase Report feature map, PURREP, PO PI tab report]
---

# Purchase Report — Feature Map

Indeks sub-feature / capability menu **Purchase Report** (dual tab PO / PI).  
**Klik Label UI** di kolom kedua untuk modal Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — `_meta/shared-capabilities/` |
| **menu** | Khusus Purchase Report — card di `capabilities/` |

**Route:** `/accounting/purchase-report` · **Jira:** [ETM-15673](https://erpintegration.atlassian.net/browse/ETM-15673) · [ETM-15674](https://erpintegration.atlassian.net/browse/ETM-15674)

| ID | Label UI | Jenis | Status | Depth | Card | KB | UG |
|----|----------|-------|--------|-------|------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | Ya | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | Ya | overview |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export All / This Page](#sf-lingo:SF-DL-05) | shared | AS-IS | stub | shared · export-with-without-detail | Ya | §3 |
| SF-PURREP-01 | [Tab Purchase Order / Purchase Invoice](#sf-lingo:SF-PURREP-01) | menu | AS-IS | detailed | capabilities · sf-purrep-01 | Ya | §1 |
| SF-PURREP-02 | [Group Supplier + total header](#sf-lingo:SF-PURREP-02) | menu | AS-IS | detailed | capabilities · sf-purrep-02 | Ya | §3 |
| SF-PURREP-03 | [Export per tab (PO vs PI)](#sf-lingo:SF-PURREP-03) | menu | AS-IS | detailed | capabilities · sf-purrep-03 | Ya | §3 |
| SF-PURREP-04 | [Hyperlink Trx. Code](#sf-lingo:SF-PURREP-04) | menu | AS-IS | stub | requirement R-08 | Ya | §3 |
| SF-PURREP-05 | Semua status dokumen | menu | AS-IS | stub | requirement R-03 | Ya | tips |
| SF-PURREP-06 | Total Price (exclude Other Cost/Disc) | menu | AS-IS | stub | requirement R-07 | — | pending |

**Siap Lingo:** SF-PURREP-01..03 + shared datalist/export.  
**Gap terdokumentasi:** GAP-PURREP-01 (default tanggal), GAP-PURREP-02 (Total Tagihan vs card) — [requirement §8](./requirement.md#8-gap-registry).  
**Backlog docs:** Help Center overview (sesi terpisah).
