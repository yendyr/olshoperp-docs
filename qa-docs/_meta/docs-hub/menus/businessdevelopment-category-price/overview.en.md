---
doc_type: docs-hub-menu-overview
menu_slug: businessdevelopment-category-price
menu_name: Category Price
lang: en
version: 1.4
last_updated: 2026-10-28
status: review
audience: help-center
source_type: derived
source_ref: null
notes: Help Center landing. Derived QA docs · ETM-16668 · 16835 · 16882 · 16884.
---

## Module/Feature: Category Price

**Business definition.** Category Price groups stores/channels and holds **Variable Price tiers** (snapshots). **Applied Store** may include platform stores and Active **Others** (nullable / mix allowed). Edit bands locally, refresh with **Update from Master**, then publish with **Update to Pricelist** — manual margins on Pricelist are **kept**; Final may change because category tier is stacked on the user margin.

## Key terms

* **Tier:** One attached Variable Price (Amount and/or Weight).
* **Update from Master:** Replace all tier snapshots from current masters.
* **Update to Pricelist:** Recalculate Final on Pricelist; Manual Price preserved (stacked with tier).
* **Applied Store Others:** Non-platform Active stores may be selected (ETM-16882).

## When to use

* Binding Variable Price rules to a pricing category / store group (including Others).
* Publishing changes to Pricelist after reviewing tiers.

## Navigation

* **App:** Business Development → Price → Category Price  
* **Route:** `/businessdevelopment/pricelist-category`  
* **Docs Hub:** `/docs/businessdevelopment/businessdevelopment-category-price`

## Related menus

* [Variable Price](/docs/businessdevelopment/businessdevelopment-variable-price)  
* [Pricelist Product](/docs/businessdevelopment/businessdevelopment-pricelist-product)
