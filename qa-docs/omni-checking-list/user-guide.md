---
doc_type: user-guide
menu: omni-checking-list
menu_name: "Checking List"
version: 1.0
last_updated: 2026-09-29
owner: QA - Yemima
status: review
audience: end-user
---

# Checking List — User Guide

Cara memakai **Checking List** untuk QC setelah picking.

**Alamat:** `/omni/checking-list`

> Tampilan process sedang di-revamp ([ETM-16138](https://erpintegration.atlassian.net/browse/ETM-16138)). Langkah mengikuti perilaku + keputusan bisnis terkini.

---

## 1. Buka Checking List

1. Menu Processing › **Checking List**.  
2. Pilih dokumen → Action / edit.  
3. Jika diminta, **Set Location** stasiun checking dulu.

---

## 2. Check barang

1. Centang **Check** per baris (seluruh qty baris ikut checked).  
2. **Uncheck** jika salah.  
3. Check hanya penanda — Anda tetap bisa **Complete** meski ada yang belum di-check.

---

## 3. Barang rusak → Replace

1. Pause bila diminta sistem, lalu buka **Replace** (modal terpisah — bukan tombol Check).  
2. Isi qty replace, pilih rack/stok pengganti, reason.  
3. Konfirmasi — sistem menyiapkan TF ke scrap dan TF barang pengganti ke outrack.  
4. Stok benar-benar pindah saat Anda **Complete** checking.

---

## 4. Complete

1. Klik **Complete & Next**.  
2. Jika order cancel/void dan checking manual, pilih: lanjut Packing, atau Void (tanpa TF scrap/replace).  
3. Lihat ringkasan (TO-BE) lalu lanjut Packing / next order.

---

## 5. Tips

- Replace beda lokasi biasanya muncul sebagai baris terpisah.  
- Skip Wave / Skip Processing: tidak ada pertanyaan cancel di Complete.  
- Settlement marketplace butuh order sampai Shipped — selesaikan checking dulu.
