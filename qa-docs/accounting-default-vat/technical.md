---
doc_type: technical
menu: accounting-default-vat
menu_name: "Default VAT"
version: 1.0
last_updated: 2026-08-05
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Default VAT — Technical Documentation

> **Review** — AS-IS 2026-08-05. Behavior: [requirement v1.0](./requirement.md).

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-05 | QA - Yemima | Controller auto-save semantics, seed hooks, gaps, dead-code note |

---

## 1. File Map

| Layer | Path |
|-------|------|
| Controller | `Modules/Accounting/Http/Controllers/DefaultVatController.php` |
| FormRequest | `Http/Requests/DefaultVatRequest.php` |
| Entity | `Entities/DefaultVat.php` → `accounting_default_vats` |
| Policy | `Policies/DefaultVatPolicy.php` |
| Routes | `accounting/default-vat` apiResource + `audit`, `select2Taxes`, `select2Coa` |
| Seed create | `Modules/SupplyChain/Http/Controllers/ProductController` (~create tax config) |
| Seed import | `Modules/SupplyChain/Import/ProductImport.php` |
| Consumers | PO/SO/Omni via `Product::getPurchaseTaxes` / `getSalesTaxes` |
| FE | `olshoperp-frontend/src/pages/Accounting/master/DefaultVAT/` (`IndexDefaultVAT`, `PurchaseVATForm`, `SalesVATForm`, `DefaultVATForm`) |

---

## 2. Schema (ringkas)

| Column | Notes |
|--------|-------|
| `tax_id`, `coa_id` | FK Tax + mirrored COA |
| `type` | enum `sales` \| `purchase` |
| `include`, `auto_add_transaction`, `with_coefficient` | Snapshot flags |
| `name`, `description`, `tariff` | Denormalized from Tax at save |

**No unique** on `(owned_by, type)` — GAP-DV-01.

---

## 3. API behavior

| Action | Behavior |
|--------|----------|
| `GET ?type=` | `latest()` then `first()` for type — orphan older rows ignored |
| `POST` store | `tax_id` null → `DefaultVat::where('type', …)->delete()`; else validate Tax active → **create** (does **not** clear prior rows of same type) |
| `PUT` update | `tax_id` null → delete this row; else re-validate Tax deleted/inactive → update |
| `DELETE` | Soft/hard via model destroy |

Messages: `Selected VAT already deleted` · `Selected VAT is inactive`.

---

## 4. Seed Product Tax

```php
foreach (['sales' => DefaultVat::…->sales()->first(), 'purchase' => …->purchase()->first()] as $type => $defaultVat) {
    if ($defaultVat) {
        ProductTaxController->store([ tax_id, type, included, auto_add_transaction, … ]);
    }
}
```

- Snapshot at create/import time.  
- Duplicate pivot → `ProductTaxController` error can fail product create TX.  
- Runtime orders **never** return `DefaultVat` instance from product tax getters — Omni/SO `instanceof DefaultVat` branches are dead (GAP-DV-02).

---

## 5. Invariants & failure modes

- Persisted row always has valid `tax_id` at write time; empty tax_id ⇒ delete.  
- Changing Default VAT does not rewrite existing Product Tax.  
- Repeated POST create without clear → multiple rows same type (FE shows latest).  
- Clear must send correct `type` (GAP-DV-04).

---

## 6. Known Issues

[requirement §11](./requirement.md#11-gap-registry) `GAP-DV-01` … `04`.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Tax | [../accounting-tax/technical.md](../accounting-tax/technical.md) |
