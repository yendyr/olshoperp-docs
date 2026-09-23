# Suplemen Knowledge: UPFOS Open API (Panduan Lengkap Arsitektur & Katalog API)

> **Status:** Modul Pembelajaran & Referensi Teknis Komprehensif OlshopERP  
> **Sumber Asli:** Dokumentasi Resmi UPFOS API ([https://www.yuque.com/upfos-help/api/jianjie](https://www.yuque.com/upfos-help/api/jianjie))  
> **Metadata Yuque:** Buku: \`Upfos-API-Chinese\` (Book ID: \`1005247\`, Doc ID: \`6736096\`, Slug: \`jianjie\`)  
> **Penempatan Dokumen:** \`docs/supplementary-knowledge/\` (di luar \`qa-docs/\` sesuai kebijakan immutability)

---

## 1. Pendahuluan & Ringkasan Gateway API

API ini merupakan antarmuka bisnis terbuka (*Open Application Programming Interface*) dari sistem **UPFOS ERP** yang diperuntukkan bagi integrasi pihak ketiga (*third-party systems*), seperti:
- **Platform E-Commerce / Marketplace:** Sinkronisasi pesanan, kuantitas stok, dan katalog produk.
- **WMS (Warehouse Management System) / Gudang Eksternal:** Otomasi proses inbound, outbound, dan pelacakan surat jalan.
- **Sistem Keuangan & Akuntansi (Finance):** Pelaporan pengadaan, penjualan, dan mutasi persediaan.
- **Sistem Logistik / 3PL:** Penjadwalan penjemputan paket, penerbitan nomor resi, dan pelacakan kurir.

Melalui API ini, sistem mitra dapat:
1. Mengambil data operasional secara berkala (*pull/query data*).
2. Menambah (*insert/create*), mengubah (*update*), serta menyinkronkan status data transaksi secara dua arah (*two-way synchronization*).

---

## 2. Parameter Publik & Lingkungan Server

### 2.1 Alamat Server Gateway (API Endpoints)
- **Demo / Lingkungan Pengujian (Sandbox):** \`https://demo.upfos.com/v2\`  
  *(Catatan histori URL pengujian legacy: \`http://111.0.90.96:8086/v1\`)*
- **Production / Lingkungan Produksi:** \`https://api.upfos.com/v2\`

---

### 2.2 Spesifikasi Parameter Publik (Common Request Parameters)

Setiap request ke gateway API UPFOS **wajib** menyertakan parameter berikut:

| Nama Field | Tipe Data | Wajib? | Keterangan & Aturan Validasi |
| :--- | :--- | :---: | :--- |
| \`access_key\` | String | **Ya** | Kunci otorisasi (*App Key*) unik yang diterbitkan sistem UPFOS khusus untuk merchant/toko ERP terkait. |
| \`sign\` | String | **Ya** | Tanda tangan digital (*Signature*) dari seluruh parameter request untuk menjamin integritas data dan mencegah manipulasi payload. |
| \`method\` | String | **Ya** | Nama fungsi/metode API bisnis yang dipanggil (contoh: \`trade.add\`, \`item.getlist\`, \`outstorage.add\`). |
| \`timestamp\` | Number | **Ya** | Unix timestamp dalam satuan **detik**. Batas toleransi selisih waktu antara server client dan server gateway UPFOS adalah **maksimal 3 menit (180 detik)**. |
| \`nonce\` | String | **Ya** | String acak unik yang di-*generate* pemanggil (**panjang maksimal 20 karakter**). Berfungsi sebagai mekanisme *anti-replay attack*: **string yang sama dilarang digunakan ulang dalam jendela waktu 3 menit**. |
| \`language\` | String | Tidak | Pilihan lokalisasi pesan response: \`zh\` (Mandarin) atau \`en\` (Inggris). Nilai *default*: \`en\`. |

---

## 3. Algoritma Pembuatan Signature (\`sign\`)

Proses enkripsi signature UPFOS menggunakan mekanisme **Double MD5 Hashing dengan Salt Secret**.

### 3.1 Langkah-Langkah Perhitungan

1. **Seleksi & Pengurutan Parameter:**
   Ambil 4 parameter utama: \`access_key\`, \`method\`, \`nonce\`, dan \`timestamp\`.  
   Urutkan keempat nama field tersebut secara **ascending (A–Z / urutan ASCII)**.

2. **Penyusunan String (Concatenation):**
   Gabungkan nama field dan nilainya dalam format \`keyvalue\` berurutan tanpa karakter pemisah (*separator*). Kemudian, tempelkan nilai variabel \`{secret}\` (kunci rahasia milik merchant) di akhir string.
   
   $$\\text{raw\\_string} = \\text{access\\_key} + V_{\\text{access\\_key}} + \\text{method} + V_{\\text{method}} + \\text{nonce} + V_{\\text{nonce}} + \\text{timestamp} + V_{\\text{timestamp}} + \\{\\text{secret}\\}$$

3. **Enkripsi MD5 Pertama:**
   Lakukan hashing MD5 pada string tersebut dan konversikan hasilnya ke dalam format **32 karakter Hexadecimal HURUF BESAR (Uppercase)**:
   $$\\text{sign\\_step\\_1} = \\text{MD5}(\\text{raw\\_string}) \\quad [\\text{UPPERCASE}]$$

4. **Salt & Enkripsi MD5 Kedua (Final Signature):**
   Ambil hasil \\(\\text{sign\\_step\\_1}\\), tempelkan kembali nilai variabel \\(\\{\\text{secret}\\}\\) di ujung string, lalu lakukan enkripsi MD5 sekali lagi (juga dalam 32 karakter Hexadecimal HURUF BESAR):
   $$\\text{sign} = \\text{MD5}(\\text{sign\\_step\\_1} + \\{\\text{secret}\\}) \\quad [\\text{UPPERCASE}]$$

*Catatan: Contoh kode implementasi utuh dalam bahasa Java (\`Signature.java\`) dan PHP tersedia lengkap di [Modul 0: Arsitektur dan Keamanan](./upfos/00-arsitektur-dan-keamanan.md).*

---

## 4. Format Parameter Response

- **Format Saat Ini:** Seluruh respons API dikembalikan dalam format standar **JSON**.
- **Struktur Standar Response:**
  \`\`\`json
  {
    "success": true,
    "error_code": "",
    "error_msg": "",
    "request_method": "item.add",
    "data": {}
  }
  \`\`\`

---

## 5. Kurikulum Modul Pembelajaran Lengkap

Dokumentasi ini telah disusun menjadi rangkaian modul belajar yang mendalam, terstruktur, dan 100% berbahasa Indonesia di dalam folder [\`docs/supplementary-knowledge/upfos/\`](./upfos/):

| Nomor Modul | Modul Belajar & Referensi Teknis | Pokok Bahasan & Cakupan Endpoint |
| :---: | :--- | :--- |
| **Modul 0** | [00-arsitektur-dan-keamanan.md](./upfos/00-arsitektur-dan-keamanan.md) | Fondasi gateway, public headers, enkripsi Double MD5, kode Java & PHP, aturan paginasi (List max 50, Detail max 100), matching SPU vs SKU, penanganan rate limit (HTTP 503), dan changelog pembaruan. |
| **Modul 1** | [01-item-produk-api.md](./upfos/01-item-produk-api.md) | Konsep SPU vs SKU, pembuatan produk induk (\`item.add\`), penambahan varian spesifikasi (\`item.sku.add\`), penarikan daftar katalog (\`item.getlist\`), audit komponen bundel (\`item.combine.detail.get\`), dan barcode (\`barcode.add\`, \`barcode.getlist\`). |
| **Modul 2** | [02-order-transaksi-api.md](./upfos/02-order-transaksi-api.md) | Siklus hidup penjualan: pembuatan pesanan baru (\`trade.add\`), query daftar & detail pesanan batch 50 order (\`trade.getlist\`, \`trade.getdetail\`), update pesanan (\`trade.update\`), pelacakan resi ekspedisi (\`delivery.logistics.detail.getlist\`), surat jalan gudang (\`delivery.*\`), pelacakan serial unik pengiriman, dan manifes serah terima kurir (\`zqhk2a\`, \`lgg74t\`). |
| **Modul 3** | [03-after-sale-retur-api.md](./upfos/03-after-sale-retur-api.md) | Penanganan retur konsumen: pendaftaran klaim (\`after.sale.add\`), query detail & daftar retur (\`after.sale.getdetail\`, \`after.sale.getlist\`), eksekusi fisik penerimaan barang retur ke gudang dan pemulihan stok (\`after.sale.entry\`), serta pelacakan batch unik retur. |
| **Modul 4** | [04-purchasing-pengadaan-api.md](./upfos/04-purchasing-pengadaan-api.md) | Siklus pengadaan barang: pembuatan draft PO (\`purchase.add\`), pengisian item barang (\`purchase.detail.add\`), otorisasi approval PO (\`purchase.approve\`), penutupan PO (\`purchase.finish\`), dan query riwayat pengadaan (\`purchase.getlist\`). |
| **Modul 5** | [05-inventory-gudang-stok-api.md](./upfos/05-inventory-gudang-stok-api.md) | Arsitektur inventaris (stok fisik, terkunci, tersedia), alur pengeluaran non-sales (\`outstorage.*\`), alur penerimaan non-PO (\`instorage.*\`), mekanisme auto-approval via \`has_next=false\`, query saldo stok real-time (\`stock.qty.getlist\`), dan audit serial/batch unik. |
| **Modul 6** | [06-webhook-notifikasi-api.md](./upfos/06-webhook-notifikasi-api.md) | Integrasi notifikasi asinkron berbasis event (HTTP POST), kontrak response receiver \`200 OK\`, kebijakan retry policy 3x backoff, push event status pesanan (\`uabgkv24s790eh97\`), dan push event surat jalan (\`hws10xf7h0c7rrdi\`). |

---

## 6. Korelasi Langsung & Studi Kasus dengan OlshopERP

Dokumentasi sistem UPFOS ini memegang peran krusial bagi arsitektur dan jaminan mutu (QA) di OlshopERP:

1. **Mitigasi Duplikasi Order Shopee Advance Package (\`GAP-BOOK-02\`):**
   - Di UPFOS lama, pesanan Shopee jalur *advance package* sering kali masuk tanpa nomor booking kurir (\`booking_sn\`). Kelemahan sistemik di UPFOS menyebabkan terbitnya 2 Sales Order terpisah untuk 1 pesanan yang sama.
   - Di OlshopERP, pelajaran dari UPFOS ini diabadikan menjadi **Design Guard Mutlak \`GAP-BOOK-02\`**: sistem menolak pembuatan SO kedua hingga status booking dan order berhasil di-MATCHED.
2. **State Machine Bertingkat Transaksi Gudang:**
   - Standar pemisahan transaksi UPFOS (Draft $\rightarrow$ Input Item $\rightarrow$ Approve $\rightarrow$ Eksekusi Fisik) selaras dengan alur modul Supply Chain di OlshopERP (seperti Stock Opname, Assembly/Disassembly, dan Mutasi Antar Gudang).
3. **Standar Pengujian Batas Keamanan API:**
   - Mekanisme deduplikasi \`nonce\` (3 menit) dan batas toleransi \`timestamp\` ($\le 180$ detik) menjadi acuan standar pembuatan Test Case pada gateway integrasi pihak ketiga di OlshopERP.
