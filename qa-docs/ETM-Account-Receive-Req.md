# Cursor Testing requirement AR

### Last Updated Requirement v3 April 2026

# Dokumentasi Requirement: Import Account Receive (AR) — Multi-Sheet Relational

**Versi:** 3.0
**Tanggal Dokumen:** April 2026
**Modul:** Finance Accounting / Account Receive (AR)
**Status:** Active

---

## 1. Overview & Tujuan

Fitur Import AR memungkinkan tim Finance melakukan pencatatan pelunasan piutang dari customer secara massal melalui upload file Excel/CSV, tanpa harus membuat transaksi AR satu per satu secara manual.

Fitur ini dibangun dengan arsitektur **Relational Multi-Sheet** — setiap sheet memiliki peran yang berbeda dan saling terhubung melalui mekanisme **Identification Row** sebagai pengikat antar sheet.

**Prinsip utama yang berlaku di seluruh fitur:**

| Prinsip | Penjelasan |
| --- | --- |
| **All-or-Nothing** | Jika ditemukan 1 baris bermasalah, seluruh file ditolak. Tidak ada partial process |
| **Screening First, Process Later** | Sistem mengecek seluruh isi file terlebih dahulu sebelum memproses apapun |
| **Full-Scan Error Collection** | Semua error dikumpulkan dalam 1 kali proses dan ditampilkan sekaligus |
| **IDR Only** | Seluruh transaksi wajib menggunakan currency IDR |
| **Sequential Queue** | Tidak bisa ada 2 proses import berjalan bersamaan dalam 1 domain |

---

## 2. Arsitektur File Template

File upload terdiri dari **3 Sheet** dalam 1 file Excel/CSV:

```
File Import AR
├── Sheet 1: Bank Mutation          (Header / Parent)
├── Sheet 2: Detail Account Receive (Child — SI yang dilunasi)
└── Sheet 3: Adjustment             (Overpayment / Underpayment)
```

### Relasi Antar Sheet

```
Sheet 1 Row 5 ──── Identification Row "5" di Sheet 2 (SI yang dilunasi dari mutasi row 5)
             └──── Identification Row "5" di Sheet 3 (adjustment dari mutasi row 5)
```

**Identification Row** adalah nomor baris Excel fisik dari Sheet 1 — bukan nomor urut data. Ini adalah jembatan penghubung yang menentukan SI mana dilunasi oleh mutasi bank mana.

---

## 3. Struktur Template Detail

### 3.1 Sheet 1 — Bank Mutation

Setiap baris di Sheet 1 merepresentasikan **1 dokumen transaksi AR** yang akan di-generate oleh sistem.

| Kolom | Status | Tipe Data | Aturan & Validasi |
| --- | --- | --- | --- |
| Date | Required | Date | Format `DD-MM-YYYY`. Jam otomatis `00:00:00` |
| Payment Source | Required | String | Kode COA Bank aktif (Cash/Bank) ATAU Nomor Credit Note. Sistem auto-detect tipenya |
| Amount | Required | Numeric | Total uang masuk sesuai rekening koran. Wajib sama dengan akumulasi Sheet 2 untuk Identification Row yang sama |
| Description | Optional | String | Jika kosong, sistem auto-generate dari nomor SI yang dilunasi |
| Currency | Required | String | Wajib IDR. Foreign currency → REJECT seluruh file |

**Tooltip Template Excel — Sheet 1:**

| Kolom | Tooltip |
| --- | --- |
| Date | `Input the bank transaction date. Format: DD-MM-YYYY (e.g., 31-01-2026).` |
| Payment Source | `Input the COA Code from Master Cash Bank OR the Credit Note transaction number. The system will detect automatically.` |
| Amount | `Input the total money received in the bank statement. Use numbers only (e.g., 500000).` |
| Description | `Optional. If left empty, the system will auto-generate a description based on the Invoice Numbers.` |
| Currency | `Only IDR is supported. Transactions in foreign currency will be rejected.` |

---

### 3.2 Sheet 2 — Detail Account Receive

