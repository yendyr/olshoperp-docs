---
doc_type: technical
menu: accounting-debit-note
menu_name: "Debit Note"
version: 1.1
last_updated: 2026-09-02
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Debit Note — Technical Documentation

> **Review** — AS-IS 2026-08-12 + supplier display 2026-09-02. Behavior: [requirement v1.1](./requirement.md).  
> **Supplier display:** parent [ETM-15721](https://erpintegration.atlassian.net/browse/ETM-15721) · child [ETM-15727](https://erpintegration.atlassian.net/browse/ETM-15727)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-12 | QA - Yemima | DebitNoteController, export jobs, AP import, journal |
| 1.1 | 2026-09-02 | QA - Yemima | Supplier display code-only via ETM-15721 helpers |

---

## 1. File Map

| Layer | Path |
|-------|------|
| Entity | `Modules/Accounting/Entities/DebitNote.php` (extends `Payment`, scope `DebitNoteScope`) |
| Controller | `Modules/Accounting/Http/Controllers/DebitNoteController.php` |
| Detail fund | `Modules/Accounting/Http/Controllers/DebitNoteDetailFundController.php` → `PaymentDetailFundController` |
| Service | `Modules/Accounting/Services/DebitNoteService.php` |
| Export | `DebitNoteExportJob` → `DebitNoteExportAll2`; `DebitNoteDetailExportJob` → `DebitNoteWhithDetailExportAll` |
| AP import DN | `SupplierPaymentImportPerMutationJob::createDebitNote` |
| Supplier select2 | `DebitNoteController@select2Supplier` → `GeneralCompanyController@select2Supplier` |
| Journal | `JournalProcess::debitNoteAutoJournal` |
| FE | `olshoperp-frontend/src/pages/Accounting/DebitNote/*` |
| Store | `olshoperp-frontend/src/stores/project/DebitNote/index.ts` |
| Routes | `accounting/debit-note` (+ detail-fund, return-deposits, export-*, print, approve) |

---

## 2. Invariants

1. `type = Debit Note`; kode unik prefix `DN`.  
2. Select2 supplier = General + `is_supplier` + COA tag lengkap.  
3. Manual/AP-import detail = `payment_detail_funds`; PR detail = return deposits.  
4. Approve butuh minimal satu jenis detail.  
5. Fund currency = header currency; amount > 0; no duplicate COA.  
6. Add/update fund cek remaining cash/bank balance.  
7. Paid hanya dari AP approved deposit lines.  
8. Soft delete header hanya draft/open/rejected.

---

## 3. Approve / journal (ringkas)

| Source | Journal direction |
|--------|-------------------|
| Manual | Dr Deposit to Supplier · Cr Cash/Bank fund COA |
| Purchase Return | Dr Deposit of Purchase Return · Cr Inventory COA produk |

Post-approve: eligible sebagai deposit di `SupplierPayment` (same supplier/currency, DN date < AP date, outstanding > 0).

---

## 4. Export

| Job | Export class | Scope |
|-----|--------------|-------|
| Without Details | `DebitNoteExportAll2` | Header per DN |
| With Details | `DebitNoteWhithDetailExportAll` | Iterates `payment_detail_funds` only |

→ GAP-DN-02: PR DN without funds may export 0 detail rows.

### Supplier display mode (ETM-15721 / ETM-15727)

| Item | Rule |
|------|------|
| Flag | `SUPPLIER_DISPLAY_MODE=code_only` (rollback: `code_and_name`) |
| Helpers | Shared FE/BE helpers dari foundation ETM-15721 — jangan hardcode |
| Select2 | Search name+code; label = code; no hover name |
| ColVis / datalist / modal | Code only; no Supplier Name option |
| Export | Omit name |
| Print | Keep name |
| Basic Info | Do **not** add read-only Supplier Name |

---

## 5. Failure modes

| Failure | Effect |
|---------|--------|
| Fiscal / COA missing | 422 field or message |
| Insufficient fund balance | Error insufficient/exceeds |
| Approve tanpa detail | Error |
| Delete approved | Blocked |
| Auto-create on create page fails | Stay on create + `error_form` |

---

## 6. Data lifecycle

`accounting_payments` (DN header) ← funds / return_deposits ← AP `payment_detail_deposits` ← journal morph.

---

## 7. Known Issues

[requirement §11](./requirement.md#11-gap-registry).

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Account Payment | [../accounting-supplier-payment/technical.md](../accounting-supplier-payment/technical.md) |
