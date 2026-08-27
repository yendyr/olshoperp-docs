---
doc_type: e2e-test-case
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082706
title: "POV Purchase Invoice — Akurasi Rekalkulasi Dynamic Total Tagihan saat Advance Filter & Global Search Aktif"
status: draft
module: Accounting
menu: accounting-purchase-report
menu_name: "Purchase Report"
test_type: happy
priority: high
automated: false
automated_spec: null
origin_jira: ETM-15488
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - accounting-supplier-invoice
preconditions:
  - "User login ke OlshopERP pada company target (misal Dev Staging ID 13)"
  - "Navigasi ke menu Purchase Report (https://staging.olshoperp.com/accounting/purchase-report)"
  - "Terdapat data transaksi Purchase Invoice dengan variasi supplier dan nilai tagihan"
requirement_ref: "qa-docs/accounting-purchase-report/requirement.md"
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# Test Case: POV Purchase Invoice — Akurasi Rekalkulasi Dynamic Total Tagihan saat Advance Filter & Global Search Aktif

## 📋 Summary
Memastikan nilai Total Tagihan (pada header group supplier maupun footer summary) bersifat dinamis dan otomatis melakukan rekalkulasi secara presisi sesuai dengan subset data yang muncul setelah difilter melalui Advance Filter atau Global Search.

## ⚙️ Preconditions
- User login ke OlshopERP dengan akses menu Finance / Accounting Report.
- Berada di halaman `/accounting/purchase-report`.

## 🧪 Test Steps
1. Buka menu Accounting -> Report -> Purchase Report (https://staging.olshoperp.com/accounting/purchase-report).
2. Pilih Type = "Purchase Invoice" dan tentukan Date Range (misal 30 hari terakhir).
3. Catat nilai akumulasi Total Tagihan awal pada header group Supplier dan footer summary sebelum pencarian.
4. Masukkan kata kunci pencarian pada kolom **Global Search** (misal spesifik nama SKU atau produk tertentu).
5. Amati perubahan nilai Total Tagihan pada header group Supplier dan footer summary.
6. Hapus filter Global Search, lalu aktifkan **Advance Filter / SearchBuilder** (misal buat kondisi `Total Price >= 1.000.000` atau filter Supplier tertentu).
7. Klik Apply / Filter dan verifikasi kembali akumulasi Total Tagihan.

## ✅ Expected Result
- Nilai Total Tagihan bersifat dinamis dan otomatis melakukan rekalkulasi presisi mengikuti subset data yang tampil di layar.
- Saat Global Search / Advance Filter aktif, Total Tagihan di header group Supplier hanya memuat jumlah dari baris-baris data yang lolos filter pencarian.
- Tidak ada data Total Tagihan yang bernilai statis, terpotong salah, atau menampilkan nilai dari keseluruhan data sebelum di-filter.
