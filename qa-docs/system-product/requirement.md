---
doc_type: requirement
menu: system-product
menu_name: "System Product"
version: 2.1
last_updated: 2026-07-05
owner: QA - Yemima
status: review
aliases: [product bundle tax, bundle parent tax hide, bundle pricing proportion, Price Before VAT bundle, coefficient tax bundle]
---

# System Product — Requirement Documentation

**Modul:** Supply Chain Management (SCM) / Master Data  
**Audience:** PM, Operations, QA, Support, Developer  
**Status:** AS-IS verified against codebase per 2026-07-05

**UI route (full):** `/supplychain/product`  
**API base (full):** `{VITE_API_URL}supplychain/product`  
**Table:** `scm_products` (+ trees, units, D&W profiles, specs, taxes, BoM)

**PM sources:** User requirement (chat) · D&W artifact v1.0 (7 Mei 2026)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0–1.2 | 2026-01–07 | QA - Yemima | Initial draft from legacy + partial PM |
| 2.0 | 2026-07-05 | QA - Yemima | Full rewrite: codebase AS-IS, D&W per unit canonical, bundle/random/import detail, gaps §19–§21 |
| 2.1 | 2026-07-05 | QA - Yemima | §6.4 tax hide bundle parent · §11 proporsi harga bundle TO-BE (Price Before VAT, coefficient) · GAP-SP-12/P-SP-02 resolved |

---

## 1. Ringkasan Eksekutif

**System Product** adalah master data **SKU** utama — menyimpan identitas produk, satuan, dimensi/berat per unit, variant, bundle, flag inventori, pajak, dan parameter pengiriman. Bukan hanya data statis: logika stok, transactability, dan distribusi harga bundle dihitung runtime.

| Kebutuhan Bisnis | Bagaimana System Product Menjawab |
|------------------|-----------------------------------|
| Multi-tipe SKU | Single, Variant (parent/child), Bundle |
| Stok multi-gudang | Availability, On Hand, ATS per SKU (bundle = lowest denominator) |
| Satuan & konversi | Primary + alternate unit; D&W **per unit** |
| Penjualan marketplace | Platform binding (menu terpisah); D&W Platform Default |
| Produksi | Header BOM (`is_bom=1`) di menu Bill of Material — **bukan** toggle bundle |
| Pajak transaksi | Hierarki Company → Product `auto_add` |

### 1.1 Tiga mode menu (AS-IS)

| Mode | Route / Controller | Scope form |
|------|-------------------|------------|
| **System Product (full)** | `/supplychain/product` · `ProductController` | Semua section |
| **Product General Configuration** | `/supplychain/product-general-configuration` · `ProductGeneralConfigurationController` | General: basic, unit, D&W, variant, bundle, sales, tax — **tanpa** inventory flags penuh |
| **Product Inventory Configuration** | `/supplychain/product-inventory-configuration` · `ProductInventoryConfigurationController` | Inventory: expired/serial/batch, min-max warehouse |

Import history & bulk import **hanya** di menu full (`has_import_history = false` di general/inventory datalist).

### 1.2 Tipe produk & transactability

| Tipe UI | Backend | Bisa ditransaksikan? | Punya stok sendiri? |
|---------|---------|---------------------|---------------------|
| **Single** | `SINGLE` | Ya | Ya |
| **Variant (Parent)** | `PARENT` via `productTree` | Tidak | Tidak (wrapper) |
| **Variant (Child)** | `VARIANT` child | Ya | Ya |
| **Bundle** | `billOfMaterial` header `is_bom=0` | Ya — **Sales Order only** | Tidak — stok dari komponen |

---

## 2. Datalist (Halaman Depan)

**Komponen FE:** `DatalistProductComponent.vue`  
**API:** `GET .../product` (`ProductController@index`)

### 2.1 Kolom visible

| Kolom | Sumber / Keterangan |
|-------|---------------------|
| **Images** | Thumbnail 100×100 (`image_formatted`) |
| **Product** (combined) | SKU (link edit), Name (excerpt 60), Primary Unit, **Price** (`Rp. {price}`) |
| **Type / Bundle / Active** | Badge PARENT / SINGLE / VARIANT · Bundle Yes/No · Active boolean |
| **Availability / On Hand / ATS** | Tiga angka stacked; cache 1 menit per product |
| **Data Owner** | Public/Private badge, company name, Created/Updated `d-m-Y H:i:s`, Creator |

