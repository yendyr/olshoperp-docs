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
**3 layer:** v2.1 · **User Guide:** v1.0 (`source_version` 2.1) · **Feature Map:** v1.0  
**Maintenance owner:** QA — Yemima

## Changelog

| Date | Version | Changes |
|------|---------|---------|
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
