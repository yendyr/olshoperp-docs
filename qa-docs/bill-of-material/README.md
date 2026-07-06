# Bill of Material — Dokumentasi

Menu **Bill of Material** (SCM) — definisi komponen BOM untuk Assembly.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Legacy source

- [_legacy/old_bill-of-material.md](../_legacy/old_bill-of-material.md) — merged ke KB + requirement

## Route & code

- FE: `/supplychain/bill-of-material` → `src/pages/SCM/master/MasterBillOfMaterial/`
- BE: `Modules/SupplyChain/Http/Controllers/MasterBillOfMaterialController.php`

## Related menus

- [system-product](../system-product/) — prerequisite SKU header/detail
- [supplychain-assembly](../supplychain-assembly/) — consumer utama; snapshot BoM saat Open/Approve
- [supplychain-unit](../supplychain-unit/) — primary/alternate unit untuk detail BoM
- [random-sku](../random-sku/) — random SKU tidak boleh jadi Header/Detail BOM
