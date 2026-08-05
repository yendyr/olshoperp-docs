# Stock Remapping — Dokumentasi

Menu **Stock Remapping** (Finance Accounting, prefix `RM-`) — remap identitas stok Origin → Remapped To; auto Deduction/Addition saat approve. Alias: **Stock Acak**.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator Finance | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |

**PM source:** Change card 2026-08-04 (revisi SoT v2.0)  
**3 layer version:** 2.1 · **User-guide:** 1.1 (`source_version` 2.1)  
**Maintenance owner:** QA — Yemima

---

## Route & modul

| Item | Nilai |
|------|-------|
| Modul | Finance Accounting |
| UI | `/accounting/stock-remapping` |
| API | `accounting/stock-remapping` |
| Prefix | `RM-` |

> **v2.1:** eligibilitas Remapped To tetap Variant 1 parent. TO-BE: Stock ID, Base Unit, duplicate Remapped To, Unit Class gate (+ approve), import tanpa Unit. Lintas parent / Identification Icon **dibatalkan**. Lihat [requirement §2](./requirement.md#2-status-implementasi-as-is-vs-to-be-v21).

## Related menus

- [accounting-adjustment-inbound](../accounting-adjustment-inbound/) — AI auto-generated  
- [system-product](../system-product/) — parent / variant  
- [supplychain-unit](../supplychain-unit/) — Unit Class & Base Unit  
- [supplychain-warehouse-structure](../supplychain-warehouse-structure/) — warehouse origin  

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-08-04 | 2.1 | Revisi scope card: batalkan lintas parent + icon; Stock ID / Base Unit / duplicate / Unit Class+approve / import tanpa Unit |
| 2026-07-30 | 2.0 | SoT v2.0 (lintas parent) — superseded |
| 2026-07-09 | 1.0 | Initial docs |
