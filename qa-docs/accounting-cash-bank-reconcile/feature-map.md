---
doc_type: feature-map
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
version: 1.0
last_updated: 2026-09-10
owner: QA - Yemima
status: review
aliases: [CBR feature map, cash bank reconcile features, bank reconcile features]
---

# Cash/Bank Reconcile — Feature Map

Indeks sub-feature / capability di menu ini.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus Cash/Bank Reconcile — card di `capabilities/` |
| **stub / detailed** | Kedalaman dokumen card |
| **TO-BE** | Direncanakan (ETM-15856) — belum production |

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | hybrid | AS-IS | stub | shared · export-with-without-detail | — | slice |
| SF-HDR-01 | Create / Period / Cash Bank Account | menu | AS-IS | stub | KB · Basic Information | Ya | steps |
| SF-CBR-01 | [Import Bank Statement](#sf-lingo:SF-CBR-01) | menu | AS-IS | detailed | capabilities · sf-cbr-01 | Ya | steps |
| SF-CBR-02 | [Reconcile Process & Suggestion](#sf-lingo:SF-CBR-02) | menu | AS-IS | detailed | capabilities · sf-cbr-02 | Ya | steps |
| SF-CBR-03 | [Matching Slideover (2 arah)](#sf-lingo:SF-CBR-03) | menu | TO-BE | detailed | capabilities · sf-cbr-03 | Ya | steps |
| SF-CBR-04 | [Quick Journal dari matching](#sf-lingo:SF-CBR-04) | menu | TO-BE | detailed | capabilities · sf-cbr-04 | Ya | steps |
| SF-CBR-05 | [Match, Unmatch & Approve](#sf-lingo:SF-CBR-05) | menu | AS-IS+TO-BE | detailed | capabilities · sf-cbr-05 | Ya | overview |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |

**Siap Lingo (ada card):** Import Bank Statement, Reconcile Process & Suggestion, Matching Slideover, Quick Journal, Match/Unmatch/Approve.  
**Overview Help Center:** ditunda (belum dibuat).
