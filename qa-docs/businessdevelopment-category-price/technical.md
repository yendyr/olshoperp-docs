---
doc_type: technical
menu: businessdevelopment-category-price
menu_name: "Category Price"
version: 1.0
last_updated: 2026-10-09
owner: QA - Yemima
status: review
related_docs:
  - ./requirement.md
  - ../businessdevelopment-variable-price/technical.md
  - ../businessdevelopment-pricelist-product/technical.md
---

# Category Price — Technical

**FE AS-IS:** `src/pages/BusinessDevelopment/PricelistCategory/**`  
**BE AS-IS:** `PricelistCategoryController` · `PricelistCategory` · `PricelistCategoryMarginPrice` (`bd_pricelist_category_margin_prices`)  
**TO-BE:** ganti section margin tunggal → multi tier snapshot dari Variable Price (ETM-16313).

---

## 1. AS-IS vs TO-BE

| Area | AS-IS | TO-BE |
|------|-------|-------|
| Margin UI | Satu set band di Form | Accordion tiers + Select Variable Price |
| Storage | `bd_pricelist_category_margin_prices` per category | Per-tier snapshot (+ pivot ke Variable Price id) |
| Update | N/A | Update from Master · Update to Pricelist |

Basic Information & DataList Category: **tidak berubah**.

---

## 2. API (kontrak TO-BE)

| Method | Path (usulan) | Fungsi |
|--------|---------------|--------|
| POST | `…/pricelist-category/{id}/attach-variable-price` | Attach + copy bands snapshot |
| DELETE | `…/pricelist-category/{id}/tiers/{tierId}` | Remove tier |
| PATCH | `…/tiers/{tierId}/bands` | Edit lokal band |
| POST | `…/pricelist-category/{id}/update-from-master` | Overwrite semua tier dari master |
| POST | `…/pricelist-category/{id}/update-to-pricelist` | Recalc semua Pricelist rows category |

Audit log Category: attach/remove/edit tier, Update from Master, Update to Pricelist.

---

## 3. FE

| Komponen | Catatan |
|----------|---------|
| Select Variable Price | Pola `PurchaseOrder/DatalistDetail` Select Product |
| Tier accordion | Badge type; snapshot datetime; orange info jika dirty vs master |
| Update to Pricelist | Tombol merah; checkbox gate sebelum enable |

---

## 4. Debt / gap

| ID | Item |
|----|------|
| G-01 | Pivot + snapshot schema belum ada |
| G-02 | Migrasi/bersih data band AS-IS |
| G-03 | Mass Update from Master datalist (opsional) |
| G-04 | Dirty detection tier vs master untuk icon oranye |

---

## Related

[requirement.md](./requirement.md) · [Variable Price technical](../businessdevelopment-variable-price/technical.md)
