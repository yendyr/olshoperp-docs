# System Product — Dokumentasi

Menu **System Product** (SCM) — master data SKU, variant, bundle, D&W per unit, inventori, pajak.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Feature Map | [feature-map.md](./feature-map.md) | Semua | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | End-user | review |
| Capability cards | [capabilities/](./capabilities/) | Semua | draft |

**Help Center:** [`_meta/docs-hub/menus/system-product/`](../_meta/docs-hub/menus/system-product/)  
**3 layer:** v2.2 · **User Guide:** v1.1 (`source_version` 2.2) · **Feature Map:** v1.0  
**Maintenance owner:** QA — Yemima

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-11 | 2.2 | **Import Product Images** (GDrive public URL → replace primary; max 1000; partial success) · GAP-SP-16 |
| 2026-07-29 | 2.1b | Feature Map + 6 Lingo cards; user-guide v1.0; Help Center overview en/id |
| 2026-07-05 | 2.1 | Bundle proporsi Price Before VAT (§11), parent tax hide, GAP-SP-12 resolved |
| 2026-07-05 | 2.0 | Full rewrite: codebase AS-IS, D&W per unit (artifact 7 Mei 2026), bundle/random/import, gaps §19–§21 |
| 2026-06-23 | 1.0 | Initial KB draft |
| 2026-01-26 | 1.0 | Initial requirement from legacy |

---

## Route & code

| Item | Path |
|------|------|
| UI (full) | `/supplychain/product` |
| UI (general) | `/supplychain/product-general-configuration` |
| UI (inventory) | `/supplychain/product-inventory-configuration` |
| BE controller | `Modules/SupplyChain/Http/Controllers/ProductController.php` |
| FE form | `olshoperp-frontend/src/pages/SCM/master/Product/components/FormProductComponent.vue` |

---

## Key notes (v2.2)

- **D&W** dipindah ke **Unit Configuration** (per primary/alternate unit) — bukan Shipping  
- **Bundle** (`is_bom=0`) ≠ **Header BOM** Assembly (`is_bom=1`, menu Bill of Material)  
- **Pending major:** SKU create scope per owner (P-SP-01), All D&W UI sections (P-SP-03)  
- **Bundle pricing (v2.1):** proporsi **Price Before VAT** — lihat requirement §11 + [sales-order-general §10](../sales-order-general/requirement.md#10-product-bundle--proporsi-harga-price-before-vat)
- Import Excel **hanya** menu System Product full (max **5000** rows; **Import Product Images** max **1000**)
- **Import Product Images (TO-BE):** GDrive public → replace **primary** only · GAP-SP-16

---

## Legacy source

- [_legacy/old_system-product-requirement.md](../_legacy/old_system-product-requirement.md)

---

## Related menus

- [bill-of-material](../bill-of-material/) — Header BOM untuk Assembly  
- [random-sku](../random-sku/) — virtual SKU `-random`  
- [supplychain-dimension-and-weight-label](../supplychain-dimension-and-weight-label/) — master D&W label  
- [supplychain-unit](../supplychain-unit/) — master satuan & konversi  
- [Instant Settlement](../accounting-settlement-upload/README.md) — validasi stok & COA per SKU  
- [Product COA Group](../accounting-product-coa-group/README.md)
