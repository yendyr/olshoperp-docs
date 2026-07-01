# System Product Requirement

**Modul:** Supply Chain Management (SCM)

**Versi Dokumen:** 1.0

**Tanggal Update:** 26 Januari 2026

---

## 1. Gambaran Umum (Overview)

**System Product** adalah master data utama untuk mengelola informasi produk (SKU). Menu ini tidak hanya menyimpan data statis, tetapi juga mengatur logika bisnis produk seperti Variasi, Bundling, BOM (Rakitan), Konfigurasi Pajak, serta parameter Inventori & Pengiriman.

Secara garis besar, tipe produk yang dapat ditransaksikan dibagi menjadi:

1. **Single Product:** Produk tunggal standar.
2. **Variant Product:** Produk induk (*Parent*) yang memiliki turunan variasi (Child).

---

## 2. Datalist (Halaman Depan)

Menampilkan daftar seluruh SKU yang terdaftar.

| **Kolom** | **Keterangan & Rumus** |
| --- | --- |
| **Images** | Thumbnail produk (Main Image). |
| **SKU Code** | Kode unik produk. |
| **Name** | Nama produk. |
| **Primary Unit** | Satuan utama stok. |
| **Price** | Harga retail standar. |
| **Availability** | Stok fisik yang tersedia untuk digunakan. 
 **Rumus:** `Inbound - Used - All Reserved` |
| **On Hand** | Total stok fisik di gudang (termasuk yang akan dikirim/transfer). 
 **Rumus:** `Inbound - Transfer Out (Approved) - Used - Transfer In (In Transit)` |
| **ATS (Available to Sell)** | Stok bersih yang bisa dijual ke customer. 
 **Rumus:** `On Hand - Outstanding SO - Reserved Out` |
| **Active** | Status aktif produk. |
| **Log Info** | Created By, Created At, Modified At, Data Owner (Internal Company). |

---

## 3. Detail Konfigurasi Produk

### A. Basic Information

- **Product SKU & Name:** Wajib Unique berdasarkan *Data Owner*. (SKU sama diperbolehkan jika Data Owner berbeda).
- **Categories:**
    - *Sales Category:* Dari Master Item Category.
    - *Product COA Group:* Dari Module Finance (menentukan mapping akun jurnal).
    - *Tagging:* Multiple selection dari Master Tagging.
- **Unit Configuration:**
    - *Primary Unit:* Satuan dasar stok. **Lock Logic:** Tidak bisa diganti jika SKU sudah memiliki relasi transaksi.
    - *Alternate Unit:* Satuan konversi (misal: 1 Box = 10 Pcs).
    - *Qty Field:* Disabled/Auto-calc jika konversi sudah ada di Master Unit. Manual input jika konversi belum ada.

### B. Variant Configuration (Logic Parent-Child)

Jika **Toggle 'Enable Variations' ON**:

- User memilih *Variant Type* (Warna, Size) dan *Option* (Merah, L, XL).
- **Auto-Generate SKU:** Sistem otomatis membuat SKU Child baru dengan format `Prefix Parent + Option`.
- **Transactable Logic:** Hanya SKU Child (Variant) yang bisa ditransaksikan dan memiliki stok. SKU Parent hanya sebagai pembungkus data.

### C. Product Bundle Configuration (Logic Bundling)

Jika **Toggle 'Set as Product Bundle' ON**:

**1. Struktur Bundle:**

- **Bundle Single:** Header bertipe Single. User menginput resep/komposisi item di satu section.
- **Bundle Variant:** Header bertipe Variant. Accordion detail akan terbentuk otomatis sejumlah varian (misal: Bundle A-Merah, Bundle A-Putih). User menginput resep berbeda untuk setiap varian bundle.

**2. Ketentuan Transaksi & Stok:**

- **Scope:** Bundle hanya bisa ditransaksikan di *Sales Order* (General & Platform). Tidak bisa di-Inbound langsung.
- **Availability:** Mengikuti nilai stok terendah (*Lowest Denominator*) dari komponen penyusunnya.
- **Outbound Logic:** Saat barang keluar, yang terpotong stoknya adalah **Komponen Detail**, bukan Header Bundle.

**3. Algoritma Harga Detail (Pricing Distribution)**

Saat Bundle masuk ke Order, harga per item detail dipecah berdasarkan rumus:

> Case A: Item memiliki Retail Price. Distirbusi proporsional berdasarkan selisih harga bundle dengan total harga retail eceran.
> 

$\% Proporsi = \frac{BundlePrice - TotalRetail}{TotalRetail} \times 100\%$

$FinalPriceItem = RetailItem + (RetailItem \times \% Proporsi)$

> Case B: Item tidak memiliki Retail Price (0)
> 
> 
> Harga Bundle dibagi rata dengan jumlah item.
> 
> $FinalPriceItem = \frac{BundlePrice}{TotalItem}$
> 

### D. Inventory Management & BOM

- **BOM (Bill of Material):** Jika `YES`, produk ini adalah Barang Jadi yang bisa diproduksi via menu *Assembly*.
- **Control Features:**
    - *Expired Date (ON/OFF):* Jika ON, wajib input ED saat Inbound.
    - *Serial Number (ON/OFF):* Jika ON, wajib input SN saat Inbound & Outbound.
    - *Batch Number:* Wajib input Batch saat Inbound.
- **Stock Alert:** Setting Minimum Stock (Global atau per Gudang).

### E. Shipping & Processing

- **Dimensions & Weight:** Wajib diisi (Length, Width, Height, Weight). Digunakan untuk validasi kurir.
- **Packing & Checking Std:** Instruksi kerja (SOP) yang diambil dari Master QC Procedure.

### F. Accounting & Tax Setting

Mengatur perilaku perhitungan pajak (PPN) saat transaksi.

**Hierarki Prioritas Pajak (Tax Hierarchy):**

1. **Prioritas 1 (Tertinggi):** Setting pada **General Company** (Supplier/Customer).
    - Jika Company YES → Hitung pajak otomatis (abaikan setting produk).
    - Jika Company NO → Jangan hitung pajak (abaikan setting produk).
2. **Prioritas 2:** Setting pada **System Product** (jika Company = Default).
    - *Auto add trx YES:* Hitung pajak otomatis.
    - *Auto add trx NO:* Manual input pajak.

---

## 4. Validasi & Rules (General Notes)

1. **Unique Constraint:** SKU Code wajib unik dalam satu *Internal Company* (Data Owner).
2. **Immutability (Kekekalan Data):**
    - SKU yang sudah memiliki relasi transaksi **TIDAK BISA DIHAPUS**, hanya bisa di-*Inactive*.
    - Primary Unit **TIDAK BISA DIGANTI** jika sudah ada transaksi.
    - Alternate Unit **TIDAK BISA DIHAPUS** jika sudah digunakan di transaksi.
3. **Inactive Logic:**
    - Syarat Inactive: Total Stock (All Warehouse) wajib **0**.
    - Produk Inactive akan masuk ke fitur *Archive*.