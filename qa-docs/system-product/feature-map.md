---
doc_type: feature-map
menu: system-product
menu_name: "System Product"
version: 1.0
last_updated: 2026-07-29
owner: QA - Yemima
status: draft
aliases: [system product feature map, SKU master features, product bundle variant map]
---

# System Product — Feature Map

Indeks sub-feature master data SKU. **Klik Label UI** untuk membuka penjelasan Lingo.

| ID | Label UI | Jenis | Status | Depth | Card / sumber | KB | UG |
|----|----------|-------|--------|-------|---------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | overview |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | slice |
| SF-DL-05 | [Export (with/without detail)](#sf-lingo:SF-DL-05) | shared | AS-IS | stub | shared · export-with-without-detail | Ya | slice |
| SF-DL-06 | [Show deleted / archived](#sf-lingo:SF-DL-06) | shared | AS-IS | stub | shared · show-deleted | Ya | slice |
| SF-SP-01 | [Product Type & transactability](#sf-lingo:SF-SP-01) | menu | AS-IS | detailed | capabilities · sf-sp-01 | Ya | overview |
| SF-SP-02 | [Unit Configuration & D&W per unit](#sf-lingo:SF-SP-02) | menu | AS-IS | detailed | capabilities · sf-sp-02 | Ya | overview |
| SF-SP-03 | [Variant Configuration](#sf-lingo:SF-SP-03) | menu | AS-IS | detailed | capabilities · sf-sp-03 | Ya | overview |
| SF-SP-04 | [Bundle Configuration & tax hide](#sf-lingo:SF-SP-04) | menu | AS-IS | detailed | capabilities · sf-sp-04 | Ya | overview |
| SF-SP-05 | [Availability / On Hand / ATS](#sf-lingo:SF-SP-05) | menu | AS-IS | detailed | capabilities · sf-sp-05 | Ya | overview |
| SF-SP-06 | [Import / Export](#sf-lingo:SF-SP-06) | menu | AS-IS + TO-BE images | detailed | capabilities · sf-sp-06 | Ya | overview |
| SF-SP-07 | Inactive & Delete rules | menu | AS-IS | stub | KB §7 · requirement §14 | Ya | tips |
| SF-SP-08 | Accounting & Tax hierarchy | menu | AS-IS | stub | requirement §10 | Ya | slice |
| SF-SP-09 | Inventory flags (expired/serial/batch) | menu | AS-IS | stub | requirement §8 | Ya | slice |
| SF-SP-10 | Bundle pricing (Price Before VAT) | hybrid | TO-BE | detailed | SO Feature Map · requirement §11 | — | tips |
| SF-SP-11 | All D&W table + summary cards | menu | GAP | missing | Artifact 7 Mei; belum di main form (GAP-SP-09) | — | pending |
| SF-SP-12 | SKU unique per Data Owner (create) | menu | GAP | missing | Create global check (GAP-SP-01) | Ya | pending |

**Siap Lingo:** tipe produk, unit & D&W per satuan, variant, bundle + tax hide, kolom stok, dan import/export.  
**Backlog:** All D&W section (GAP-SP-09), SKU unique scope create (GAP-SP-01), dan Inventory flags card lebih dalam.
