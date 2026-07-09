---
doc_type: requirement
menu: accounting-product-benchmark-price
menu_name: "Benchmark COGS"
version: 1.1
last_updated: 2026-07-09
owner: QA - Yemima
status: review
aliases: [Benchmark COGS, COGS Benchmark, HPP Acuan, benchmark cogs, product benchmark price, daily COGS]
---

# Benchmark COGS — Requirement Documentation

**Modul:** Accounting (FA → Report) + integrasi Supply Chain & OmniChannel  
**UI route:** `/accounting/product-benchmark-price`  
**API base:** `{VITE_API_URL}accounting/product-benchmark-price`  
**Audience:** PM, Operations, QA, Support, Developer  
**Status:** TO-BE requirement v1.1 (perluasan sumber data) · kode AS-IS divergen — lihat §12–§13  
**PM source:** Notion Benchmark COGS v1.0 (27 Jan 2026) · Jira [ETM-7029](https://erpintegration.atlassian.net/browse/ETM-7029)  
**Spreadsheet logic:** [Google Sheet](https://docs.google.com/spreadsheets/d/1c_eDle4g4E_IIp6d0wNpER6LIzugh1MBBYE1gxv28iU/edit?gid=2129708031#gid=2129708031)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.1 | 2026-07-09 | QA - Yemima | Perluasan sumber data (PO + Stock Addition + Opname IN + Opening Stock); before/after §2.2; pending items §13; relasi Stock Remapping |
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
13. [Hal yang Perlu Diperhatikan / Pending Items](#13-hal-yang-perlu-diperhatikan--pending-items)

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

### 2.1 Evolusi fitur (rilis awal → live)

| Fitur | Before (Lama) | After (Rilis awal — v1.0 doc) |
|-------|---------------|------------------------------|
| Menu monitoring | Tidak ada menu khusus | Menu **Benchmark COGS** |
| Metode kalkulasi | **MA30** (Moving Avg 30 hari); fallback Last Inbound; null jika kosong | **Highest Price** (30 hari terakhir); fallback **Last Inbound**; **0** jika kosong |
| Input manual di menu | User bisa edit default | **Read-only** — sistem hitung; user trigger **Calculate** saja |
| Scope implementasi | Stock Opname saja | Stock Opname + **SO Auto-Approval** + kolom detail SO |

### 2.2 Perluasan sumber data (v1.0 doc → v1.1 TO-BE)

**Satu-satunya perubahan material di v1.1:** sumber nilai benchmark COGS diperluas. Logika 3-tier, periode, field harga, rules parent/variant, UI, schedule, dan integrasi konsumen **tidak berubah**.

| Aspek | Before (v1.0 doc — 5 Juli 2026) | After (v1.1 TO-BE) |
|-------|--------------------------------|---------------------|
| Tier 1 ≤30 hari | MAX `each_price_before_vat` | **Sama** |
| Tier 2 >30 hari | Last inbound terakhir | **Sama** |
| Tier 3 kosong | 0 / `No Inbound` | **Sama** |
| **Sumber transaksi** | Hanya **Purchase Inbound (PO)** | PO + **Stock Addition** + **Stock Opname IN** + **Opening Stock** |

| # | Sumber (v1.1) | Menu | Kode | Keterangan |
|---|---------------|------|------|------------|
| 1 | Purchase Inbound (PO) | Mutation Inbound | `IN` | Sumber existing (v1.0) |
| 2 | Stock Addition | Adjustment Addition | `AI` | Penambahan stok manual |
| 3 | Stock Opname IN | Adjustment Addition (auto) | `AI` | Auto-generated saat opname surplus (selisih > 0) |
| 4 | Opening Stock | Opening Stock → Addition | `OS` → `AI` | Addition auto-generated saat opening stock approve |

**AS-IS note (kode per 2026-07-09):** Job **belum** memakai allowlist eksplisit 4 sumber — filter PO di-comment sehingga semua inbound approved ikut terhitung (lihat §12 GAP-BM-12). Kode **tidak** memanggil `Product::MaPrice30Days()`.

---

## 3. Logika Perhitungan COGS Master

### 3.1 Sumber data (v1.1 TO-BE)

Semua sumber valid menghasilkan record di rantai yang sama:

```
scm_stock_mutations (approved)
  → scm_inbound_mutation_details (each_price_before_vat)
    → scm_item_stocks (each_price_before_vat)
```

| Rule | Detail |
|------|--------|
| Status transaksi | `transaction_status = approved` |
| Field harga | **`item_stock.each_price_before_vat`** — Price Before VAT (MAX ≤30 hari / latest >30 hari) |
| Tier 1 (≤30 hari) | **Highest** — `max(each_price_before_vat)` dari semua sumber valid |
| Tier 2 (>30 hari) | **Last Inbound** — transaksi terakhir (`orderByDesc` `transaction_date`) |
| Tier 3 (kosong) | COGS = **0**, description `No Inbound` |

#### Allowlist sumber valid (v1.1)

| # | Sumber | Kriteria identifikasi (DB) |
|---|--------|------------------------------|
| 1 | **PO Inbound** | `inbound.purchase_order_detail_id IS NOT NULL` AND `stock_mutation.is_inventory_adjustment = 0` |
| 2 | **Stock Addition** (manual) | `is_inventory_adjustment = 1` · `supplier_id IS NULL` · `is_return_process = 0` · bukan referensi opname (`transaction_reference_class` bukan `StockOpname` atau null) |
| 3 | **Stock Opname IN** | `transaction_reference_class = StockOpname` · parent opname **tanpa** record `accounting_opening_stock_coas` |
| 4 | **Opening Stock** | `transaction_reference_class = StockOpname` · parent opname (via `transaction_reference_id`) punya record di `accounting_opening_stock_coas` |

#### Tidak dihitung (v1.1)

- Return process inbound (`RI`)
- Transfer inbound
- Failed ship / scrap / lost adjustment inbound
- Inbound supplier tanpa PO (non-adjustment)
- Transaksi non-approved

#### Before (v1.0 doc) — hanya untuk referensi

| Rule | Nilai v1.0 |
|------|------------|
| Sumber | Hanya **Purchase Inbound** PO |
| Filter | `purchase_order_detail_id IS NOT NULL`, `transaction_reference_class IS NULL` |
| Eksklusi eksplisit | Stock Opname, Stock Addition, Opening Stock |

### 3.2 Periode waktu

| Periode | Definisi |
|---------|----------|
| **≤ 30 hari (aktif)** | `today - 30 days startOfDay` s/d `today endOfDay` (timezone schedule: **Asia/Jakarta**) |
| **> 30 hari (lampau)** | `transaction_date < start30DaysAgo` — ambil inbound **terakhir** (orderByDesc) |

### 3.3 Rules per tipe produk

| Tipe | Kondisi | Logic | Label `description` |
|------|---------|-------|---------------------|
| **Single** | Ada transaksi valid ≤30 hari | **Highest** `each_price_before_vat` | `Highest Price` |
| **Single** | Tidak ada ≤30 hari, ada lampau | **Last Inbound** (transaksi terdekat) | `Last Inbound` |
| **Single** | Tidak ada history | **0** | `No Inbound` |
| **Variant (child)** | Per variant | Sama seperti Single — **row sendiri** | Highest / Last Inbound / No Inbound |
| **Parent** | Punya variant | **MAX** benchmark seluruh variant (**exclude** variant `-random`) | `Highest Price` atau `No Inbound` |
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
| **Description** | `description_formatted` | `Highest Price` / `Last Inbound` / `No Inbound` |
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

## 7. Integrasi Stock Opname, Stock Addition & Opening Stock

### 7.1 Arah integrasi (dua arah)

| Arah | Menu | Perilaku |
|------|------|----------|
| **Benchmark → Opname** | Stock Opname | Surplus tanpa input harga → fallback `product.benchmarkPrice.benchmark_price` |
| **Opname IN → Benchmark** | Benchmark COGS (v1.1) | Transaksi addition dari opname surplus **masuk** sumber kalkulasi |
| **Addition manual → Benchmark** | Benchmark COGS (v1.1) | Stock Addition manual **masuk** sumber kalkulasi |
| **Opening Stock → Benchmark** | Benchmark COGS (v1.1) | Addition dari opening stock **masuk** sumber kalkulasi |

### 7.2 Stock Opname — surplus (diff > 0)

Saat opname menghasilkan penambahan stok dan user **tidak** input harga:

```
price = product.benchmarkPrice.benchmark_price (converted to detail unit)
```

**File:** `StockOpnameDetailController` (~579, ~1066).

Opname approve → auto-create `StockMutationAddition` (`AI`) dengan `each_price_before_vat` → setelah v1.1, transaksi ini **bisa mempengaruhi** benchmark master pada job berikutnya.

### 7.3 Stock Addition (manual)

| Path | Benchmark usage |
|------|-----------------|
| Opname → auto addition | Harga dari benchmark (atau input user) di opname detail → diteruskan sebagai `each_price_before_vat` |
| Manual addition | User input harga di detail → setelah approve, **masuk** sumber benchmark (v1.1) |

Detail: [supplychain-stock-opname](../supplychain-stock-opname/requirement.md) · [supplychain-adjustment-addition](../supplychain-adjustment-addition/requirement.md)

### 7.4 Opening Stock

Alur sama seperti Stock Opname (surplus → auto addition `AI`), dengan header `OpeningStock` (kode `OS`) dan `OpeningStockCoa`. Setelah approve, addition inbound **masuk** sumber benchmark (v1.1).

Detail: [accounting-opening-stock](../accounting-opening-stock/knowledge-base.md)

---

## 8. Acceptance Criteria — Menu Master

| ID | Kriteria | Expected |
|----|----------|----------|
| BM-01 | Scheduled 00:00 WIB | Job `product-benchmark-price:calculate` jalan |
| BM-02 | Highest Price 30 hari | SKU dengan transaksi valid ≤30 hari → MAX price before VAT (semua sumber v1.1) |
| BM-03 | Last Inbound fallback | Tidak ada 30 hari → harga transaksi lampau terakhir |
| BM-04 | No Inbound | Tidak ada transaksi valid → COGS **0**, desc `No Inbound` |
| BM-05 | Parent = MAX variant | Parent row = tertinggi dari variant (exclude random) |
| BM-06 | Show Detail toggle | Off: Single+Parent; On: +Variant |
| BM-07 | Manual Calculate | Trigger job per SKU; audit log tercatat |
| BM-08 | Calculate Log | Old/new COGS + description + SKU |
| BM-09 | Export All | Excel semua baris filter aktif |
| BM-10 | Stock Addition sebagai sumber | SKU tanpa PO, addition manual ≤30 hari → COGS > 0 |
| BM-11 | Stock Opname IN sebagai sumber | SKU tanpa PO, opname surplus ≤30 hari → COGS > 0 |
| BM-12 | Opening Stock sebagai sumber | SKU tanpa PO, opening stock ≤30 hari → COGS > 0 |
| BM-13 | MAX lintas sumber | PO 6.000 + Addition 8.000 ≤30 hari → COGS = 8.000 |

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
| [Stock Opname](../supplychain-stock-opname/requirement.md) | Default price surplus · **sumber** opname IN (v1.1) |
| [Stock Addition](../supplychain-adjustment-addition/requirement.md) | Manual addition · **sumber** benchmark (v1.1) |
| [Opening Stock](../accounting-opening-stock/knowledge-base.md) | **Sumber** benchmark (v1.1) |
| [Stock Remapping](../accounting-stock-remapping/requirement.md) | Addition auto dari Stock Remapping **bisa** masuk sumber benchmark v1.1 (unit price dari stock ID origin) — [P-SRM-16](../accounting-stock-remapping/requirement.md#153-relasi--loophole-operasional) |
| [Product Bundle proporsi](../sales-order-general/requirement.md#10-product-bundle--proporsi-harga-price-before-vat) | HPP validation bundle vs parent benchmark |

---

## 11. QA Test Scenarios

| # | Skenario | Expected |
|---|----------|----------|
| T-01 | SKU dengan 2 inbound PO dalam 30 hari (5.000 & 6.000) | COGS = **6.000**, desc Highest Price |
| T-02 | SKU tanpa inbound 30 hari, ada inbound 60 hari lalu | Last Inbound |
| T-03 | SKU baru tanpa PO | COGS 0, No Inbound |
| T-04 | Parent 3 variant — hitung manual MAX | Parent row = MAX |
| T-05 | Midnight job | Audit log System updated |
| T-06 | Manual Calculate 1 SKU | Row + variant ter-update |
| T-07 | Create SO → ubah master COGS | `benchmark_cogs` di SO tetap |
| T-08 | Bind platform product | `benchmark_cogs` ter-set |
| T-09 | Harga under benchmark | `prevent_auto_approve` + icon dollar |
| T-10 | Opname surplus tanpa input harga | Pakai benchmark master sebagai harga addition |
| T-11 | SKU tanpa PO, Stock Addition manual ≤30 hari @ 5.000 | COGS = 5.000, Highest Price |
| T-12 | SKU tanpa PO, Opname IN ≤30 hari @ 7.000 | COGS = 7.000, Highest Price |
| T-13 | SKU tanpa PO, Opening Stock @ 10.000 | COGS = 10.000 |
| T-14 | PO 6.000 + Addition 8.000 dalam 30 hari | COGS = **8.000** (MAX lintas sumber) |
| T-15 | Opname surplus pakai fallback benchmark | Benchmark dapat mengulang nilai sebelumnya — expected (§13 P-02) |
| T-16 | Return inbound / transfer inbound | **Tidak** masuk kalkulasi |

---

## 12. Gaps — PM vs AS-IS Codebase

| ID | Topik | PM / Requirement | AS-IS | Status |
|----|-------|-------------------|-------|--------|
| **GAP-BM-01** | Metode kalkulasi | Highest Price 30 hari | ✓ `max(item_stock.each_price_before_vat)` | **OK** |
| **GAP-BM-02** | MA30 legacy | Diganti Highest Price | `MaPrice30Days()` masih ada di Product, **commented** di opname — tidak dipakai job | **OK (by design)** |
| **GAP-BM-03** | Scope sumber (v1.0) | PO only | Filter PO **di-comment** — semua inbound masuk | **Superseded by GAP-BM-12** |
| **GAP-BM-04** | COALESCE item_stock vs inbound detail | Fallback jika item_stock price 0 | **Commented out** di job | **Partial** |
| **GAP-BM-05** | Auto-approve metric | Price **Before** VAT | **`each_price_after_vat_primary_currency`** | **Bug / gap** |
| **GAP-BM-06** | Bundle child COGS | Parent benchmark untuk validasi | Each line own `product_id` benchmark | **Gap vs bundle §10.6** |
| **GAP-BM-07** | Random SO line | Parent COGS | Master: random inherits parent · SO: depends on `product_id` at capture | **See random-sku doc** |
| **GAP-BM-08** | Manual calculate UX | Immediate feedback | Async job + sleep(1) | **UX gap** |
| **GAP-BM-09** | `checkLatestPricePO` | Replaced by benchmark | Method exists, **never called** | **Dead code** |
| **GAP-BM-10** | Description parent | Highest / Last Inbound per logic | Parent with max>0 always **Highest Price** even if from Last Inbound child | **Minor** |
| **GAP-BM-11** | QA docs | 3-layer complete | Was pending — **this release** | **Resolved** |
| **GAP-BM-12** | Allowlist 4 sumber (v1.1) | PO + Addition + Opname IN + Opening Stock | Filter PO di-comment; **belum** allowlist eksplisit; return/transfer ikut terhitung | **Pending implementasi** |

---

## 13. Hal yang Perlu Diperhatikan / Pending Items

Item di bawah ini adalah **potensi loophole**, risiko operasional, atau pekerjaan tertunda terkait fungsi utama Benchmark COGS dan relasinya ke menu lain. Bukan semuanya bug — beberapa adalah keputusan bisnis yang diterima.

### 13.1 Fungsi utama Benchmark COGS

| ID | Topik | Deskripsi | Status / Tindakan |
|----|-------|-----------|---------------------|
| **P-01** | Allowlist sumber belum di kode | `ProductBenchmarkPriceJob` belum filter eksplisit 4 sumber v1.1 — filter PO di-comment sehingga inbound return/transfer ikut terhitung | **Pending dev** — refactor `getBenchmarkPrice()` |
| **P-02** | Circular dependency Opname ↔ Benchmark | Opname surplus tanpa input harga memakai benchmark sebagai default → setelah v1.1, transaksi tersebut masuk balik ke kalkulasi benchmark | **Diterima bisnis** — keputusan di tangan operator (input harga manual vs fallback) |
| **P-03** | Label `No Inbound` | Description tetap `No Inbound` meski sumber v1.1 bukan hanya inbound PO | **Minor** — pertimbangkan rename ke `No Cost History` di rilis mendatang |
| **P-04** | COALESCE harga 0 | Fallback `item_stock` → `inbound.each_price_before_vat` di-comment di job | **Partial** — edge case harga 0 di item_stock |
| **P-05** | Parent description | Parent row selalu `Highest Price` meski nilai MAX berasal dari child `Last Inbound` | **Minor** — cosmetic |
| **P-06** | Manual Calculate UX | Job async + `sleep(1)` — reload datalist tidak menjamin nilai terbaru | **UX gap** — operator perlu refresh manual |

### 13.2 Relasi ke menu lain

| ID | Menu terkait | Deskripsi | Status / Tindakan |
|----|--------------|-----------|---------------------|
| **P-07** | Sales Order — auto-approve | Kode bandingkan **price after VAT** vs benchmark; requirement **Price Before VAT** (GAP-BM-05) | **Bug / gap** — [ETM-12890](https://erpintegration.atlassian.net/browse/ETM-12890) · [ETM-12947](https://erpintegration.atlassian.net/browse/ETM-12947) |
| **P-08** | Sales Order — bundle child | Validasi PM: komponen vs parent benchmark; kode: each line own `product_id` (GAP-BM-06) | **Gap** — lihat [sales-order-general §10.6](../sales-order-general/requirement.md#106-validasi-auto-approval-hpp--benchmark-cogs) |
| **P-09** | Sales Order — random SKU | Line random sering `benchmark_cogs = 0` pre-bind; validasi under-benchmark tidak trigger | **Known** — [random-sku](../random-sku/requirement.md) |
| **P-10** | Stock Opname | Dua arah: konsumen fallback harga **dan** sumber kalkulasi (v1.1) — operator perlu paham dampak input harga | **Catatan operasional** |
| **P-11** | Opening Stock | Doc menu masih **pending** — relasi ke benchmark baru didokumentasikan di sini | **Pending doc** opening-stock requirement/technical |
| **P-12** | SO export | `resolveBenchmarkCogs()` fallback ke live master jika snapshot 0 — bisa beda dari nilai saat order dibuat | **Edge case** export |

### 13.3 Dead code & legacy

| ID | Item | Catatan |
|----|------|---------|
| **P-13** | `checkLatestPricePO()` | Tidak pernah dipanggil — digantikan benchmark |
| **P-14** | `Product::MaPrice30Days()` | Legacy MA30 — commented di opname, tidak dipakai job benchmark |

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| Sales Order integration | [../sales-order-general/requirement.md §11](../sales-order-general/requirement.md#11-benchmark-cogs--price-before-vat-detail-order) |
