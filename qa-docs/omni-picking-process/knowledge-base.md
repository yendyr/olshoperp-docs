---
doc_type: knowledge-base
menu: omni-picking-process
menu_name: "Picking Process"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Picking Process — Knowledge Base

> **Status: DRAFT** — Dokumentasi AS-IS pertama (2026-06-19). Belum melalui review QA/PM.

## 1. Apa itu Picking Process?

Menu **Picking Process** (`/omni/picking-process`) adalah antarmuka operasional gudang untuk **approve transfer internal** dari gudang proses (building origin) ke **virtual warehouse wave** (destination `sequence = 1`). Controller `TransferPickingController` membungkus `StockMutationTransferController` dengan filter khusus: hanya transfer yang destinasinya virtual WH level pertama.

Operator menyetujui dokumen via:

- **Scan QR** di DataList (kamera / barcode)
- Input manual kode transfer atau nomor Sales Order
- Approve dari form detail

Ini adalah langkah **picking** dalam rantai: Wave → hidden Transfer → **Picking Process (approve)** → Checking → Packing.

> **Penting:** Menu ini **bukan** [Picking List](../omni-picking-list/README.md). Picking List adalah dokumen picklist terpisah di modul Supply Chain.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Transfer Picking | `StockMutationTransfer` dengan dest virtual WH `sequence=1` |
| Hidden Transfer | TF wave (`is_visible=0`) dari `createTransferWave` |
| QR Approve | Scan barcode → `POST transfer-picking/{code}/approve` |
| TRX. REF. | Referensi wave (`Wave::class`) pada transfer |
| Approval Eligibility | Cek stok cukup sebelum approve |
| Skip Processing | Mode approve khusus lewati stage picking (unassign wave) |

## 3. Yang Bisa / Tidak Bisa

### Bisa

- Lihat DataList transfer picking (scoped transfer internal)
- Scan QR / input kode TF atau SO number untuk approve
- Buka detail transfer — tree stok, approval log, audit
- Bulk print label (template A) — AWB/barcode
- Generate picklist dari konteks wave (bulk action terkait)
- Cek approval eligibility per transfer

### Tidak Bisa

- Approve transfer yang sudah `APPROVED` — "scanned previously"
- Approve transfer tanpa destination `sequence=1`
- Approve jika stok tidak cukup (eligibility fail)
- Gunakan menu ini untuk picking list manual SCM

## 4. Cara Pakai

### 4.1 Approve via QR Scan

1. Buka **Picking Process** DataList
2. Aktifkan **QR Scanner** (tombol kamera)
3. Scan barcode pada dokumen / label transfer
4. Sistem decode payload → panggil approve API
5. Sukses: status berubah **Approved**; gagal: pesan error di toast

### 4.2 Approve via kode manual

Approve endpoint menerima:

- Kode transfer (`TF-...`)
- Kode Sales Order internal
- `platform_order_id` marketplace

### 4.3 Detail transfer

1. Klik baris → form detail
2. Review **Building Origin** → **Location** (virtual WH)
3. Tab approval log & audit trail
4. Approve jika eligible

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| "scanned previously" | Sudah APPROVED | Tidak perlu scan ulang |
| "enter transfer document number" | Kode tidak ditemukan / bukan picking TF | Cek dest sequence=1 |
| Eligibility fail | Stok origin tidak cukup | Cek Real Time Stock |
| SO tidak ready skip processing | Belum unassign wave / masih di stage picking | Ikuti SOP skip wave |

## 6. FAQ

**Q: Kenapa destination harus sequence=1?**  
A: Virtual WH wave dibuat sebagai child WH proses dengan `sequence=1` — ini menandai slot wave buffer untuk operasi picking.

**Q: Beda dengan Picking List?**  
A: **Picking Process** = approve mutasi transfer wave. **Picking List** = dokumen daftar item yang harus diambil picker — menu dan controller berbeda (`PickingListController` vs `TransferPickingController`).

## Relasi Instant Settlement (operator)

Picking adalah langkah pertama operasional setelah wave. Settlement butuh order yang sudah melewati **pick → check → pack → collect → DO → Shipped**.

Detail rantai: [Instant Settlement](../accounting-settlement-upload/requirement.md) · [Waves Management](../omni-waves-management/requirement.md)
