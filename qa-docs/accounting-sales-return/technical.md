---
doc_type: technical
menu: accounting-sales-return
menu_name: "Sales Return"
version: 2.7
last_updated: 2026-11-12
owner: QA - Yemima
status: review
related_docs:
  - ./requirement.md
  - ../supplychain-sales-returns/technical.md
---

# Sales Return Approval — Technical (Finance Layer)

**UI route:** `/accounting/sales-return`  
**Shared FE:** `olshoperp-frontend/src/pages/Accounting/Return/SalesReturn/` with `fromScm=false`, `withPrice=true`

Full architecture: [supplychain-sales-returns/technical.md](../supplychain-sales-returns/technical.md)

---

## 1. Finance-specific FE

| Prop | Value | Effect |
|------|-------|--------|
| `fromScm` | `false` | Complete button visible; back link → `/accounting/sales-return` |
| `withPrice` | `true` | Detail API `?with_price=1`; price/COGS columns |

**Complete handler:** `DetailButtons.vue` → `POST accounting/sales-returns/{id}/approve`

**Qty save vs approve (ETM-17054):** shared `components/DetailTable.vue` (also SCM). `PATCH accounting/sales-returns/{id}/details/{detail_id}` accepts whole numbers including 0 and rejects only `Total quantity exceed returnable quantity`. The per-row FE message `Total return quantity must be greater than 0 to save this document.` is removed. Document-level check is only in `SalesReturnController::approve`: `Please enter at least one restock quantity, broken quantity, or lost quantity`. Detail update contract: [supplychain-sales-returns/technical.md](../supplychain-sales-returns/technical.md) §7.

---

## 2. Price columns API

`SalesReturnDetailController@index` with `with_price=1`:

- `total_outbound_cogs` — order-level price + COGS
- `total_inbound_cogs` — return-proportional price + COGS (dynamic on qty change)

COGS source on create: average outbound (`SalesReturnController@createDetail` L459–492).

---

## 3. Approve & Journal

| Step | Class / method |
|------|----------------|
| Authorize | `SalesReturnController@approve` → `authorize('approval', SalesReturn::class)` |
| Stock | `ItemStockMutation::approveReturn()` |
| Per detail | `SalesReturnDetail::generateStock()` |
| Journal | `JournalProcess::stockSalesReturnAutoJournal()` L1867+ |
| Invoice reversal | `JournalProcess::processSalesReturnInvoice()` L2963+ |
| Credit Note | `generateCreditNoteFromReturn()` L1547+ (billed) |

Journal auto-approved (system user 0).

---

## 4. Accounting type logic

**Required (parity Purchase Return):**

| Type | Condition | Path |
|------|-----------|------|
| `billed` | Sales Invoice **exists** for the return line/SKU | Credit Note + journal (mirror PR → Debit Note) |
| `unbilled` | **No** Sales Invoice yet | Inventory-side journal only: Return Inventory (D) / COGS (K), plus Expense / Inventory if Lost. No Sales/AR lines, no CN |

`accounting_type` on `omni_sales_returns`. Not tied to AR/`processed_to_payment_amount`.

**Known code gap (GAP-SR-16):** `JournalProcess::stockSalesReturnAutoJournal` still calls `processSalesReturnInvoice` for `unbilled`. Since commit `d40ec8e` (ETM-17064, 10 Nov 2026) the amount is read from `SalesOrderDetail->each_price_after_discount_after_vat`, an attribute that does not exist on that model, so the amount is 0 and the Sales/AR rows are skipped (journal rows with 0 are not inserted). Result today is correct by accident; the branch should be removed so it cannot come back when the attribute is added. Before ETM-17064 the amount came from the Sales Invoice detail (old definition: unbilled = SI exists but unpaid).

