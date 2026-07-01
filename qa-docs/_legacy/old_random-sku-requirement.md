# Random SKU

Feature Name: Random SKU

### Summary

Virtual SKU (non-stockable) yang auto-generated oleh system saat user memilih opsi "random" di variant type sebuah System Product. Fungsinya sebagai **trigger logic** untuk auto-pick sibling variant dengan stock tertinggi saat fulfillment — bukan barang fisik, tidak punya stock sendiri.

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
| **Master Product — System Product (type: Variant)** | SKU `-random` di-generate saat user pilih opsi random. Max 3 variant type per product. Contoh: `BTLMINUM-random`. |
| **Master System Product — Bundle (Single)** | Jika detail bundle mengandung SKU random → behavior sama: pilih sibling dengan stock tertinggi. |
| **Master System Product — Bundle (Variant)** | Semua variant (termasuk random) jadi header bundle. System bandingkan total availability tiap header → pilih yang tertinggi. |
| **Master BOM** | ❌ Tidak diperbolehkan. BOM hanya untuk SKU stockable, sedangkan random SKU bersifat virtual. |
| **Sales Platform (Binding)** | ✅ SKU `-random` bisa di-bind ke platform SKU. |
| **Sales Order / All Sales Order** | ✅ Bisa digunakan sebagai item order. |
| **Send to Default Waves** | Trigger utama: system cek semua sibling variant, pilih SKU dengan stock tertinggi, dengan syarat stock berada dalam warehouse parent hierarchy yang sama. |
| **Purchase Request / Purchase Order / SCM** | ❌ Tidak bisa digunakan. Karena random SKU non-stockable, tidak relevan untuk penambahan stock. |
| **Benchmark COGS (Detail Order)** | Selalu menampilkan nilai 0 — lihat Important Notes. |

### Related Terms

- System Product (type: Variant)
- Bundle Product (Single & Variant)
- Master Variant
- Send to Default Waves
- Warehouse Parent Hierarchy
- Benchmark COGS
- Master BOM
- Sales Platform Binding

### Important Notes

- **Virtual SKU.** Availability SKU `random` selalu 0 karena non-stockable. Dia cuma identifier logic, bukan inventory item.
- **Naming restriction.** User tidak bisa membuat SKU code yang mengandung kata `random` secara manual, karena keyword ini di-reserve sebagai identifier system.
- **Benchmark COGS tidak berfungsi pada order dengan random SKU.** Karena benchmark COGS butuh SKU stockable untuk lookup HPP, order yang masuk dengan SKU `random` akan selalu menampilkan benchmark COGS = 0. Akibatnya, validasi "price product under benchmark COGS" tidak akan pernah trigger — price selalu dianggap lebih tinggi dari 0.
- **Ripple effect ke Bundle.** Poin di atas juga berlaku ketika order mengandung Bundle Product yang detail bundle-nya mengandung random SKU. Benchmark COGS untuk line item tersebut tetap 0.
- **Pemilihan sibling terbatas pada warehouse hierarchy.** Stock comparison hanya menghitung stock dalam warehouse parent hierarchy yang sama dengan order — bukan stock global lintas warehouse.
- **Jika opsi `random` tidak dipilih saat setup variant**, fitur random tidak aktif untuk product tersebut, dan SKU `random` tidak akan ter-generate.

---
