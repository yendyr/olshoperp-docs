---
doc_type: technical
menu: businessdevelopment-pricelist-product
menu_name: "Pricelist Product"
version: 1.3
last_updated: 2026-10-28
owner: QA - Yemima
status: review
related_docs:
  - ./requirement.md
  - ../businessdevelopment-category-price/technical.md
---

# Pricelist Product — Technical

**FE AS-IS:** `src/pages/BusinessDevelopment/Pricelist/**` (`PricelistCategoryPriceInput`, `PricelistInput`, `DataList`)  
**BE AS-IS:** `PricelistController` · `Pricelist` · `UpdateToPricelistJob` · match bands di `Product.php`  
**TO-BE:** multi-tier SUM + weight + breakdown + override (ETM-16314).  
**TO-BE weight sync:** [ETM-16668](https://erpintegration.atlassian.net/browse/ETM-16668).  
**TO-BE filter:** [ETM-16861](https://erpintegration.atlassian.net/browse/ETM-16861).  
**TO-BE calc Max Value:** [ETM-16835](https://erpintegration.atlassian.net/browse/ETM-16835).  
**TO-BE UI margin/tooltips:** [ETM-16883](https://erpintegration.atlassian.net/browse/ETM-16883).  
**TO-BE Sync + Manual stack on Update:** [ETM-16884](https://erpintegration.atlassian.net/browse/ETM-16884) · Applied Store Others Category: [ETM-16882](https://erpintegration.atlassian.net/browse/ETM-16882).

---

## 1. Fields (AS-IS + TO-BE)

| Field | Catatan |
|-------|---------|
| `margin_price` / `final_price` | AS-IS; TO-BE diisi per formula §2 |
| `is_edited` | Manual Price flag; UI orange + cell angka User Set Margin |
| Weight display | Primary DnW (bukan kolom DB pricelist wajib) |
| Log | old/new margin & final; Update from category id |
| Category contains platform | TO-BE: drive Sync UI (bukan hanya `stores_count` produk) |
| Last Update to Pricelist | TO-BE: waktu sukses terakhir per category → header tooltip |

**UI display (ETM-16883):** jika `!is_edited` → render User Set Margin sebagai `-` (nilai calc tetap di breakdown tooltip / dipakai Final).

---

## 2. Kalkulasi TO-BE

Untuk tiap tier snapshot di Category:

1. Match: default price (Amount) atau primary weight gram (Weight).
2. Match band inklusif / Unlimited; else 0.
3. Percentage → `raw = value% × default_price`; if `max_value` → cap; Amount → value.
4. Weight null/0 → skip Weight tiers.
5. `category_tier_margin = sum`.

| `is_edited` | Final | Persist margin_price |
|-------------|-------|----------------------|
| `0` | `default + category_tier_margin` | boleh simpan calc di DB; **FE tampil `-`** |
| `1` | `default + user_set_margin + category_tier_margin` | **pertahankan** user margin; jangan set `is_edited=0` pada Update to Pricelist |

**AS-IS gap:** `UpdateToPricelistJob` menimpa margin + `is_edited=0` — harus diubah per ETM-16884.

**Reset Manual Price:** clear/empty margin input → `is_edited=0`; Final = category-only path.

**ETM-16668:** auto saat DnW **default** berubah; skip overwrite Manual Price; wajib Log Pricelist.

---

## 3. API / FE

| Area | TO-BE |
|------|-------|
| Update to Pricelist | Category job; branch on `is_edited` (stack vs full calc) |
| Inline edit | PATCH; set `is_edited`; hover tip Final vs User Set Margin berbeda |
| Tooltip cell | Breakdown: Default / User Set Margin (manual) / Category tier / Final / Last Update to Pricelist |
| Tooltip header category | Tier summary + `Last Update to Pricelist: …` |
| Sync visibility | `category.has_platform_store` (Applied Store contains platform); Sync All filter sama |
| Sync action | Existing binding / platform product checks |
| Weight sync (16668) | After DnW default change → recalc calculated rows + log |
| Filter Manual Margin (16861) | `is_edited` any category; Yes/No dropdown |

---

## 4. Debt / gap

| ID | Item |
|----|------|
| G-01 | AS-IS recalc saat price was 0 — jangan auto multi-tier sampai Update |
| G-02 | Unit conversion weight → gram |
| G-03 | Background job Update massal |
| G-04 | Persist breakdown vs compute on hover |
| G-05 | ETM-16668 auto-recalc DnW default |
| G-06 | ETM-16861 filter Manual Margin |
| G-07 | ETM-16835 max_value in contribution |
| G-08 | ETM-16883 FE `-` / tooltips / header Last Update to Pricelist |
| G-09 | ETM-16884 UpdateToPricelistJob preserve `is_edited` + stack formula; Sync by platform flag |
| G-10 | Future: Others pricelist → SO Unit Price by store header |

---

## Related

[requirement.md](./requirement.md) · [Category technical](../businessdevelopment-category-price/technical.md)
