---
doc_type: feature-map
menu: order-processing-trace
menu_name: "Order Processing Trace"
version: 1.1
last_updated: 2026-09-03
owner: QA - Yemima
status: draft
aliases: [Order Processing Trace feature map, OPT, SO trace report, ETM-15713]
---

# Order Processing Trace — Feature Map

Indeks sub-feature / capability menu **Order Processing Trace** (report referensi proses fulfillment per Sales Order).  
**Klik Label UI** di kolom kedua untuk modal Lingo.

| Keterangan | Arti |
|------------|------|
| **shared** | Pola platform — `_meta/shared-capabilities/` |
| **menu** | Khusus Order Processing Trace — card di `capabilities/` |
| **TO-BE** | Belum implementasi — spec ETM-15713 |

**Route:** `/supplychain/order-processing-trace` (modul **SupplyChain → Report** saja) · **Jira:** [ETM-15713](https://erpintegration.atlassian.net/browse/ETM-15713)

| ID | Label UI | Jenis | Status | Depth | Card | KB | UG |
|----|----------|-------|--------|-------|------|----|-----|
| SF-DL-01 | [Global Search](#sf-lingo:SF-DL-01) | shared | TO-BE | stub | shared · datalist-search-filter | Ya | pending |
| SF-DL-02 | [Advanced Filter](#sf-lingo:SF-DL-02) | shared | TO-BE | stub | shared · datalist-search-filter | Ya | pending |
| SF-DL-04 | [Column Show/Hide](#sf-lingo:SF-DL-04) | shared | TO-BE | stub | shared · column-show-hide | — | pending |
| SF-DL-05 | [Export All / This Page](#sf-lingo:SF-DL-05) | shared | TO-BE | stub | shared · export-with-without-detail | Ya | pending |
| SF-OPT-01 | [Entry SCM Report](#sf-lingo:SF-OPT-01) | menu | TO-BE | detailed | capabilities · sf-opt-01 | Ya | pending |
| SF-OPT-02 | [Grid 1 baris = 1 Sales Order](#sf-lingo:SF-OPT-02) | menu | TO-BE | detailed | capabilities · sf-opt-02 | Ya | pending |
| SF-OPT-03 | [Hyperlink Trx & Ref](#sf-lingo:SF-OPT-03) | menu | TO-BE | detailed | capabilities · sf-opt-03 | Ya | pending |
| SF-OPT-04 | [Trx Date / Platform Date](#sf-lingo:SF-OPT-04) | menu | TO-BE | detailed | capabilities · sf-opt-04 | — | pending |
| SF-OPT-05 | [Export Without Detail](#sf-lingo:SF-OPT-05) | menu | TO-BE | detailed | capabilities · sf-opt-05 | Ya | pending |
| SF-OPT-06 | [Export With Detail (produk)](#sf-lingo:SF-OPT-06) | menu | TO-BE | detailed | capabilities · sf-opt-06 | Ya | pending |
| SF-HDR-01 | Create / Edit / Approve | — | N/A | — | Read-only — tidak ada aksi transaksi | — | — |
| SF-LOG-01 | Approval Log | — | N/A | — | Bukan menu transaksi | — | — |

**Siap Lingo:** SF-OPT-01..06 + shared datalist/export.  
**Backlog docs:** Help Center overview · user-guide (gate: 3 layer → review/final).
