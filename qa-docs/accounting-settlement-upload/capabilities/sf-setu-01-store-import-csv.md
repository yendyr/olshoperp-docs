---
doc_type: menu-capability
menu: accounting-settlement-upload
id: SF-SETU-01
title: Store Select & Import CSV
aliases: [import settlement, upload csv, pilih store]
scope: menu
summary: >-
  Pilih store lalu upload file CSV settlement. Satu file = satu toko; sistem validasi lalu generate SI, Outbound, dan jurnal.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Store Select & Import CSV

## Apa ini

Cara memulai Instant Settlement: pilih **Store**, lalu **Import** file `.csv` settlement marketplace (atau template General). Satu file = satu toko (`ST-…`).

## Kapan dipakai

- Ada file settlement Shopee / TikTok / Lazada / General siap diunggah.
- Order sudah Shipped ke WH 3PL dan prasyarat mapping/COA/fiscal siap.

## Cara pakai

1. Buka FA → Settlement → **Instant Settlement**.
2. Pilih **Store** di kanan atas (wajib sebelum import).
3. Klik **Import** → pilih file **`.csv`** (bukan Excel).
4. Pantau badge import & kolom **Progress Status**.

## Catatan

- Excel sering mengubah Order ID panjang jadi notasi ilmiah → order tidak ketemu → seluruh batch gagal. Simpan sebagai CSV.
- Tanpa store, Import tidak jalan.
- Setelah import sukses, sistem otomatis lanjut 5 tahap upload (lihat [Upload Progress](#sf-lingo:SF-SETU-04)).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Store dipilih, CSV valid | Import | Batch `ST-…` + Upload Progress jalan |
| Store kosong | Import | Tidak bisa / ditolak |

## Lihat juga

- [Download Template](#sf-lingo:SF-SETU-02)
- [All-or-nothing Validasi](#sf-lingo:SF-SETU-03)

