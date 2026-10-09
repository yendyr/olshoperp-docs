---
doc_type: user-guide
menu: businessdevelopment-variable-price
menu_name: "Variable Price"
version: 1.0
last_updated: 2026-10-09
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: "1.0"
owner: QA - Yemima
status: review
---

# Variable Price — Panduan Pengguna

**Siapa yang baca:** tim Business Development / pricing  
**Menu:** Business Development → Price → Variable Price

---

## 1. Apa itu

Tempat menyimpan **aturan margin** yang bisa dipakai ulang di banyak Category Price. Pilih satu jenis: berdasarkan **harga default** produk, atau berdasarkan **berat** produk (gram).

Kalau butuh aturan harga **dan** berat, buat **dua** Variable Price, lalu pasang keduanya di Category Price.

---

## 2. Alur singkat

1. Buat Variable Price → isi Code, Name, Type, lalu isi tabel band (Start–End, Type Percentage/Amount, Value). Baris terakhir = Unlimited.
2. Di **Category Price**, pilih Variable Price itu sebagai tier.
3. Kalau kamu ubah band di master lagi → tekan **Update to Category** (konfirmasi). Harga jual di Pricelist **belum** berubah.
4. Di Category, tekan **Update to Pricelist** kalau sudah siap menghitung ulang harga jual.

---

## 3. Yang perlu diperhatikan

- Value boleh **minus** (mengurangi harga).
- Type terkunci setelah Variable Price sudah dipakai Category.
- Update to Category menimpa edit lokal di Category — cek daftar Category di section **Used in Category Price**.
- Pricelist tidak ikut Update to Category.

---

## 4. Langkah create

1. Buka Variable Price → **Create**.
2. Isi Basic Information (Type: by Amount atau by Weight).
3. Isi Margin Price Configuration sampai ada baris Unlimited.
4. **Save All**.
5. Pasang di Category Price (Select Variable Price).

---

## 5. Tips

- Hover kolom **Used in Categories** untuk lihat Category pemakai.
- Mass Update: centang beberapa baris → icon Update to Category di bar atas (nonaktif jika ada yang belum dipakai Category).

Referensi: [knowledge-base.md](./knowledge-base.md) · [requirement.md](./requirement.md)
