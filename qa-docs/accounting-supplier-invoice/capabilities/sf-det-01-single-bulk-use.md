---
doc_type: menu-capability
menu: accounting-supplier-invoice
id: SF-DET-01
title: Insert Inbound — Single Use & Bulk Use
aliases: [single use, bulk use, inbound transaction, insert SKU]
scope: menu
summary: >-
  Dari form Purchase Invoice, masukkan SKU dari inbound yang sudah approved.
  Single Use = satu baris dengan qty bisa diubah; Bulk Use = banyak baris
  sekaligus dengan qty penuh outstanding.
version: 0.2
last_updated: 2026-07-27
status: draft
---

# Insert Inbound — Single Use & Bulk Use

## Apa ini

Cara mengisi detail Purchase Invoice dari barang masuk (inbound) yang sudah approved. **Single Use** memasukkan satu baris dan kamu bisa mengatur qty. **Bulk Use** memasukkan banyak baris sekaligus dengan qty = seluruh sisa yang belum ditagih (outstanding).

## Kapan dipakai

- Membuat PI baru setelah barang inbound sudah approved.
- Menagih sebagian qty dari satu inbound (Single Use).
- Menagih banyak SKU sekaligus tanpa isi qty satu per satu (Bulk Use).

## Cara pakai

1. Pastikan header PI sudah punya **Supplier** (dan field wajib lain).
2. Di area detail, klik **Inbound Transaction**.
3. Cari PO / inbound, lalu pilih baris yang masih punya outstanding.
4. Pilih salah satu:
   - **Use** (Single Use) — isi qty (maksimal = outstanding), lalu konfirmasi.
   - **Bulk Use** — pilih beberapa baris; qty tiap baris = outstanding penuh.
5. Setelah baris masuk ke detail, **Save All** header PI.

## Catatan

- Qty default = outstanding; tidak boleh melebihi sisa yang boleh ditagih.
- Sisa outstanding = qty inbound dikurangi yang sudah/sedang ditagih dan retur.
- Outstanding 0 tapi masih ada di PI draft lain → aksi sering tampil **Already Prepared**; baris hilang dari modal setelah full processed.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Inbound 10 pcs, belum ditagih | Single Use qty 4 | 4 masuk PI; sisa outstanding 6 |
| Inbound 10 pcs, 3 SKU outstanding penuh | Bulk Use ketiga baris | Semua masuk PI dengan qty = outstanding masing-masing |
| Baris sudah full ditagih di PI lain | Buka modal | Baris tidak muncul / Already Prepared |

## Lihat juga

- [Partial invoicing per SKU](#sf-lingo:SF-PI-01)
- Requirement: [§5.2 Detail](../requirement.md#52-detail--inbound-transaction)
