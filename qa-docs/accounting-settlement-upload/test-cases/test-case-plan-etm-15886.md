# Test Case Plan — Instant Settlement Delete Upload Eligibility (ETM-15886)

**Modul:** Finance / Accounting → Instant Settlement  
**Menu:** Instant Settlement  
**Route:** `/accounting/settlement-upload`  
**Jira Card:** [ETM-15886](https://erpintegration.atlassian.net/browse/ETM-15886)  
**Judul Card:** `[Instant Settlement] Penyesuaian syarat Delete upload: izinkan delete jika AR berasal dari Approve Instant Settlement, blokir hanya jika ada AR di luar settlement`  
**Assignee Dev:** Ahmad Dlomiri  
**Status:** Ready for QA Review / Execution  
**Dokumentasi Acuan:** [`qa-docs/accounting-settlement-upload/requirement.md`](../requirement.md) §9 (Delete Settlement) & Acceptance V-18  

---

## 1. Latar Belakang & Ringkasan Perubahan (TO-BE)

### Permasalahan (AS-IS)
Saat ini tombol Delete upload pada datalist Instant Settlement disembunyikan/diblokir menggunakan kondisi:
`settlements_with_ar >= generated_invoice_count`.
Formula ini menyebabkan seluruh batch upload yang sudah di-**Approve** (yang otomatis menerbitkan Customer Payment / AR settlement) **tidak dapat dihapus**, padahal tujuan fitur Delete Settlement adalah membersihkan dan me-revert seluruh rantai dokumen yang terbentuk dari proses upload tersebut (Outbound, Sales Invoice, dan AR Settlement). Sistem belum membedakan antara AR yang dihasilkan dari Approve Instant Settlement dengan AR yang diinput manual dari luar Instant Settlement.

### Solusi & Ekspektasi (TO-BE)
1. **Row Delete**:
   - Jika dokumen Outbound, SI, dan AR seluruhnya berasal dari proses **Approve Instant Settlement** (`customer_payment_id` = `settlement_uploads.receive_id`) → **BOLEH DI-DELETE** (tombol Delete muncul dan delete berhasil).
   - Jika ada Sales Invoice yang sudah menerima pelunasan AR dari **LUAR** Instant Settlement (`customer_payment_id` ≠ `upload.receive_id` atau payment manual dari menu Customer Payment) → **DILARANG DELETE** (tombol Delete disembunyikan atau disabled dengan tooltip penjelasan bahwa ada AR luar).
   - Jika batch belum di-Approve AR (belum ada receive settlement / belum ada payment di SI) → **BOLEH DI-DELETE**.
2. **Bulk Delete**:
   - Jika semua baris yang dipilih **eligible** → tombol bulk Delete di atas tabel **muncul** dan eksekusi sukses.
   - Jika ada minimal 1 baris yang dipilih **not eligible** (memiliki AR luar) → tombol bulk Delete **tidak muncul**.
   - Jika user me-uncheck baris not eligible sehingga seluruh sisa yang dipilih berstatus eligible → tombol bulk Delete **muncul kembali**.
3. **Backend & API Guard**:
   - Endpoint single DELETE dan Bulk DELETE wajib memvalidasi eligibility di level backend. Jika not eligible, request ditolak dengan pesan informatif dan `DeleteSettlementJob` tidak di-dispatch.
   - API datalist mengembalikan flag eligibility (misal: `can_delete_settlement` / `is_deletable` / `delete_blocked_reason`) sebagai Single Source of Truth bagi UI.
4. **Side Effects Delete**:
   - Hard delete dokumen rantai: Outbound (+ jurnal), Sales Invoice (+ jurnal), Customer Payment AR settlement (+ jurnal).
   - Stok outbound di-revert.
   - Status processing gudang di Sales Order tetap Shipped / WH 3PL (tidak di-revert).
   - Dokumen manual di luar rantai settlement tidak ikut terhapus.
5. **Regresi**:
   - Logika disable tombol **Approve** (saat semua SI sudah punya AR) **TIDAK BOLEH RUSAK**.
   - Hak akses / permission Gate `delete` tetap dipatuhi.

---

## 2. Tabel Test Case Plan

| No | Test Case ID | Kategori | Skenario Pengujian | Precondition & Test Data | Langkah Pengujian | Expected Result | Status |
|:--:|:------------:|:---------|:-------------------|:-------------------------|:------------------|:----------------|:------:|
| 1 | `TC-SETU-DEL-001` | Row Delete (Eligible) | Verifikasi tombol Delete muncul dan berhasil menghapus batch yang sudah di-Approve AR (rantai lengkap: Outbound + SI + AR dari Instant Settlement) | Siapkan batch upload yang sudah generate Outbound + SI dan sudah di-**Approve** sehingga terbit AR settlement terikat (`receive_id`) | 1. Buka menu Instant Settlement (`/accounting/settlement-upload`).<br>2. Cari baris batch settlement tersebut.<br>3. Periksa kolom Action.<br>4. Klik tombol Delete (ikon tempat sampah).<br>5. Konfirmasi pada modal konfirmasi delete. | 1. Tombol Delete **tampil** pada baris batch tersebut.<br>2. Proses delete berjalan sukses.<br>3. Batch settlement terhapus dari datalist. | Draft |
| 2 | `TC-SETU-DEL-002` | Side Effects Delete | Verifikasi integritas data dan side-effects pasca delete batch settlement eligible | Batch settlement pada `TC-SETU-DEL-001` berhasil dihapus | 1. Periksa menu Outbound.<br>2. Periksa menu Sales Invoice.<br>3. Periksa menu Customer Payment.<br>4. Periksa jurnal transaksi.<br>5. Periksa stok SKU outbound.<br>6. Periksa status Sales Order di warehouse. | 1. Outbound, Sales Invoice, dan AR Settlement terkait batch ter-hard delete (beserta jurnalnya).<br>2. Stok dari Outbound di-revert (kembali tersedia).<br>3. Status processing order di gudang **tetap Shipped / WH 3PL** (tidak ikut ter-revert). | Draft |
| 3 | `TC-SETU-DEL-003` | Row Delete (Eligible) | Verifikasi tombol Delete muncul dan berhasil menghapus batch yang belum di-Approve AR (hanya Outbound + SI) | Batch upload yang sudah generate Outbound + SI, namun belum dilakukan proses Approve AR | 1. Buka menu Instant Settlement.<br>2. Cari baris batch tersebut.<br>3. Klik tombol Delete dan konfirmasi. | 1. Tombol Delete **tampil**.<br>2. Batch berhasil dihapus beserta dokumen Outbound dan Sales Invoice-nya. | Draft |
| 4 | `TC-SETU-DEL-004` | Row Delete (Eligible) | Verifikasi tombol Delete muncul pada batch yang gagal / partial generate dokumen | Batch upload yang proses generate-nya terhenti / partial (misal sebagian invoice gagal) | 1. Buka menu Instant Settlement.<br>2. Cari baris batch berstatus partial / failed generate.<br>3. Klik tombol Delete. | Tombol Delete **tampil** dan proses delete berhasil membersihkan artefak dokumen yang sempat terbentuk. | Draft |
| 5 | `TC-SETU-DEL-005` | Row Delete (Not Eligible) | Verifikasi pemblokiran tombol Delete pada batch yang memiliki Sales Invoice dengan pelunasan AR dari luar Instant Settlement (External AR) | Batch settlement yang salah satu Sales Invoice-nya telah dilunasi lewat Customer Payment manual di menu Customer Payment (`customer_payment_id` ≠ `upload.receive_id`) | 1. Buka menu Instant Settlement.<br>2. Cari baris batch settlement tersebut.<br>3. Periksa kolom Action. | Tombol Delete **TIDAK MUNCUL** (atau dalam keadaan disabled disertai tooltip: *"Tidak dapat dihapus karena ada Sales Invoice yang sudah memiliki Customer Payment di luar Instant Settlement. Hapus/reverse AR luar terlebih dahulu."*). | Draft |
| 6 | `TC-SETU-DEL-006` | Row Delete (Not Eligible) | Verifikasi pemblokiran Delete pada batch multi-SI dengan campuran AR settlement dan External AR | Batch settlement dengan 3 SI: 2 SI ber-AR settlement, 1 SI ber-AR manual dari luar | 1. Buka menu Instant Settlement.<br>2. Cari baris batch tersebut.<br>3. Periksa kolom Action. | Tombol Delete **TIDAK MUNCUL** / disabled karena terdapat setidaknya 1 invoice yang terkait dengan external AR. | Draft |
| 7 | `TC-SETU-DEL-007` | Re-eligibility Delete | Verifikasi tombol Delete kembali muncul setelah External AR dihapus/dibatalkan di menu Customer Payment | Batch pada `TC-SETU-DEL-005` yang sebelumnya diblokir delete | 1. Buka menu Customer Payment (`/accounting/customer-payment`).<br>2. Hapus/reverse dokumen External AR terkait SI tersebut.<br>3. Kembali ke menu Instant Settlement dan refresh halaman. | Tombol Delete pada baris batch settlement **MUNCUL KEMBALI** dan batch dapat dihapus secara normal. | Draft |
| 8 | `TC-SETU-DEL-008` | Bulk Delete (All Eligible) | Verifikasi fungsionalitas Bulk Delete ketika semua baris yang dipilih berstatus Eligible | Siapkan minimal 2 batch settlement yang semuanya berstatus Eligible (rantai settlement murni) | 1. Centang (select) checkbox pada kedua baris batch eligible tersebut.<br>2. Periksa bagian atas (header) tabel datatable.<br>3. Klik tombol **Bulk Delete**.<br>4. Konfirmasi modal konfirmasi bulk delete. | 1. Tombol **Bulk Delete** muncul di atas tabel.<br>2. Proses bulk delete berjalan sukses untuk seluruh batch yang dipilih.<br>3. Semua dokumen rantai kedua batch terhapus bersih tanpa orphan AR. | Draft |
| 9 | `TC-SETU-DEL-009` | Bulk Delete (Mixed Selection) | Verifikasi tombol Bulk Delete otomatis disembunyikan jika seleksi memuat campuran batch Eligible dan Not-Eligible | Siapkan 1 batch Eligible dan 1 batch Not-Eligible (memiliki External AR) | 1. Centang checkbox pada baris batch Eligible.<br>2. Centang checkbox pada baris batch Not-Eligible.<br>3. Amati bagian atas (header) tabel datatable. | Tombol **Bulk Delete TIDAK MUNCUL** (disembunyikan) karena terdapat baris not-eligible di dalam daftar seleksi. | Draft |
| 10 | `TC-SETU-DEL-010` | Bulk Delete (Dynamic UI) | Verifikasi tombol Bulk Delete muncul kembali secara dinamis setelah user meng-uncheck baris Not-Eligible | Kondisi lanjutan dari `TC-SETU-DEL-009` di mana seleksi masih bercampur | 1. Uncheck (hilangkan centang) pada baris batch Not-Eligible.<br>2. Pastikan hanya baris Eligible yang tersisa dalam kondisi tercentang.<br>3. Amati bagian atas tabel. | Tombol **Bulk Delete LANGSUNG MUNCUL KEMBALI** secara dinamis tanpa perlu me-reload halaman. | Draft |
| 11 | `TC-SETU-DEL-011` | Bulk Delete (All Not Eligible) | Verifikasi tombol Bulk Delete tidak muncul jika semua baris yang dipilih berstatus Not-Eligible | Siapkan 2 batch settlement yang keduanya memiliki External AR | Centang checkbox pada kedua batch Not-Eligible tersebut. | Tombol **Bulk Delete TIDAK MUNCUL** sama sekali. | Draft |
| 12 | `TC-SETU-DEL-012` | Backend & API Guard | Verifikasi direct API call `DELETE /destroy` terhadap batch Not-Eligible ditolak oleh sistem | Siapkan ID batch settlement yang berstatus Not-Eligible | Eksekusi API request `DELETE` langsung ke endpoint settlement upload untuk ID tersebut via Postman / Playwright. | 1. Request ditolak dengan HTTP status 4xx (misal: 422 Unprocessable Entity / 400 Bad Request).<br>2. Respon JSON memuat pesan error informatif mengenai keberadaan AR luar.<br>3. `DeleteSettlementJob` **TIDAK di-dispatch** dan data database tidak berubah. | Draft |
| 13 | `TC-SETU-DEL-013` | Backend & API Guard | Verifikasi direct API call Bulk-Delete yang memuat ID Not-Eligible me-reject request | Siapkan payload bulk delete berisi kombinasi ID Eligible dan ID Not-Eligible | Eksekusi API request bulk-delete ke endpoint backend. | Seluruh request bulk-delete ditolak oleh backend, tidak ada batch yang terhapus parsial (fail-safe consistency). | Draft |
| 14 | `TC-SETU-DEL-014` | Data Contract & Datalist | Verifikasi response JSON datalist memuat flag eligibility yang akurat dari backend | Data settlement upload tersedia di database | Periksa response API datalist (`/accounting/settlement-upload/primevue` atau sejenisnya) menggunakan Network Inspector. | Setiap item row memuat flag eligibility (misal: `can_delete_settlement: true/false` atau `delete_blocked_reason`) yang konsisten dengan kondisi dokumen di database. | Draft |
| 15 | `TC-SETU-REG-015` | Regresi Fitur Approve | Verifikasi fungsionalitas tombol Approve tetap normal dan tidak terpengaruh oleh penyesuaian logika Delete | 1 batch settlement yang belum di-approve, dan 1 batch yang seluruh SI-nya sudah memiliki AR | 1. Pada batch yang belum di-approve: pastikan tombol Approve aktif dan dapat dieksekusi.<br>2. Pada batch yang semua SI sudah ber-AR: pastikan tombol Approve disabled (sesuai behavior eksisting). | Logika Approve tetap mengacu pada keberadaan payment pada seluruh SI (`settlements_with_ar >= generated_invoice_count`), tidak terganggu oleh pemisahan logika delete. | Draft |
| 16 | `TC-SETU-REG-016` | Regresi Permission Gate | Verifikasi user tanpa hak akses Delete tidak dapat mengakses aksi delete baris maupun bulk | User login dengan role yang TIDAK memiliki permission `delete` pada Instant Settlement | 1. Buka menu Instant Settlement.<br>2. Amati kolom Action pada seluruh baris batch eligible.<br>3. Centang beberapa baris batch eligible. | 1. Tombol Delete baris **TIDAK TAMPIL** untuk semua baris.<br>2. Tombol Bulk Delete **TIDAK TAMPIL** meskipun baris yang dicentang berstatus eligible. | Draft |
| 17 | `TC-SETU-REG-017` | Integritas Dokumen Luar | Verifikasi dokumen independen di luar rantai settlement tidak ikut terhapus saat delete batch settlement | Terdapat Customer Payment lain atau invoice lain milik customer yang sama yang dibuat secara manual terpisah | Eksekusi delete pada batch settlement eligible. | Dokumen manual / independen yang tidak terkait dengan batch ID settlement tersebut tetap utuh dan tidak mengalami perubahan. | Draft |

---

## 3. Matriks Keterlacakan Acceptance Criteria (ETM-15886)

| Acceptance Criteria di Card ETM-15886 | Test Case ID Terkait |
|:---------------------------------------|:---------------------|
| **AC-1**: Upload dengan Outbound + SI + AR dari Approve IS → tombol Delete muncul dan delete sukses; rantai dokumen terhapus; stok outbound revert | `TC-SETU-DEL-001`, `TC-SETU-DEL-002` |
| **AC-2**: Upload dengan SI yang memiliki AR dari luar IS → tombol Delete tidak muncul (atau disabled + alasan jelas) | `TC-SETU-DEL-005`, `TC-SETU-DEL-006` |
| **AC-3**: Upload belum Approve AR → Delete boleh selama permission ada | `TC-SETU-DEL-003`, `TC-SETU-DEL-004` |
| **AC-4**: Multi-select semua eligible → tombol bulk Delete muncul dan bulk delete sukses | `TC-SETU-DEL-008` |
| **AC-5**: Multi-select ada ≥1 not eligible → tombol bulk Delete tidak muncul | `TC-SETU-DEL-009`, `TC-SETU-DEL-011` |
| **AC-6**: Unselect yang not eligible → tombol bulk Delete muncul kembali secara dinamis | `TC-SETU-DEL-010` |
| **AC-7**: Call API delete langsung untuk upload not eligible → ditolak (4xx + pesan jelas), job tidak jalan | `TC-SETU-DEL-012` |
| **AC-8**: Bulk-delete API berisi campuran eligible + not eligible → reject seluruh request | `TC-SETU-DEL-013` |
| **AC-9**: Datalist mengembalikan flag eligibility yang selaras dengan UI (satu sumber kebenaran backend) | `TC-SETU-DEL-014` |
| **AC-10**: Regresi Approve, Retry, ResultPanel, permission Gate delete tetap normal | `TC-SETU-REG-015`, `TC-SETU-REG-016` |
| **AC-11**: Delete eligible tidak mengubah status Wave/Pick/Pack/Shipped (hanya stok yang revert) | `TC-SETU-DEL-002`, `TC-SETU-REG-017` |

---

## 4. Panduan Data Testing di Staging

1. **URL Menu**: `https://staging.olshoperp.com/accounting/settlement-upload`
2. **Kredensial Testing**: Akun dengan role Finance / Admin yang memiliki permission Delete pada modul Instant Settlement.
3. **Persiapan Batch Eligible-Full-Chain**:
   - Upload file settlement marketplace (Shopee / TikTok / Tokopedia) hingga tahapan generate Outbound dan Sales Invoice selesai.
   - Lakukan klik tombol **Approve** (centang) pada baris batch settlement hingga terbit dokumen Customer Payment (AR settlement).
   - Verifikasi bahwa `customer_payment_id` pada payment details invoice mengacu pada `settlement_uploads.receive_id`.
4. **Persiapan Batch Not-Eligible-External-AR**:
   - Upload file settlement hingga terbentuk Sales Invoice.
   - Buka menu **Customer Payment** (`/accounting/customer-payment`), lalu buat Customer Payment manual untuk melunasi salah satu Sales Invoice dari batch settlement tersebut (sehingga terbentuk payment dengan ID di luar `receive_id` settlement).
   - Kembali ke menu Instant Settlement untuk memvalidasi tombol Delete tidak muncul / disabled.
