---
doc_type: requirement
menu: supplychain-mutation-inbound
menu_name: "Purchase Inbound"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# Purchase Inbound — Requirement Documentation

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.


**Modul:** SupplyChain  
**Audience:** PM, Operations, QA, Support, Developer  
**Status:** Sesuai perilaku sistem saat ini (AS-IS)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft from codebase analysis |

## 1. Ringkasan Eksekutif

Dokumen penerimaan barang dari supplier (Goods Receipt / GRN). Header disimpan di `scm_stock_mutations` sebagai subclass `StockMutationInbound` dengan `warehouse_destination` terisi, `warehouse_origin` null, `supplier_id` wajib, dan `is_inventory_adjustment = 0`. Kode transaksi prefix **`IN`**. Filter datalist: `warehouse_origin` null · `supplier_id` not null · `is_inventory_adjustment = 0` · `is_return_process = 0`.

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | User dengan permission `viewAny` melihat datalist | Policy `StockMutationInbound` | List |
| A-02 | User dengan permission `create` membuat header | store validation | Create |
| A-03 | Kode unik per company | unique rule `scm_stock_mutations.code` | Create |
| A-04 | Tanggal transaksi tidak di masa depan | Custom validation | Create/Update |
| A-05 | Fiscal period valid | `validate_fiscal_period()` | Create/Approve |
| A-06 | Detail wajib sebelum approve | count details > 0 | Approve |
| A-07 | Setelah approve, `can_update = false` | Model accessor | Post-approve |
| A-08 | Approval tercatat | `StockMutationApproval` | Approve |
| A-09 | Item stock berubah setelah approve | `ItemStockMutation` | Approve |

## 3. Validasi & Rules

| ID | Rule | Trigger | Pesan error (contoh) |
|----|------|---------|----------------------|
| V-01 | `transaction_date` required, not future | store/update | Transaction date cannot be greater than today |
| V-02 | `description` max 150 | store/update | validation max |
| V-03 | `transaction_status` in open,draft | store | Rule::in validation |
| V-04 | File attachment extension | store/update | validationExtensionFile |
| V-05 | Import in progress blocks approve | approve | Updating process is in progress |
| V-06 | No detail blocks approve | approve | doesn't have any detail data |
| V-07 | Reject sets `transaction_status = rejected` | approve rejection | The data successfully rejected |
| V-08 | Approve cache lock 60s | approve | Approval process is in progress |

### Catatan approve spesifik menu

Validasi gudang tujuan level ≤20 (smallest warehouse). Blok jika import detail sedang berjalan. Reject mengubah status ke `rejected`.

**Alur approve:** POST `mutation-inbound/{id}/approve` → `ItemStockMutation::approveInbound()` — update item stock, QC/inspection jika ada, set `transaction_status = approved`.

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | Datalist + filter SearchBuilder | GET `mutation-inbound` | JSON paginated rows |
| F-02 | Create header | POST `mutation-inbound` | Row `scm_stock_mutations`, code `IN` |
| F-03 | Update header | PUT `mutation-inbound/{id}` | Header updated if `can_update` |
| F-04 | Soft delete | DELETE `mutation-inbound/{id}` | `deleted_at` set if allowed |
| F-05 | Detail CRUD | nested resource | Rows di tabel detail |
| F-06 | Import Excel detail | POST upload routes | Async job + import log |
| F-07 | Export Excel | export-excel routes | Download / async export file |
| F-08 | Audit trail | GET `.../audit` | Audit log JSON |
| F-09 | Approval log | GET `.../log/approve` | Last approvals |
| F-10 | Approval eligibility | GET `.../approval-eligibility` | `can_approve` flags |
| F-11 | Print | GET `.../print` | PDF/print view |
| F-12 | Approve | POST `.../approve` | Stock mutation + item stock |

## 5. Permission & Dependencies

| Permission (Gate) | Aksi |
|-------------------|------|
| `viewAny` | Lihat datalist |
| `view` | Lihat detail form |
| `create` | Buat header |
| `update` | Edit header/detail |
| `delete` | Hapus (jika belum approved) |
| `approval` | Approve / reject |

**Dependencies:** Master Warehouse, Product, Unit; Fiscal Period; untuk inbound: Supplier/PO; untuk outbound: Sales Order (opsional); untuk adjustment: Accounting approval menus.

## 6. Relasi Menu

Menu terkait: **supplychain-purchase-order, supplychain-new-purchase-inbound, accounting-supplier-invoice**.

## 7. QA Test Notes

- [ ] Create header — validasi tanggal, gudang wajib, kode auto `IN`
- [ ] Tambah detail — qty, unit, product select2
- [ ] Edit header sebelum approve — attachment, description
- [ ] Blok edit setelah approve
- [ ] Approve happy path — cek item stock before/after
- [ ] Reject — status `rejected`, tidak ubah stock
- [ ] Import Excel — progress, error log, approve setelah selesai
- [ ] Export list dan detail
- [ ] Permission denied untuk role tanpa akses
- [ ] Cross-company scoping (`owned_by` dari token)

## 8. Known Gaps / Open Questions

- SCM Stock Deduction: route approve tidak terdaftar di SupplyChain Routes — approve hanya via Accounting.
- SCM Stock Addition: tombol approve disembunyikan di `menu=scm`; verifikasi E2E dengan Accounting.
- Middle detail (inbound/outbound/transfer): behavior async approve perlu test terpisah.

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| Manifest | [../_meta/manifest.yaml](../_meta/manifest.yaml) |
