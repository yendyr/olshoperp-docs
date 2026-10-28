---
doc_type: docs-hub-menu-overview
menu_slug: businessdevelopment-pricelist-product
menu_name: Pricelist Product
lang: id
version: 1.3
last_updated: 2026-10-28
status: review
audience: help-center
source_type: derived
source_ref: null
notes: Landing Help Center. Derived QA docs ETM-16314 · 16668 · 16861 · 16883 · 16884.
---

## Modul/Fitur: Pricelist Product

**Definisi bisnis.** Menampilkan **Final Price** per SKU per Category. Angka kecil di bawah = **User Set Margin** — hanya jika diedit manual (oranye); jika belum, tampil `-` (detail hitungan di tooltip). Multi-tier Variable Price dijumlahkan. Sync ke platform hanya jika Category punya store platform. Update to Pricelist tidak menghapus margin manual; Final = default + margin user + tier category.

## Kapan dipakai

* Cek Final Price setelah Category **Update to Pricelist**.
* Override Manual Price (Final atau User Set Margin) lalu lihat dampak Update category berikutnya.
* Filter baris Manual Margin; audit Log Pricelist setelah ubah weight default.

## Navigasi

* **App:** Business Development → Price → Pricelist Product  
* **Route:** `/businessdevelopment/pricelist`  
* **Docs Hub:** `/docs/businessdevelopment/businessdevelopment-pricelist-product`

## Menu terkait

* [Variable Price](/docs/businessdevelopment/businessdevelopment-variable-price)  
* [Category Price](/docs/businessdevelopment/businessdevelopment-category-price)
