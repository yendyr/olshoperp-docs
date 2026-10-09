---
doc_type: technical
menu: businessdevelopment-pricelist-product
menu_name: "Pricelist Product"
version: 1.0
last_updated: 2026-10-09
owner: QA - Yemima
status: review
related_docs:
  - ./requirement.md
  - ../businessdevelopment-category-price/technical.md
---

# Pricelist Product — Technical

**FE AS-IS:** `src/pages/BusinessDevelopment/Pricelist/**`  
**BE AS-IS:** `PricelistController` · `Pricelist` · match bands di `Product.php` (saat price dari 0)  
**TO-BE:** multi-tier SUM + weight column + breakdown tooltip + override flag (ETM-16314).

---

## 1. Fields (AS-IS + TO-BE)

| Field | Catatan |
|-------|---------|
| `margin_price` / `final_price` | AS-IS; TO-BE diisi SUM tier |
| Weight display | Dari primary DnW (bukan kolom pricelist wajib) |
| Override flag + editor meta | TO-BE: user/time; clear on Update to Pricelist |
| Log | old_margin → new_margin; Update from category id |

---

## 2. Kalkulasi TO-BE

Untuk tiap tier snapshot di Category:

1. Pilih nilai match: default price (by Amount) atau primary weight gram (by Weight).
2. Match band inklusif / Unlimited; else 0.
3. Percentage → `value% × default_price`; Amount → value (boleh minus).
4. Weight null/0 → skip Weight tiers.
5. `margin = sum`; `final = default + margin`.

Triggered **hanya** oleh Update to Pricelist (user), bukan auto dari master/category/weight change (fase trial).

---

## 3. API / FE

| Area | TO-BE |
|------|-------|
| Update | Dipanggil dari Category `update-to-pricelist` (job jika N besar — GAP) |
| Inline edit margin | PATCH row; set override meta; recalc final |
| Tooltip | Payload breakdown per tier + ranges (server atau FE dari snapshot) |

---

## 4. Debt / gap

| ID | Item |
|----|------|
| G-01 | AS-IS hanya recalc saat price was 0 — dokumentasikan + jangan auto multi-tier sampai Update |
| G-02 | Unit conversion weight → gram |
| G-03 | Background job untuk Update massal |
| G-04 | Persist breakdown untuk tooltip vs compute on hover |

---

## Related

[requirement.md](./requirement.md) · [Category technical](../businessdevelopment-category-price/technical.md)