Setiap baris di Sheet 2 merepresentasikan **1 Sales Invoice** yang akan dilunasi, terikat ke 1 baris di Sheet 1 melalui Identification Row.

| Kolom | Status | Tipe Data | Aturan & Validasi |
| --- | --- | --- | --- |
| Sales Invoice No | Required | String | Nomor SI harus sudah terdaftar dan aktif di sistem |
| Invoice Paid Amount | Required | Numeric | Nilai pelunasan untuk SI terkait. Tidak boleh melebihi outstanding SI |
| Identification Row | Required | Integer | Nomor baris Excel dari Sheet 1. Harus merujuk ke baris yang ada dan tidak kosong |

**Tooltip Template Excel — Sheet 2:**

| Kolom | Tooltip |
| --- | --- |
| Sales Invoice No | `Input the valid Sales Invoice number existing in the system.` |
| Invoice Paid Amount | `Input the amount to be paid for this specific invoice.` |
| Identification Row | `Crucial: Input the Excel row number from Sheet 1 that this payment belongs to. This links the invoice to the correct bank mutation.` |

---

### 3.3 Sheet 3 — Adjustment

Sheet 3 digunakan untuk mencatat selisih dana antara mutasi bank dengan nilai pelunasan SI — baik overpayment maupun underpayment. Setiap baris terikat ke 1 baris Sheet 1 melalui Identification Bank Mutation Row.

| Kolom | Status | Tipe Data | Aturan & Validasi |
| --- | --- | --- | --- |
| Account Code | Required | String | Kode COA (class Expense/Pendapatan) ATAU text `CREDIT NOTE` untuk auto-generate CN |
| Debit | Optional | Numeric | Input nilai di posisi debit. Tidak boleh diisi bersamaan dengan Credit |
| Credit | Optional | Numeric | Input nilai di posisi credit. Tidak boleh diisi bersamaan dengan Debit |
| Description | Optional | String | Jadi deskripsi otomatis di row GL journal terkait |
| Identification Bank Mutation Row | Required | Integer | Nomor baris Sheet 1 sebagai pengikat ke dokumen AR & customer |

**Rules Sheet 3:**

- Dalam 1 row: kolom Debit & Credit **tidak boleh diisi keduanya** — harus salah satu
- Account Code yang allowed: class **Expense** & **Pendapatan** only — kecuali jika diisi text `CREDIT NOTE`
- Identification Bank Mutation Row menggunakan mekanisme yang sama persis dengan Identification Row di Sheet 2

**Tooltip Template Excel — Sheet 3:**

| Kolom | Tooltip |
| --- | --- |
| Account Code | `Input a COA code (Expense or Revenue class only) OR type CREDIT NOTE to auto-generate a Credit Note from this adjustment.` |
| Debit | `Input the debit amount. Leave Credit empty if this row is a debit entry.` |
| Credit | `Input the credit amount. Leave Debit empty if this row is a credit entry.` |
| Description | `Optional. Will be used as the description in the GL journal row for this adjustment.` |
| Identification Bank Mutation Row | `Input the Excel row number from Sheet 1 that this adjustment belongs to.` |

---

## 4. Logic Sheet 3 — Adjustment Cases

### 4.1 Case 1: Overpayment (Dana masuk > Nilai SI)

**Sub-case 1a — Kelebihan → Auto-generate Credit Note**

Kondisi: user ingin kelebihan pembayaran dicatat sebagai Credit Note untuk digunakan di transaksi berikutnya.

Input Sheet 3:

```
Account Code : CREDIT NOTE
Debit        : [kosong]
Credit       : [nilai kelebihan]
```

Posisi jurnal yang terbentuk:

```
Debit  : Bank/Kas (nilai mutasi — full amount masuk)
Credit : Piutang / SI (nilai SI)
Credit : Credit Note (selisih kelebihan) ← auto-generated
```

**Sub-case 1b — Kelebihan → Masuk akun pendapatan/lainnya (tanpa CN)**

