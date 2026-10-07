---
doc_type: technical
menu: businessdevelopment-variable-price
menu_name: "Variable Price"
version: 0.1
last_updated: 2026-10-07
owner: QA - Yemima
status: draft
---

# Variable Price — Technical

## Status

Menu **belum ada di codebase** (ETM-16312). Seed path & AS-IS terkait: SoT §13.

## Referensi AS-IS terkait

| Item | Path |
|------|------|
| Category margin table | `bd_pricelist_category_margin_prices` |
| Category form bands | `olshoperp-frontend/src/pages/BusinessDevelopment/PricelistCategory/Form.vue` |
| Match bands on product price | `Modules/SupplyChain/Entities/Product.php` |

## TO-BE

- New entities/migrations/controllers under `Modules/BusinessDevelopment` for Variable Price + band details.
- FE pages + router entry **above** `pricelist-category`.
- Action Update to Category → overwrite category snapshots + audit.
