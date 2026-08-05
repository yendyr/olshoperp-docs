---
doc_type: technical
menu: accounting-company-detail-bank
menu_name: "Cash/Bank Account"
version: 1.0
last_updated: 2026-08-05
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Cash/Bank Account — Technical Documentation

> **Review** — AS-IS 2026-08-05. Behavior: [requirement v1.0](./requirement.md).  
> Entity lives in **GeneralSetting**; UI under Accounting Master.

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-05 | QA - Yemima | Controller CRUD, lock via receive_destinations, GAP-CBA-01 query |

---

## 1. File Map

| Layer | Path |
|-------|------|
| Controller | `Modules/GeneralSetting/Http/Controllers/CompanyDetailBankController.php` |
| Entity | `Modules/GeneralSetting/Entities/CompanyDetailBank.php` |
| Policy | GeneralSetting CompanyDetailBank policy |
| Routes | GeneralSetting API `company-detail-bank` |
| FE | `olshoperp-frontend/src/pages/Accounting/master/CashBankAccount/{DataList,Form}.vue` |
| Lock signal | `receive_destinations()` → show `to_payment` |

---

## 2. Store / update / destroy (ringkas)

**store**

- Validate: `currency_id`, `label` max 30, `chart_of_account_id`, `is_default`  
- Reject Default+Inactive  
- `CompanyDetailBank::where('chart_of_account_id', …)->exists()` → `This COA has already been taken`  
- Ensure ≥1 default; unset previous default on create when setting new  
- `type` taken from request **without** Rule::in (GAP-CBA-05)

**update**

- If `receive_destinations()->exists()`: reject changes to type / currency_id / chart_of_account_id with field-specific English messages  
- Default switch query (**buggy**):

```php
CompanyDetailBank::where([
    'id' => ['!=', $CompanyDetailBank->id],  // NOT valid Laravel != 
    'owned_by' => …,
    'is_default' => 1,
])->first();
```

→ GAP-CBA-01 — should be `where('id', '!=', $id)` or `whereKeyNot`.

**destroy**

- If receive_destinations exists → `This data has been used`  
- Else soft delete + `deleted_by`

**No** saldo/balance check on inactive (GAP-CBA-02).

---

## 3. FE lock

| Flag | Behavior |
|------|----------|
| `to_payment === true` | `can_update = false` for Type/Currency/COA/Active; `can_update_original` still true for label/bank fields/default |
| Delete button | Hidden when used |

---

## 4. Invariants & failure modes

- Company ≥1 default Active (enforced on create/update paths that work)  
- One COA ↔ one non-deleted bank (app-level exists; race without DB unique)  
- Lock source = Payment/CN/DN fund relation only (GAP-CBA-04)  
- Soft-delete frees COA for new binding (SoftDeletes scope on exists)

---

## 5. Known Issues

[requirement §11](./requirement.md#11-gap-registry).

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Cash Bank Reconcile | [../accounting-cash-bank-reconcile/technical.md](../accounting-cash-bank-reconcile/technical.md) |
