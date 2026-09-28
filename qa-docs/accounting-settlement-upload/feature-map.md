---
doc_type: feature-map
menu: accounting-settlement-upload
menu_name: "Instant Settlement"
version: 1.0
last_updated: 2026-09-28
owner: QA - Yemima
status: review
aliases: [settlement upload feature map, instant settlement capabilities]
---

# Instant Settlement — Feature Map

Indeks sub-feature / capability di menu **Instant Settlement** (`/accounting/settlement-upload`).
**Klik Label UI** untuk membuka penjelasan Lingo (`SF-…`).

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — `_meta/shared-capabilities/` |
| **menu** | Khusus Instant Settlement — `capabilities/` |
| **stub / detailed / missing** | Kedalaman dokumen card |

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-05 | [Export](#sf-lingo:SF-DL-05) | shared | AS-IS | stub | shared · export-with-without-detail | — | slice |
| SF-SETU-01 | [Store Select & Import CSV](#sf-lingo:SF-SETU-01) | menu | AS-IS | detailed | capabilities · sf-setu-01 | Ya | overview |
| SF-SETU-02 | [Download Template](#sf-lingo:SF-SETU-02) | menu | AS-IS | detailed | capabilities · sf-setu-02 | Ya | overview |
| SF-SETU-03 | [All-or-nothing Validasi](#sf-lingo:SF-SETU-03) | menu | AS-IS | detailed | capabilities · sf-setu-03 | Ya | overview |
| SF-SETU-04 | [Upload Progress (5 tahap)](#sf-lingo:SF-SETU-04) | menu | AS-IS | detailed | capabilities · sf-setu-04 | Ya | overview |
| SF-SETU-05 | [Approve / Bulk Approve](#sf-lingo:SF-SETU-05) | menu | AS-IS | detailed | capabilities · sf-setu-05 | Ya | overview |
| SF-SETU-06 | [Approve Progress (4 tahap)](#sf-lingo:SF-SETU-06) | menu | AS-IS | detailed | capabilities · sf-setu-06 | Ya | overview |
| SF-SETU-07 | [Retry batch / per order](#sf-lingo:SF-SETU-07) | menu | AS-IS | detailed | capabilities · sf-setu-07 | Ya | overview |
| SF-SETU-08 | [Delete / Revert](#sf-lingo:SF-SETU-08) | menu | AS-IS | detailed | capabilities · sf-setu-08 | Ya | overview |
| SF-SETU-09 | Counters SO/SI/Out/AR & slideover | menu | AS-IS | stub | KB · ResultPanel / angka kolom | Ya | overview |
| SF-SETU-10 | Template General OC/OD | menu | AS-IS | stub | requirement · §4.6 | Ya | tips |
| SF-SETU-11 | Difference Settlement-SI | menu | AS-IS | stub | KB · glossary Difference | Ya | tips |
| SF-LOG-01 | [Log Data / Audit](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |

**Siap Lingo:** Import+Store, Template, All-or-nothing, Upload Progress, Approve, Approve Progress, Retry, Delete/Revert.  
**Backlog card:** Counters slideover, Template General OC/OD, Difference Settlement-SI.
