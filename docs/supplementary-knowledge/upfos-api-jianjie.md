# Suplemen Knowledge: UPFOS Open API (Upfos-API简介)

> **Status:** Dokumen Referensi / Suplemen Knowledge OlshopERP  
> **Sumber Asli:** [https://www.yuque.com/upfos-help/api/jianjie](https://www.yuque.com/upfos-help/api/jianjie)  
> **Metadata Yuque:** Book: `Upfos-API-中文` (Book ID: `1005247`, Doc ID: `6736096`, Slug: `jianjie`)  
> **Penempatan:** `docs/supplementary-knowledge/upfos-api-jianjie.md` (di luar `qa-docs/` sesuai kebijakan repo)

---

## 1. Pendahuluan & Ringkasan API (API简介)

API ini merupakan antarmuka bisnis terbuka (*Open Application Programming Interface*) dari sistem **UPFOS ERP** yang diperuntukkan bagi integrasi pihak ketiga (*third-party systems*), seperti:
- **Platform E-Commerce / Marketplace:** Sinkronisasi pesanan, stok, dan master produk.
- **WMS (Warehouse Management System) / Gudang Eksternal:** Operasional gudang (inbound, outbound, stock opname).
- **Sistem Keuangan & Akuntansi (Finance):** Pelaporan pengadaan, penjualan, dan inventaris.
- **Sistem Logistik / 3PL:** Penjadwalan pengiriman, nomor resi, dan pelacakan paket.

Melalui API ini, sistem eksternal dapat:
1. Mengambil data operasional (*query/pull data*).
2. Menambah (*insert/create*), mengubah (*update*), serta menyinkronkan status data transaksi secara berkala.

---

## 2. Parameter Publik (公共参数) & Lingkungan Server

### 2.1 Alamat Server (API Endpoints)
- **Demo / Lingkungan Pengujian:** `https://demo.upfos.com/v2`  
  *(Catatan histori URL pengujian legacy: `http://111.0.90.96:8086/v1`)*
- **Production / Lingkungan Produksi:** `https://api.upfos.com/v2`

---

### 2.2 Spesifikasi Parameter Publik (Common Request Parameters)

Setiap request ke gateway API UPFOS wajib menyertakan parameter berikut:

| Nama Field (`字段名`) | Tipe Data | Wajib? | Keterangan / Aturan Validasi |
| :--- | :--- | :---: | :--- |
| `access_key` | String | **Ya** | Kunci otorisasi (*App Key*) yang diterbitkan sistem UPFOS khusus untuk merchant/toko ERP terkait. |
| `sign` | String | **Ya** | Tanda tangan digital (*Signature*) dari seluruh parameter request untuk menjamin integritas data dan mencegah manipulasi payload. |
| `method` | String | **Ya** | Nama fungsi/metode API bisnis yang dipanggil (contoh: `trade.add`, `item.getlist`, `outstorage.add`). |
| `timestamp` | Number | **Ya** | Unix timestamp dalam satuan **detik**. Batas toleransi selisih waktu antara server client dan server gateway UPFOS adalah **maksimal 3 menit (180 detik)**. |
| `nonce` | String | **Ya** | String acak unik yang di-*generate* pemanggil (**panjang maksimal 20 karakter**). Berfungsi sebagai mekanisme *anti-replay attack*: **string yang sama dilarang digunakan ulang dalam jendela waktu 3 menit**. |
| `language` | String | Tidak | Pilihan lokalisasi pesan response: `zh` (Mandarin) atau `en` (Inggris). Nilai *default*: `en`. |

---

## 3. Algoritma Pembuatan Signature (`sign` / 签名生成)

Proses enkripsi signature UPFOS menggunakan mekanisme **Double MD5 Hashing dengan Salt Secret**.

### 3.1 Langkah-Langkah Perhitungan

1. **Seleksi & Pengurutan Parameter:**
   Ambil 4 parameter utama berikut:
   - `access_key`
   - `method`
   - `nonce`
   - `timestamp`
   
   Urutkan keempat nama field tersebut secara **ascending (A–Z / urutan ASCII)**.

2. **Penyusunan String (Concatenation):**
   Gabungkan nama field dan nilainya dalam format `keyvalue` berurutan tanpa karakter pemisah (*separator* atau *delimiter*). Kemudian, tempelkan nilai variable `{secret}` (kunci rahasia milik merchant) di akhir string.
   
   *Formula:*
   $$\text{string\_to\_hash} = \text{access\_key} + \text{Val}_{\text{access\_key}} + \text{method} + \text{Val}_{\text{method}} + \text{nonce} + \text{Val}_{\text{nonce}} + \text{timestamp} + \text{Val}_{\text{timestamp}} + \{\text{secret}\}$$
   
   *Contoh Plaintext:*
   ```text
   access_key12345methodtrade.addnonce24234234timestamp3253464243{secret}
   ```
   *(Keterangan: `{secret}` diganti dengan string secret asli yang diberikan sistem).*

3. **MD5 Pertama:**
   Lakukan enkripsi MD5 pada string tersebut dan konversikan hasilnya ke dalam format **32 karakter Hexadecimal HURUF KAPITAL (Uppercase)**:
   $$\text{sign\_step\_1} = \text{MD5}(\text{string\_to\_hash}) \quad [\text{UPPERCASE}]$$

4. **MD5 Kedua (Final Signature):**
   Ambil hasil `sign_step_1`, tempelkan kembali nilai variable `{secret}` di ujung string, lalu lakukan enkripsi MD5 sekali lagi (juga dalam 32 karakter Hexadecimal HURUF KAPITAL):
   $$\text{sign} = \text{MD5}(\text{sign\_step\_1} + \{\text{secret}\}) \quad [\text{UPPERCASE}]$$

---

### 3.2 Contoh Implementasi Resmi (Code Snippets)

#### A. Contoh Java (`Signature.java`)

```java
package com.biteng.open.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.codec.Charsets;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

public class Signature {

    public Signature(String secret) {
        this.secret = secret;
    }

    private String secret;

    private static final String SIGN = "sign";
    private static final String DIGEST = "MD5";

    public String getSign(JSONObject params) throws NoSuchAlgorithmException {
        params.remove(SIGN);
        // Langkah 1 & 2: Urutkan parameter secara alfabetis dan sambungkan key-value
        StringBuilder query = builder(params);
        // Langkah 3: Tambahkan secret di ujung string
        query.append(this.secret);
        // Langkah 4: Enkripsi MD5 pertama (32 bit uppercase)
        String sign = encryptMD5(query.toString());
        // Langkah 5: Gabungkan hasil MD5 pertama dengan secret, lalu hash MD5 sekali lagi
        return encryptMD5(String.format("%s%s", sign, secret));
    }

    private StringBuilder builder(JSONObject params) {
        // Urutkan Map berdasarkan key secara alfabetis (TreeMap)
        Map sortedParams = new TreeMap<>(params);
        StringBuilder query = new StringBuilder();
        for (Map.Entry param : sortedParams.entrySet()) {
            query.append(param.getKey());
            query.append(param.getValue());
        }
        return query;
    }

    private static String encryptMD5(String data) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance(DIGEST);
        return byte2hex(md.digest(data.getBytes(Charsets.UTF_8)));
    }

    private static String byte2hex(byte[] bytes) {
        StringBuilder sign = new StringBuilder();
        for (byte aByte : bytes) {
            String hex = Integer.toHexString(aByte & 0xFF);
            if (hex.length() == 1) {
                sign.append("0");
            }
            sign.append(hex.toUpperCase());
        }
        return sign.toString();
    }
}
```

#### B. Contoh PHP

```php
protected function _getSign($params)
{
    // Hapus parameter sign jika sudah ada
    if (isset($params['sign'])) {
        unset($params['sign']);
    }

    // Urutkan array berdasarkan key secara rekursif
    $params = $this->_getSortArray($params);
    $str = "";
    foreach ($params as $key => &$value) {
        $str .= $key . $value;
    }

    // Tambahkan accessSecret di ujung string
    $str .= $this->accessSecret;
    // Hash MD5 pertama (uppercase)
    $sign = strtoupper(md5($str));

    // Salt dengan secret dan hash MD5 kedua (final signature)
    return strtoupper(md5(sprintf('%s%s', $sign, $this->accessSecret)));
}

private function _getSortArray($array)
{
    foreach ($array as $key => $value) {
        if (is_array($value)) {
            $array[$key] = $this->_getSortArray($value);
        }
    }

    ksort($array);
    return $array;
}
```

---

## 4. Parameter Response (返回参数)

- **Format Saat Ini:** Seluruh respons API dikembalikan dalam format standar **JSON**.
- **Roadmap / Rencana Lanjutan:** Dukungan format **XML** direncanakan untuk pembaruan berikutnya.

---

## 5. Peta Katalog Modul UPFOS Open API (Table of Contents)

Dokumentasi UPFOS API terbagi ke dalam kelompok modul bisnis berikut:

```text
├── Upfos-API简介 (jianjie) ─────────── [Dokumen ini: Pengantar, Parameter Publik, Double MD5 Signature]
├── API更新说明 (mgrtz2) ────────────── [Changelog / Riwayat Pembaruan API]
├── 注意事项/常见错误 (gzpvr3) ──────── [Troubleshooting, FAQ & Kode Error Umum]
│
├── [GROUP] 商品API (Item / Master Produk)
│   ├── 商品新增(SPU) (item.add) ──────────────────── Tambah Produk Induk (SPU)
│   ├── 规格新增（SKU） (item.sku.add) ─────────────── Tambah Varian Produk (SKU)
│   ├── 商品列表查询 (item.getlist) ───────────────── Query Daftar Produk & Varian
│   ├── 组合商品明细查询 (item.combine.detail.get) ── Detail Komposisi Paket / Bundle
│   ├── 条码新增 (barcode.add) ────────────────────── Tambah Barcode Produk
│   └── 条码列表查询 (barcode.getlist) ────────────── Query Daftar Barcode
│
├── [GROUP] 订单API (Order & Pengiriman)
│   ├── 交接单新增 (zqhk2a) ────────────────────────── Buat Dokumen Serah Terima / Handover
│   ├── 交接单状态修改 (lgg74t) ────────────────────── Update Status Serah Terima Kurir
│   ├── 订单新增 (trade.add) ──────────────────────── Buat Sales Order Baru
│   ├── 订单列表查询 (trade.getlist) ───────────────── Query Daftar Sales Order
│   ├── 订单明细查询 (trade.getdetail) ─────────────── Query Detail Lengkap Sales Order
│   ├── 订单物流轨迹查询 (delivery.logistics...) ────── Pelacakan / Tracking Ekspedisi
│   ├── 订单修改 (trade.update) ───────────────────── Pembaruan Data Sales Order
│   ├── 发货单查询 (delivery.getlist) ─────────────── Query Surat Jalan / Delivery Order
│   ├── 发货单明细查询 (delivery.getdetail) ────────── Detail Surat Jalan
│   ├── 发货单批次唯一码查询 (delivery.getbatchunique) Pelacakan Serial / Batch Unique Code Pengiriman
│   └── 发货单修改 (delivery.update) ──────────────── Update Data Pengiriman
│
├── [GROUP] 退换货API (After-Sale / Retur & Klaim)
│   ├── 退换货单新增 (after.sale.add) ─────────────── Buat Dokumen Retur Pelanggan
│   ├── 退换货单明细查询 (after.sale.getdetail) ────── Query Detail Barang Retur
│   ├── 退换货单入库 (after.sale.entry) ───────────── Eksekusi Penerimaan Barang Retur ke Gudang
│   ├── 退换货单查询 (after.sale.getlist) ─────────── Query Daftar Dokumen Retur
│   └── 退换货单批次唯一码查询 (after.sale.getbatchunique) Pelacakan Batch/Serial Barang Retur
│
├── [GROUP] 采购API (Purchasing / Pengadaan)
│   ├── 采购订单新增 (purchase.add) ────────────────── Buat Draft Purchase Order (PO)
│   ├── 采购订单明细新增 (purchase.detail.add) ──────── Tambah Item Barang ke PO
│   ├── 采购订单审核 (purchase.approve) ────────────── Approval / Persetujuan PO
│   ├── 采购订单终结 (purchase.finish) ─────────────── Penyelesaian / Penutupan PO
│   └── 采购订单列表查询 (purchase.getlist) ────────── Query Daftar Purchase Order
│
├── [GROUP] 库存API (Inventory & Pergudangan)
│   ├── 出库单新增 (outstorage.add) ────────────────── Buat Permintaan Pengeluaran Stok (Outbound)
│   ├── 出库单明细新增 (outstorage.detail.add) ──────── Tambah Item Pengeluaran Barang
│   ├── 出库单审核 (outstorage.approve) ────────────── Approval Pengeluaran Stok
│   ├── 出库单出库 (outstorage.outstorage) ────────── Eksekusi Pemotongan Stok Fisik (Outbound Execute)
│   ├── 出库单列表查询 (outstorage.getlist) ────────── Query Daftar Dokumen Outbound
│   ├── 出库单批次唯一码查询 (outstorage.getbatchunique) Pelacakan Batch / Serial Keluar
│   ├── 入库单新增 (instorage.add) ─────────────────── Buat Dokumen Penerimaan Stok (Inbound)
│   ├── 入库单明细新增 (instorage.detail.add) ──────── Tambah Item Penerimaan Barang
│   ├── 入库单入库 (instorage.instorage) ──────────── Eksekusi Penambahan Stok Fisik (Inbound Execute)
│   ├── 入库单列表查询 (instorage.getlist) ─────────── Query Daftar Dokumen Inbound
│   ├── 入库单明细查询 (kffzr6yz03i2ktp8) ──────────── Query Detail Barang Masuk
│   ├── 入库单批次唯一码查询 (instorage.getbatchunique) Pelacakan Batch / Serial Masuk
│   └── 库存查询 (stock.qty.getlist) ──────────────── Query Kuantitas Stok Realtime per SKU & Gudang
│
└── [GROUP] Webhook (Notifikasi Asinkron Push ERP)
    ├── 推送业务和机制 (dwpgwo2wabw2gy84) ─────────── Arsitektur, Retry Policy & Mekanisme Webhook
    ├── 销售订单推送 (uabgkv24s790eh97) ────────────── Push Event Saat Terjadi Pembaruan Sales Order
    └── 发货单推送 (hws10xf7h0c7rrdi) ─────────────── Push Event Saat Surat Jalan Terbit / Selesai
```

---

## 6. Korelasi Langsung dengan Sistem OlshopERP

UPFOS adalah sistem ERP e-commerce pendahulu yang menjadi acuan arsitektur bisnis bagi OlshopERP. Terdapat beberapa korelasi penting yang terdokumentasi di repositori OlshopERP:

1. **Design Guard `GAP-BOOK-02` (Deduplikasi Pesanan Shopee):**
   - Di repositori OlshopERP (`qa-docs/omni-sales-platform/requirement.md` dan `knowledge-base.md`), terdapat catatan kegagalan fatal pada sistem UPFOS ketika menangani pesanan Shopee jalur *advance package*.
   - Pada alur tersebut, `order_id` sering masuk terlebih dahulu tanpa `booking_sn`. Di UPFOS lama, kondisi ini menyebabkan terbentuknya **2 Sales Order terpisah untuk 1 pesanan yang sama**.
   - Di OlshopERP, diterapkan invariant ketat: sistem wajib menahan (*skip create SO kedua*) sampai status menjadi `MATCHED`, mencegah duplikasi order.

2. **Pemisahan State Transaksi Gudang (Multi-Stage State Machine):**
   - Seperti halnya UPFOS yang memisahkan antara `Add` $\rightarrow$ `Detail Add` $\rightarrow$ `Approve` $\rightarrow$ `Execute` (Inbound/Outbound), OlshopERP menerapkan alur bertingkat serupa pada modul Supply Chain (seperti *Stock Opname*, *Assembly/Disassembly*, dan *Inter-Warehouse Transfer*).

3. **Audit Keamanan Gateway:**
   - Parameter `nonce` unik dan batas waktu `timestamp` $\le 3$ menit merupakan standar industri untuk pengamanan integrasi API ERP yang relevan saat menguji modul integrasi atau webhook di OlshopERP.
