---
doc_type: knowledge-base
menu: supplychain-stock-opname
menu_name: "Stock Opname"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Stock Opname — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## Ringkasan

**Stock Opname** digunakan untuk mencatat hasil perhitungan fisik stok di gudang dan menyesuaikan selisih ke sistem. Dokumen disimpan sebagai `StockMutation` dengan flag `is_opname = 1` (kode prefix `SP`).

| Item | Nilai |
|------|-------|
| Menu SCM | Supply Chain → Stock Opname |
| Route UI | `/supplychain/stock-opname` |
| Menu Finance (approval) | Accounting → Stock Opname Approval |
| Route Finance | `/accounting/stock-opname-approval` |
| Tabel header | `scm_stock_mutations` (`is_opname = 1`) |
| Tabel detail | `scm_opname_details` |

## Kapan dipakai

- Audit fisik stok periodik di satu **warehouse origin**.
- Mencatat selisih antara stok sistem vs hitungan fisik per SKU/lokasi.
- Menghasilkan otomatis **Adjustment Addition** (selisih lebih) dan **Adjustment Deduction** (selisih kurang).

## Langkah operasional (SCM)

### 1. Buat dokumen opname

1. Buka **Stock Opname** → **Create**.
2. Isi: tanggal transaksi, **warehouse origin** (gudang induk opname).
3. Simpan — status `open` atau `draft`.

### 2. Isi detail opname

Untuk setiap produk/lokasi:

1. Pilih produk & warehouse destination (rak/lokasi).
2. Input **qty fisik** (opname quantity).
3. Sistem hitung selisih vs stok sistem saat tanggal transaksi:
   - Selisih **positif** → adjustment **in** (butuh harga unit)
   - Selisih **negatif** → adjustment **out**

Detail bisa ditambah manual, bulk dari available warehouse, atau **import Excel**.

### 3. Review adjustment otomatis

Saat detail disimpan, sistem membuat draft:

- **Adjustment Addition** — untuk baris `adjustment_type = in`
- **Adjustment Deduction** — untuk baris `adjustment_type = out`

Cek di panel terkait sebelum approve.

### 4. Approve (SCM)

1. Pastikan semua baris punya warehouse destination aktif.
2. Pastikan produk bukan tipe **Service**.
3. Harga unit adjustment in harus **bilangan bulat** (bukan desimal).
4. Klik **Approve**.
5. Sistem approve adjustment addition/deduction terkait, lalu approve header opname.

### 5. Approval Finance (jika dipakai)

Menu paralel **Stock Opname Approval** (`accounting/stock-opname-approval`) memakai entity `StockOpnameFA` — alur approve sama, audience finance/akuntansi.

## Status dokumen

| Status | Arti |
|--------|------|
| `draft` / `open` | Masih bisa edit detail |
| `approved` | Opname selesai; adjustment sudah diproses |
| `rejected` | Ditolak |

## Panel penting

| Panel | Fungsi |
|-------|--------|
| Header | Tanggal, warehouse origin |
| Tree Detail / Datalist Detail | Baris opname per produk |
| Available Warehouse | Bulk tambah produk dari stok tersedia |
| Link Adjustment | Referensi ke dokumen addition/deduction auto-generated |
| Approval Eligibility / Log | Workflow approval |

## Troubleshooting

| Gejala | Penyebab | Tindakan |
|--------|----------|----------|
| "failed to generate addition or deduction" | Qty adjustment tidak match dokumen auto-generated | Hapus & buat ulang detail bermasalah |
| Warehouse inactive | `warehouse_destination` nonaktif di master | Pilih warehouse aktif |
| Service product error | Produk tipe service tidak boleh opname | Ganti produk |
| Decimal unit price | Harga adjustment in desimal | Bulatkan harga ke integer |
| Destination warehouse empty | `warehouse_destination_id` null | Lengkapi lokasi per baris |
| Update in progress | Cache update detail aktif | Tunggu import/update selesai |

## Relasi menu

| Menu | Route | Hubungan |
|------|-------|----------|
| Stock Opname Approval | `accounting/stock-opname-approval` | Mirror finance — entity `StockOpnameFA` |
| Adjustment Addition | `supplychain/adjustment-addition` | Auto-generated untuk selisih lebih |
| Adjustment Deduction | `supplychain/adjustment-deduction` | Auto-generated untuk selisih kurang |
| Warehouse Structure | `supplychain/warehouse-structure` | Master lokasi destination |
| Real Stock | `supplychain/real-stock` | Referensi stok aktual |

## Istilah

| Istilah | Arti |
|---------|------|
| Opname Qty | Qty hasil hitung fisik |
| Adjustment In/Out | Penambahan / pengurangan stok akibat selisih |
| Warehouse Origin | Gudang induk sesi opname |
| Warehouse Destination | Lokasi/rak spesifik per baris detail |
