---
doc_type: user-guide
menu: accounting-customer-payment
menu_name: "Account Receive"
version: 1.7
last_updated: 2026-11-11
owner: QA - Yemima
status: review
source_docs:
  - requirement.md
  - knowledge-base.md
  - technical.md
source_version: 2.13
---

# Account Receive — User Guide

## 1. Apa Itu & Kenapa Penting

**Account Receive** adalah tempat Anda mencatat uang yang masuk dari customer dan menandai tagihan mana yang sudah terbayar.

Tanpa pencatatan ini, tagihan akan terus terlihat belum lunas walaupun uangnya sudah masuk ke rekening. Menu ini yang menutup jarak antara mutasi rekening dan daftar piutang.

Kalau dalam sehari ada puluhan pelunasan, Anda tidak perlu membuat dokumen satu per satu — tersedia fitur **Import** yang membaca satu file Excel dan membuat semua dokumennya sekaligus.

Di daftar, kolom **Description** menampilkan deskripsi tiap dokumen. Anda bisa mencari dan mengurutkan kolom itu. Saat mengekspor daftar, termasuk berkas **Receive per tanggal**, deskripsi ikut tertulis di file.

## 2. Overview Flow & Proses Bisnis

```mermaid
flowchart TD
    A[Customer transfer] --> B[Catat di Account Receive]
    B --> C[Cocokkan dengan tagihan]
    C --> D[Approve]
    D --> E[Tagihan tercatat lunas]
```

**Kalau diagram di atas tidak tampil, alurnya begini:**

1. Customer mengirim uang.
2. Anda mencatatnya di Account Receive, manual atau lewat Import.
3. Anda menentukan tagihan mana yang dilunasi uang tersebut.
4. Dokumen di-Approve.
5. Tagihan tercatat lunas dan pembukuan ikut terbarui.

## 3. Sebelum Mulai (Flow Sebelum)

Pastikan hal-hal ini sudah siap:

- **Tagihan sudah disetujui.** Tagihan yang masih draft atau sudah dibatalkan tidak bisa dilunasi.
- **Akun bank sudah terdaftar dan aktif.** Kalau akun banknya sedang nonaktif, pencatatan akan ditolak.
- **Periode pembukuan masih terbuka** untuk tanggal transaksi yang Anda pakai.
- **Kalau customer membayar dengan deposit**, pastikan Credit Note-nya sudah disetujui dan saldonya cukup.

## 4. Setelah Selesai (Flow Sesudah)

- Dokumen yang baru dibuat berstatus **Open** — sudah tercatat, tapi belum masuk pembukuan.
- Setelah Anda **Approve**, pembukuan terbarui dan tagihan resmi berkurang.
- Kalau ada kelebihan bayar yang Anda tandai sebagai deposit (`CREDIT NOTE` di sheet ketiga), sistem membuatkan Credit Note baru **langsung setelah import** (status Open) atas nama customer tersebut untuk dipakai di transaksi berikutnya.

🎬 [Interactive demo akan ditambahkan di sini]

## 5. Yang Perlu Diperhatikan