**Tooltip harga:** ditampilkan untuk Single & Variant child; parent tetap bisa render `product.price` jika terisi.

**Hidden SearchBuilder:** SKU, Name, Primary Unit, Price, Type, Bundle, Active, **BOM** (Header BoM `is_bom=1` — terpisah dari bundle), stock columns terpisah, timestamps.

### 2.2 Rumus stok (AS-IS — `Product.php`)

**Non-bundle:**

| Kolom | Rumus (konsep) |
|-------|----------------|
| **Availability** | Σ `item_stocks.available_quantity` (dengan konversi unit) |
| **On Hand** | Σ `ending_stocks.on_hand_stock` |
| **ATS** | `globalAtsStock` |

**Bundle:**

| Kolom | Rumus |
|-------|-------|
| **Availability** | `floor(min(child_availability / bom_qty))` — **lowest denominator** |
| **On Hand** | `getMinOnHandChild()` |
| **ATS** | `getMinGlobalAtsChild()` |

**Catatan PM vs AS-IS:** Tooltip FE menyebut parent variant stok `-`; backend tetap hitung numerik untuk semua baris.

### 2.3 Action buttons (datalist)

| Aksi | Kondisi |
|------|---------|
| **Create** | Privilege create |
| **Update** | Selalu (per baris) |
| **Delete** | Blok jika: relasi BoM, interchange, PR/PO, inbound/outbound, platform binding; parent dengan variant; baris variant child |
| **Bulk delete / unbind** | Privilege + selection |
| **Import / Export** | Menu full only |
| **Show deleted / archived** | Filter toggle |
| **Platform binding** | Popover (menu terpisah) |

---

## 3. Form Create/Edit — Section Overview

**Komponen FE:** `FormProductComponent.vue` (~5.5k lines)

Urutan section (AS-IS):

1. Basic Information  
2. Unit Configuration (+ D&W per unit via modal)  
3. Product Details (accordion: media, variant, bundle, sales, inventory)  
4. Other Information (Brand, Condition, …)  
5. Shipping Information (insurance only — **D&W dipindah ke Unit Configuration**)  
6. Processing Configuration (QC / packing SOP)  
7. Accounting & Tax (COA binding + tax tables)

---

## 4. Basic Information

### 4.1 Field & validasi (AS-IS)

| Field | Rules |
|-------|-------|
| **Product SKU** | Required, max 50. **Update:** unique per `owned_by` (`uniqueUpdate`). **Create:** closure global `Product::where('sku')` — **tanpa filter owned_by** (GAP-SP-01) |
| **Product Name** | Required, max 150 |
| **Sales Category** | Required; must exist |
| **Product COA Group** | Required; active; `validateProductCoaGroup()` |
| **Alias** | Array max 150 entries × 150 chars |
| **Tagging** | Optional; auto-create by name jika belum ada |
| **Product Condition** | Required: `Brand New` atau `Second-hand` |
| **Brand** | Nullable — **tidak ada default dari config Shopee** (GAP-SP-02) |
| **Random in SKU** | Ditolak: `"Random sku is not allowed"` |

### 4.2 Default on create (backend)

| Default | Nilai |
|---------|-------|
| Insurance type | `optional` |
| Product image | Placeholder default upload |
| D&W profile | 1×1×1×1 cm/g pada primary unit |
| Tax rows | Seed dari company `DefaultVat` (sales + purchase) |

### 4.3 Primary unit default "Pieces"

FE auto-select unit bernama **Pieces** dari select2 (heuristic), bukan flag `is_default_primary_unit` dari Master Unit API.

---

## 5. Unit Configuration & D&W per Unit

> **Canonical:** D&W artifact v1.0 (7 Mei 2026) — refactor dari flat product-level ke **per unit**. D&W **tidak lagi** di section Shipping.

### 5.1 Struktur data

```
1 System Product → 1 Primary Unit + N Alternate Units → M D&W profiles per unit
Variant child → mengikuti konfigurasi unit parent (tidak edit sendiri)
```

