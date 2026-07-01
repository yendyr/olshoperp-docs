---
doc_type: requirement
menu: journal
menu_name: "Journal"
version: 1.1
last_updated: 2026-06-23
owner: QA - Yemima
status: review
---
# Journal

Public Link: https://www.notion.so/Journal-2f4bf961929280048694dff2f3a85638?source=copy_link

### Dokumentasi Requirement: Journal

**Versi:** 1.0
**Tanggal:** Mei 2026
**Modul:** Finance Accounting / Journal
**Status:** Active

---

## 1. Overview & Tujuan

Menu Journal digunakan untuk mencatat seluruh transaksi jurnal akuntansi — baik yang dibuat secara manual oleh user maupun yang ter-generate otomatis oleh sistem dari relasi transaksi lain (Sales Invoice, Outbound, Stock Addition, AR, dll).

Journal yang berstatus **Approved** adalah satu-satunya journal yang masuk ke laporan keuangan (GL, Trial Balance, Balance Sheet, Profit & Loss).

---

## 2. Tipe Journal

Kolom **Type** di datalist mengidentifikasi asal/sumber journal:

| Type | Keterangan |
| --- | --- |
| Assembly Inbound | Journal dari flow transaksi Assembly Inbound (stock in barang jadi) |
| Warehouse Stock Outbound | Journal dari proses outbound — bisa dari flow order maupun stock out internal (as expense) |
| Stock Adjustment (Deduction) | Journal dari Stock Deduction — termasuk stock opname yang mengurangi stock |
| Stock Adjustment (Addition) | Journal dari Stock Addition — termasuk stock opname yang menambah stock |
| Sales Invoice | Journal dari transaksi Sales Invoice |
| Manual Journal Entry | Journal dibuat manual oleh user |
| Payment from Customer | Journal dari transaksi AR / Account Receive (penerimaan piutang) |
| Purchase Return | Journal dari transaksi Purchase Return |
| Credit Note | Journal dari transaksi Credit Note (uang muka/deposit dari customer) |
| Debit Note | Journal dari transaksi Debit Note (pembayaran uang muka ke supplier) |
| Warehouse Stock Inbound | Journal dari transaksi Inbound yang berasal dari Purchase Order |
| Purchase Invoice | Journal dari transaksi Purchase Invoice |
| Payment to Supplier | Journal dari transaksi Account Payment / pembayaran ke supplier |

> **Catatan Trx Ref:** Untuk journal yang ter-generate dari transaksi turunan, Trx Ref merujuk ke transaksi langsung yang menerbitkan journal — bukan transaksi paling upstream. Contoh: Stock Opname yang mengurangi stock → generate Stock Deduction → Trx Ref journal = nomor Stock Deduction, bukan nomor Stock Opname.
> 

---

## 3. Halaman Datalist

### 3.1 Kolom Datalist

| Kolom | Keterangan | Default Visible |
| --- | --- | --- |
| Trx Code | Trx Date | Nomor transaksi journal + tanggal transaksi | true |
| Type | Tipe journal sesuai list di Section 2 | true |
| Description | Deskripsi dari header journal (Basic Information) | true |
| Curr | Currency yang digunakan | true |
| Exchange Rate | Nilai kurs transaksi | true |
| Total | Total amount journal | true |
| Trx Ref | Nomor transaksi referensi jika ter-generate by system. `-` jika journal manual | true |
| Trx Status | Status terakhir: Draft / Open / Approved / Rejected | true |
| Created at | Created by | Timestamp & user yang membuat | true |

> Kolom yang default visible = false bisa diaktifkan melalui fitur Column Show & Hide.
> 

### 3.2 Fitur Datalist

**Show Deleted Data**

- Checkbox di atas datalist — default: unchecked
- Jika dicentang: tampilkan semua data (aktif + terhapus)
- Data terhapus: kolom Action hanya menampilkan text `deleted`, tidak ada tombol apapun

**Column Show & Hide**

- Fitur standar di semua datalist
- User bisa toggle visibility kolom sesuai kebutuhan
- Kolom yang default hidden bisa diaktifkan dari sini
- Preferensi tersimpan per user

**Export**

Terdapat 2 scope export:

*Export Basic:*

- Hanya export data yang tampil di active page datalist (bukan semua data)
- Tanpa detail journal — hanya data header

*Export Advanced:*

