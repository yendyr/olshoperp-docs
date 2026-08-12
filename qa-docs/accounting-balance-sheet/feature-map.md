---
doc_type: feature-map
menu: accounting-balance-sheet
menu_name: "Balance Sheet"
version: 1.0
last_updated: 2026-08-12
owner: QA - Yemima
status: review
aliases: [BS feature map, balance sheet features, neraca features]
---

# Balance Sheet — Feature Map

Indeks sub-feature / capability di menu ini.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus Balance Sheet — card di `capabilities/` bila ada |
| **stub / detailed / missing** | Kedalaman dokumen card |
| **N/A** | Menu tidak punya fitur ini |

Proposal: [`_meta/proposals/feature-map-and-capability-lingo.md`](../_meta/proposals/feature-map-and-capability-lingo.md).  
Sibling: [Profit & Loss Feature Map](../accounting-profit-loss/feature-map.md).

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-BS-01 | [As at & Apply](#sf-lingo:SF-BS-01) | menu | AS-IS | detailed | capabilities · sf-bs-01 | Ya | overview |
| SF-BS-02 | [Summary cards](#sf-lingo:SF-BS-02) | menu | AS-IS | detailed | capabilities · sf-bs-02 | Ya | overview |
| SF-BS-03 | [Dual table Assets vs L&E](#sf-lingo:SF-BS-03) | menu | AS-IS | detailed | capabilities · sf-bs-03 | Ya | overview |
| SF-BS-04 | [How Ending Balance is calculated](#sf-lingo:SF-BS-04) | menu | AS-IS | detailed | capabilities · sf-bs-04 | Ya | tips |
| SF-BS-05 | [Current Profit/Loss & Equity](#sf-lingo:SF-BS-05) | menu | AS-IS | detailed | capabilities · sf-bs-05 | Ya | tips |
| SF-BS-06 | Assets = L+E equation | menu | AS-IS | stub | KB · Cara baca / GAP-BS-08 | Ya | tips |
| SF-BS-07 | Cut-off As at day | menu | AS-IS | stub | requirement · GAP-BS-01 | Ya | tips |
| SF-DL-05 | Export | — | N/A | — | View only — no export (GAP-BS-07) | Ya | tips |
| SF-DL-01 | Global Search | — | N/A | — | Tabel minimal tanpa search UI | — | — |
| SF-DL-02 | Advanced Filter / Search Builder | — | N/A | — | Tidak ada | — | — |
| SF-HDR-01 | Create / Edit / Approve | — | N/A | — | Report read-only | — | — |
| SF-ATT-01 | Attachment | — | N/A | — | — | — | — |
| SF-LOG-01 | Approval Log | — | N/A | — | Bukan transaksi | — | — |

**Siap Lingo (ada card):** As at & Apply, Summary cards, Dual table, How Ending Balance calculated, Current P/L & Equity.  
**Backlog card:** Equation soft-warning, cut-off decision depth.
