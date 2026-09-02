# General Ledger Report — Dokumentasi

Menu **General Ledger Report** (Accounting) — laporan buku besar per COA.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator | review |
| Feature Map | [feature-map.md](./feature-map.md) | PM, QA, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | End-user (Notion/Lark) | review |
| Capability cards | [capabilities/](./capabilities/) | Lingo / MenuDoc | review |

**Help Center overview:** [ID](../_meta/docs-hub/menus/general-ledger/overview.id.md) · [EN](../_meta/docs-hub/menus/general-ledger/overview.en.md) (`authored` ID + derived EN, review)

**Maintenance owner:** QA — Yemima

## Test Cases

| Folder | Origin Jira | Catatan |
|--------|-------------|---------|
| [test-cases/](./test-cases/) | ETM-15666 | Kolom + filter + export Store (`TC-GL-001`–`004`) |

## Menu terkait (Store → GL)

| Menu | Slug |
|------|------|
| Journal | `journal` |
| Instant Settlement Upload | `accounting-settlement-upload` |
| Customer Invoice | `accounting-customer-invoice` |
| Customer Payment / Receive | `accounting-customer-payment` |
| Credit Note | `accounting-credit-note` |
| Debit Note | `accounting-debit-note` |
| Sales Return | `accounting-sales-return` |

## Legacy source

- [_legacy/old_general-ledger-requirement.md](../_legacy/old_general-ledger-requirement.md)

## Route & code

- FE: `/accounting/general-ledger`
- BE: `Modules/Accounting/Http/Controllers/GeneralLedgerController.php`

## Changelog

| Date | Changes |
|------|---------|
| 2026-09-02 16:30 | Supplier di layar GL: kode saja bila ada kolom terstruktur; deskripsi journal otomatis tetap apa adanya — tidak diubah (ETM-15731) |
| 2026-09-01 14:40 | Help Center General Ledger ID (authored) + EN translation — grouping COA, kolom Store, opening/ending, export async |
| 2026-09-01 12:55 | User guide v1.0; Feature Map + 3 capability Lingo (Store column/filter/export); Help Center ditunda sesi terpisah |
| 2026-09-01 11:55 | Docs v1.1: kolom/filter/export Store (ETM-15666), aturan pivot header journal, cross-ref settlement/journal, gap AR/CN/DN |
| 2026-06-19 | Docs v1.0: AS-IS GL report, opening/ending balance, TO-BE group header & running export |