Kondisi: user ingin kelebihan langsung diakui ke akun lain tanpa generate CN.

Input Sheet 3:

```
Account Code : [Kode COA Pendapatan/lainnya]
Debit        : [kosong]
Credit       : [nilai kelebihan]
```

Posisi jurnal yang terbentuk:

```
Debit  : Bank/Kas (nilai mutasi — full amount masuk)
Credit : Piutang / SI (nilai SI)
Credit : Akun Pendapatan/lainnya (selisih kelebihan)
```

---

### 4.2 Case 2: Underpayment (Dana masuk < Nilai SI)

Kondisi: mutasi bank masuk Rp 493.500 sedangkan nilai SI Rp 500.000.

Input Sheet 3:

```
Account Code : [Kode COA Expense/Pendapatan]
Debit        : 6.500
Credit       : [kosong]
```

Posisi jurnal yang terbentuk:

```
Debit  : Bank/Kas (493.500 — dari mutasi)
Debit  : Akun Expense/Pendapatan (6.500 — selisih)
Credit : Piutang / SI (500.000 — full)
```

> Pelunasan piutang di jurnal tetap mencatat nilai full SI (500.000), bukan nilai mutasi bank yang masuk.
> 

---

## 5. Multi-Source Payment: Cash/Bank & Credit Note

### 5.1 Polymorphic Detection

Sistem mendeteksi secara otomatis tipe Payment Source di Sheet 1:

```
IF input matches active COA Code in Master Cash Bank → treat as Cash/Bank payment
IF input matches existing Credit Note transaction code → treat as Credit Note payment
IF input matches BOTH → Ambiguity Error
IF input matches NEITHER → invalid
```

### 5.2 Validasi Khusus Credit Note

- CN harus berstatus **Approved** sebelum bisa digunakan
- Total pelunasan tidak boleh melebihi **saldo outstanding CN**
- Customer pada SI di Sheet 2 harus sama dengan **owner CN** di Sheet 1
- Currency CN wajib **IDR**

---

## 6. Logika Validasi — Sistem & Rules

### 6.1 Sequential Processing Flow

```
Step 1 — Full-Scan Phase    : Iterasi seluruh baris Sheet 1, 2, & 3 (1 s/d N)
Step 2 — Validation Phase   : Cek semua validasi per baris, kumpulkan semua error
Step 3 — Halt Condition     : Jika ada error → batalkan seluruh proses, tampilkan Full Error Report
Step 4 — Grouping Phase     : Jika bersih → kelompokkan berdasarkan Identification Row
Step 5 — Insertion Phase    : Generate nomor transaksi AR & simpan data dengan status OPEN
```

---

### 6.2 Tabel Validasi Lengkap

**Sheet 1 — Bank Mutation:**

| # | Kategori | Skenario Kegagalan | Pesan Error |
| --- | --- | --- | --- |
| 1 | Required Field | Kolom wajib kosong | `Row [X] at Sheet 1: [Column Name] cannot be empty.` |
| 2 | COA Bank | Kode COA tidak ditemukan atau Inactive di master | `Row [X] at Sheet 1: Bank COA Code [Code] is invalid or inactive.` |
| 3 | Credit Note — Not Found | Nomor CN tidak ditemukan di sistem | `Row [X] at Sheet 1: Credit Note [No] does not exist in the system.` |
| 4 | Credit Note — Status | CN belum berstatus Approved | `Row [X] at Sheet 1: Credit Note [No] status is not Approved.` |
| 5 | Credit Note — Balance | Total pelunasan > saldo outstanding CN | `Row [X] at Sheet 1: Insufficient balance for Credit Note [No]. Current Outstanding: [Amount].` |
| 6 | Ambiguity Check | Input terdeteksi sebagai COA sekaligus No CN | `Ambiguity Error: [Input] matches both a Bank COA and a Credit Note. Please rename one of them.` |
| 7 | Date Format | Format bukan `DD-MM-YYYY` | `Row [X] at Sheet 1: Invalid date format. Please use DD-MM-YYYY.` |
| 8 | Numeric Check | Amount diisi teks/simbol | `Row [X] at Sheet 1: Amount must be a numeric value.` |
| 9 | Currency Lock | Currency bukan IDR | `Row [X] at Sheet 1: Multi-currency import not supported. Please use manual settlement.` |

