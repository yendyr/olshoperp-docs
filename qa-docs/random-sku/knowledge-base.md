---
doc_type: knowledge-base
menu: random-sku
menu_name: "Random SKU"
version: 1.1
last_updated: 2026-10-02
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, used-in, related-terms, important-notes]
---
# Random SKU

Feature Name: Random SKU

### Summary

Virtual SKU (non-stockable) yang auto-generated oleh system saat user memilih opsi "random" di variant type sebuah System Product. Fungsinya sebagai **trigger logic** untuk auto-pick sibling variant dengan stock tertinggi saat fulfillment — bukan barang fisik, tidak punya stock sendiri.

Di master, variant random **bisa diisi Retail Price**. Itu dipakai default harga di order internal, dan (TO-BE) dipakai saat **pecah harga paket bundle** — **bukan** angka Benchmark COGS.

*Aliases: Random SKU, Random Product, Barang Random, Bundle Random, Variant Random, Order Random*

### Function

- Menyediakan opsi order tanpa harus memilih variant spesifik (misal warna)
- Saat order masuk dengan SKU `random`, system otomatis memilih sibling variant dengan stock tertinggi dalam warehouse parent hierarchy yang sama
- Berlaku juga untuk Bundle Product (Single & Variant) yang mengandung SKU random di detailnya
- Tujuan akhir: optimasi fulfillment tanpa input manual dari user/CS

### Used In

| Menu | Behavior |
| --- | --- |
| **Master Variant** | Setup variant type + options. System otomatis menambahkan opsi `random` di setiap variant type. |
| **Master Product — System Product (type: Variant)** | SKU `-random` di-generate saat user pilih opsi random. Max 3 variant type per product. Contoh: `BTLMINUM-random`. Isi juga **Retail Price** di variant random. |
| **Master System Product — Bundle (Single)** | Jika detail bundle mengandung SKU random → behavior sama: pilih sibling dengan stock tertinggi. Pecah harga header → pakai **retail** random (bukan Benchmark). |
| **Master System Product — Bundle (Variant)** | Semua variant (termasuk random) jadi header bundle. System bandingkan total availability tiap header → pilih yang tertinggi. |
| **Master BOM** | ❌ Tidak diperbolehkan. BOM hanya untuk SKU stockable, sedangkan random SKU bersifat virtual. |
| **Sales Platform (Binding)** | ✅ SKU `-random` bisa di-bind ke platform SKU. Harga jual baris order platform tetap dari **platform**. |
| **Sales Order / All Sales Order** | ✅ Bisa digunakan sebagai item order. Setelah Send to Default Waves → jadi **SKU asli**. |
| **Send to Default Waves** | Trigger utama: system cek semua sibling variant, pilih SKU dengan stock tertinggi, dengan syarat stock berada dalam warehouse parent hierarchy yang sama. |
| **Purchase Request / Purchase Order / SCM** | ❌ Tidak bisa digunakan. Karena random SKU non-stockable, tidak relevan untuk penambahan stock. |
| **Benchmark COGS (Detail Order)** | Patokan HPP / margin — **bukan** untuk pecah harga bundle. Lihat Important Notes. |

### Related Terms

- System Product (type: Variant)
- Bundle Product (Single & Variant)
- Master Variant
- Send to Default Waves
- Warehouse Parent Hierarchy
- Benchmark COGS
- Retail Price
- Master BOM
- Sales Platform Binding

### Important Notes

- **Virtual SKU.** Availability SKU `random` selalu 0 karena non-stockable. Dia cuma identifier logic, bukan inventory item.
- **Naming restriction.** User tidak bisa membuat SKU code yang mengandung kata `random` secara manual, karena keyword ini di-reserve sebagai identifier system.
- **Retail Price vs Benchmark COGS:** Retail = acuan pecah harga jual bundle (dan default harga order internal). Benchmark = patokan HPP; untuk random ambil dari **sibling tertinggi**. Jangan dicampur. Detail: [System Product §11.6](../system-product/requirement.md#116-random-sku-di-breakdown-bundle--retail-price-to-be--etm-16216) · ETM-16216.
- **Benchmark COGS (master menu):** Variant `-random` **mengikuti** nilai MAX parent di menu [Benchmark COGS](../accounting-product-benchmark-price/knowledge-base.md) — bukan dihitung dari inbound random SKU.
- **Benchmark COGS (detail order):** Line order dengan SKU random sering menampilkan **0** sebelum binding / jika `product_id` belum ter-set; validasi "harga di bawah benchmark" mungkin **tidak trigger**. Random **bundle** line dapat memaksa **manual approval** (AS-IS).
- **Setelah masuk gudang:** Random sudah diganti SKU asli. Kalau harga header bundle baru datang belakangan (booking), pecahan harga ikut **SKU asli** yang sudah ada — jangan anggap masih random.
- **Stock Remapping:** SKU `-random` **diblok** sebagai Origin maupun Remapped To — lihat [Stock Remapping](../accounting-stock-remapping/knowledge-base.md)
- **Pemilihan sibling terbatas pada warehouse hierarchy.** Stock comparison hanya menghitung stock dalam warehouse parent hierarchy yang sama dengan order — bukan stock global lintas warehouse.
- **Jika opsi `random` tidak dipilih saat setup variant**, fitur random tidak aktif untuk product tersebut, dan SKU `random` tidak akan ter-generate.

---
