---
owner: QA - Jenni
tc_code: TC-ASO-019
title: "Eksekusi "Extract this bundle" pada SKU Bundle tipe VARIANT 'RANDOM'"
module: BusinessDevelopment
menu: all-sales-order
menu_slug: all-sales-order
type: functional
priority: high
test_type: edge
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
first_execution:
  at: "2026-08-21"
  via: "manual:Jenni"
  jira: null
last_execution:
  at: "2026-08-21"
  jira: null
  status: passed
  via: "manual:Jenni"
  notes: "Icon/tombol extract tidak muncul pada SKU Bundle Variant Random, sesuai ekspektasi karena komponennya baru ditentukan saat SO di-send to waves."
---

# Test Case: Eksekusi "Extract this bundle" pada SKU Bundle tipe VARIANT 'RANDOM'

## 📋 Summary
Memastikan perilaku tombol extract pada SKU Bundle Variant Random yang mana komponen baru ditentukan saat SO di-send to waves.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu All Sales Order.
- Berada di halaman `/businessdevelopment/all-sales-order` / detail SO.

## 🧪 Test Steps
1. Buka detail Sales Order yang berisi SKU Bundle tipe VARIANT RANDOM.
2. Periksa keberadaan ikon / tombol "Extract this bundle" pada baris SKU Bundle Random.

## ✅ Expected Result
- Icon/tombol extract tidak muncul pada SKU Bundle Random karena komponennya baru ditentukan saat SO di-send to waves.

## 📊 Result Test (Hasil Pengujian)
**Status Hasil**: PASSED ✅
