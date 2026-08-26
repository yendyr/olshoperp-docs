---
doc_type: feature-map
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
version: 1.1
last_updated: 2026-08-14
owner: QA - Yemima
status: review
aliases: [GRN feature map, purchase inbound features, COLLI features, colli v2]
---

# Purchase Inbound (GRN) — Feature Map

Indeks sub-feature / capability di menu **BETA - New Purchase Inbound**.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus GRN / BETA — card di `capabilities/` bila ada |
| **stub / detailed / missing** | Kedalaman dokumen card |
| **N/A** | Menu tidak punya fitur ini |

Legacy UI (`/supplychain/mutation-inbound`) memakai API yang sama; **Colli v2 parity** (Existing/New + Type). Proposal: [`_meta/proposals/feature-map-and-capability-lingo.md`](../_meta/proposals/feature-map-and-capability-lingo.md).

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-03 | [Show Deleted](#sf-lingo:SF-DL-03) | shared | AS-IS | stub | shared · show-deleted | — | slice |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | hybrid | AS-IS | stub | shared · export-with-without-detail | — | slice |
| SF-DL-06 | [Action rules](#sf-lingo:SF-DL-06) | menu | AS-IS | detailed | KB · Tombol & aksi / requirement Datalist | Ya | overview |
| SF-DL-07 | Bulk delete / Bulk approve | menu | AS-IS | missing | FE DataList — belum ada card | — | pending |
| SF-HDR-01 | Create header (Supplier / Warehouse / Date) | menu | AS-IS | stub | KB · Alur kerja / requirement Basic Info | Ya | overview |
| SF-DET-01 | [Bulk Use / Single Use / Select Product](#sf-lingo:SF-DET-01) | menu | AS-IS | detailed | capabilities · sf-det-01 | Ya | overview |
| SF-DET-02 | [Allocate Full Qty](#sf-lingo:SF-DET-02) | menu | AS-IS | detailed | capabilities · sf-det-02 | Ya | slice |
| SF-INB-01 | [Colli v2 (wadah multi-SKU)](#sf-lingo:SF-INB-01) | menu | TO-BE | detailed | capabilities · sf-inb-01 | Ya | overview |
| SF-INB-02 | [Partial receiving](#sf-lingo:SF-INB-02) | menu | AS-IS | detailed | capabilities · sf-inb-02 | Ya | overview |
| SF-INB-03 | [Service / Fix Asset / Inventory](#sf-lingo:SF-INB-03) | menu | AS-IS | detailed | capabilities · sf-inb-03 | Ya | tips |
| SF-IMP-01 | [Import Excel](#sf-lingo:SF-IMP-01) | menu | AS-IS | detailed | capabilities · sf-imp-01 | Ya | overview |
| SF-PRT-01 | Print / Print RIR | menu | AS-IS | stub | KB · Print PDF GRN / RIR | Ya | slice |
| SF-ATT-01 | Attachment | menu | AS-IS | missing | Header optional — belum card | — | pending |
| SF-INB-04 | Void approved GRN | menu | GAP | stub | KB/UG — void belum berfungsi | Ya | tips |
| SF-LOG-01 | [Approval Log](#sf-lingo:SF-LOG-01) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-LOG-02 | [Audit Log](#sf-lingo:SF-LOG-02) | shared | AS-IS | stub | shared · approval-audit-log | — | slice |
| SF-PRICE-01 | DPP & VAT di detail | — | N/A | — | GRN tidak tampil DPP/VAT baris; harga sebelum PPN ke Unbilled | — | — |

**Siap Lingo (ada card):** shared datalist/export/log + Bulk/Single Use, Allocate Full, Colli v2, Partial receiving, Service/Fix Asset/Inventory, Import.  
**Backlog card:** Bulk datalist actions, Attachment, Print (depth naik), Void (setelah fitur siap).
