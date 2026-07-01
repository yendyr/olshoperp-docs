---
doc_type: knowledge-base
menu: supplychain-failed-ship
menu_name: "Failed Ship"
version: 2.3
last_updated: 2026-06-26
owner: QA - Yemima
status: review
audience: operator
---

# Failed Ship — Knowledge Base

Panduan operator untuk menu **Failed Ship** — menangani paket COD gagal setelah order **Shipped** (barang sudah di gudang 3PL) tetapi **belum settlement**.

---

## 1. Kapan Pakai Failed Ship?

| Situasi | Menu |
|---------|------|
| Buyer tolak/tidak terima, order sudah Shipped, **belum** ada invoice/outbound | **Failed Ship** |
| Buyer retur setelah order **sudah settlement** | **Sales Return** |

**Jangan** proses Failed Ship jika order sudah punya **Sales Invoice** atau **Outbound** — termasuk yang masih **belum di-approve** (status open/draft). Sistem akan menolak scan dengan pesan *already been settled*. Gunakan **Sales Return** untuk order yang sudah settlement.

### Invoice / Outbound unapproved

Jika order punya SI atau Outbound yang masih open:
- Order **tidak boleh** di-execute Failed Ship (scan ditolak).
- Di menu lain (mis. platform return table) referensi invoice/outbound bisa **tampil** sebagai informasi, tapi bukan berarti eligible FS.

---

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **FS** | Failed Ship — dokumen penyesuaian stok pasca gagal kirim |
| **Shipper / Shipper Name** | Gudang 3PL tempat paket terakhir (asal stok FS) |
| **Location** | Gudang Level 20 tujuan **restock** (rak tanpa sub-gudang) |
| **Restock Qty** | Barang kembali fisik → dipindah ke Location |
| **Lost Qty** | Barang hilang → Stock Deduction (Return Expense) |
| **Scrap / Defect / Broken Qty** | Barang rusak → dipindah ke gudang scrap (dari Setting Warehouse) |
| **Total FS Qty** | Restock + Lost + Scrap (tidak boleh > Product Qty) |
| **Prepared** | Qty sudah masuk FS, belum approve |
| **Processed** | Qty sudah di-approve FS |
| **Outstanding** | Order/produk Shipped yang belum masuk detail FS |

---

## 3. Alur Kerja Operator

### Via Index — Scan Order (cara utama)

1. Buka **Supply Chain → Failed Ship**.
2. Isi **Warehouse Location** (Level 20) dan **CCTV Location**.
3. Scan / ketik **Platform Order ID** atau **SO Code** → **Use** (atau scan langsung).
4. Sistem auto-create FS + isi semua detail produk order.
5. Edit qty Restock / Lost / Broken per produk → **Approve**.

Ini menggantikan field "Select Order" di dokumen requirement bisnis — fungsinya sama.

### 3.2 Via Form Manual (layout V1 — jika diaktifkan)

1. **Create** → isi Basic Information:
   - **Transaction Code** — kosongkan untuk auto FS
   - **Location** * (wajib) — gudang Level 20
   - **Shipper Name** * (wajib) — gudang 3PL
   - **Transaction Date** * 
2. **Save & Next**.
3. Section **Shipped Sales Order** — pilih produk/order → klik **Use**.
4. Section **Failed Ship Detail** — edit inline qty Restock / Lost / Defect.
5. **Approve**.

### 3.3 Set Location (UI checking-style)

Jika form meminta lokasi CCTV:
1. Buka **Set Location** atau flow set-location.
2. Pilih lokasi processing → status draft berubah **open**.

---

## 4. Tombol & Fungsi UI

### 4.1 Halaman Index (Datalist)

| Tombol / Elemen | Fungsi |
|-----------------|--------|
| **Create** | Buat FS baru (form manual) |
| **Warehouse Location** | Pilih gudang tujuan restock sebelum scan |
| **CCTV Location** | Pilih lokasi CCTV proses |
| **Scan / input SO** | Cari order by kode internal atau platform → auto-create FS |
| **Export** (panel slider) | Download data FS — pilih **With Details** atau **Without Details** |
| **Filter** (SearchBuilder) | Filter kolom datalist |
| **FS Status** (klik pada baris) | Buka detail FS jika sudah ada dokumen |
| **Sales Platform Returns** (pill) | Tabel return API marketplace untuk order **belum outbound** — kandidat arah Failed Ship, bukan Sales Return |

> Pill ini **berbeda** dengan section Platform di menu **Sales Return**: di Sales Return hanya tampil return yang order-nya **sudah full outbound** (sudah settlement path).

### 4.2 Form — Basic Information

| Tombol | Fungsi |
|--------|--------|
| **Save & Next** | Simpan header baru, lanjut ke section berikutnya |
| **Save All** | Simpan perubahan header (draft/open) |
| **Draft / Open** | Ubah status transaksi header |

### 4.3 Section Shipped Sales Order (Outstanding)

| Tombol | Fungsi |
|--------|--------|
| **Group by Product / Group by Order** | Ganti tampilan datalist outstanding |
| **Use** (per baris) | Masukkan produk/order ke Failed Ship Detail |

### 4.4 Section Failed Ship Detail