**Sheet 2 — Detail Account Receive:**

| # | Kategori | Skenario Kegagalan | Pesan Error |
| --- | --- | --- | --- |
| 1 | Required Field | Kolom wajib kosong | `Row [X] at Sheet 2: [Column Name] cannot be empty.` |
| 2 | SI Not Found | Nomor SI tidak ditemukan di sistem | `Row [X] at Sheet 2: Sales Invoice [No] does not exist in the system.` |
| 3 | Numeric Check | Paid Amount diisi teks/simbol | `Row [X] at Sheet 2: Invoice Paid Amount must be a numeric value.` |
| 4 | Matching Amount | Total Paid Amount Sheet 2 ≠ Amount Sheet 1 untuk Identification Row yang sama | `Amount Mismatch: Total at Sheet 1 Row [X] ([Amt1]) does not match total in Sheet 2 ([Amt2]).` |
| 5 | Outstanding | Total bayar (termasuk akumulasi dalam file) > sisa piutang SI | `Row [X] at Sheet 2: Paid amount exceeds the current outstanding for [Invoice No].` |
| 6 | Row Integrity | Identification Row merujuk ke baris kosong atau tidak ada di Sheet 1 | `Row [X] at Sheet 2: Identification Row [N] does not exist or refers to an empty row in Sheet 1.` |
| 7 | Customer Mismatch | Customer SI berbeda dengan owner CN di Sheet 1 | `Row [X] at Sheet 2: Invoice [No] belongs to a different customer than Credit Note [No].` |
| 8 | Currency Lock | SI menggunakan foreign currency | `Row [X] at Sheet 2: Multi-currency import not supported. Please use manual settlement.` |

**Sheet 3 — Adjustment:**

| # | Kategori | Skenario Kegagalan | Pesan Error |
| --- | --- | --- | --- |
| 1 | Required Field | Kolom wajib kosong | `Row [X] at Sheet 3: [Column Name] cannot be empty.` |
| 2 | COA Class | Account Code bukan class Expense/Pendapatan (dan bukan `CREDIT NOTE`) | `Row [X] at Sheet 3: Account Code [Code] is not allowed. Only Expense or Revenue accounts are permitted.` |
| 3 | Debit & Credit bersamaan | 1 row mengisi Debit & Credit sekaligus | `Row [X] at Sheet 3: A row cannot have both Debit and Credit values. Please fill only one.` |
| 4 | Numeric Check | Debit/Credit diisi teks/simbol | `Row [X] at Sheet 3: [Column Name] must be a numeric value.` |
| 5 | Row Integrity | Identification Bank Mutation Row tidak ada di Sheet 1 | `Row [X] at Sheet 3: Identification Row [N] does not exist or refers to an empty row in Sheet 1.` |

---

### 6.3 Validasi Saldo — Matching Check

Sistem menjumlahkan semua `Invoice Paid Amount` di Sheet 2 yang memiliki Identification Row yang sama, lalu membandingkan dengan `Amount` di Sheet 1 pada baris yang dirujuk:

```
SUM(Sheet2.Invoice Paid Amount WHERE Identification Row = N)
  MUST EQUAL
Sheet1.Amount WHERE Row = N
```

Jika tidak sama → error dengan informasi lokasi baris yang spesifik.

---

### 6.4 Validasi Outstanding — Outstanding Check

**Rumus Outstanding:**

```
Outstanding SI = Total SI Amount − (Amount Prepared + Amount Processed)
```

| Status | Definisi |
| --- | --- |
| Prepared | Transaksi AR sudah dibuat/diimport, status masih OPEN |
| Processed | Transaksi AR sudah berstatus APPROVED |

