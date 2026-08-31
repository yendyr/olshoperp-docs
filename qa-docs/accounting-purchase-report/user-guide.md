---
doc_type: user-guide
menu: accounting-purchase-report
menu_name: "Purchase Report"
version: 1.0
last_updated: 2026-08-31
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: 2.0
owner: QA - Yemima
status: review
---

# Purchase Report — Panduan Pengguna

**Siapa yang baca:** procurement, finance, operations support  
**Menu:** Accounting → Report → **Purchase Report**

---

## 1. Apa Itu & Kenapa Penting

Purchase Report menampilkan pembelian **per barang (SKU)** yang digroup per **supplier**. Dalam satu menu ada dua sudut pandang:

- Tab **Purchase Order** — dari PO  
- Tab **Purchase Invoice** — dari faktur beli (PI)

Pilih tab sesuai sumber yang ingin dicek. Laporan ini **bukan** untuk melihat sisa utang ke supplier (itu laporan AP terpisah).

---

## 2. Sebelum Mulai

- [ ] Punya akses menu Purchase Report  
- [ ] Sudah ada data PO dan/atau PI di company aktif  
- [ ] Siapkan rentang tanggal yang relevan (default sistem: **bulan berjalan**)

---

## 3. Langkah singkat

1. Buka **Purchase Report**.  
2. Tab **Purchase Order** terbuka dulu — sesuaikan filter tanggal bila perlu.  
3. Baca group per supplier; total supplier di header group.  
4. Klik **Trx. Code** untuk membuka dokumen.  
5. Untuk data PI → klik tab **Purchase Invoice**, ulangi filter/export.  
6. Export All atau This Page dari tab yang sedang aktif.

**Contoh:** Butuh rekap SKU dari PO LUKAS bulan ini → tab Purchase Order → filter/search LUKAS. Butuh rekap dari PI → pindah tab Purchase Invoice.

---

## 4. Yang Perlu Diperhatikan

- **PO dan PI tidak muncul bersamaan** — ganti tab.  
- **Semua status** dokumen bisa ikut (termasuk draft), selama masuk filter tanggal.  
- **Total Price** di report tidak memasukkan Other Cost / Other Discount dokumen.  
- Default tanggal = **bulan ini** (bukan otomatis 30 hari mundur).  
- Daftar file export PO dan PI **terpisah**.

---

## 5. Tips

- Data sepi → longgarkan tanggal dulu.  
- Total Price beda dengan total di form PO/PI → cek Other Cost/Disc di dokumen sumber.  
- Salah cari PI di tab PO → pindah tab.

---

## 6. Referensi

| Dokumen | Isi |
|---------|-----|
| [knowledge-base.md](./knowledge-base.md) | SOP & troubleshooting |
| [requirement.md](./requirement.md) | Aturan bisnis AS-IS |
| [technical.md](./technical.md) | API & file map |

*Derivatif dari requirement / KB / technical v2.0 (ETM-15673 / ETM-15674).*
