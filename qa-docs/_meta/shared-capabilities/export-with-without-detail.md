---
doc_type: shared-capability
id: SF-DL-05
title: Export (with / without detail)
aliases: [export all, export with detail, export without detail, unduh excel]
scope: global
summary: >-
  Unduh data datalist ke file (biasanya Excel). Pilih ringkas header saja,
  atau header plus baris detail.
version: 0.2
last_updated: 2026-07-27
status: draft
---

# Export (with / without detail)

## Apa ini

Mengunduh isi daftar ke file spreadsheet. **Without detail** = ringkas per transaksi/header. **With detail** = header ditambah baris item di bawahnya.

## Kapan dipakai

| Kebutuhan | Pakai |
|-----------|--------|
| Rekap daftar transaksi | **Export without detail** |
| Analisis per SKU / baris item | **Export with detail** |
| Kirim data ke Excel untuk laporan offline | Salah satu opsi di atas |

## Cara pakai

1. (Opsional) Terapkan filter / pencarian di datalist dulu — hasil export biasanya mengikuti filter aktif.
2. Klik **Export** (atau **Export All**).
3. Pilih **with detail** atau **without detail** jika diminta.
4. Tunggu proses selesai (volume besar sering lewat antrian / progress), lalu unduh file.

## Catatan

| Opsi | Isi file |
|------|----------|
| Without detail | Baris header / transaksi |
| With detail | Header + baris item terkait |

- Kolom di file mengikuti template export menu, bukan hanya kolom yang terlihat di layar.
- Hak akses & company tetap membatasi data yang bisa diunduh.

## Contoh

| Filter layar | Export | Hasil |
|--------------|--------|--------|
| Status = Approved | With detail | Hanya transaksi approved + baris itemnya |
| Tanpa filter | Without detail | Semua header yang boleh dilihat |

## Lihat juga

- [Global Search & Advanced Filter](#sf-lingo:SF-DL-01)
- Template kolom & progress export: Feature Map / technical menu terkait
