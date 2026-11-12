# Sales Return — QA Documentation (SCM)

Menu **Sales Return** — operasi gudang; shared API dengan Finance.

| Layer | File | Status |
|-------|------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | review |
| Feature Map | [feature-map.md](./feature-map.md) | draft |
| Requirement | [requirement.md](./requirement.md) | review |
| Technical | [technical.md](./technical.md) | review |
| User Guide | [user-guide.md](./user-guide.md) | review |
| Capability cards | [capabilities/](./capabilities/) | draft |

**UI gudang:** `/supplychain/sales-returns` · **Finance:** `/accounting/sales-return`  
**Help Center:** [`_meta/docs-hub/menus/supplychain-sales-returns/`](../_meta/docs-hub/menus/supplychain-sales-returns/)  
**3 layer:** v2.5 · **User Guide:** v1.4 (`source_version` 2.5) · **Feature Map:** v1.0  
**Maintenance owner:** QA — Yemima

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-11-12 | 2.5 | Jurnal retur Unbilled (belum ada SI) hanya Return Inventory / COGS, tanpa jurnal Sales/AR; selaras Purchase Return Unbilled. GAP-SR-16 (ETM-17064, TC ETM-17291) |
| 2026-11-04 16:37 | 2.4 | Export All: tanpa rincian satu baris per dokumen, dengan rincian satu baris per SKU. Di menu gudang harga dan HPP tertulis 0. Dokumen tanpa SKU tetap satu baris, tetapi angka rincian masih 0 bukan tanda strip. Kolom yang disembunyikan di daftar masih ikut ke Excel (ETM-17067) |
| 2026-11-04 13:30 | 2.3 | Baris SKU yang Restock, Lost, dan Broken-nya nol tetap tersimpan. Syarat minimal satu qty hanya dicek saat Finance menyelesaikan dokumen (ETM-17054) |
| 2026-11-04 | 2.2 | Billed = ada SI / Unbilled = belum SI; GAP-SR-13 / ETM-17064 |
| 2026-07-29 | 2.1b | Feature Map + 5 Lingo cards; user-guide v1.0; Help Center overview en/id |
| 2026-07-15 | 2.1 | Relasi Sales Platform (Return bucket, flow vs Failed Ship) |
| 2026-07-05 | 2.0 | PM merge, COGS average, dual-menu, gaps |
| 2026-06-19 | 1.0 | Initial AS-IS |

## Key notes

- **Failed Ship** = pre-outbound · **Sales Return** = post-outbound + invoice
- Gudang save qty → Finance **Complete** → stok + jurnal (+ Credit Note jika billed)
- Satu SR multi-order belum diimplementasi

## Related menus

- [Failed Ship](../supplychain-failed-ship/) — pre-outbound
- [Sales Platform](../omni-sales-platform/) — return marketplace
- [Sales Return Approval](../accounting-sales-return/) — Complete & journals
- [Credit Note](../accounting-credit-note/) — auto dari return billed
