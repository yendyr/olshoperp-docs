---
doc_type: technical
menu: businessdevelopment-variable-price
menu_name: "Variable Price"
version: 1.0
last_updated: 2026-10-09
owner: QA - Yemima
status: review
related_docs:
  - ./requirement.md
  - ./knowledge-base.md
  - ../businessdevelopment-category-price/technical.md
  - ../businessdevelopment-pricelist-product/technical.md
---

# Variable Price — Technical

**Status kode:** menu **belum ada** (ETM-16312). Dokumen = kontrak TO-BE.  
**FE target:** `src/pages/BusinessDevelopment/VariablePrice/**` · router di atas `pricelist-category`  
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
| Variable Price bands | start, end, band_type (`percentage`\|`amount`), value, is_last / Unlimited |
| Pivot / link Category ↔ VP | snapshot bands + `last_snapshot_sync`; edit lokal di Category |

**Invariants**

- Header.type tunggal; server reject change type jika masih linked Category.
- Update to Category overwrite semua band snapshot category pemakai (termasuk local edits).
- Tidak menulis `margin_price` / `final_price` Pricelist.

---

## 3. API (kontrak TO-BE)

| Method | Path (usulan) | Fungsi |
|--------|---------------|--------|
| CRUD | `businessdevelopment/variable-price` | Index/store/show/update/destroy |
| POST | `…/variable-price/{id}/update-to-category` | Push snapshot ke semua category pemakai |
| POST | `…/variable-price/bulk-update-to-category` | Massal dari datalist |

Validasi band: End > Start; wajib satu Unlimited; Value boleh minus.  
Audit: create/update + setiap Update to Category (user, waktu, N category).

---

## 4. FE behavior

| Layar | Detail |
|-------|--------|
| DataList | Kolom Used in Categories + hover list; icon Update to Category disabled jika unused in selection |
| Form | Type info tooltip; lock Type + padlock jika used; section Used in Category Price; sidebar Update |
| Toast | Sukses Update — bukan halaman sukses terpisah |

---

## 5. Known debt / gap

| ID | Item |
|----|------|
| G-01 | Implementasi BE/FE belum ada |
| G-02 | Uniqueness code per company — verify di FormRequest |
| G-03 | Partial failure bulk Update — tentukan rollback vs per-category log |
| G-04 | Final §9 open decisions (weight unit convert, job queue Pricelist, dll.) |

---

## Related

[requirement.md](./requirement.md) · [Category technical](../businessdevelopment-category-price/technical.md) · [Pricelist technical](../businessdevelopment-pricelist-product/technical.md)
