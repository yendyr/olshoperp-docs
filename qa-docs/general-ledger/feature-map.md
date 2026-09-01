---
doc_type: feature-map
menu: general-ledger
menu_name: "General Ledger Report"
version: 1.0
last_updated: 2026-09-01
owner: QA - Yemima
status: review
aliases: [GL feature map, general ledger features, GL store column]
---

# General Ledger Report — Feature Map

Indeks sub-feature / capability menu **General Ledger** (read-only report).  
**Klik Label UI** di kolom kedua untuk modal Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — `_meta/shared-capabilities/` |
| **menu** | Khusus GL — card di `capabilities/` |
| **stub / detailed / missing** | Kedalaman card |

**Route:** `/accounting/general-ledger` · **Card Jira Store:** [ETM-15666](https://erpintegration.atlassian.net/browse/ETM-15666)

| ID | Label UI | Jenis | Status | Depth | Card | KB | UG |
|----|----------|-------|--------|-------|------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | Ya §2 | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | Ya §2 | overview |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export All / This Page](#sf-lingo:SF-DL-05) | shared | AS-IS | stub | shared · export-with-without-detail | Ya §5 | slice |
| SF-GL-01 | [Kolom Store](#sf-lingo:SF-GL-01) | menu | AS-IS | detailed | capabilities · sf-gl-01 | Ya §4 | overview |
| SF-GL-02 | [Filter Store (search + advanced)](#sf-lingo:SF-GL-02) | menu | AS-IS | detailed | capabilities · sf-gl-02 | Ya §2 | overview |
| SF-GL-03 | [Export kolom Store](#sf-lingo:SF-GL-03) | menu | AS-IS | detailed | capabilities · sf-gl-03 | Ya §5 | slice |
| SF-GL-04 | [Row group per COA](#sf-lingo:SF-GL-04) | menu | AS-IS | stub | requirement §2.5 | Ya §3 | overview |
| SF-GL-05 | Opening / Ending Balance (export) | menu | AS-IS | stub | requirement §3 | Ya §3 | tips |
| SF-GL-06 | Current Profit/Loss UNION | menu | AS-IS | missing | requirement §2.2 | — | pending |

**Siap Lingo:** SF-GL-01..03 + shared datalist/export.  
**Backlog docs:** Help Center overview (sesi terpisah). **Backlog dev:** store pivot AR/CN/DN — [requirement §9](./requirement.md#9-kolom-store--aturan-bisnis--gap-implementasi).
