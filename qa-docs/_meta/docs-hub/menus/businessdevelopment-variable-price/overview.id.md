---
doc_type: docs-hub-menu-overview
menu_slug: businessdevelopment-variable-price
menu_name: Variable Price
lang: id
version: 1.0
last_updated: 2026-10-15
status: draft
audience: help-center
source_type: derived
source_ref: null
notes: Landing Help Center. Derived dari QA docs v1.1 (ETM-16312 / ETM-16569).
---

## Modul/Fitur: Variable Price

**Definisi bisnis.** Variable Price adalah **master band margin** yang bisa dipakai ulang. Satu master hanya satu type: **by Amount** (harga default SKU) atau **by Weight** (berat primary, gram). Pasang beberapa master di Category Price untuk multi-tier. Harga jual di Pricelist Product baru berubah setelah Category menjalankan **Update to Pricelist**.

## Istilah kunci

* **Band:** Baris Start–End + Type (Percentage / Amount) + Value.
* **Unlimited:** Baris terakhir — berlaku dari Start ke atas.
* **Snapshot:** Salinan band di Category Price; tidak otomatis ikut ubah master.
* **Update to Category:** Menimpa snapshot di semua Category pemakai (termasuk edit lokal). Pricelist **tidak** ikut.

## Kapan dipakai

* Aturan margin yang sama dipakai banyak Category Price.
* Butuh margin berdasar berat sekaligus harga (buat dua master, pasang keduanya).

## Kapan dihindari

* Mencampur Amount dan Weight dalam satu master — buat master terpisah.
* Mengira Pricelist otomatis berubah setelah Update to Category — lanjut Update to Pricelist di Category.

## Navigasi

* **App:** Business Development → Price → Variable Price  
* **Route:** `/businessdevelopment/variable-price`  
* **Docs Hub:** `/docs/businessdevelopment/businessdevelopment-variable-price`

## Aturan penting (ringkas)

* Value Percentage hanya **-9.999 … 9.999**; Type Amount tidak kena batas ini.
* Desimal Percentage dipotong **4** digit.
* Type boleh diganti hanya jika belum dipakai Category (konfirmasi + band dikosongkan); terkunci setelah dipakai.
* Update to Category nonaktif sampai master dipakai minimal satu Category.

## Menu terkait

* [Category Price](/docs/businessdevelopment/businessdevelopment-category-price) — pasang tier, Update to Pricelist  
* [Pricelist Product](/docs/businessdevelopment/businessdevelopment-pricelist-product) — hasil harga jual / margin