### 5.2 Primary Unit (AS-IS)

| Rule | Implementasi |
|------|--------------|
| Tidak bisa dihapus | Tidak ada tombol delete |
| Qty conversion | Selalu **1**; field disabled di FE |
| Base unit | Auto dari unit class primary; disabled |
| Lock jika transaksi | `primary_unit_disabled` dari API; BE: `'Primary unit cannot be updated because product has relation to transaction'` |
| Scope `checkTransaction()` | PR, PO, BoM, inbound, outbound — **tidak termasuk SO/assembly/transfer** (GAP-SP-11) |

### 5.3 Alternate Unit

| Kondisi | Edit unit | Edit konversi | Hapus | Tambah baru |
|---------|-----------|-----------------|-------|-------------|
| Sudah dipakai transaksi | ❌ | ❌ | ❌ | ✅ |
| Belum dipakai | ✅ | ✅ | ✅ | ✅ |

- Filter unit: same unit class dengan primary (`/{stock_unit_id}/select2-unit`)  
- Base unit rate harus = 1; alternate ≠ primary  
- **Qty conversion field:** FE **selalu disabled** (`:disabled="true"`) — GAP-SP-15 vs PM "manual jika rate NULL"

### 5.4 D&W Profile per unit (modal Edit Unit)

**UI:** Tombol Edit pada primary/alternate → modal berisi Unit Info + tabel D&W inline.

| Kolom D&W | Keterangan |
|-----------|------------|
| Active | Toggle; OFF → semua radio default disabled |
| D&W Label | Dari master Dimension & Weight Label |
| L / W / H (cm) | Numeric |
| Weight (g) | Required |
| **Unit Default** | Radio **per unit** (name unik per unit) |
| **Platform Default** | Radio **global** lintas semua unit & profile |
| **Trx & Report Default** | Radio **global** lintas semua unit & profile |

**Banner modal:** *"Platform Default and Trx & Report Default are global — selecting here deselects from other units."*

**Backend:** `ProductDnWController` — fields `is_unit_default`, `is_platform_default`, `is_trx_default`. Default create: unit=1 jika unset; platform/trx=0.

**Default values D&W baru:** L=W=H=Weight=**1**; label dari master yang `Set as Primary` ON (artifact AC6).

### 5.5 Section artifact vs implementasi

| Section (artifact) | Status AS-IS |
|--------------------|--------------|
| Unit Configuration accordion | ✅ Implemented |
| Modal Edit Unit + D&W inline | ✅ Implemented |
| **D&W Default Configuration** (summary Platform + Trx cards) | ⚠️ **Partial / not found** sebagai section terpisah di main form (GAP-SP-09) |
| **All D&W Configurations** (flat table semua unit) | ⚠️ **Not found** — hanya via modal per unit (GAP-SP-09) |
| D&W removed from Shipping | ✅ Comment `FormProductComponent.vue` L1205 |

---

## 6. Product Details

### 6.1 Media

| Media | FE | BE |
|-------|----|----|
| **Photos** | Max **10**; `.jpg/.jpeg/.png`; UI text min **300×300** px; max file 20 MB | Max 10 images; **tidak validasi dimensi** (GAP-SP-05) |
| **Video** | Max **5**; UI copy `.mkv` dan `.mp4` | `mimes:mp4,mov`; max `config('upload.size.video')` = **20480 KB** (GAP-SP-04) |

Upload foto auto-trigger saat edit via `POST {menuBaseUrl}/{id}/detail`.

### 6.2 Barcode & Retail Price

- Barcode default = SKU (editable); max 128, unique di `scm_products`  
- Retail price di form basic / variant modal

### 6.3 Variant Configuration

**Toggle Enable Variations ON:**

| Aspek | Rule |
|-------|------|
| Max variant types | **3** — enforced **FE only** (GAP-SP-06) |
| Auto-generate SKU | `{parent}-{opt1}` / `{parent}-{opt1}-{opt2}` / 3 segments |
| Random option | Segment literal `-random` → lihat [random-sku](../random-sku/) |
| Transactable | Hanya **child** variant |
| Variant datatable | Kolom dinamis dari `GET .../specification/variant-column` + Variant SKU, Barcode, RETAIL PRICE |
| Variant edit modal | SKU, retail price, stock, min order qty, wholesale, D&W profiles, `is_random` |

