# Test Plan: ETM-15748 — Edit Detail Sales Order Platform Sebelum Approve (All Sales Order)

- **Origin Card:** [ETM-15748](https://erpintegration.atlassian.net/browse/ETM-15748) — `[All Sales Order] Edit detail SO platform sebelum approve (add/replace SKU, price, VAT; no delete)`
- **Pair Card:** [ETM-15749](https://erpintegration.atlassian.net/browse/ETM-15749) — `Dev - Sales Platform`
- **Menu Target:** All Sales Order (`/businessdevelopment/all-sales-order`) / Dev - Sales Platform (`/omni/sales-order`)
- **Request ID:** `recvu2RzIu55hh`
- **Owner / Author:** QA - Yemima

---

## 🎯 Tujuan Pengujian
Memvalidasi fungsionalitas penambahan dan pengubahan baris detail dokumen Sales Order tipe **Platform** pada status **DRAFT / OPEN** sebelum dilakukan Approve (meliputi Add Product, Replace Product, Edit Qty, Edit Unit Price, Edit Discount, Edit VAT, ketiadaan tombol Delete di 3 titik UI, batas 100 row vs ekspansi Extract Bundle, perlindungan Sync Lock bertahap, penandaan `prevent_auto_approve`, dan Audit Trail).

---

## 📋 Matriks & Cakupan Skenario Test Case (Mapping 10 Skenario → 10 TC)

| No | Kode Skenario | Test Type | Judul / Fokus Skenario | Expected Core Behavior |
|:---:|:---|:---:|:---|:---|
| 1 | `SC-ASO-15748-01` | **`happy`** | Penambahan baris produk baru (Add Product) pada SO Platform status DRAFT/OPEN | Tombol/row **Select Product** berfungsi seperti SO General, baris baru murni system product bertambah dan tersimpan sukses. |
| 2 | `SC-ASO-15748-02` | **`happy`** | Penggantian produk sistem (Replace SKU) pada baris item platform existing | System SKU terupdate ke pilihan baru; Platform SKU asli di UI tetap ditampilkan; relasi mapping tersimpan benar. |
| 3 | `SC-ASO-15748-03` | **`happy`** | Edit Unit Price, Discount per item, dan VAT pada baris detail SO Platform | Nilai Unit Price, Disc, dan VAT tersimpan; kalkulasi otomatis DPP, Subtotal, dan Total Order terhitung akurat. |
| 4 | `SC-ASO-15748-04` | **`negative`** | Validasi input Quantity bernilai 0 atau negatif (Qty ≤ 0) | Sistem menolak dengan validasi `gt:0` (*The quantity must be greater than 0*) dan tidak meng-override nilai ke 1 secara diam-diam. |
| 5 | `SC-ASO-15748-05` | **`negative`** | Batas maksimum 100 baris item detail pada dokumen SO Platform via Add Product | Menambahkan baris ke-101 secara manual ditolak oleh sistem sesuai batasan kuota detail dokumen Sales Order. |
| 6 | `SC-ASO-15748-06` | **`edge`** | Ekstraksi SKU Bundle saat dokumen SO Platform sudah mencapai kuota 100 baris detail | Menguji perilaku sistem saat dokumen memiliki 100 baris dan dilakukan Extract pada SKU Bundle (misal 1 bundle berisi 3 child SKU $\rightarrow$ ekspansi 102 baris). Sistem menangani batas kuota dan integritas pecahan bundle secara konsisten. |
| 7 | `SC-ASO-15748-07` | **`edge`** | Ketiadaan tombol Delete Row di seluruh permukaan UI (Aturan *No Delete*) | Memastikan tidak ada tombol Delete di **(1) Detail Order DataTable**, **(2) Modal Edit SKU Detail**, dan **(3) Bulk Action Button** saat centang multi-baris. |
| 8 | `SC-ASO-15748-08` | **`edge`** | Proteksi Sync Lock Pasca Edit User (Simulasi Booking Price 0 $\rightarrow$ Edit $\rightarrow$ Sync Platform) | Unit Price yang diedit dari 0 menjadi Rp 25.000 terkunci (*lock*) dan tidak tertimpa/ter-override oleh nilai baru saat proses Sync order platform dijalankan. |
| 9 | `SC-ASO-15748-09` | **`edge`** | Pemicuan `prevent_auto_approve` & kelengkapan Audit Trail pasca edit detail | Order keluar dari antrian auto-approve (wajib approve manual) dan Audit Log mencatat SKU + field variable + old/new value secara transparan. |
| 10 | `SC-ASO-15748-10` | **`regression`** | Read-Only Guard pada Dokumen Berstatus Approved (UI + Button Save Hilang) | Dokumen SO Platform berstatus `Approved` mengunci seluruh form detail: tombol Add Product hilang, input Qty/Price/Disc/VAT disabled, dan **tombol Save / Save All tidak ditampilkan (hilang)**. |

---

## 🔍 Rincian Detail Skenario

### 1. SC-ASO-15748-01 (Happy: Add Product Baru pada SO Platform)
- **Prekondisi:** Dokumen SO Platform berstatus DRAFT atau OPEN di All Sales Order / Sales Platform.
- **Langkah:**
  1. Buka edit dokumen SO Platform berstatus Open/Draft.
  2. Klik tombol **Add Product** / pilih row baru via dropdown **Select Product**.
  3. Pilih System SKU aktif, tentukan Qty, Price, dan Warehouse.
  4. Klik **Save**.
- **Expected Result:** Baris produk baru berhasil ditambahkan sebagai murni system product (tanpa platform product ID) dan nilai total order terakumulasi.

### 2. SC-ASO-15748-02 (Happy: Ganti System SKU pada Baris Platform Existing)
- **Prekondisi:** Dokumen SO Platform memiliki baris item yang terhubung dengan Platform SKU (misal: Shopee Item).
- **Langkah:**
  1. Pada baris detail produk platform, ubah pilihan dropdown System SKU ke produk lain yang aktif.
  2. Amati tampilan kolom Platform SKU vs System SKU.
  3. Klik **Save**.
- **Expected Result:** System SKU berhasil diperbarui sesuai input user. Kolom Platform SKU tetap menampilkan teks identitas SKU platform asli.

### 3. SC-ASO-15748-03 (Happy: Edit Unit Price, Disc, & VAT + Recalculate)
- **Prekondisi:** Dokumen SO Platform berstatus DRAFT/OPEN.
- **Langkah:**
  1. Ubah nilai **Unit Price** (misal dari Rp 50.000 menjadi Rp 65.000).
  2. Isi **Discount** (misal Rp 5.000) dan ubah opsi **VAT**.
  3. Amati perubahan kalkulasi total pada baris dan ringkasan footer order.
  4. Klik **Save**.
- **Expected Result:** Nilai harga, diskon, dan VAT baru berhasil disimpan. Perhitungan DPP, PPN, dan Total Order ter-recalculate dengan akurat dan konsisten.

### 4. SC-ASO-15748-04 (Negative: Validasi Qty ≤ 0)
- **Prekondisi:** Form edit detail SO Platform terbuka.
- **Langkah:**
  1. Ubah nilai Qty pada salah satu baris detail menjadi `0` atau `-5`.
  2. Klik tombol Save / lakukan submit form.
- **Expected Result:** Sistem memunculkan notifikasi validasi error bahwa quantity harus lebih dari 0 (`The quantity must be greater than 0`). Form tidak tersimpan dan sistem tidak mengubah nilai secara otomatis menjadi 1.

### 5. SC-ASO-15748-05 (Negative: Batas Maksimal 100 Detail Baris via Add Product)
- **Prekondisi:** Dokumen SO Platform telah memiliki 100 baris detail produk.
- **Langkah:**
  1. Coba tambahkan produk ke-101 pada tabel detail via tombol Add Product / Select Product.
  2. Lakukan proses simpan.
- **Expected Result:** Sistem menolak penambahan baris baru dengan pesan batasan kuota detail order maksimal 100 baris.

### 6. SC-ASO-15748-06 (Edge: Ekstraksi SKU Bundle saat Dokumen Sudah 100 Baris)
- **Prekondisi:** Dokumen SO Platform memiliki total 100 baris detail, di mana salah satu barisnya adalah SKU Bundle (misal berisi 3 child SKU).
- **Langkah:**
  1. Pada baris SKU Bundle (di dokumen yang sudah 100 baris), klik tombol/ikon **Extract** (`fa-box-open`).
  2. Amati respon sistem terhadap pemecahan bundle menjadi 3 baris komponen (potensi ekspansi menjadi 102 baris).
- **Expected Result:** Sistem memproses ekstraksi bundle secara aman sesuai mekanisme validasi batas kuota 100 baris tanpa terjadi error unhandled 500 / data corruption.

### 7. SC-ASO-15748-07 (Edge: Ketiadaan Tombol Delete Row di 3 Titik UI)
- **Prekondisi:** Form edit detail SO Platform berstatus DRAFT/OPEN terbuka.
- **Langkah:**
  1. Periksa kolom aksi pada setiap baris di **Detail Order DataTable**.
  2. Buka **Modal Edit SKU Detail Order** (jika ada modal edit per item) dan periksa ada/tidaknya tombol Delete.
  3. Berikan centang (*checklist*) pada beberapa baris detail order (*multi rows*) dan periksa **Bulk Action Button** di atas tabel.
- **Expected Result:** 
  - Tidak ada icon/tombol Delete Baris pada DataTable detail order.
  - Tidak ada tombol Delete di dalam Modal Edit SKU detail order.
  - Tidak ada tombol/aksi Bulk Delete saat mencentang multi-baris detail item.
  - Pengecualian pemecahan baris hanya diperbolehkan melalui fitur Extract Bundle.

### 8. SC-ASO-15748-08 (Edge: Proteksi Sync Lock Pasca Edit User)
- **Prekondisi:** Tersedia dokumen Sales Order Platform yang memiliki Unit Price = 0 (misal order booking platform).
- **Langkah:**
  1. Cari order platform yang memiliki Unit Price = 0.
  2. Cek status order: jika status sudah `Approved`, lakukan `Unapprove` terlebih dahulu sehingga kembali ke status `Open`.
  3. Edit nilai Unit Price dari `0` menjadi nominal baru (misal `Rp 25.000`) lalu klik **Save**.
  4. Tunggu order tersebut sampai menerima pembaruan harga riil dari marketplace (atau picu sync platform order).
  5. Klik tombol **Sync / Synchronize Order**.
  6. Periksa kembali nilai Unit Price pada detail order.
- **Expected Result:** Nilai Unit Price **tidak berubah / tidak tertimpa** oleh harga yang dikirim dari platform marketplace, melainkan tetap terkunci (*locked*) pada nilai `Rp 25.000` (nilai terakhir yang disimpan oleh user).

### 9. SC-ASO-15748-09 (Edge: Pemicuan prevent_auto_approve & Audit Trail Detail)
- **Prekondisi:** Dokumen SO Platform berstatus Open yang memenuhi syarat auto-approve.
- **Langkah:**
  1. Lakukan edit pada salah satu field detail (misal ubah Unit Price atau ganti SKU) lalu klik Save.
  2. Periksa flag jadwal auto-approve dan buka riwayat Audit Log dokumen.
- **Expected Result:** Order ter-flag `prevent_auto_approve = true` (harus di-approve manual oleh supervisor). Audit log mencatat log aktivitas detail: SKU yang diubah, nama field yang diedit, serta nilai lama (old) dan nilai baru (new).

### 10. SC-ASO-15748-10 (Regression: Read-Only Guard Dokumen Approved)
- **Prekondisi:** Dokumen SO Platform berstatus **Approved**.
- **Langkah:**
  1. Buka halaman detail dokumen SO Platform berstatus Approved.
  2. Periksa ketersediaan tombol **Add Product**.
  3. Periksa interaktivitas seluruh field input (Qty, Unit Price, Disc, VAT).
  4. Periksa ketersediaan tombol **Save / Save All**.
- **Expected Result:** Seluruh section detail terkunci sempurna:
  - Tombol **Add Product** tidak ditampilkan (hilang).
  - Seluruh field input (Qty, Price, Disc, VAT) dalam keadaan *disabled* (read-only).
  - Tombol **Save / Save All** **tidak ditampilkan / hilang** dari antarmuka halaman.
