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
**3 layer:** v2.11 · **Technical:** v2.11 · **User Guide:** v1.8 (`source_version` 2.11) · **Feature Map:** v1.1  
**Related Jira:** [ETM-17377](https://erpintegration.atlassian.net/browse/ETM-17377) · [ETM-17304](https://erpintegration.atlassian.net/browse/ETM-17304) · [ETM-17231](https://erpintegration.atlassian.net/browse/ETM-17231) · [ETM-17227](https://erpintegration.atlassian.net/browse/ETM-17227) · [ETM-17226](https://erpintegration.atlassian.net/browse/ETM-17226) · [ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215) · [ETM-17180](https://erpintegration.atlassian.net/browse/ETM-17180) · [ETM-17082](https://erpintegration.atlassian.net/browse/ETM-17082) · [ETM-16668](https://erpintegration.atlassian.net/browse/ETM-16668) · [ETM-15512](https://erpintegration.atlassian.net/browse/ETM-15512) · [ETM-15495](https://erpintegration.atlassian.net/browse/ETM-15495) · [ETM-15529](https://erpintegration.atlassian.net/browse/ETM-15529)  
**Maintenance owner:** QA — Yemima

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-11-12 14:10 | 2.11 | Gate leftover **add-only**; hapus tipe = delete flow (no `-DUPLICATE`); ganti in-place tolak + Add-only — ETM-17304 / ETM-17377 |
| 2026-11-09 10:52 | 2.10 | Close SP-02/05/07; SP-08 parent variant vs Bundle + ETM-17231; foto recommendation-only UI |
| 2026-11-09 10:30 | 2.9 | Leftover residual UI [ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215); GAP-SP-18 Partial Open; Import Update Variant **tanpa** leftover (by design) |
| 2026-11-09 10:40 | 2.8 | Tombol Import terkunci selama import lain di company yang sama masih berjalan (ETM-17180) |
| 2026-11-05 | 2.7 | **Status Restock** Yes/No (ETM-17082) — form, default Yes, datalist, Advanced Filter; tags request di-skip |
| 2026-10-22 | 2.6+ | Lengkapi ETM-16668: technical §7, UG v1.3, feature-map SF-SP-13, capability SF-SP-02, Help Center overview |
| 2026-10-21 | 2.6 | §5.4 / KB: TO-BE ETM-16668 — save/ganti default DnW → auto-recalc Pricelist/Category by Weight + Log Pricelist |
| 2026-10-02 | 2.5 | Bundle breakdown + Random: Retail Price (bukan Benchmark); before/after processing — ETM-16216; cross-ref reprice in-place ETM-16212 |
| 2026-09-23 11:10 | 2.4b | Cross-ref **Manage Platform Product** binding: sanitize SKU saat match (GAP-MPP-01 / ETM-16016) — tidak ubah storage SKU System Product |
| 2026-09-01 11:17 | 2.4 | Dokumentasi AS-IS **Product Image Sync** (API pull path by SKU, `is_synced`, setting Application Form, tombol datalist) — requirement §13.2, KB, technical §17, user-guide |
| 2026-08-12 | 2.3b | Cross-ref MV: create+Default ON skips `random` inject (MV v1.2) |
| 2026-08-12 | 2.3 | Default Variant create/import (`GAP-SP-17`) + expand soft-delete/leftover (`GAP-SP-18`); parent `-(PARENT)` |
| 2026-08-12 | 2.2b | Cross-ref Master Variant Default (GAP-VAR-01) · placeholder konsumen create/import GAP-SP-17 |
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
- **Import Product Images (AS-IS):** GDrive public → replace **primary** only · GAP-SP-16 Closed
- **Product Image Sync (AS-IS):** tombol datalist + API pull path · setting General Setting → Application · lihat requirement §13.2
- **Default Variant:** create/import `SKU-(PARENT)` + child · GAP-SP-17 Closed · expand leftover **intended** AS-IS tapi residual UI Open ([ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215) / GAP-SP-18 Partial) · **Gate leftover = tambah saja** (hapus tipe = delete flow; ganti in-place tolak) · Import Update Variant **tidak** leftover · prasyarat MV: Default ON **tanpa** inject `random` · [Master Variant](../supplychain-variant/)

---

## Legacy source

- [_legacy/old_system-product-requirement.md](../_legacy/old_system-product-requirement.md)

---

## Related menus

- [Manage Platform Product](../manage-platform-product/README.md) — binding SKU marketplace ↔ System Product; **GAP-MPP-01** sanitize saat match (ETM-16016)
- [bill-of-material](../bill-of-material/) — Header BOM untuk Assembly  
- [Master Variant](../supplychain-variant/) — Variant Group + options · TO-BE Default (`GAP-VAR-01`)  
- [random-sku](../random-sku/) — virtual SKU `-random`  
- [supplychain-dimension-and-weight-label](../supplychain-dimension-and-weight-label/) — master D&W label  
- [supplychain-unit](../supplychain-unit/) — master satuan & konversi  
- [Instant Settlement](../accounting-settlement-upload/README.md) — validasi stok & COA per SKU  
- [Product COA Group](../accounting-product-coa-group/README.md)
