# POM Element Registry

Kamus selector Playwright per menu OlshopERP. **Dibuat dari source Vue**, bukan dari POM generator.

## Cara pakai (QA)

1. Cari file menu: `{menu-slug}.yaml`
2. Lihat `elements` — setiap field punya `strategy` + nilai stabil
3. Di spec Playwright, panggil method di `pom_helper` — jangan duplikasi selector

## Strategy yang dipakai

| Strategy | Contoh | Stabilitas |
|----------|--------|------------|
| `id` | `#sku`, `#updateButton` | Tinggi |
| `aria-placeholder` | Choose Supplier | Tinggi (multiselect) |
| `placeholder` | e.g: SHPRC | Sedang |
| `role` + `name` | link Create, button Save All | Sedang — perhatikan link vs button |
| `aria-placeholder-fragment` | Flavour | Untuk placeholder variatif |

## Menu terdaftar

| File | Menu | Status |
|------|------|--------|
| `system-product.yaml` | System Product | Full POM + TC |
| `purchase-requisition.yaml` | Purchase Requisition | Full POM + TC |
| `pricelist-category.yaml` | Category Price | Full POM + TC |
| `purchase-order.yaml` | Purchase Order | Smoke + form dasar |
| `stock-opname.yaml` | Stock Opname | Full POM + TC |
| `adjustment-addition.yaml` | Stock Addition | Full POM + TC |
| `adjustment-deduction.yaml` | Stock Deduction | Full POM + TC |
| `assembly.yaml` | Assembly (Work Order) | Full POM + TC |
| `location.yaml` | Processing Location | Full POM + TC |
| `bundle-stock-report.yaml` | Bundle Stock Report | Full POM + TC (VIEW+FILTER) |
| `cancelled-order.yaml` | Cancelled Order | Full POM + TC (VIEW+SEARCH) |
| `inventory-detail.yaml` | Inventory Detail | Full POM + TC (VIEW+FILTER) |
| `manual-picking-list.yaml` | Manual Picking List | Full POM + TC |
| `master-brand.yaml` | Master Brand | Full POM + TC |
| `mutation-inbound.yaml` | Purchase Inbound | Full POM + TC |
| `mutation-outbound.yaml` | Outbound External | Full POM + TC |
| `mutation-transfer-internal.yaml` | Transfer Internal | Full POM + TC |
| `mutation-transfer-external.yaml` | External Transfer | Full POM + TC |
| `mutation-transfer-scrap.yaml` | Transfer Broken (Scrap) | Full POM + TC |
| `mutation-transfer-void.yaml` | Transfer Void | Full POM + TC |
| `other-inbound.yaml` | Other Inbound | Full POM + TC |
| `product-ending-stock.yaml` | Product Ending Stock | Full POM + TC (VIEW+FILTER) |
| `product-mutation.yaml` | Product Mutation History | Full POM + TC (VIEW+FILTER) |
| `product-mutation-stock.yaml` | Stock History | Full POM + TC (VIEW+FILTER) |
| `product-transaction-history.yaml` | Product Transaction History | Full POM + TC (VIEW+FILTER) |
| `qc-procedure.yaml` | QC Procedure | Full POM + TC |
| `real-stock.yaml` | Real Time Stock | Full POM + TC (VIEW+FILTER) |
| `sales-returns.yaml` | Sales Return (SCM) | Full POM + TC |
| `warranty.yaml` | Warranty | Full POM + TC |
| `variant.yaml` | Variant | Full POM + TC |

Menu baru: copy struktur file ini, isi dari `qa-docs/{menu}/technical.md` + Vue source.
