---
doc_type: feature-map
menu: accounting-sales-return
menu_name: "Sales Return"
version: 1.0
last_updated: 2026-07-29
owner: QA - Yemima
status: draft
aliases: [sales return approval feature map, SR finance features, complete sales return]
---

# Sales Return Approval — Feature Map

Indeks sub-feature / capability di menu **Finance Sales Return** (approval / Complete).  
Alur gudang lengkap: [supplychain-sales-returns](../supplychain-sales-returns/).  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus Finance SR — card di `capabilities/` bila ada |
| **stub / detailed / missing** | Kedalaman dokumen card |

Proposal: [`_meta/proposals/feature-map-and-capability-lingo.md`](../_meta/proposals/feature-map-and-capability-lingo.md).

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | hybrid | AS-IS | stub | shared · export-with-without-detail | — | slice |
| SF-SRA-01 | [Complete](#sf-lingo:SF-SRA-01) | menu | AS-IS | detailed | capabilities · sf-sra-01 | Ya | overview |
| SF-SRA-02 | [Billed vs Unbilled](#sf-lingo:SF-SRA-02) | menu | AS-IS | detailed | capabilities · sf-sra-02 | Ya | overview |
| SF-SRA-03 | [Order / Return Price & COGS](#sf-lingo:SF-SRA-03) | menu | AS-IS | detailed | capabilities · sf-sra-03 | Ya | overview |
| SF-SRA-04 | [Restock / Broken / Lost](#sf-lingo:SF-SRA-04) | menu | AS-IS | detailed | capabilities · sf-sra-04 | Ya | overview |
| SF-SRA-05 | [Auto-approve](#sf-lingo:SF-SRA-05) | menu | AS-IS | detailed | capabilities · sf-sra-05 | Ya | tips |
| SF-SRA-06 | Credit Note from billed | menu | AS-IS | stub | SF-SRA-02 + Credit Note menu | Ya | overview |
| SF-SRA-07 | Reject | menu | GAP | stub | Tidak ada tombol/endpoint aktif | — | pending |
| SF-PRT-01 | Print / Completion Summary | menu | GAP | stub | Dialog + print summary belum ada | — | pending |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-IMP-01 | Import | — | N/A | — | Bukan fokus menu Finance ini | — | — |

**Siap Lingo (ada card):** shared datalist + Complete, Billed/Unbilled, Price/COGS, Restock/Broken/Lost, Auto-approve.  
**Backlog:** Reject (setelah ada), Print/Summary, Credit Note card depth.
