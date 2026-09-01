---
doc_type: requirement
menu: accounting-product-benchmark-price
menu_name: "Benchmark COGS"
version: 1.4
last_updated: 2026-09-01
owner: QA - Yemima
status: review
aliases: [Benchmark COGS, COGS Benchmark, HPP Acuan, benchmark cogs, product benchmark price, daily COGS, Manual COGS, Manual COGS Expiry, Bundle Sum, Highest Bundle Variant, Product Bundle COGS]
---

# Benchmark COGS — Requirement Documentation

**Modul:** Accounting (FA → Report) + integrasi Supply Chain & OmniChannel  
**UI route:** `/accounting/product-benchmark-price`  
**API base:** `{VITE_API_URL}accounting/product-benchmark-price`  
**Audience:** PM, Operations, QA, Support, Developer  
**Status:** TO-BE v1.4 (**Product Bundle COGS**) · Manual COGS v1.3 · Error Flag v1.2 · sumber data v1.1 · kode AS-IS divergen — lihat §12–§13  
**PM source:** Notion Benchmark COGS v1.0 (27 Jan 2026) · Jira [ETM-7029](https://erpintegration.atlassian.net/browse/ETM-7029) · Improvement Bundle [ETM-15688](https://erpintegration.atlassian.net/browse/ETM-15688)  
**Spreadsheet logic:** [Google Sheet](https://docs.google.com/spreadsheets/d/1c_eDle4g4E_IIp6d0wNpER6LIzugh1MBBYE1gxv28iU/edit?gid=2129708031#gid=2129708031) · ilustrasi Bundle: `Benchmark COGS Bundle.xlsx`

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.4 | 2026-09-01 | QA - Yemima | TO-BE **Product Bundle**: Bundle Sum / Highest Bundle Variant; qty × B.COGS; Manual override; Bundle ≠ BOM/rakitan; job order; GAP-BM-15; AC BM-22…; ETM-15688 |
| 1.3 | 2026-08-11 | QA - Yemima | TO-BE **Manual COGS** + **Manual COGS Expiry** + import + audit (§2.3, §3.5, §4.2–§4.4, AC/TC, GAP-BM-14) |
| 1.2 | 2026-08-11 | QA - Yemima | TO-BE Error Flag **Below Benchmark COGS** (`cogs-error`): icon, tooltip, filter, FX→primary, capture; §6.4–§6.5; GAP-BM-05 clarify + GAP-BM-13 |
| 1.1 | 2026-07-09 | QA - Yemima | Perluasan sumber data (PO + Stock Addition + Opname IN + Opening Stock); before/after §2.2; pending items §13; relasi Stock Remapping |
| 1.0 | 2026-07-05 | QA - Yemima | Full doc from PM requirement + codebase AS-IS, gaps §12 |

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Before vs After (Requirement Comparison)](#2-before-vs-after-requirement-comparison)
3. [Logika Perhitungan COGS Master](#3-logika-perhitungan-cogs-master) (+ [§3.5 Manual](#35-manual-cogs-override-to-be-v13) · [§3.6 Bundle](#36-product-bundle-header-to-be-v14))
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
| **Operator / Finance** | Monitoring COGS per SKU + audit · **Manual COGS** (v1.3) · **Product Bundle** header COGS (v1.4) |

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

### 2.3 Manual COGS override (v1.2 doc → v1.3 TO-BE)

| Aspek | Before (AS-IS / v1.2) | After (v1.3 TO-BE) |
|-------|----------------------|-------------------|
| Input harga di menu | **Read-only** — hanya Calculate | Inline **Manual COGS** + **Manual COGS Expiry** (pola Price List) |
| COGS efektif | Selalu hasil rumus | Manual jika aktif; else rumus |
| Description | Highest / Last Inbound / No Inbound | + **Manual Input** saat override aktif |
| Import | Tidak ada import override | Template `SKU Code` \| `Manual COGS` \| `Manual COGS Expiry` |
| Scope edit | — | **Single** + **Variant** only (Parent ditolak) |
| Expiry kosong | — | Override **permanen** sampai Manual COGS di-clear |
| Clear Manual COGS | — | Langsung kembali rumus + audit |

### 2.4 Product Bundle header COGS (v1.3 → v1.4 TO-BE) — ETM-15688

Header **Product Bundle** tidak stockable dan tidak punya jejak inbound SCM → path Highest/Last Inbound biasanya **0**. v1.4 menambah rumus khusus **hanya** untuk Product Bundle (bukan BOM/rakitan).

| Aspek | Before (AS-IS / v1.3) | After (v1.4 TO-BE) |
|-------|----------------------|-------------------|
| Header bundle non-random | Diperlakukan seperti Single → sering `No Inbound` / 0 | **Σ (B.COGS komponen × qty)** — Description **`Bundle Sum`** |
| Header bundle **random** | Tidak ada cabang khusus | **MAX** B.COGS sibling header non-random — **`Highest Bundle Variant`** |
| Qty komponen | N/A | **Wajib** dikalikan |
| Manual COGS di header bundle | (v1.3 Single/Variant) | Tetap boleh — **abaikan** SUM/sibling; Description **Manual Input** |
| BOM / SKU rakitan (assembly) | Highest / Last Inbound per SKU | **Tidak berubah** — dilarang pakai Bundle Sum |
| Job order | Parent/variant/random saja | Komponen final dulu → Bundle Sum → Highest Bundle Variant |

Detail: [§3.6](#36-product-bundle-header-to-be-v14).

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
| **Random variant** (non-bundle) | Child dengan opsi random | **Inherit** nilai MAX sibling/parent (bukan hitung dari inbound random SKU) | Sama parent |
| **Product Bundle header** (non-random) | Flag Product Bundle · punya detail komponen stockable | **Σ (B.COGS efektif komponen × qty)** — **bukan** dari inbound header | **`Bundle Sum`** (TO-BE v1.4) |
| **Product Bundle header** (random) | Variant random dari parent bundle | **MAX** B.COGS sibling header non-random — **tanpa** detail BOM | **`Highest Bundle Variant`** (TO-BE v1.4) |
| **BOM / rakitan header & detail** | Assembly stockable | Sama Single/Variant (inbound / Manual) — **jangan** pakai rumus Bundle | Highest / Last Inbound / No Inbound / Manual Input |

**Parent ProductTree** (termasuk parent yang punya child bundle): tetap **MAX** variant exclude random — nilai child yang sudah Bundle Sum ikut masuk MAX. Bukan rumus Bundle Sum tersendiri di baris Parent.

**Scheduled job:** `product-benchmark-price:calculate` setiap **00:00 WIB** → dispatch `ProductBenchmarkPriceJob` (urutan v1.4: lihat §3.6).

**Manual Calculate:** icon sync per baris → hitung parent + variant terkait (partial scope); untuk bundle pastikan komponen sudah ter-hitung.

### 3.4 Penyimpanan master

| Item | Nilai |
|------|-------|
| Tabel | `accounting_product_benchmark_prices` |
| Unique key | `product_id` (per SKU) |
| Kolom AS-IS | `benchmark_price` decimal(21,4), `description` nullable |
| Kolom TO-BE (v1.3) | + `manual_cogs` nullable · `manual_cogs_expiry` date/datetime nullable · (opsional) simpan calculated terpisah jika perlu audit rumus vs efektif |
| Relasi | `Product::benchmarkPrice()` hasOne |

**API / UI kolom COGS** = **nilai efektif** (lihat §3.5), bukan selalu hasil rumus mentah.

### 3.5 Manual COGS override (TO-BE v1.3)

Override agar ops bisa set COGS efektif di luar rumus Highest Price / Last Inbound / No Inbound.

#### Labels (approved)

| Surface | Label |
|---------|--------|
| Input override | **Manual COGS** |
| Expiry | **Manual COGS Expiry** |
| Description saat override aktif | **Manual Input** |
| Nilai efektif (kolom tetap) | **COGS** |
| Import headers | **SKU Code** \| **Manual COGS** \| **Manual COGS Expiry** |

#### Effective logic

```
effective_cogs =
  if manual_cogs is not null
     and (manual_cogs_expiry is null
          or now(Asia/Jakarta) <= end_of_day_235959(manual_cogs_expiry))
    then manual_cogs
    else calculated_cogs_from_formula

description =
  if using manual override then "Manual Input"
  else ("Highest Price" | "Last Inbound" | "No Inbound"
        | "Bundle Sum" | "Highest Bundle Variant")
```

| Rule | Detail |
|------|--------|
| Expiry **NULL/kosong** | Override **permanen** sampai Manual COGS di-clear |
| Expiry diisi (DD-MM-YYYY) | Berlaku sampai **23:59:59 Asia/Jakarta** tanggal itu; setelah itu kembali rumus |
| Clear Manual COGS (null) | Langsung kembali rumus (tanpa tunggu expiry); recommended clear expiry bersama |
| Nilai | Numeric; **boleh 0**; **tidak boleh negatif** |
| Scope | **Single** + **Variant** only (termasuk **header Product Bundle** yang bertipe itu) — Parent ProductTree tidak editable / import row fail |
| Manual di header bundle | **Abaikan** Bundle Sum / Highest Bundle Variant; clear Manual → kembali rumus §3.6 |
| Daily job | Jangan timpa COGS efektif saat override masih aktif (boleh update calculated di belakang layar jika disimpan terpisah) |
| Snapshot SO | Capture **effective** COGS saat create/bind (recommended follow-up; pastikan setelah ship) |

#### Contoh kasus

| SKU | Type | Manual COGS | Manual COGS Expiry | COGS (efektif) | Description |
|-----|------|-------------|--------------------|----------------|-------------|
| SKU-A | Single | 15000 | (empty) | 15000 | Manual Input |
| SKU-B | Variant | 0 | 31-12-2026 | 0 | Manual Input |
| SKU-C | Single | (cleared) | — | rumus | Highest Price / Last Inbound / No Inbound |
| SKU-P | Parent | — | — | rumus | Manual tidak editable / import rejected |

#### Tooltips (approved copy)

**Manual COGS:** Set a manual COGS to override the calculated value. While Manual COGS is filled and not expired, the **COGS** column shows this value and Description becomes **Manual Input**. Clear this field to return to the system formula (Highest Price / Last Inbound / No Inbound / Bundle Sum / Highest Bundle Variant). Use **0** if you intentionally want COGS = 0. Negative values are not allowed.

**Manual COGS Expiry:** Optional. Format **DD-MM-YYYY** (valid until **23:59:59 Asia/Jakarta** that day). • **Filled:** Manual COGS applies until that date/time, then COGS returns to the system formula. • **Empty:** Manual COGS stays active **indefinitely** until you clear Manual COGS. Use this only when you want a time-limited override.

#### Import (TO-BE)

| Item | Rule |
|------|------|
| Template | `Template-Import-Manual-COGS.xlsx` — 3 kolom di atas |
| Manual COGS blank | **Clear** override (+ clear expiry) |
| Fail row | SKU not found · bukan Single/Variant · Manual COGS < 0 · expiry invalid / sudah lewat EOD |
| Success | Set/clear + audit + Updated by / COGS Last Updated |
| Partial | Row valid commit; fail hanya di import log |
| UX | Samakan standar import OlshopERP terbaru (progress, history, notifikasi) |

**Out of scope v1.3:** Manual override pada Parent ProductTree; ubah rumus 3-tier non-bundle.

Lihat **GAP-BM-14**.

### 3.6 Product Bundle header (TO-BE v1.4) — ETM-15688

#### Scope — Bundle vs BOM/rakitan (WAJIB)

| | **Product Bundle** (in scope) | **BOM / rakitan / assembly** (out of scope rumus bundle) |
|--|-------------------------------|----------------------------------------------------------|
| Stockable header | **Tidak** | **Ya** |
| SCM inbound / opname / addition | Header **tidak** ditransaksikan | Header & detail punya jejak harga |
| Order (SO) | Boleh | Sesuai master |
| Detail / komponen | Hanya SKU **stockable**; **nested bundle tidak didukung** | Boleh nested BOM (sub-assembly) per menu BOM |
| Gate implementasi | Flag / tipe **Product Bundle** | Rumus Single/Variant biasa — **dilarang** Bundle Sum |

Struktur tabel header–detail boleh shared dengan BOM di DB; **fungsi kalkulasi Bundle hanya jika Product Bundle**.

#### Urutan job (dependency) — wajib

1. Single / Variant **non-bundle** dari sumber transaksi (Highest → Last Inbound → 0).  
2. Random **non-bundle** = MAX sibling (kecuali Manual aktif).  
3. Header Bundle **non-random** = Bundle Sum (komponen sudah final).  
4. Header Bundle **random** = Highest Bundle Variant.  
5. Di tiap langkah: Manual COGS aktif → skip rumus SKU itu.

#### Rumus

```
Bundle Sum (header non-random):
  B.COGS(header) = Σ ( B.COGS_efektif(komponen_i) × qty_i )

Highest Bundle Variant (header random):
  B.COGS = MAX(B.COGS sibling header non-random dalam parent yang sama)
  — tidak memakai baris detail komponen
```

| Label Description | Kapan |
|-------------------|--------|
| **Bundle Sum** | Hasil SUM di atas |
| **Highest Bundle Variant** | Hasil MAX sibling header |
| **Manual Input** | Manual COGS aktif di header |

#### Contoh (dari Excel `Benchmark COGS Bundle.xlsx`)

| Case | Hasil | Description |
|------|-------|-------------|
| Blue = 650k+50k+130k | **830.000** | Bundle Sum |
| White sibling | **835.000** | Bundle Sum |
| Random header | **MAX = 835.000** | Highest Bundle Variant |
| Qty komponen = 2 @ 100k | kontribusi **200.000** | Bundle Sum |
| Manual 900k di header Blue | **900.000** (abaikan SUM) | Manual Input |
| Detail berisi keyboard-random 765k + … | SUM memakai B.COGS final random | Bundle Sum |

Komponen **random** non-bundle di detail memakai B.COGS final setelah inherit sibling (§3.3), baru dikalikan qty.

Lihat **GAP-BM-15**.

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
| **COGS** | `benchmark_price_formatted` (efektif) | Nilai efektif — rumus **atau** Manual COGS jika override aktif |
| **Manual COGS** | `manual_cogs` (TO-BE) | Inline edit; Single + Variant only |
| **Manual COGS Expiry** | `manual_cogs_expiry` (TO-BE) | Opsional; DD-MM-YYYY; kosong = permanen |
| **Description** | `description_formatted` | `Highest Price` / `Last Inbound` / `No Inbound` / **Manual Input** / **Bundle Sum** / **Highest Bundle Variant** (TO-BE v1.4) |
| **COGS Last Updated** | `last_updated_formatted` | Timestamp update row benchmark (termasuk edit/import Manual) |
| Action | sync | Manual calculate |

**Show Detail OFF (default):** query join `product_tree` where `parent_id IS NULL` → hanya **Single + Parent**.

**Show Detail ON:** semua produk termasuk **Variant** child.

### 4.3 UX notes

| Behavior | Detail |
|----------|--------|
| Manual Calculate | Job **async** (Horizon); controller `sleep(1)` — reload datalist **tidak** menjamin selesai |
| Inline Manual COGS | TO-BE — pola **Price List**; Parent disabled |
| Import Manual COGS | TO-BE — toolbar import + template download |
| Export All | Tab export file + progress polling |
| Permission | `ProductBenchmarkPricePolicy` → `viewAny` untuk index |

### 4.4 Out of scope (Manual COGS v1)

- Override Manual pada **Parent** SKU  
- Mengubah rumus Highest Price / Last Inbound / No Inbound  

---

## 5. Audit Log (Calculate Log)

Setiap perubahan `benchmark_price` / `description` / **Manual COGS** (set atau clear) — auto midnight, manual Calculate, **inline edit**, atau **import** — tercatat via OwenIt Audit (`ConsoleAuditTrait` — aktif saat **console/queue**; pastikan path UI/import juga menulis audit).

| Kolom slideover | Isi |
|-----------------|-----|
| **Date** | Waktu audit |
| **Old Values** | SKU Code, COGS, Description (transformed) · TO-BE: Manual COGS / Expiry jika berubah |
| **New Values** | SKU Code, COGS, Description · TO-BE: Manual fields |
| **Action** | Event type (created/updated) |

**API:** `GET /api/accounting/product-benchmark-price/calculate-log`

| Event (TO-BE) | Audit | Updated by | COGS Last Updated |
|---------------|-------|------------|-------------------|
| Inline set/change Manual | Yes | Yes | Yes |
| Clear Manual COGS | Yes | Yes | Yes |
| Import set/clear | Yes | Yes | Yes |
| Daily job while override aktif | Jangan ubah COGS efektif | — | Prefer no user-facing bump |

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
| Create `SalesOrderDetail` / `SalesOrderDetailRandom` | `handleBenchmarkCogsOnCreating()` — copy `ProductBenchmarkPrice.benchmark_price` jika `product_id` set & `benchmark_cogs` belum > 0 · **TO-BE v1.3:** snapshot harus pakai **effective** COGS (Manual jika aktif) |
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

| Aspek | TO-BE (v1.2) | AS-IS code (verifikasi 2026-08-11) |
|-------|--------------|-----------------------------------|
| Metrik harga | **Price Before VAT** dalam **primary currency** | `each_price_without_vat` (detail) / `each_price_before_discount_before_vat` (random) — **belum** eksplisit × rate ke primary di satu helper bersama UI flag |
| Metrik COGS | **Benchmark COGS (captured)** | `benchmark_cogs` ✓ |
| Rule | `price_before_vat_primary < benchmark_cogs` → block auto-approve | `unit_price < benchmark_cogs` → `prevent_auto_approve = true` |
| Zero COGS | `benchmark_cogs = 0` / unset → **jangan** flag / jangan block karena reason ini | Praktis: `0 < x` false untuk harga positif; pastikan edge harga 0 tetap no-flag |
| Equal | `==` → **tidak** flag / tidak block | `<` only ✓ |
| Trigger | Sama helper untuk UI flag + prevent | `SalesOrderDetailPriceObserver` + `updateAutoApproveFlagForSalesOrder()` |
| UI flag | Lihat §6.5 | Icon `dollar-sign` — *"Product price is below COGS Benchmark. Manual approval required."* |
| Process impact | Block **schedule auto-approve** only; **manual approve tetap boleh** | Selaras intent |
| Random bundle line | — | Random detail `product.isBundle()` → **force** prevent auto-approve |
| Bundle komponen | Price Before VAT komponen vs **Parent** COGS | Belum align penuh — **GAP-BM-06** |

**FX (TO-BE wajib):** jika currency order ≠ primary:

```
price_before_vat_primary = price_before_vat_order_currency × exchange_rate_order
```

Rate = exchange rate yang tersimpan di order. Benchmark COGS selalu primary.

**Legacy dead code:** `checkLatestPricePO()` — compare vs latest PO price, **tidak pernah dipanggil**.

**Jira historis:** [ETM-12890](https://erpintegration.atlassian.net/browse/ETM-12890) · [ETM-12947](https://erpintegration.atlassian.net/browse/ETM-12947) · improvement Error Flag 2026-08-11 (brief lokal Downloads)

### 6.5 Error Flag **Below Benchmark COGS** (TO-BE — improve `cogs-error`)

Bukan flag key baru — standarisasi AS-IS `cogs-error` di:

| Menu | UI route |
|------|----------|
| Dev - Sales Platform | `/omni/sales-order` |
| Dev - Sales Order | `/businessdevelopment/sales-order-general` |
| All Sales Order | `/businessdevelopment/all-sales-order` |

| Aspek | TO-BE |
|-------|--------|
| Flag key | `cogs-error` (tetap) |
| Icon | Font Awesome `money-bill-trend-down` (fallback `arrow-trend-down`), warna **merah** |
| Filter / label | `Below Benchmark COGS` — advanced filter Error Flag harus searchable by label ini |
| Tooltip line 1 | `Below Benchmark COGS` |
| Tooltip line 2 | `Unit price before VAT (in primary currency) is below Benchmark COGS. Auto-approve is blocked; manual approval is still allowed.` |
| Header Error Flag | Icon jika **minimal 1** detail SKU under benchmark |
| Detail SKU Error Flag | Icon **hanya** di baris SKU under; baris aman tanpa icon ini |
| Lifecycle | **Capture:** selama detail tidak dihapus, flag mengikuti data line ter-capture. Refresh via **delete + reinsert** detail (snapshot COGS/harga mengikuti fungsi capture saat reinsert). Master Benchmark berubah **tidak** mengubah line lama tanpa reinsert |

**Out of scope:** rumus master Benchmark; memblokir manual approve; recompute live tanpa delete/reinsert.

Lihat **GAP-BM-13**. Konsumen menu: [omni-sales-platform](../omni-sales-platform/requirement.md) · [sales-order-general](../sales-order-general/requirement.md) · [all-sales-order](../all-sales-order/requirement.md).

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
| BM-14 | Manual COGS aktif (expiry empty) | COGS = Manual; Description = **Manual Input**; permanen sampai clear |
| BM-15 | Manual COGS = 0 | Diterima; COGS efektif 0 + Manual Input |
| BM-16 | Manual COGS negatif | Ditolak |
| BM-17 | Expiry DD-MM-YYYY | Berlaku sampai 23:59:59 Asia/Jakarta; setelah itu kembali rumus |
| BM-18 | Clear Manual COGS | Langsung rumus; audit clear |
| BM-19 | Parent Manual COGS | Tidak editable; import row fail; partial OK |
| BM-20 | Import 3 kolom | Blank Manual = clear; blank Expiry = permanent; log/notifikasi standar |
| BM-21 | Job vs override | Daily calculate tidak menimpa COGS efektif saat override aktif |
| BM-22 | Bundle Sum | Header Product Bundle non-random = Σ (B.COGS komponen × qty); Description **Bundle Sum** |
| BM-23 | Qty BOM > 1 | Kontribusi = B.COGS × qty |
| BM-24 | Komponen random di detail | Pakai B.COGS final komponen (setelah inherit) |
| BM-25 | Highest Bundle Variant | Header bundle random = MAX sibling header; tanpa detail; Description **Highest Bundle Variant** |
| BM-26 | Job order Bundle | Komponen (+ random non-bundle) selesai sebelum Bundle Sum / Highest Bundle Variant |
| BM-27 | Manual di header bundle | Override aktif → Manual Input; clear → kembali Bundle Sum / Highest Bundle Variant |
| BM-28 | BOM/rakitan | Header/detail assembly **tidak** memakai Bundle Sum / Highest Bundle Variant |

---

## 9. Acceptance Criteria — SO Detail & Auto-Approval

| ID | Kriteria | Expected (PM) | AS-IS verify |
|----|----------|---------------|--------------|
| SO-01 | Kolom Price Before VAT | Hidden default; formula tax include/exclude benar | ✓ hidden · formula via detail accessors |
| SO-02 | Kolom Benchmark COGS | Hidden default; nilai saat order masuk | ✓ hidden · snapshot on create |
| SO-03 | Snapshot test | Edit master benchmark → SO **tidak** berubah | ✓ kolom `benchmark_cogs` |
| SO-04 | Bundle/Random parent COGS | Capture **parent** benchmark | ⚠️ header ✓ · child lines own product — **GAP** |
| SO-05 | Block auto-approve | Price Before VAT (primary) < Benchmark | ⚠️ samakan helper + FX — **GAP-BM-05 / GAP-BM-13** |
| SO-06 | Allow auto-approve | Price Before VAT (primary) ≥ Benchmark (+ syarat lain) | ⚠️ same |
| SO-09 | Error Flag Below Benchmark COGS | Icon/tooltip/filter §6.5 di 3 menu + detail SKU | 🔜 **TO-BE** — **GAP-BM-13** |
| SO-10 | Zero / equal COGS | `benchmark_cogs = 0` atau harga `==` → no flag | Partial AS-IS; harden di GAP-BM-13 |
| SO-07 | Platform unbound | Skip; COGS 0 | ✓ `product_id` null |
| SO-08 | Binding platform | Set benchmark saat bind | ✓ `ProductController` binding update |

---

## 10. Relasi Menu Lain

| Menu | Relasi |
|------|--------|
| [System Product](../system-product/requirement.md) | Sumber SKU; parent/variant/random; **Product Bundle** flag & detail komponen |
| [Bill of Material](../bill-of-material/requirement.md) | Rakitan/assembly — B.COGS per SKU sendiri; **bukan** Bundle Sum |
| [Sales Order General / Platform](../sales-order-general/requirement.md) | Kolom detail + auto-approve; snapshot header bundle memakai nilai master (setelah v1.4 = Bundle Sum / …) |
| [Random SKU](../random-sku/requirement.md) | Random non-bundle inherit sibling; bedakan dari **Highest Bundle Variant** (MAX header sibling) |
| [Stock Opname](../supplychain-stock-opname/requirement.md) | Default price surplus · **sumber** opname IN (v1.1) |
| [Stock Addition](../supplychain-adjustment-addition/requirement.md) | Manual addition · **sumber** benchmark (v1.1) |
| [Opening Stock](../accounting-opening-stock/knowledge-base.md) | **Sumber** benchmark (v1.1) |
| [Stock Remapping](../accounting-stock-remapping/requirement.md) | Addition auto dari Stock Remapping **bisa** masuk sumber benchmark v1.1 (unit price dari stock ID origin) — [P-SRM-16](../accounting-stock-remapping/requirement.md#153-relasi--loophole-operasional) |
| [Product Bundle proporsi](../sales-order-general/requirement.md#10-product-bundle--proporsi-harga-price-before-vat) | HPP validation vs benchmark header/parent — nilai header master berubah setelah v1.4 |

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
| T-17 | Manual COGS 15000, expiry empty | COGS 15000, Manual Input (permanen) |
| T-18 | Manual COGS = 0 + expiry future | COGS 0, Manual Input |
| T-19 | Manual COGS negatif | Reject |
| T-20 | Expiry hari ini — setelah 23:59:59 WIB | Kembali rumus |
| T-21 | Clear Manual COGS | Rumus + audit clear |
| T-22 | Parent inline / import Manual | Not editable / row fail; partial success |
| T-23 | Import blank Manual COGS | Clear override |
| T-24 | Job midnight saat override aktif | COGS efektif tetap Manual |
| T-25 | Bundle variant Blue/White/Random (Excel case 1) | 830k / 835k / 835k; Bundle Sum / Highest Bundle Variant |
| T-26 | Bundle single + komponen random (case 2) | SUM memakai B.COGS final mouse-random |
| T-27 | Detail bundle berisi random komponen (case 3) | SUM benar; random header = MAX sibling |
| T-28 | Qty komponen = 2 | Kontribusi × 2 |
| T-29 | Manual COGS di header bundle | Manual Input; clear → Bundle Sum |
| T-30 | Header BOM/rakitan | Tetap Highest/Last Inbound — **bukan** Bundle Sum |

---

## 12. Gaps — PM vs AS-IS Codebase

| ID | Topik | PM / Requirement | AS-IS | Status |
|----|-------|-------------------|-------|--------|
| **GAP-BM-01** | Metode kalkulasi | Highest Price 30 hari | ✓ `max(item_stock.each_price_before_vat)` | **OK** |
| **GAP-BM-02** | MA30 legacy | Diganti Highest Price | `MaPrice30Days()` masih ada di Product, **commented** di opname — tidak dipakai job | **OK (by design)** |
| **GAP-BM-03** | Scope sumber (v1.0) | PO only | Filter PO **di-comment** — semua inbound masuk | **Superseded by GAP-BM-12** |
| **GAP-BM-04** | COALESCE item_stock vs inbound detail | Fallback jika item_stock price 0 | **Commented out** di job | **Partial** |
| **GAP-BM-05** | Auto-approve / UI metric | Price **Before** VAT → **primary** (× rate jika FX) | AS-IS: `each_price_without_vat` / random before-VAT vs `benchmark_cogs` — FX→primary + satu helper UI+prevent belum lengkap | **Open** (clarify 2026-08-11; dulu terdokumentasi sebagai after-VAT) |
| **GAP-BM-06** | Bundle child COGS | Parent benchmark untuk validasi | Each line own `product_id` benchmark | **Gap** |
| **GAP-BM-07** | Random SO line | Parent COGS | Master: random inherits parent · SO: depends on `product_id` at capture | **See random-sku doc** |
| **GAP-BM-08** | Manual calculate UX | Immediate feedback | Async job + sleep(1) | **UX gap** |
| **GAP-BM-09** | `checkLatestPricePO` | Replaced by benchmark | Method exists, **never called** | **Dead code** |
| **GAP-BM-10** | Description parent | Highest / Last Inbound per logic | Parent with max>0 always **Highest Price** even if from Last Inbound child | **Minor** |
| **GAP-BM-11** | QA docs | 3-layer complete | Was pending — **this release** | **Resolved** |
| **GAP-BM-12** | Allowlist 4 sumber (v1.1) | PO + Addition + Opname IN + Opening Stock | Filter PO di-comment; **belum** allowlist eksplisit; return/transfer ikut terhitung | **Pending implementasi** |
| **GAP-BM-13** | Error Flag `cogs-error` UX + filter | Icon `money-bill-trend-down`, label/filter **Below Benchmark COGS**, tooltip 2 baris, header+detail SKU di 3 menu, capture/reinsert, samakan formula §6.4–§6.5 | AS-IS: `dollar-sign` + message lama; filter by label baru belum | **Open (TO-BE)** |
| **GAP-BM-14** | Manual COGS override | §3.5 — kolom Manual COGS + Expiry, effective COGS, Description Manual Input, inline+import, audit, job respects override | AS-IS: read-only COGS rumus saja | **Open (TO-BE)** |
| **GAP-BM-15** | Product Bundle header COGS | §3.6 — Bundle Sum / Highest Bundle Variant; qty × B.COGS; job order; Manual override; gate ≠ BOM/rakitan | AS-IS: tidak ada cabang `isBundle` → header sering 0 / No Inbound | **Open (TO-BE)** — ETM-15688 |

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
| **P-15** | Manual COGS (v1.3) | Override + expiry + import belum di kode | **Pending dev** — GAP-BM-14 |
| **P-16** | Product Bundle COGS (v1.4) | Bundle Sum / Highest Bundle Variant + job order belum di kode | **Pending dev** — GAP-BM-15 · ETM-15688 |

### 13.2 Relasi ke menu lain

| ID | Menu terkait | Deskripsi | Status / Tindakan |
|----|--------------|-----------|---------------------|
| **P-07** | Sales Order — auto-approve + Error Flag | TO-BE §6.4–§6.5 (Before VAT primary + Below Benchmark COGS); AS-IS belum penuh (GAP-BM-05 / GAP-BM-13) | **Open** — improve `cogs-error` |
| **P-08** | Sales Order — bundle child | Validasi PM: komponen vs parent benchmark; kode: each line own `product_id` (GAP-BM-06) | **Gap** — lihat [sales-order-general §10.6](../sales-order-general/requirement.md#106-validasi-auto-approval-hpp--benchmark-cogs); setelah v1.4 nilai **header** master naik dari Bundle Sum — regresi SO |
| **P-09** | Sales Order — random SKU | Line random sering `benchmark_cogs = 0` pre-bind; validasi under-benchmark tidak trigger | **Known** — [random-sku](../random-sku/requirement.md) |
| **P-10** | Stock Opname | Dua arah: konsumen fallback harga **dan** sumber kalkulasi (v1.1) — operator perlu paham dampak input harga | **Catatan operasional** |
| **P-11** | Opening Stock | Relasi sumber benchmark v1.1 | Docs menu sudah `review` — verifikasi konsistensi saja |
| **P-12** | SO export | `resolveBenchmarkCogs()` fallback ke live master jika snapshot 0 — bisa beda dari nilai saat order dibuat | **Edge case** export |
| **P-17** | Bill of Material / Assembly | Pastikan gate job tidak menerapkan Bundle Sum ke Header BOM | **Catatan implementasi** — §3.6 |

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
| User Guide | [user-guide.md](./user-guide.md) |
| Sales Order integration | [../sales-order-general/requirement.md §11](../sales-order-general/requirement.md#11-benchmark-cogs--price-before-vat-detail-order) |
| Card Improvement Bundle | [ETM-15688](https://erpintegration.atlassian.net/browse/ETM-15688) |
