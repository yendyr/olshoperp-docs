---
doc_type: menu-capability
menu: omni-skip-wave-process
id: SF-SW-01
title: Upload Excel / Template Order No
aliases: [upload skip wave, template order no, download template]
scope: menu
summary: >-
  Download template satu kolom Order No, isi Excel, lalu upload agar sistem mengirim order ke Default Wave dan memproses sampai Shipped.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Upload Excel / Template Order No

## Apa ini

Cara utama memakai Skip Wave Process: unduh **template**, isi **Order No**, lalu **upload** file. Sistem memproses batch sampai order shipped — tanpa bolak-balik Unassign Wave dan Skip Processing.

## Kapan dipakai

- Banyak order approved yang belum masuk Default Wave.
- Mau satu batch sampai Shipped.
- Siap menunggu antrian jika ada batch lain yang sedang jalan.

## Cara pakai

1. Set **Processing Date** di pojok kiri atas (boleh kosong = waktu sekarang).
2. Download **template** (satu kolom: **Order No** — internal atau platform).
3. Isi file (`xlsx` / `xls` / `csv`), maksimal **1.000** order per file.
4. Klik **Upload** di Skip Wave Process.
5. Pantau datalist: status batch, **Wave Progress**, kolom **Skip Processing**.

## Catatan

- Ukuran file mengikuti limit server (tidak ada batas khusus di menu).
- Menu ini **khusus upload** — tidak memilih order dari list.
- Validasi Import bersifat all-or-nothing → lihat [All-or-nothing Import](#sf-lingo:SF-SW-03).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| 50 Order No valid | Upload | Batch masuk antrian / processing |
| 49 valid + 1 kosong | Upload | Seluruh file gagal Import — perbaiki lalu upload ulang |

## Lihat juga

- [Processing Date](#sf-lingo:SF-SW-02)
- [All-or-nothing Import](#sf-lingo:SF-SW-03)
- Requirement: [§5 Form & Field](../requirement.md)

