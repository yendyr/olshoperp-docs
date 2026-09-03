---
doc_type: requirement
menu: supplychain-adjustment-addition
menu_name: "Stock Addition"
version: 1.2
last_updated: 2026-09-03
owner: QA - Yemima
status: review
---

# Stock Addition — Requirement Documentation

> Status **review**. AS-IS mutasi stok + **§11 Colli v2 TO-BE** (parity New Purchase Inbound §8) — card [ETM-15633](https://erpintegration.atlassian.net/browse/ETM-15633).


**Modul:** SupplyChain  
**Audience:** PM, Operations, QA, Support, Developer  
**Status:** AS-IS + TO-BE Colli v2 di §11

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft from codebase analysis |
| 1.1 | 2026-07-09 | QA - Yemima | §9 Benchmark COGS v1.1 · §10 relasi Stock Remapping |
| 1.2 | 2026-09-03 | QA - Yemima | §11 Colli v2 TO-BE (parity PI §8) · ETM-15633 · Relates ETM-15610 |

## 1. Ringkasan Eksekutif

Penambahan stok manual (inventory adjustment inbound). `StockMutationAddition` dengan `is_inventory_adjustment = 1`, `supplier_id` null, kode `AI`. Detail di `InboundMutationDetail`. Kode transaksi prefix **`AI`**. Filter datalist: `is_inventory_adjustment = 1` · `warehouse_origin` null · `supplier_id` null · `is_return_process = 0`.

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | User dengan permission `viewAny` melihat datalist | Policy `StockMutationAddition` | List |
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

Tombol Approve di UI SCM disembunyikan (`menu === scm`). Finance approve di menu Stock Addition Approval. Auto-generated dari Stock Opname tidak boleh diubah SCM.

**Alur approve:** SCM: create/edit only. Approve via Accounting: POST `accounting/adjustment-inbound/{id}/approve` (`InboundValueAdjustmentController`).

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | Datalist + filter SearchBuilder | GET `adjustment-addition` | JSON paginated rows |
| F-02 | Create header | POST `adjustment-addition` | Row `scm_stock_mutations`, code `AI` |
| F-03 | Update header | PUT `adjustment-addition/{id}` | Header updated if `can_update` |
| F-04 | Soft delete | DELETE `adjustment-addition/{id}` | `deleted_at` set if allowed |
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

Menu terkait: **accounting-adjustment-inbound**, **supplychain-stock-opname**, **supplychain-colli-type**, **supplychain-new-purchase-inbound** (kanonik Colli v2), Stock Monitoring.

## 7. QA Test Notes

- [ ] Create header — validasi tanggal, gudang wajib, kode auto `AI`
- [ ] Tambah detail — qty, unit, product select2
- [ ] Edit header sebelum approve — attachment, description
- [ ] Blok edit setelah approve
- [ ] Approve happy path — cek item stock before/after
- [ ] Reject — status `rejected`, tidak ubah stock
- [ ] Import Excel — progress, error log, approve setelah selesai
- [ ] Export list dan detail
- [ ] Permission denied untuk role tanpa akses
- [ ] Cross-company scoping (`owned_by` dari token)
- [ ] Colli v2 — Existing/New, WH exact, bulk multi-SKU, import 1 kolom, lifecycle (§11)

## 8. Known Gaps / Open Questions

- SCM Stock Deduction: route approve tidak terdaftar di SupplyChain Routes — approve hanya via Accounting.
- SCM Stock Addition: tombol approve disembunyikan di `menu=scm`; verifikasi E2E dengan Accounting.
- Middle detail (inbound/outbound/transfer): behavior async approve perlu test terpisah.

## 9. Relasi Benchmark COGS (v1.1)

| Arah | Detail |
|------|--------|
| **Addition → Benchmark** | Stock Addition manual (approved) dengan `each_price_before_vat` di detail **ikut** sumber kalkulasi [Benchmark COGS](../accounting-product-benchmark-price/requirement.md) v1.1 |
| **Bukan sumber** | Addition auto dari opname — dihitung sebagai Stock Opname IN, bukan addition manual |

Detail: [Benchmark COGS requirement §7](../accounting-product-benchmark-price/requirement.md#7-integrasi-stock-opname-stock-addition--opening-stock) · [pending items §13](../accounting-product-benchmark-price/requirement.md#13-hal-yang-perlu-diperhatikan--pending-items)

## 10. Relasi Stock Remapping (TO-BE)

| Arah | Detail |
|------|--------|
| **Stock Remapping → Addition** | Saat approve [Stock Remapping](../accounting-stock-remapping/requirement.md), sistem auto-generate & auto-approve dokumen **`AI`** per baris (SKU Remapped To), trx date RM + 10 detik, unit price = stock ID origin |
| Manual AI | Hindari double movement untuk kasus remap variant — gunakan Stock Remapping ([P-SRM-13](../accounting-stock-remapping/requirement.md#153-relasi--loophole-operasional)) |

Detail: [accounting-stock-remapping requirement §8](../accounting-stock-remapping/requirement.md#8-approval--dokumen-auto-generated)

## 11. Fitur Colli v2 (TO-BE — ETM-15633)

> **Parity** dengan [New Purchase Inbound §8](../supplychain-new-purchase-inbound/requirement.md#8-fitur-colli-v2-to-be--14-agu-2026) / SoT `_meta/sot/supplychain-purchase-inbound-colli-v2-source-of-truth.md`.  
> Card: [ETM-15633](https://erpintegration.atlassian.net/browse/ETM-15633) · Relates PI: [ETM-15610](https://erpintegration.atlassian.net/browse/ETM-15610).  
> **Takedown Colli ID v1** (jumlah koli × isi → N Stock ID) diganti UX v2. Qty / harga baris addition **tidak diubah** oleh assign colli.

### 11.1 Konsep

Satu **Colli code** (prefix `COL`) menampung banyak baris SKU di **satu Location Destination** (WH terkecil / exact). Availability qty di dalam colli baru bermakna setelah dokumen **Approved** lewat Stock Addition Approval (Item Stock). Assign colli **opsional** (NULL OK). Maks **1** colli per baris detail.

Master jenis wadah: [Colli Type](../supplychain-colli-type/requirement.md) (Active + Default ON preselect New Colli).

### 11.2 Existing vs New

| Mode | Aturan |
|------|--------|
| **Existing Colli** | Select colli code; filter **exact** WH = Location Destination header. WH mismatch → tolak |
| **New Colli** | Generate code baru; lokasi = WH header; **Choose Colli Type** (Active only; Default ON preselect) |
| Toolbar / bulk | Checkbox multi-baris → Assign Existing/New + Type + **Save** → banyak SKU **satu** colli |

### 11.3 Jalur insert SKU (adaptasi vs PI)

| Jalur Stock Addition | Qty | Assign colli |
|----------------------|-----|--------------|
| Select product / manual detail | Sesuai input user (AS-IS) | Setelah baris ada: checkbox / inline |
| Import Excel | Sesuai kolom qty import | Kolom **Colli** (lihat §11.5) |

**Tidak ada** jalur Available Use / outstanding PO (beda dari PI §8.3).

### 11.4 Lifecycle Colli code

| Event dokumen | Colli **baru** (belum pernah Approve di trx mana pun) | Colli existing / pernah Approve |
|---------------|------------------------------------------------------|----------------------------------|
| Assign, belum Approve | Boleh muncul di list Multisku Colli; **bisa hilang** jika semua draft yang mereferensikan dihapus | Tetap |
| **Approve** (Accounting Stock Addition Approval) | **Permanen** | — |
| Reject lalu Delete / Delete draft | Hilang jika tidak direferensikan trx lain yang masih hidup | Tidak hapus |

### 11.5 Import Colli v2

Satu kolom **Colli**:

| Isi sel | Arti |
|---------|------|
| Numbering sama di banyak baris | Satu **New Colli** bersama → satu code baru |
| Code colli yang sudah ada | **Existing** — WH colli **exact** = header |
| Kosong | Tanpa Colli v2 (NULL) — **boleh** |

Template Colli ID v1 (`colli` × `colli_qty`) diganti.

### 11.6 Contoh kasus

| # | Situasi | Expected |
|---|---------|----------|
| 1 | Select 3 SKU, bulk New Colli type Box | 1 COL baru; 3 baris linked |
| 2 | 2 SKU + Existing COL WH sama | Kedua baris ke COL itu |
| 3 | Existing COL beda WH | Tolak — exact WH |
| 4 | Baris tanpa colli | NULL OK |
| 5 | 1 baris 2 colli | Tidak boleh |
| 6 | Hapus draft; COL baru tidak dipakai lain, belum Approve | COL hilang dari list |
| 7 | Reject lalu delete (belum Approve) | Sama — COL baru hilang |
| 8 | Import numbering `1` + code `COL-ABC` | Group 1 → 1 new COL; existing jika WH match |
| 9 | New Colli tanpa Type, ada default master | Type = Default ON |

### 11.7 Adaptasi vs Purchase Inbound (wajib)

| Aspek | Purchase Inbound | Stock Addition |
|-------|------------------|----------------|
| Sumber qty | Outstanding PO / Available Use | Select Product / import — **tanpa** Available Use PO |
| Approve UI | Flow inbound SCM | **Stock Addition Approval** (Accounting); SCM create/edit |
| Supplier / PO | Ada | Tidak (inventory adjustment) |
| Qty rule Colli | Qty GRN tidak diubah assign colli | Qty / harga addition tidak diubah assign colli |

Sisanya (Existing/New, WH exact, Colli Type, import 1 kolom, lifecycle, 1 colli/baris, optional NULL) **ikut PI §8**.

### 11.8 Acceptance Criteria (TO-BE)

- [ ] Existing Colli: WH **exact** = Location Destination; mismatch ditolak
- [ ] New Colli: generate `COL…` + Colli Type (Default ON preselect)
- [ ] Bulk assign ≥2 SKU → satu colli code
- [ ] Maks 1 colli per baris; NULL OK
- [ ] Setelah Approve Accounting: link permanen; colli tampil di Stock Monitoring
- [ ] Hapus draft / reject+delete: colli baru belum Approve & tidak direferensikan → hilang
- [ ] Import 1 kolom Colli (numbering / existing / kosong); colli tidak wajib
- [ ] Colli Type Inactive tidak muncul di New Colli
- [ ] Tidak ada regresi qty/harga detail karena assign colli saja

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| PI Colli v2 (kanonik) | [../supplychain-new-purchase-inbound/requirement.md](../supplychain-new-purchase-inbound/requirement.md) §8 |
| Colli Type | [../supplychain-colli-type/requirement.md](../supplychain-colli-type/requirement.md) |
| Manifest | [../_meta/manifest.yaml](../_meta/manifest.yaml) |
