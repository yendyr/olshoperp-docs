# Modul 0: Fondasi Arsitektur, Otentikasi & Keamanan Gateway UPFOS Open API

> **Status:** Modul Pembelajaran & Referensi Teknis Komprehensif  
> **Target Audiens:** QA Engineer, Backend Developer, Integrator Sistem, Tech Lead  
> **Lingkungan Gateway:**
> - **Production Server:** `https://api.upfos.com/v2`
> - **Demo / Sandbox Server:** `https://demo.upfos.com/v2` *(URL legacy: `http://111.0.90.96:8086/v1`)*

---

## 1. Pendahuluan & Latar Belakang

UPFOS Open API adalah gerbang integrasi bisnis berbasis HTTP REST yang disediakan oleh sistem UPFOS ERP bagi pihak ketiga (*third-party systems*). Antarmuka ini dirancang untuk menjembatani pertukaran data operasional secara dua arah (*two-way synchronization*) antara ERP dengan berbagai platform eksternal:
1. **Marketplace & E-Commerce:** Penarikan pesanan baru, pembaruan nomor resi, dan sinkronisasi kuantitas stok secara otomatis.
2. **WMS (Warehouse Management System) / 3PL:** Otomasi proses inbound gudang, outbound, dan pelacakan surat jalan pengiriman.
3. **Sistem Akuntansi & ERP Internal:** Sinkronisasi purchase order, pencatatan mutasi barang, dan data transaksi penjualan.

---

## 2. Parameter Publik (Common Request Headers / Parameters)

Setiap request yang dikirimkan ke endpoint gateway UPFOS **wajib** menyertakan parameter publik berikut, baik dikirimkan melalui URL query string maupun request body JSON:

| Nama Field | Tipe Data | Wajib? | Aturan Validasi & Deskripsi Lengkap |
| :--- | :--- | :---: | :--- |
| `access_key` | String | **Ya** | Kunci otorisasi (*App Key*) unik milik merchant yang diterbitkan oleh sistem UPFOS. Berfungsi sebagai identifikasi akun merchant pemanggil. |
| `sign` | String | **Ya** | Tanda tangan digital hasil enkripsi dari seluruh parameter request. Menjamin bahwa parameter tidak mengalami manipulasi di tengah transmisi (*data integrity*). |
| `method` | String | **Ya** | Nama fungsi/metode bisnis yang hendak dieksekusi (contoh: `trade.add`, `item.getlist`, `outstorage.add`). |
| `timestamp` | Number | **Ya** | Unix timestamp dalam satuan **detik**. Gateway menerapkan proteksi waktu: **toleransi perbedaan waktu antara client dan server UPFOS maksimal 3 menit (180 detik)**. Request di luar toleransi akan ditolak dengan error waktu kedaluwarsa. |
| `nonce` | String | **Ya** | String acak unik (*Number Used Once*) yang dibuat oleh pemanggil dengan **panjang maksimal 20 karakter**. Berfungsi sebagai proteksi **Anti-Replay Attack**: string nonce yang sama **dilarang digunakan ulang dalam rentang waktu 3 menit**. |
| `language` | String | Tidak | Lokalisasi bahasa pesan balasan error/notifikasi: `zh` (Mandarin) atau `en` (Inggris). Nilai *default* sistem adalah `en`. |

---

## 3. Algoritma Pembuatan Signature (`sign`)

UPFOS menggunakan skema keamanan **Double MD5 Hashing dengan Salt Secret**.

### 3.1 Langkah-Langkah Perhitungan (Step-by-Step)

1. **Kumpulkan 4 Parameter Kunci:**
   - `access_key`
   - `method`
   - `nonce`
   - `timestamp`

2. **Urutkan Field Secara Ascending (A–Z / ASCII Sort):**
   Susun keempat nama field tersebut secara alfabetis berdasarkan nama parameternya.

3. **Gabungkan String (Concatenation):**
   Sambungkan pasangan nama dan nilai parameter dalam pola `keyvalue` berurutan tanpa spasi atau karakter pemisah apa pun, lalu tempelkan nilai `{secret}` (kunci rahasia milik merchant) di ujung akhir string.
   
   $$\text{raw\_string} = \text{access\_key} + V_{\text{access\_key}} + \text{method} + V_{\text{method}} + \text{nonce} + V_{\text{nonce}} + \text{timestamp} + V_{\text{timestamp}} + \{\text{secret}\}$$

   *Contoh Format Plaintext:*
   ```text
   access_keyefc3c409methodtrade.addnonce24234234timestamp1586241203095mySecretToken123
   ```

4. **Enkripsi MD5 Pertama:**
   Lakukan hashing MD5 pada string tersebut dan ubah hasilnya ke dalam bentuk **32 karakter Hexadecimal HURUF BESAR (Uppercase)**:
   $$\text{sign\_step\_1} = \text{MD5}(\text{raw\_string}) \quad [\text{UPPERCASE}]$$

5. **Salt & Enkripsi MD5 Kedua (Final Signature):**
   Gabungkan hasil $\text{sign\_step\_1}$ dengan nilai $\{\text{secret}\}$ kembali di ujung string, lalu lakukan hashing MD5 sekali lagi ke dalam 32 karakter Hexadecimal HURUF BESAR:
   $$\text{sign} = \text{MD5}(\text{sign\_step\_1} + \{\text{secret}\}) \quad [\text{UPPERCASE}]$$

---

### 3.2 Contoh Kode Implementasi Resmi

#### A. Bahasa Pemrograman Java (`Signature.java`)

