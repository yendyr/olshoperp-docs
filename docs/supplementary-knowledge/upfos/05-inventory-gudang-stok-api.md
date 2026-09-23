# Modul 5: Pergudangan, Mutasi Barang & Manajemen Stok (Inventory API) — UPFOS Open API

> **Status:** Modul Pembelajaran & Referensi Teknis Komprehensif  
> **Target Audiens:** QA Engineer, WMS Specialist, Warehouse Operations  
> **Lingkungan Gateway:** `https://api.upfos.com/v2` (Demo: `https://demo.upfos.com/v2`)

---

## 1. Arsitektur Saldo Stok UPFOS ERP

Dalam sistem inventaris UPFOS, saldo stok dihitung berdasarkan 3 metrik utama:
$$\text{Stok Tersedia (Available)} = \text{Stok Fisik Total (Quantity)} - \text{Stok Terkunci Pesanan (Locked Quantity)}$$

1. **Stok Fisik (`quantity`):** Kuantitas aktual barang yang ada di dalam rak/bin gudang.
2. **Stok Terkunci (`locked_quantity`):** Kuantitas barang yang sudah dialokasikan untuk pesanan aktif pembeli tetapi paketnya belum diberangkatkan.
3. **Stok Tersedia:** Kuantitas bebas yang aman dipublikasikan ke marketplace tanpa risiko *overselling*.

---

## 2. Alur Pengeluaran Barang Non-Sales (Outbound Storage)

Digunakan untuk mutasi pengeluaran barang fisik gudang yang bukan berasal dari transaksi pesanan marketplace (seperti transfer antar cabang, pemusnahan barang kedaluwarsa/disposal, atau sampel promosi).

### 2.1 Buat Tiket Outbound (`outstorage.add`)
Membuat dokumen pengeluaran awal berstatus `Draft`.  
*Parameter Utama:* `warehouse_code` (wajib), `outstorage_type` (tipe pengeluaran), `remark`. Mengembalikan `order_code` dokumen pengeluaran.

### 2.2 Tambah Rincian Item Outbound (`outstorage.detail.add`)
Memasukkan daftar SKU dan jumlah fisik yang hendak dikeluarkan.

> [!TIP]
> **Fitur Praktis `has_next` & `approve` Otomatis:**  
> - `has_next` (Boolean, Wajib): Tentukan `true` jika barang dikirim bertahap dalam beberapa batch request, atau `false` jika batch ini adalah yang terakhir.  
> - `approve` (Boolean, Opsional): Jika diset `true` dan `has_next = false`, sistem UPFOS **langsung meng-approve dokumen seketika** tanpa perlu memanggil API `outstorage.approve` secara terpisah!

**Tabel Parameter Item:**
| Nama Field | Tipe Data | Wajib? | Deskripsi & Aturan |
| :--- | :--- | :---: | :--- |
| `order_code` | String | **Ya** | Nomor dokumen outbound hasil dari `outstorage.add`. |
| `barcode` / `item_code` | String | Kondisional | **Pilih salah satu**: wajib menyertakan kode SPU (`item_code`) ATAU barcode fisik. |
| `sku_code` | String | Tidak | Kode spesifik varian produk. |
| `qty` | Number | **Ya** | Jumlah kuantitas fisik yang dikeluarkan. |
| `unique_code` | String | Kondisional | Nomor seri produk. **Wajib diisi jika produk bertipe serial unik**. |
| `batch_no` | String | Kondisional | Nomor lot / batch produksi. **Wajib diisi jika produk bertipe batch**. |
| `batch_qty` | Number | Kondisional | Jumlah kuantitas pada batch tersebut. |
| `production_date` | DateTime | Kondisional | Tanggal produksi barang. |
| `shelf_life` | Number | Tidak | Masa simpan barang dalam satuan hari. |

### 2.3 Approval & Eksekusi Pemotongan Stok Fisik
* **`outstorage.approve`:** Memberikan otorisasi manajerial bahwa dokumen outbound telah diverifikasi.
* **`outstorage.outstorage`:** Eksekusi fisik pemotongan stok gudang. **Saldo kuantitas fisik di database inventaris UPFOS resmi berkurang pada detik API ini sukses dieksekusi.**
* **`outstorage.getbatchunique`:** Mengambil catatan audit nomor seri unik/batch apa saja yang dikeluarkan.

---

## 3. Alur Penerimaan Barang Non-PO (Inbound Storage)

Digunakan untuk mutasi masuknya barang fisik ke gudang yang bukan berasal dari pembelian supplier reguler (seperti transfer masuk dari cabang lain atau penyesuaian selisih lebih stok opname).

1. **Buat Tiket Inbound (`instorage.add`):** Menentukan gudang penerima dan tipe penerimaan.
2. **Tambah Rincian Item Masuk (`instorage.detail.add`):** Memasukkan rincian SKU, kuantitas, barcode, nomor batch, dan serial unik barang yang tiba di *receiving bay*.
3. **Eksekusi Penambahan Stok Fisik (`instorage.instorage`):** Dipanggil setelah staf gudang selesai menaruh barang ke rak (*putaway*). **Saldo kuantitas fisik gudang resmi bertambah.**
4. **Query Rincian Masuk (`kffzr6yz03i2ktp8` / `instorage.detail.get`):** Memeriksa rincian item dalam dokumen penerimaan tertentu.

---

## 4. Query Saldo Kuantitas Stok Real-Time (`stock.qty.getlist`)

#### A. Deskripsi Bisnis
Endpoint vital bagi sistem e-commerce untuk mendapatkan data ketersediaan barang secara real-time guna mencegah terjadinya pembatalan pesanan akibat kehabisan stok (*out of stock*).

#### B. Parameter Request (Query Filters)
* `warehouse_code` (String, Opsional): Filter berdasarkan kode gudang tertentu.
* `sku_code` (String, Opsional): Filter berdasarkan kode SKU tertentu.
* `page_no` & `page_size` (Maksimal 50 baris).

#### C. Contoh Response Data
```json
{
  "success": true,
  "request_method": "stock.qty.getlist",
  "data": {
    "total_count": 1,
    "items": [
      {
        "warehouse_code": "WH-JAKARTA-01",
        "warehouse_name": "Gudang Utama Jakarta",
        "sku_code": "SKU-TSHIRT-WHT-M",
        "quantity": 150,
        "locked_quantity": 20,
        "available_quantity": 130
      }
    ]
  }
}
```