**Real-time Accumulation:**
Jika 1 SI muncul di beberapa baris dalam 1 file import yang sama, sistem mengakumulasikan seluruh Invoice Paid Amount untuk SI tersebut terlebih dahulu sebelum dibandingkan ke outstanding — mencegah overpayment yang lolos karena dicek satu per satu.

---

## 7. Smart Settlement Adjustment

Fitur ini berlaku ketika sistem mendeteksi dokumen manual (Outbound/SI) yang sudah ada di sistem saat file CSV di-upload.

### 7.1 Smart Detection & Collision Logic (Pre-Upload Check)

Saat file CSV di-upload, sistem melakukan scanning terhadap Order ID:

| Kondisi | Behavior |
| --- | --- |
| Order ID memiliki Outbound/SI dengan status selain Approved (Draft/Open/Pending) | **REJECT seluruh batch.** Notifikasi: `Upload Failed. Order [Order ID] has a pending Outbound or Sales Invoice. Please approve or delete the existing draft before proceeding.` |
| Order ID sudah memiliki Outbound Approved (manual) | **SKIP** pembuatan Outbound baru — mencegah double potong stok |
| Order ID sudah memiliki SI Approved (manual) | Masuk ke **Adjustment Mode** — hanya update selisih biaya |

---

### 7.2 Adjustment Mode (Financial Reconciliation)

Jika sistem mendeteksi SI sudah ada dan berstatus Approved, proses import berfungsi sebagai koreksi nilai:

- **Skip Product Detail:** Sistem tidak menambah baris produk baru di SI — mencegah double piutang barang
- **Fee & Subsidy Sync:** Sistem hanya menghitung selisih Other Cost (Marketplace Fee) dan Other Disc (Subsidi) dari file CSV ke SI yang sudah ada
- **Final AR Value:** Nilai pelunasan AR yang terbentuk saat Approve Settlement mencakup nilai barang + hasil adjustment biaya

---

### 7.3 Smart AR Validation (Tahap Approval Settlement)

Saat user menekan tombol Approve pada Settlement yang sudah di-upload:

**Skenario A — Full AR Reference (100% SI sudah lunas):**

- Proses Approve **gagal**
- Tombol Approve menjadi **Disabled**
- Tooltip/Notifikasi: `Approval Disabled. All Sales Invoices in this settlement batch already have AR references. No further action required.`

**Skenario B — Partial AR Reference (sebagian SI sudah lunas):**

- Proses Approve **tetap diizinkan**
- Sistem hanya generate AR untuk SI yang **belum** memiliki referensi AR
- SI yang sudah lunas tidak ditarik kembali ke dokumen AR baru

---

### 7.4 Integrasi Failed Ship (Operational Balance)

- Sistem wajib menarik data **Failed Ship Approved** sebagai pengurang qty bersih
- Jika user membuat Outbound manual untuk 8 unit (karena 2 unit Failed Ship), Settlement wajib mengenali bahwa transaksi fisik sudah selesai di angka 8 unit — bukan 10

---

### 7.5 Hard Delete Protection (Revert Logic)

Fungsi **Delete Settlement** memiliki filter keamanan:

| Dokumen | Behavior saat Delete Settlement |
| --- | --- |
| Outbound/SI yang dibuat **manual** | **Tidak boleh** dihapus oleh sistem Settlement |
| AR yang di-generate oleh Settlement | **Boleh** di-hard delete |
| AR yang dibuat manual atau dari transaksi lain | **Tidak boleh** ikut terhapus |

Notifikasi saat Delete Settlement:

> `Some documents were created manually and will not be deleted. Please check Outbound/SI [ID] for manual reversal.`
> 

---

## 8. Error Log & Notifikasi

### 8.1 Format Error Log

Seluruh error ditampilkan di halaman **Import Log** dengan format tabel:

| Sheet Name | Row Number | Error Description |
| --- | --- | --- |
| Sheet 1 | 5 | Invalid date format. Please use DD-MM-YYYY. |
| Sheet 2 | 8 | Paid amount exceeds the current outstanding for SI-002. |
| Sheet 3 | 3 | A row cannot have both Debit and Credit values. Please fill only one. |

