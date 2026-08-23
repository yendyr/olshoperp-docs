---
id: TC-SO-CRAWL-CREATE-OPEN-20260823131700
title: "Create Sales Order General and Add SKU Detail with Unit Price 100.000 (Keep in Open/Draft Status) via Web UI Crawling"
type: positive
priority: high
status: draft
author: Antigravity Agent
created_at: 2026-08-23 20:17:00
updated_at: 2026-08-23 20:17:00
tags:
  - sales-order-general
  - omni-channel
  - ui-crawling
  - vat-calculation
  - playwright
---

# TC-SO-CRAWL-CREATE-OPEN-20260823131700: Create Sales Order General & Add SKU Detail with Unit Price 100.000 (Status Open / Draft)

## 1. Description
Membuat transaksi **Sales Order General** baru melalui crawling Web UI di company **Lumi Charms.id** (`ID: 153`), menggunakan data default hasil auto-save draft (Customer, Store, Warehouse Process), menambahkan detail SKU hasil crawl sebelumnya (`LUMI-CRAWL-1787447920177`) dengan Qty `1`, Unit Price `100.000`, serta memverifikasi perhitungan kalkulasi VAT / PPN 12% dan memastikan transaksi tetap berada pada status **Open / Draft (Belum Diapprove)**.

---

## 2. Preconditions
1. **Perusahaan Aktif:** `Lumi Charms.id` (`company_id: 153`, `code: lumicharmsid`).
2. **Master System Product:** SKU `LUMI-CRAWL-1787447920177` (`ID: 92420`, Status Active) hasil dari test case `TC-SYSPROD-004`.
3. **Master General Company / Supplier:** `SUPP-ONLY-1787448592996` (`PT Murni Supplier 1787448592996`, `ID: 1539`).
4. **Purchase Order:** `PO-6A8A5BF6` (`ID: 2636`), Status `Approved`.
5. **Purchase Inbound:** `IN-5U7ODE9M` (`ID: 131633`), Status `Approved` ke gudang `WH Pusat Zona A1` (`ID: 72972`).

---

## 3. Step-by-Step UI Crawling & Execution

| Step | Action / User Interaction | Selector / Target Element | Expected Result |
|---|---|---|---|
| **1** | Navigasi ke menu **Sales Order General** | URL `/businessdevelopment/sales-order-general` | Halaman Datalist Sales Order General terbuka. |
| **2** | Klik tombol **Create** | `button:has-text("Create")` | Membuka form create dan memicu mekanisme auto-save draft dengan nilai default (Store, Customer, Warehouse Process). |
| **3** | Tunggu redirect auto-save draft | URL `/businessdevelopment/sales-order-general/edit/{id}` | Form berpindah ke mode edit dengan kode transaksi ter-generate (contoh: `SO-5U7TQKCP`, `ID: 2519646`). |
| **4** | Buka section **Sales Order Detail** dan pilih SKU | Dropdown `Select Product` (`.custom-multiselect`) | Cari dan pilih SKU `LUMI-CRAWL-1787447920177`. Baris detail order terbuat dengan default Qty 1 dan Tax PPN 12%. |
| **5** | Ubah Unit Price ke `100.000` | Form input Price (`input[placeholder*="Price"]`) | Input nominal `100000` (Rp 100.000). |
| **6** | Simpan perubahan baris detail | Tombol `Save` pada modal / inline edit | Perubahan tersimpan ke database dan kalkulasi VAT ter-update otomatis. |
| **7** | Verifikasi Status & Kalkulasi VAT | Header Transaksi & Table Detail | Transaksi berstatus **Draft / Open (Belum Diapprove)** dengan kalkulasi PPN 12% include berjalan akurat. |

---

## 4. Test Data & Results

### Data Transaksi Sales Order General:
- **Transaction Code:** `SO-5U7TQKCP` (`ID: 2519646`)
- **Status Transaksi:** **`Draft` / `Open` (Belum Diapprove)**
- **Type Sales Order:** `General`
- **Customer:** `Supplier China` (ID: 189)
- **Store:** `Store Tokopedia Default` (ID: 71)
- **Warehouse Process:** `WH Gayungsari` (ID: 72927)

### Detail Item SKU & Kalkulasi VAT / PPN:
- **Detail ID:** `3193383`
- **SKU Code:** `LUMI-CRAWL-1787447920177` (`Produk Crawl Lumi 1787447920177`, ID: 92420)
- **Order Quantity:** `1 Pieces`
- **Unit Price (Input / After VAT):** `Rp 100.000,00`
- **Unit Price Before VAT:** `Rp 90.090,0901`
- **Grand Total Before VAT:** `Rp 90.090,0901`
- **Grand Total After VAT:** `Rp 100.000,00`
- **Tax Rate (PPN):** `12%` (`tax_id: 25`, Included: `true`, Coefficient: `true`)
- **Total VAT / PPN Amount:** `Rp 9.909,9099` (Rp 9.909,91)
- **DPP Value:** `Rp 82.582,5825` (Faktor Koefisien $11/12 \times 90.090,0901$)
- **DPP VAT:** `Rp 9.909,9099` ($12\% \times 82.582,5825$)
- **DPP After VAT:** `Rp 92.492,4924`

---

## 5. Automation / Playwright Script Reference
- **Script Location:** `tests/specs/product-profit-loss/create-so-crawl.spec.ts` & `clean-so.spec.ts`
- **Execution Command:**
  ```bash
  OLSHOP_COMPANY_CODE="lumicharmsid" npm --prefix /Users/yemimatifani/Documents/GitHub/olshoperp-docs run test:tc -- "clean-so"
  ```
