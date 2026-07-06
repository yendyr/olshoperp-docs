---
doc_type: requirement
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
version: 1.2
last_updated: 2026-07-05
owner: QA - Yemima
status: draft
---

# Transfer Internal — Requirement Documentation

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.


**Modul:** SupplyChain  
**Audience:** PM, Operations, QA, Support, Developer  
**Status:** Sesuai perilaku sistem saat ini (AS-IS)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft from codebase analysis |
| 1.1 | 2026-07-04 | QA - Yemima | Cross-reference Relasi Assembly + Master Unit |
| 1.2 | 2026-07-05 | QA - Yemima | Relasi Manual Picking List (TF_INTERNAL auto-approve) |

## 1. Ringkasan Eksekutif

Perpindahan stok antar lokasi/gudang dalam satu company. UI route `mutation-transfer-internal`, API resource `mutation-transfer`. `type = tf internal`, kode prefix `TFI`. Kode transaksi prefix **`TFI`**. Filter datalist: `type = tf internal` · `is_inventory_adjustment = 0` · `process_type` null (bukan scrap/void/failed ship).

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | User dengan permission `viewAny` melihat datalist | Policy `StockMutationTransfer` | List |
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

Origin dan destination tidak boleh sama per detail. Warehouse tree harus valid (parent-child). Import transfer harus selesai.

**Alur approve:** POST `mutation-transfer/{id}/approve` → validasi semua detail punya `warehouse_destination_id` → `ItemStockMutation` transfer internal — kurangi origin, tambah destination.

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | Datalist + filter SearchBuilder | GET `mutation-transfer` | JSON paginated rows |
| F-02 | Create header | POST `mutation-transfer` | Row `scm_stock_mutations`, code `TFI` |
| F-03 | Update header | PUT `mutation-transfer/{id}` | Header updated if `can_update` |
| F-04 | Soft delete | DELETE `mutation-transfer/{id}` | `deleted_at` set if allowed |
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

Menu terkait: **supplychain-warehouse-structure, omni-picking-process, supplychain-manual-picking-list, [Assembly](../supplychain-assembly/), [Master Unit](../supplychain-unit/)**.

---

## Relasi Assembly

**Dampak ke menu ini:** Saat Assembly status **Open**, sistem auto-create **Transfer Internal** (`TFI`) per detail line:

| Aspek | Nilai |
|-------|-------|
| Origin | Building Origin (user-selected) |
| Destination | WIP warehouse dari Warehouse Setting |
| Status awal | **open** (approved saat Assembly Approve job) |
| Referensi | `transaction_reference_class = WorkOrder` |
| Detail qty | `bom_snapshot_qty × assembly_qty` per komponen |
| FIFO | `item_stock_id = null` → auto-pick dari building tree |

**Prasyarat dari menu ini agar Assembly lolos:** Origin ≠ WIP; stok komponen cukup di building tree (exclude In Transit, virtual, WIP). Saat Assembly **delete** (Draft/Open), TFI linked ikut di-destroy.

**Independensi:** TFI manual di menu ini **independen** dari Assembly — tidak auto-link ke Work Order kecuali dibuat programmatically.

**Detail alur:** [Assembly requirement §5](../supplychain-assembly/requirement.md) — stock movement chain step 1 (Open).

---

## Relasi Master Unit

**Dampak ke menu ini:** Setiap detail TFI punya `transfer_quantity_unit_id`. Saat approve, `MainModelObserver` konversi qty ke base unit (`*_in_base_unit`).

**Prasyarat:** Unit harus **Active** (`status=1`) di Master Unit agar muncul di select2 detail.

**Detail:** [Master Unit requirement](../supplychain-unit/requirement.md) — §2 Conversion Rate, §6 Transaction flow.

---

## Relasi Manual Picking List

**Dampak ke menu ini:** Manual Picking List **bukan** TFI manual terpisah — header PL **adalah** dokumen `TF_INTERNAL` dengan `process_type = 'manual picking'` dan kode prefix **`PL-`** (bukan `TFI-`).

| Aspek | Nilai |
|-------|-------|
| Origin per detail | Rack hasil FIFO alloc (`warehouse_origin_id` / `item_stock_id`) |
| Destination | WH Outrack dari Warehouse Setting (`PICKING_TYPE`) |
| Approve trigger | Complete Picking → `StockMutationTransferController@approve(..., is_from_pl: true)` |
| Qty yang di-transfer | Hanya **picked** qty per line (line di-shrink sebelum approve) |
| Reservation | Insert detail → `reserved_quantity ↑`; approve/unpick/delete → release |
| Lost qty | **Bukan** TFI — lewat Stock Deduction `AO-*` (`process_type = lost`) |
| New PL qty | Generate MPL baru — bukan TFI |

**Perbedaan dari TFI menu standar:**

| Aspek | TFI menu (`TFI-*`) | Manual PL (`PL-*`) |
|-------|-------------------|-------------------|
| Create | User manual di menu Transfer Internal | User di Manual Picking List |
| Approve | User klik Approve | Auto saat Complete Picking |
| Picking UI | Tidak ada | Shared Omni picking process |
| `process_type` | null | `'manual picking'` |

**Stock movement saat approve PL:** Sama dengan TFI approve — kurangi stok di rack origin, tambah di Outrack destination via `ItemStockMutation`.

**Detail alur:** [Manual Picking List requirement §12](../supplychain-manual-picking-list/requirement.md)

---

## 7. QA Test Notes

- [ ] Create header — validasi tanggal, gudang wajib, kode auto `TFI`
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
| Assembly | [../supplychain-assembly/requirement.md](../supplychain-assembly/requirement.md) |
| Master Unit | [../supplychain-unit/requirement.md](../supplychain-unit/requirement.md) |
| Manifest | [../_meta/manifest.yaml](../_meta/manifest.yaml) |
