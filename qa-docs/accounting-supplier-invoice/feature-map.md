---
doc_type: feature-map
menu: accounting-supplier-invoice
menu_name: "Purchase Invoice"
version: 1.1
last_updated: 2026-07-27
owner: QA - Yemima
status: review
aliases: [PI feature map, purchase invoice features, sub feature PI]
---

# Purchase Invoice — Feature Map

Indeks sub-feature / capability di menu ini.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo. Di belakang layar tiap label terikat ID stabil `SF-…` (prefix) agar relasi tidak bentrok antar menu/docs.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus PI — card di `capabilities/` bila ada |
| **stub / detailed / missing** | Kedalaman dokumen card |
| **N/A** | Menu tidak punya fitur ini |

Proposal: [`_meta/proposals/feature-map-and-capability-lingo.md`](../_meta/proposals/feature-map-and-capability-lingo.md).

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | detailed | shared · datalist-search-filter (operator + multi-value) | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted · PI soft-delete header | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | hybrid | AS-IS | stub | shared · export-with-without-detail | — | slice |
| SF-PRICE-01 | [DPP & VAT di detail](#sf-lingo:SF-PRICE-01) | shared | AS-IS | detailed | shared · dpp-vat-breakdown-display · Case 4/5 | Ya | tips |
| SF-DL-06 | [Action rules](#sf-lingo:SF-DL-06) | menu | AS-IS | detailed | requirement · Datalist action rules | — | overview |
| SF-DL-07 | Bulk delete / Bulk approve | menu | AS-IS | missing | FE DataList — belum ada card | — | pending |
| SF-HDR-01 | [Create auto-save / Save & Next](#sf-lingo:SF-HDR-01) | menu | AS-IS | detailed | requirement · Create UX | Ya | overview |
| SF-HDR-02 | [Supplier's Invoice Amount](#sf-lingo:SF-HDR-02) | menu | TO-BE | detailed | capabilities · sf-hdr-02 | Ya | pending |
| SF-DET-01 | [Single Use / Bulk Use](#sf-lingo:SF-DET-01) | menu | AS-IS | detailed | capabilities · sf-det-01 | Ya | overview |
| SF-COST-01 | [Additional Cost & Discount](#sf-lingo:SF-COST-01) | menu | AS-IS | detailed | requirement · Additional Cost | Ya | overview |
| SF-TOT-01 | [Net Purchase Invoice](#sf-lingo:SF-TOT-01) | menu | AS-IS | detailed | capabilities · sf-tot-01 | Ya | overview |
| SF-PI-01 | [Partial invoicing](#sf-lingo:SF-PI-01) | menu | AS-IS | detailed | capabilities · sf-pi-01 | Ya | overview |
| SF-PI-02 | [Multi-unit](#sf-lingo:SF-PI-02) | menu | AS-IS | detailed | requirement · How It Works | — | overview |
| SF-PI-03 | [Currency lock](#sf-lingo:SF-PI-03) | menu | AS-IS | detailed | requirement · How It Works | — | overview |
| SF-PI-04 | [Jurnal saat Approve](#sf-lingo:SF-PI-04) | menu | AS-IS | detailed | requirement · jurnal | Ya | overview |
| SF-PI-05 | [Exchange Gain/Loss](#sf-lingo:SF-PI-05) | menu | AS-IS | detailed | requirement · How It Works | — | overview |
| SF-PI-06 | [Return Billed / Debit Note](#sf-lingo:SF-PI-06) | menu | AS-IS | detailed | requirement · return | Ya | overview |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-PRT-01 | Print PI | menu | AS-IS | missing | Route / GAP-PI-01 — belum card | — | pending |
| SF-ATT-01 | Attachment | menu | AS-IS | missing | Field Basic Info — belum card | — | pending |
| SF-IMP-01 | Import | — | N/A | — | PI tidak punya import | — | — |

**Siap Lingo (ada card):** shared search/filter/show-deleted/column/export/log + **DPP & VAT di detail** + Single/Bulk Use, Partial invoicing, Net PI, Supplier's Invoice Amount.  
**Backlog card:** Bulk datalist actions, Print, Attachment.
