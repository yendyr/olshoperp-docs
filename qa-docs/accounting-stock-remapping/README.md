# Stock Remapping — Dokumentasi

Menu **Stock Remapping** (Finance Accounting) — remap stok antar variant dalam 1 parent (alias operasional: **Stock Acak**).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator (Finance) | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |

**Maintenance owner:** QA — Yemima

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-07-09 | 1.0 | Initial 3-layer docs; prefix transaksi **RM-** (bukan SRM-) |

---

## Route & modul (TO-BE)

| Item | Nilai |
|------|-------|
| **Modul** | **Finance Accounting** (bukan SCM) |
| UI (expected) | `/accounting/stock-remapping` |
| API (expected) | `accounting/stock-remapping` |
| Prefix transaksi | `RM-` |
| Aliases user | Stock Remapping · **Stock Acak** · Stock Conversion (nama draft lama) |

### Kenapa di Finance Accounting?

Menu ini memuat **unit price / nilai persediaan** per baris detail (read-only, dari stock ID origin). Tim operasional gudang **tidak boleh** melihat nilai tersebut — oleh karena itu menu utama berada di FA, meskipun pergerakan stok terkait modul Supply Chain.

---

## Key notes

- Remap **1 SKU variant → SKU variant lain** dalam **1 parent** (bukan konversi satuan / Unit Conversion)
- Approve → auto-generate **Stock Deduction** (origin) + **Stock Addition** (remapped to) per baris, sequencing
- SKU `-random` **diblok** di semua posisi
- Banyak item masih `[VERIFY: CODEBASE]` — lihat [requirement §15](./requirement.md#15-hal-yang-perlu-diperhatikan--pending-items)

---

## Related menus

- [supplychain-adjustment-deduction](../supplychain-adjustment-deduction/) — dokumen `AO` auto-generated
- [supplychain-adjustment-addition](../supplychain-adjustment-addition/) — dokumen `AI` auto-generated
- [random-sku](../random-sku/) — aturan SKU random & eligibilitas
- [system-product](../system-product/) — struktur parent/variant
- [supplychain-warehouse-structure](../supplychain-warehouse-structure/) — warehouse origin & exclusion
- [accounting-product-coa-group](../accounting-product-coa-group/) — filter Purchased/Manufactured Item
- [journal](../journal/) — jurnal dari adjustment auto-generated
