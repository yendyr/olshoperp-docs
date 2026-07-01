---
doc_type: knowledge-base
menu: manage-platform-product
menu_name: "Manage Platform Product"
version: 1.1
last_updated: 2026-06-22
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Manage Platform Product — Knowledge Base

## 1. Apa itu Manage Platform Product?

Anggap menu ini seperti **buku etalase digital** — isinya salinan produk dari toko marketplace (Shopee, Lazada, TikTok, dll.) yang sudah masuk ke OlshopERP, bukan daftar yang Anda ketik sendiri dari nol.

Di sini Anda **menghubungkan SKU marketplace ke produk internal (System Product)**, mengatur **stok yang dikirim ke platform**, dan memantau **hasil sync** — supaya order dari buyer bisa diproses gudang dengan benar.

> 💡 **Singkatnya:** Menu ini jembatan antara **produk di marketplace** dan **stok & SKU di gudang OlshopERP**.

---

## 2. Istilah Kunci

| Istilah | Artinya |
|---|---|
| **Platform Product** | Produk/SKU hasil sync dari marketplace — tampil per baris per toko. |
| **System Product** | Master produk internal di menu System Product — sumber stok & fulfillment. |
| **Binding** | Hubungan resmi: Platform Product ↔ System Product. Status **Binded** = sudah terhubung. |
| **Store** | Satu akun toko marketplace yang sudah di-connect ke OlshopERP. |
| **Pull Products** | Tarik data produk **dari** marketplace **ke** OlshopERP. |
| **Product Onboarding Status** | Status antrian sync awal toko baru — lihat di menu **Store** (kolom default hidden). |
| **Push Stock** | Kirim jumlah stok **dari** OlshopERP **ke** etalase marketplace. |
| **Fake Stock** | Angka stok manual di platform — dipakai push stok tanpa lihat gudang. |
| **ATS** | Stok tersedia jual di System Product — dipakai push stok jika sudah binding & tanpa fake stock. |

---

## 3. Dari Mana Data Ini Muncul?

Data Platform Product **tidak dibuat manual** di menu ini. Produk masuk lewat:

| Sumber | Kapan |
|---|---|
| **Pull Products** (tombol di halaman) | Saat Anda klik, untuk toko yang dipilih |
| **Sync otomatis** (jadwal sistem) | Sekitar setiap jam; produk baru/update ikut masuk |
| **Saat connect / bind toko** | Backfill produk via **antrian onboarding** sistem (otomatis setelah authorize) — tidak perlu Pull Products manual untuk first sync |
| **Webhook** (TikTok) | Update produk tertentu tanpa menunggu pull |

Platform yang didukung sync produk: **Shopee, Lazada, TikTok Shop** (Tokopedia/Other — cek dengan admin jika toko Anda di platform tersebut).

> ⚠️ **Penting:** Kalau SKU belum muncul, **Pull Products** dulu (pastikan toko sudah dipilih di filter atas) — jangan expect bisa ketik SKU baru di sini. Kalau pull sudah jalan tapi SKU tetap tidak ada, cek **Sync Log** sebelum eskalasi.

---

## 4. Status & Badge yang Anda Lihat

### Binding & tipe SKU

| Badge / Warna | Artinya | Aksi yang Perlu Diambil |
|---|---|---|
| 🟢 **Binded** | SKU platform sudah terhubung ke System Product (atau semua varian anak sudah bind untuk produk PARENT) | Lanjut atur stok / push stock jika perlu |
| 🔴 **Not Binded** | Belum terhubung ke System Product | Bind manual, Auto Binding, atau Bulk Binding |
| 🔵 **SINGLE** | Produk tunggal tanpa varian | Bisa bind langsung dari baris ini |
| 🟡 **VARIANT** | Varian (mis. ukuran/warna) dari produk induk | Bind **per varian**, bukan dari baris PARENT |
| 🟢 **PARENT** | Induk yang punya banyak varian | Bind tiap **VARIANT** di bawahnya; status PARENT "Binded" jika semua anak sudah bind |

### Status di marketplace

Kolom **Platform Status** menampilkan status dari marketplace (mis. aktif/nonaktif — tergantung platform). Ini **bukan** status binding OlshopERP.