### 6.4 Product Bundle Configuration

**Toggle Set as Product Bundle ON** (`is_bom=0` di BoM header — **bukan** Header BOM Assembly).

| Aspek | Rule AS-IS |
|-------|------------|
| **Bundle Single** | Header SINGLE; satu section resep komponen |
| **Bundle Variant** | Header VARIANT; accordion per child variant (`BundleProductForm`) |
| **Scope transaksi** | Sales Order (General & Platform) only — **tidak inbound langsung** |
| **Stok bundle** | Lowest denominator komponen |
| **Outbound** | Potong stok **komponen detail**, bukan header |
| **Lock toggle** | Disabled jika `product_relation` atau `variant_bundle_transaction` |

**Validasi bundle aktif** (`BillOfMaterialController`):

- **Invalid:** 0 detail ATAU **tepat 1 detail dengan qty == 1**  
- **Valid:** ≥2 line items ATAU 1 line dengan **qty > 1** (≥2)  
- Pesan: `'Detail Bundle requires at least 2 items or 1 item with qty > 1'`  
- **Random SKU** exempt dari rule validity

**PM nuance:** User requirement "1 SKU qty > 2" → codebase **qty > 1** (integer ≥2).

**Accounting & Tax Setting — Parent Bundle (TO-BE / PM):**

| Kondisi | Rule |
|---------|------|
| Toggle **Set as Product Bundle** = ON | Section **Accounting & Tax Setting** pada **Parent SKU harus di-hide** |
| Alasan | Parent bundle **tidak** punya pengaturan pajak sendiri; perhitungan pajak & COA mapping **100% mengacu detail item bundle** |

**AS-IS UI:** `FormProductComponent.vue` — accordion Accounting & Tax sudah `v-if="!enable_bundle"` saat bundle aktif. QA verify create **dan** edit bundle header.

