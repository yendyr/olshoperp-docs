---
doc_type: menu-capability
menu: supplychain-new-purchase-inbound
id: SF-INB-01
title: Colli v2 (wadah multi-SKU)
aliases: [COLLI, colli v2, New Colli, Existing Colli, koli, group view]
scope: menu
summary: >-
  Satu kode colli menampung banyak SKU di satu gudang tujuan. Assign
  Existing atau New (plus Colli Type). Opsional; qty penerimaan tidak berubah.
version: 1.1
last_updated: 2026-08-14
status: review
---

# Colli v2 (wadah multi-SKU)

## Apa ini

**Colli v2** adalah **wadah** (box/pallet) dengan satu kode (`COL`) yang bisa berisi **banyak SKU** di **satu Location Destination**. Bukan pecah Stock ID per koli. Qty penerimaan dari PO **tidak berubah** karena colli.

## Kapan dipakai

- Beberapa SKU datang dalam satu box/pallet di lokasi yang sama.
- Pakai kode colli yang sudah ada (**Existing**) atau buat baru (**New** + jenis dari Colli Type).
- **Tanpa colli** juga boleh — baris tetap valid.

## Cara pakai

1. Tambah baris dari Outstanding PO (qty seperti biasa).
2. Pilih **Existing Colli** (hanya kode di gudang yang sama) atau **New Colli** + **Colli Type**.
3. Banyak SKU ke satu wadah: centang baris → **Save**, atau **Bulk Use** + field Colli.
4. **Approve** — qty di dalam colli baru bermakna setelah stok terbit.
5. Master jenis wadah: menu **Colli Type** (Default biasanya sudah terpilih).

## Catatan

- Aturan sama di BETA dan Purchase Inbound lama.
- Satu baris = maksimal satu colli.
- Colli baru bisa hilang jika semua inbound draft yang memakainya dihapus **dan** belum pernah Approve. Setelah Approve, kode permanen.
- Existing colli di gudang lain ditolak.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| 3 SKU, New Colli type Box | Save | Satu kode COL; 3 baris terikat |
| Existing COL di gudang lain | Pilih Existing | Ditolak |
| Hapus inbound draft; COL baru tidak dipakai lain | Delete | COL hilang dari daftar |
| Baris tanpa colli | Skip assign | OK |

## Lihat juga

- [Bulk Use / Single Use](#sf-lingo:SF-DET-01)
- [Import Excel](#sf-lingo:SF-IMP-01)
- Knowledge Base: [§4 Colli v2](../knowledge-base.md)
- Colli Type: [../supplychain-colli-type/](../supplychain-colli-type/)
