---
doc_type: technical
menu: journal
menu_name: "Journal"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Journal — Technical Documentation

## 1. Architecture Overview

Double-entry accounting journal. Header (`Journal`) + lines (`JournalDetail`). Polymorphic `transaction_reference` links auto-generated journals to source documents.

**Approved journals** feed: General Ledger, Trial Balance, Balance Sheet, Profit & Loss.

## 2. Frontend

| File | Role |
|------|------|
| `olshoperp-frontend/src/pages/Accounting/Journal/DataList.vue` | List + export/import |
| `olshoperp-frontend/src/pages/Accounting/Journal/Form.vue` | Create/edit + ledger detail grid |

**Routes:** `accounting_journal_index`, `create_journal_form`, `edit_journal_form`

## 3. Backend

| File | Role |
|------|------|
| `Modules/Accounting/Http/Controllers/JournalController.php` | CRUD, approve, export |
| `Modules/Accounting/Http/Controllers/JournalDetailController.php` | Detail lines, currency conversion on save |
| `Modules/Accounting/Entities/Journal.php` | Header model |
| `Modules/Accounting/Entities/JournalDetail.php` | Line model |
| `Modules/Accounting/Policies/JournalPolicy.php` | Permissions |
| `Modules/Accounting/Routes/api.php` | API routes |
| `app/Helpers/Accounting/JournalReport.php` | Balance helpers (used by GL) |

**Auto-journal sources:** Sales Invoice, Purchase Invoice, Payment, Stock Mutation, Assembly, Credit/Debit Note, Outbound, Inbound controllers/observers (see codebase `Journal::create` / observer patterns).

## 4. API (key routes)

| Method | Path | Role |
|--------|------|------|
| GET | `/api/accounting/journal` | DataTables index |
| POST | `/api/accounting/journal` | Create |
| GET | `/api/accounting/journal/{id}` | Show |
| PUT | `/api/accounting/journal/{id}` | Update |
| POST | `/api/accounting/journal/{id}/approve` | Approve |
| GET | `/api/accounting/journal-detail` | Detail lines datalist |
| POST | `/api/accounting/journal-detail` | Add line |

Full list: `docs/api/accounting/routes.md`

## 5. Currency handling

On `JournalDetailController@store`:

```
isForeign = (journal.currency_id != primary) OR (exchange_rate != 1)
If foreign: debit/credit stored in primary; debit_foreign/credit_foreign preserved
```

## 6. Status transitions

| From | To | Trigger |
|------|-----|---------|
| — | Draft | Create |
| Draft | Open | User action |
| Open | Approved | Approve |
| Open | Rejected | Reject |
| Rejected | Draft | Edit |
| — | Approved | System auto-create |

## 7. DB schema docs

- `docs/db-schema/accounting/accounting_journals.md`
- `docs/db-schema/accounting/accounting_journal_details.md`

## Related Documents

| Doc | Path |
|-----|------|
| Requirement (full rules) | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| General Ledger (downstream) | [../general-ledger/technical.md](../general-ledger/technical.md) |
