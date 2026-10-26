---
doc_type: docs-hub-menu-overview
menu_slug: businessdevelopment-category-price
menu_name: Category Price
lang: id
version: 1.1
last_updated: 2026-10-22
status: review
audience: help-center
source_type: derived
source_ref: null
notes: Landing Help Center. Derived dari QA docs multi-tier Variable Price · ETM-16668 weight sync.
---

## Modul/Fitur: Category Price

**Definisi bisnis.** Category Price mengelompokkan store/channel dan menyimpan **tier Variable Price** (snapshot). Band boleh diedit lokal, disamakan master lewat **Update from Master**, lalu dipublish ke harga jual lewat **Update to Pricelist**. **TO-BE:** nilai by Weight juga bisa ikut auto-update dari ubah weight DnW **default** di System Product (tanpa override input manual Category).

## Istilah kunci

* **Tier:** Satu Variable Price yang dipasang (Amount dan/atau Weight boleh bersamaan).
* **Update from Master:** Timpa semua snapshot dari master terkini (edit lokal hilang).
* **Update to Pricelist:** Hitung ulang margin/harga final semua baris Pricelist category ini (override manual tertimpa setelah konfirmasi).
* **Auto weight (TO-BE):** sync dari System Product DnW default — beda dari Update to Pricelist massal.

## Kapan dipakai

* Mengikat aturan Variable Price ke kategori harga / grup store.
* Menerbitkan perubahan margin ke Pricelist setelah cek tier.

## Navigasi

* **App:** Business Development → Price → Category Price  
* **Route:** `/businessdevelopment/pricelist-category`  
* **Docs Hub:** `/docs/businessdevelopment/businessdevelopment-category-price`

## Menu terkait

* [Variable Price](/docs/businessdevelopment/businessdevelopment-variable-price)  
* [Pricelist Product](/docs/businessdevelopment/businessdevelopment-pricelist-product)
