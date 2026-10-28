---
doc_type: user-guide
menu: businessdevelopment-category-price
menu_name: "Category Price"
version: 1.4
last_updated: 2026-10-28
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: "1.4"
owner: QA - Yemima
status: review
---

# Category Price — Panduan Pengguna

**Menu:** Business Development → Price → Category Price

---

## 1. Apa yang berubah

Section aturan margin diganti menjadi **Variable Price Tiers**: kamu memasang satu atau lebih Variable Price. Data dasar Category (Code, Name, dll.) tetap sama.

**Applied Store:** boleh pilih store platform **dan** store Others yang Active (boleh kosong / campur).

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
| **Update to Pricelist** | Hitung ulang Final di Pricelist. Margin yang sudah diedit manual di Pricelist **tetap**; Final bisa berubah karena tier category ditambahkan ke margin user. Wajib centang persetujuan. |

Harga jual di Pricelist biasanya berubah setelah **Update to Pricelist**. Pengecualian: ubah weight DnW **default** di System Product → nilai by Weight ikut auto-update (ETM-16668); input manual Category tidak tertimpa.

Category hanya Others / tanpa store platform: harga Final tetap terhitung di Pricelist, tapi Sync ke marketplace tidak muncul.

---

## 4. Tips

- Hapus tier → master Variable Price tetap ada; bisa dipasang lagi nanti.
- Edit Value **Percentage** di tier: maksimal ±9.999 (sama Variable Price).
- **Max Value** pada Percentage: plafon hasil % (lihat Variable Price).

Referensi: [knowledge-base.md](./knowledge-base.md) · [Pricelist Product](../businessdevelopment-pricelist-product/user-guide.md)
