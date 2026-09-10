---
doc_type: knowledge-base
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
version: 1.6
last_updated: 2026-09-10
owner: QA - Yemima
status: review
audience: operator
aliases: [cash bank reconcile, bank reconcile, rekonsiliasi bank, CBR, BR reconcile]
---

# Cash & Bank Reconcile — Knowledge Base

**Audience:** Finance / Accounting  
**Menu:** Accounting → Cash/Bank Reconcile  
**Route:** `/accounting/cash-bank-reconcile`  
**Kode transaksi:** `BR-…`

---

## 1. Apa itu Cash & Bank Reconcile?

Menu untuk **mencocokkan** mutasi di buku besar (journal kas/bank yang sudah disetujui) dengan **mutasi dari bank** (file statement). Tujuannya memastikan angka internal sama dengan angka bank.

**Approve dokumen reconcile** tidak membuat jurnal baru — hanya mengunci hasil pencocokan. Idealnya periode akun ikut terkunci agar tidak ada transaksi baru di tanggal yang sama — kunci periode masih dalam perbaikan; tetap berhati-hati sebelum Approve.

Dari panel matching, nanti bisa **membuat journal ringkas** untuk menutup selisih (perbaikan UI sedang berjalan) — itu beda dari Approve dokumen `BR-`.

---

## 2. Kapan dipakai?

| ✅ Pakai jika | ❌ Jangan jika |
|---------------|----------------|
| Ada bank statement siap di-import | Belum punya journal kas/bank Approved di periode itu |
| Ingin menandai baris sudah dicocokkan | Mau mengoreksi jurnal lewat menu ini (edit di Journal) |
| Siap mengunci hasil rekonsiliasi | Masih ragu isi matching (setelah Approve sulit diperbaiki) |

---

## 3. Alur kerja standar

```mermaid
flowchart TD
    A["Create Cash/Bank Reconcile"] --> B["Isi Period + Cash Bank Account"]
    B --> C["Set status Open + Save"]
    C --> D["Import Bank Statement"]
    D --> E["Cocokkan di Reconcile Process"]
    E --> F["Cek Difference di daftar"]
    F --> G["Approve"]
```

**Keterangan langkah:**

- **Basic Information:** pilih **Period** dan **Cash Bank Account**. Period tidak boleh tumpang tindih dengan dokumen reconcile lain untuk akun yang sama.
- **Open:** set status Open agar matching/import berjalan penuh.
- **Import:** unduh template, isi tanggal + Received **atau** Spent (jangan keduanya), lalu upload. Tanggal harus dalam Period. Bank statement **hanya dari import** — tidak dibuat manual di panel matching.
- **Matching:** di tab Reconcile Process, sistem menyarankan pasangan. Klik Match jika nominal sudah pas; atau buka **See Other……** untuk memilih pasangan di panel matching.
- **Approve:** pastikan Difference sudah masuk akal. Setelah Approved, tidak bisa unmatch/edit.

---

## 4. Membaca daftar (datalist)

| Kolom | Arti |
|-------|------|
| **Trx Code \| Date** | Nomor `BR-` dokumen |
| **Cash/Bank** | Nama akun + nomor rekening |
| **Period** | Rentang tanggal yang direkonsiliasi |
| **Statement Balance** | Total dari file bank |
| **Internal Balance** | Total journal yang sudah dicocokkan |
| **Difference** | Statement dikurangi Internal — ideal mendekati 0 sebelum Approve |
| **Trx Status** | Draft / Open / Approved / Rejected |

Ada Create, pencarian, filter, tampilkan data terhapus, atur kolom, dan export (dengan/tanpa detail).

---

## 5. Form — tiga area utama

### Internal Transaction

Daftar journal kas/bank yang sudah Approved dalam Period. Status **Sudah dicocokkan** / **Belum dicocokkan**.

### Bank Statement

Hanya dari import. Setelah cocok, kolom kode journal terisi otomatis.

**Template import (penting):**

| Kolom | Isi |
|-------|-----|
| TransactionDate | Wajib, format `DD/MM/YYYY` |
| Received | Isi jika uang masuk; kosongkan jika Spent |
| Spent | Isi jika uang keluar; kosongkan jika Received |
| Description | Opsional |