**Classification windows (GAP-SR-16, see supplychain-sales-returns requirement §7.4):** `accounting_type` is set once in `SalesReturnLogic::store` from `invoiced_quantity` (`prepared_to_invoice_quantity` + `processed_to_invoice_quantity`, per SO line) and is not recomputed at approve. `validateDetails` rejects creation while any line has `prepared_to_invoice_quantity > 0` (`has pending invoice, please complete it first`), so an Open SI never lands in either type. `SalesReturnLogic::approve` and `ItemStockMutation::approveReturn` have no SI-status gate (checks: fiscal period, at least one qty, warehouse, active product, COA group, Return Expense COA, `can_approve`). Remaining exposure: Unbilled returns created before ETM-17064 (old definition) that are still Open and linked to an approved SI; they complete with no Sales/AR reversal and no CN. Staging 12 Nov 2026: 18 such returns. An SI created after the return is blocked on the normal paths (SI line picker/import/auto-generate/Settlement import all subtract returned qty via `invoicable_quantity_in_base_unit`); only direct API calls to `CustomerInvoiceDetailItemController` store/update skip that check.

**Known bug (code AS-IS — [ETM-17064](https://erpintegration.atlassian.net/browse/ETM-17064) / GAP-SR-13):**

```php
// WRONG — still in SalesReturnController + ItemStockMutation
$is_billed = $invoice->processed_to_payment_amount > 0;
```

Must become: billed iff customer invoice detail/SI exists (same spirit as PR billed = has Purchase Invoice).

Invoice counters updated on qty edit:

- `prepared_to_amount_return`
- `prepared_to_amount_credit_note` (if billed)

On approve → `processed_to_amount_return`, `processed_to_amount_credit_note`.

---

## 5. Menu seeder flags

`AccountingMenuSeeder.php` L547–565:

- Route: `accounting/sales-return`
- `approval => 1`
- `print => 0`

Contrast SCM `SupplyChainMenuSeeder.php`: `approval => 0`, `print => 1` (print not implemented).

---

## 6. Auto-approve

| Component | Path |
|-----------|------|
| Config API | `omnichannel/sales-return-configuration` |
| Command | `app/Console/Commands/SalesReturnAutoApprove.php` |
| Job | `SalesReturnAutoApproveJob` |
| FE config | `Omni/master/GlobalSetting/SalesReturnConfiguration.vue` |

Selects open platform returns older than `open_to_approve_duration`, dispatches approve job.

---

## 7. Testing (Finance focus)

1. Complete from accounting route only
2. `with_price=1` columns populated
3. Billed path → Credit Note row in DB
4. Unbilled path → no CN, journal has only Return Inventory / COGS lines (no Sales/AR)
5. Lost without Return Expense COA → 422 on approve
6. Tax reversal via `customer_invoice_detail_taxes` pivot
7. SKU row 0/0/0 saves; approve 422 only when every detail qty is 0 (ETM-17054)

---

## 8. Export (Finance)

Implementasi bersama menu SCM: [supplychain-sales-returns/technical.md](../supplychain-sales-returns/technical.md) §12. Kelas yang sama: `Modules/OmniChannel/Http/Controllers/SalesReturnController.php` `exportExcel`, `Modules/OmniChannel/Jobs/SalesReturnExportJob.php`, `Modules/OmniChannel/Exports/SalesReturnExportAll.php`. Commit grain: `fe26ea765`.

| Item | Menu Finance |
|------|----------------|
| `from_scm` | false → nama menu `Sales Return FA` |
| `with_price` | default true. Order Price, Order COGS, Return Price, Return COGS terisi. Job tetap memaksa 0 hanya bila nama menu memuat `SCM` |
| Without / With Details | 1 baris per dokumen / 1 baris per SKU, header diulang |
| Tanpa detail | 1 baris; teks `-`; angka detail `0` (GAP-SR-15, kontrak `-`) |
| Show/Hide | Tidak dibaca (`hidden_columns` / `visible_columns` tidak ada). GAP-SR-14, TO-BE [ETM-17067](https://erpintegration.atlassian.net/browse/ETM-17067) |

---

## Related Documents

| Doc | Path |
|-----|------|
| Canonical technical | [../supplychain-sales-returns/technical.md](../supplychain-sales-returns/technical.md) |
| Credit Note | [../accounting-credit-note/README.md](../accounting-credit-note/README.md) |
