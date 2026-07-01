# System Product — Dokumentasi

Menu **System Product** (SCM) — master data SKU, variant, bundle, BOM flag, inventori.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Legacy source

- [_legacy/old_system-product-requirement.md](../_legacy/old_system-product-requirement.md)

## Route & code

- FE: `/supplychain/system-product`
- BE: `Modules/SupplyChain/Http/Controllers/ProductGeneralConfigurationController.php`

## Related menus

- [bill-of-material](../bill-of-material/) — BOM detail untuk SKU header
- [random-sku](../random-sku/) — konsep virtual SKU lintas menu
- [Instant Settlement](../accounting-settlement-upload/README.md) — validasi stok & COA per SKU
- [Product COA Group](../accounting-product-coa-group/README.md)
