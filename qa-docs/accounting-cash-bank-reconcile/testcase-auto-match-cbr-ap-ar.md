# Test Case — Auto-Match Bank Statement dengan GL Cash/Bank dari Account Payment/Account Receivable

Referensi: Card improvement "[Cash & Bank Reconcile] - Auto-match otomatis untuk transaksi GL yang bersumber dari Account Payment dan Account Receivable" + feedback teknis Cursor.

Scope MVP yang di-cover: exact amount, exact date (same day), skip-on-tie jika kandidat lebih dari 1, filter hanya `transaction_reference_text` = `Payment to Supplier` / `Payment from Customer`, journal status Approved, header CBR Draft/Open.

---

## TC-01 — Happy Path: Auto-match Account Receivable (Customer Payment) multi-invoice

**Priority:** High
**Precondition:**
- Master Cash/Bank: COA `11001` (Bank BCA) aktif
- Fiscal period Juli 2026 masih Open
- Customer Payment (AR) sudah dibuat & journal berstatus Approved

**Test Data:**

| Item | Nilai |
|---|---|
| Journal Trx Code | JRN-AR-0001 |
| Journal Date | 02-07-2026 |
| `transaction_reference_text` | `Payment from Customer` |
| Detail journal 1 | COA 11001 (Cash/Bank) — Debit 100.000 |
| Detail journal 2 | COA 10011 (Piutang SI-001) — Credit 15.000 |
| Detail journal 3 | COA 10012 (Piutang SI-002) — Credit 35.000 |
| Detail journal 4 | COA 10013 (Piutang SI-003) — Credit 50.000 |
| Cash & Bank Reconcile | Header BR-000123, Cash/Bank Account = COA 11001, Period 01-07-2026 s/d 05-07-2026, Status Open |
| File Import Bank Statement | 1 baris: TransactionDate = `02/07/2026`, Received = `100000`, Spent = kosong, Description = `Terima transfer` |

**Test Steps:**
1. Buka transaksi Cash & Bank Reconcile BR-000123 (status Open)
2. Buka tab Bank Statement, klik Import, upload file dengan data di atas
3. Cek hasil import dan status baris bank statement
4. Cek tab GL Transaction / Reconcile Process untuk baris JRN-AR-0001 (COA 11001)

**Expected Result:**
- Import berhasil, baris bank statement 100.000 tanggal 02/07/2026 langsung berstatus `Reconciled` tanpa user klik Match manual
- Baris GL COA 11001 dari JRN-AR-0001 (bukan baris piutang 10011/10012/10013) yang ter-pairing dengan baris bank statement tersebut
- Baris piutang SI-001/SI-002/SI-003 tidak muncul sebagai baris yang di-match ke bank statement
- Statement Balance dan Internal Balance di header BR-000123 ter-update mencerminkan hasil auto-match

---

## TC-02 — Happy Path: Auto-match Account Payable (Supplier Payment)

**Priority:** High
**Precondition:** Sama seperti TC-01, tapi sumber transaksi dari Supplier Payment

**Test Data:**

| Item | Nilai |
|---|---|
| Journal Trx Code | JRN-AP-0001 |
| Journal Date | 03-07-2026 |
| `transaction_reference_text` | `Payment to Supplier` |
| Detail journal 1 | COA 11001 (Cash/Bank) — Credit 250.000 |
| Detail journal 2 | COA 20011 (Hutang PI-010) — Debit 250.000 |
| File Import Bank Statement | TransactionDate = `03/07/2026`, Received = kosong, Spent = `250000`, Description = `Bayar supplier` |

**Test Steps:** sama seperti TC-01, dengan side Spent/Credit.

**Expected Result:**
- Baris bank statement 250.000 (Spent) tanggal 03/07/2026 otomatis `Reconciled`
- Baris GL COA 11001 (Credit) dari JRN-AP-0001 yang ter-pairing
- Side matching benar: Received ↔ Debit, Spent ↔ Credit — Spent 250.000 match dengan sisi Credit di COA cash/bank

---

## TC-03 — Skip-on-Tie: Dua kandidat GL AP/AR nominal & tanggal sama

**Priority:** High
**Precondition:** Ada 2 transaksi Customer Payment berbeda, tanggal dan nominal identik

**Test Data:**

| Journal Trx Code | Journal Date | Reference | COA 11001 (Debit) |
|---|---|---|---|
| JRN-AR-0002 | 04-07-2026 | Payment from Customer | 500.000 |
| JRN-AR-0003 | 04-07-2026 | Payment from Customer | 500.000 |

