---
id: TC-PO-CRAWL-NON-PR-EXCLUDE-VAT-20260823093059
title: Create Purchase Order Without PR with Exclude VAT via Web UI Crawling
menu_slug: supplychain-purchase-order
type: positive
status: passed
created_at: 2026-08-23 09:30:59
author: Playwright Web Crawler
---

# TC-PO-CRAWL-NON-PR-EXCLUDE-VAT-20260823093059: Create Purchase Order Without PR with Exclude VAT via Web UI Crawling

## Description
Membuat transaksi **Purchase Order (Without PR)** secara end-to-end melalui metode **Web UI Crawling** di company **Lumi Charms.id** (`ID: 153`), menggunakan master data supplier yang baru dibuat (`SUPP-ONLY-1787448592996` / `PT Murni Supplier 1787448592996`) dan master product SKU yang baru dibuat (`LUMI-CRAWL-1787447920177`), dengan Qty `1` dan Unit Price `Rp 80.000`. Testcase ini memverifikasi bahwa kalkulasi VAT / PPN setelah input Unit Price adalah **Exclude PPN** (DPP = Rp 80.000, PPN 10% = Rp 8.000, Net Total = Rp 88.000) dan Purchase Order disimpan dalam status **Open / Draft (Belum Diapprove)**.

---

## Preconditions
1. **Active Company:** Lumi Charms.id (`ID: 153`, code: `lumicharmsid`).
2. **Master System Product Terdaftar & Active:**
   - SKU: `LUMI-CRAWL-1787447920177`
   - Name: `Produk Crawl Lumi 1787447920177`
   - Referensi Test Case: `TC-SYSPROD-004.md`
3. **Master General Company (Supplier Only) Terdaftar & Active:**
   - Code: `SUPP-ONLY-1787448592996`
   - Name: `PT Murni Supplier 1787448592996`
   - Recognize As: Supplier ONLY (`is_supplier = 1`, `is_customer = 0`)
   - Referensi Test Case: `TC-GC-CRAWL-SUPPLIER-ONLY-20260823082955.md`
4. **Approval Gate Constraint:** Sesuai instruksi test, Purchase Order **TIDAK diapprove** terlebih dahulu sebelum perhitungan VAT divalidasi.

---

## Step-by-Step UI Crawling

| Step | Aksi UI Crawling | Komponen / Selector | Input Data | Target Validasi |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Buka menu Purchase Order | `page.goto('/supplychain/purchase-order')` | - | Datalist PO terbuka |
| **2** | Klik tombol Create PO | `button#createButton`, `a[href*="/create"]`, `page.getByRole('button', { name: 'Create' })` | - | Form create PO terbuka di URL `/supplychain/purchase-order/create` |
| **3** | Pilih Supplier | `div:has(> label:has-text("Supplier")) .multiselect` | `PT Murni Supplier 1787448592996` | Opsi supplier terpilih di dropdown multiselect |
| **4** | Pilih Destination Warehouse | `div:has(> label:has-text("Warehouse")) .multiselect` | Default Warehouse (Wh Utama) | Warehouse tujuan terpilih |
| **5** | Pilih Tipe PO | `FormCheck.Input` `without_pr` | Checked / Selected | PO dibuat tanpa referensi PR |
| **6** | Simpan Header PO | `button` `Save & Next` | Click | PO Header tersimpan, sistem redirect ke URL `/supplychain/purchase-order/edit/{id}` dan generate Transaction Code `PO-*` |
| **7** | Buka Accordion Purchase Order Detail | `#PurchaseOrderDetail`, `button:has-text("Purchase Order Detail")` | Click | Section detail PO terbuka |
| **8** | Tambahkan Product SKU ke Detail | `#PurchaseOrderDetail .multiselect` `Select Product` | `LUMI-CRAWL-1787447920177` | Baris produk muncul di tabel detail PO |
| **9** | Input Order Quantity & Unit Price | Field Detail PO / Modal Edit Line Detail | Qty: `1`, Unit Price: `Rp 80.000` | Qty dan Unit Price terisi dengan benar |
| **10** | Periksa Konfigurasi & Kalkulasi VAT / PPN | Tax Type dropdown & Total Calculation | Tax Type: `Exclude PPN` | Perhitungan PPN dihitung di atas DPP (Exclude), bukan memotong DPP |
| **11** | Simpan Draft Transaksi (Save All) | `button` `Save All` | Click | Transaksi tersimpan dengan status `Open` (Draft) tanpa proses Approval |

---

## Detail Data Transaksi Hasil Crawling

- **Company:** Lumi Charms.id (`ID: 153`)
- **PO Transaction Code:** `PO-6A8A5BF6` (PO ID: `2636`)
- **Supplier:** `PT Murni Supplier 1787448592996` (`Code: SUPP-ONLY-1787448592996`, `ID: 1539`)
- **Transaction Date:** `23-08-2026 09:33:23`
- **PO Type:** `Without PR` (`with_pr = 0`)
- **Payment Type:** `90 Days` (`ID: 8`)
- **Transaction Status:** `Open` (`transaction_status = 'open'`, Draft / Belum Diapprove)

---

## Verifikasi Kalkulasi VAT / PPN

| Parameter | Nilai Tercatat | Keterangan |
| :--- | :--- | :--- |
| **Product SKU** | `LUMI-CRAWL-1787447920177` | Produk Crawl Lumi 1787447920177 |
| **Order Quantity** | `1 Pieces` | Base Unit: Pieces |
| **Unit Price (Before VAT / DPP)** | `Rp 80.000` | Harga pokok sebelum PPN |
| **VAT Type** | `Exclude` (`vat_included = false`) | PPN ditambahkan di atas harga DPP |
| **VAT Rate (%)** | `10%` | Nilai tarif pajak pada sistem |
| **VAT Amount (PPN)** | `Rp 8.000` | `1 x Rp 80.000 x 10% = Rp 8.000` |
| **Unit Price After VAT (Net)** | `Rp 88.000` | `Rp 80.000 + Rp 8.000 = Rp 88.000` |
| **Grand Total Before VAT (DPP)** | `Rp 80.000` | Total DPP transaksi PO |
| **Grand Total After VAT (Net Total)** | `Rp 88.000` | Total akhir tagihan PO |

---

## Expected Results
1. Transaksi Purchase Order berhasil dibuat via Web UI Crawling di company **Lumi Charms.id** (`ID: 153`).
2. Supplier yang digunakan sesuai dengan hasil test crawling `TC-GC-CRAWL-SUPPLIER-ONLY-20260823082955` (`SUPP-ONLY-1787448592996`).
3. Produk yang masuk ke line detail sesuai dengan hasil test crawling `TC-SYSPROD-004` (`LUMI-CRAWL-1787447920177`).
4. Unit Price tercatat tepat `Rp 80.000` dan Qty `1`.
5. Kalkulasi PPN terbukti **Exclude PPN** (`vat_included = false`), di mana DPP tetap utuh `Rp 80.000`, PPN `Rp 8.000`, dan Total Net `Rp 88.000`.
6. Transaksi berstatus `Open` (Draft) dan **belum diapprove**.

---

## Actual Results
- **Status:** **PASSED**
- Transaksi PO `PO-6A8A5BF6` berhasil dibuat dan disimpan melalui Web UI Crawling.
- Struktur kalkulasi PPN Exclude terverifikasi akurat dan siap digunakan untuk tahapan pengujian supply chain / accounting berikutnya.