### Tombol aksi (Pull / Push / Auto Binding)

Tombol bisa **disabled** (abu-abu) jika:
- Belum memilih **Store** di filter atas, atau
- Proses sync/bind/stock untuk toko tersebut **masih berjalan** di background.

Tunggu sebentar lalu refresh — jangan klik berulang.

---

## 5. Apa yang Bisa & Tidak Bisa Dilakukan

| Aksi | Bisa? | Catatan / Batasan |
|---|---|---|
| Lihat daftar produk per toko | ✅ Bisa | Pilih satu atau lebih **Store** di filter atas |
| **Pull Products** (sync produk dari marketplace) | ✅ Bisa | Wajib pilih Store; proses background |
| **Push Stock** (kirim stok ke marketplace) | ✅ Bisa | Wajib pilih Store; butuh **Binded** atau **Fake Stock** |
| **Auto Binding** (cocokkan SKU otomatis) | ✅ Bisa | Hanya SKU **belum bind** & SKU platform = SKU system; per store terpilih |
| **Bulk Binding** (bind SKU sama di semua toko) | ✅ Bisa | Tombol Bulk Binding → pilih Platform SKU + System Product |
| Bind manual (per baris) | ✅ Bisa | Klik ikon binding → modal **Specification Product** → section Binding |
| Atur Fake Stock / Minimum Stock / Stock Ratio | ✅ Bisa | Di modal Specification → section Stock Management |
| Sync satu produk (per baris) | ✅ Bisa | Hanya baris **SINGLE** atau **PARENT** — varian tidak punya tombol sync sendiri |
| Bulk sync / bulk stock / bulk delete (centang baris) | ✅ Bisa | Syarat delete: lihat baris ❌ di bawah |
| Export Excel | ✅ Bisa | Tab export di DataList |
| Lihat Sync Log & Action Log | ✅ Bisa | Tombol log di DataList |
| Buat Platform Product baru manual | ❌ Tidak bisa | Harus dari sync marketplace |
| Edit SKU / nama produk platform langsung | ❌ Tidak bisa | Ubah di seller center marketplace → Pull ulang |
| Bind produk **PARENT** langsung | ❌ Tidak bisa | Bind tiap **VARIANT** |
| Hapus baris **VARIANT** | ❌ Tidak bisa | Hapus lewat PARENT atau biarkan sync yang kelola |
| Hapus **PARENT** yang masih punya anak | ❌ Tidak bisa | Hapus anak dulu atau hubungi admin |
| Bind di toko **belum authorized** | ❌ Tidak bisa | Tombol binding disembunyikan |
| Push stok tanpa bind & tanpa Fake Stock | ❌ Tidak bisa | Bind dulu atau set Fake Stock |
| Auto-bind / Pull / Push tanpa pilih Store | ❌ Tidak bisa | Tombol disabled |

---

## 6. Cara Melakukan Aksi Utama

### Skenario: Toko baru — produk pertama kali muncul
1. Pilih **Store** toko baru di filter atas (Multi Select).
2. Klik **Pull Products** — tunggu notifikasi sukses.
3. Klik **Auto Binding** *atau* bind manual per SKU (ikon binding di baris).
4. ✅ Hasil: status **Binded**, kolom System Product terisi.

### Skenario: Bind manual satu SKU (satu toko)
1. Pastikan Store sudah dipilih & baris bukan **PARENT**.
2. Klik ikon **binding** pada baris → modal **Specification Product** terbuka.
3. Di **Binding Product**, pilih System Product → Save.
4. (Opsional) Atur **Stock Management** di section yang sama → Save.
5. ✅ Hasil: **Binded** hijau; stok internal tampil di kolom System Product.

### Skenario: SKU sama di banyak toko — Bulk Binding
1. Klik tombol **Bulk Binding** (panel kanan terbuka).
2. Pilih **Platform Product SKU** — lihat preview toko mana saja SKU ini ada.
3. Pilih **Binded to System Product** (Single atau Variant).
4. Klik **Save**.
5. ✅ Hasil: semua baris dengan SKU identik di toko aktif ter-bind; log binding tampil di panel yang sama.