- Export sesuai filter yang aktif. Jika tidak ada filter → export ALL data
- Sub-opsi 1 — **With Details:** data ter-export dengan detail journal per transaksi. Jumlah row based on baris detail journal. Data header di-repeat di setiap row yang berasal dari transaksi yang sama
- Sub-opsi 2 — **Without Details:** hanya export data header journal (1 row per transaksi)
- Sub-opsi 3 — **This Page Only:** export data yang tampil di active page datalist saat user klik export. Definisi "this page" = jumlah data terakhir yang tampil berdasarkan last config user (misal user ubah page size ke 50 → export 50 data, bukan default 20)

**Import**

- Lihat Section 7 — Fitur Import Journal

---

## 4. Status Lifecycle

```
DRAFT → OPEN → APPROVED
             ↘ REJECTED
```

| Status | Keterangan |
| --- | --- |
| Draft | Transaksi baru dibuat / sedang diedit |
| Open | Siap untuk di-approve |
| Approved | Final — masuk ke semua laporan keuangan (GL, Trial Balance, Balance Sheet, P&L) |
| Rejected | Ditolak — tidak bisa di-reverse ke status sebelumnya kecuali user edit transaksi journalnya, maka status rejected akan berubah menjadi DRAFT lagi |

> Journal yang ter-generate otomatis by system langsung berstatus **Approved**.
> 

---

## 5. Halaman Create / Edit Journal

### 5.1 Auto-Create Behavior

Ketika user klik **Create**, sistem langsung menampilkan section Basic Information + Ledger Detail sekaligus dalam 1 halaman — **tanpa perlu save Basic Information terlebih dahulu** — selama semua required field di Basic Information sudah terpenuhi.

### 5.2 Section Basic Information

| Field | Status | Default | Keterangan |
| --- | --- | --- | --- |
| Transaction Code | Required | Auto-generate by system | Bisa diubah. Harus unique. |
| Transaction Date | Required | Datetime now | Jika date now belum ada Fiscal Period yang aktif → auto-save tidak bisa berjalan karena trx date tidak memenuhi requirement. User harus input date yang masuk dalam fiscal period yang aktif. |
| Store | Optional | NULL | Dari Master Store tipe Platform & Others yang statusnya Active |
| Transaction Reference | Optional | NULL | Freetext |
| Currency | Required | Primary currency (dari Master Currency) | Opsi: Master Currency yang Active |
| Exchange Rate | Required | `1` jika primary currency (disabled). Editable jika foreign currency — default value ikut rate primary currency | Field disabled jika currency = primary currency |
| Description | Required | `Default System` jika ter-generate by system. Kosong jika manual | Freetext |
| Select Files to Upload | Optional | — | Attach file eksternal pendukung transaksi |

### 5.3 Section Ledger Detail / Journal Detail

**Input fields di atas datatable:**

| Field | Status | Keterangan |
| --- | --- | --- |
| Select Account | Required | Dari Master COA yang Active. Hanya COA terkecil/child — bukan parent |
| Debit | Conditional Required | Numeric. Wajib diisi jika Credit kosong |
| Credit | Conditional Required | Numeric. Wajib diisi jika Debit kosong |
| Description | Optional | Freetext — deskripsi tambahan untuk baris COA ini |
| Button Save | — | Insert row ke datatable detail journal |

**Kolom datatable detail journal:**

| Kolom | Keterangan | Posisi |
| --- | --- | --- |
| Account | COA Code + Name | Kiri |
| Foreign | Nilai foreign currency (hanya tampil jika currency bukan primary) | Sebelum Debit & Credit |
| Debit | Nilai debit | — |
| Credit | Nilai kredit | — |
| Description | Deskripsi baris | — |
| Action | Tombol Edit & Delete | Paling kanan |

**Action di datatable detail:**

- **Edit** → buka modal kecil untuk edit: Account, Debit/Credit, Description
- **Delete** → hapus row dari datatable

**Summary di bawah datatable:**

```
                              Debit           Credit
Total Amount          USD 10.000       USD 10.000
Equivalent in IDR     IDR 172.000.000  IDR 172.000.000
```

- Total Amount: akumulasi total per kolom Debit & Credit, dalam currency yang digunakan
- Equivalent in IDR: konversi ke IDR = `Total Amount × Exchange Rate`

### 5.4 Sidebar Kanan (Halaman Edit/Show)

