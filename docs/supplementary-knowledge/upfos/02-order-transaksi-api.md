# Modul 2: Siklus Hidup Pesanan, Logistik & Pengiriman (Order API) — UPFOS Open API

> **Status:** Modul Pembelajaran & Referensi Teknis Komprehensif  
> **Target Audiens:** QA Engineer, Backend Developer, Logistics Specialist  
> **Lingkungan Gateway:** `https://api.upfos.com/v2` (Demo: `https://demo.upfos.com/v2`)

---

## 1. Siklus Hidup Pemrosesan Pesanan di UPFOS

Proses pemenuhan pesanan (*order fulfillment*) di UPFOS mengikuti alur baku berikut:
1. **Sales Order Dibuat (`trade.add`):** Pesanan masuk dari marketplace/toko online.
2. **Gudang Memproses & Menerbitkan Surat Jalan (`delivery.getlist`):** Pesanan dialokasikan ke gudang, di-*pick*, dan di-*pack*.
3. **Perekaman Serial/Batch Unik (`delivery.getbatchunique`):** Jika pesanan berisi barang berharga tinggi atau barang berkedaluwarsa, serial number dicatat pada dokumen pengiriman.
4. **Pelacakan Ekspedisi (`delivery.logistics.detail.getlist`):** Paket diserahkan ke kurir dan nomor resi dilacak perjalanannya.
5. **Serah Terima Kurir / Handover (`zqhk2a` & `lgg74t`):** Penyerahan massal seluruh paket dalam satu sesi pick-up kurir dicatat dalam Berita Acara Serah Terima (Manifes Handover).

---

## 2. Rincian Endpoint Modul Pesanan

### 2.1 Tambah Pesanan Penjualan Baru (`trade.add`)

#### A. Deskripsi Bisnis & Alur Operasional
Endpoint ini dipanggil untuk membuat transaksi penjualan baru di UPFOS. Gateway akan memvalidasi kelengkapan data pembeli, alamat pengiriman, dan memastikan setiap item produk yang dipesan valid.

#### B. Parameter Bisnis (Request Body)

| Nama Field | Tipe Data | Wajib? | Aturan Validasi & Deskripsi |
| :--- | :--- | :---: | :--- |
| `trade_code` | String | **Ya** | Nomor pesanan unik dari platform/marketplace (**Platform Order ID**). |
| `shop_code` | String | **Ya** | Kode toko di UPFOS tempat transaksi terjadi. |
| `source_platform_code` | String | Tidak | Kode platform sumber (contoh: `Shopee`, `Lazada`, `TikTok`, `Manual`). |
| `warehouse_code` | String | Tidak | Kode gudang pemenuhan default. Jika kosong, sistem menggunakan aturan alokasi otomatis. |
| `order_date` | DateTime | **Ya** | Waktu transaksi dibuat di marketplace (Unix timestamp detik). |
| `buyer_name` | String | Tidak | Username / nama akun pembeli di marketplace. |
| `buyer_memo` | String | Tidak | Catatan khusus dari pembeli (misal: "tolong bungkus bubble wrap tebal"). |
| `seller_memo` | String | Tidak | Catatan internal penjual. |
| `receiver_name` | String | **Ya** | Nama lengkap penerima paket. |
| `receiver_phone` | String | Tidak | Nomor telepon rumah/kantor penerima. |
| `receiver_mobile` | String | **Ya** | Nomor handphone penerima (wajib untuk kurir). |
| `receiver_province` | String | **Ya** | Nama provinsi tujuan pengiriman. |
| `receiver_city` | String | **Ya** | Nama kota / kabupaten tujuan pengiriman. |
| `receiver_district` | String | Tidak | Nama kecamatan / kelurahan tujuan. |
| `receiver_address` | String | **Ya** | Alamat jalan lengkap tujuan pengiriman. |
| `total_amount` | Number | **Ya** | Nilai total bruto barang sebelum potongan harga. |
| `payment_amount` | Number | **Ya** | Nilai bersih aktual yang dibayarkan pembeli. |
| `discount_amount` | Number | Tidak | Total potongan diskon/voucher penjual. |
| `post_fee` | Number | Tidak | Biaya ongkos kirim yang dibayarkan pembeli. |
| `items` | Item[] | **Ya** | Array berisi daftar barang belanjaan pesanan. |

**Struktur Objek di Dalam `items`:**

| Nama Field | Tipe Data | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| `item_code` | String | **Ya** | Kode produk induk (SPU). |
| `sku_code` | String | **Ya** | Kode varian produk (SKU). |
| `qty` | Number | **Ya** | Jumlah unit barang yang dibeli (Quantity). |
| `price` | Number | **Ya** | Harga satuan barang saat transaksi terjadi. |
| `discount_amount` | Number | Tidak | Potongan diskon khusus untuk baris item ini. |
| `total_amount` | Number | **Ya** | Subtotal nilai baris item (\(\text{qty} \times \text{price} - \text{discount}\)). |

