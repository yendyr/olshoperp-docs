---
doc_type: technical
menu: businessdevelopment-variable-price
menu_name: "Variable Price"
version: 1.2
last_updated: 2026-10-28
owner: QA - Yemima
status: review
related_docs:
  - ./requirement.md
  - ./knowledge-base.md
  - ../businessdevelopment-category-price/technical.md
  - ../businessdevelopment-pricelist-product/technical.md
---

# Variable Price — Technical

**Status kode:** FE skeleton ada (`VariablePrice/DataList.vue`, `Form.vue`); ETM-16312 **RE-OPEN** — behavior & validasi masih gap vs requirement (lihat Error ETM-16566/16567/16568 + Improvement ETM-16569).  
**FE:** `src/pages/BusinessDevelopment/VariablePrice/**` · router di atas `pricelist-category`  
**Wireframe:** https://claude.ai/artifact/CSgXVMhzsztTJqwpeD7f89

---

## 1. Referensi AS-IS (reuse pola)

| Item | Path |
|------|------|
| Category margin bands UI | `olshoperp-frontend/src/pages/BusinessDevelopment/PricelistCategory/Form.vue` |
| Category margin table | `bd_pricelist_category_margin_prices` · `PricelistCategoryMarginPrice` |
| Match on product price | `Modules/SupplyChain/Entities/Product.php` (trigger harga dari 0) |
| Select Product pattern | `SCM/PurchaseOrder/DatalistDetail.vue` (pola Select Variable Price di Category) |
| Weight primary | Product Dimension & Weight `is_primary` |

---

## 2. TO-BE model (usulan)

| Entitas | Catatan |
|---------|---------|
| Variable Price header | code, name, type (`by_amount`\|`by_weight`), active, description, company |
| Variable Price bands | start, end, band_type (`percentage`\|`amount`), value, **`max_value` (nullable)**, is_last / Unlimited |
| Pivot / link Category ↔ VP | snapshot bands (incl. max_value) + `last_snapshot_sync`; edit lokal di Category |

**Invariants**

- Header.type tunggal; server reject change type jika masih linked Category.
- Update to Category overwrite semua band snapshot category pemakai (termasuk local edits).
- Tidak menulis `margin_price` / `final_price` Pricelist.
- **`max_value`:** hanya meaningful jika `band_type = percentage`; Amount → persist NULL; NULL = no cap ([ETM-16835](https://erpintegration.atlassian.net/browse/ETM-16835)).

---

## 3. API (kontrak TO-BE)

| Method | Path (usulan) | Fungsi |
|--------|---------------|--------|
| CRUD | `businessdevelopment/variable-price` | Index/store/show/update/destroy |
| POST | `…/variable-price/{id}/update-to-category` | Push snapshot ke semua category pemakai |
| POST | `…/variable-price/bulk-update-to-category` | Massal dari datalist |

Validasi band: End > Start; wajib satu Unlimited; Value boleh minus.  
**Percentage Value:** `-9999 <= value <= 9999` (UI + FormRequest/API); Amount tidak kena rule ini ([ETM-16569](https://erpintegration.atlassian.net/browse/ETM-16569)).  
**Percentage desimal:** parse pemisah desimal benar; truncate **4 dp** (bukan round-half-up) ([ETM-16562](https://erpintegration.atlassian.net/browse/ETM-16562)).  
**Max Value (ETM-16835):** nullable; if set → `abs(max_value) > 0`; if percentage ≥ 0 reject negative max; if percentage < 0 normalize max to negative on save; Amount → force null. Calc: `raw = default * pct/100`; if max set → `pct>0 ? min(raw,max) : max(raw,max)`.  
Type change (unused only): confirm → clear bands; reject type change if linked Category.  
Audit: create/update + setiap Update to Category (user, waktu, N category).  
**Audit Log tier:** Start `0`, End `Unlimited`, Margin `0` harus tercatat sebagai nilai (bukan `-`); Old Value lengkap saat shift baris; UI slideover ([ETM-16565](https://erpintegration.atlassian.net/browse/ETM-16565)).

---

## 4. FE behavior

| Layar | Detail |
|-------|--------|
| DataList | Kolom Used in Categories + hover list; icon Update to Category **disabled** jika ada unused in selection (ETM-16567) |
| Form | Type info/lock tooltip **harus** appear on hover (ETM-16566); lock Type + padlock jika used; section Used in Category Price; sidebar Update disabled jika unused |
| Type switch | Dialog confirm + clear bands (ETM-16568) |
| Max Value | Enable iff band Type Percentage; Amount → disable+clear; tooltip EN + contoh (ETM-16835) |
| Toast | Sukses Update — bukan halaman sukses terpisah |

---

## 5. Known debt / gap

| ID | Item |
|----|------|
| G-01 | RE-OPEN ETM-16312 — Error 16566/16567/16568/16562/16565 + Improvement 16569 |
| G-02 | Uniqueness code per company — verify di FormRequest |
| G-03 | Partial failure bulk Update — tentukan rollback vs per-category log |
| G-04 | Final §9 open decisions (weight unit convert, job queue Pricelist, dll.) |
| G-05 | Mirror validasi Percentage ±9999 (+ 4dp) ke band lokal Category Price |
| G-06 | **ETM-16835** Max Value column + calc + snapshot Category/Pricelist |

---

## Related

[requirement.md](./requirement.md) · [Category technical](../businessdevelopment-category-price/technical.md) · [Pricelist technical](../businessdevelopment-pricelist-product/technical.md)
