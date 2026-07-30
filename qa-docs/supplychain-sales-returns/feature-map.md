---
doc_type: feature-map
menu: supplychain-sales-returns
menu_name: "Sales Return"
version: 1.0
last_updated: 2026-07-29
owner: QA - Yemima
status: draft
aliases: [sales return SCM feature map, warehouse return features, SR gudang]
---

# Sales Return (SCM) — Feature Map

Indeks sub-feature untuk proses retur oleh tim gudang. **Klik Label UI** untuk membuka penjelasan Lingo.

| ID | Label UI | Jenis | Status | Depth | Card / sumber | KB | UG |
|----|----------|-------|--------|-------|---------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | shared | AS-IS | stub | shared · export-with-without-detail | Ya | slice |
| SF-SR-01 | [Scan Order & eligibility](#sf-lingo:SF-SR-01) | menu | AS-IS | detailed | capabilities · sf-sr-01 | Ya | overview |
| SF-SR-02 | [Return WH & CCTV Location](#sf-lingo:SF-SR-02) | menu | AS-IS | detailed | capabilities · sf-sr-02 | Ya | overview |
| SF-SR-03 | [Sales Return Platform & Sync](#sf-lingo:SF-SR-03) | menu | AS-IS | detailed | capabilities · sf-sr-03 | Ya | overview |
| SF-SR-04 | [Restock / Broken / Lost](#sf-lingo:SF-SR-04) | menu | AS-IS | detailed | capabilities · sf-sr-04 | Ya | overview |
| SF-SR-05 | [Save & handoff to Finance](#sf-lingo:SF-SR-05) | menu | AS-IS | detailed | capabilities · sf-sr-05 | Ya | overview |
| SF-SR-06 | Billed vs Unbilled | hybrid | AS-IS | detailed | Finance Feature Map · SF-SRA-02 | Ya | tips |
| SF-SR-07 | Delete open return | menu | AS-IS | stub | KB · Delete sebelum approved | Ya | slice |
| SF-SR-08 | Multi-order → one SR | menu | GAP | missing | Belum diimplementasi; satu order per scan | Ya | pending |
| SF-PRT-01 | Print Summary | menu | GAP | missing | Seeder ada; UI belum tersedia | — | pending |
| SF-IMP-01 | Import | — | N/A | — | Route aktif tidak tersedia | — | — |

**Siap Lingo:** Scan eligibility, lokasi retur, platform Sync, pembagian qty, dan handoff ke Finance.  
**Backlog:** Delete card lebih dalam, multi-order, dan Print Summary.
