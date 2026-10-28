---
doc_type: docs-hub-menu-overview
menu_slug: businessdevelopment-category-price
menu_name: Category Price
lang: id
version: 1.4
last_updated: 2026-10-28
status: review
audience: help-center
source_type: derived
source_ref: null
notes: Landing Help Center. Derived QA docs · ETM-16668 · 16835 · 16882 · 16884.
---

## Modul/Fitur: Category Price

**Definisi bisnis.** Category Price mengelompokkan store/channel dan menyimpan **tier Variable Price** (snapshot). **Applied Store** boleh platform + Others Active (boleh kosong/campur). Band boleh diedit lokal, disamakan master lewat **Update from Master**, lalu dipublish lewat **Update to Pricelist** — margin manual di Pricelist **tidak dihapus**; Final bisa berubah karena tier ditambahkan ke margin user.

## Istilah kunci

* **Tier:** Satu Variable Price yang dipasang (Amount dan/atau Weight).
* **Update from Master:** Timpa semua snapshot dari master terkini.
* **Update to Pricelist:** Hitung ulang Final di Pricelist; Manual Price tetap (stack dengan tier).
* **Applied Store Others:** Store non-platform Active — boleh dipilih (ETM-16882).

## Kapan dipakai

* Mengikat aturan Variable Price ke kategori harga / grup store (termasuk Others).
* Menerbitkan perubahan ke Pricelist setelah cek tier.

## Navigasi

* **App:** Business Development → Price → Category Price  
* **Route:** `/businessdevelopment/pricelist-category`  
* **Docs Hub:** `/docs/businessdevelopment/businessdevelopment-category-price`

## Menu terkait

* [Variable Price](/docs/businessdevelopment/businessdevelopment-variable-price)  
* [Pricelist Product](/docs/businessdevelopment/businessdevelopment-pricelist-product)
