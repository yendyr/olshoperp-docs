---
doc_type: technical
menu: businessdevelopment-category-price
menu_name: "Category Price"
version: 0.1
last_updated: 2026-10-07
owner: QA - Yemima
status: draft
---

# Category Price — Technical

## File Map (AS-IS)

| Layer | Path |
|-------|------|
| BE controller | `Modules/BusinessDevelopment/Http/Controllers/PricelistCategoryController.php` |
| Entity | `Modules/BusinessDevelopment/Entities/PricelistCategory.php` |
| Margin entity | `Modules/BusinessDevelopment/Entities/PricelistCategoryMarginPrice.php` |
| Table | `bd_pricelist_category_margin_prices` |
| FE form | `olshoperp-frontend/src/pages/BusinessDevelopment/PricelistCategory/Form.vue` |
| FE list | `.../PricelistCategory/DataList.vue` |
| Router title | `Category Price` — path `pricelist-category` |

## TO-BE (ETM-16313)

- Pivot/link Category ↔ Variable Price + snapshot band rows (replace or shadow `bd_pricelist_category_margin_prices`).
- Endpoints: attach/detach, Update from Master (bulk/row), Update to Pricelist.
- Audit log Category: actor, source Variable Price id(s), timestamp.

## Invariants

- Edit band di Category tidak menulis master Variable Price.
- Update from Master overwrite snapshot termasuk local edits setelah konfirmasi.

## Known Issues / Gaps

- Lihat GAP-CP-* di requirement.
- Product observer kalkulasi margin AS-IS hanya path limited (`originalPrice == 0`) — TO-BE Update to Pricelist harus jadi jalur utama apply multi tier.
