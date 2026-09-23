# Modul 6: Webhook & Integrasi Notifikasi Asinkron (Webhook API) — UPFOS Open API

> **Status:** Modul Pembelajaran & Referensi Teknis Komprehensif  
> **Target Audiens:** QA Engineer, Backend Developer, Integration Engineer  
> **Lingkungan Gateway:** `https://api.upfos.com/v2` (Demo: `https://demo.upfos.com/v2`)

---

## 1. Arsitektur & Mekanisme Webhook

Webhook UPFOS adalah mekanisme notifikasi berbasis event (*event-driven architecture*) menggunakan protokol HTTP POST. Alih-alih sistem eksternal melakukan *polling* (mengecek API berulang-ulang setiap menit), gateway UPFOS secara proaktif mengirimkan paket data JSON ke URL server mitra (*endpoint listener*) seketika saat status bisnis berubah.

### 1.1 Kontrak Respons Receiver (Endpoint Mitra)
Server mitra yang menerima payload webhook **wajib** mengembalikan response HTTP dengan ketentuan mutlak:
* **HTTP Status Code:** `200 OK`
* **Format Body:** JSON dengan format baku:
  ```json
  {
    "success": true
  }
  ```

### 1.2 Kebijakan Percobaan Ulang (Retry Policy)
Jika server penerima mengalami *timeout* (lebih dari 5 detik) atau mengembalikan status HTTP selain `200 OK` (misal: 500 Internal Server Error, 502 Bad Gateway), sistem UPFOS akan menganggap pengiriman gagal dan menjalankan jadwal *retry*:
* Percobaan ulang dilakukan otomatis sebanyak **3 kali** dengan interval berkala (*exponential backoff*).
* Jika setelah 3 kali percobaan tetap gagal, status notifikasi ditandai sebagai *failed* dan dapat dipicu ulang secara manual dari dashboard administrasi UPFOS.

---

## 2. Event Push Notifikasi yang Didukung

### 2.1 Push Pembaruan Status Sales Order (`uabgkv24s790eh97` / `sales.order.push`)

Dipicu setiap kali status pesanan penjualan mengalami perubahan di UPFOS (misalnya: pesanan terverifikasi lunas, barang berhasil dialokasikan, pesanan selesai dikemas, atau pesanan dibatalkan).

*Contoh Payload JSON yang Dikirimkan ke Mitra:*
```json
{
  "event_type": "ORDER_STATUS_CHANGED",
  "timestamp": 1586241203,
  "shop_code": "SHOP-SHOPEE-ID",
  "trade_code": "ORD-20260923-0091",
  "status": "DELIVERED",
  "express_no": "JP1234567890",
  "logistics_code": "JNT",
  "update_time": 1586241199
}
```

---

### 2.2 Push Penerbitan Surat Jalan (`hws10xf7h0c7rrdi` / `delivery.order.push`)

Dipicu ketika gudang selesai menerbitkan Surat Jalan (Delivery Order) atau saat paket pengiriman telah resmi dicetak label resinya.

*Contoh Payload JSON yang Dikirimkan ke Mitra:*
```json
{
  "event_type": "DELIVERY_ORDER_CREATED",
  "timestamp": 1586241500,
  "delivery_code": "DO-20260923-0012",
  "trade_code": "ORD-20260923-0091",
  "warehouse_code": "WH-JAKARTA-01",
  "express_no": "JP1234567890",
  "logistics_name": "J&T Express",
  "package_count": 1
}
```
