---
doc_type: requirement
menu: accounting-product-benchmark-price
menu_name: "Benchmark COGS"
version: 1.0
last_updated: 2026-07-05
owner: QA - Yemima
status: review
aliases: [Benchmark COGS, COGS Benchmark, HPP Acuan, benchmark cogs, product benchmark price, daily COGS]
---

# Benchmark COGS — Requirement Documentation

**Modul:** Accounting (FA → Report) + integrasi Supply Chain & OmniChannel  
**UI route:** `/accounting/product-benchmark-price`  
**API base:** `{VITE_API_URL}accounting/product-benchmark-price`  
**Audience:** PM, Operations, QA, Support, Developer  
**Status:** AS-IS verified against codebase per 2026-07-05  
**PM source:** Notion Benchmark COGS v1.0 (27 Jan 2026) · Jira [ETM-7029](https://erpintegration.atlassian.net/browse/ETM-7029)  
**Spreadsheet logic:** [Google Sheet](https://docs.google.com/spreadsheets/d/1c_eDle4g4E_IIp6d0wNpER6LIzugh1MBBYE1gxv28iU/edit?gid=2129708031#gid=2129708031)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-05 | QA - Yemima | Full doc from PM requirement + codebase AS-IS, gaps §12 |

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Before vs After (Requirement Comparison)](#2-before-vs-after-requirement-comparison)
3. [Logika Perhitungan COGS Master](#3-logika-perhitungan-cogs-master)
4. [UI/UX — Menu Benchmark COGS](#4-uiux--menu-benchmark-cogs)
5. [Audit Log (Calculate Log)](#5-audit-log-calculate-log)
6. [Integrasi Sales Order (General & Platform)](#6-integrasi-sales-order-general--platform)
7. [Integrasi Stock Opname & Stock Addition](#7-integrasi-stock-opname--stock-addition)
8. [Acceptance Criteria — Menu Master](#8-acceptance-criteria--menu-master)
9. [Acceptance Criteria — SO Detail & Auto-Approval](#9-acceptance-criteria--so-detail--auto-approval)
10. [Relasi Menu Lain](#10-relasi-menu-lain)
11. [QA Test Scenarios](#11-qa-test-scenarios)
12. [Gaps — PM vs AS-IS Codebase](#12-gaps--pm-vs-as-is-codebase)

---

## 1. Ringkasan Eksekutif

**Benchmark COGS** adalah menu monitoring **Nilai Acuan HPP (Harga Pokok Penjualan)** per System Product, dihitung ulang **harian** (scheduled) dan bisa di-trigger manual per baris.

Nilai ini **bukan** moving average accounting inventory — melainkan **acuan operasional** untuk:

| Konsumen | Pemakaian |
|----------|-----------|
| **Stock Opname** | Default harga surplus (penambahan stok) jika user tidak input harga |
| **Sales Order** | Kolom `benchmark_cogs` (snapshot) + validasi **Auto-Approval** vs harga jual |
| **Operator / Finance** | Monitoring COGS per SKU + audit perubahan |

---

## 2. Before vs After (Requirement Comparison)

| Fitur | Before (Lama) | After (Baru — TO-BE / Live) |
|-------|---------------|------------------------------|
| Menu monitoring | Tidak ada menu khusus | Menu **Benchmark COGS** |
| Metode kalkulasi | **MA30** (Moving Avg 30 hari); fallback Last Buy; null jika kosong | **Highest Price** (30 hari terakhir); fallback **Last Buy**; **0** jika kosong |
| Input manual di menu | User bisa edit default | **Read-only** — sistem hitung; user trigger **Calculate** saja |
| Scope implementasi | Stock Opname saja | Stock Opname + **SO Auto-Approval** + kolom detail SO |

**AS-IS note:** Kode job **tidak** memanggil `Product::MaPrice30Days()` — hanya `max(each_price_before_vat)` dari inbound PO (lihat §12).

---

## 3. Logika Perhitungan COGS Master

### 3.1 Sumber data

| Rule | Detail |
|------|--------|
| Transaksi sumber | **Purchase Inbound** approved — **Price Before VAT** |
| Tidak dihitung | Stock Opname inbound, adjustment addition tanpa PO, inbound dengan `transaction_reference_class` |
| Filter inbound | `transaction_status = approved`, `purchase_order_detail_id IS NOT NULL`, `transaction_reference_class IS NULL` |
| Field harga | **`item_stock.each_price_before_vat`** — MAX (30 hari) / latest (Last Buy) |

### 3.2 Periode waktu

| Periode | Definisi |
|---------|----------|
| **≤ 30 hari (aktif)** | `today - 30 days startOfDay` s/d `today endOfDay` (timezone schedule: **Asia/Jakarta**) |
| **> 30 hari (lampau)** | `transaction_date < start30DaysAgo` — ambil inbound **terakhir** (orderByDesc) |

### 3.3 Rules per tipe produk

| Tipe | Kondisi | Logic | Label `description` |
|------|---------|-------|---------------------|
| **Single** | Ada inbound PO ≤30 hari | **Highest** `each_price_before_vat` | `Highest Price` |
| **Single** | Tidak ada ≤30 hari, ada lampau | **Last Buy** (inbound terdekat) | `Last Buy` |
| **Single** | Tidak ada history | **0** | `No Purchase` |
| **Variant (child)** | Per variant | Sama seperti Single — **row sendiri** | Highest / Last Buy / No Purchase |
| **Parent** | Punya variant | **MAX** benchmark seluruh variant (**exclude** variant `-random`) | `Highest Price` atau `No Purchase` |
| **Random variant** | Child dengan opsi random | **Inherit** nilai MAX parent (bukan hitung dari inbound random SKU) | Sama parent |

**Scheduled job:** `product-benchmark-price:calculate` setiap **00:00 WIB** → dispatch `ProductBenchmarkPriceJob` untuk semua parent/single.

**Manual Calculate:** icon sync per baris → hitung parent + variant terkait (partial scope).

### 3.4 Penyimpanan master

| Item | Nilai |
|------|-------|
| Tabel | `accounting_product_benchmark_prices` |
| Unique key | `product_id` (per SKU) |
| Kolom | `benchmark_price` decimal(21,4), `description` nullable |
| Relasi | `Product::benchmarkPrice()` hasOne |

---

## 4. UI/UX — Menu Benchmark COGS

**Path:** Finance Accounting → Report → **Benchmark COGS**

### 4.1 Layout halaman

| Area | Komponen | Behavior |
|------|----------|----------|
| Breadcrumb | FA → Report → Benchmark COGS | — |
| Datalist | `DataTablesV3` | Server-side, pageLength 20, filter kolom, SearchBuilder |
| Toggle | **Show Detail** (`TableSwitch`) | Off = Single + Parent only; On = include **Variant** rows |
| Toolbar | **Export All** | Batch Excel via export-file / export-progress |
| Toolbar | **Calculate Log** | Slideover audit history |
| Row action | **Calculate** (sync icon) | `GET .../product-benchmark-price/{product_id}/sync` — queue job |

### 4.2 Kolom datalist

| Kolom UI | Backend field | Keterangan |
|----------|---------------|------------|
| System Product SKU / Name | `product_formatted` | SKU link ke `/supplychain/product/edit/{id}` + name excerpt + copy clipboard |
| Type | `type_product_formatted` | **Single** / **Parent** / **Variant** |
| Retail Price | `price_formatted` | `scm_products.price` |
| Created by / at | `created_by_formatted` (+ hidden `created_at_formatted`) | Audit default columns |
| Updated by / at | `updated_by_formatted` (+ hidden `updated_at_formatted`) | Audit default columns |
| **COGS** | `benchmark_price_formatted` | Nilai benchmark — currency format |
| **Description** | `description_formatted` | `Highest Price` / `Last Buy` / `No Purchase` |
| **COGS Last Updated** | `last_updated_formatted` | Timestamp update row benchmark |
| Action | sync | Manual calculate |

**Show Detail OFF (default):** query join `product_tree` where `parent_id IS NULL` → hanya **Single + Parent**.

**Show Detail ON:** semua produk termasuk **Variant** child.

### 4.3 UX notes (AS-IS)

| Behavior | Detail |
|----------|--------|
| Manual Calculate | Job **async** (Horizon); controller `sleep(1)` — reload datalist **tidak** menjamin selesai |
| Export All | Tab export file + progress polling |
| Permission | `ProductBenchmarkPricePolicy` → `viewAny` untuk index |

---

## 5. Audit Log (Calculate Log)

Setiap perubahan `benchmark_price` / `description` (auto midnight **atau** manual) tercatat via OwenIt Audit (`ConsoleAuditTrait` — aktif saat **console/queue**).

| Kolom slideover | Isi |
|-----------------|-----|
| **Date** | Waktu audit |
| **Old Values** | SKU Code, COGS, Description (transformed) |
| **New Values** | SKU Code, COGS, Description |
| **Action** | Event type (created/updated) |

**API:** `GET /api/accounting/product-benchmark-price/calculate-log`

---

## 6. Integrasi Sales Order (General & Platform)

### 6.1 Kolom baru di Detail SO (PM TO-BE)

| Kolom | Posisi | Default visibility | Sumber |
|-------|--------|-------------------|--------|
| **Price Before VAT** | Sebelum DPP | **Hidden** (`visible: false`) | Harga satuan sebelum pajak — Include: Price/(1+rate); Exclude: Price |
| **Benchmark COGS** | Setelah Price Before VAT | **Hidden** | Snapshot dari master saat line dibuat / binding |

**AS-IS FE:**

| Menu | Price Before VAT field | Benchmark COGS |
|------|------------------------|----------------|
| SO General | `price_before_vat_formatted` | `benchmark_cogs_formatted` |
| SO Platform | `each_price_before_discount_before_vat_so_formatted` (label Price Before VAT) | `benchmark_cogs_formatted` |

Keduanya `visible: false` default — user unhide via column picker.

**Display COGS:** `unitConverterFromProduct(benchmark_cogs, detail unit → product stock unit)`.

### 6.2 Snapshot logic (`benchmark_cogs`)

| Event | Behavior AS-IS |
|-------|----------------|
| Create `SalesOrderDetail` / `SalesOrderDetailRandom` | `handleBenchmarkCogsOnCreating()` — copy `ProductBenchmarkPrice.benchmark_price` jika `product_id` set & `benchmark_cogs` belum > 0 |
| Platform **product binding** | Update `product_id` + **re-set** `benchmark_cogs` dari system product ter-bind |
| Edit line — ganti `product_id` | Re-fetch benchmark master |
| Master benchmark berubah setelah order ada | Kolom SO **tidak** berubah (snapshot di kolom `benchmark_cogs`) |

**DB column:** `omni_sales_order_details.benchmark_cogs` decimal(21,4) default 0 · sama di `sales_order_detail_randoms`.

### 6.3 Logic pengambilan nilai (PM)

| Tipe produk di line | PM requirement | AS-IS capture |
|---------------------|----------------|---------------|
| Single / Variant child | COGS SKU tersebut | `product_id` line → benchmark row |
| Bundle / Random | COGS **Parent SKU** | Header line: parent product_id ✓ · Child bundle lines: **child product_id** (bukan parent) — **GAP** |
| Platform unbound | Skip validasi; COGS 0/NULL | `product_id` null → benchmark 0, skip capture |

### 6.4 Auto-Approval validation

| Aspek | PM TO-BE | AS-IS code |
|-------|----------|------------|
| Metrik harga | **Price Before VAT** | **`each_price_after_vat_primary_currency`** |
| Metrik COGS | **Benchmark COGS (captured)** | **`benchmark_cogs`** ✓ |
| Rule | Price Before VAT < Benchmark → block auto-approve | `unit_price < benchmark_cogs` → `prevent_auto_approve = true` |
| Trigger | — | `SalesOrderDetailPriceObserver` + `updateAutoApproveFlagForSalesOrder()` |
| UI flag | — | Icon dollar merah — *"Product price is below COGS Benchmark"* |
| Random bundle line | — | Random detail dengan `product.isBundle()` → **force** prevent auto-approve |
| Bundle komponen | Price Before VAT komponen vs **Parent** COGS | Lihat [sales-order-general §10.6](../sales-order-general/requirement.md#106-validasi-auto-approval-hpp--benchmark-cogs) — **belum align penuh** |

**Legacy dead code:** `checkLatestPricePO()` — compare vs latest PO price, **tidak pernah dipanggil**.

**Jira:** [ETM-12890](https://erpintegration.atlassian.net/browse/ETM-12890) (SO General) · [ETM-12947](https://erpintegration.atlassian.net/browse/ETM-12947) (SO Platform)

---

## 7. Integrasi Stock Opname & Stock Addition

### 7.1 Stock Opname — surplus (diff > 0)

Saat opname menghasilkan penambahan stok dan user **tidak** input harga:

```
price = product.benchmarkPrice.benchmark_price (converted to detail unit)
```

**File:** `StockOpnameDetailController` (~579, ~1066).

**AS-IS:** Commented code `MaPrice30Days()` — tidak aktif.

### 7.2 Stock Addition (Adjustment Addition)

| Path | Benchmark usage |
|------|-----------------|
| Opname → auto addition | Harga sudah terisi dari benchmark (atau user) di opname detail → diteruskan sebagai `each_price_before_vat` |
| Manual addition | User input / referensi PO — **tidak** lookup benchmark langsung |

Detail: [supplychain-stock-opname](../supplychain-stock-opname/requirement.md) · [supplychain-adjustment-addition](../supplychain-adjustment-addition/requirement.md)

---

## 8. Acceptance Criteria — Menu Master

| ID | Kriteria | Expected |
|----|----------|----------|
| BM-01 | Scheduled 00:00 WIB | Job `product-benchmark-price:calculate` jalan |
| BM-02 | Highest Price 30 hari | SKU dengan inbound PO ≤30 hari → MAX price before VAT |
| BM-03 | Last Buy fallback | Tidak ada 30 hari → harga inbound lampau terakhir |
| BM-04 | No purchase | Tidak ada inbound PO → COGS **0**, desc `No Purchase` |
| BM-05 | Parent = MAX variant | Parent row = tertinggi dari variant (exclude random) |
| BM-06 | Show Detail toggle | Off: Single+Parent; On: +Variant |
| BM-07 | Manual Calculate | Trigger job per SKU; audit log tercatat |
| BM-08 | Calculate Log | Old/new COGS + description + SKU |
| BM-09 | Export All | Excel semua baris filter aktif |

---

## 9. Acceptance Criteria — SO Detail & Auto-Approval

| ID | Kriteria | Expected (PM) | AS-IS verify |
|----|----------|---------------|--------------|
| SO-01 | Kolom Price Before VAT | Hidden default; formula tax include/exclude benar | ✓ hidden · formula via detail accessors |
| SO-02 | Kolom Benchmark COGS | Hidden default; nilai saat order masuk | ✓ hidden · snapshot on create |
| SO-03 | Snapshot test | Edit master benchmark → SO **tidak** berubah | ✓ kolom `benchmark_cogs` |
| SO-04 | Bundle/Random parent COGS | Capture **parent** benchmark | ⚠️ header ✓ · child lines own product — **GAP** |
| SO-05 | Block auto-approve | Price Before VAT < Benchmark | ⚠️ code pakai **price after VAT** — **GAP** |
| SO-06 | Allow auto-approve | Price Before VAT ≥ Benchmark (+ syarat lain) | ⚠️ same gap |
| SO-07 | Platform unbound | Skip; COGS 0 | ✓ `product_id` null |
| SO-08 | Binding platform | Set benchmark saat bind | ✓ `ProductController` binding update |

---

## 10. Relasi Menu Lain

| Menu | Relasi |
|------|--------|
| [System Product](../system-product/requirement.md) | Sumber SKU; parent/variant/random structure |
| [Sales Order General / Platform](../sales-order-general/requirement.md) | Kolom detail + auto-approve §11 |
| [Random SKU](../random-sku/requirement.md) | Random variant inherit parent COGS di master; validasi SO khusus |
| [Stock Opname](../supplychain-stock-opname/requirement.md) | Default price surplus |
| [Stock Addition](../supplychain-adjustment-addition/requirement.md) | Indirect via opname |
| [Product Bundle proporsi](../sales-order-general/requirement.md#10-product-bundle--proporsi-harga-price-before-vat) | HPP validation bundle vs parent benchmark |

---

## 11. QA Test Scenarios

| # | Skenario | Expected |
|---|----------|----------|
| T-01 | SKU dengan 2 inbound PO dalam 30 hari (5.000 & 6.000) | COGS = **6.000**, desc Highest Price |
| T-02 | SKU tanpa inbound 30 hari, ada inbound 60 hari lalu | Last Buy |
| T-03 | SKU baru tanpa PO | COGS 0, No Purchase |
| T-04 | Parent 3 variant — hitung manual MAX | Parent row = MAX |
| T-05 | Midnight job | Audit log System updated |
| T-06 | Manual Calculate 1 SKU | Row + variant ter-update |
| T-07 | Create SO → ubah master COGS | `benchmark_cogs` di SO tetap |
| T-08 | Bind platform product | `benchmark_cogs` ter-set |
| T-09 | Harga under benchmark | `prevent_auto_approve` + icon dollar |
| T-10 | Opname surplus tanpa input harga | Pakai benchmark master |

---

## 12. Gaps — PM vs AS-IS Codebase

| ID | Topik | PM / Requirement | AS-IS | Status |
|----|-------|-------------------|-------|--------|
| **GAP-BM-01** | Metode kalkulasi | Highest Price 30 hari | ✓ `max(item_stock.each_price_before_vat)` | **OK** |
| **GAP-BM-02** | MA30 legacy | Diganti Highest Price | `MaPrice30Days()` masih ada di Product, **commented** di opname — tidak dipakai job | **OK (by design)** |
| **GAP-BM-03** | Scope inbound | Purchase inbound price before VAT | Hanya PO-linked, `transaction_reference_class IS NULL` | **OK — catatan scope** |
| **GAP-BM-04** | COALESCE item_stock vs inbound detail | Fallback jika item_stock price 0 | **Commented out** di job | **Partial** |
| **GAP-BM-05** | Auto-approve metric | Price **Before** VAT | **`each_price_after_vat_primary_currency`** | **Bug / gap** |
| **GAP-BM-06** | Bundle child COGS | Parent benchmark untuk validasi | Each line own `product_id` benchmark | **Gap vs bundle §10.6** |
| **GAP-BM-07** | Random SO line | Parent COGS | Master: random inherits parent · SO: depends on `product_id` at capture | **See random-sku doc** |
| **GAP-BM-08** | Manual calculate UX | Immediate feedback | Async job + sleep(1) | **UX gap** |
| **GAP-BM-09** | `checkLatestPricePO` | Replaced by benchmark | Method exists, **never called** | **Dead code** |
| **GAP-BM-10** | Description parent | Highest / Last Buy per logic | Parent with max>0 always **Highest Price** even if from Last Buy child | **Minor** |
| **GAP-BM-11** | QA docs | 3-layer complete | Was pending — **this release** | **Resolved** |

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| Sales Order integration | [../sales-order-general/requirement.md §11](../sales-order-general/requirement.md#11-benchmark-cogs--price-before-vat-detail-order) |
