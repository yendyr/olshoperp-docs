---
doc_type: menu-capability
menu: accounting-balance-sheet
id: SF-BS-05
title: Current Profit/Loss & Equity
aliases: [current profit loss, laba rugi berjalan, equity neraca]
scope: menu
summary: >-
  Current Profit/Loss di kartu menambah atau mengurangi Total Equity.
  Plus = Equity naik; minus = Equity turun. Bergantung mapping COA
  dan (untuk sebagian baris parent) Fiscal Period Open.
version: 1.0
last_updated: 2026-08-12
status: review
---

# Current Profit/Loss & Equity

## Apa ini

**Current Profit/Loss** = laba/rugi berjalan yang ditampilkan di kartu (dan sering di baris COA terkait). Nilai ini **menambah** Total Equity jika positif, atau **mengurangi** jika negatif — supaya sisi kanan neraca mencerminkan hasil berjalan sebelum closing penuh ke Retained Earnings.

## Kapan dipakai

- Menjelaskan kenapa Total Equity ≠ jumlah modal COA saja.
- Cek dampak P&L berjalan ke neraca pada tanggal As at.
- Troubleshooting: kartu Current P/L ada nilai, baris parent Equity 0.

## Cara pakai

1. [As at → Apply](#sf-lingo:SF-BS-01).
2. Baca kartu **Current Profit/Loss**.
3. Bandingkan dengan **Total Equity** di kartu tengah.
4. Di tabel kanan, cari baris/mapping Current P/L dan parent Equity.
5. Jika parent Equity 0 padahal kartu ada nilai → cek **Fiscal Period** Open untuk tanggal As at.

## Catatan

- Mapping Current P/L harus sudah di-set di company accounting.
- Kartu memakai ending Current P/L; sebagian baris parent Equity memakai path “Current” yang butuh Fiscal Period Open — angka bisa beda (masih dalam tinjauan).
- Setelah period close, dampak bisa pindah ke Retained via proses Fiscal Period — bukan tombol di Balance Sheet.

## Contoh

| Given | Efek |
|-------|------|
| Current P/L +2 jt | Total Equity di kartu naik 2 jt |
| Current P/L −1 jt | Total Equity turun 1 jt |
| Period closed untuk As at | Path parent Current P/L bisa 0 meski kartu masih menampilkan ending |

## Lihat juga

- [Summary cards](#sf-lingo:SF-BS-02)
- [How Ending Balance is calculated](#sf-lingo:SF-BS-04)
- Fiscal Period: [../accounting-fiscal-period/](../accounting-fiscal-period/)
- Profit & Loss: [../accounting-profit-loss/](../accounting-profit-loss/)