#### C. Contoh Payload Request (JSON)
```json
{
  "access_key": "efc3c4091993798f0196becf3630d334",
  "method": "trade.add",
  "timestamp": 1586241203,
  "nonce": "order_nonce_01",
  "sign": "A1B2C3D4E5F678901234567890ABCDEF",
  "trade_code": "ORD-20260923-0091",
  "shop_code": "SHOP-SHOPEE-ID",
  "source_platform_code": "SHOPEE",
  "order_date": 1586241100,
  "buyer_name": "budi_santoso",
  "receiver_name": "Budi Santoso",
  "receiver_mobile": "081234567890",
  "receiver_province": "DKI Jakarta",
  "receiver_city": "Jakarta Selatan",
  "receiver_district": "Tebet",
  "receiver_address": "Jl. Tebet Barat Dalam No. 45 RT 02/05",
  "total_amount": 100000,
  "discount_amount": 10000,
  "post_fee": 9000,
  "payment_amount": 99000,
  "items": [
    {
      "item_code": "SPU-TSHIRT-001",
      "sku_code": "SKU-TSHIRT-WHT-M",
      "qty": 2,
      "price": 50000,
      "discount_amount": 10000,
      "total_amount": 90000
    }
  ]
}
```

---

### 2.2 Query Daftar Pesanan (`trade.getlist`)

#### A. Deskripsi Bisnis & Alur Operasional
Digunakan untuk memantau status pesanan secara massal. Sejak pembaruan Mei 2023, filter tanggal pembaruan telah diubah menjadi **wajib** guna mencegah query liar yang membebani database server.

#### B. Parameter Bisnis (Query Filters)

| Nama Field | Tipe Data | Wajib? | Deskripsi & Aturan |
| :--- | :--- | :---: | :--- |
| `modify_start_date` | DateTime | **Ya** | Batas awal tanggal pembaruan data (Unix timestamp). |
| `modify_end_date` | DateTime | **Ya** | Batas akhir tanggal pembaruan data (Unix timestamp). |
| `shop_code` | String | Tidak | Filter toko spesifik. |
| `status` | String | Tidak | Status transaksi: `WaitPay`, `WaitDelivery`, `Delivered`, `Cancelled`, `Finished`. |
| `page_no` | Number | Tidak | Halaman data (default: 1). |
| `page_size` | Number | Tidak | Jumlah baris per halaman (default: 10, **Maksimal: 50**). |

---

### 2.3 Query Detail Pesanan (`trade.getdetail`)

#### A. Deskripsi Bisnis & Alur Operasional
Digunakan untuk mengambil rincian lengkap satu transaksi. Sejak pembaruan September 2023, endpoint ini mendukung **pencarian multi-order sekaligus (Batch Query)** dengan memisahkan nomor pesanan menggunakan tanda koma (`,`), dengan batas maksimal **50 pesanan per request**.

#### B. Parameter Bisnis (Request)

| Nama Field | Tipe Data | Wajib? | Deskripsi |
| :--- | :--- | :---: | :--- |
| `trade_code` | String | **Ya** | Nomor pesanan tunggal atau kumpulan nomor pesanan dipisahkan koma (`,`). Min: 1, Max: 50 pesanan. Contoh: `ORD001,ORD002,ORD003`. |

---

### 2.4 Dokumen Pengiriman & Pelacakan Serial Unik

1. **Query Surat Jalan (`delivery.getlist`):**  
   Mengambil daftar Surat Jalan gudang. **Wajib menyertakan `update_time_from` dan `update_time_to`**. Paginasi maks 50 baris.
2. **Detail Barang Surat Jalan (`delivery.getdetail`):**  
   Melihat isi fisik paket berdasarkan nomor `delivery_code`.
3. **Audit Serial / Batch Unik Pengiriman (`delivery.getbatchunique`):**  
   Mengambil nomor seri produk berharga tinggi (*serial number*) atau batch kedaluwarsa yang dipindai saat *packing*. Menjamin kepastian unit mana yang diterima oleh konsumen.
4. **Pembaruan Resi Pengiriman (`delivery.update`):**  
   Mengubah nomor resi kurir (`express_no`) atau mengganti armada kurir (`logistics_code`) sebelum paket diberangkatkan.

---

### 2.5 Dokumen Serah Terima Kurir / Handover

1. **Pembuatan Manifes Handover (`zqhk2a`):**  
   Menggabungkan daftar resi pengiriman yang siap dijemput kurir dalam satu dokumen serah terima bertanda tangan digital.
2. **Pembaruan Status Handover (`lgg74t`):**  
   Mengubah status manifes saat kurir menandatangani berita acara serah terima paket di loading dock gudang.

---

## 3. Korelasi Penting dengan OlshopERP: Kasus GAP-BOOK-02

> [!CAUTION]
> **Pelajaran Kritis dari Arsitektur Legacy UPFOS:**  
> Pada sistem legacy UPFOS terdahulu, pesanan Shopee jalur *advance package* seringkali mengirimkan data pesanan tanpa menyertakan nomor booking kurir (`booking_sn`). Di UPFOS lama, jika dibuat pesanan baru, kemudian saat kurir mengonfirmasi pemesanan sistem membuat pesanan kedua, terjadi **duplikasi fatal (2 Sales Order terbit untuk 1 pesanan nyata yang sama)**.  
>  
> Di OlshopERP, diterapkan aturan baku (*Design Guard* `GAP-BOOK-02`):  
> *Sistem wajib menahan dan melewati (skip) pembuatan Sales Order kedua hingga status booking dan order berhasil di-MATCHED secara akurat.*
