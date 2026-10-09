---
doc_type: user-guide
menu: businessdevelopment-category-price
menu_name: "Category Price"
version: 1.0
last_updated: 2026-10-09
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: "1.0"
owner: QA - Yemima
status: review
---

# Category Price — Panduan Pengguna

**Menu:** Business Development → Price → Category Price

---

## 1. Apa yang berubah

Section aturan margin diganti menjadi **Variable Price Tiers**: kamu memasang satu atau lebih Variable Price. Data dasar Category (Code, Name, Store, dll.) tetap sama.

---

## 2. Pasang tier

1. Buka Edit Category Price.
2. Di **Select Variable Price**, cari dan pilih master Active.
3. Tier muncul dengan salinan band — boleh diedit di sini tanpa mengubah master.
4. **Save All**.

Kalau band lokal sudah beda dari master, muncul icon info oranye di header tier.

---

## 3. Update

| Tombol | Kapan |
|--------|-------|
| **Update from Master** | Samakan semua tier dengan Variable Price terkini (edit lokal hilang). |
| **Update to Pricelist** | Hitung ulang harga/margin semua produk category. Wajib centang “saya paham override manual tertimpa”. |

Harga jual di Pricelist **hanya** berubah setelah Update to Pricelist.

---

## 4. Tips

- Hapus tier → master Variable Price tetap ada; bisa dipasang lagi nanti.
- Contoh cek: produk 16.000 + berat 1.500 g → margin 8.500 → final 24.500 (setelah Update to Pricelist).

Referensi: [knowledge-base.md](./knowledge-base.md) · [Variable Price](../businessdevelopment-variable-price/user-guide.md)