### Skenario: Kirim stok ke marketplace
1. Pilih Store → pastikan produk sudah **Binded** *atau* sudah set **Fake Stock**.
2. Atur **Minimum Stock** / **Stock Ratio** di Specification jika perlu (bukan wajib).
3. Klik **Push Stock**.
4. ✅ Hasil: stok etalase marketplace ter-update sesuai aturan (Fake Stock prioritas tertinggi).

---

## 7. Kalau Ada Masalah

| Simptom | Kemungkinan Sebab | Solusi |
|---|---|---|
| SKU tidak muncul setelah order masuk di marketplace | Produk belum di-pull ke OlshopERP | Pilih Store → **Pull Products** → cek Sync Log |
| **Not Binded** tidak hilang setelah bind | System Product inactive, Fix Asset, atau SKU random tidak cocok | Cek System Product aktif & tipe SKU; coba bind manual dengan produk yang tepat |
| **Auto Binding** "No product to be bound" | Semua sudah bind, atau SKU platform ≠ SKU system | Pakai bind manual / Bulk Binding jika SKU sengaja beda |
| **Push Stock** gagal / stok tetap 0 | Belum bind & tidak ada Fake Stock; ATS di bawah minimum | Bind dulu atau set Fake Stock; cek ATS di System Product |
| Tombol Pull/Push/Auto Binding disabled | Store belum dipilih atau job masih jalan | Pilih Store; tunggu 1–2 menit; refresh halaman |
| Order marketplace stuck **unbinded product** | Platform Product belum bind saat order masuk | Bind SKU → error order hilang otomatis (tidak perlu re-sync order) |
| Bulk Binding tidak meng-update semua toko | SKU di DB tidak **100% sama persis** (huruf/spasi) | Samakan SKU di seller center atau bind manual per toko |

---

## 8. FAQ

**Q: Apakah saya bisa menambah produk baru langsung di menu ini?**  
A: Tidak. Produk harus ada dulu di marketplace, lalu di-pull ke OlshopERP.

**Q: Harus pilih Store dulu sebelum Pull / Push / Auto Binding?**  
A: Ya. Filter Store wajib — tanpa itu tombol disabled.

**Q: Apa beda Auto Binding dan Bulk Binding?**  
A: **Auto Binding** = per store, hanya SKU belum bind, cocok otomatis jika SKU platform = SKU system. **Bulk Binding** = satu SKU platform, bind sekaligus di **semua toko** ke System Product **yang Anda pilih**.

**Q: Kenapa produk PARENT tidak bisa di-bind?**  
A: Yang ditransaksikan variannya. Bind tiap baris **VARIANT**; PARENT hanya ringkasan.

**Q: Apa itu Fake Stock dan kapan dipakai?**  
A: Angka stok tetap yang selalu di-push ke marketplace. Dipakai jika belum bind, atau sengaja override stok gudang.

**Q: Apakah hapus Platform Product aman?**  
A: Hanya **SINGLE** (dan PARENT tanpa anak) yang bisa dihapus manual. VARIANT tidak bisa dihapus satu per satu.

**Q: Pull Products vs sync otomatis — mana yang dipakai?**  
A: Keduanya mengisi data yang sama. Pull = manual segera; otomatis = background ~ hourly. Auto Binding sering jalan setelah sync otomatis selesai.

**Q: Stok PARENT di marketplace diabaikan?**  
A: Ya — banner kuning di halaman mengingatkan: stok parent diabaikan saat sync stok; yang relevan varian/SINGLE yang sudah bind.

---

## 9. Butuh Bantuan Lebih?

- 📋 **Sync Log:** tombol log di halaman Platform Product → tab **Action Log** (riwayat aksi) & **Product Sync** (detail sync produk).
- 📋 **Bulk Binding Log:** di panel **Bulk Binding** setelah Anda save — lihat toko mana saja yang ter-update.
- 🔗 **Menu terkait:**
  - **System Product** — master SKU internal & stok ATS
  - **Store / Store Binding** — connect & authorize marketplace; pantau **Product Onboarding Status** & **Product Sync %**
  - **Dev - Sales Platform** — order marketplace (butuh binding agar bisa diproses)
- 🆘 **Hubungi admin** jika: Sync Log error berulang setelah 2× pull, toko unauthorized, atau binding sudah benar tapi order masih error setelah ±5 menit.