### 8.2 Error Collection

- Sistem mengumpulkan **semua** baris yang error dalam 1 kali screening
- Semua error ditampilkan sekaligus — user tidak perlu upload ulang hanya untuk menemukan error berikutnya
- Seluruh proses dibatalkan jika ada 1 error saja

### 8.3 Queue Management

- Sistem menjalankan proses secara **Sequential (Antrian)**
- Jika ada proses Import AR yang sedang berjalan dalam 1 domain, user lain yang upload mendapat notifikasi:

> `Another import is in progress. Please wait until it completes.`
> 

---

## 9. Default Status & Post-Import Behavior

- Seluruh data yang berhasil diimport masuk dengan status **OPEN**
- Status OPEN memberi ruang tim Finance untuk review manual sebelum Approve
- Setelah Approve: jurnal AR terbentuk sesuai tipe transaksi (Cash/Bank atau Credit Note)
- Jika ada Sheet 3 dengan `CREDIT NOTE` → sistem auto-generate transaksi Credit Note setelah Approve

---

## 10. Simulasi Contoh Data

### 10.1 Basic Import — 3 Transaksi AR dari 1 File

**Sheet 1: Bank Mutation**

| Row | Date | Payment Source | Amount | Description |
| --- | --- | --- | --- | --- |
| 5 | 03-03-2026 | BCA-001 | 500.000 | Pelunasan Toko A |
| 6 | 03-03-2026 | BCA-001 | 400.000 | NULL |
| 7 | 03-03-2026 | Mandiri-002 | 1.000.000 | Transfer Bulk |

**Sheet 2: Detail Account Receive**

| Sales Invoice No | Invoice Paid Amount | Identification Row |
| --- | --- | --- |
| SI-001 | 500.000 | 5 |
| SI-002 | 150.000 | 6 |
| SI-003 | 250.000 | 6 |
| SI-004 | 600.000 | 7 |
| SI-005 | 400.000 | 7 |

**Expected Result — 3 Transaksi AR (Status: OPEN):**

**AR #1 (Row 5)**

- Source: BCA-001
- Amount: Rp 500.000
- SI dilunasi: SI-001 (500.000)
- Description: "Pelunasan Toko A" (dari inputan user)

**AR #2 (Row 6)**

- Source: BCA-001
- Amount: Rp 400.000
- SI dilunasi: SI-002 (150.000) + SI-003 (250.000)
- Description: "SI-002, SI-003" (auto-generate karena NULL)
- Note: Meskipun bank sama (BCA) dan tanggal sama dengan AR #1, sistem tetap memisahkan menjadi dokumen berbeda karena baris mutasi berbeda

**AR #3 (Row 7)**

- Source: Mandiri-002
- Amount: Rp 1.000.000
- SI dilunasi: SI-004 (600.000) + SI-005 (400.000)
- Description: "Transfer Bulk"

---

### 10.2 Overpayment — Auto-generate Credit Note

**Sheet 1:**

| Row | Date | Payment Source | Amount |
| --- | --- | --- | --- |
| 5 | 03-04-2026 | BCA-001 | 550.000 |

**Sheet 2:**

| Sales Invoice No | Invoice Paid Amount | Identification Row |
| --- | --- | --- |
| SI-001 | 500.000 | 5 |

**Sheet 3:**

| Account Code | Debit | Credit | Description | Identification Row |
| --- | --- | --- | --- | --- |
| CREDIT NOTE | — | 50.000 | Kelebihan pembayaran Toko A | 5 |

**Expected Result:**

- AR #1: BCA-001, Rp 500.000, melunasi SI-001
- Credit Note ter-generate otomatis: Rp 50.000 atas nama customer SI-001

---

### 10.3 Underpayment

**Sheet 1:**

| Row | Date | Payment Source | Amount |
| --- | --- | --- | --- |
| 5 | 03-04-2026 | BCA-001 | 493.500 |

**Sheet 2:**

