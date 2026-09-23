# Modul 1: Manajemen Master Katalog & Barcode (Item API) — UPFOS Open API

> **Status:** Modul Pembelajaran & Referensi Teknis Komprehensif  
> **Target Audiens:** QA Engineer, Backend Developer, Product Specialist  
> **Lingkungan Gateway:** `https://api.upfos.com/v2` (Demo: `https://demo.upfos.com/v2`)

---

## 1. Konsep Dasar Produk: SPU vs SKU

Dalam arsitektur UPFOS ERP, sistem memisahkan produk ke dalam dua tingkatan hierarki:
1. **SPU (Standard Product Unit / Produk Induk):** Entitas payung yang merepresentasikan konsep umum produk (misalnya: *Kemeja Katun Polos Lengan Panjang*). Di tingkat SPU, disimpan atribut umum seperti brand, kategori produk, supplier utama, serta kebijakan stok (apakah mengizinkan stok minus atau dikelola berdasarkan batch kedaluwarsa).
2. **SKU (Stock Keeping Unit / Varian Spesifikasi):** Entitas fisik spesifik yang memiliki stok aktual di gudang (misalnya: *Kemeja Katun Polos - Warna Putih - Ukuran L*). Di tingkat SKU, disimpan harga jual, harga modal/HPP (*cost price*), berat, dimensi fisik, serta kode barcode.

---

## 2. Rincian Endpoint Modul Produk

### 2.1 Tambah Produk Induk SPU (`item.add`)

#### A. Deskripsi Bisnis & Alur Operasional
Endpoint ini dipanggil pertama kali saat mendaftarkan produk baru ke katalog UPFOS. Setelah SPU berhasil dibuat, varian spesifik (SKU) dapat ditambahkan di bawah SPU tersebut.

#### B. Parameter Request

**1. Parameter Publik Wajib:**  
`access_key`, `sign`, `method="item.add"`, `timestamp`, `nonce`, dan `language` (opsional).

**2. Parameter Bisnis (Request Body):**

| Nama Field | Tipe Data | Wajib? | Aturan Validasi & Deskripsi |
| :--- | :--- | :---: | :--- |
| `code` | String | **Ya** | Kode unik produk induk (**SPU Code**). Maksimal 50 karakter. Tidak boleh duplikat di sistem. |
| `name` | String | **Ya** | Nama lengkap produk induk. |
| `barcode` | String | Tidak | Barcode default untuk produk. Jika diisi, sistem otomatis membuat varian default dengan barcode ini. |
| `item_brand_code` | String | Tidak | Kode merek/brand yang terdaftar di master brand UPFOS. |
| `simple_name` | String | Tidak | Nama ringkas / singkatan produk untuk keperluan cetak label resi atau display POS. |
| `category_name` | String | Tidak | Nama kategori produk (contoh: `T-Shirt`, `Elektronik`). |
| `supplier_code` | String | Tidak | Kode pemasok / vendor utama produk. |
| `minus_stock` | Boolean | Tidak | Izin stok minus (`true` / `false`). Jika `true`, transaksi gudang diizinkan memotong stok meskipun saldo tercatat nol. Default: `false`. |
| `property_type` | Number | Tidak | Tipe pengelolaan atribut inventaris:<br>• `0`: Barang Reguler (tanpa lot/serial)<br>• `1`: Barang dengan Serial Unik (*Unique Serial Number*)<br>• `2`: Barang dengan Batch/Lot (*Batch / Expiration Date*) |
| `shelf_life` | Number | Kondisional | Masa simpan produk dalam satuan **hari**. **Wajib diisi jika `property_type = 2`**. |
| `warning_days` | Number | Tidak | Jumlah hari peringatan sebelum tanggal kedaluwarsa tiba (*expiry alert threshold*). |

#### C. Contoh Payload Request (JSON)
```json
{
  "access_key": "efc3c4091993798f0196becf3630d334",
  "method": "item.add",
  "timestamp": 1586241203,
  "nonce": "rand987213",
  "language": "en",
  "sign": "C86F5C611FDA0DED4D40D0D2EB7E741D",
  "code": "SPU-TSHIRT-001",
  "name": "Kaos Polos Cotton Combed 30s",
  "simple_name": "Kaos 30s",
  "category_name": "Pakaian Pria",
  "item_brand_code": "BRD-001",
  "supplier_code": "SUP-002",
  "barcode": "899123456001",
  "minus_stock": false,
  "property_type": 2,
  "shelf_life": 365,
  "warning_days": 60
}
```

#### D. Contoh Response
*Sukses:*
```json
{
  "success": true,
  "error_code": "",
  "error_msg": "",
  "request_method": "item.add"
}
```
*Gagal (Validasi):*
```json
{
  "success": false,
  "error_code": "401",
  "error_msg": "param code required",
  "request_method": "item.add"
}
```

---

### 2.2 Tambah Varian Produk SKU (`item.sku.add`)

#### A. Deskripsi Bisnis & Alur Operasional
Digunakan untuk mendaftarkan varian turunan di bawah suatu produk induk (SPU). Satu SPU dapat memiliki banyak SKU yang dibedakan oleh kombinasi atribut (misal: warna Merah ukuran M, warna Biru ukuran XL).

