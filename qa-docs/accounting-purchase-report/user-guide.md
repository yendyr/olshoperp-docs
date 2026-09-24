---
doc_type: user-guide
menu: accounting-purchase-report
menu_name: "Purchase Report"
version: 1.2
last_updated: 2026-09-23
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: 2.2
owner: QA - Yemima
status: review
---

# Purchase Report — Panduan Pengguna

**Siapa yang baca:** procurement, finance, operations support  
**Menu:** Accounting → Report → **Purchase Report**

---

## 1. Apa Itu & Kenapa Penting

Purchase Report menampilkan pembelian **per barang (SKU)** yang digroup per **supplier**. Dalam satu menu ada dua sudut pandang:

- Tab **Purchase Order** — dari PO (**nanti:** plus retur **unbilled**)  
- Tab **Purchase Invoice** — dari faktur beli / PI (**nanti:** plus retur **billed**)

Pilih tab sesuai sumber yang ingin dicek. Laporan ini **bukan** untuk melihat sisa utang ke supplier (itu laporan AP terpisah).

Di layar, supplier tampil sebagai **kode** (termasuk di header group). Kamu tetap bisa cari by nama; nama boleh muncul di Print (jika ada).

---

## 2. Sebelum Mulai

- [ ] Punya akses menu Purchase Report  
- [ ] Sudah ada data PO dan/atau PI di company aktif  
- [ ] Siapkan rentang tanggal yang relevan (default sistem: **bulan berjalan**)

---

## 3. Langkah singkat

1. Buka **Purchase Report**.  
2. Tab **Purchase Order** terbuka dulu — sesuaikan filter tanggal bila perlu.  
3. Baca group per **kode** supplier; total supplier di header group.  
4. Klik **Trx. Code** untuk membuka dokumen.  
5. Untuk data PI → klik tab **Purchase Invoice**, ulangi filter/export.  
6. Export All atau This Page dari tab yang sedang aktif.

**Contoh:** Butuh rekap SKU dari PO LUKAS bulan ini → tab Purchase Order → filter/search LUKAS (hasil = kode). Butuh rekap dari PI → pindah tab Purchase Invoice.

---

## 4. Yang Perlu Diperhatikan

- **Header group = kode supplier + total**, bukan nama.  
- **PO dan PI tidak muncul bersamaan** — ganti tab.  
- **Status:** saat ini semua status bisa ikut; **setelah perbaikan (ETM-16011)** hanya **Approved / Processed / Complete** (termasuk return).  
- **Total Price** di report tidak memasukkan Other Cost / Other Discount dokumen.  
- **Total Tagihan** line akan **disembunyikan** (sama dengan Total Price); total supplier tetap di header.  
- Default tanggal = **bulan ini** (bukan otomatis 30 hari mundur).  
- Daftar file export PO dan PI **terpisah**.  
- Export **tanpa** nama supplier.  
- Baris **Purchase Return** (setelah rilis): angka **negatif**; unbilled hanya di tab PO, billed hanya di tab PI.

---

## 5. Tips

- Data sepi → longgarkan tanggal dulu; cek status dokumen.  
- Total Price beda dengan total di form PO/PI → cek Other Cost/Disc di dokumen sumber.  
- Salah cari PI di tab PO → pindah tab.  
- Hanya lihat kode supplier? Cari tetap boleh by nama.  
- Cari return: pastikan tipe billed/unbilled sesuai tab.

---

## 6. Referensi

| Dokumen | Isi |
|---------|-----|
| [knowledge-base.md](./knowledge-base.md) | SOP & troubleshooting |
| [requirement.md](./requirement.md) | Aturan bisnis + GAP-PURREP-03 |
| [technical.md](./technical.md) | API & file map |

*Derivatif dari requirement / KB / technical v2.2 (ETM-15673 / ETM-15674 / ETM-15729 / ETM-16011).*