| Tombol / Kolom | Fungsi |
|----------------|--------|
| **Restock Qty** (inline) | Qty yang akan dikembalikan ke Location |
| **Lost Items** (inline) | Qty hilang — stok berkurang (Return Expense) |
| **Defect/Broken Items** (inline) | Qty rusak — pindah ke gudang scrap |
| **Total FS Qty** | Hitung otomatis — harus ≤ Product Qty |
| **Delete** (action) | Hapus baris dari detail → kembali ke outstanding |
| **Group by Product / Order** | Toggle tampilan detail |

### 4.5 Approval & Sidebar

| Tombol | Fungsi |
|--------|--------|
| **Approve** | Setujui FS — generate perpindahan stok & dokumen turunan |
| **Approval** (menu sidebar) | Lihat riwayat approval |
| **Audit Log** | Lihat log perubahan field |
| **Print Detail** | Cetak detail FS |
| **Void Doc** | Void dokumen (jika permission & status mengizinkan) |
| **Close Doc** | Tutup dokumen |
| **Pause** | Jeda proses + wajib isi alasan |
| **Resume** | Lanjutkan proses setelah pause |

---

## 5. Validasi yang Sering Ditemui

| Pesan | Penyebab | Solusi |
|-------|----------|--------|
| Already been settled | Order punya invoice/outbound (termasuk open/draft) | Pakai **Sales Return** |
| Not eligible / not Shipped | Order belum lewat checking–packing–DO–3PL | Selesaikan fulfillment dulu |
| Location has no scrap setup | WH Location belum punya scrap di Warehouse Setting | Setting → Warehouse Scrap & Void |
| Delivery order not approved | DO belum approve | Approve DO |
| FS date < DO date | Tanggal FS lebih awal dari DO | Sesuaikan transaction date |
| Quantity cannot be greater than sales order quantity | Total FS > Product Qty | Kurangi Restock/Lost/Scrap |
| Cannot settle - failed shipment status | Upload settlement saat FS masih **open** | Approve atau hapus FS dulu |
| Shipper field required | Header belum pilih 3PL | Pilih Shipper Name |

---

## 6. Dampak ke Settlement & Sales Return

### Settlement

| Kondisi FS | Dampak |
|------------|--------|
| FS **open** (belum approve) | Upload settlement **gagal total** |
| FS **approved** | Invoice & outbound per produk pakai **qty sisa** setelah FS |

### Sales Return (setelah settled)

- Return hanya bisa jika order sudah punya **outbound**.
- Qty return **maksimal = qty outbound** per produk (bukan qty order penuh jika pernah FS).
- Contoh: order 10, FS 3, outbound 7 → max return 7.

**Tips:** Approve Failed Ship **sebelum** settlement agar qty net match kondisi fisik.

### Rantai menu sebelum Failed Ship

Stok order bergerak lewat **Picking → Checking → Packing → Collecting → Delivery Order → Shipped (3PL)**. Semua perpindahan tercatat sebagai Transfer Internal (`process_type` picking/checking/packing/shipping/shipping do) — lihat menu **Transfer Internal** dengan opsi **Show Virtual** untuk audit trail.

Setelah di 3PL, baru eligible Failed Ship. Detail: [requirement §3.6](./requirement.md#36-peta-relasi-menu-fulfillment--failed-ship--settlement).

---

## 7. Melihat Status di Sales Order

Di detail Sales Order, kolom **Failed Ship Status** menampilkan **Prepared** / **Processed** berdasarkan kolom qty (`prepared_to_failed_ship_quantity` / `processed_to_failed_ship_quantity`) — bukan flag terpisah.

---

## 8. Export Data

1. Di index Failed Ship, buka panel **Export**.
2. Pilih:
   - **With Details** — per produk (termasuk Restock, Lost, Defect)
   - **Without Details** — per order/header saja
3. Tunggu job selesai → download dari daftar file export.

**Import:** belum tersedia. Hanya **Export** yang ada.

---

## 9. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Order tidak muncul di index | Belum Shipped atau sudah settled | Cek processing status & qty out/invoice di SO detail |
| Order tampil di index tapi scan ditolak | Multi-SKU: sebagian baris sudah settled | Proses via Sales Return untuk baris settled; known UX gap |
| Tidak bisa ubah Shipper | Sudah ada detail FS | Hapus detail atau buat FS baru |
| Export stuck | Job masih jalan / timeout | Tunggu atau cek export-progress |
| Scrap tidak ter-generate saat approve | Scrap WH belum dikonfigurasi | Cek Warehouse Setting parent Location |
| Dua tampilan form berbeda | Ada 2 versi UI di codebase | UI aktif: index scan + form checking; layout section ada di V1 |

---

## 10. Do's and Don'ts

### Do

- Pilih Location yang sudah punya **scrap setup** di Warehouse Setting
- Isi Shipper untuk memudahkan filter datalist
- Cek Total FS Qty sebelum approve
- Proses FS **sebelum** settlement jika order gagal kirim

### Don't

- Jangan FS order yang sudah settled
- Jangan FS order void / belum Shipped
- Jangan upload settlement saat masih ada FS **open**
- Jangan asumsikan Lost/Scrap asalnya bukan dari 3PL — semua dari shipper

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Instant Settlement | [accounting-settlement-upload/knowledge-base.md](../accounting-settlement-upload/knowledge-base.md) |
