---
doc_type: requirement
menu: accounting-sales-return
menu_name: "Sales Return"
version: 2.0
last_updated: 2026-07-05
owner: QA - Yemima
status: review
---

# Sales Return Approval — Requirement (Finance Layer)

**Modul:** Finance Accounting  
**Audience:** Finance, QA, Developer  
**Persona:** Team Finance — review harga/COGS, **Complete** approval, jurnal turunan

**UI route:** `/accounting/sales-return`  
**Canonical E2E doc:** [supplychain-sales-returns/requirement.md](../supplychain-sales-returns/requirement.md)

---

## 0. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-07-05 | Initial Finance layer — split from canonical SR v2.0 |

---

## 1. Scope menu Finance

| Aspek | Finance menu | SCM menu (referensi) |
|-------|--------------|----------------------|
| Route | `/accounting/sales-return` | `/supplychain/sales-returns` |
| Scan/create | ✓ (same ScanForm) | ✓ |
| Input qty | ✓ | ✓ |
| Kolom harga/COGS | ✓ **with_price=1** | ❌ |
| Tombol **Complete** | ✓ | ❌ hidden |
| Approve gate | `approval` privilege | `approval => 0` |

---

## 2. Kolom tambahan Finance (Product Detail)

Query: `GET accounting/sales-returns/{id}/details?with_price=1`

| Kolom | Posisi | Keterangan AS-IS |
|-------|--------|------------------|
| **Order Price / Order COGS** | After Product | Total price & COGS untuk full order qty |
| **Return Price / Return COGS** | After Total SR Qty | Proporsional terhadap Total SR Qty — dinamis saat qty berubah |

### 2.1 COGS Return — 7 Mei 2026

| Layer | Rule |
|-------|------|
| **Backend** | Average: `Σ(outbound_qty × stock price) / Σ outbound_qty` per order detail |
| **FE tooltip** | Masih menyebut *"most recent Stock ID date"* — drift (GAP-SR-02) |

Return Price dari invoice: `each_price_after_discount_after_vat × return qty`.

---

## 3. Tombol Complete & Approval

**Komponen:** `DetailButtons.vue` — `Complete` visible when `can_approve && !fromScm`

**API:** `POST accounting/sales-returns/{id}/approve`

Body: `{ approval_status: 'approved', description?: string(max 150) }`

**Pre-conditions:** status open; min 1 qty > 0; Return Expense COA if lost; product COA valid; fiscal period open.

**Reject:** tidak ada endpoint/button aktif (GAP-SR-10).

---

## 4. Transaksi turunan setelah Complete

| Sub-proses | Dokumen generated |
|------------|-------------------|
| Restock | `ItemStock` inbound ke Return WH |
| Broken | Transfer Internal → Scrap WH (auto-approved) |
| Lost | Stock Deduction + Expense journal |

### 4.1 Jurnal (`JournalProcess::stockSalesReturnAutoJournal`)

**UNBILLED:** Sales (D)/AR (K) · Return Inventory (D)/COGS (K) · Expense (D)/Inventory (K) if Lost

**BILLED:** Credit Note (D)/AR (K) · Return Inventory (D)/COGS (K) · Expense if Lost

### 4.2 Credit Note (billed)

Auto jika invoice `processed_to_payment_amount > 0` → `generateCreditNoteFromReturn`.

Detail: [Credit Note](../accounting-credit-note/README.md).

### 4.3 Completion Summary (PM)

PM mensyaratkan dialog `Sales Return Processed` + Print Summary — **not implemented** (GAP-SR-08/09, P-SR-01).

---

## 5. Billed vs Unbilled

| Type | Set when | Finance impact |
|------|----------|----------------|
| `unbilled` | Invoice belum ada payment | Jurnal sales/AR reversal |
| `billed` | `processed_to_payment_amount > 0` | Credit Note + AR adjustment |

Mixed invoices dalam satu order → type `billed` jika ada satu invoice billed.

---

## 6. Auto-approve (background)

Config: `omnichannel/sales-return-configuration` — `auto_approve`, `open_to_approve_duration` (minutes).

Command: `php artisan salesreturn:auto-approve` → `SalesReturnAutoApproveJob`.

Finance harus aware: SR open lebih lama dari duration bisa auto-approved tanpa manual Complete.

---

## 7. Acceptance Criteria (Finance QA)

1. Complete button hanya di `/accounting/sales-return`, tidak di SCM edit
2. Kolom Order/Return Price & COGS tampil dengan `with_price=1`
3. Approve billed → Credit Note ter-create
4. Approve unbilled → jurnal sales/AR, bukan CN
5. Lost qty tanpa Return Expense COA → approve blocked
6. COGS return value = average outbound (bukan latest stock date)
7. Partial return → remainder omni return duplicated

---

## Related Documents

| Doc | Path |
|-----|------|
| Canonical SR | [../supplychain-sales-returns/requirement.md](../supplychain-sales-returns/requirement.md) |
| KB Finance | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| Credit Note | [../accounting-credit-note/README.md](../accounting-credit-note/README.md) |
