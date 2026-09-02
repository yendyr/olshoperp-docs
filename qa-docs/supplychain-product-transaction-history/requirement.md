---
doc_type: requirement
menu: supplychain-product-transaction-history
menu_name: "Product Transaction History"
version: 1.1
last_updated: 2026-09-02
owner: QA - Yemima
status: draft
---

# Product Transaction History — Requirement Documentation

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final. Update v1.1 menambahkan kebijakan supplier display code-only (CR).

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS) |
| 1.1 | 2026-09-02 | QA - Yemima | Supplier display **code-only** (UI/export; print name exception bila ada) — CR ETM-15721 / wiring ETM-15723 |

## 1. Ringkasan Eksekutif

UI route `product-transaction-history` memanggil API `ItemTransactionHistoryController` (`item-transaction-history`). Helper `ScmReport` mengagregasi metrik PR/PO/inbound/outbound. FE: `ProductTransactionHistory/DataList.vue` dengan sub-komponen chart dan tab.

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | Dashboard KPI load | `GET item-transaction-history/data` | Summary cards |
| A-02 | Require product_id for metrics | Conditional in data_report | Filter |
| A-03 | Date range default | start null→0, end null→now | Period |
| A-04 | Approve filter | `approve_status` 0=all, 1=approved | Filter |
| A-05 | PR detail tab | `report-pr` | PurchaseRequisition.vue |
| A-06 | PO detail tab | `report-po` | PurchaseOrder.vue |
| A-07 | Mutation tab | `report-mutation` | Mutation.vue |
| A-08 | Outbound chart | `report-mutation-outbound` | LineChartOutbound |
| A-09 | Export Excel async | `export-excel` + progress | Export |
| A-10 | Select2 product | `select2-product` | Product picker |

## Supplier display (code-only)

**Policy (CR parent [ETM-15721](https://erpintegration.atlassian.net/browse/ETM-15721), Request ID `recvtQRSDX5SOI`; menu wiring [ETM-15723](https://erpintegration.atlassian.net/browse/ETM-15723)).** Berlaku **semua role** — tidak ada privilege untuk melihat **nama** supplier di layar atau export.

Berlaku untuk setiap surface di menu ini yang menampilkan supplier (termasuk tab PO / mutation / price history bila ada kolom supplier, ColVis, dan export).

| Surface | Behavior (TO-BE / production dengan CR) |
|---------|----------------------------------------|
| Datalist / tab grids / charts labels (jika ada supplier) | Tampil **Supplier Code only** |
| Column Show/Hide | **Tidak** menawarkan kolom Supplier Name |
| Select2 / search (supplier, jika dipakai) | Match by **code + name**; option & selected label = **code only**; **tanpa** hover/tooltip nama |
| Export Excel (semua role) | **Omit** supplier name |
| Print | **Pengecualian:** supplier **name masih boleh** (jika menu punya print; bila tidak ada print → N/A) |
| Basic Information / filter panel | **Jangan** menambah field read-only Supplier Name |

**Acceptance**

- [ ] UI tidak menampilkan supplier name di grid/tab/ColVis
- [ ] Cari by name (jika ada) tetap menemukan; label = code only; tanpa tooltip nama
- [ ] Export tanpa nama supplier (semua role)
- [ ] Print (jika ada) boleh tetap menampilkan nama

## 3. Metrik KPI (AS-IS dari ScmReport)

| Metrik | Sumber |
|--------|--------|
| PR transaction total | `getPrTransactionTotal` |
| Total requested qty | `getTotalRequestedQuantity` |
| Avg requested qty | total / pr_transaction_total |
| Avg daily requested | total / day_in_period |
| PO transaction total | `getPoTransactionTotal` |
| Inbound to PO % | inbound_qty / po_ordered_qty × 100 |
| Avg lead time | `getAvgLeadTime` |
| PO min/max/avg price | `getPoMinMaxPrice` |
| Outbound metrics | ScmReport outbound helpers |

## 4. Validasi & Rules

| ID | Rule | Trigger | Pesan |
|----|------|---------|-------|
| V-01 | Policy viewAny ItemTransactionHistory | select2, export | 403 |
| V-02 | Division by zero guarded | KPI calculations | Return 0 or N/A |

## 5. Diagram Alur

```mermaid
flowchart TB
    UI["Product Transaction History DataList"] --> DATA["GET item-transaction-history/data"]
  UI --> PR["GET report-pr"]
  UI --> PO["GET report-po"]
  UI --> MUT["GET report-mutation"]
  UI --> OUT["GET report-mutation-outbound"]
  DATA --> SR["ScmReport helper"]
  SR --> PRD[("scm_purchase_requisition_details")]
  SR --> POD[("scm_purchase_order_details")]
  SR --> IMD[("scm_inbound_mutation_details")]
  SR --> OMD[("scm_outbound_mutation_details")]
```

## 6. QA Test Notes

- Pilih produk dengan PR+PO+inbound+outbound di staging
- Toggle Approved Only → count harus ≤ All
- Verifikasi chart date array match periode
- Export + cek `export-excel-progress`
- Supplier columns (jika ada): **code only** di UI/export; print name exception bila ada print

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
