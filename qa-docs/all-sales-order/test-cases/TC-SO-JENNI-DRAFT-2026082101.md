---
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082101
title: "UI Visibility tombol "Extract this bundle" hanya muncul pada SKU yang ter-flagging sebagai BUNDLE"
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

# Test Case: UI Visibility tombol "Extract this bundle" hanya muncul pada SKU yang ter-flagging sebagai BUNDLE

## 📋 Summary
Memastikan tombol "Extract this bundle" hanya tampil pada baris SKU yang ter-flagging sebagai BUNDLE dan tidak muncul pada SKU Non-Bundle.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu All Sales Order.
- Berada di halaman `/businessdevelopment/all-sales-order` / detail SO.

## 🧪 Test Steps
1. Buka menu All Sales Order (https://staging.olshoperp.com/businessdevelopment/all-sales-order).
2. Buka halaman detail / edit dokumen Sales Order yang memiliki campuran SKU Bundle dan SKU Non-Bundle.
3. Periksa tampilan kolom aksi / detail pada baris SKU Non-Bundle vs SKU Bundle.

## ✅ Expected Result
- Tombol "Extract this bundle" hanya muncul pada SKU yang ter-flagging BUNDLE.
- SKU Non-Bundle tidak menampilkan tombol "Extract this bundle".

## 📊 Result Test (Hasil Pengujian)
**Status Hasil**: PASSED ✅
