---
doc_type: user-guide
menu: businessdevelopment-category-price
menu_name: "Category Price"
version: 1.6
last_updated: 2026-11-05
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: "1.6"
owner: QA - Yemima
status: review
---

# Category Price — Panduan Pengguna

**Menu:** Business Development → Price → Category Price

---

## 1. Apa yang berubah

Section aturan margin diganti menjadi **Variable Price Tiers**: kamu memasang satu atau lebih Variable Price. Data dasar Category (Code, Name, dll.) tetap sama.

**Applied Store:** boleh pilih store platform **dan** store Others yang Active (boleh kosong / campur). Tooltip menjelaskan kedua jenis store itu. Satu store hanya bisa dipasang di satu Category Price. Category yang masih menempel ke store tidak bisa dihapus, termasuk setelah store itu dinonaktifkan.

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
| **Update to Pricelist** | Hitung ulang Final di Pricelist. Margin yang sudah diedit manual di Pricelist **tetap**; Final bisa berubah karena tier category ditambahkan ke margin user. Wajib centang persetujuan. Popup menulis jumlah produk yang akan dihitung, bukan jumlah baris yang sudah ada. |

Harga jual di Pricelist biasanya berubah setelah **Update to Pricelist**. Pengecualian: ubah weight DnW **default** di System Product → nilai by Weight ikut auto-update (ETM-16668); input manual Category tidak tertimpa.

Selama Update berjalan, halaman category menampilkan progres. Muat ulang halaman, progresnya tetap. Klik Update lagi pada category yang sama ditolak sampai yang pertama selesai.

Harga yang tidak berubah tidak ditulis ulang. Sync tidak mengirim ulang baris itu. Waktu **Last Update to Pricelist** di header kolom category (Pricelist Product) tetap harus menunjuk Update yang baru.

Contoh: harga dasar 7.000, margin manual 2.000, tier +5.500 → Final 14.500. Tier naik jadi +6.500 → margin tetap 2.000, Final 15.500. Update lagi tanpa perubahan → harga baris tetap, tooltip Last Update pindah ke waktu yang baru.

Category hanya Others / tanpa store platform: harga Final tetap terhitung di Pricelist, tapi Sync ke marketplace tidak muncul.

---

## 4. Tips

- Hapus tier → master Variable Price tetap ada; bisa dipasang lagi nanti.
- Edit Value **Percentage** di tier: maksimal ±9.999 (sama Variable Price).
- **Max Value** pada Percentage: plafon hasil % (lihat Variable Price).

Referensi: [knowledge-base.md](./knowledge-base.md) · [Pricelist Product](../businessdevelopment-pricelist-product/user-guide.md)