| Elemen | Keterangan |
| --- | --- |
| Basic Information | Jump ke section Basic Information |
| Ledger Detail | Jump ke section Ledger Detail |
| Approval | Menampilkan data approval: kapan di-approve & by siapa |
| Audit Log | Menampilkan seluruh history perubahan data journal |
| Radio button Draft / Open | Switch status antara Draft dan Open |
| Save All | Simpan semua perubahan |
| Approve | Hanya muncul jika status = **Open** |

---

## 6. Auto-Generate Journal by System

Journal yang ter-generate otomatis dari relasi transaksi lain memiliki behavior berikut:

### 6.1 Data yang Otomatis Terisi

| Field | Nilai |
| --- | --- |
| Description | Otomatis by system (bukan dari input user) |
| Status | Langsung **Approved** |
| Trx Date | Sama dengan Trx Date referensi transaksinya |
| Created by | User yang melakukan **approve** transaksi referensinya (bukan creator transaksi) |
| Created at | Timestamp saat journal ter-insert ke sistem |
| Approved by | **System** (bukan user) |
| Approved at | Sama dengan Created at |

### 6.2 Trx Ref

- Terisi dengan nomor transaksi yang langsung menerbitkan journal
- Bukan transaksi paling upstream

**Contoh:**

```
Stock Opname → generate → Stock Deduction → generate → Journal
Trx Ref journal = nomor Stock Deduction (bukan nomor Stock Opname)
```

### 6.3 Relasi Transaksi yang Generate Journal

| Transaksi | Tipe Journal yang Terbit |
| --- | --- |
| Sales Invoice | Sales Invoice |
| Outbound (dari order) | Warehouse Stock Outbound |
| Outbound (as expense/internal) | Warehouse Stock Outbound |
| Stock Addition | Stock Adjustment (Addition) |
| Stock Deduction | Stock Adjustment (Deduction) |
| Account Receive (AR) | Payment from Customer |
| Account Payment (AP) | Payment to Supplier |
| Purchase Invoice | Purchase Invoice |
| Purchase Return | Purchase Return |
| Credit Note | Credit Note |
| Debit Note | Debit Note |
| Assembly Inbound | Assembly Inbound |
| Purchase Order Inbound | Warehouse Stock Inbound |

### 6.4 Instant Settlement — journal yang terbit

Saat batch **Instant Settlement** selesai di-approve, sistem mem-posting journal otomatis (via `JournalProcess`) untuk:

| Tahap settlement | Tipe journal (contoh) | Trigger |
|------------------|----------------------|---------|
| Approve Sales Invoice hasil generate | Sales Invoice | Job approve SI settlement |
| Approve Outbound hasil generate | Warehouse Stock Outbound | Job approve OB settlement |
| Approve AR hasil generate | Payment from Customer | Job approve AR settlement |

Journal gagal → counter error di grid settlement + **retry** (batch atau per `settlement_id`); SI/OB approved **tidak di-rollback**. Outbound bisa punya **warnings** (`zero_prevention`) — lihat doc settlement §11.

## Relasi Instant Settlement

**Dampak ke menu ini:** Settlement adalah salah satu **pemicu utama** auto journal (SI, OB, AR) dalam satu batch. Trx Ref journal = nomor dokumen langsung (SI/OB/AR), bukan kode file upload settlement.

**Prasyarat dari menu ini agar settlement lolos:** COA aktif & child valid; fiscal period terbuka; Product COA Group + Settlement Mapping lengkap agar baris jurnal terbentuk.

**Independensi:** Journal manual di menu ini **tidak** terhubung ke settlement. Journal auto hasil settlement mengikuti aturan §6.1 (Approved by System, non-editable).

**Detail alur bulk:** [Instant Settlement](../accounting-settlement-upload/requirement.md) — progress journal, retry, Out Journal warnings.