Import Bank Statement: TransactionDate = `04/07/2026`, Received = `500000`

**Test Steps:**
1. Import bank statement dengan data di atas
2. Cek status baris bank statement 500.000 tanggal 04/07/2026
3. Cek kedua baris GL JRN-AR-0002 dan JRN-AR-0003

**Expected Result:**
- Baris bank statement **tidak** auto-match (tetap `Not Reconciled`)
- Kedua baris GL tetap `Not Reconciled`, muncul sebagai suggestion manual (bukan auto-match) di tab Reconcile Process, dengan tombol "See {number} other matching transactions"
- User tetap harus pilih manual salah satu via modal Matching with Bank Statement

---

## TC-04 — Journal manual (bukan AP/AR) dengan nominal sama tidak ikut auto-match

**Priority:** High
**Precondition:** Ada journal manual (bukan hasil Payment AP/AR) dengan COA 11001 dan nominal yang sama dengan baris bank statement

**Test Data:**

| Item | Nilai |
|---|---|
| Journal Trx Code | JRN-MANUAL-0005 |
| Journal Date | 05-07-2026 |
| `transaction_reference_text` | kosong / bukan `Payment to Supplier` atau `Payment from Customer` (misal jurnal umum/manual adjustment) |
| Detail journal | COA 11001 — Debit 750.000 |
| Import Bank Statement | TransactionDate = `05/07/2026`, Received = `750000` |

**Test Steps:**
1. Import bank statement dengan data di atas
2. Cek status baris bank statement dan baris GL JRN-MANUAL-0005

**Expected Result:**
- Baris bank statement **tidak** auto-match, tetap `Not Reconciled`
- JRN-MANUAL-0005 tetap masuk sebagai suggestion (mekanisme existing: threshold/exact amount+date), tapi harus di-Match manual oleh user
- Tidak ada auto-match karena journal bukan bersumber dari Payment AP/AR

---

## TC-05 — Amount tidak exact (selisih sedikit) tidak auto-match

**Priority:** Medium
**Precondition:** Customer Payment dengan COA 11001, nominal berbeda tipis dari bank statement

**Test Data:**

| Item | Nilai |
|---|---|
| Journal Trx Code | JRN-AR-0006 |
| Journal Date | 06-07-2026 |
| Reference | Payment from Customer |
| COA 11001 (Debit) | 300.000 |
| Import Bank Statement | TransactionDate = `06/07/2026`, Received = `299500` (selisih 500) |

**Expected Result:**
- Tidak auto-match (amount harus exact, tidak pakai threshold 5% untuk fitur ini)
- Baris tetap muncul sebagai suggestion biasa (threshold-based) di tab Reconcile Process untuk dicek/di-Match manual oleh user jika memang dianggap cocok

---

## TC-06 — Tanggal journal berbeda dengan tanggal bank statement (tidak auto-match, out of scope MVP)

**Priority:** Medium
**Precondition:** Customer Payment dengan tanggal journal berbeda 1 hari dari bank statement, nominal exact sama

**Test Data:**

| Item | Nilai |
|---|---|
| Journal Trx Code | JRN-AR-0007 |
| Journal Date | 06-07-2026 |
| Reference | Payment from Customer |
| COA 11001 (Debit) | 400.000 |
| Import Bank Statement | TransactionDate = `07/07/2026` (beda 1 hari), Received = `400000` |

**Expected Result:**
- Tidak auto-match karena tanggal journal dan bank statement berbeda (MVP hanya same-day)
- Muncul sebagai suggestion manual (priority kedua: amount sama, tanggal beda) mengikuti mekanisme existing
- Catatan: date-flexible auto-match adalah follow-up terpisah, di luar scope test case ini

---

## TC-07 — Side tidak sesuai (Received vs posisi Credit di jurnal)

**Priority:** Medium
**Precondition:** Customer Payment, tapi baris COA cash/bank ada di posisi Credit (skenario tidak normal/anomali data)

**Test Data:**

| Item | Nilai |
|---|---|
| Journal Trx Code | JRN-AR-0008 |
| Journal Date | 08-07-2026 |
| Reference | Payment from Customer |
| COA 11001 | Credit 200.000 (bukan Debit) |
| Import Bank Statement | TransactionDate = `08/07/2026`, Received = `200000` (Received harus pasangan Debit) |

