---
doc_type: menu-capability
menu: accounting-balance-sheet
id: SF-BS-01
title: As at & Apply
aliases: [as at, apply balance sheet, tanggal neraca, period balance sheet]
scope: menu
summary: >-
  Pilih satu tanggal As at lalu klik Apply agar kartu dan kedua tabel neraca
  refresh. Tanpa tanggal terisi, Apply tidak melakukan apa-apa.
version: 1.0
last_updated: 2026-08-12
status: review
---

# As at & Apply

## Apa ini

**As at** = satu tanggal potong neraca. **Apply** memuat ulang kartu ringkasan dan kedua tabel ke tanggal itu. Mengubah tanggal saja tanpa Apply **belum** mengubah angka di layar.

## Kapan dipakai

- Melihat posisi keuangan akhir bulan / akhir tahun.
- Membandingkan tanggal cut-off berbeda (satu per satu — tidak multi-period).
- First load: tanpa ubah tanggal, sistem memakai **hari ini**.

## Cara pakai

1. Buka **Balance Sheet** (default angka hari ini).
2. Pilih tanggal **As at**.
3. Klik **Apply**.
4. Baca [kartu](#sf-lingo:SF-BS-02) dan [dual table](#sf-lingo:SF-BS-03).

## Catatan

- As at kosong + Apply = **no-op** (tidak reload).
- Hanya **satu tanggal** — bukan rentang seperti Profit & Loss.
- Tidak ada export setelah Apply — menu view only.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Baru buka menu | — | Kartu + tabel hari ini |
| Pilih 31 Mar → Apply | Apply | Refresh ke 31 Mar |
| Kosongkan tanggal → Apply | Apply | Tidak berubah |

## Lihat juga

- [Summary cards](#sf-lingo:SF-BS-02)
- [Dual table Assets vs L&E](#sf-lingo:SF-BS-03)
- Feature Map: [feature-map.md](../feature-map.md)
