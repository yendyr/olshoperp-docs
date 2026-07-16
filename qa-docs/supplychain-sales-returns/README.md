# Sales Return — QA Documentation (SCM)

Menu **Sales Return** — operasi gudang + shared API dengan Finance.

| Layer | File | Status |
|-------|------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | review |
| Requirement | [requirement.md](./requirement.md) | review |
| Technical | [technical.md](./technical.md) | review |

**Maintenance owner:** QA — Yemima

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-07-15 | 2.1 | Relasi Sales Platform (Return bucket, flow vs Failed Ship) |
| 2026-07-05 | 2.0 | Full rewrite: PM requirement merge, COGS 7 Mei, dual-menu, gaps §19–§21 |
| 2026-06-19 | 1.0 | Initial draft AS-IS |

---

## Route & code

| Item | Path |
|------|------|
| UI (Gudang) | `/supplychain/sales-returns` |
| UI (Finance) | `/accounting/sales-return` → [accounting-sales-return](../accounting-sales-return/README.md) |
| API mutation | `accounting/sales-returns` |
| API datalist | `omnichannel/sales-returns` |
| FE shared | `olshoperp-frontend/src/pages/Accounting/Return/SalesReturn/` |

---

## Key notes (v2.0)

- **Failed Ship** = pre-outbound · **Sales Return** = post-outbound + invoice
- Gudang save qty → Finance **Complete** → stok + jurnal (+ Credit Note jika billed)
- COGS return = **average outbound** (agreement 7 Mei 2026)
- Bulk multi-order → 1 SR: **belum** diimplementasi (P-SR-02)

---

## Related menus

- [Failed Ship](../supplychain-failed-ship/README.md) — pre-settlement failures
- [Sales Platform](../omni-sales-platform/README.md) — SO marketplace; Return bucket
- [All Sales Order](../all-sales-order/README.md) — gabungan monitoring
- [Dev - Sales Order](../sales-order-general/README.md) — source SO internal
- [Sales Return Approval (Finance)](../accounting-sales-return/README.md) — Complete & journals
- [Credit Note](../accounting-credit-note/README.md) — auto dari SR billed
