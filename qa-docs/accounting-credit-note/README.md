# Credit Note — Dokumentasi

Menu **Credit Note** (Accounting).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | pending |
| Requirement | requirement.md | PM, QA | pending |
| Technical | technical.md | Developer | pending |

**Maintenance owner:** QA — Yemima

## Relasi Sales Return

Credit Note dapat **auto-generate** saat Finance **Complete** Sales Return type **Billed** (`processed_to_payment_amount > 0` pada Customer Invoice).

| Aspek | Detail |
|-------|--------|
| Trigger | `POST accounting/sales-returns/{id}/approve` → `generateCreditNoteFromReturn` |
| Type billed | Invoice sudah ada payment |
| Type unbilled | Jurnal Sales/AR — **bukan** Credit Note |

Detail alur: [Sales Return requirement §7](../supplychain-sales-returns/requirement.md#72-pov-finance--complete-post-approve) · [Sales Return Approval](../accounting-sales-return/requirement.md)