- **Summary:** Setelah section Adjustment di form Show/Edit, ada panel ringkasan read-only (Piutang, Cash/Bank, Credit Note, Adj, Total) dalam mata uang header. Total sebaiknya 0,00; jika tidak, angka Total berwarna orange (peringatan visual saja). Detail aturan: card [ETM-16644](https://erpintegration.atlassian.net/browse/ETM-16644).
- **Approve:** Tombol Approve muncul hanya jika status **Open**. Create/autosave saat ini masih **Draft** — ubah ke Open dulu (nanti default Open: [ETM-17325](https://erpintegration.atlassian.net/browse/ETM-17325)). Setelah Approve, muncul **Approval Log** dan sistem membuat **Journal** yang tertaut ke dokumen AR ini.
- **Satu transaksi bank, satu dokumen.** Kalau di rekening ada tiga transfer masuk, tulis tiga baris — meski banknya sama dan tanggalnya sama. Sistem tetap membuat tiga dokumen terpisah.
- **Satu kesalahan membatalkan seluruh file.** Ini disengaja, supaya tidak ada file yang masuk separuh dan menyisakan pelunasan menggantung.
- **Satu transaksi bank hanya untuk satu customer.** Tagihan milik beberapa customer tidak boleh digabung dalam satu baris uang masuk.
- **Hasil import belum masuk pembukuan.** Selalu ada tahap Approve setelahnya.
- **Jangan hapus Credit Note hasil kelebihan bayar** sebelum Account Receive terkait di-Approve. Kalau dihapus, Approve akan ditolak, dan Anda tidak bisa membuat Credit Note itu lagi dari form edit Account Receive — kembalikan Credit Note-nya atau ulang import.
- **Hanya boleh ada satu proses import berjalan.** Kalau ditolak karena ada proses lain, tunggu sampai selesai.

## 6. Langkah-Langkah (Step by Step)

### Mencatat lewat Import

1. Buka **Accounting → Account Receive**.
2. Unduh template Excel dari menu. Selalu pakai template ini — file buatan sendiri akan ditolak.
3. Isi **sheet pertama** dengan uang yang masuk: tanggal, sumber dana, dan jumlahnya. Satu baris untuk satu transaksi bank. Kolom deskripsi boleh dikosongkan; sistem akan mengisinya sendiri dengan daftar nomor tagihan.
4. Isi **sheet kedua** dengan tagihan yang dilunasi: nomor tagihan, jumlah yang dibayarkan, dan **nomor baris Excel** dari sheet pertama sebagai penanda pengikat.
5. Isi **sheet ketiga** hanya kalau ada selisih antara uang masuk dan nilai tagihan. Kalau tidak ada selisih, biarkan kosong.
6. Upload file. Proses berjalan di belakang layar — tunggu, jangan upload berulang kali.
7. Kalau ada yang salah, buka panel **Import Log**. Semua kesalahan ditampilkan sekaligus lengkap dengan nomor sheet dan nomor barisnya.
8. Perbaiki semua yang dilaporkan, lalu upload ulang.
9. Setelah berhasil, dokumen muncul di daftar berstatus **Open**. Periksa lalu **Approve**.

### Memilih tagihan di dokumen yang sudah ada

1. Buka Account Receive yang masih **Draft** atau **Open**.
2. Di bagian detail, pilih tagihan lewat **Select Invoice**.
3. Cek **Receiving Destination**. Harus ada baris dengan jumlah yang sama dengan tagihan itu. Misalnya tagihan 105.000, baris penerimaan juga 105.000.
4. Anda tidak perlu memuat ulang halaman. Kalau barisnya belum muncul, tunggu sebentar lalu cek lagi.

### Mengisi penanda pengikat

Kolom penanda di sheet kedua dan ketiga meminta **nomor baris Excel** dari sheet pertama — angka yang terlihat di sisi kiri layar Excel, bukan nomor urut data Anda.

Misalnya uang masuk ada di baris 5 sheet pertama, maka semua tagihan yang dilunasi uang itu diisi angka 5 di kolom penanda. Salah isi di sini membuat tagihan menempel ke transaksi bank yang keliru.

### Kalau uang masuk tidak persis sama dengan tagihan

| Situasi | Yang Anda isi di sheet ketiga | Hasilnya |
|---|---|---|
| Uang masuk lebih besar, kelebihan disimpan sebagai deposit | Ketik `CREDIT NOTE`, isi kelebihannya di kolom **Credit** | Sistem membuatkan deposit baru untuk customer |
| Uang masuk lebih besar, kelebihan diakui sebagai pendapatan | Isi kode akun pendapatan, nilainya di kolom **Credit** | Kelebihan masuk ke akun tersebut |
| Uang masuk lebih kecil dari tagihan | Isi kode akun biaya, selisihnya di kolom **Debit** | Tagihan tetap lunas penuh, selisih tercatat sebagai biaya |

Dalam satu baris isi salah satu saja — Debit atau Credit, tidak boleh dua-duanya.

## 7. Tips & Hal yang Sering Bikin Bingung

**"Tagihan 500.000, uang masuk 550.000."** (Import) Ketik `CREDIT NOTE` di sheet ketiga dengan Credit 50.000. Tagihan lunas 500.000 dan customer punya deposit 50.000 untuk dipakai lain kali.

**"Tagihan 500.000, uang masuk cuma 493.500."** (Import) Isi kode akun biaya di sheet ketiga dengan Debit 6.500. Tagihan tetap dianggap lunas penuh, selisih 6.500 tercatat sebagai biaya.

**"Tagihan 1.000.000, uang masuk bank cuma 990.000 karena admin bank."** (Form edit — Adjustment Debit) Di Detail isi pelunasan 1.000.000. Di Receiving Destination isi bank 990.000. Di Adjustment pilih akun biaya admin bank, isi **Debit** 10.000, simpan. Customer tetap lunas penuh; 10.000 jadi biaya internal. Jangan turunkan Paid Amount jadi 990.000 — itu membuat seolah masih ada sisa piutang.

**"Tagihan 1.000.000, uang masuk 1.010.000 dan kelebihan mau jadi pendapatan (bukan deposit)."** (Form edit — Adjustment Credit) Detail 1.000.000; Receiving Destination 1.010.000; Adjustment **Credit** 10.000 ke akun pendapatan. Balance: 1.000.000 + 10.000 = 1.010.000. Kalau kelebihan mau jadi deposit customer, pakai import `CREDIT NOTE`, bukan Adjustment form.

**"Kenapa angkanya dibilang tidak cocok?"** Per nomor penanda, hitung seperti ini: **uang masuk (sheet 1) = total bayar tagihan (sheet 2) + selisih (sheet 3)**. Di sheet 3, angka di kolom **Credit** menambah total; angka di kolom **Debit** mengurangi. Contoh: uang 550.000, tagihan 500.000, Credit Note 50.000 → cocok. Kalau uang 550.000 dan tagihan 500.000 tanpa sheet 3 → sistem bilang timpang. Pesan error menyebut baris mana yang bermasalah.

**"Tagihan ini kelihatan belum dibayar, kenapa ditolak?"** Kemungkinan ada dokumen pelunasan lain yang masih Open dan sudah memesan sebagian nilainya. Pesan yang muncul menyebutkan nilai yang tertahan itu.

**"Kode bank saya ada di master, kenapa ditolak?"** Biasanya karena akun atau data banknya sedang nonaktif.

**"Kenapa muncul keluhan input dikenali sebagai dua hal sekaligus?"** Ada kode akun bank dan nomor deposit yang kebetulan persis sama. Ubah salah satu penamaannya.

**"Dokumen AR muncul sendiri, dari mana?"** Kalau Anda menyetujui batch di menu Instant Settlement, sistem otomatis membuat dokumen pelunasan untuk tagihan hasil batch itu. Tagihan yang sudah Anda lunasi manual tidak akan dibuatkan lagi. Tanggal AR mengikuti tanggal Sales Invoice (semua SI di batch harus hari yang sama); jam AR mengambil jam SI paling akhir di batch.

**"Saya sudah pilih invoice, kenapa Receiving Destination kosong?"** Tunggu section itu selesai dimuat ulang, lalu cek lagi. Jumlahnya harus sama dengan tagihan yang baru dipilih.

## 8. Referensi

| Kebutuhan | Dokumen |
|---|---|
| Aturan rinci dan daftar pesan penolakan | [requirement.md](./requirement.md) |
| Panduan operasional dan troubleshooting | [knowledge-base.md](./knowledge-base.md) |
| Detail teknis untuk developer | [technical.md](./technical.md) |
| Menu tagihan | [Sales Invoice](../accounting-customer-invoice/user-guide.md) |
| Menu deposit customer | [Credit Note](../accounting-credit-note/user-guide.md) |
| Menu settlement | [Instant Settlement](../accounting-settlement-upload/user-guide.md) |
