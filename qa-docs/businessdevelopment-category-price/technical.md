---
doc_type: technical
menu: businessdevelopment-category-price
menu_name: "Category Price"
version: 1.4
last_updated: 2026-10-28
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
**TO-BE weight sync:** [ETM-16668](https://erpintegration.atlassian.net/browse/ETM-16668) — consumer dari System Product DnW default change (bukan endpoint Category baru).  
**TO-BE Max Value:** [ETM-16835](https://erpintegration.atlassian.net/browse/ETM-16835) — snapshot `max_value` dari Variable Price; mirror enable/disable + calc ke Pricelist.  
**TO-BE Applied Store:** [ETM-16882](https://erpintegration.atlassian.net/browse/ETM-16882) — allow Active Others (+ platform); reverse partial ETM-16666 filter.  
**TO-BE Update to Pricelist vs Manual:** [ETM-16884](https://erpintegration.atlassian.net/browse/ETM-16884) — preserve `is_edited` + stack formula (lihat Pricelist technical).

---

## 1. AS-IS vs TO-BE

| Area | AS-IS | TO-BE |
|------|-------|-------|
| Margin UI | Satu set band di Form | Accordion tiers + Select Variable Price |
| Storage | `bd_pricelist_category_margin_prices` per category | Per-tier snapshot (+ pivot ke Variable Price id) |
| Update | N/A | Update from Master · Update to Pricelist |
| Weight sync | N/A | Auto dari DnW default (ETM-16668); skip manual category values |

Basic Information & DataList: tetap, kecuali **Applied Store** opsi store (ETM-16882). Flag helper “contains platform” untuk Sync Pricelist.

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
Pricelist auto weight (ETM-16668): audit di **Log Pricelist**, bukan mengganti log Category.

---

## 3. FE

| Komponen | Catatan |
|----------|---------|
| Select Variable Price | Pola `PurchaseOrder/DatalistDetail` Select Product |
| Tier accordion | Badge type; snapshot datetime; orange info jika dirty vs master |
| Update to Pricelist | Tombol merah; checkbox gate; copy dialog selaras Manual stack (ETM-16884) |
| Applied Store | Options: platform + Others Active; validate allow Others (ETM-16882) |
| Band lokal Percentage | Validasi Value `-9999…9999` + truncate 4dp (mirror Variable Price / ETM-16569, 16562); **Max Value** enable + rules ETM-16835 |

---

## 4. Debt / gap

| ID | Item |
|----|------|
| G-01 | Pivot + snapshot schema belum ada |
| G-02 | Migrasi/bersih data band AS-IS |
| G-03 | Mass Update from Master datalist (opsional) |
| G-04 | Dirty detection tier vs master untuk icon oranye |
| G-05 | Share FormRequest/helper validasi Percentage dengan Variable Price |
| G-06 | **ETM-16668** — preserve manual category values saat weight sync |
| G-07 | **ETM-16835** — persist/edit Max Value on tier bands + pass to Pricelist calc |
| G-08 | **ETM-16882** — reopen Applied Store Others Active (FE list + BE validation) |
| G-09 | **ETM-16884** — UpdateToPricelistJob preserve manual + dialog copy |

---

## Related

[requirement.md](./requirement.md) · [Variable Price technical](../businessdevelopment-variable-price/technical.md)