Satu baris salah bisa membuat **seluruh import batal** — perbaiki file lalu upload ulang.

### Reconcile Process

Bank di kiri, journal di kanan, tombol Match di tengah. Sistem bisa menampilkan saran nominal mirip (toleransi sekitar 5%). Saat Match sungguhan, **total harus sama persis** — tidak boleh selisih.

Jika banyak saran: **See N other matching transactions**. Jika tidak ada saran: **See Other……**.

#### Panel matching (arah perbaikan UI)

Panel matching diganti **slideover** (halaman reconcile tetap terlihat di belakang) dengan dua arah kerja:

| Arah | Arti |
|------|------|
| **1 bank → banyak journal** | Satu baris bank ditutup beberapa journal (bisa buat journal ringkas jika masih kurang) |
| **1 journal → banyak bank** | Satu journal ditutup beberapa baris bank (hanya baris hasil import) |

Di bawah panel ada ringkasan **selisih**. Tombol **Match** aktif hanya kalau selisih **0**.

**Misalnya:** bank Receive 3.000.000, journal terpilih 2.850.000 → selisih 150.000. Buat journal untuk 150.000, simpan & setujui journal → baris journal baru **tercentang otomatis** → selisih 0 → **klik Match** (tidak otomatis).

Ganti baris bank/journal yang sedang jadi acuan lewat **Change…** di dalam panel — centangan sebelumnya dibersihkan (ada catatan di pemilih baris).

---

## 6. Match, Unmatch, Approve

| Aksi | Kapan | Catatan |
|------|-------|---------|
| **Match** | Open / Draft (bisa update) | Nominal harus pas; satu baris bank bisa digabung beberapa journal (atau sebaliknya) |
| **Unmatch** | Sebelum Approved | Kedua sisi kembali belum dicocokkan |
| **Approve** (dokumen BR) | Status Open + sudah ada data statement | Dokumen terkunci; **tidak** buat jurnal |
| **Reject** | Dari Open | Bisa dikembalikan ke Draft/Open untuk diperbaiki |

Pesan umum jika Match gagal: bank statement **lebih tinggi/lebih rendah** dari total journal — sesuaikan pilihan sampai nominal sama.

---

## 7. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Match gagal terus | Total journal tidak sama persis dengan bank | Tambah/kurangi baris sampai nominal pas; atau buat journal untuk sisa selisih |
| Tidak ada saran Match | Nominal/tanggal jauh dari journal | Pakai See Other / cari manual |
| Import gagal | Format tanggal, Received+Spent sekaligus, atau tanggal di luar Period | Ikuti template; satu kolom amount saja |
| Period ditolak saat Save | Bentrok dengan dokumen reconcile lain di akun sama | Ubah Period atau akun |
| Sudah Approve, ada mutasi bank tertinggal | Tidak ada Void | Hubungi admin/Dev; cegah dengan cek Difference dulu |
| Acc Number tampil `-` | Nomor rekening belum di master | Lengkapi Master Cash/Bank |
| Journal draft tidak muncul di matching | Draft belum di-approve | Approve di menu Journal Transaction dulu |

---

## 8. FAQ

**Q: Kenapa suggestion “hampir sama” tapi Match ditolak?**  
A: Saran boleh longgar; Match final harus sama persis.

**Q: Bisa unmatch setelah salah pilih?**  
A: Bisa sebelum Approved.

**Q: Kenapa Approve dokumen BR tidak buat jurnal?**  
A: Itu hanya pencocokan. Journal dibuat di menu Journal — atau nanti dari panel matching (journal ringkas) jika masih ada selisih.

**Q: Setelah buat journal dari matching, apakah langsung Match?**  
A: Tidak. Journal yang sudah di-approve hanya ikut terpilih; Anda tetap klik **Match**.

**Q: Bisa buat baris bank statement di panel matching?**  
A: Tidak. Statement hanya dari import; ganti baris acuan lewat **Change bank statement**.

**Q: Rejected berarti dokumen mati?**  
A: Tidak — biasanya masih bisa diubah ke Draft/Open lalu diperbaiki.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
