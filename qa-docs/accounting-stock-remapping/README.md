# Stock Remapping — Dokumentasi

Menu **Stock Remapping** (Finance Accounting, prefix `RM-`) — remap identitas stok dari SKU Origin ke SKU Remapped To; sistem auto-generate pengurangan & penambahan stok saat approve. Alias operasional: **Stock Acak**.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator (Finance) | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |

**PM source:** Stock Remapping Source of Truth **v2.0** (30 Juli 2026)
**3 layer version:** 2.0 · **User-guide:** 1.0 (`source_version` 2.0)
**Maintenance owner:** QA — Yemima

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-07-09 | 1.0 | Initial 3-layer docs; prefix transaksi **RM-** |
| 2026-07-30 | 2.0 | Selaras SoT v2.0: Remapped To lintas parent (Single/BOM/Bundle, syarat Unit Class sama), SKU Origin per Stock ID, Unit read-only Base Unit + Avl. Base Unit, Unit Price 1:1, duplicate Remapped To diizinkan, Identification Icon, import auto-split FIFO. Technical di-rewrite AS-IS dari codebase; ditambah tabel status implementasi & Gap Registry `GAP-RM-*`; user-guide baru |

---

## Route & modul

| Item | Nilai |
|------|-------|
| Modul | **Finance Accounting** |
| UI | `/accounting/stock-remapping` |
| API | `accounting/stock-remapping` |
| Prefix | `RM-` |

> **Catatan implementasi:** fitur sudah **live** di codebase (modul Accounting). Sebagian perilaku v2.0 (Stock ID selection, lintas parent, Unit Class guard, Base Unit lock) masih TO-BE — lihat [requirement §2 & §11](./requirement.md#2-status-implementasi-v20-as-is-vs-to-be).

---

## Related menus

- [accounting-adjustment-inbound](../accounting-adjustment-inbound/) — dokumen `AI` auto-generated (penambahan)
- [random-sku](../random-sku/) — aturan SKU acak & eligibilitas
- [system-product](../system-product/) — struktur parent/variant
- [supplychain-unit](../supplychain-unit/) — Unit Class & Base Unit
- [bill-of-material](../bill-of-material/) — flag Header/Detail BOM (eligibilitas v2.0)
- [supplychain-warehouse-structure](../supplychain-warehouse-structure/) — warehouse origin & exclusion
- [accounting-product-coa-group](../accounting-product-coa-group/) — filter Purchased/Manufactured Item
- [journal](../journal/) — jurnal dari dokumen adjustment auto-generated
