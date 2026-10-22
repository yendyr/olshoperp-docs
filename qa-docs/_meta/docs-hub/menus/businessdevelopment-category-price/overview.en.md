---
doc_type: docs-hub-menu-overview
menu_slug: businessdevelopment-category-price
menu_name: Category Price
lang: en
version: 1.1
last_updated: 2026-10-22
status: draft
audience: help-center
source_type: derived
source_ref: null
notes: Help Center landing. Derived from QA docs multi-tier Variable Price · ETM-16668 weight sync.
---

## Module/Feature: Category Price

**Business definition.** Category Price groups stores/channels and holds **Variable Price tiers** (snapshots). Edit bands locally if needed, refresh from master with **Update from Master**, then push sell prices with **Update to Pricelist**. **TO-BE:** by-Weight values can also auto-update when **default** DnW weight changes on System Product (manual Category inputs are not overwritten).

## Key terms

* **Tier:** One attached Variable Price (Amount and/or Weight masters can coexist).
* **Update from Master:** Replace all tier snapshots from current masters (local edits lost).
* **Update to Pricelist:** Recalculate margin/final price for all Pricelist rows in this category (manual overrides overwritten after confirm).
* **Auto weight (TO-BE):** sync from System Product DnW default — distinct from bulk Update to Pricelist.

## When to use

* Binding Variable Price rules to a pricing category / store group.
* Publishing margin changes to Pricelist after reviewing tiers.

## Navigation

* **App:** Business Development → Price → Category Price  
* **Route:** `/businessdevelopment/pricelist-category`  
* **Docs Hub:** `/docs/businessdevelopment/businessdevelopment-category-price`

## Related menus

* [Variable Price](/docs/businessdevelopment/businessdevelopment-variable-price)  
* [Pricelist Product](/docs/businessdevelopment/businessdevelopment-pricelist-product)
