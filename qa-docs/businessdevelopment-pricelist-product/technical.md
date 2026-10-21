---
doc_type: technical
menu: businessdevelopment-pricelist-product
menu_name: "Pricelist Product"
version: 1.1
last_updated: 2026-10-21
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
**TO-BE weight sync:** [ETM-16668](https://erpintegration.atlassian.net/browse/ETM-16668) — auto-recalc on System Product DnW default change + Pricelist log.

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

**AS-IS trigger:** Update to Pricelist (user) saja — bukan auto dari master/category/weight (fase trial).

**TO-BE ETM-16668:** juga auto saat System Product DnW **default** berubah (edit default row atau ganti radio default). Pakai tier Category terkini; **skip** rows dengan override manual; **wajib** tulis Log Pricelist. Hook: `ProductDnWController` (save / set default) → recalc service shared dengan Update to Pricelist path (weight-only / calculated rows).

---

## 3. API / FE

| Area | TO-BE |
|------|-------|
| Update | Dipanggil dari Category `update-to-pricelist` (job jika N besar — GAP) |
| Inline edit margin | PATCH row; set override meta; recalc final |
| Tooltip | Payload breakdown per tier + ranges (server atau FE dari snapshot) |
| Weight sync (ETM-16668) | After DnW default change on product → recalc calculated Category Price cells + audit log |

---

## 4. Debt / gap

| ID | Item |
|----|------|
| G-01 | AS-IS hanya recalc saat price was 0 — dokumentasikan + jangan auto multi-tier sampai Update |
| G-02 | Unit conversion weight → gram |
| G-03 | Background job untuk Update massal |
| G-04 | Persist breakdown untuk tooltip vs compute on hover |
| G-05 | **ETM-16668** auto-recalc dari DnW default + log + preserve manual |

---

## Related

[requirement.md](./requirement.md) · [Category technical](../businessdevelopment-category-price/technical.md)
