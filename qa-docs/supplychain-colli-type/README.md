# Colli Type — Dokumentasi QA

Menu **Colli Type** (Supply Chain / Master) — jenis wadah colli (Box, Pallet, …) untuk New Colli.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Feature Map | [feature-map.md](./feature-map.md) | Operator, QA (Lingo index) | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo-style SF Entry | review |

**PM source:** Colli Type Source of Truth **v1.0** (14 Agustus 2026)  
**SoT:** [`_meta/sot/supplychain-colli-type-source-of-truth.md`](../_meta/sot/supplychain-colli-type-source-of-truth.md)  
**UI route:** `/supplychain/colli-type`  
**3 layer version:** 1.0 · **User-guide:** 1.1 · **Feature Map:** 1.0 · **Last updated:** 2026-08-14  
**Maintenance owner:** QA — Yemima

CRUD UI/API masih **WIP** (entity + tabel sudah ada). Lihat gap di requirement.

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-14 11:10 | 1.0b | Feature Map + 5 Lingo cards (SF-CT-01..05); UG v1.1 SF tags |
| 2026-08-14 11:05 | 1.0 | Full 5-file dari SoT v1.0 (master jenis wadah Colli v2); Gap GAP-CT-01..07; relasi Inbound/Unit/WH |

## Related menus

| Menu | Relasi |
|------|--------|
| [Purchase Inbound](../supplychain-new-purchase-inbound/README.md) | Konsumen Default + New Colli — Colli v2 canonical (requirement v2.4) |
| [Purchase Inbound (legacy)](../supplychain-mutation-inbound/README.md) | Parity Colli v2 (pointer, bukan duplikasi AC) |
| [Unit](../supplychain-unit/README.md) | Satuan qty — bukan pengganti Colli Type |
| [Warehouse Structure](../supplychain-warehouse-structure/README.md) | Lokasi colli di transaksi |