**Related:** Distribusi harga bundle di SO → [§11](#11-bundle-pricing-distribution-sales-order--to-be) · Detail modal & capture → [sales-order-general §10](../sales-order-general/requirement.md#10-product-bundle--proporsi-harga-price-before-vat).

### 6.5 Random SKU dalam bundle & nested random

| Skenario | Behavior AS-IS |
|----------|----------------|
| Header bundle random | Excluded dari `select2ProductForTransaction` |
| Detail random child | SO creates `SalesOrderDetailRandom` saat kirim |
| Nested random (bundle dalam bundle) | Import validates master variant punya option `random` (`InsertProductRandomImport`) |
| Wave picking | Lihat [random-sku](../random-sku/requirement.md) |

---

## 7. Sales Management (accordion Product Details — edit only)

| Field | UI | Backend |
|-------|-----|---------|
| Hazardous | Yes/No radio, default `"No"` | `hazardous` nullable |
| Warranty | Select2 master warranty | `warranty_id` nullable |
| Warranty policy | Free text | **No max length** (GAP-SP-07 — PM expected max 30) |
| Pre-order | Toggle + days | `pre_order`; field disabled saat toggle off |

---

## 8. Inventory Management

**Komponen:** `InventoryManagement.vue`

| Feature | Behavior |
|---------|----------|
| Expired date | Checkbox + warning days |
| Serial number | Checkbox; auto SN = SKU + sequential |
| Batch number | Checkbox |
| Min stock qty | Global, base unit |
| Product warning | Red availability di SCM reports |
| Min-max per warehouse | "Set Min-Max per Building" + rows per warehouse |

**Inactive product:** `updateStatusProduct` cek `getAvailability()` dan `getATS()['stock']` + reserved TF/out → harus **0** sebelum inactive.

---

## 9. Shipping & Processing

| Section | Content AS-IS |
|---------|---------------|
| **Shipping insurance** | Radio `required` / `optional`; default create `optional` |
| **Processing / QC** | `PackingStandarization.vue`, `CheckingStandarization.vue` — SOP dari Master QC Procedure |
| **D&W flat (legacy)** | **Removed** — pindah ke Unit Configuration §5 |

---

## 10. Accounting & Tax

### 10.1 Product COA Group binding

Accordion COA Binding maps `ProductCoaGroup` details ke transaction COA lists per tipe transaksi.

### 10.2 Tax hierarchy (runtime di transaksi)

| Prioritas | Setting | Efek |
|-----------|---------|------|
| **1 (tertinggi)** | General Company (Supplier/Customer) | YES → hitung pajak otomatis (abaikan product). NO → tidak hitung |
| **2** | System Product (`auto_add_transaction`) | Jika Company = Default: YES → auto; NO → manual |

**Form SP:** `TaxConfig.vue` — sales/purchase tabs, inline `auto_add_transaction`, `included` (VAT type). Seed dari `DefaultVat` on create.

---

## 11. Bundle Pricing Distribution (Sales Order — TO-BE)

**PM source:** Proporsi harga Product Bundle menggunakan acuan **Price Before VAT** (bukan Retail Price gross).  
**Jira terkait:** [ETM-12890](https://erpintegration.atlassian.net/browse/ETM-12890) (SO General HPP) · [ETM-12947](https://erpintegration.atlassian.net/browse/ETM-12947) (SO Platform HPP)  
**Runtime:** `SalesOrderDetailController::pickBundleChildren()` (canonical) · deprecated `pickChildsForSalesOrder()` (retail gross — jangan dipakai).

### 11.1 Basis proporsi — Before vs After

| Aspek | Before (deprecated) | After (TO-BE / canonical) |
|-------|---------------------|---------------------------|
| Acuan proporsi | Retail Price (gross) × qty | **Price Before VAT** (net) per komponen |
| Code path | `pickChildsForSalesOrder()` | `pickBundleChildren()` |

### 11.2 Langkah perhitungan (TO-BE)

1. Ambil **Retail Price** masing-masing item komponen (× qty line).
2. Konversi ke **Price Before VAT (basis proporsi)** sesuai setting pajak item:
   - **Tax Include:** `Retail Price / (1 + Tax Rate efektif)`
   - **Tax Exclude / No Tax:** `Retail Price` (= Price Before VAT)
3. Hitung **% proporsi** tiap item: `item_price_before_vat / sum(all_price_before_vat)`.
4. **Alokasi Bundle Price** ke tiap item: `% × Bundle Price` (header line price).

**Fallback — semua basis = 0:** equal split `BundlePrice / count(details)`.

### 11.3 Coefficient Tax (Include 12%, DPP 11/12)

Khusus item dengan **Tax Include**, tariff **12%**, **`coefficient = true`**:

| Kolom output | Formula |
|--------------|---------|
| **Basis proporsi** | Retail / **1.11** (pajak efektif 11%) |
| **Price Before VAT** (setelah alokasi) | Alokasi Bundle Price / **1.11** |
| **DPP** | `VAT / 12%` (bukan sama dengan Price Before VAT) |
| **VAT** | Total Price − Price Before VAT (atau DPP × 12%) |

**Non-coefficient Include:** bagi `(1 + tariff%)` — contoh Include 11% → `/ 1.11`.

**Tax Exclude:** Price Before VAT = alokasi; **VAT ditambahkan di atas** alokasi → **Total Price komponen bisa > alokasi**; **grand total semua komponen bisa melebihi Bundle Price header** (expected — lihat Scenario B di [sales-order-general §10](../sales-order-general/requirement.md#103-simulation--qa-validation)).

### 11.4 Simulation reference (PM)

**Global:** Bundle Price = **49.999** · Retail FRESHBOXBB4 = 25.000 · bbll = 5.000

| Scenario | Item 1 | Item 2 | Total basis | Proporsi I1 / I2 |
|----------|--------|--------|-------------|------------------|
| **A** — Coefficient Inc 12% + No VAT | 25.000/1.11 = 22.522,52 | 5.000 | 27.522,52 | **81,83%** / **18,17%** |
| **B** — Mixed Inc 11% + Exc 11% | 25.000/1.11 = 22.522,52 | 5.000 | 27.522,52 | **81,83%** / **18,17%** |

Alokasi Scenario A: Item1 = **40.915,93** · Item2 = **9.083,07** · Check = 49.999.

Detail kolom DPP/VAT/Total per scenario → [sales-order-general §10.3](../sales-order-general/requirement.md#103-simulation--qa-validation).

### 11.5 Acceptance Criteria (bundle pricing — cross-menu)

| ID | Kriteria |
|----|----------|
| BP-01 | Proporsi memakai **Price Before VAT**, bukan retail gross |
| BP-02 | Coefficient True → DPP ≠ Price Before VAT (sesuai simulasi PM) |
| BP-03 | Exclude VAT → VAT di atas alokasi; total komponen boleh > Bundle Price |
| BP-04 | Parent bundle **tanpa** tax setting di System Product (§6.4) |
| BP-05 | Modal Detail Bundle + snapshot + HPP validation → [sales-order-general §10](../sales-order-general/requirement.md#10-product-bundle--proporsi-harga-price-before-vat) |

---

## 12. BOM vs Bundle — Distinction

| Aspek | Product Bundle | Header BOM (Assembly) |
|-------|----------------|-------------------------|
| Menu | Toggle di System Product | [Bill of Material](../bill-of-material/) |
| Flag | `billOfMaterial` `is_bom=0` | `is_bom=1`, status Active |
| Transactable | SO only | Assembly Work Order |
| Datalist column | `bundle_formatted` | Hidden `bom_formatted` |
| Rule | Bundle YES **tidak boleh** jadi Header BOM | FG selector Assembly |

---

## 13. Import & Export

**Menu full only** · Max **5000** data rows · Progress: `GET .../progress`

| Tipe import | Endpoint / template |
|-------------|---------------------|
| New Product | `GET .../download-template` → `ProductImport` |
| Update Product | `download-template-update` → `UpdateProductImport` |
| Product Bundle | `supplychain/bill-of-material-header/import` |
| Insert Random | variant random template → `InsertProductRandomImport` |
| Alternative Unit | static xlsx `/files/` |
| Update Variant Product | static xlsx |
| Bulk Update VAT | static xlsx |

**SKU on import:** consistently scoped `where('sku')->where('owned_by', $company_id)`.

Logs: `import-log`, `import-history`.

---

## 14. Validasi & Immutability

| Rule | Detail |
|------|--------|
| SKU unique | Per Data Owner (`owned_by`) — **except create API** (GAP-SP-01) |
| Delete SKU | Blok jika relasi transaksi / variant / binding |
| Primary unit change | Blok jika `checkTransaction()` false |
| Alternate unit delete | Blok jika `haveRelations()` |
| SKU field edit | `can_update_sku = !checkTransaction()` |
| Inactive | Availability + ATS + reserved harus 0 |
| Archive | Produk inactive → fitur archive |

---

## 15. Do's & Don'ts

| ✅ Do | ❌ Don't |
|-------|----------|
| Set Product COA Group sebelum transaksi finance | Hapus SKU yang sudah punya PO/SO/inbound |
| Set Platform + Trx D&W default sebelum platform sync | Inbound bundle header langsung |
| Validasi bundle ≥2 items atau 1 item qty≥2 sebelum active | Campur Header BOM Assembly dengan Product Bundle |
| Inactive hanya saat stok 0 semua gudang | Expect parent variant punya stok transactable |
| Gunakan child variant / single untuk PO/PR select2 | Pilih header bundle random di transaksi |

---

## 16. Acceptance Criteria (QA smoke)

1. Create single product → default D&W 1×1×1×1, tax seeded, insurance optional  
2. Datalist menampilkan Availability/On Hand/ATS dengan cache refresh  
3. Enable variant max 3 types → auto child SKU; hanya child transactable  
4. Bundle valid: 2+ lines OR 1 line qty≥2; invalid bundle block activate  
5. Bundle SO → stok komponen berkurang, bukan header  
6. Bundle parent → section Accounting & Tax **hidden** (toggle bundle ON)  
7. Bundle SO proporsi → basis **Price Before VAT** (§11)  
8. Primary unit lock setelah PR/PO/inbound  
9. Inactive block jika stok ≠ 0  
10. D&W Platform Default global — pilih di unit A uncheck unit B  
11. Import new product max 5000 rows dengan progress bar  
12. Foto max 10, video max 5 (format BE mp4/mov)

---

## 17. Relasi Menu

### Instant Settlement

SKU pada baris SO settlement → `product_id`. Produk inactive/PARENT block approve. Product COA Group wajib untuk jurnal SI/OB. Detail: [accounting-settlement-upload](../accounting-settlement-upload/requirement.md).

### Assembly & Bill of Material

Header BOM Active → FG di Assembly. Bundle ≠ BOM. Detail: [supplychain-assembly](../supplychain-assembly/requirement.md) · [bill-of-material](../bill-of-material/requirement.md).

### Master Unit

Primary/alternate unit, conversion rate lock. Detail: [supplychain-unit](../supplychain-unit/requirement.md).

### Dimension & Weight Label

Master label untuk D&W profile. Detail: [supplychain-dimension-and-weight-label](../supplychain-dimension-and-weight-label/requirement.md).

### Random SKU

Virtual SKU `-random` segment. Detail: [random-sku](../random-sku/requirement.md).

---

## 18. Purchase Order / PR — Select2 rules

PO/PR Without PR: System Product **active**, Single/Variant child, punya COA group. Parent variant & bundle header excluded (kecuali aturan khusus bundle di SO).

---

## 19. Gaps — PM/Artifact vs AS-IS Codebase

| ID | Topik | Ekspektasi PM/Artifact | AS-IS | Status |
|----|-------|------------------------|-------|--------|
| **GAP-SP-01** | SKU unique per owner | Unique dalam `owned_by` | Create: global check tanpa `owned_by` | **Bug** |
| **GAP-SP-02** | Brand default Shopee | Default dari config | Nullable optional only | **Not implemented** |
| **GAP-SP-03** | Bundle qty rule wording | "qty > 2" | qty **> 1** (≥2) | **Wording differs — AS-IS OK** |
| **GAP-SP-04** | Video format | mkv + mp4 | BE: **mp4, mov** only | **Mismatch FE/BE** |
| **GAP-SP-05** | Photo min 300×300 | Enforced | UI text only | **Not enforced BE** |
| **GAP-SP-06** | Variant max 3 types | Enforced | FE only, no BE validation | **Partial** |
| **GAP-SP-07** | Warranty policy max 30 | Max 30 chars | No validation | **Not implemented** |
| **GAP-SP-08** | Parent stock datalist | Shows `-` | BE returns numeric | **UI expectation gap** |
| **GAP-SP-09** | All D&W table + summary | Artifact AC3–AC4 sections | Modal per unit only | **Partial implement** |
| **GAP-SP-10** | BOM flag on SP form | BOM toggle | Separate BoM menu | **By design** |
| **GAP-SP-11** | Transaction lock scope | All transactions | Misses SO, assembly, transfer | **Incomplete scope** |
| **GAP-SP-12** | Bundle pricing basis | Price Before VAT proporsi (PM) | `pickBundleChildren` ✓ · deprecated path retail gross | **Partial — verify coefficient/DPP UI** |
| **GAP-SP-13** | manifest code_globs | Accurate FE path | Stale `SupplyChain/Product` | **Doc drift** |
| **GAP-SP-14** | Qty conversion manual | Manual when master rate NULL | FE always disabled | **Behavior differs** |
| **GAP-SP-15** | Route menu KB | `/supplychain/system-product` | Actual `/supplychain/product` | **Doc drift** |

### 19.1 GAP-SP-09 — D&W UI sections (detail)

Artifact (7 Mei 2026) mensyaratkan tiga section: Unit Configuration ✅, **D&W Default Configuration** (summary cards), **All D&W Configurations** (flat editable table). AS-IS: D&W dikelola **hanya** di modal Edit Unit per primary/alternate. Operator tidak punya single-page view semua D&W lintas unit tanpa buka modal satu per satu.

### 19.2 GAP-SP-12 — Bundle pricing (detail)

**Keputusan PM (2026-07-05):** Basis proporsi = **Price Before VAT**, bukan retail gross atau margin formula. Canonical code: `pickBundleChildren()` (~L1480).

**Sisa verifikasi QA:**

| Item | Expected TO-BE | Cek |
|------|----------------|-----|
| Coefficient DPP vs Price Before VAT | Berbeda (÷1.11 vs DPP dari VAT/12%) | Modal Detail Bundle |
| Exclude VAT grand total | Boleh > Bundle Price | Scenario B simulasi |
| Deprecated path | Tidak dipanggil | `pickChildsForSalesOrder()` marked `@deprecated` |
| Snapshot setelah approve/sync | Nilai lock | [SO §10.4](../sales-order-general/requirement.md#104-data-integrity--snapshot) |

---

## 20. Dev Follow-ups (non-blocking QA)

| ID | Item | File hint |
|----|------|-----------|
| **DEV-SP-01** | Scope SKU unique create ke `owned_by` | `ProductController@store` L754–766 |
| **DEV-SP-02** | Align video FE copy (mkv) vs BE (mov) | `FormProductComponent.vue`, `ProductDetailController` |
| **DEV-SP-03** | BE validate variant max 3 types | `ProductVariantController@store` |
| **DEV-SP-04** | Implement All D&W table + summary per artifact | `FormProductComponent.vue` |
| **DEV-SP-05** | Extend `checkTransaction()` ke SO/assembly/transfer | `ProductController` L2468+ |
| **DEV-SP-06** | Fix manifest + technical FE paths | `manifest.yaml`, `technical.md` |
| **DEV-SP-07** | Photo dimension validation BE | `ProductDetailController@store` |
| **DEV-SP-08** | Enable qty conversion edit when master rate NULL | `FormProductComponent.vue` L1002 |

---

## 21. Pending Items — Major (diskusi stakeholder)

| ID | Severity | Stakeholder | Pertanyaan | AS-IS impact | Keputusan needed |
|----|----------|-------------|------------|--------------|------------------|
| **P-SP-01** | 🔴 **Highest** | **Dev + QA** | **SKU create harus unique per Data Owner?** (GAP-SP-01) | Dua company bisa bentrok SKU yang sama saat create; update/import sudah scoped | Fix create validation atau memang global unique by design? |
| **P-SP-02** | 🟢 **Resolved** | **PM** | **Bundle pricing — basis Price Before VAT** (GAP-SP-12) | Dokumentasi & `pickBundleChildren` aligned; QA verify coefficient/DPP + snapshot | Monitor modal UI + HPP validation ETM-12890/12947 |
| **P-SP-03** | 🔴 **Major** | **PM + Dev** | **Deploy section All D&W + summary cards?** (GAP-SP-09) | Artifact Ready for Dev; operator tidak lihat global D&W defaults di main form | Prioritas implement vs accept modal-only? |
| **P-SP-04** | 🟡 Medium | **Ops** | Brand default Shopee (GAP-SP-02) | Manual pilih brand setiap create | Perlu config `config/shopee` default brand_id? |
| **P-SP-05** | 🟡 Medium | **Dev** | Perluas lock transaksi ke SO? (GAP-SP-11) | Primary unit masih bisa diubah meski sudah ada SO | Extend `checkTransaction()` scope? |
| **P-SP-06** | 🟡 Medium | **End user** | Parent variant tampilkan `-` di stok? (GAP-SP-08) | Tooltip vs angka backend | FE override display untuk PARENT? |

**Confirmed OK (bukan pending):**

- **GAP-SP-03** — Bundle qty ≥2 or multi-line ✓  
- **GAP-SP-10** — BoM menu terpisah dari bundle toggle ✓  
- **D&W moved from Shipping** — implemented ✓

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| D&W artifact (ref) | [Claude artifact 7 Mei 2026](https://claude.ai/public/artifacts/f32214ae-885c-4484-b8a5-abe0eb4a6a2e) |
| Bill of Material | [../bill-of-material/requirement.md](../bill-of-material/requirement.md) |
| Random SKU | [../random-sku/requirement.md](../random-sku/requirement.md) |
| Benchmark COGS | [../accounting-product-benchmark-price/requirement.md](../accounting-product-benchmark-price/requirement.md) |
| Stock Remapping | [../accounting-stock-remapping/requirement.md](../accounting-stock-remapping/requirement.md) — remap variant 1 parent (FA) |
