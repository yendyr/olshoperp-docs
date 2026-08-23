---
id: TC-INBOUND-CRAWL-FROM-PO-20260823101716
title: Create Purchase Inbound from Approved PO via Web UI Crawling
menu_slug: supplychain-new-purchase-inbound
type: positive
status: passed
created_at: 2026-08-23 10:17:16
author: Playwright Web Crawler
---

# TC-INBOUND-CRAWL-FROM-PO-20260823101716: Create Purchase Inbound from Approved PO via Web UI Crawling

## Description
Membuat transaksi **Purchase Inbound (Goods Receipt / Inbound)** secara end-to-end melalui metode **Web UI Crawling** di company **Lumi Charms.id** (`ID: 153`), dari dokumen Purchase Order yang telah diapprove (`PO-6A8A5BF6`) dengan supplier yang sama (`PT Murni Supplier 1787448592996` / `SUPP-ONLY-1787448592996`). 

Alur pengujian mencakup:
1. Menangani fitur auto-save draft saat create Purchase Inbound, kemudian mengupdate nama Supplier ke `PT Murni Supplier 1787448592996` dan melakukan `Save All`.
2. Membuka modal **Available Purchase Order**, memfilter berdasarkan nomor PO `PO-6A8A5BF6`, mencentang checkbox baris PO, dan mengklik tombol **Use** untuk memasukkan detail SKU (`LUMI-CRAWL-1787447920177`, Qty `1`) ke dalam detail transaksi Purchase Inbound.
3. Memastikan transaksi tersimpan dan **TIDAK diapprove** (status tetap `Open` / Draft).

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
4. **Purchase Order Terdaftar & Status Approved:**
   - Code: `PO-6A8A5BF6` (PO ID: `2636`)
   - Status: `Approved`
   - Line Item: SKU `LUMI-CRAWL-1787447920177`, Qty `1`, Unit Price `Rp 80.000` (Exclude PPN)
   - Referensi Test Case: `TC-PO-CRAWL-NON-PR-EXCLUDE-VAT-20260823093059.md`
5. **Constraint:** Transaksi Purchase Inbound **TIDAK diapprove** (hanya sampai insert detail SKU dari PO).

---

## Step-by-Step UI Crawling

| Step | Aksi UI Crawling | Komponen / Selector | Input Data | Target Validasi |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Buka menu Purchase Inbound | `page.goto('/supplychain/new-purchase-inbound')` | - | Datalist Purchase Inbound terbuka |
| **2** | Klik tombol Create Purchase Inbound | `button:has-text("Create")`, `a[href*="/create"]`, `button#createButton` | - | Form create terbuka di URL `/supplychain/new-purchase-inbound/create` |
| **3** | Tangani Auto-Save Draft | Menunggu redirect ke URL edit | - | Sistem auto-generate draft di URL `/supplychain/new-purchase-inbound/edit/{id}` |
| **4** | Ubah Supplier | Dropdown Multiselect Supplier | `PT Murni Supplier 1787448592996` | Supplier terpilih sesuai dengan supplier pada `PO-6A8A5BF6` |
| **5** | Simpan Header Transaksi | Tombol `Save All` | Click | Header Purchase Inbound tersimpan dengan supplier yang sesuai |
| **6** | Buka Modal Available Purchase Order | Link `Available Purchase Order` | Click | Modal `Outstanding Purchase Order` terbuka |
| **7** | Filter Data Berdasarkan Nomor PO | Input Search pada Modal | `PO-6A8A5BF6` | Tabel modal menampilkan baris data dari PO `PO-6A8A5BF6` |
| **8** | Pilih Baris PO | Checkbox pada baris `PO-6A8A5BF6` | Checked | Baris data PO terpilih |
| **9** | Masukkan Detail SKU ke Inbound | Tombol `Use` di bagian atas modal | Click | Detail SKU (`LUMI-CRAWL-1787447920177`) masuk ke tabel Inbound Detail |
| **10** | Verifikasi Tabel Inbound Detail | Tabel `#InventoryInDetail` | - | Baris SKU `LUMI-CRAWL-1787447920177` dengan Qty `1` muncul di tabel detail |
| **11** | Pertahankan Status Open (Tanpa Approve) | Tidak mengklik tombol Approve | - | Transaksi berstatus `Open` (Draft) |

---

## Detail Data Transaksi Hasil Crawling

- **Company:** Lumi Charms.id (`ID: 153`)
- **Purchase Inbound Transaction Code:** **`IN-5U7ODE9M`** (Inbound ID: `131633`)
- **Supplier:** `PT Murni Supplier 1787448592996` (`Code: SUPP-ONLY-1787448592996`, `ID: 1539`)
- **Warehouse Destination:** `AA-01 WH Prefix Uniform 639318` (`ID: 126602`)
- **Reference PO Code:** **`PO-6A8A5BF6`**
- **Transaction Status:** **`Open`** (`transaction_status = 'open'`, Draft / Belum Diapprove)

---

## Verifikasi Line Detail Inbound

| Parameter | Nilai Tercatat | Keterangan |
| :--- | :--- | :--- |
| **Product SKU** | `LUMI-CRAWL-1787447920177` | Produk Crawl Lumi 1787447920177 |
| **Inbound Quantity** | `1 Pieces` | Sesuai PO Qty |
| **Source PO Reference** | `PO-6A8A5BF6` | PO Without PR |
| **Unit** | `Pieces` | Base Unit |
| **Gross Weight / Dimensions** | `1 Gr` / `1 cm x 1 cm x 1 cm` | Spesifikasi dimensi produk |

---

## Expected Results
1. Transaksi Purchase Inbound berhasil dibuat via Web UI Crawling di company **Lumi Charms.id** (`ID: 153`).
2. Supplier berhasil diubah dan disimpan sesuai dengan supplier pada `PO-6A8A5BF6` (`PT Murni Supplier 1787448592996`).
3. Modal Available Purchase Order dapat dibuka, difilter dengan kode `PO-6A8A5BF6`, dan dicentang untuk dimasukkan ke detail transaksi via tombol Use.
4. Baris produk `LUMI-CRAWL-1787447920177` berhasil masuk ke tabel Inbound Detail dengan Qty `1`.
5. Transaksi Purchase Inbound berstatus **`Open` (Draft / Belum Diapprove)**.

---

## Actual Results
- **Status:** **PASSED**
- Transaksi Purchase Inbound `IN-5U7ODE9M` berhasil dibuat dan detail SKU dari `PO-6A8A5BF6` berhasil masuk ke Inbound Detail melalui Web UI Crawling.
- Transaksi berada dalam status `Open` (Draft) dan siap untuk tahapan pengujian selanjutnya.