**Expected Result:**
- Tidak auto-match karena side tidak sesuai (Received harus match dengan Debit, bukan Credit)
- Baris tetap `Not Reconciled`, tidak error, hanya tidak ter-auto-match

---

## TC-08 — GL yang sudah pernah ter-link tidak boleh double-match

**Priority:** High
**Precondition:** Baris GL COA 11001 dari JRN-AR-0009 sudah lebih dulu di-match manual ke baris bank statement lain sebelumnya (`accounting_cash_bank_reconciliation_details` sudah ada record-nya)

**Test Data:**

| Item | Nilai |
|---|---|
| Journal Trx Code | JRN-AR-0009 |
| Journal Date | 09-07-2026 |
| Reference | Payment from Customer |
| COA 11001 (Debit) | 600.000 — sudah di-match manual ke bank statement row #A sebelumnya |
| Import Bank Statement baru (row #B) | TransactionDate = `09/07/2026`, Received = `600000` (nominal sama persis dengan JRN-AR-0009) |

**Test Steps:**
1. Import bank statement baru (row #B) yang punya nominal sama persis dengan JRN-AR-0009 yang sudah ter-link
2. Cek status row #B

**Expected Result:**
- Row #B tidak auto-match ke JRN-AR-0009 karena JRN-AR-0009 sudah ter-link ke transaksi lain
- Row #B tetap `Not Reconciled`, tidak ada 1 baris GL yang ke-pairing dobel ke 2 baris bank statement berbeda

---

## TC-09 — Journal AP/AR belum Approved tidak eligible untuk auto-match

**Priority:** High
**Precondition:** Customer Payment dibuat tapi journal masih status Draft/belum Approved

**Test Data:**

| Item | Nilai |
|---|---|
| Journal Trx Code | JRN-AR-0010 |
| Journal Date | 10-07-2026 |
| Status Journal | Draft (belum Approved) |
| Reference | Payment from Customer |
| COA 11001 (Debit) | 350.000 |
| Import Bank Statement | TransactionDate = `10/07/2026`, Received = `350000` |

**Expected Result:**
- Tidak auto-match, karena JRN-AR-0010 belum berstatus Approved
- Setelah JRN-AR-0010 di-approve kemudian (tanpa re-import ulang), baris bank statement TIDAK otomatis ter-update jadi match (karena auto-match hanya berjalan tepat setelah proses import) — kondisi ini tetap `Not Reconciled` sampai ada aksi match manual atau proses import baru/re-run

---

## TC-10 — Header Cash & Bank Reconcile sudah Approved, auto-match tidak boleh jalan

**Priority:** High
**Precondition:** Header BR-000200 sudah berstatus Approved

**Test Data:**

| Item | Nilai |
|---|---|
| Header CBR | BR-000200, status Approved |
| Journal Trx Code | JRN-AR-0011, Reference Payment from Customer, COA 11001 Debit 150.000, tanggal 04-07-2026 |
| Import Bank Statement (percobaan) | TransactionDate `04/07/2026`, Received `150000` |

**Test Steps:**
1. Coba akses tab Bank Statement pada header BR-000200 yang sudah Approved
2. Coba lakukan import (jika tombol/aksi tersedia)

**Expected Result:**
- Import dan seluruh proses edit (termasuk auto-match) tidak bisa dilakukan pada header berstatus Approved — konsisten dengan aturan existing bahwa transaksi Approved tidak bisa diedit
- Tidak ada auto-match yang terjadi

---

## TC-11 — Re-import: baris yang sudah matched tidak diproses ulang, hanya baris baru

**Priority:** Medium
**Precondition:** Header BR-000123 (Open) sudah punya baris bank statement yang sudah `Reconciled` dari import sebelumnya (lihat TC-01)

**Test Data:**

| Item | Nilai |
|---|---|
| Baris existing | TransactionDate `02/07/2026`, Received `100000` — sudah `Reconciled` (dari TC-01) |
| File import baru | Berisi baris lama (duplikat, `02/07/2026` Received `100000`) + baris baru: TransactionDate `04/07/2026`, Received `320000`, Description `Terima transfer baru` |
| Journal baru yang eligible | JRN-AR-0012, Reference Payment from Customer, COA 11001 Debit 320.000, tanggal 04-07-2026, Approved |

**Test Steps:**
1. Import file baru yang berisi baris lama (duplikat) + baris baru ke header BR-000123
2. Cek jumlah baris bank statement dan statusnya setelah import

**Expected Result:**
- Baris lama (02/07/2026, 100.000) tidak diproses ulang / tidak dobel — tetap `Reconciled` seperti sebelumnya, tidak ter-link ulang ke journal manapun
- Baris baru (04/07/2026, 320.000) diproses sebagai baris baru, dan auto-match ke JRN-AR-0012 karena eligible
- Tidak ada duplikasi baris bank statement untuk data yang sama persis

---

## TC-12 — Import gagal (all-or-nothing) tidak menghasilkan partial auto-match

**Priority:** High
**Precondition:** File import mengandung baris valid dan baris invalid (format tanggal salah/kolom Received-Spent kosong dua-duanya)

**Test Data:**

| Baris | TransactionDate | Received | Spent | Keterangan |
|---|---|---|---|---|
| 1 | `05/07/2026` | `100000` | (kosong) | Valid, ada journal AR eligible (COA 11001 Debit 100.000, tgl 05-07-2026) |
| 2 | `2026/07/05` | (kosong) | (kosong) | Invalid — format tanggal salah dan kedua kolom amount kosong |

**Test Steps:**
1. Import file berisi baris 1 (valid) dan baris 2 (invalid) sekaligus
2. Cek behavior import dan status data

**Expected Result:**
- Import gagal total (all-or-nothing) — baris 1 yang sebenarnya valid **tidak** ikut tersimpan maupun ter-auto-match
- Tidak ada partial data yang masuk ke Bank Statement
- Sistem menampilkan error import sesuai validasi format tanggal (Section 7 requirement doc)

---

## TC-13 — Multi cash/bank COA dalam 1 payment vs 1 baris bank statement total (tidak auto-match jika baris tidak sama persis)

**Priority:** Medium
**Precondition:** Satu Customer Payment memakai 2 COA cash/bank berbeda (split fund) dalam 1 journal

**Test Data:**

| Journal Trx Code | Detail | COA | Posisi | Amount |
|---|---|---|---|---|
| JRN-AR-0013 | Baris 1 | 11001 (Bank A) | Debit | 60.000 |
| JRN-AR-0013 | Baris 2 | 11002 (Bank B) | Debit | 40.000 |

Import Bank Statement pada CBR untuk akun 11001: TransactionDate `06/07/2026`, Received `100000` (total gabungan, bukan match ke salah satu baris)

**Expected Result:**
- Tidak auto-match, karena baris GL COA 11001 hanya bernilai 60.000, tidak exact sama dengan baris bank statement 100.000
- Baris bank statement tetap `Not Reconciled`, perlu ditangani manual (bulk match lintas baris jika relevan, di luar scope auto-match MVP ini)

---

## TC-14 — Unmatch setelah auto-match tetap berfungsi normal

**Priority:** High
**Precondition:** Baris hasil auto-match dari TC-01 (BR-000123, bank statement 100.000 tanggal 02/07/2026 ↔ JRN-AR-0001) — header masih status Open

**Test Steps:**
1. Buka tab Reconcile Process / Bank Statement pada header BR-000123
2. Cari baris yang berstatus `Reconciled` hasil auto-match
3. Klik aksi Unmatch pada baris tersebut
4. Cek status baris bank statement dan baris GL JRN-AR-0001 setelah unmatch
5. Coba Match manual lagi baris yang sama

**Expected Result:**
- Unmatch berhasil, baris bank statement dan baris GL kembali berstatus `Not Reconciled`
- User bisa melakukan Match manual kembali seperti transaksi biasa
- Tidak ada perbedaan behavior antara unmatch hasil auto-match vs unmatch hasil match manual

---

## Ringkasan Cakupan Test

| Area | Jumlah TC |
|---|---|
| Happy path (AR & AP) | TC-01, TC-02 |
| Validasi exclude (skip-on-tie, non-AP/AR, amount/date/side mismatch) | TC-03 s/d TC-07 |
| Data integrity (double-match, journal belum approved, header approved) | TC-08, TC-09, TC-10 |
| Re-import & import failure | TC-11, TC-12 |
| Edge case multi-COA | TC-13 |
| Regression unmatch | TC-14 |

**Catatan:** TC-06 (date-flexible) sengaja dites untuk memastikan **tidak** auto-match, karena berdasarkan feedback teknis Cursor ini adalah scope follow-up terpisah (belum di-cover MVP ini).