| Sales Invoice No | Invoice Paid Amount | Identification Row |
| --- | --- | --- |
| SI-001 | 500.000 | 5 |

**Sheet 3:**

| Account Code | Debit | Credit | Description | Identification Row |
| --- | --- | --- | --- | --- |
| EXP-001 | 6.500 | — | Selisih pembayaran | 5 |

**Expected Result:**

- AR #1: melunasi SI-001 full Rp 500.000
- Jurnal: Debit Bank 493.500 + Debit EXP-001 6.500 / Credit Piutang 500.000

---

## 11. Changelog — Import Account Receive (AR)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 3 Maret 2026 — Rilis Awal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[New Feature]  Rilis fitur Import AR Multi-Sheet Relational
               Sheet 1: Bank Mutation (parent/header)
               Sheet 2: Detail Account Receive (child)
               Identification Row sebagai pengikat antar sheet

[Core Logic]   Prinsip All-or-Nothing + Full-Scan Validation
               Error collection menyeluruh dalam 1 kali proses
               Error log ditampilkan di halaman Import Log

[Validation]   Required field check per kolom
               COA Bank harus aktif di Master Cash Bank
               Date format: DD-MM-YYYY
               Matching Amount: SUM Sheet 2 = Amount Sheet 1
               Outstanding Check dengan Real-time Accumulation
               Row Integrity: Identification Row harus valid

[Default]      Seluruh data berhasil import → status OPEN

[Smart]        Smart Settlement Adjustment:
               - Pre-upload collision check (Outbound/SI pending)
               - Skip duplicate Outbound Approved
               - Adjustment Mode jika SI Approved sudah ada
               - Smart AR Validation saat Approve Settlement
               - Integrasi Failed Ship sebagai pengurang qty
               - Hard Delete Protection untuk dokumen manual

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 10 Maret 2026 — Credit Note Integration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[New Feature]  Multi-Source Settlement:
               Sheet 1 (Payment Source) kini support 2 tipe:
               - Cash/Bank: Kode COA aktif
               - Credit Note: Nomor transaksi CN

[Improvement]  Polymorphic Detection:
               Sistem auto-detect tipe Payment Source
               (COA vs Credit Note) tanpa input tambahan

[Validation]   Tambah validasi khusus Credit Note:
               - CN harus berstatus Approved
               - Total pelunasan ≤ saldo outstanding CN
               - Customer SI harus sama dengan owner CN
               - Ambiguity Check: input tidak boleh match
                 keduanya (COA & CN) sekaligus

[Fix]          Currency Locking: strict IDR only
               Foreign currency → REJECT seluruh file
               Error: "Multi-currency import not supported.
               Please use manual settlement."

[Fix]          Queue Management: Sequential Queue
               Mencegah race condition jika 2 proses
               import berjalan bersamaan dalam 1 domain
               Notif: "Another import is in progress.
               Please wait until it completes."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 21 April 2026 — Sheet 3: Adjustment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[New Feature]  Penambahan Sheet 3: Adjustment
               Mengakomodir 2 case baru:

               Case 1 — Overpayment (dana > nilai SI):
               1a. Kelebihan → auto-generate Credit Note
                   (input "CREDIT NOTE" di Account Code)
               1b. Kelebihan → masuk akun Pendapatan/lainnya
                   (tanpa generate CN)

               Case 2 — Underpayment (dana < nilai SI):
               Selisih diinput di posisi Debit Sheet 3
               Pelunasan piutang tetap full di jurnal

[Structure]    Kolom Sheet 3:
               Account Code | Debit | Credit |
               Description | Identification Bank Mutation Row

[Validation]   Tambah validasi Sheet 3:
               - Debit & Credit tidak boleh diisi bersamaan
               - COA hanya class Expense/Pendapatan
                 (kecuali "CREDIT NOTE")
               - Row Integrity sama dengan Sheet 2

[Rule]         All-or-Nothing berlaku untuk ketiga sheet
               sekaligus — error di Sheet 3 = seluruh
               batch ditolak
```