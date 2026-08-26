# ETM-8618 — Requirement Before / After

Sumber: [ETM-8618](https://erpintegration.atlassian.net/browse/ETM-8618)  
Tanggal kartu: 28-10-2025 · PIC/Requester: Koko · Status: QA Review

## Requirement Before

Di **Child Warehouse Generator (Prefix Warehouse)**, hanya boleh satu jenis prefix untuk **semua** level — Numeric **atau** Alphabet. Pilihan di level pertama memaksa level di bawahnya sama.

## Requirement After

User dapat memilih **Prefix Type berbeda per level**.

Contoh:

- Level Lantai / Aisle → **Numeric**
- Level Rack → **Alphabet**
- Level Shelf → **Numeric**

Kombinasi Numeric + Alphabet antar level diperbolehkan. Tidak membatasi pilihan prefix antar level.

## Dampak

- Hanya saat **create** warehouse baru
- Warehouse existing tidak berubah
- Tidak ada perubahan struktur data — validasi + UI Prefix Type per baris

## Referensi docs

`qa-docs/supplychain-warehouse-structure/requirement.md` (draft) — V-07 Prefix unique/alphabet tetap berlaku; TO-BE Prefix Type per level belum tertulis eksplisit di docs (expected dari kartu).
