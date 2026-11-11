# Dev - Sales Order — Dokumentasi

Menu **Dev - Sales Order** — CRUD/import SO **internal** (`type_sales_order = general`).  
Route: `/businessdevelopment/sales-order-general`

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, Support | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA | review |
| Technical | [technical.md](./technical.md) | Developer | review |
| User Guide | [user-guide.md](./user-guide.md) | Publish eksternal | review |
| Test Cases (ETM-5428 Print VOIDED) | [ETM-5428/test-cases/](./ETM-5428/test-cases/) | QA | draft (3 DRAFT) |

**SoT:** busdev SO General v1.0 + Fulfillment Mode TO-BE  
**User-guide:** v1.9 · `source_version` 3.11  
**Version (3 layer):** 3.11 · **Last updated:** 2026-11-09 09:30

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 3.11 | 2026-11-09 09:30 | Export All: dua export dengan judul file sama sekarang tersimpan sebagai file terpisah, tidak saling menimpa. Contoh saran nama file mengikuti yang tampil di layar (Sales Order General - ...) (ETM-16769) |
| 3.10 | 2026-11-05 16:55 | Void atau Void & Recreate pada order yang masih di Wave (belum diambil) mengeluarkan order dari Wave dan mengembalikan stok yang ditahan supaya bisa dijual lagi. Void setelah barang diambil tetap seperti semula (ETM-17110) |
| 3.9 | 2026-11-05 15:06 | Export All (With Details dan Without Details) wajib isi judul file di dialog Export File Name sebelum unduh. Nama itu yang tampil di riwayat export dan jadi nama file. Export Active Page Only tetap langsung, tanpa dialog (ETM-16768) |
| 3.8 | 2026-11-05 14:55 | Import Non-Processed: beberapa order dengan SKU yang sama di satu unggahan tidak lagi gagal stok hanya karena proses berjalan bersamaan pada batch masuk yang sama. Sistem mengunci baris stok lalu memakai batch berikutnya yang masih ada (ETM-17081) |
| 3.7 | 2026-11-04 15:40 | Import Excel: harga dengan titik atau koma dibaca sebagai harga yang benar (contoh 10000.6789 = Rp 10.000,6789). Lebih dari 4 angka desimal ditolak. Order gagal jika total baris tidak sama dengan total header, walau selisihnya 1 rupiah (ETM-17055) |
| 3.5 | 2026-08-31 13:40 | Status Dev - Sales Order: Rejected tetap bisa diedit; Closed dan Void dipisah (bukan satu kelompok “tidak bisa diubah”) |
| 3.4 | 2026-08-12 | TO-BE Benchmark COGS snapshot = effective Manual COGS (GAP-BM-14 / GAP-SOG-15) |
| 3.0 | 2026-07-22 | Rewrite SoT v1.0; 5 file + user-guide |
| 3.1 | 2026-07-22 | Dual import **Import Processed** / **Import Non-Processed**; Fulfillment Mode; GAP-SOG-07…12 |
| 3.2 | 2026-07-23 | Sheet 2 Other Cost/Disc code ambiguity → order fail (GAP-SOG-13) |
| 3.3 | 2026-08-11 | TO-BE Error Flag **Below Benchmark COGS**; GAP-SOG-14 / GAP-BM-13 |

## Related menus

| Menu | Link |
|------|------|
| Store (Fulfillment Mode) | [../omni-store-binding/](../omni-store-binding/) |
| All Sales Order | [../all-sales-order/](../all-sales-order/) |
| Dev - Sales Platform | [../omni-sales-platform/](../omni-sales-platform/) |
| Skip Wave Process | [../omni-skip-wave-process/](../omni-skip-wave-process/) |

**Maintenance owner:** QA — Yemima
