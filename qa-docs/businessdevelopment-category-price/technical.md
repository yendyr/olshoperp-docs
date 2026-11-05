---
doc_type: technical
menu: businessdevelopment-category-price
menu_name: "Category Price"
version: 1.6
last_updated: 2026-11-05
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
**TO-BE Applied Store:** [ETM-16882](https://erpintegration.atlassian.net/browse/ETM-16882) — allow Active Others (+ platform); reverse partial ETM-16666 filter. Tooltip: platform + Others Active (drop "Only platform stores can be selected"). Satu store = satu category (`store()` / `update()`). Hapus (`destroy()`) menolak hanya store terikat `status = 1` — GAP-CP-07 / ETM-17053.  
**TO-BE Update to Pricelist vs Manual:** [ETM-16884](https://erpintegration.atlassian.net/browse/ETM-16884) — preserve `is_edited` + stack formula (lihat Pricelist technical).  
**TO-BE optimasi Update:** [ETM-17002](https://erpintegration.atlassian.net/browse/ETM-17002) — skip unchanged rows, category marker, chunk 500, lock. Poin 5, 7, dan Poin 8 di luar scope.

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
| POST | `…/pricelist-category/{id}/update-to-pricelist` | Recalc Pricelist category. TO-BE ETM-17002: hitung produk aktif tanpa anak; tulis per chunk 500; kunci tolak panggilan kedua pada category yang sama; lewati baris yang margin/final/`is_edited`/snapshot-nya sama |

Audit log Category: attach/remove/edit tier, Update from Master, Update to Pricelist.  
Pricelist auto weight (ETM-16668): audit di **Log Pricelist**, bukan mengganti log Category.

---

## 3. FE

| Komponen | Catatan |
|----------|---------|
| Select Variable Price | Pola `PurchaseOrder/DatalistDetail` Select Product |
| Tier accordion | Badge type; snapshot datetime; orange info jika dirty vs master |
| Update to Pricelist | Tombol merah; checkbox gate; copy dialog selaras Manual stack (ETM-16884). TO-BE ETM-17002: N = jumlah produk aktif tanpa anak; progress x dari N; checkbox “Manual margins will be preserved” tetap |
| Applied Store | Options: platform + Others Active; validate allow Others (ETM-16882). Tooltip menyebut platform dan Others Active. Store tidak eligible → "Store Field not found." Store sudah terpakai → "{nama} has already been used. A store cannot be bound to multiple category prices." |
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
| G-10 | **ETM-17053 / GAP-CP-07** — `destroy()` hanya memblokir store terikat Active; store Inactive masih bisa menghapus Category |
| G-11 | **ETM-17002** — skip write bila tidak berubah; penanda Last Update to Pricelist level category tetap maju; 1 log `update_to_pricelist` per baris yang benar-benar berubah; chunk 500; lock category |

---

## Related

[requirement.md](./requirement.md) · [Variable Price technical](../businessdevelopment-variable-price/technical.md)
