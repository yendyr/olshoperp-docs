---
doc_type: user-guide
menu: businessdevelopment-pricelist-product
menu_name: "Pricelist Product"
version: 1.1
last_updated: 2026-10-21
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: "1.1"
owner: QA - Yemima
status: review
---

# Pricelist Product — Panduan Pengguna

**Menu:** Business Development → Price → Pricelist Product

---

## 1. Apa itu

Daftar harga jual per produk. Margin bisa hasil penjumlahan beberapa aturan dari Category (harga dan/atau berat).

---

## 2. Setelah Update dari Category

1. Cek kolom **Weight** (dari System Product primary).
2. Lihat harga final (besar) dan margin (kecil di bawah).
3. Arahkan mouse ke margin → pecahan per tier + range band.

Contoh: 16.000 + berat 1.500 g → margin 8.500 → final 24.500.

---

## 3. Ubah margin manual

1. Klik angka margin → edit langsung.
2. Enter simpan / Esc batal.
3. Angka jadi **oranye** = diubah manual (tercatat siapa & kapan di tooltip).

**Update to Pricelist** dari Category akan menimpa lagi ke hasil hitung (warna kembali normal).

---

## 4. Weight kosong

Muncul peringatan **No weight**. Aturan berdasarkan berat di-skip. Isi weight di System Product (baris DnW **default**).

---

## 5. Weight berubah di System Product (TO-BE ETM-16668)

Kalau weight diubah pada DnW **default** (atau radio default diganti) di System Product → Weight + margin + final Category di Pricelist ikut update otomatis. Perubahan masuk **Log Pricelist**. Margin oranye (manual) **tidak** berubah.

Referensi: [knowledge-base.md](./knowledge-base.md) · [Category Price](../businessdevelopment-category-price/user-guide.md) · [ETM-16668](https://erpintegration.atlassian.net/browse/ETM-16668)