```java
package com.biteng.open.utils;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.codec.Charsets;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.TreeMap;

public class Signature {

    private final String secret;
    private static final String SIGN = "sign";
    private static final String DIGEST = "MD5";

    public Signature(String secret) {
        this.secret = secret;
    }

    public String getSign(JSONObject params) throws NoSuchAlgorithmException {
        // Hapus field 'sign' jika sudah ada di dalam payload
        params.remove(SIGN);

        // Langkah 1 & 2: Urutkan parameter secara alfabetis dan rangkai key-value
        StringBuilder query = builder(params);

        // Langkah 3: Tambahkan secret di ujung string
        query.append(this.secret);

        // Langkah 4: MD5 pertama (32 bit uppercase)
        String sign = encryptMD5(query.toString());

        // Langkah 5: Salt dengan secret dan lakukan MD5 kedua
        return encryptMD5(String.format("%s%s", sign, this.secret));
    }

    private StringBuilder builder(JSONObject params) {
        Map<String, Object> sortedParams = new TreeMap<>(params);
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, Object> param : sortedParams.entrySet()) {
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
        for (byte b : bytes) {
            String hex = Integer.toHexString(b & 0xFF);
            if (hex.length() == 1) {
                sign.append("0");
            }
            sign.append(hex.toUpperCase());
        }
        return sign.toString();
    }
}
```

#### B. Bahasa Pemrograman PHP

```php
<?php

class UpfosSignature
{
    private string $accessSecret;

    public function __construct(string $accessSecret)
    {
        $this->accessSecret = $accessSecret;
    }

    public function getSign(array $params): string
    {
        // Hapus parameter sign jika ada
        unset($params['sign']);

        // Urutkan key array secara rekursif
        $sortedParams = $this->sortArrayRecursive($params);

        // Rangkai string keyvalue
        $str = "";
        foreach ($sortedParams as $key => $value) {
            $str .= $key . (is_bool($value) ? ($value ? 'true' : 'false') : $value);
        }

        // Tambahkan secret di akhir
        $str .= $this->accessSecret;

        // MD5 pertama (Uppercase)
        $signStep1 = strtoupper(md5($str));

        // MD5 kedua dengan salt secret (Final Signature)
        return strtoupper(md5($signStep1 . $this->accessSecret));
    }

    private function sortArrayRecursive(array $array): array
    {
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $array[$key] = $this->sortArrayRecursive($value);
            }
        }
        ksort($array);
        return $array;
    }
}
```

---

## 4. Ketentuan Operasional & Best Practices Integrasi

### 4.1 Aturan Paginasi Data
Untuk menjaga stabilitas performa database, gateway UPFOS memisahkan antara pengambilan daftar induk (*Header List*) dan pengambilan rincian barang (*Detail*):
* **Paginasi Daftar Transaksi (`page_size` pada List API):** Nilai *default* adalah **10**, batas maksimal per request adalah **50 baris**.
* **Paginasi Detail Item Transaksi (`page_size` pada Detail API):** Nilai *default* adalah **10**, batas maksimal per request adalah **100 baris**.

### 4.2 Aturan Pemetaan Kode Produk (`item_code` vs `sku_code`)
* `item_code`: Merepresentasikan kode produk induk (**SPU**).
* `sku_code`: Merepresentasikan kode spesifikasi varian (**SKU**).
* **Aturan Penting:** Jika produk memiliki varian di mana kode barang induk berbeda dengan variannya, maka field `sku_code` **wajib dikirimkan** agar alokasi stok tidak salah sasaran.

### 4.3 Penanganan Error & Rate Limiting (Batas Kuota)
Gateway menerapkan pembatasan frekuensi request untuk mencegah *overloading*:
1. **HTTP 503 User Request Limit:**
   ```json
   {
     "error_code": "503",
     "error_msg": "user request limit",
     "request_method": "trade.getList",
     "success": false
   }
   ```
   *Penyebab & Solusi:* Batas kuota panggilan per akun merchant telah terlampaui. Implementasikan mekanisme *Exponential Backoff* pada sistem pemanggil atau ajukan peningkatan limit kuota ke tim UPFOS.
2. **Application Request Limit:**
   *Pesan:* `Application request limit, Try again later`  
   *Penyebab & Solusi:* Batas kapasitas gateway aplikasi secara keseluruhan sedang penuh. Tunggu beberapa detik sebelum mengirim request ulang.

---

## 5. Riwayat Pembaruan Gateway (Changelog Signifikan)

| Tanggal Rilis | Endpoint Terkait | Rincian Pembaruan |
| :--- | :--- | :--- |
| **12 Sep 2023** | `trade.getdetail` | Penambahan fitur pencarian batch nomor transaksi (`trade_code`). Mendukung banyak nomor pesanan dipisahkan koma (`,`), minimal 1 dan maksimal 50 pesanan dalam 1 kali panggilan. |
| **16 Mei 2023** | `trade.getdetail` | Penambahan field informasi toko dan waktu: `create_date` (waktu pembuatan), `deal_time` (waktu pembayaran), `shop_name`, `shop_code`, dan `source_platform_code` (Shopee, Lazada, dll). |
| **12 Mei 2023** | `trade.getList`, `delivery.getList` | Pengetatan validasi tanggal dari opsional menjadi **Wajib (Mandatory)**: `modify_start_date` & `modify_end_date` pada pesanan; `update_time_from` & `update_time_to` pada surat jalan. |
| **15 Mei 2020** | Modul Gudang (`outstorage.*`) | Rilis arsitektur modul pengeluaran barang gudang (tiket outbound, input detail barang, dan approval pengeluaran stok). |
