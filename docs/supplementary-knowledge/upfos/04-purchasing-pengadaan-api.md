# Modul 4: Pengadaan Barang & Purchase Order (Purchase API) — UPFOS Open API

> **Status:** Modul Pembelajaran & Referensi Teknis Komprehensif  
> **Target Audiens:** QA Engineer, Procurement Team, Inventory Manager  
> **Lingkungan Gateway:** `https://api.upfos.com/v2` (Demo: `https://demo.upfos.com/v2`)

---

## 1. Siklus Hidup Dokumen Pengadaan (Purchase Order)

UPFOS menerapkan arsitektur *State Machine* bertingkat untuk menjaga validitas finansial dan kuantitas pengadaan barang:
$$\text{Draft PO (Add)} \longrightarrow \text{Input Item (Detail Add)} \longrightarrow \text{Persetujuan (Approve)} \longrightarrow \text{Penerimaan Gudang} \longrightarrow \text{Penutupan (Finish)}$$

1. **Buat Draft PO (`purchase.add`):** Menentukan nomor PO, supplier rekanan, dan gudang tujuan.
2. **Tambah Rincian Item (`purchase.detail.add`):** Memasukkan daftar SKU, jumlah pesanan, dan harga beli.
3. **Otorisasi Manajer (`purchase.approve`):** Menyetujui dokumen PO sehingga statusnya terkunci (*locked*) dan menjadi acuan penerimaan barang (*Inbound Receiving*).
4. **Penyelesaian PO (`purchase.finish`):** Menutup dokumen PO setelah seluruh barang tuntas diterima di gudang.

---

## 2. Rincian Endpoint Modul Pengadaan

### 2.1 Buat Header Purchase Order (`purchase.add`)

#### A. Parameter Bisnis (Request Body)

| Nama Field | Tipe Data | Wajib? | Deskripsi & Aturan |
| :--- | :--- | :---: | :--- |
| `purchase_code` | String | Tidak | Nomor dokumen PO kustom dari sistem eksternal. Jika dikosongkan, UPFOS akan mengenerate nomor otomatis. |
| `supplier_code` | String | **Ya** | Kode supplier rekanan pengadaan. |
| `warehouse_code` | String | **Ya** | Kode gudang tujuan tempat barang akan dikirimkan oleh supplier. |
| `plan_arrive_date` | DateTime | Tidak | Estimasi target tanggal barang tiba di gudang. |
| `remark` | String | Tidak | Catatan atau instruksi pengadaan untuk supplier. |

---

### 2.2 Input Rincian Item PO (`purchase.detail.add`)

#### A. Deskripsi Bisnis
Digunakan untuk memasukkan daftar barang yang dipesan ke dalam dokumen PO yang berstatus Draft. Satu request dapat menampung hingga ratusan item.

#### B. Parameter Bisnis (Request Body)

| Nama Field | Tipe Data | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| `purchase_code` | String | **Ya** | Nomor dokumen Purchase Order tujuan. |
| `items` | Item[] | **Ya** | Array daftar barang pengadaan. |

**Struktur Objek di Dalam `items`:**
* `sku_code` (String, Wajib): Kode varian barang yang dipesan.
* `qty` (Number, Wajib): Jumlah unit yang dipesan ke supplier.
* `purchase_price` (Number, Wajib): Harga beli per unit yang disepakati.

---

### 2.3 Approval & Penyelesaian PO

* **`purchase.approve`:** Mengubah status PO dari `Draft` menjadi `Approved`. Setelah status ini aktif, petugas gudang dapat melihat jadwal barang masuk dan mencocokkan fisik saat kontainer tiba.
* **`purchase.finish`:** Menutup status PO menjadi `Finished` jika seluruh kuantitas pesanan telah terpenuhi atau transaksi pengadaan telah selesai.
* **`purchase.getlist`:** Menarik data histori PO dengan filter tanggal, status approval, dan paginasi (maks 50 baris).
