# Sales Return — Dokumentasi

Menu **Sales Return** (Accounting).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | pending |
| Requirement | requirement.md | PM, QA | pending |
| Technical | technical.md | Developer | pending |

**Maintenance owner:** QA — Yemima

## Relasi Failed Ship & Settlement

| Kondisi order | Menu |
|---------------|------|
| Shipped 3PL, **belum** SI & Outbound | [Failed Ship](../supplychain-failed-ship/requirement.md) |
| Sudah SI & Outbound (settled) | **Sales Return** (menu ini) |

- Qty return **≤ qty outbound** per SKU; `invoicableQuantityInBaseUnit` sudah net Failed Ship.
- Pill platform di Failed Ship vs Sales Return: filter outbound terbalik — [FS §4.0.5](../supplychain-failed-ship/requirement.md#405-pill-sales-platform-returns-failed-ship-index).

**Rantai fulfillment sebelum FS:** [Transfer Internal §8](../supplychain-mutation-transfer-internal/technical.md#8-relasi-failed-ship--rantai-fulfillment) → [DO §8](../supplychain-delivery-order/technical.md#8-relasi-failed-ship--collecting--shipped-3pl)