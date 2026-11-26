---
doc_type: docs-hub-menu-overview
menu_slug: businessdevelopment-variable-price
menu_name: Variable Price
lang: en
version: 1.0
last_updated: 2026-10-15
status: draft
audience: help-center
source_type: derived
source_ref: null
notes: Help Center landing. Derived from QA docs v1.1 (ETM-16312 / ETM-16569).
---

## Module/Feature: Variable Price

**Business definition.** Variable Price is a reusable **margin band master**. Each master uses one type only: **by Amount** (SKU default price) or **by Weight** (primary weight in grams). Attach several masters in Category Price to build multi-tier margins. Sell prices on Pricelist Product change only after Category runs **Update to Pricelist**.

## Key terms

* **Band:** One Start–End row with Type (Percentage / Amount) and Value.
* **Unlimited:** Last row — matches from its Start upward.
* **Snapshot:** Copy of bands stored on Category Price; does not auto-follow master edits.
* **Update to Category:** Overwrites snapshots on every Category that uses this master (including local edits). Pricelist does **not** change.

## When to use

* You need the same margin rules on many Category Prices.
* You need margin by weight as well as by default price (create two masters and attach both).

## When to avoid

* Mixing Amount and Weight in one master — create separate masters.
* Expecting Pricelist to refresh after Update to Category — finish with Update to Pricelist on Category.

## Navigation

* **App:** Business Development → Price → Variable Price  
* **Route:** `/businessdevelopment/variable-price`  
* **Docs Hub:** `/docs/businessdevelopment/businessdevelopment-variable-price`

## Important rules (summary)

* Percentage Value must stay within **-9.999 … 9.999**; Amount is not limited by this rule.
* Percentage decimals are truncated to **4** places.
* Type can change only while unused (confirm + clear bands); locked after Category attach.
* Update to Category stays disabled until the master is used by at least one Category.

## Related menus

* [Category Price](/docs/businessdevelopment/businessdevelopment-category-price) — attach tiers, Update to Pricelist  
* [Pricelist Product](/docs/businessdevelopment/businessdevelopment-pricelist-product) — sell price / margin result
