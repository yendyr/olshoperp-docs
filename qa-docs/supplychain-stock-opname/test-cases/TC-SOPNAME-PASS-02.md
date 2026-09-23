---
doc_type: e2e-test-case
tc_code: TC-SOPNAME-PASS-02
menu: supplychain-stock-opname
menu_name: "Stock Opname"
test_type: happy
title: "Approval Dokumen Stock Opname dengan Unit Price Desimal pada Menu Stock Opname Approval"
summary: "Memastikan proses approval dokumen Stock Opname yang memuat harga desimal berhasil disetujui tanpa ditolak oleh guard whole-number dan mengalir ke Adjustment Addition serta Jurnal."
status: draft
owner: "QA - Yemima"
last_updated: 2026-09-18
requirement_ref: "qa-docs/supplychain-stock-opname/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15968
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-stock-opname-approval
first_execution:
  at: null
  jira: null
  via: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-SOPNAME-PASS-02: Approval Dokumen Stock Opname dengan Unit Price Desimal pada Menu Stock Opname Approval

## Objective
Memverifikasi pelepasan validasi whole-number saat proses Approve di menu Stock Opname Approval (`/accounting/stock-opname-approval`), sehingga dokumen dengan baris unit price desimal dapat disetujui (Approved) dan membentuk transaksi Adjustment Addition serta jurnal finansial yang sinkron.

## Preconditions
1. User login dengan role Finance / Approver di OlshopERP Staging.
2. Terdapat dokumen Stock Opname berstatus `Open` / `Waiting Approval` yang memiliki baris surplus dengan Unit Price desimal (contoh: Qty Difference = 10, Unit Price = `12500.50`).
3. Periode fiskal aktif dan gudang tujuan valid.

## Test Steps
1. Buka menu **Accounting → Stock Opname Approval** (`/accounting/stock-opname-approval`).
2. Cari dan buka dokumen Stock Opname target.
3. Periksa kembali bahwa baris surplus memuat Unit Price desimal (`12500.50`).
4. Klik tombol **Approve**.
5. Konfirmasi dialog persetujuan.

## Expected Results
1. Dokumen Stock Opname berhasil di-approve dan status berubah menjadi **Approved**.
2. Sistem tidak menolak proses approval dengan error *"must be entered with a Unit Price in whole numbers"*.
3. Sistem secara otomatis men-generate dokumen **Adjustment Addition** (`/supplychain/adjustment-addition`) dengan nilai Unit Price `12500.50` dan total nilai inventory yang presisi.
4. Entri jurnal finansial yang terbentuk mencatat nilai debit persediaan dan kredit penyesuaian stok sesuai kalkulasi harga desimal.
