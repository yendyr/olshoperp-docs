---
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082102
title: "Eksekusi "Extract this bundle" pada SKU Bundle tipe Single"
module: BusinessDevelopment
menu: All Sales Order
menu_slug: all-sales-order
type: functional
priority: high
test_type: happy
automated: false
automated_spec: null
origin_jira: ETM-15637
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - sales-order-general
preconditions:
  - "User login ke OlshopERP pada company target (misal Dev Staging ID 13)"
  - "Navigasi ke menu All Sales Order (https://staging.olshoperp.com/businessdevelopment/all-sales-order)"
  - "Dokumen Sales Order (edit mode) berisi campuran SKU Non-Bundle dan SKU Bundle"
last_execution:
  at: "2026-08-21"
  jira: null
  status: failed
  via: "manual:Jenni"
  notes: "Sistem menampilkan notifikasi Error 500 Something Went Wrong saat extract SKU Bundle tipe Single dieksekusi, bukan berhasil terurai jadi komponen Single."
---

# Test Case: Eksekusi "Extract this bundle" pada SKU Bundle tipe Single

## 📋 Summary
Memastikan proses ekstraksi SKU Bundle tipe Single pada detail Sales Order dapat mengekstrak seluruh komponen produk Single pembentuknya dengan benar.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu All Sales Order.
- Berada di halaman `/businessdevelopment/all-sales-order` / detail SO.

## 🧪 Test Steps
1. Buka halaman detail / edit Sales Order yang berisi SKU Bundle tipe Single.
2. Klik tombol "Extract this bundle" pada baris SKU Bundle Single tersebut.
3. Konfirmasi proses ekstraksi bundle.
4. Periksa respon sistem dan perubahan detail SKU pada Sales Order.

## ✅ Expected Result
- SKU Bundle tipe Single berhasil di-extract menjadi komponen-komponen SKU Single pembentuknya tanpa error.
- (Actual Fail): Sistem menampilkan notifikasi Error 500 "Something Went Wrong".

## 📊 Result Test (Hasil Pengujian)
**Status Hasil**: FAILED ❌ (Error 500: Something Went Wrong)
