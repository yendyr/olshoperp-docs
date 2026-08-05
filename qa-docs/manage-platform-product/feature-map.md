---
doc_type: feature-map
menu: manage-platform-product
menu_name: "Manage Platform Product"
version: 1.0
last_updated: 2026-07-31
owner: QA - Yemima
status: review
aliases: [MPP feature map, platform product features, binding features]
---

# Manage Platform Product — Feature Map

Indeks sub-feature / capability di menu ini.  
**Klik nama di kolom Label UI** untuk membuka penjelasan Lingo. Tiap label terikat ID stabil `SF-…`.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — card di `_meta/shared-capabilities/` |
| **menu** | Khusus Manage Platform Product — card di `capabilities/` |
| **stub / detailed / missing** | Kedalaman dokumen card |
| **N/A** | Menu tidak punya fitur ini |

| ID | Label UI | Jenis | Status | Depth | Card (referensi) | KB | UG |
|----|----------|-------|--------|-------|------------------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | AS-IS | stub | shared · datalist-search-filter | — | — |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | AS-IS | stub | shared · datalist-search-filter | — | — |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | AS-IS | stub | shared · column-show-hide | — | — |
| SF-DL-05 | [Export Excel](#sf-lingo:SF-DL-05) | shared | AS-IS | stub | shared · export-with-without-detail | Ya | slice |
| SF-MPP-01 | [Filter Store](#sf-lingo:SF-MPP-01) | menu | AS-IS | detailed | capabilities · sf-mpp-01 | Ya | overview |
| SF-MPP-02 | [Pull Products](#sf-lingo:SF-MPP-02) | menu | AS-IS | detailed | capabilities · sf-mpp-02 | Ya | overview |
| SF-MPP-03 | [Push Stock](#sf-lingo:SF-MPP-03) | menu | AS-IS | detailed | capabilities · sf-mpp-03 | Ya | overview |
| SF-MPP-04 | [Manual Binding](#sf-lingo:SF-MPP-04) | menu | AS-IS | detailed | capabilities · sf-mpp-04 | Ya | overview |
| SF-MPP-05 | [Auto Binding](#sf-lingo:SF-MPP-05) | menu | AS-IS | detailed | capabilities · sf-mpp-05 | Ya | overview |
| SF-MPP-06 | [Bulk Binding](#sf-lingo:SF-MPP-06) | menu | AS-IS | detailed | capabilities · sf-mpp-06 | Ya | overview |
| SF-MPP-07 | [Stock Management](#sf-lingo:SF-MPP-07) | menu | AS-IS | detailed | capabilities · sf-mpp-07 | Ya | overview |
| SF-MPP-08 | Sync Product (per row / bulk) | menu | AS-IS | missing | requirement · A-09/A-10 — belum card | Ya | slice |
| SF-MPP-09 | Bulk Edit Stock | menu | AS-IS | missing | requirement · A-11 — belum card | — | slice |
| SF-MPP-10 | Delete Platform Product | menu | AS-IS | missing | requirement · V-19/V-20 — belum card | Ya | tips |
| SF-MPP-11 | Sync Log Panel | menu | AS-IS | missing | requirement · A-14 — belum card | Ya | tips |
| SF-HDR-01 | Create manual Platform Product | — | N/A | — | Tidak bisa create manual (`can_create: false`) | Ya | tips |
| SF-IMP-01 | Import Excel | — | N/A | — | Tidak ada import catalog | — | — |

**Siap Lingo (ada card):** Filter Store, Pull Products, Push Stock, Manual Binding, Auto Binding, Bulk Binding, Stock Management.  
**Backlog card:** Sync per row/bulk, Bulk Edit Stock, Delete rules, Sync Log Panel.
