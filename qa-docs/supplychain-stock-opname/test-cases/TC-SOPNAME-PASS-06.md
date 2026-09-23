---
doc_type: e2e-test-case
tc_code: TC-SOPNAME-PASS-06
menu: supplychain-stock-opname
menu_name: "Stock Opname"
test_type: regression
title: "Verifikasi Regresi Input dan Approval Unit Price Desimal pada Menu Opening Stock"
summary: "Memastikan shared engine dan validasi harga pada Opening Stock ikut mendukung unit price desimal, dapat disimpan serta di-approve dengan sukses, dan otomatis meng-generate dokumen inbound."
status: draft
owner: "QA - Yemima"
last_updated: 2026-09-23
requirement_ref: "qa-docs/supplychain-stock-opname/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15968
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - accounting-opening-stock
  - supplychain-stock-addition
test_data:
  - field: "Transaction Code Opening Stock"
    value: "OS-5UJ2EW5E"
  - field: "SKU"
    value: "COMP-R2"
  - field: "Unit Price"
    value: "200.67"
  - field: "Generated Inbound Document"
    value: "AI-5UJ2FFZE"
steps:
  - "1. Buka menu Accounting → Opening Stock (/accounting/opening-stock)"
  - "2. Buat dokumen Opening Stock baru di company Dev Staging"
  - "3. Tambahkan baris produk COMP-R2 dan masukkan nilai Unit Price desimal 200,67"
  - "4. Simpan dokumen Opening Stock (OS-5UJ2EW5E)"
  - "5. Lakukan proses Approve pada dokumen tersebut"
  - "6. Verifikasi keberhasilan approval dan pembuatan dokumen inbound otomatis"
expected_result: |
  1. Pengisian Unit Price desimal 200,67 berhasil disimpan tanpa error whole numbers maupun error 'Stock mutation not found'.
  2. Dokumen Opening Stock OS-5UJ2EW5E berhasil di-approve.
  3. Stok berhasil masuk dan sistem otomatis meng-generate dokumen Inbound (Stock Addition) dengan kode transaksi terkait.
test_result:
  status: passed
  started_at: "2026-09-23T13:20:00+07:00"
  finished_at: "2026-09-23T13:40:00+07:00"
  executed_by: "QA - Yemima / OlshopERP"
  environment: staging
  log_summary: "PASSED: Dokumen Opening Stock OS-5UJ2EW5E dengan SKU COMP-R2 dan unit price desimal 200,67 berhasil disimpan dan di-approve. Stok berhasil masuk dengan auto-generate dokumen inbound AI-5UJ2FFZE."
  report_url: null
test_data_used:
  - trx_code_opening_stock: "OS-5UJ2EW5E"
    sku: "COMP-R2"
    unit_price: 200.67
    trx_code_inbound: "AI-5UJ2FFZE"
run_history:
  - run_at: "2026-09-18T16:54:00+07:00"
    status: failed
    via: "manual:QA - Jeiniffer"
    jira: "ETM-15968"
    note: "Stock mutation not found saat tambah produk select2 di Opening Stock"
  - run_at: "2026-09-23T13:40:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-15982"
first_execution:
  at: "2026-09-18T16:54:00+07:00"
  via: "manual:QA - Jeiniffer"
  jira: "ETM-15968"
last_execution:
  at: "2026-09-23T13:40:00+07:00"
  jira: "ETM-15982"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOPNAME-PASS-06: Verifikasi Regresi Input dan Approval Unit Price Desimal pada Menu Opening Stock

## Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada parent card re-open **ETM-15982** (asal: **ETM-15968**).
- Jira Card: [ETM-15982](https://erpintegration.atlassian.net/browse/ETM-15982) (`REOPEN [Stock Opname Approval] Lakukan penyesuaian pada kolom unit price agar user dapat input nilai desimal 2 angka dibelakang koma`).
- Company: **Dev Staging (DEV-STG, ID: 13)**.

### Bukti Eksekusi (Actual Result)
- **Menu:** Accounting → Opening Stock (`/accounting/opening-stock`).
- **Dokumen Opening Stock:** `OS-5UJ2EW5E`
- **Produk / SKU:** `COMP-R2`
- **Unit Price Desimal:** `200,67`
- **Aksi:** Memilih SKU `COMP-R2`, menginputkan Unit Price desimal `200,67`, menyimpan dokumen, lalu melakukan klik tombol **Approve**.
- **Hasil:**
  1. Dokumen Opening Stock `OS-5UJ2EW5E` berhasil disimpan dan di-approve tanpa memicu error validasi whole numbers maupun error *"Stock mutation not found"*.
  2. Stok produk `COMP-R2` berhasil masuk ke inventory.
  3. Sistem secara otomatis men-generate dokumen Inbound (Stock Addition) dengan kode **`AI-5UJ2FFZE`** ✅.
- **Kesimpulan:** **PASSED**. Isu regresi pada shared engine Opening Stock telah teratasi sepenuhnya. Sistem kini mendukung input dan kalkulasi Unit Price desimal hingga tahap approval dan pembentukan mutasi persediaan secara tepat.
