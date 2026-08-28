---
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082105
title: "Ekstraksi bundle pada Sales Order dengan 100 baris detail SKU sehingga total baris > 100 rows"
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
  status: failed
  via: "manual:Jenni"
  notes: "Sistem meloloskan extract bundle sehingga detail rows bertambah jadi 101 baris pada SO-5U734TJW, seharusnya diblokir pada batas maksimal 100 baris."
---

# Test Case: Ekstraksi bundle pada Sales Order dengan 100 baris detail SKU sehingga total baris > 100 rows

## 📋 Summary
Memastikan batas maksimal 100 baris detail SKU pada Sales Order ditegakkan ketika ekstraksi bundle akan menyebabkan total detail rows melebihi 100 baris.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu All Sales Order.
- Berada di halaman `/businessdevelopment/all-sales-order` / detail SO.

## 🧪 Test Steps
1. Buka Sales Order yang sudah memiliki 100 baris detail SKU (misal SO-5U734TJW).
2. Lakukan klik "Extract this bundle" pada salah satu SKU Bundle di SO tersebut.
3. Periksa apakah sistem memblokir atau meloloskan proses ekstraksi.

## ✅ Expected Result
- Sistem harus memblokir ekstraksi dan menampilkan peringatan batas maksimal 100 baris detail Sales Order.
- (Actual Fail): Sistem meloloskan extract bundle sehingga detail rows bertambah menjadi 101 baris pada SO: SO-5U734TJW.

## 📊 Result Test (Hasil Pengujian)
**Status Hasil**: FAILED ❌ (Total baris menjadi 101 rows pada SO-5U734TJW)
