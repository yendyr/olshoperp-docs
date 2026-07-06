---
doc_type: requirement
menu: supplychain-mutation-outbound
menu_name: "Outbound External"
version: 1.2
last_updated: 2026-07-04
owner: QA - Yemima
status: draft
---

# Outbound External — Requirement Documentation

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.


**Modul:** SupplyChain  
**Audience:** PM, Operations, QA, Support, Developer  
**Status:** Sesuai perilaku sistem saat ini (AS-IS)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft from codebase analysis |
| 1.1 | 2026-06-23 | QA - Yemima | Cross-reference Relasi Instant Settlement (Fase 1) |
| 1.2 | 2026-07-04 | QA - Yemima | Cross-reference Relasi Assembly + Master Unit |

## 1. Ringkasan Eksekutif

Dokumen pengeluaran stok keluar gudang (bukan transfer antar gudang). Subclass `StockMutationOutbound` dengan `warehouse_origin` terisi, `warehouse_destination` null, `is_inventory_adjustment = 0`. Kode transaksi prefix **`OT`**. Filter datalist: `warehouse_destination` null · `warehouse_origin` not null · `is_inventory_adjustment = 0` · `is_return_process = 0`.

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | User dengan permission `viewAny` melihat datalist | Policy `StockMutationOutbound` | List |
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

Tidak bisa approve jika terhubung langsung ke Sales Order header. Validasi struktur gudang origin. Import detail harus selesai.

**Alur approve:** POST `mutation-outbound/{id}/approve` → `ItemStockMutation::approveOutbound()` — kurangi item stock FIFO, optional auto journal COGS.

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | Datalist + filter SearchBuilder | GET `mutation-outbound` | JSON paginated rows |
| F-02 | Create header | POST `mutation-outbound` | Row `scm_stock_mutations`, code `OT` |
| F-03 | Update header | PUT `mutation-outbound/{id}` | Header updated if `can_update` |
| F-04 | Soft delete | DELETE `mutation-outbound/{id}` | `deleted_at` set if allowed |
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

Menu terkait: **sales-order-general, supplychain-delivery-order, accounting-customer-invoice**.

## Relasi Instant Settlement

**Dampak ke menu ini:** Instant Settlement **generate Outbound External** otomatis per order yang lolos validasi (potong stok WH 3PL). Dokumen OB hasil settlement punya referensi ke SO platform; jurnal COGS/HPP diposting saat OB di-approve (job settlement). Warning `zero_prevention` (nilai persediaan 0) tercatat di counter **Out Journal** settlement — bukan hard error import.

**Prasyarat dari menu ini agar settlement lolos:** SO harus sudah **Shipped WH 3PL** dengan stok available pada tanggal settle (`checkShipping`, `checkInboundDate`). Outbound manual untuk SO yang sama **tidak** menggantikan generate settlement — keduanya independen; hindari dobel outbound untuk qty yang sama.

**Independensi:** OB manual di menu ini tetap bisa dibuat tanpa settlement. Delete settlement **revert stok** dari OB hasil generate, tetapi **tidak** mengubah status wave/pick/pack. OB approved manual tidak otomatis terhubung ke batch settlement.

**Detail alur bulk:** [Instant Settlement](../accounting-settlement-upload/requirement.md) — § validasi stok, Out Journal warnings, delete chain.

Diagram integrasi: [Instant Settlement §10](../accounting-settlement-upload/requirement.md#10-relasi-menu--integrasi).

---

## Relasi Assembly

**Dampak ke menu ini:** Saat Assembly **Approve** (`WorkOrderApprovalJob`), sistem auto-create + auto-approve **Outbound** dengan:

| Aspek | Nilai |
|-------|-------|
| `type_so` | **`other`** (bukan linked ke Sales Order) |
| Origin | WIP warehouse (dari Warehouse Setting) |
| Destination | `null` |
| Referensi | `transaction_reference_class = WorkOrder` |
| Detail | Komponen BoM snapshot × assembly qty |
| Jurnal | Dr WIP, Cr Inventory per komponen (`JournalProcess::stockOutboundAutoJournal`) |

**Prasyarat dari menu ini agar Assembly lolos:** Stok komponen sudah ada di WIP (via TFI approved). COA WIP + Inventory valid per produk (Product COA Group).

**Independensi:** Outbound manual `type_so=other` di menu ini **independen** dari Assembly — tidak auto-link ke Work Order.

**Detail alur:** [Assembly requirement §5–§6](../supplychain-assembly/requirement.md) — Approve job step 3 (Outbound WIP).

---

## Relasi Master Unit

**Dampak ke menu ini:** Detail outbound punya `outbound_quantity_unit_id`; konversi ke base unit saat save/approve via observer.

**Prasyarat:** Unit **Active** di Master Unit; rate locked jika sudah `haveRelations()`.

**Detail:** [Master Unit requirement](../supplychain-unit/requirement.md).

## 7. QA Test Notes

- [ ] Create header — validasi tanggal, gudang wajib, kode auto `OT`
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
