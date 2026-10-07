---
doc_type: technical
menu: businessdevelopment-pricelist-product
menu_name: "Pricelist Product"
version: 0.1
last_updated: 2026-10-07
owner: QA - Yemima
status: draft
---

# Pricelist Product — Technical

## File Map (AS-IS)

| Layer | Path |
|-------|------|
| Controller | `Modules/BusinessDevelopment/Http/Controllers/PricelistController.php` |
| Entity | `Modules/BusinessDevelopment/Entities/Pricelist.php` |
| Log | `PricelistLog` — `old_margin_price` / `new_margin_price` |
| FE | `olshoperp-frontend/src/pages/BusinessDevelopment/Pricelist/**` |
| Router | title `Pricelist Product` — path `pricelist` |
| Weight source | `product_dn_ws` / Product DnW `is_primary` |

## AS-IS calc hint

`Product::updated` saat `price` dirty: match `PricelistCategoryMarginPrice` bands; percentage vs amount — path terbatas `originalPrice == 0`.

## TO-BE (ETM-16314)

- Recalc service: iterate Category attached Variable Price snapshots; SUM contributions.
- Persist optional breakdown for hover; `is_manual_override` flag.
- Datalist column weight after SKU; warning UI.
- Bulk Update from Category: overwrite + audit actor.

## Invariants

- Manual edit Pricelist does not mutate Category / Variable Price.
- Category Update to Pricelist clears override flag after successful apply.
