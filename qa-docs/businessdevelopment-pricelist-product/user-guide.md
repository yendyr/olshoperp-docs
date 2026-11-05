---
doc_type: user-guide
menu: businessdevelopment-pricelist-product
menu_name: "Pricelist Product"
version: 1.5
last_updated: 2026-11-05
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: "1.5"
owner: QA - Yemima
status: review
---

# Pricelist Product — Panduan Pengguna

**Menu:** Business Development → Price → Pricelist Product

---

## 1. Apa itu

Daftar harga jual per produk. Angka besar = **Final Price**. Angka kecil = **User Set Margin** — hanya muncul jika kamu mengubah harga manual; jika belum diubah, tampil **`-`** (detail hitungan tetap bisa dilihat di tooltip).

---

## 2. Setelah Update dari Category

1. Cek kolom **Weight** (dari System Product primary).
2. Lihat **Final Price** (besar). **User Set Margin** tetap `-` kalau kamu belum edit manual.
3. Arahkan mouse ke area margin → pecahan per tier (tooltip calculation).
4. Arahkan mouse ke **nama kolom category** → ringkasan tier + waktu **Last Update to Pricelist**.

Contoh: 16.000 + berat 1.500 g → Final **24.500**; User Set Margin `-`.

---

## 3. Ubah harga manual (Manual Price)

1. Klik **Final Price** (atas) atau **User Set Margin** (bawah) — tooltip: *Click to edit Final Price* / *Click to edit User Set Margin*.
2. Enter simpan / Esc batal.
3. Angka User Set Margin jadi **oranye** = diubah manual.

**Update to Pricelist** dari Category **tidak menghapus** margin oranye. Final bisa berubah karena tier category ditambahkan ke margin kamu (contoh: margin kamu 2.000 + tier 1.500 → Final naik).

**Reset:** kosongkan / hapus isi margin → kembali `-`, Final mengikuti Category saja, warna oranye hilang.

### Cari yang sudah diedit manual (ETM-16861)

Advanced Filter → **Manual Margin** → **Yes** atau **No**.

---

## 4. Sync ke toko platform

Icon Sync muncul hanya jika category punya store **platform**. Category hanya store Others atau tanpa store → tidak ada Sync. Tombol Sync All juga hanya untuk category ber-platform.

---

## 5. Weight kosong

Peringatan **No weight**. Aturan berat di-skip. Isi weight di System Product (DnW **default**).

---

## 6. Weight berubah di System Product (ETM-16668)

Ubah DnW **default** (atau ganti radio default) → Weight + Final by Weight di Pricelist ikut update. Manual oranye **tidak** berubah. Perubahan masuk **Log Pricelist**.

---

## 7. Produk Aktif dan Non Aktif (ETM-17072)

Saat membuka daftar, yang tampil hanya produk **Aktif**.

1. Di toolbar daftar, nyalakan **Show archived data** kalau perlu melihat SKU **Non Aktif**.
2. Matikan lagi untuk menyembunyikan SKU Non Aktif.

Perilakunya sama dengan switch yang sama di menu Product. Switch ini hanya mengubah isi daftar, bukan status produk.

## 8. Kolom Images (ETM-17071)

Kolom **Images** di paling kiri daftar menampilkan thumbnail produk (sama System Product). Tanpa gambar → tanda `-`. Kolom ini tidak untuk sort atau search teks.

Referensi: [knowledge-base.md](./knowledge-base.md) · [Category Price](../businessdevelopment-category-price/user-guide.md)
