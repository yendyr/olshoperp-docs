# Test Plan: ETM-15633 — Implementasi Colli v2 (Multi-SKU per Colli by Location) pada Stock Addition (Full Coverage)

- **Origin Card:** [ETM-15633](https://erpintegration.atlassian.net/browse/ETM-15633) — `[Stock Addition] Implementasi Colli v2 — Multi-SKU per Colli by Location`
- **Reference / Pair Card:** [ETM-15610](https://erpintegration.atlassian.net/browse/ETM-15610) — `[BETA - New Purchase Inbound] Implementasi Fitur Colli by Location: Multi-SKU per Colli & Penandaan Tipe Colli`
- **Related Historical Issues / Bug Refs:** 
  - [ETM-15613](https://erpintegration.atlassian.net/browse/ETM-15613) (Search existing colli by code)
  - [ETM-15611](https://erpintegration.atlassian.net/browse/ETM-15611) (Import colli: qty minus, notifikasi count, error log)
  - [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543) (Master Colli Type)
- **Menu Target:**
  1. Stock Addition (`/supplychain/stock-addition` / `supplychain-adjustment-addition`)
  2. Stock Addition Approval (`/accounting/stock-addition-approval` / `accounting-stock-addition-approval`)
  3. Stock Monitoring & Multi SKU Colli (`/supplychain/stock-monitoring`)
- **Request ID:** `recvtVn0R0JkFk`
- **Owner / Author:** QA - Yemima

---

## 🎯 Tujuan Pengujian
Memastikan cakupan penuh (*100% end-to-end coverage*) fungsionalitas **Colli v2** pada menu **Stock Addition**, mencakup:
1. Pembuatan New Colli (Single SKU & Multi-SKU) serta integrasi Master Colli Type.
2. Penugasan Existing Colli dengan validasi kesamaan lokasi gudang (exact WH match) dan pencarian kode colli.
3. Struktur integritas baris (1 baris maks 1 colli, baris tanpa colli / NULL, kombinasi dalam 1 dokumen).
4. Manajemen Colli per-baris (Remove SKU to NULL, Move to another Colli, Edit Qty).
5. Validasi Import Excel Detail secara komprehensif (Nomor urut sama, nomor urut beda, existing code, NULL, validasi minus/0, mismatch WH, akurasi notifikasi count & error log).
6. Lifecycle Approval (Submit Open $\rightarrow$ Stock Addition Approval di Accounting $\rightarrow$ Stock Monitoring).
7. Lifecycle Cleanup / Garbage Collection (Pembersihan orphan colli saat detail/dokumen draft dihapus atau di-reject).

---

## ⚖️ Matriks Perbandingan & Adaptasi (Purchase Inbound vs Stock Addition)

| Aspek | Purchase Inbound (ETM-15610) | Stock Addition (ETM-15633) |
|---|---|---|
| **Sumber Input SKU & Qty** | Dari Outstanding PO / Available Use PO | Manual via **Select Product** / Import Excel (Tanpa PO) |
| **Pengaruh Qty saat Assign Colli** | Qty Inbound tidak diubah oleh assign colli | Qty Addition tidak diubah oleh assign colli |
| **Alur Approval Dokumen** | Langsung di-approve di flow Inbound SCM | Dibuat di SCM $\rightarrow$ Di-approve via **Stock Addition Approval (Accounting)** |
| **Prinsip Colli v2 yang Dipertahankan** | Multi-SKU, 1 baris maks 1 colli, Colli Type, Exact WH Match, Import 1 kolom, Lifecycle cleanup | **100% Identik (Shared Concept)** |

---

## 📋 Matriks Lengkap Skenario Test Case (18 Skenario Komprehensif)

| No | Kode Skenario | Test Type | Area / Fokus Skenario | Ringkasan Inti Expected Result |
|:---:|:---|:---:|:---|:---|
| 1 | `SC-ADJADD-15633-01` | **`happy`** | **New Colli: Multi-SKU** (≥2 SKU) via Bulk Assign | Memilih ≥2 baris SKU $\rightarrow$ Assign New Colli $\rightarrow$ Pilih Colli Type aktif $\rightarrow$ Terbentuk 1 kode hexa `COL-...` yang sama pada semua baris terpilih. |
| 2 | `SC-ADJADD-15633-02` | **`happy`** | **New Colli: Single SKU** | Memilih 1 baris SKU $\rightarrow$ Assign New Colli $\rightarrow$ Terbentuk 1 kode colli baru khusus untuk SKU tersebut. |
| 3 | `SC-ADJADD-15633-03` | **`happy`** | **Assign ke Existing Colli** pada Warehouse Destination yang sama | Memilih baris SKU $\rightarrow$ Assign to Existing Colli pada gudang tujuan yang sama $\rightarrow$ SKU berhasil terhubung ke Colli existing tersebut. |
| 4 | `SC-ADJADD-15633-04` | **`happy`** | **Pencarian Kode Colli** pada Dropdown Existing Colli (Ref: ETM-15613) | Input kata kunci kode colli pada search bar dropdown Existing Colli menyaring daftar secara akurat dan responsif. |
| 5 | `SC-ADJADD-15633-05` | **`negative`** | **Validasi Mismatch Warehouse** pada Existing Colli | Dropdown Existing Colli hanya menampilkan colli yang berada pada Warehouse Destination yang sama; jika ada colli beda WH dipaksa $\rightarrow$ ditolak sistem. |
| 6 | `SC-ADJADD-15633-06` | **`happy`** | **Kombinasi Baris Ber-Colli dan Tanpa Colli (NULL OK)** | Dalam 1 dokumen, terdapat baris New Colli, Existing Colli, dan baris tanpa colli (NULL) $\rightarrow$ Dokumen tersimpan sukses (Colli bersifat opsional). |
| 7 | `SC-ADJADD-15633-07` | **`edge`** | **Aturan Integritas 1 Baris Maks 1 Colli** | 1 baris detail item hanya dapat di-assign ke 1 kode Colli; penugasan baru menggantikan colli sebelumnya, tidak terjadi duplikasi colli dalam 1 baris. |
| 8 | `SC-ADJADD-15633-08` | **`edge`** | **Remove SKU dari Colli** (Pelepasan ke NULL) | Melakukan remove SKU dari Colli via modal/form edit mengosongkan relasi colli pada baris tersebut menjadi NULL. |
| 9 | `SC-ADJADD-15633-09` | **`edge`** | **Move SKU ke Colli Lain** | Memindahkan SKU dari Colli A ke Colli B yang valid pada gudang yang sama berhasil memperbarui relasi colli SKU ke Colli B. |
| 10 | `SC-ADJADD-15633-10` | **`happy`** | **Edit Qty pada Baris Ber-Colli** | Mengubah nilai In Qty pada baris yang telah ber-colli berhasil tersimpan tanpa merusak atau melepaskan relasi Colli ID. |
| 11 | `SC-ADJADD-15633-11` | **`negative`** | **Validasi Qty ≤ 0** pada Baris Ber-Colli | Mengubah Qty menjadi 0 atau angka negatif pada baris ber-colli ditolak validasi `The quantity must be greater than 0`. |
| 12 | `SC-ADJADD-15633-12` | **`happy`** | **Import Excel: Nomor Urut Colli Sama & Berbeda** | Import Excel: baris bernomor urut sama (misal `1`, `1`) membentuk 1 New Colli bersama; baris bernomor urut beda (misal `2`) membentuk New Colli terpisah. |
| 13 | `SC-ADJADD-15633-13` | **`happy`** | **Import Excel: Kode Existing Colli & Baris Kosong (NULL)** | Import Excel: baris berisi kode existing valid ter-assign ke colli tersebut; baris dengan kolom colli kosong masuk sebagai item tanpa colli (NULL). |
| 14 | `SC-ADJADD-15633-14` | **`negative`** | **Validasi Import: Penolakan Qty Minus / Qty 0 & Log Error** (Ref: ETM-15611) | File Excel dengan Qty minus/0 atau format invalid ditolak; UI menampilkan counter gagal yang akurat dan error log terurut ascending. |
| 15 | `SC-ADJADD-15633-15` | **`negative`** | **Validasi Import: Kode Existing Colli Beda Warehouse / Tidak Ditemukan** | Baris Excel dengan kode Colli yang terdaftar di Warehouse lain atau kode colli fiktif ditolak sistem dengan pesan error lokasi mismatch. |
| 16 | `SC-ADJADD-15633-16` | **`permission`** | **Master Colli Type: Inactive Filter & Preselect Default** (Ref: ETM-15543) | Colli Type berstatus Inactive (Active = OFF) tidak tampil di pilihan New Colli, dan Colli Type dengan Default = ON terpilih otomatis. |
| 17 | `SC-ADJADD-15633-17` | **`cross-menu`** | **Approval via Stock Addition Approval & Visibilitas Stock Monitoring** | Dokumen Stock Addition Open $\rightarrow$ Di-approve via **Stock Addition Approval (Accounting)** $\rightarrow$ Stok masuk gudang & kode Colli aktif di Stock Monitoring. |
| 18 | `SC-ADJADD-15633-18` | **`edge`** | **Pembersihan Orphan Colli saat Hapus Detail / Hapus Dokumen Draft** (Ref: TC-PI-018) | Menghapus baris detail ber-colli baru atau menghapus seluruh dokumen draft Stock Addition otomatis membersihkan kode Colli baru dari list Multi SKU Colli. |

---

## 🔍 Rincian Detail Skenario Uji

### 1. SC-ADJADD-15633-01 (Happy: New Colli Multi-SKU via Bulk Assign)
- **Prekondisi:** User login di company FAT, buka form create/edit Stock Addition, pilih Location Destination (misal WH-FAT-01).
- **Langkah:**
  1. Tambahkan minimal 2-3 SKU berbeda via Select Product pada detail item.
  2. Berikan centang (*checklist*) pada baris SKU-1 dan SKU-2.
  3. Klik tombol aksi **Assign Colli** $\rightarrow$ Pilih **Create New Colli**.
  4. Pilih **Colli Type** (misal `Box`).
  5. Klik tombol Konfirmasi / Simpan.
- **Expected Result:** Sistem menghasilkan 1 kode colli baru bertipe Box (format `COL-XXXXXX`). Kedua baris SKU menampilkan kode Colli yang sama pada kolom Colli ID dan tersimpan sukses ke database.

### 2. SC-ADJADD-15633-02 (Happy: New Colli Single SKU)
- **Prekondisi:** Dokumen Stock Addition Draft/Open dengan Destination WH-FAT-01.
- **Langkah:**
  1. Pilih 1 baris SKU.
  2. Buka opsi Assign Colli $\rightarrow$ Create New Colli $\rightarrow$ Pilih Colli Type $\rightarrow$ Konfirmasi.
- **Expected Result:** Terbentuk 1 kode colli baru yang unik khusus untuk baris SKU tersebut.

### 3. SC-ADJADD-15633-03 (Happy: Assign to Existing Colli Same WH)
- **Prekondisi:** Terdapat kode Colli existing `COL-AAA` yang terdaftar pada Warehouse Destination yang sama (WH-FAT-01).
- **Langkah:**
  1. Pada detail Stock Addition, pilih 1 atau lebih baris SKU baru.
  2. Klik aksi **Assign Colli** $\rightarrow$ Pilih **Existing Colli**.
  3. Pilih kode `COL-AAA` dari daftar dropdown.
  4. Klik Simpan.
- **Expected Result:** Baris SKU berhasil dihubungkan ke `COL-AAA` dan berbagi wadah colli yang sama dengan SKU sebelumnya.

### 4. SC-ADJADD-15633-04 (Happy: Search Existing Colli by Code - Ref ETM-15613)
- **Prekondisi:** Terdapat banyak daftar Existing Colli di sistem pada gudang yang sama.
- **Langkah:**
  1. Buka dropdown / modal Assign Existing Colli.
  2. Ketik sebagian teks atau kode lengkap (misal `COL-6A91`) pada input pencarian.
- **Expected Result:** Daftar dropdown memfilter opsi secara real-time dan menampilkan kode colli yang cocok tanpa error / lag.

### 5. SC-ADJADD-15633-05 (Negative: Mismatch Warehouse Existing Colli)
- **Prekondisi:** Terdapat Colli `COL-BBB` pada Warehouse Destination lain (WH-FAT-02), sementara dokumen saat ini menggunakan WH-FAT-01.
- **Langkah:**
  1. Buka opsi Assign Existing Colli pada dokumen WH-FAT-01.
  2. Periksa apakah `COL-BBB` muncul pada daftar pilihan.
  3. Jika mencoba submit via payload API, amati respon backend.
- **Expected Result:** Dropdown hanya memfilter Colli pada WH exact sama (`COL-BBB` tidak muncul). Jika dipaksa, backend mengembalikan error validasi penolakan mismatch gudang.

### 6. SC-ADJADD-15633-06 (Happy: Kombinasi Baris Ber-Colli dan Tanpa Colli / NULL)
- **Prekondisi:** Form Stock Addition terbuka dengan 4 baris item.
- **Langkah:**
  1. Assign baris 1 & 2 ke `COL-AAA`.
  2. Assign baris 3 ke `COL-CCC`.
  3. Biarkan baris 4 tanpa Colli (kolom Colli kosong / NULL).
  4. Klik tombol Save / Save All.
- **Expected Result:** Dokumen berhasil disimpan tanpa kendala. Sistem mengizinkan baris item tanpa colli (Colli is optional).

### 7. SC-ADJADD-15633-07 (Edge: 1 Baris Maksimal 1 Colli)
- **Prekondisi:** Baris SKU-1 telah terhubung ke `COL-AAA`.
- **Langkah:**
  1. Buka kembali opsi assign colli pada baris SKU-1 $\rightarrow$ Pilih `COL-CCC` $\rightarrow$ Simpan.
- **Expected Result:** Relasi colli pada baris SKU-1 berganti menjadi `COL-CCC`. Tidak terjadi penumpukan/duplikasi multi-colli pada satu baris SKU yang sama.

### 8. SC-ADJADD-15633-08 (Edge: Remove SKU dari Colli ke NULL)
- **Prekondisi:** Baris SKU terhubung ke `COL-AAA`.
- **Langkah:**
  1. Buka modal edit pada baris SKU tersebut $\rightarrow$ Pilih aksi **Remove from Colli** $\rightarrow$ Simpan.
- **Expected Result:** SKU berhasil dilepaskan dari Colli, kolom Colli ID menjadi kosong (NULL), dan sisa SKU lain di dalam `COL-AAA` tetap utuh.

### 9. SC-ADJADD-15633-09 (Edge: Move SKU ke Colli Lain)
- **Prekondisi:** Baris SKU terhubung ke `COL-AAA`. Terdapat `COL-BBB` pada WH yang sama.
- **Langkah:**
  1. Buka modal edit pada baris SKU $\rightarrow$ Pilih aksi **Move to another Colli** $\rightarrow$ Pilih `COL-BBB` $\rightarrow$ Simpan.
- **Expected Result:** SKU berhasil berpindah dari `COL-AAA` ke `COL-BBB`.

### 10. SC-ADJADD-15633-10 (Happy: Edit In Qty pada Baris Ber-Colli)
- **Prekondisi:** Baris SKU ber-colli memiliki In Qty = 10.
- **Langkah:**
  1. Ubah In Qty dari 10 menjadi 25 $\rightarrow$ Klik Save All.
- **Expected Result:** In Qty tersimpan menjadi 25 dan relasi Colli ID tetap terjaga tanpa terputus.

### 11. SC-ADJADD-15633-11 (Negative: Validasi Qty ≤ 0 pada Baris Ber-Colli)
- **Prekondisi:** Form edit Stock Addition dengan baris item ber-colli.
- **Langkah:**
  1. Ubah nilai Qty menjadi 0 atau angka minus (-5) pada baris ber-colli.
  2. Klik tombol Save / Save All.
- **Expected Result:** Sistem menolak penyimpanan dengan pesan validasi `The quantity must be greater than 0` dan tidak diam-diam meng-override ke 1.

### 12. SC-ADJADD-15633-12 (Happy: Import Excel Nomor Urut Sama & Beda)
- **Prekondisi:** File template import Excel Stock Addition diunduh.
- **Langkah:**
  1. Isi template Excel:
     - Baris 1 & 2: Kolom Colli diisi angka `1`
     - Baris 3 & 4: Kolom Colli diisi angka `2`
  2. Upload file Excel pada modal Import Detail Stock Addition.
- **Expected Result:** Baris 1 & 2 otomatis tergabung dalam 1 New Colli baru (`COL-XXX1`), dan baris 3 & 4 tergabung dalam 1 New Colli terpisah (`COL-XXX2`).

### 13. SC-ADJADD-15633-13 (Happy: Import Excel Kode Existing & Baris Kosong)
- **Prekondisi:** Terdapat Existing Colli `COL-AAA` di sistem pada WH tujuan.
- **Langkah:**
  1. Isi template Excel:
     - Baris 1: Kolom Colli diisi kode `COL-AAA`
     - Baris 2: Kolom Colli dikosongkan (tanpa isi)
  2. Upload file Excel pada modal Import Detail.
- **Expected Result:** Baris 1 terhubung ke `COL-AAA`, dan baris 2 masuk sebagai item tanpa colli (NULL).

### 14. SC-ADJADD-15633-14 (Negative: Validasi Import Qty Minus/0 & Error Log - Ref ETM-15611)
- **Prekondisi:** File Excel import disiapkan dengan 1 baris valid dan 1 baris invalid (Qty = -10).
- **Langkah:**
  1. Upload file Excel tersebut pada modal Import Detail.
  2. Amati notifikasi pop-up dan tampilan tabel error log.
- **Expected Result:** Sistem menolak baris invalid. Notifikasi menampilkan jumlah baris sukses dan gagal secara akurat, serta log error menampilkan nomor baris dan penyebab error secara terurut.

### 15. SC-ADJADD-15633-15 (Negative: Validasi Import Kode Existing Beda WH / Fiktif)
- **Prekondisi:** File Excel berisi kode Colli fiktif (`COL-FAKE999`) atau Colli yang terdaftar di WH lain.
- **Langkah:**
  1. Upload file Excel pada dokumen Stock Addition tujuan WH-FAT-01.
- **Expected Result:** Proses import menolak baris tersebut dengan pesan log error bahwa kode Colli tidak valid atau tidak sesuai dengan gudang tujuan.

### 16. SC-ADJADD-15633-16 (Permission/Master: Filter Colli Type Inactive & Preselect Default)
- **Prekondisi:** Master Colli Type memiliki tipe `Karton` (Active = OFF) dan tipe `Pallet` (Active = ON, Default = ON).
- **Langkah:**
  1. Buka form detail Stock Addition $\rightarrow$ Pilih Create New Colli $\rightarrow$ Buka dropdown Colli Type.
- **Expected Result:** Tipe `Karton` tidak muncul di daftar pilihan. Tipe `Pallet` (Default ON) secara otomatis terpilih (*preselected*).

### 17. SC-ADJADD-15633-17 (Cross-Menu: Approval Accounting & Stock Monitoring)
- **Prekondisi:** Dokumen Stock Addition berisi Multi-SKU Colli berstatus Open.
- **Langkah:**
  1. Buka menu **Accounting $\rightarrow$ Stock Addition Approval** (`/accounting/stock-addition-approval`).
  2. Lakukan proses **Approve** pada dokumen Stock Addition terkait.
  3. Buka menu **Supply Chain $\rightarrow$ Stock Monitoring** (`/supplychain/stock-monitoring`) dan periksa lokasi gudang tujuan.
- **Expected Result:** Dokumen Stock Addition berstatus Approved. Stok barang bertambah di gudang tujuan dan kode Colli terdaftar aktif beserta daftar SKU di dalamnya pada Stock Monitoring / Multi SKU Colli.

### 18. SC-ADJADD-15633-18 (Edge: Pembersihan Orphan Colli saat Hapus Detail/Draft - Ref TC-PI-018)
- **Prekondisi:** Dokumen Stock Addition Draft baru saja membentuk New Colli (`COL-TEMP123`) dan belum pernah di-approve.
- **Langkah:**
  1. Hapus baris detail yang membentuk colli tersebut (atau hapus seluruh dokumen draft Stock Addition).
  2. Buka menu Multi SKU Colli / Stock Monitoring.
  3. Cari kode Colli `COL-TEMP123`.
- **Expected Result:** Kode Colli `COL-TEMP123` otomatis terhapus dari sistem dan tidak tertinggal sebagai data yatim (*orphan colli*).
