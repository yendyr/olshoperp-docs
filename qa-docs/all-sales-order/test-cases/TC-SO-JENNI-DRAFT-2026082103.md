---
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082103
title: "Eksekusi "Extract this bundle" pada SKU Bundle tipe VARIANT"
module: BusinessDevelopment
menu: All Sales Order
menu_slug: all-sales-order
type: functional
priority: high
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
---

# Test Case: Eksekusi "Extract this bundle" pada SKU Bundle tipe VARIANT

## 📋 Summary
Memastikan proses ekstraksi SKU Bundle tipe VARIANT pada detail Sales Order mengekstrak komponen variant yang dipilih secara presisi.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu All Sales Order.
- Berada di halaman `/businessdevelopment/all-sales-order` / detail SO.

## 🧪 Test Steps
1. Buka detail Sales Order (misal SO-5U72N54A).
2. Pilih SKU Bundle tipe VARIANT dan klik "Extract this bundle".
3. Konfirmasi ekstraksi dan periksa detail baris item Sales Order.

## ✅ Expected Result
- SKU Bundle Variant berhasil terurai menjadi komponen variant pembentuknya.
- (Actual Fail): Sistem menampilkan Error 500 "Something Went Wrong" pada SO: SO-5U72N54A.

## 📊 Result Test (Hasil Pengujian)
**Status Hasil**: FAILED ❌ (Error 500: Something Went Wrong pada SO-5U72N54A)
