# Outbound External — Dokumentasi QA

Menu **Outbound External** (Supply Chain) — pengeluaran stok (`OT`).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Test Cases | [test-cases/](./test-cases/) | QA | (existing) |

**UI route:** `/supplychain/mutation-outbound`  
**SoT:** [../_meta/sot/supplychain-mutation-outbound-source-of-truth.md](../_meta/sot/supplychain-mutation-outbound-source-of-truth.md) v1.0  
**User-guide:** v1.0 · `source_version` 2.0  
**Version (requirement/KB/technical):** 2.0 · **Last updated:** 2026-10-11  
**Help Center overview:** [overview.id.md](../_meta/docs-hub/menus/supplychain-mutation-outbound/overview.id.md) · [overview.en.md](../_meta/docs-hub/menus/supplychain-mutation-outbound/overview.en.md) (`authored` dari file user)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| hc-1.0 | 2026-10-11 20:54 | Help Center overview ID + EN: OT Sales Order vs Other, FIFO/manual, approve final, jurnal Inventory/COGS/OpEx, auto Settlement/Assembly |
| 2.0 | 2026-10-11 | Split SoT v1.0 → 5 layer review; SO/Other; FIFO/manual; journal; GAP-OB-01/03 |
| 1.2 | 2026-07-04 | Cross-ref Assembly + Unit |
| 1.0 | 2026-06-19 | Draft auto codebase |

## Related menus

| Menu | Link |
|------|------|
| Instant Settlement | [../accounting-settlement-upload/](../accounting-settlement-upload/) — generate/revert OT |
| Assembly | [../supplychain-assembly/](../supplychain-assembly/) — OT dari WIP |
| Delivery Order | [../supplychain-delivery-order/](../supplychain-delivery-order/) — qty DO / intended nomor DO |
| Sales Order General | [../sales-order-general/](../sales-order-general/) — referensi type SO |

**Maintenance owner:** QA — Yemima
