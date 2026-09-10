---
doc_type: menu-capability
menu: accounting-cash-bank-reconcile
id: SF-CBR-04
title: Quick Journal dari matching
aliases: [create journal matching, save and approve journal, offset account]
scope: menu
summary: >-
  Buat journal ringkas dari panel matching untuk menutup Difference,
  tanpa pindah ke halaman Journal. Draft tidak bisa di-Match sampai di-approve.
version: 1.0
last_updated: 2026-09-10
status: review
---

# Quick Journal dari matching

## Apa ini

Form singkat untuk membuat journal yang menutup **sisa Difference** saat matching (arah **1 bank → many GL**). Akun kas/bank diambil dari reconcile; kamu isi akun lawan (offset) dan deskripsi.

> **Status:** TO-BE (ETM-15856). AS-IS tombol Create masih mengarahkan ke halaman Journal penuh (konteks matching hilang).

## Kapan dipakai

- Difference ≠ 0 karena ada bunga, biaya admin, atau mutasi yang belum terjurnal.
- Kamu ingin selesaikan selisih tanpa meninggalkan panel matching.

## Cara pakai

1. Di slideover matching (POV bank→GL), klik **Create journal**.
2. Cek **Transaction date** (default mengikuti tanggal statement) dan currency (terkunci).
3. Isi **Description** sisi kas/bank; nominal kas/bank mengikuti total offset (tidak diketik manual).
4. Pilih **Offset account** + amount (bisa lebih dari satu baris). Akun kas/bank reconcile **tidak** muncul di daftar offset.
5. Cek **Journal preview** (boleh **Swap debit / credit** jika kasusnya memang terbalik, asal tetap balance).
6. **Save as draft** — baca peringatan: draft **tidak** masuk list matching sampai di-approve di Journal Transaction.  
   atau **Save & Approve** — konfirmasi dulu, lalu journal masuk list dan **tercentang**; klik **Match** sendiri.

## Catatan

- Form **ringkas**: tidak ada attachment, store, atau transaction reference seperti form Journal penuh.
- Tanpa hak approve journal → hanya **Save as draft**.
- Dokumen `BR-` sudah Approved → Create journal & Match tidak tersedia.

## Contoh

Difference **150.000** → offset Other Income 120.000 + Bank Admin 30.000 → preview balance → Save & Approve → baris baru tercentang → klik **Match**.

## Lihat juga

- [Matching Slideover](#sf-lingo:SF-CBR-03)
- [Match, Unmatch & Approve](#sf-lingo:SF-CBR-05)
- Requirement: [../requirement.md](../requirement.md) §6.5
