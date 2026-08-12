---
doc_type: feature-map
menu: accounting-profit-loss
menu_name: "Profit & Loss"
version: 1.0
last_updated: 2026-08-12
owner: QA - Yemima
status: review
aliases: [P&L feature map, profit loss features, laba rugi features]
---

# Profit & Loss — Feature Map

Indeks sub-feature / capability di menu ini.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus Profit & Loss — card di `capabilities/` bila ada |
| **stub / detailed / missing** | Kedalaman dokumen card |
| **N/A** | Menu tidak punya fitur ini |

Proposal: [`_meta/proposals/feature-map-and-capability-lingo.md`](../_meta/proposals/feature-map-and-capability-lingo.md).  
Sibling: [Dev - Profit & Loss](../accounting-profit-loss-v1/).

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-PL-01 | [Period filter & Apply](#sf-lingo:SF-PL-01) | menu | AS-IS | detailed | capabilities · sf-pl-01 | Ya | overview |
| SF-PL-02 | [Compared Period](#sf-lingo:SF-PL-02) | menu | AS-IS | detailed | capabilities · sf-pl-02 | Ya | overview |
| SF-PL-03 | [How amounts are calculated](#sf-lingo:SF-PL-03) | menu | AS-IS | detailed | capabilities · sf-pl-03 | Ya | tips |
| SF-PL-04 | [Difference %](#sf-lingo:SF-PL-04) | menu | AS-IS | detailed | capabilities · sf-pl-04 | Ya | tips |
| SF-PL-05 | [Export All](#sf-lingo:SF-PL-05) | menu | AS-IS | detailed | capabilities · sf-pl-05 | Ya | overview |
| SF-PL-06 | Row group by COA class | menu | AS-IS | stub | KB · Cara baca tabel | Ya | overview |
| SF-PL-07 | Amount tooltip (FX) | menu | AS-IS | stub | requirement · tooltip AC5 | Ya | tips |
| SF-PL-08 | Whole-month compare path | menu | AS-IS | stub | requirement · GAP-PL-02 | Ya | tips |
| SF-PL-09 | Search Builder (COA / Class) | hybrid | AS-IS | stub | shared · datalist-search-filter | — | slice |
| SF-PL-10 | Filter Lainnya / Tag / Template | menu | TO-BE | stub | requirement · GAP-PL-01, 07–14 | Ya | tips |
| SF-PL-11 | Gross / Net profit rows | menu | TO-BE | stub | requirement · GAP-PL-06 | Ya | tips |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | Export (shared pattern) | hybrid | AS-IS | stub | SF-PL-05 menu card | — | — |
| SF-HDR-01 | Create / Edit / Approve | — | N/A | — | Report read-only | — | — |
| SF-ATT-01 | Attachment | — | N/A | — | — | — | — |
| SF-LOG-01 | Approval Log | — | N/A | — | Bukan transaksi | — | — |

**Siap Lingo (ada card):** Period & Apply, Compared Period, How amounts calculated, Difference %, Export All.  
**Backlog card:** Row-group depth, whole-month decision, TO-BE Mekari filters / Gross-Net.
