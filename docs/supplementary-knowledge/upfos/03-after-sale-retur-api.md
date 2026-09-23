# Modul 3: Manajemen Retur & Purna Jual (After-Sale API) — UPFOS Open API

> **Status:** Modul Pembelajaran & Referensi Teknis Komprehensif  
> **Target Audiens:** QA Engineer, Customer Service Lead, Warehouse QC Specialist  
> **Lingkungan Gateway:** `https://api.upfos.com/v2` (Demo: `https://demo.upfos.com/v2`)

---

## 1. Siklus Hidup Penanganan Retur Konsumen

Proses klaim pengembalian barang (*after-sale return*) di UPFOS memisahkan antara pencatatan klaim administratif dengan eksekusi fisik barang masuk gudang:
1. **Tiket Retur Dibuat (`after.sale.add`):** Pembeli mengajukan komplain/retur atas pesanan tertentu.
2. **Pemeriksaan Administrasi (`after.sale.getdetail`):** Tim CS memeriksa kelayakan klaim dan memverifikasi resi kirim balik dari pembeli.
3. **Penerimaan Fisik & Inbound Retur (`after.sale.entry`):** Paket retur tiba di gudang. Staf QC memeriksa kondisi barang. Jika disetujui, API dipanggil untuk **memulihkan kuantitas stok fisik** di gudang.
4. **Audit Batch / Serial Retur (`after.sale.getbatchunique`):** Pengecekan apakah nomor seri barang yang dikembalikan benar-benar cocok dengan nomor seri yang dahulu dikirimkan.

---

## 2. Rincian Endpoint Modul Retur

### 2.1 Tambah Pengajuan Retur Pelanggan (`after.sale.add`)

#### A. Deskripsi Bisnis & Alur Operasional
Endpoint ini digunakan untuk mendaftarkan tiket klaim purna jual baru ke dalam sistem UPFOS.

#### B. Parameter Bisnis (Request Body)

| Nama Field | Tipe Data | Wajib? | Deskripsi & Aturan |
| :--- | :--- | :---: | :--- |
| `trade_code` | String | **Ya** | Nomor pesanan penjualan asal (**Original Platform Order ID**). |
| `after_sale_type` | Number | **Ya** | Jenis klaim retur:<br>• `1`: Retur Barang & Pengembalian Dana (*Return & Refund*)<br>• `2`: Pengembalian Dana Saja (*Refund Only* tanpa barang balik)<br>• `3`: Tukar Barang (*Exchange*) |
| `reason` | String | Tidak | Alasan retur (misal: barang rusak, ukuran tidak sesuai, salah kirim). |
| `buyer_express_no` | String | Tidak | Nomor resi pengiriman barang retur dari pembeli ke gudang. |
| `buyer_logistics_code` | String | Tidak | Kode ekspedisi yang digunakan pembeli untuk mengirim balik paket. |
| `items` | Item[] | **Ya** | Daftar barang yang diklaim untuk diretur. |

**Struktur Objek di Dalam `items`:**
* `sku_code` (String, Wajib): Kode varian produk yang diretur.
* `qty` (Number, Wajib): Jumlah kuantitas unit yang diretur.
* `price` (Number, Wajib): Nilai harga satuan barang saat klaim diajukan.

---

### 2.2 Eksekusi Penerimaan Barang Retur ke Gudang (`after.sale.entry`)

#### A. Deskripsi Bisnis & Alur Operasional
> [!IMPORTANT]
> **Efek Inventaris:** Pemanggilan endpoint ini memiliki dampak langsung pada saldo stok fisik gudang. Ketika staf gudang menyelesaikan QC barang retur dan memanggil `after.sale.entry`, sistem UPFOS secara otomatis **menambahkan kembali kuantitas fisik barang ke gudang tujuan**.

#### B. Parameter Bisnis (Request Body)

| Nama Field | Tipe Data | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| `after_sale_code` | String | **Ya** | Nomor dokumen tiket retur yang diselesaikan. |
| `warehouse_code` | String | **Ya** | Kode gudang tempat barang retur disimpan kembali. |
| `items` | Item[] | **Ya** | Daftar rincian barang yang aktual diterima dan disetujui masuk stok. |

---

### 2.3 Pelacakan Kode Batch / Serial Retur (`after.sale.getbatchunique`)

Digunakan untuk mendeteksi kecurangan retur (*fraud prevention*). Sistem mencocokkan apakah nomor seri unik (`unique_code`) yang dikembalikan konsumen sama dengan nomor seri unit yang dikirimkan saat pemenuhan pesanan di `delivery.getbatchunique`.
