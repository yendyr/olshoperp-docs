---
doc_type: menu-capability
menu: supplychain-sales-returns
id: SF-SR-05
title: Save & handoff to Finance
aliases: [waiting finance, complete sales return, handoff return]
scope: menu
summary: >-
  Setelah gudang mengisi qty, SR tetap Open dan menunggu Finance Complete.
  Tombol Complete memang tidak tersedia di menu SCM.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Save & handoff to Finance

## Apa ini

Pemisahan tugas Sales Return: gudang scan dan mengisi qty; Finance mereview nilai lalu **Complete** di menu Accounting.

## Kapan dipakai

- Gudang selesai mengelompokkan Restock/Broken/Lost.
- SR sudah auto-save dan siap direview Finance.

## Cara pakai

1. Pastikan qty sudah tersimpan dan muncul pesan menunggu Finance.
2. Kembali ke datalist atau lanjut order berikutnya.
3. Finance membuka `/accounting/sales-return`.
4. Finance review harga/COGS lalu **Complete**.
5. Setelah Complete, cek stok/jurnal; return Billed menghasilkan Credit Note.

## Catatan

- Tidak ada tombol **Complete** di SCM — ini normal.
- SR **Open** bisa dihapus sebelum proses approval berjalan; qty reserved akan dilepas.
- Auto-approve dapat menyelesaikan SR open sesuai Global Setting.
- Setelah Approved, dokumen hanya dapat dilihat.

## Lihat juga

- [Restock / Broken / Lost](#sf-lingo:SF-SR-04)
- Finance: [Complete](../../accounting-sales-return/capabilities/sf-sra-01-complete.md)
- Credit Note: [How CN is created](../../accounting-credit-note/capabilities/sf-cn-01-how-cn-is-created.md)
