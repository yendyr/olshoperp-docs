---
doc_type: knowledge-base
menu: supplychain-manual-picking-list
menu_name: "Manual Picking List"
version: 2.0
last_updated: 2026-07-05
owner: QA - Yemima
status: review
audience: operator
---

# Manual Picking List — Knowledge Base

Panduan operator untuk picking manual ad-hoc di gudang (bukan dari Sales Order / Wave).

**Menu:** Supply Chain → Operations → **Manual Picking List**  
**Kode transaksi:** `PL-*`

---

## 1. Kapan dipakai?

- Picking stok ke area Outrack **tanpa** wave / sales order.
- Persiapan barang ke lokasi picking sebelum proses lain.
- Re-pick sisa qty lewat **Qty New PL** setelah picking incomplete.

> **Bukan** menu Omni Picking List — meski UI proses picking mirip, Manual PL dibuat manual di SCM.

---

## 2. Prasyarat

Sebelum buat PL, pastikan:

1. **Building Origin** sudah benar (gudang building level 19+).
2. **Outrack Picking** sudah di-set di **Warehouse Setting** untuk building tersebut — tanpa ini, create PL gagal.
3. Stok produk ada di rack (bukan Outrack/WIP) dengan qty available cukup.

---

## 3. Alur kerja lengkap

### Step 1 — Buat Picking List

1. Klik **Create** → sistem auto-save header (kode `PL-*` ter-generate).
2. Pilih **Building Origin** (default: building PL terakhir).
3. Opsional: **Assign To** (petugas picking).
4. Set status **Open** jika ingin langsung siap Start (default **Draft**).

### Step 2 — Tambah produk

1. Di tab **Picking List Detail**, pilih produk dari dropdown.
2. Sistem alokasi rack otomatis (Single Rack dulu, lalu FIFO).
3. Stok langsung **di-reserve** — qty available berkurang di Real Time Stock.
4. Alternatif: **Bulk FIFO** atau **Import Excel**.

**Jika produk tidak muncul:** stok habis, ada di Outrack/WIP, produk bundle/random, atau inbound date setelah tanggal PL.

### Step 3 — Start Picking

1. Ubah status ke **Open** (Draft **tidak bisa** Start).
2. Dari datalist, klik **Start Picking**.
3. **Set Location** — pilih cart/lokasi picking.
4. Sistem set `Start` timestamp → status picking **In Progress**.

### Step 4 — Proses picking

Di halaman **Process Picking**:

| Aksi | Cara |
|------|------|
| Tandai picked | Klik icon kotak → hijau (✓) |
| Input Lost Qty | Isi di baris incomplete |
| Input Qty New PL | Isi di baris incomplete — akan buat PL baru |
| Pause | Tombol Pause + alasan |
| Resume | Lanjutkan dari pause |

**Rumus qty:**

```
Qty to Pick = Picked + Lost + Qty New PL + Unpicked
Unpicked    = otomatis (sisa yang tidak di-input)
```

### Step 5 — Complete Picking

1. Klik **Complete** → konfirmasi jika masih ada unpicked.
2. Sistem otomatis:
   - **Picked** → transfer stok rack → Outrack
   - **Lost** → Stock Deduction (`AO-*`)
   - **Qty New PL** → buat Manual PL baru (status Open)
   - **Unpicked** → lepas reservation, kurangi qty line
3. Lihat **Completion Summary** untuk link dokumen turunan.

---

## 4. Membaca status di datalist

| Kolom | Arti |
|-------|------|
| **Unpicked** | Belum start picking |
| **In Progress** | Sudah start, belum complete |
| **Paused** | Picking dijeda (hover icon komentar untuk alasan) |
| **Complete** | Selesai (end timestamp terisi) |
| **Draft** | Belum bisa Start Picking |
| **Open** | Siap Start / sedang proses |
| **Approved** | Complete picking selesai |

**Pill "Incomplete Picklist"** — jumlah PL yang sudah start tapi belum complete.

---

## 5. Pergerakan stok (ringkas)

| Tahap | Efek ke stok |
|-------|--------------|
| Tambah produk ke detail | Available ↓, Reserved ↑ (rack asal) |
| Complete — Picked | Stok pindah rack → Outrack |
| Complete — Lost | Stok keluar via Adjustment Deduction |
| Complete — Unpicked | Reservation dilepas |
| Hapus detail/header (draft) | Reservation dilepas |
| New PL | Reserve ulang di PL baru |

---

## 6. Do's & Don'ts

### ✅ Lakukan

- Set **Open** sebelum Start Picking.
- Konfigurasi Outrack di Warehouse Setting dulu.
- Pakai **Qty New PL** untuk sisa yang perlu di-pick ulang.

### ❌ Jangan

- Start picking saat masih **Draft**.
- Edit header setelah picking dimulai.
- Expect stok dari Outrack/WIP sebagai sumber picking.

---

## 7. Troubleshooting

| Gejala | Penyebab | Tindakan |
|--------|----------|----------|
| Create PL gagal | Outrack belum di-set | Warehouse Setting → Outrack Picking |
| Produk tidak available | Stok di Outrack/WIP atau tidak cukup | Cek Real Time Stock, pilih building lain |
| Start Picking disabled | Status Draft | Ubah ke Open |
| Tidak bisa edit header | Picking sudah start | Hanya pause/resume atau buat PL baru |
| Assignee error | User lain yang ditugaskan | Login sebagai assignee atau ubah assignee sebelum start |
| Incomplete pill tinggi | Banyak PL belum complete | Filter incomplete, selesaikan atau pause |
| Link TF di summary salah menu | Known bug (omni URL) | Buka manual dari SCM datalist by code |

---

## 8. Menu terkait

| Menu | Hubungan |
|------|----------|
| [Warehouse Setting](../supplychain-setting/knowledge-base.md) | Outrack Picking destination |
| [Warehouse Structure](../supplychain-warehouse-structure/knowledge-base.md) | Hierarki building → rack |
| [Transfer Internal](../supplychain-mutation-transfer-internal/knowledge-base.md) | PL = TF_INTERNAL saat complete picked |
| [Location](../supplychain-location/knowledge-base.md) | Cart/lokasi saat set-location |
| Real Time Stock | Monitor available/reserved |

---

## Related Documents

- [Requirement](./requirement.md) — validasi & acceptance criteria lengkap
- [Technical](./technical.md) — API, DB, sequence diagram
