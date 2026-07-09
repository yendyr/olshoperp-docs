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

Menu baru: copy struktur file ini, isi dari `qa-docs/{menu}/technical.md` + Vue source.
