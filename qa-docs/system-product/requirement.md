---
doc_type: requirement
menu: system-product
menu_name: "System Product"
version: 2.9
last_updated: 2026-11-09
owner: QA - Yemima
status: review
aliases: [product bundle tax, bundle parent tax hide, bundle pricing proportion, Price Before VAT bundle, coefficient tax bundle, Import Product Images, Google Drive product image, Product Image Sync, product_sync_url, Sync Product Images, Master Variant Default, Set as Default System Product, SKU-(PARENT), leftover variant, Status Restock, Unable to delete Product already has existing relations, Update Variant Product]
---

# System Product — Requirement Documentation

**Modul:** Supply Chain Management (SCM) / Master Data  
**Audience:** PM, Operations, QA, Support, Developer  
**Status:** AS-IS re-verified against codebase per 2026-11-09 (GAP audit — SoT `olshoperp/docs/qa-docs`); leftover residual [ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215) dicatat 2026-11-09

**UI route (full):** `/supplychain/product`  
**API base (full):** `{VITE_API_URL}supplychain/product`  
**Table:** `scm_products` (+ trees, units, D&W profiles, specs, taxes, BoM)

**PM sources:** User requirement (chat) · D&W artifact v1.0 (7 Mei 2026)

> **Changelog 2.9 (2026-11-09 10:30 WIB):** §6.3.2 + GAP-SP-18 residual — UI expand leftover diblok `Unable to delete…` ([ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215)); **Import Update Variant Product tidak** dikembangkan leftover (tetap boleh tolak tipe beda + child berelasi).  
> **Changelog 2.8 (2026-11-09):** §13.0 AS-IS [ETM-17180](https://erpintegration.atlassian.net/browse/ETM-17180) — tombol **Import** terkunci per company selama import lain masih jalan (disabled + spinner + label).  
> **Changelog 2.7 (2026-11-05):** §4.4 + §2.1 [ETM-17082](https://erpintegration.atlassian.net/browse/ETM-17082) **Status Restock** Yes/No. Tags request di-skip.  
> **Changelog 2.6 (2026-10-21):** §5.4 [ETM-16668](https://erpintegration.atlassian.net/browse/ETM-16668): ubah DnW **default** → auto-recalc Pricelist/Category weight + Log Pricelist.  
> **Changelog 2.5 (2026-10-02):** §11.6–§11.7 Retail Price untuk Random di breakdown bundle — [ETM-16216](https://erpintegration.atlassian.net/browse/ETM-16216).

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.9 | 2026-11-09 10:30 WIB | QA - Yemima | Leftover residual UI [ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215); import Update Variant **out of scope** leftover; GAP-SP-18 → Partial Open |
| 2.8 | 2026-11-09 | QA - Yemima | §13.0 kunci import bersamaan per company (ETM-17180); AC #15 |
| 2.7 | 2026-11-05 | QA - Yemima | §4.4 / §2.1 Status Restock (ETM-17082); tags request di-skip (sudah AS-IS) |
| 2.6 | 2026-10-21 | QA - Yemima | §5.4 TO-BE ETM-16668: save/ganti default DnW → sync weight ke Pricelist/Category + log |
| 2.5 | 2026-10-02 | QA - Yemima | §11.6–§11.7 Retail Price untuk random di breakdown bundle; before/after processing; vs Benchmark COGS — ETM-16216 |
| 1.0–1.2 | 2026-01–07 | QA - Yemima | Initial draft from legacy + partial PM |
| 2.0 | 2026-07-05 | QA - Yemima | Full rewrite: codebase AS-IS, D&W per unit canonical, bundle/random/import detail, gaps §19–§21 |
| 2.1 | 2026-07-05 | QA - Yemima | §6.4 tax hide bundle parent · §11 proporsi harga bundle TO-BE (Price Before VAT, coefficient) · GAP-SP-12/P-SP-02 resolved |
| 2.2 | 2026-08-11 | QA - Yemima | §13.1 **Import Product Images** (GDrive public URL, primary replace, max 1000, partial success) · GAP-SP-16 |
| 2.2b | 2026-08-12 | QA - Yemima | Cross-ref **Master Variant** Default (`GAP-VAR-01`); konsumen create/import SP masih pending (GAP-SP-17 placeholder) |
| 2.3 | 2026-08-12 | QA - Yemima | §6.3.1–§6.3.2 Default create/import + expand soft-delete/leftover (`GAP-SP-17`/`GAP-SP-18`); parent `-(PARENT)`; no auto-rename |
| 2.3b | 2026-08-12 | QA - Yemima | Cross-ref MV major: create+Default ON skips `random` inject (MV v1.2 / GAP-VAR-01) |
| 2.4 | 2026-09-01 | QA - Yemima | §2.3 tombol **Sync Product Images** · §13.2 **Product Image Sync** (pull path via API eksternal, `is_synced`) · AC #14 |
| 2.4b | 2026-09-23 | QA - Yemima | Cross-ref binding SKU sanitize MPP (GAP-MPP-01 / ETM-16016) |

---

## 1. Ringkasan Eksekutif

**System Product** adalah master data **SKU** utama — menyimpan identitas produk, satuan, dimensi/berat per unit, variant, bundle, flag inventori, pajak, dan parameter pengiriman. Bukan hanya data statis: logika stok, transactability, dan distribusi harga bundle dihitung runtime.

| Kebutuhan Bisnis | Bagaimana System Product Menjawab |
|------------------|-----------------------------------|
| Multi-tipe SKU | Single, Variant (parent/child), Bundle |
| Stok multi-gudang | Availability, On Hand, ATS per SKU (bundle = lowest denominator) |
| Satuan & konversi | Primary + alternate unit; D&W **per unit** |
| Penjualan marketplace | Platform binding di [Manage Platform Product](../manage-platform-product/README.md); D&W Platform Default. **Match Auto/Bulk:** TO-BE sanitize compare-time di MPP (GAP-MPP-01 / ETM-16016) — **tidak** mengubah SKU System Product |
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
| **Status Restock** (**AS-IS** ETM-17082) | **Yes** / **No** — di dekat / di bawah informasi Active; Advanced Filter Yes/No |
| **Availability / On Hand / ATS** | Tiga angka stacked; cache 1 menit per product |
| **Data Owner** | Public/Private badge, company name, Created/Updated `d-m-Y H:i:s`, Creator |

**Tooltip harga:** ditampilkan untuk Single & Variant child; parent tetap bisa render `product.price` jika terisi.

**Hidden SearchBuilder:** SKU, Name, Primary Unit, Price, Type, Bundle, Active, **Status Restock** (AS-IS), **BOM** (Header BoM `is_bom=1` — terpisah dari bundle), stock columns terpisah, timestamps.

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
| **Sync Product Images** | Privilege **create** (sama visibility dengan tombol Create) · tarik path gambar dari API eksternal — lihat §13.2 |
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
| **Tagging** | Optional; auto-create by name jika belum ada (AS-IS — sudah ada di form & muncul di Pricelist) |
| **Product Condition** | Required: `Brand New` atau `Second-hand` |
| **Status Restock** (**AS-IS** ETM-17082) | Radio **Yes** / **No**; UI di bawah Product Condition — lihat §4.4 |
| **Brand** | Nullable — **tidak ada default dari config Shopee** (GAP-SP-02) |
| **Random in SKU** | Ditolak: `"Random sku is not allowed"` |

### 4.2 Default on create (backend)

| Default | Nilai |
|---------|-------|
| Insurance type | `optional` |
| Product image | Placeholder default upload |
| D&W profile | 1×1×1×1 cm/g pada primary unit |
| Tax rows | Seed dari company `DefaultVat` (sales + purchase) |
| **Status Restock** (**AS-IS**) | **Yes** — manual create, import, create Header BOM |

### 4.3 Primary unit default "Pieces"

FE auto-select unit bernama **Pieces** dari select2 (heuristic), bukan flag `is_default_primary_unit` dari Master Unit API.

### 4.4 Status Restock — AS-IS ([ETM-17082](https://erpintegration.atlassian.net/browse/ETM-17082) Done)

| ID | Kriteria | Status |
|----|----------|--------|
| SP-RS-01 | Field **Status Restock** radio **Yes** / **No** di **Basic Information**, di bawah **Product Condition** | **AS-IS** |
| SP-RS-02 | Default **Yes** pada create: form manual, **import**, dan create via **Header BOM** (`is_restock` default 1 di `ProductController@store`) | **AS-IS** |
| SP-RS-03 | Kolom **Status Restock** di datalist dekat / di bawah informasi **Active** | **AS-IS** |
| SP-RS-04 | Difilter (Advanced Filter Yes/No) + SearchBuilder `status_restock_formatted` | **AS-IS** |
| SP-RS-05 | Edit Yes↔No tersimpan; datalist & filter mengikuti nilai tersimpan | **AS-IS** |
| SP-RS-06 | Data existing tanpa nilai → treat sebagai **Yes** (`?? 1`) | **AS-IS** |

> Teks request “difungsikan Field tags” **di-skip** (2026-11-05): Tagging sudah tersedia AS-IS di System Product dan tampil di Pricelist — bukan gap / bukan pekerjaan ETM-17082.

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
| Scope `checkTransaction()` | PR, PO, BoM, inbound, outbound, **SO**, **Transfer**, **Work Order** (FG + BoM), **Platform binding** — AS-IS (GAP-SP-11 **Closed** 2026-11-09) |

### 5.3 Alternate Unit

| Kondisi | Edit unit | Edit konversi | Hapus | Tambah baru |
|---------|-----------|-----------------|-------|-------------|
| Sudah dipakai transaksi | ❌ | ❌ | ❌ | ✅ |
| Belum dipakai | ✅ | ✅ | ✅ | ✅ |

- Filter unit: same unit class dengan primary (`/{stock_unit_id}/select2-unit`)  
- Base unit rate harus = 1; alternate ≠ primary  
- **Qty conversion field:** FE `:disabled="rate_disabled \|\| …"` — bila rate master unit **NULL**, field bisa diedit (GAP-SP-14 **Closed** 2026-11-09; bukan hard-disable permanen)

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

**Default values D&W baru:** L=W=H=Weight=**1**; label dari master yang `Set as Primary` ON (artifact AC6). UI min weight **1** (0 hampir tidak terjadi); weight 0/kosong tetap = **No weight** di Pricelist (untuk TC).

#### Side effect → Pricelist / Category Price (AS-IS · [ETM-16668](https://erpintegration.atlassian.net/browse/ETM-16668) Done)

Setelah **save** perubahan Dimensions & Weight:

| Perubahan | Efek ke Pricelist / Category (nilai by Weight) |
|-----------|--------------------------------------------------|
| Edit baris DnW yang sedang **default** (sumber primary weight Pricelist) | Auto-recalc Weight + margin + final; **Log Pricelist** wajib |
| Ganti radio **default** ke baris DnW lain | Pakai data DnW default baru → recalc + log |
| Edit baris DnW **non-default** saja | **Tidak** memicu recalc |

Hitung memakai **tier Category Price terkini**. Nilai Category / Pricelist yang diinput **manual** tidak tertimpa. Detail: [Pricelist §5.1](../businessdevelopment-pricelist-product/requirement.md).

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
| Master source | [Master Variant / Variant Group](../supplychain-variant/requirement.md) |

#### 6.3.1 AS-IS — Default Variant on create / import (`GAP-SP-17` Closed · ETM-15512 Done)

Prasyarat: [Master Variant GAP-VAR-01](../supplychain-variant/requirement.md#6-to-be--set-as-default-system-product-gap-var-01)  
(Master Default ON hanya valid dengan **tepat 1 opsi**; create master + Default ON **tidak** inject `random` — lihat MV §6.2).

**Manual create** saat ada tepat satu Master Variant Default ON:

| Role | SKU |
|------|-----|
| Parent | `{userSku}-(PARENT)` — literal suffix `-(PARENT)` |
| Child | `{userSku}` (opsi = nama opsi di master Default; **tanpa** suffix opsi di kode) |

- Auto **Enable Variations ON** + attach Default group + 1 opsi.
- User **boleh OFF** Enable Variations → jadi **Single** — **wajib confirmation popup**.
- Section di bawah toggle: Default group **tetap tampil** (sementara).
- Datatable variant: kolom dynamic Default group **`visible: false`** (fase 1 UI only).
- Default group **menghitung** ke max **3** variant types.
- Bundle: create lewat Default → header bundle sudah Variant (bukan Single dulu).

**Import create** saat Default ON:

| Kondisi row | Behavior |
|-------------|----------|
| Kandidat **Single** (no parent; tidak membentuk variant eksplisit) | Terapkan sama create (`-(PARENT)` + child) |
| Sudah isi variant group & option | **Skip** auto-default |
| SKU dipakai sebagai **Parent** di row lain | **Skip** auto-default |
| Semua Default OFF di master | Single tetap mungkin |

#### 6.3.2 AS-IS (intended) — Expand Variant Groups: soft delete vs leftover (`GAP-SP-18` Partial · ETM-15495 / ETM-15512 Done · residual [ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215))

Hard-block `Cannot add variant, Product already have relations` **sudah dicabut** (dikomentari). Jalur intended UI: FE kirim `check_leftover=1` → BE `has_leftover` → **confirmation popup** → soft-delete vs leftover. **Tidak ada auto-rename.**

| Child lama | Soft delete obsolete? | Generate kombinasi baru | Hasil |
|------------|------------------------|-------------------------|--------|
| **Zero relation** | **Ya** | Ya (SKU/ID baru) | Bersih |
| **Punya relasi** (stok **bukan** syarat; relasi saja cukup) | **Tidak** | Ya — **semua** kombinasi baru | Leftover Active under same parent + SKU baru |

Relasi pengunci soft delete (minimal): PR, PO, inbound, outbound, transfer, SO, WO, platform binding, **BOM header & detail**, **bundle header & detail** (+ existing `haveRelations`).

**Leftover:** tetap Active child di bawah parent yang sama; user boleh Inactive jika memenuhi rule inactive existing; rename manual OK; stok remap manual (Stock Remapping).

**Naming Default-origin:** SKU baru **omit** segment opsi Default  
→ `SKUPENSIL-biru-pikacu` bukan `SKUPENSIL-{defaultOpt}-biru-pikacu`.

**Contoh leftover (Default → Warna+Motif, child berelasi):**

```text
SKUPENSIL                 ← leftover
SKUPENSIL-biru-doraemon   ← new
SKUPENSIL-hijau-doraemon  ← new
SKUPENSIL-biru-pikacu     ← new
SKUPENSIL-hijau-pikacu    ← new
```

**Residual UI (Open — [ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215), bukti Merdian/WNA `KACALOS-(PARENT)` 2026-11):**  
Saat **Save All** menambah variant type/group baru sedangkan child lama sudah berelasi, sistem sering menampilkan `Unable to delete, Product already has existing relations.`, **popup leftover tidak muncul**, perubahan **tidak tersimpan**. Guard “jangan hapus opsi berelasi” berjalan **sebelum** precheck leftover — expand tertahan. **Expected fix (UI only):** expand + child berelasi → popup leftover → simpan sukses (bukan error delete).

**Import Update Variant Product — OUT OF SCOPE leftover (keputusan 2026-11-09):**  
Import **tidak** dikembangkan untuk leftover. Jika child berelasi dan tipe/group baru **berbeda** dari existing, import **boleh tetap menolak** (`Cannot add variant options because variant types don't match…`). Operator menambah tipe baru lewat **edit UI** setelah ETM-17215 fixed. Pesan import lebih jelas (arahkan ke UI) = opsional, card terpisah.

**Known residual lain:** rename SKU AS-IS mixed (SO `detail_sku_name` bisa tetap string lama) — bukan cascade rewrite di scope ini.

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
| BP-06 | Child **random** memakai **Retail Price** variant random (bukan Benchmark COGS) — §11.6 |
| BP-07 | Setelah Send to Default Waves / processing: reprice memakai detail **SKU asli**, bukan rebuild dari BOM random — §11.7 |

### 11.6 Random SKU di breakdown bundle — Retail Price (TO-BE · ETM-16216)

Variant **random** di System Product **punya field Retail Price** (sama seperti variant lain). Order internal: add single SKU random → default Price = retail random itu.

**TO-BE proporsi bundle (konsisten bundle & non-bundle):**

| Komponen child | Basis angka untuk % proporsi |
|----------------|------------------------------|
| Single / variant biasa | **Retail Price** produk → Price Before VAT (§11.2) |
| **Random** | **Retail Price SKU random itu sendiri** → Price Before VAT — **bukan** Benchmark COGS |

**AS-IS gap:** `pickBundleChildren()` memakai `benchmarkPrice` jika `$is_random` — **salah tujuan**. Harus diganti ke `product->price` (retail), sama dengan child non-random. Jira: [ETM-16216](https://erpintegration.atlassian.net/browse/ETM-16216).

#### Breakdown harga jual ≠ Benchmark COGS

| | Breakdown harga bundle | Benchmark COGS |
|--|------------------------|----------------|
| **Tujuan** | Bagi harga **jual** header paket ke isi agar ketahuan porsi naik/turun vs retail eceran | Patokan **HPP** / cek margin (prevent auto-approve) |
| **Sumber angka** | Retail Price master (termasuk retail random) | Level transactional; random → **COGS sibling tertinggi** |
| **Boleh dicampur?** | **Tidak** — jangan pakai Benchmark sebagai input proporsi jual | Logic sibling tertinggi **tetap** untuk HPP saja |

Order **platform single** (bukan bundle): harga baris **wajib dari platform** — retail master tidak dipakai sebagai harga jual (binding hanya menyambung SKU).

### 11.7 Sebelum vs sesudah processing (reprice / late price)

Saat **Send to Default Waves** / fulfillment: child random diganti **SKU asli** (sibling stok tertinggi) — lihat [random-sku](../random-sku/requirement.md).

| Kondisi order | Isi detail child | Saat harga header sudah ada / baru datang |
|---------------|------------------|-------------------------------------------|
| **Belum processing** | Masih bisa SKU **random** | Breakdown pakai **retail price random** (+ retail child lain). Update harga = **edit in-place** pada baris yang sama — [ETM-16212](https://erpintegration.atlassian.net/browse/ETM-16212) / [Sales Platform](../omni-sales-platform/requirement.md) |
| **Sudah processing** | Random sudah diganti **SKU asli** | Reprice **wajib** memakai detail **final** di order (SKU asli). **Jangan** recreate dari template BOM random |

**Konsistensi sampai invoicing:** kalau dari awal header sudah dapat harga dan sudah di-breakdown → pecahan detail harus **tetap konsisten** sampai invoice/settlement (jangan berubah karena rebuild / ganti basis).

**Booking Shopee (harga header sering belakangan):** saat escrow/harga platform akhirnya masuk **setelah** order sudah di processing → alokasi ke detail **final** yang sudah ada (SKU asli pasca-wave), bukan seolah child masih random. Detail: [omni-sales-platform](../omni-sales-platform/requirement.md).

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

**Menu full only** · Progress: `GET .../progress`

| Tipe import | Max rows | Endpoint / template |
|-------------|----------|---------------------|
| New Product | **5000** | `GET .../download-template` → `ProductImport` |
| Update Product | **5000** | `download-template-update` → `UpdateProductImport` |
| Product Bundle | **5000** | `supplychain/bill-of-material-header/import` |
| Insert Random | **5000** | variant random template → `InsertProductRandomImport` |
| Alternative Unit | **5000** | static xlsx `/files/` |
| Update Variant Product | **5000** | static xlsx · **AS-IS:** tolak expand tipe beda jika child berelasi (`variant types don't match`). **Bukan** leftover — keputusan 2026-11-09 / §6.3.2 |
| Bulk Update VAT | **5000** | static xlsx |
| **Import Product Images** (AS-IS) | **1000** | template `Template Import Product Images.xlsx` · `ProductImageImport` + `ProductImageImportJob` |

**SKU on import:** consistently scoped `where('sku')->where('owned_by', $company_id)`.

Logs: `import-log`, `import-history`.

### 13.0 Kunci import bersamaan per company (ETM-17180)

Satu company hanya satu import produk yang masih berjalan. Kunci ini mengikuti company, jadi User 2 di company yang sama ikut terkunci; company lain tidak terpengaruh.

| Perilaku | Rule |
|----------|------|
| Tombol **Import** | Selama import lain di company yang sama masih aktif, tombol di layar User 2 **disabled** (`cursor-not-allowed`). Upload tidak bisa dimulai dari tombol itu |
| Label | Spinner + status tahapan yang sedang berjalan: **Import on Queue...**, **Importing... X%**, atau **Importing...** |
| Cegah bentrok | User 2 ditolak sejak awal (tidak memilih file), supaya tidak ada benturan data |
| Safety net | Jika upload **New Product** tetap terkirim, sistem menolak. Pesan memuat `Please wait, other import is being process` |
| Known limitation | Status dicek saat menu dibuka atau panel Import dibuka. Tidak ada pembaruan live selama panel dibiarkan diam. **Bukan TO-BE** — penolakan backend tetap jaring pengaman |

**Contoh:** User 1 sedang import New Product. User 2 membuka System Product di company yang sama → tombol Import terkunci + spinner. User 2 tidak bisa mengunggah sampai import User 1 selesai.

### 13.1 Import Product Images (AS-IS · GAP-SP-16 Closed · ETM-15529 Done)

**Entry:** opsi baru di dropdown **Import** existing (bukan tombol terpisah) · label **Import Product Images**.

| Item | Rule |
|------|------|
| Template | `Template Import Product Images.xlsx` |
| Kolom (required, header **merah**) | **SKU Code** · **Image URL** |
| Sumber URL | **Google Drive publik saja** (`Anyone with the link` / Viewer). Non-GDrive ditolak. |
| Cardinality | 1 baris = 1 SKU = 1 image URL |
| Replace | Hanya gambar **default/primary**; foto non-primary di gallery **tetap**. Belum ada primary → image baru jadi primary. |
| Parent / Single / Bundle / Random | Masuk section gambar **Product Details** → jadi default |
| Variant child | Masuk gambar **variant** tersebut → jadi default variant |
| Duplicate SKU in file | Semua baris dengan SKU yang muncul >1× **ditolak**; SKU unik tetap diproses (**partial success**) |
| Format | JPG / JPEG / PNG |
| Max size | Sama validasi foto existing UI → **20 MB** |
| Dimensi 300×300 | **Recommended only** — tidak di-enforce (selaras BE manual / GAP-SP-05) |
| Max rows | **1.000** / file (lebih ketat dari import product lain karena download GDrive) |
| Queue | Dedicated / throttled job (delay antar download) agar tidak menekan import menu lain |
| Partial success | Baris valid commit; gagal tercatat di import log |

**Contoh template**

| SKU Code | Image URL |
|----------|-----------|
| SKU-PARENT-001 | `https://drive.google.com/uc?export=download&id=…` |
| SKU-PARENT-001-RED | `https://drive.google.com/file/d/…/view?usp=sharing` |

**Pesan error (English, approved)**

| Case | Message |
|------|---------|
| Not GDrive | `Only public Google Drive image URLs are supported. Please use a Google Drive link.` |
| Unpublic | `The Google Drive file is not publicly accessible. Open the file in Google Drive → Share → set General access to Anyone with the link (Viewer), then try again.` |
| Download fail | `Failed to download the image from Google Drive. Check that the file still exists and sharing is set to Anyone with the link.` |
| Bad format | `The downloaded file is not a supported image format. Use JPG, JPEG, or PNG.` |
| Oversize | `The image exceeds the 20 MB size limit. Reduce the file size and try again.` |
| SKU missing | `SKU Code '{sku}' was not found for this company.` |
| Duplicate in file | `SKU Code '{sku}' appears more than once in this file. All rows for this SKU were skipped. Keep only one row per SKU.` |
| Required empty | `SKU Code and Image URL are required.` |
| >1000 rows | `Import Product Images allows a maximum of 1,000 rows per file.` |

**Out of scope v1:** non-GDrive URL · multi-image per SKU · video · clear seluruh gallery · enforce dimensi.

### 13.2 Product Image Sync (AS-IS — API pull)

Fitur terpisah dari **Import Product Images** (§13.1). Menarik **path storage** gambar produk dari **API eksternal** (biasanya instance OlshopERP lain) ke company aktif. **Bukan** unduh/upload file binary; **bukan** sync marketplace (Omni `omni_product_sync_*`).

**Konfigurasi (wajib sebelum sync):** General Setting → Application → **Product Image Sync Setting** (per company, tabel `scm_settings`):

| Field | Rule |
|-------|------|
| **Product Sync API URL** | URL valid (`product_sync_url`) — target POST yang menerima body `{ product_ids: [sku, ...] }` |
| **Product Sync API Key** | Bearer token (`product_sync_api_key`) — disimpan per company; UI password kosong setelah save |

**Trigger UI:** datalist System Product full → tombol **Sync Product Images** (`DatalistProductComponent.vue`). Label loading: **Syncing...**

**API (company context login):**

| Method | Path | Handler |
|--------|------|---------|
| POST | `/api/supplychain/product/sync-images` | Queue job; error jika URL/key kosong: *Product sync URL and API key must be configured first.* |
| GET | `/api/supplychain/product/sync-images/status` | Status dari cache: `queued` → `running` → `completed` \| `failed` + `message` |

FE poll status setiap **2 detik** sampai `completed` atau `failed`; toast menampilkan `message`.

**Eksekusi background:** `SyncProductImageJob` · queue **`platform_product`** · Horizon wajib jalan.

| Step | Rule |
|------|------|
| Scope produk | Semua produk **active** (`status=true`) milik **company login** |
| Chunk | **100 SKU** per request HTTP ke API eksternal |
| Request body | `{ "product_ids": ["SKU-A", "SKU-B", ...] }` — identitas **SKU**, bukan numeric id |
| Auth ke API eksternal | Header `Authorization: Bearer {product_sync_api_key}` |
| Response expected | JSON `data.products[]` per SKU: `images[]` (`image_path`), opsional `variant_images[]` (`image_path`, `variant_sku`) |
| SKU tidak ada di response | Produk **dilewati** (silent skip) |
| HTTP error | Job **failed** seluruhnya (401/403 → pesan API key; 404/405 → URL invalid) |

**Kontrak provider OlshopERP (referensi implementasi):** `POST /api/supplychain/external-products/sync` · Sanctum ability **`external-product:read`** · token global (`php artisan token:external-product`). Endpoint ini **read-only** — mengembalikan path gambar dari DB sumber by SKU.

**Persist ke DB (consumer company):**

| Tipe produk | Tabel | Scope row |
|-------------|-------|-----------|
| Single / parent / bundle header | `scm_product_images` | `product_id` = produk ini |
| Variant child | `scm_product_variant_images` | `product_id` = **parent**, `variant_id` + `option_id` dari variant child |

| Rule | Detail |
|------|--------|
| Flag **`is_synced=true`** | Hanya baris sync yang di-create/update/soft-delete oleh job |
| Gambar upload manual | Baris **`is_synced=false`** **tidak** ikut query sync → **tidak ditimpa / tidak dihapus** |
| Placeholder | Path mengandung `no-image`, `defaultimagessystemproduct`, `placeholder`, `img-not-found` → **diabaikan** |
| Merge | URL baru → reuse row synced stale (update `image`) atau create baru; synced lama tidak ada di sumber → soft-delete |
| Primary | Create sync set **`is_primary=false`** — tidak ada logic set primary otomatis dari sync |
| Variant | Selain `images` parent, job merge `variant_images` where `variant_sku` = SKU variant child |

**Prasyarat operasional (implikasi teknis):** path relatif (mis. `production/uploads/product/img/...`) ditampilkan lewat `render-file` di **environment consumer**. File fisik harus **terbaca** di storage consumer (typical: **shared bucket** antar env/company). Sync path saja **tanpa** shared storage → thumbnail bisa broken.

**Bisa / tidak bisa:**

| Bisa | Tidak bisa (AS-IS) |
|------|---------------------|
| Pull path multi-gambar per SKU dari API | Push gambar ke API eksternal |
| Overwrite/hapus hanya baris `is_synced=true` | Menimpa gambar manual operator |
| Sync parent + variant (via `variant_images`) | Sync produk **inactive** |
| Konfigurasi berbeda per company | Sync terjadwal otomatis (hanya manual via tombol) |
| Full scan semua produk aktif per klik | Resume per-chunk jika satu chunk HTTP gagal (seluruh job failed) |

**Bedakan fitur gambar lain:**

| Fitur | Metode |
|-------|--------|
| Upload manual (Product Details → Photos) | File binary → storage |
| Import Product Images (§13.1 AS-IS) | Excel + GDrive → replace primary |
| **Product Image Sync (§13.2 AS-IS)** | API pull path by SKU |

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
13. **Import Product Images:** GDrive public → replace primary only; duplicate SKU rows rejected; max 1000; partial success
14. **Product Image Sync:** URL+key terisi → tombol sync job → status `completed`; baris `is_synced=true` mengikuti response API; gambar manual (`is_synced=false`) tetap
15. **Kunci import bersamaan (ETM-17180):** import lain di company yang sama masih aktif, lalu User 2 membuka menu atau panel Import → tombol Import disabled (`cursor-not-allowed`) + spinner + label **Import on Queue...** / **Importing... X%** / **Importing...**; User 2 tidak bisa mulai upload. Panel yang dibiarkan diam tidak memperbarui label sendiri (known limitation, bukan TO-BE)

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

> **Audit 2026-11-09** — sumber: tip `olshoperp` (`ProductController`, `ProductSpecificationController`, `ProductVariantController`, `ProductDetailController`, `ProductImageImport`, FE `SCM/master/Product`, `manifest.yaml`). Mirror docs **bukan** sumber.

### 19.0 Ringkas status

| Bucket | ID |
|--------|----|
| **Open** (masih gap nyata) | GAP-SP-01, 02, 04, 05, 06, 07, 08, 09, **18** (residual UI leftover) |
| **Closed 2026-11-09** (kode/docs sudah selaras) | GAP-SP-11, 13, 14, 15, 16, 17 |
| **Confirmed OK / by design** | GAP-SP-03, 10, 12 (basis Price Before VAT + `->price`; residual UI/ETM-16216 di bawah). Import Update Variant **tanpa** leftover = **by design** (bukan gap aktif) |

### 19.1 Tabel — masih Open

| ID | Topik | Ekspektasi PM/Artifact | AS-IS (2026-11-09) | Status |
|----|-------|------------------------|--------------------|--------|
| **GAP-SP-01** | SKU unique per owner | Unique dalam `owned_by` | UI create (`$with_auth=true`): `Product::where('sku')` **tanpa** `owned_by`. Import/`!$with_auth` sudah scoped company | **Bug — Open** |
| **GAP-SP-02** | Brand default Shopee | Default dari config | `brand_id` nullable; tidak ada default config | **Not implemented — Open** |
| **GAP-SP-04** | Video format | FE copy: mkv + mp4 | BE `mimes:mp4,mov` (`ProductDetailController`) | **Mismatch FE/BE — Open** |
| **GAP-SP-05** | Photo min 300×300 | Enforced | UI text recommended only; BE tidak validasi dimensi | **Not enforced — Open** |
| **GAP-SP-06** | Variant max 3 types | Enforced end-to-end | FE tampilkan add jika `Object.keys(variant_options).length <= 2`; **BE tidak** validasi max 3 | **Partial — Open** |
| **GAP-SP-07** | Warranty policy max 30 | Max 30 chars | Tidak ada `max:30` di store/update | **Not implemented — Open** |
| **GAP-SP-08** | Parent stock datalist | Tooltip: parent tampil `-` | BE `availability_on_hand_ats_formatted` selalu numerik untuk semua tipe termasuk PARENT | **UI expectation gap — Open** |
| **GAP-SP-09** | All D&W table + summary | Artifact AC3–AC4 di main form | Hanya modal Edit Unit per primary/alternate | **Partial — Open** |
| **GAP-SP-18** | Expand leftover (UI) | Expand + child berelasi → confirm leftover → simpan (ETM-15495) | Path leftover ada, tetapi Save All tambah type/group sering error `Unable to delete, Product already has existing relations.` — popup tidak muncul ([ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215); bukti WNA/`KACALOS`). Import Update Variant **tidak** di-scope leftover | **Partial — Open residual** |

### 19.2 Tabel — Closed / OK (audit 2026-11-09)

| ID | Topik | Keputusan / bukti kode | Status |
|----|-------|------------------------|--------|
| **GAP-SP-03** | Bundle qty wording | AS-IS qty **> 1** (≥2) — accepted | **OK** |
| **GAP-SP-10** | BOM pada form SP | BoM menu terpisah — by design | **OK** |
| **GAP-SP-11** | Transaction lock scope | `checkTransaction()` sekarang cek PR, PO, BoM, inbound, outbound, **SO**, **Transfer**, **WO** (FG+BoM), **ProductBinding** | **Closed** |
| **GAP-SP-12** | Bundle pricing basis | `SalesOrderDetailController::pickBundleChildren` pakai `$child_product->price` + jalur Price Before VAT. Residual: coefficient/DPP UI + card [ETM-16216](https://erpintegration.atlassian.net/browse/ETM-16216) (RE-OPEN) bila path lain masih Benchmark | **Basis OK — residual monitor** |
| **GAP-SP-13** | manifest `code_globs` | Sudah `olshoperp-frontend/src/pages/SCM/master/Product/**/*` | **Closed** |
| **GAP-SP-14** | Qty conversion manual | FE `rate_disabled` kondisional; master rate NULL → bisa edit (bukan hard `disabled=true`) | **Closed** |
| **GAP-SP-15** | Route menu | Docs/README sudah `/supplychain/product` | **Closed** |
| **GAP-SP-16** | Import Product Images | `PRODUCT_IMPORT_OPTIONS` + `ProductImageImport` (max 1000) + job; ETM-15529 Done | **Closed → AS-IS §13.1** |
| **GAP-SP-17** | Default Variant create/import | `ProductController@store` + Default Variant → `SKU-(PARENT)` + child; ETM-15512 Done | **Closed → AS-IS §6.3.1** |
| ~~**GAP-SP-18**~~ | Expand leftover | Hard-block dicabut + path leftover di-ship (ETM-15495) — **tapi** residual UI [ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215) → pindah **Open** §19.1 | **Reopened Partial 2026-11-09** |

### 19.3 GAP-SP-09 — D&W UI sections (detail — masih Open)

Artifact (7 Mei 2026) mensyaratkan tiga section: Unit Configuration ✅, **D&W Default Configuration** (summary cards), **All D&W Configurations** (flat editable table). AS-IS: D&W dikelola **hanya** di modal Edit Unit per primary/alternate.

### 19.4 GAP-SP-12 — Bundle pricing (detail)

**Keputusan PM (2026-07-05):** Basis proporsi = **Price Before VAT**. Canonical: `pickBundleChildren()` memakai `$child_product->price` lalu hitung before-VAT.

**Residual QA (bukan reopen basis proporsi):**

| Item | Expected | Cek |
|------|----------|-----|
| Coefficient DPP vs Price Before VAT | Berbeda (÷1.11 vs DPP VAT/12%) | Modal Detail Bundle |
| [ETM-16216](https://erpintegration.atlassian.net/browse/ETM-16216) | Random child = Retail Price di semua path breakdown | Card RE-OPEN — verifikasi path selain `pickBundleChildren` |
| Snapshot setelah approve/sync | Nilai lock | [SO §10.4](../sales-order-general/requirement.md) |

---

## 20. Dev Follow-ups (non-blocking QA) — hanya Open

| ID | Item | File hint |
|----|------|-----------|
| **DEV-SP-01** | Scope SKU unique create ke `owned_by` (atau putuskan global by design) | `ProductController@store` sku closure |
| **DEV-SP-02** | Align video FE copy (mkv) vs BE (`mp4,mov`) | `FormProductComponent.vue`, `ProductDetailController` |
| **DEV-SP-03** | BE validate variant max 3 types | `ProductVariantController@store` |
| **DEV-SP-04** | Implement All D&W table + summary per artifact | `FormProductComponent.vue` |
| **DEV-SP-07** | Photo dimension validation BE (jika PM tetap enforce) | `ProductDetailController@store` |
| **DEV-SP-09** | Warranty policy `max:30` (jika PM tetap enforce) | store/update validation |
| **DEV-SP-10** | Parent stock display `-` vs numeric (selaraskan tooltip FE / BE) | datalist stock column |
| **DEV-SP-11** | UI expand leftover residual — jangan treat tambah group sebagai hapus opsi berelasi; pastikan popup + save ([ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215)) | `ProductSpecificationController` + `FormProductComponent` Save All / `check_leftover` |

~~DEV-SP-05~~ Closed (checkTransaction sudah luas). ~~DEV-SP-06~~ Closed (manifest path OK). ~~DEV-SP-08~~ Closed (rate_disabled kondisional).

---

## 21. Pending Items — Major (diskusi stakeholder)

| ID | Severity | Stakeholder | Pertanyaan | AS-IS impact | Keputusan needed |
|----|----------|-------------|------------|--------------|------------------|
| **P-SP-01** | 🔴 **Highest** | **Dev + QA** | **SKU create unique per Data Owner?** (GAP-SP-01) | UI create masih global; update/import sudah scoped | Fix create **atau** dokumentasikan global unique by design |
| **P-SP-02** | 🟢 **Resolved** | **PM** | Bundle pricing Price Before VAT (GAP-SP-12) | `pickBundleChildren` pakai retail `price` | Monitor ETM-16216 + coefficient UI |
| **P-SP-03** | 🔴 **Major** | **PM + Dev** | Deploy All D&W + summary cards? (GAP-SP-09) | Modal-only | Prioritas implement vs accept modal-only |
| **P-SP-04** | 🟡 Medium | **Ops** | Brand default Shopee (GAP-SP-02) | Manual pilih brand | Perlu default config? |
| **P-SP-06** | 🟡 Medium | **End user** | Parent stok tampil `-`? (GAP-SP-08) | Tooltip janji `-`; BE numerik | Override FE atau ubah tooltip |
| **P-SP-08** | 🟡 Medium | **Dev** | Align video mime FE/BE (GAP-SP-04) | FE sebut mkv; BE mp4/mov | Samakan copy atau terima mov |
| **P-SP-09** | 🟢 Low | **PM** | Enforce photo 300×300 & warranty max 30? (GAP-SP-05/07) | Recommended / unbounded | Enforce BE atau ubah PM ke soft rule |
| **P-SP-10** | 🔴 **Highest** | **Dev + QA** | UI leftover expand residual (GAP-SP-18 / [ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215)) | Save All tambah type + child berelasi → `Unable to delete…`, data tidak simpan | Fix UI leftover; **jangan** kerjakan leftover di Import Update Variant sekarang |

**Closed dari pending (audit 2026-11-09):**

- **P-SP-05** (GAP-SP-11) — `checkTransaction` sudah mencakup SO/Transfer/WO/binding  
- **P-SP-07** (GAP-SP-16) — Import Product Images sudah live  

**Confirmed OK / keputusan scope:**

- **GAP-SP-03** — Bundle qty ≥2 ✓  
- **GAP-SP-10** — BoM menu terpisah ✓  
- **GAP-SP-17** — Default Variant create/import ✓  
- **GAP-SP-18** — leftover path **di-ship**, residual UI **Open** (ETM-17215); Import Update Variant **tanpa** leftover = **by design** (2026-11-09)  
- **D&W moved from Shipping** ✓  
- **Status Restock** (ETM-17082) ✓  
- **DnW default → Pricelist** (ETM-16668) ✓  

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