#### B. Parameter Bisnis (Request Body)

| Nama Field | Tipe Data | Wajib? | Aturan Validasi & Deskripsi |
| :--- | :--- | :---: | :--- |
| `item_code` | String | **Ya** | Kode produk induk (**SPU Code**) yang menjadi induk dari varian ini. |
| `sku_code` | String | **Ya** | Kode unik varian (**SKU Code**). Wajib unik di seluruh sistem. |
| `name` | String | **Ya** | Nama spesifik varian produk (misal: *Kaos Polos Cotton - Putih M*). |
| `barcode` | String | Tidak | Barcode fisik untuk SKU ini. |
| `cost_price` | Number | Tidak | Harga modal / HPP beli produk per unit. |
| `sale_price` | Number | Tidak | Harga jual standar produk per unit. |
| `weight` | Number | Tidak | Berat kotor produk dalam satuan kilogram (kg). Digunakan untuk perhitungan ongkir logistik. |
| `length`, `width`, `height` | Number | Tidak | Dimensi kemasan produk dalam satuan sentimeter (cm) untuk perhitungan berat volumetrik. |
| `property_value_names` | String | Tidak | Deskripsi atribut kombinasi varian (contoh: `Warna:Putih;Ukuran:M`). |

#### C. Contoh Payload Request (JSON)
```json
{
  "access_key": "efc3c4091993798f0196becf3630d334",
  "method": "item.sku.add",
  "timestamp": 1586241300,
  "nonce": "rand987214",
  "sign": "E5D4C3B2A109876543210FEDCBA98765",
  "item_code": "SPU-TSHIRT-001",
  "sku_code": "SKU-TSHIRT-WHT-M",
  "name": "Kaos Polos Cotton Combed 30s - Putih M",
  "barcode": "899123456002",
  "cost_price": 25000,
  "sale_price": 50000,
  "weight": 0.2,
  "property_value_names": "Warna:Putih;Ukuran:M"
}
```

---

### 2.3 Query Daftar Produk & Varian (`item.getlist`)

#### A. Deskripsi Bisnis & Alur Operasional
Digunakan untuk sinkronisasi katalog secara berkala (inkremental) dari UPFOS ke aplikasi partner.

#### B. Parameter Bisnis (Query Filters)

| Nama Field | Tipe Data | Wajib? | Catatan & Paginasi |
| :--- | :--- | :---: | :--- |
| `page_no` | Number | Tidak | Nomor halaman. Default: `1`. |
| `page_size` | Number | Tidak | Jumlah baris per halaman. Default: `10`, **Maksimal: `50` baris**. |
| `start_time` | DateTime | Tidak | Filter waktu awal pembaruan data (Unix timestamp detik). |
| `end_time` | DateTime | Tidak | Filter waktu akhir pembaruan data (Unix timestamp detik). |
| `item_code` | String | Tidak | Filter berdasarkan kode produk induk tertentu. |
| `sku_code` | String | Tidak | Filter berdasarkan kode SKU tertentu. |

---

### 2.4 Detail Komposisi Barang Bundel / Paket Kombinasi (`item.combine.detail.get`)

#### A. Deskripsi Bisnis & Alur Operasional
Jika merchant menjual barang paket/bundel (misal: *Paket Bundel Hemat 3-in-1*), endpoint ini dipanggil untuk mengetahui SKU apa saja yang menyusun paket tersebut dan berapa kuantitas fisik masing-masing komponen yang harus dipotong dari stok gudang saat paket terjual.

#### B. Parameter Bisnis (Request)

| Nama Field | Tipe Data | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| `combine_sku_code` | String | **Ya** | Kode SKU dari produk kombinasi / bundel yang dicari. |

#### C. Contoh Response Data
```json
{
  "success": true,
  "request_method": "item.combine.detail.get",
  "data": {
    "combine_sku_code": "BUNDLE-HEMAT-01",
    "items": [
      {
        "sub_sku_code": "SKU-TSHIRT-WHT-M",
        "sub_sku_name": "Kaos Putih M",
        "ratio": 2,
        "cost_price": 25000
      },
      {
        "sub_sku_code": "SKU-HAT-BLK-ALL",
        "sub_sku_name": "Topi Hitam",
        "ratio": 1,
        "cost_price": 15000
      }
    ]
  }
}
```
*(Artinya: 1 unit BUNDLE-HEMAT-01 terdiri dari 2 pcs Kaos Putih M dan 1 pcs Topi Hitam).*

---

### 2.5 Pendaftaran Barcode Tambahan (`barcode.add`) & Query Barcode (`barcode.getlist`)

* **`barcode.add`:** Menambahkan kode barcode fisik baru ke suatu SKU yang sudah ada. Sangat penting jika satu varian barang memiliki variasi barcode dari supplier berbeda.  
  *Parameter Utama:* `barcode` (string, wajib), `sku_code` (string, wajib), `item_code` (string, opsional).
* **`barcode.getlist`:** Mengambil seluruh daftar barcode terdaftar untuk pemetaan scanner gudang. Mendukung paginasi (`page_size` max 50).
