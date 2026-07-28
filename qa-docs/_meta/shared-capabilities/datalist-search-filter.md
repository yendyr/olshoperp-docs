---
doc_type: shared-capability
id: SF-DL-01
also: [SF-DL-02]
title: Global Search & Advanced Filter
aliases: [global search, advanced filter, search builder, pencarian, filter lanjutan]
scope: global
summary: >-
  Cara menemukan baris di datalist — kotak pencarian cepat, atau filter per kolom
  dengan operator dan (bila perlu) banyak nilai dalam satu kondisi.
version: 0.3
last_updated: 2026-07-27
status: draft
---

# Global Search & Advanced Filter

## Apa ini

Dua cara mencari data di daftar (datalist). **Global Search** = satu kotak pencarian cepat. **Advanced Filter** = filter per kolom: pilih field, operator, dan nilai — bisa satu atau banyak kondisi sekaligus.

## Kapan dipakai

| Kebutuhan | Pakai |
|-----------|--------|
| Cari kode transaksi, nama supplier, atau kata di deskripsi | **Global Search** |
| Filter status + rentang tanggal + kondisi lain sekaligus | **Advanced Filter** |
| Cari banyak Order ID / kode sekaligus dalam **satu** kondisi | **Advanced Filter** + multi-value (lihat di bawah) |

## Cara pakai

### Global Search

1. Buka menu yang punya datalist.
2. Ketik kata kunci di kotak pencarian di atas tabel.
3. Tekan Enter / tunggu hasil — tabel menampilkan baris yang cocok.

Pencarian hanya mencakup kolom yang disiapkan menu tersebut (bukan selalu semua kolom).

### Advanced Filter — langkah dasar

1. Buka **Advanced Filter** di atas tabel.
2. Pilih **kolom** (field), **operator** (condition), lalu isi **nilai**.
3. (Opsional) Ubah logika antar baris kriteria: **AND** (semua harus cocok) atau **OR** (salah satu cukup).
4. Tambah baris kriteria dengan **+ Add Criteria** bila perlu.
5. **Tutup popup** untuk menerapkan filter (atau **Ctrl + Enter**). Filter **belum** jalan selama popup masih terbuka.

Hapus nilai di multi-value: **Ctrl + Backspace** / **Ctrl + Delete** (lihat tip shortcut di panel filter).

## Operator (condition) per tipe kolom

Operator yang muncul bergantung tipe kolom di menu itu. Label di UI bisa sedikit berbeda; arti praktisnya:

### Teks (string) — contoh: Order ID, Trx Code, nama

| Operator di UI | Arti singkat |
|----------------|--------------|
| **= (equals)** | Persis sama dengan nilai |
| **≠ (not equals)** | Bukan nilai tersebut |
| **Starts with** | Diawali teks |
| **Does not start with** | Tidak diawali teks |
| **Contains** | Mengandung teks di mana saja (default teks) |
| **Does not contain** | Tidak mengandung teks |
| **Ends with** | Diakhiri teks |
| **Does not end with** | Tidak diakhiri teks |
| **Is empty** | Kosong / tidak terisi |
| **Is not empty** | Ada isinya |

### Angka (number)

| Operator di UI | Arti singkat |
|----------------|--------------|
| **= / ≠** | Sama / tidak sama |
| **> / >=** | Lebih besar / lebih besar atau sama |
| **< / <=** | Lebih kecil / lebih kecil atau sama |
| **Is empty / Is not empty** | Kosong / terisi |

### Tanggal / tanggal-waktu

| Operator di UI | Arti singkat |
|----------------|--------------|
| **= / ≠** | Persis hari (atau titik waktu) itu / bukan |
| **> / >=** | Setelah / setelah atau sama |
| **< / <=** | Sebelum / sebelum atau sama |
| **Is between / Is not between** | Di dalam / di luar rentang dua tanggal (default tanggal sering **Between**) |
| **Is empty / Is not empty** | Kosong / terisi |

### Opsi / dropdown (status, pilihan tetap)

| Operator di UI | Arti singkat |
|----------------|--------------|
| **Is / Is Not** | Satu pilihan = / ≠ |
| **In / Not In** | Termasuk / tidak termasuk **beberapa** pilihan sekaligus |

## Satu kondisi, banyak nilai (multi-value)

Berguna untuk: *cari banyak Order ID / kode transaksi sekaligus* tanpa membuat puluhan baris kriteria.

Operator yang mendukung multi-value di field teks/angka (nilai dipisah): **equals**, **not equals**, **contains** / **does not contain** (dan pola like sejenis). Hasil equals banyak nilai ≈ “salah satu dari daftar ini”.

### Cara isi banyak nilai

| Cara | Apa yang kamu lakukan | Tampilan di field value |
|------|------------------------|-------------------------|
| **Koma dalam satu baris** | Ketik `ID-001,ID-002,ID-003` di **satu** field value | Horizontal — satu baris, pemisah **koma** |
| **Enter** | Setelah nilai pertama, tekan **Enter** | Vertikal — muncul baris value baru di bawah |
| **Paste dari Excel (banyak baris / 1 kolom)** | Copy sel bertumpuk di Excel, paste ke field value | Vertikal — tiap baris Excel jadi satu baris value (bukan deret koma) |

Ringkas:

- Pemisah **horizontal** (satu field) = **koma** (`,`).
- Pemisah **vertikal** (beberapa baris value) = **Enter** atau **paste multi-row** dari Excel (newline).

Contoh equals Order ID:

1. Kolom: **Platform Order ID** (atau kolom ID setara di menu).
2. Operator: **= (equals)**.
3. Value: `ORD-100,ORD-101,ORD-102` **atau** paste tiga baris dari Excel.
4. Tutup popup → daftar menampilkan order yang ID-nya ada di daftar itu.

## Catatan

- Filter aktif di layar biasanya **ikut membatasi** data yang di-export — cek [Export](#sf-lingo:SF-DL-05).
- Daftar kolom di Advanced Filter **berbeda per menu**; tidak semua menu punya semua operator/tipe.
- Jangan campur koma *di dalam* satu ID yang memang mengandung koma — sistem menganggap koma sebagai pemisah nilai.
- Spasi di sekitar koma biasanya diabaikan (`A, B` = `A` dan `B`).

## Contoh

| Kebutuhan | Setup singkat |
|-----------|----------------|
| Semua Approved di bulan ini | Status **Is** Approved + Trx Date **Between** awal–akhir bulan |
| Tiga order ID sekaligus | Order ID **=** lalu `ID1,ID2,ID3` atau paste 3 baris Excel |
| Nama mengandung “toko” | Nama **Contains** `toko` |
| Status Draft **atau** Open | Dua kriteria status dengan logika **OR** |

## Lihat juga

- [Export (with / without detail)](#sf-lingo:SF-DL-05)
- Override kolom: Feature Map / requirement § Datalist menu terkait
