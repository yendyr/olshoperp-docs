# Sales Return Approval — Dokumentasi (Finance)

Menu **Sales Return** di modul **Finance Accounting** — review harga/COGS dan **Complete** approval.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator Finance | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |

**Maintenance owner:** QA — Yemima

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-07-05 | 2.0 | Finance layer docs created; canonical flow di supplychain-sales-returns v2.0 |

---

## Route & code

| Item | Path |
|------|------|
| UI | `/accounting/sales-return` |
| API | `accounting/sales-returns` |
| FE | `olshoperp-frontend/src/pages/Accounting/Return/SalesReturn/` |

**Canonical E2E requirement:** [supplychain-sales-returns/requirement.md](../supplychain-sales-returns/requirement.md)

---

## Relasi Failed Ship & Sales Return (SCM)

| Kondisi order | Menu |
|---------------|------|
| Shipped, **belum** SI & Outbound | [Failed Ship](../supplychain-failed-ship/requirement.md) |
| Sudah SI & Outbound | [Sales Return SCM](../supplychain-sales-returns/requirement.md) + **menu ini (Finance)** |

Qty return ≤ qty outbound per SKU. Pill platform di Failed Ship vs Sales Return: filter outbound terbalik — [FS §4.0.5](../supplychain-failed-ship/requirement.md).

---

## Related menus

- [Sales Return SCM](../supplychain-sales-returns/README.md) — input qty gudang
- [Credit Note](../accounting-credit-note/README.md) — auto-generated billed returns
- [Customer Invoice](../accounting-customer-invoice/) — source price & tax
- [Failed Ship](../supplychain-failed-ship/README.md) — pre-settlement
