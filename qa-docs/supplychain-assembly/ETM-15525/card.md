# ETM-15525 — Requirement Before / After

**Judul:** [Assembly] - Max Assembly Qty & validasi stok komponen tidak menyesuaikan alternative unit (BOX)

## Summary

Di Assembly, saat unit FG diganti ke alternative **BOX** (`1 BOX = 10 PCS`), Max Assembly Qty / field QTY tidak menyesuaikan konversi. Bug asli: Open/Approve bisa lolos meski stok komponen (PCS) tidak cukup.

## Data reproduce

| Item | Nilai |
|------|--------|
| FG | `ASS-R` (PCS primary; BOX = 1 BOX = 10 PCS) |
| Komponen | `COMP-R1` 500 PCS, `COMP-R2` 500 PCS |
| Max Assembly Qty (PCS) | ≈ 500 |
| Kapasitas aman (BOX) | ≈ 50 BOX |

> Comment REOPEN sempat pakai `ASS-CHARMBUN`; automation / TC folder ini memakai **`ASS-R`** (data description kartu).

## Requirement After (acceptance)

1. **Max Assembly Qty** terhitung ulang ke satuan BOX saat unit diganti (≈ 50, bukan tetap 500).
2. **Field QTY ikut terkonversi** saat unit berubah (AC comment REOPEN 2026-08-12).
3. **Open ditolak** jika QTY BOX melebihi kapasitas stok komponen (pesan stock BoM tidak memenuhi; status tetap Draft).

## Referensi docs

`qa-docs/supplychain-assembly/requirement.md` — A-17, A-19, A-24, A-27, §4.2.1, G-05.
