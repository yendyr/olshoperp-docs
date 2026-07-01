---
doc_type: knowledge-base
menu: supplychain-purchase-requisition
menu_name: "Purchase Requisition"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Purchase Requisition — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## Ringkasan

**Purchase Requisition (PR)** adalah permintaan pembelian internal sebelum dibuatkan **Purchase Order (PO)**. PR menyimpan kebutuhan produk, qty, prioritas, dan tanggal delivery yang diharapkan.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Purchase Requisition |
| Route UI | `/supplychain/purchase-requisition` |
| Kode dokumen | `PR` |
| Tabel header | `scm_purchase_requisitions` |
| Tabel detail | `scm_purchase_requisition_detail` |

## Kapan dipakai

- Divisi/warehouse membutuhkan barang dari supplier.
- Procurement ingin mengumpulkan kebutuhan sebelum PO resmi.
- PO mode **With PR** mengambil baris outstanding dari PR yang sudah **approved**.

## Langkah operasional

### 1. Buat PR

1. Buka **Purchase Requisition** → **Create**.
2. Isi: tanggal transaksi, prioritas, required delivery date (opsional), deskripsi, referensi (opsional).
3. Simpan — status awal **`open`** (kode auto-generate prefix `PR` jika kosong).
4. Tambah detail produk (manual, bulk select, atau import Excel).
5. (Opsional) Upload lampiran header.

### 2. Isi detail

- Pilih produk aktif (bukan bundle, bukan random product).
- Qty harus bilangan bulat (whole number).
- Unit harus aktif (stock unit atau alternative unit).
- Detail mendukung **tree/parent-child** (parent qty harus 1).

### 3. Ajukan approval

1. PR tidak boleh status **`draft`** saat approve.
2. Minimal **1 baris detail**.
3. Klik **Approve** — workflow multi-level sesuai role.
4. Setelah approved, PR siap diproses ke PO.

### 4. Proses ke PO (With PR)

1. Buat PO dengan flag **With PR**.
2. Di panel **Outstanding PR**, pilih baris PR.
3. Saat PO approved: `processed_to_po_quantity` PR naik.
4. Jika semua qty PR terpenuhi → PR status **`complete`**.

## Status dokumen

| Status | Arti untuk operator |
|--------|---------------------|
| `draft` | Masih disusun; tidak bisa di-approve |
| `open` | Siap diisi detail / diajukan approval |
| `approved` | Disetujui; siap diproses ke PO |
| `processed` | Sebagian qty sudah masuk PO |
| `complete` | Semua qty PR sudah diproses ke PO |
| `rejected` | Ditolak; bisa diedit lalu diajukan ulang |
| `void` / `closed` | Dibatalkan / ditutup (sesuai hak akses) |

## Panel & fitur form

| Panel | Fungsi |
|-------|--------|
| Header Basic Information | Tanggal, prioritas, delivery date, deskripsi |
| Detail (tree / PrimeVue) | Produk, qty, unit, deskripsi baris |
| Approval Eligibility | Daftar approver eligible |
| Log Approval | Riwayat approval |
| Duplicate | Salin PR + detail ke draft baru (qty PO di-reset) |

## Troubleshooting

| Gejala | Kemungkinan penyebab | Tindakan |
|--------|---------------------|----------|
| Tidak bisa edit PR | Status sudah approved/processed/complete | Cek status; void/close jika diizinkan |
| Approve gagal — draft | Status masih draft | Ubah ke open atau isi ulang |
| Approve gagal — no detail | Belum ada produk | Tambah minimal 1 detail |
| Qty ditolak (decimal) | Qty bukan whole number | Masukkan bilangan bulat |
| Produk ditolak | Bundle atau random product | Pilih produk lain |
| Tanggal tidak bisa diubah | Sudah ada detail | Hapus detail dulu atau buat PR baru |
| Import masih jalan | Batch `PurchaseRequestImport` aktif | Tunggu import selesai |
| PR tidak muncul di PO | PR belum approved atau qty habis | Cek outstanding PR |

## Relasi menu

| Menu terkait | Route | Hubungan |
|--------------|-------|----------|
| Purchase Order | `supplychain/purchase-order` | PO With PR → konsumsi qty PR |
| Product | Supply Chain master | Master produk & unit |
| General Setting — Fiscal Period | — | Validasi tanggal transaksi |

## Istilah

| Istilah | Arti |
|---------|------|
| Outstanding PR | Baris PR approved yang belum/full diproses ke PO |
| With PR | Mode PO yang referensi detail PR |
| `prepared_to_po_quantity` | Qty PR yang sudah disiapkan ke PO (belum final approve PO) |
| `processed_to_po_quantity` | Qty PR yang sudah masuk PO approved |