Diagram integrasi: [Instant Settlement §10](../accounting-settlement-upload/requirement.md#10-relasi-menu--integrasi).

---

## 7. Fitur Import Journal

### 7.1 Struktur Template Excel

| Kolom | Status | Warna Header | Aturan |
| --- | --- | --- | --- |
| Row Number | Required | 🔴 Merah | Integer. Row Number sama = 1 transaksi journal |
| Transaction Date | Required | 🔴 Merah | Format DD-MM-YYYY. Time = waktu saat import dijalankan |
| Description | Optional | Hitam | Deskripsi header journal |
| Memo | Required | 🔴 Merah | Deskripsi per baris COA (sebelumnya "Description") |
| COA Code | Required | 🔴 Merah | Code COA Active, hanya child COA |
| Debit | Conditional Required | 🔴 Merah | Numeric. Wajib jika Credit kosong |
| Credit | Conditional Required | 🔴 Merah | Numeric. Wajib jika Debit kosong |
| Currency | Required | 🔴 Merah | Code currency dari Master Currency Active. Default template: `IDR` |
| Exchange | Required | 🔴 Merah | Numeric. Default template: `1` |
| Reference | Optional | Hitam | Freetext referensi tambahan |

### 7.2 Grouping Logic

- Row Number yang sama = 1 transaksi journal
- 1 Row Number bisa memuat ratusan baris COA — tidak ada batasan maksimal
- Row Number berbeda = transaksi journal berbeda
- 1 file bisa berisi multiple Row Number (multiple transaksi sekaligus)

### 7.3 Validasi Import

| Kategori | Skenario | Pesan Error |
| --- | --- | --- |
| Required Field | Kolom wajib kosong | `Row [X]: [Column Name] cannot be empty.` |
| Row Number | Non-numeric | `Row [X]: Row Number must be a numeric value.` |
| Transaction Date | Format bukan DD-MM-YYYY | `Row [X]: Invalid date format. Please use DD-MM-YYYY.` |
| COA Code | Tidak ditemukan / Inactive | `Row [X]: COA Code [Code] not found or inactive.` |
| COA Code | Parent COA | `Row [X]: COA Code [Code] is a parent account. Only child accounts are allowed.` |
| Debit & Credit | Keduanya kosong | `Row [X]: Either Debit or Credit must be filled.` |
| Debit & Credit | Keduanya diisi | `Row [X]: Debit and Credit cannot both be filled in the same row.` |
| Debit / Credit | Non-numeric | `Row [X]: [Column Name] must be a numeric value.` |
| Currency | Tidak ditemukan / Inactive | `Row [X]: Currency Code [Code] not found or inactive.` |
| Exchange | Non-numeric | `Row [X]: Exchange must be a numeric value.` |
| Balance | Total Debit ≠ Total Credit per Row Number | `Journal [Row Number]: Total Debit and Credit must be equal.` |

**Prinsip:** All-or-Nothing — 1 error → seluruh file ditolak. Semua error dikumpulkan sekaligus.

### 7.4 Post-Import

- Status default: **Open** — tidak auto-approve
- Time Transaction Date: waktu saat import dijalankan

### 7.5 Multi-Currency via Import

- Currency diinput menggunakan Code
- Jika foreign currency → di GL Report tampil dalam IDR (`amount × exchange rate`)
- Di halaman show/edit journal → tampil 2 nilai: foreign amount + IDR equivalent

---

## 8. Aturan Reporting

| Kondisi | Masuk ke Laporan? |
| --- | --- |
| Status Draft | Tidak |
| Status Open | Tidak |
| Status Approved | Ya — GL, Trial Balance, Balance Sheet, P&L |
| Status Rejected | Tidak |

---

## 9. Validasi & Constraint

| Rule | Detail |
| --- | --- |
| COA yang bisa dipilih | Hanya COA Active & child (bukan parent) — di create manual maupun import |
| Balance journal | Total Debit harus = Total Credit sebelum bisa di-approve |
| Trx Code | Unique — bisa diubah selama belum Approved |
| Fiscal Period | Transaction Date harus masuk dalam Fiscal Period yang aktif |
| Debit & Credit | Dalam 1 row: harus salah satu diisi, tidak boleh keduanya kosong atau keduanya diisi |
| Auto-generated journal | Tidak bisa diedit — langsung Approved, non-editable |

---

## 10. Changelog

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mei 2026 — v1.0 Initial Documentation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Doc]    Initial full documentation menu Journal
[New]    13 tipe journal terdokumentasi
[New]    Fitur Import Journal dengan multi-currency support
[New]    Export Advanced: with/without detail, this page only
[New]    Auto-generate journal behavior dari relasi transaksi
[Rule]   Hanya journal Approved yang masuk ke laporan keuangan
[Rule]   Auto-generated journal: Created by = approver
         reference trx, Approved by = System
```