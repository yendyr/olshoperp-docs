---
doc_type: requirement-end-to-end
title: "Multi-tier Margin: Variable Price → Category Price → Pricelist Product"
status: final-draft (siap dibawa ke qa-docs; poin di Bagian 9 masih butuh keputusan)
last_updated: 2026-10-09
owner: QA - Yemima
related_jira: [ETM-16312, ETM-16313, ETM-16314]
wireframe: https://claude.ai/artifact/CSgXVMhzsztTJqwpeD7f89
related_sot: olshoperp/docs/qa-docs/_meta/sot/businessdevelopment-variable-price-source-of-truth.md
---

# Multi-tier Margin: Variable Price → Category Price → Pricelist Product

Dokumen ini menggabungkan brief UIX, SOT Variable Price, tiga card Jira, dan keputusan di wireframe final menjadi satu requirement dari ujung ke ujung. Isinya dibagi per menu supaya bisa langsung dipecah ke `requirement.md` masing-masing menu.

Cara baca: bagian 1–2 berlaku untuk ketiga menu. Bagian 3–5 menjelaskan satu menu per bagian. Bagian 6 adalah alur kerja dari awal sampai akhir. Bagian 7 berisi data contoh dan hasil yang diharapkan untuk pengujian. Bagian 9 berisi hal yang belum diputuskan.

---

## 1. Ringkasan

### 1.1 Masalah yang diselesaikan

Sekarang margin harga hanya bisa diatur di dalam **Category Price** (section *Margin Price Configuration*), dan hanya berdasarkan harga default produk. Tim butuh:

- aturan margin yang bisa **dipakai ulang** di banyak category,
- margin berdasarkan **berat** produk, selain berdasarkan harga,
- **beberapa aturan sekaligus** (multi tier) yang hasilnya dijumlahkan,
- perubahan yang **tidak langsung menimpa harga jual** sebelum user siap (fase trial).

### 1.2 Tiga menu dan perannya

| Menu | Peran | Card Jira |
|---|---|---|
| **Variable Price** (menu baru) | Tempat menyimpan aturan margin (band) yang bisa dipakai ulang. Satu Variable Price hanya punya satu type: **by Amount** atau **by Weight**. | ETM-16312 |
| **Category Price** | Memasang beberapa Variable Price sebagai tier. Isi tiap tier berupa salinan (snapshot) band, boleh diedit lokal. | ETM-16313 |
| **Pricelist Product** | Menghitung margin dan harga final per produk dari semua tier di category-nya, dan menampilkan rincian hitungannya. | ETM-16314 |

### 1.3 Alur update (satu arah, manual)

```
Variable Price ──[Update to Category]──► Category Price ──[Update to Pricelist]──► Pricelist Product
   (master)                              (salinan band)                            (margin dan harga final)
```

- Mengubah master tidak mengubah Category sampai user menekan **Update to Category** (atau **Update from Master** dari sisi Category).
- Mengubah Category tidak mengubah Pricelist sampai user menekan **Update to Pricelist**.
- Mengubah sesuatu di hilir tidak pernah mengubah hulu. Edit di Category tidak mengubah master, edit di Pricelist tidak mengubah Category.
- Setiap update meminta konfirmasi dan tercatat di log.

### 1.4 Istilah

| Istilah | Arti |
|---|---|
| Band | Satu baris aturan margin: rentang Start–End, Type (Percentage atau Amount), dan Value. |
| Unlimited | Baris band terakhir. End-nya kosong dan aturannya berlaku untuk semua nilai mulai dari Start ke atas. |
| Tier | Satu Variable Price yang dipasang di Category Price. |
| Snapshot | Salinan band dari Variable Price saat dipasang atau saat di-update. Setelah itu salinan berdiri sendiri. |
| Default price | Harga default produk (harga dasar sebelum margin). |
| Weight primary | Berat dari baris Dimension & Weight yang berstatus primary pada System Product SKU. |
| Margin | Nilai tambahan di atas default price. Hasil penjumlahan kontribusi semua tier. |

---

## 2. Aturan bisnis lintas menu

### 2.1 Satu Variable Price = satu type

- Type: **by Amount** (acuannya default price SKU) atau **by Weight** (acuannya weight primary SKU, dalam gram).
- Tidak ada master yang mencampur Amount dan Weight. Butuh keduanya → buat dua master, lalu pasang keduanya di Category Price.

### 2.2 Cara mencocokkan band (sama dengan perilaku sekarang)

Untuk satu tier dan satu produk:

1. Cari band biasa yang nilainya masuk rentang Start sampai End, **termasuk** kedua ujungnya.
2. Kalau tidak ada yang cocok, cek baris Unlimited: cocok jika nilai produk lebih besar atau sama dengan Start-nya.
3. Kalau tetap tidak cocok, kontribusi tier itu **0**.

Nilai yang dicocokkan: default price untuk tier by Amount, weight primary (gram) untuk tier by Weight.

### 2.3 Cara menghitung kontribusi band

| Type band | Kontribusi |
|---|---|
| Amount | Value apa adanya. Boleh minus (pengurang). |
| Percentage | Value persen dikali **default price** produk. Ini berlaku juga untuk tier by Weight: dasar persennya tetap default price. |

### 2.4 Rumus harga

```
Margin      = jumlah kontribusi semua tier yang cocok
Final price = Default price + Margin
```

Urutan tier hanya urutan tampil. Hasil penjumlahan tidak bergantung pada urutan.

### 2.5 Weight kosong

Kalau produk tidak punya weight primary (kosong atau 0), **semua tier by Weight dilewati** (kontribusi 0). Tier by Amount tetap dihitung. Pricelist menampilkan peringatan untuk kasus ini.

### 2.6 Penimpaan saat update

- **Update to Category**: menimpa semua band di Category pemakai, termasuk yang sudah diedit lokal.
- **Update from Master**: sama, dari sisi Category.
- **Update to Pricelist**: menghitung ulang margin semua baris Pricelist di category itu dan menimpa margin yang pernah diedit manual oleh user.

### 2.7 Hal yang tidak berubah

- Tidak ada migrasi otomatis dari data band lama di Category. Data lama sedikit atau belum aktif, boleh dibersihkan saat go-live.
- Tidak ada update otomatis dari perubahan master, category, atau weight ke tingkat di bawahnya selama fase trial.

---

## 3. Menu Variable Price (ETM-16312)

### 3.1 Tujuan

Menyimpan aturan margin (band) sebagai master yang bisa dipakai ulang oleh banyak Category Price.

### 3.2 Posisi di sidebar

Business Development → Price → **Variable Price**, **Category Price**, **Pricelist Product** (urutan dari atas ke bawah). Menu baru perlu didaftarkan ke sidebar dan hak akses role seperti menu BD lainnya.

### 3.3 DataList (wireframe layar A)

Tabel standar OlshopERP dengan pencarian di kiri atas dan tombol **Create** di kanan atas.

| Kolom | Isi |
|---|---|
| Checkbox | Pilih beberapa baris untuk aksi massal. |
| CODE | Kode Variable Price. |
| Name | Nama. |
| Type | by Amount atau by Weight. |
| Used in Categories | Jumlah Category Price yang memakai master ini. Hover menampilkan daftar kode dan nama category. Bernilai 0 jika belum dipakai. |
| Status | Active atau Inactive. |
| Action | Edit dan hapus standar. Tidak diubah. |

**Aksi massal Update to Category**

- Muncul sebagai **icon baru di bar atas tabel**, di samping icon hapus, ketika ada baris dicentang. Di sebelahnya tertulis "N rows selected". Footer tabel juga menampilkan "N rows selected" dan pilihan jumlah baris per halaman.
- Hover icon menampilkan tooltip **Update to Category**.
- Icon **nonaktif** kalau ada Variable Price terpilih yang belum dipakai category mana pun. Tooltip-nya menyebut kode yang bermasalah: "{Code} is not used by any Category Price yet, so there is nothing to update."
- Klik icon membuka dialog konfirmasi (Bagian 3.7).

### 3.4 Form Create/Edit (wireframe layar B)

Halaman penuh, bukan modal. Susunan: section di kiri, sidebar kanan berisi navigasi section dan tombol.

Breadcrumb: `Busdev › Price › Variable Price › Create` atau `Edit`.

Section:

1. **Basic Information**
2. **Margin Price Configuration**
3. **Used in Category Price**
4. **Audit Log** (tertutup secara default)

Sidebar kanan: daftar lompat-section (centang hijau untuk section yang sudah terisi), tombol **Update to Category** (hanya di mode Edit, nonaktif kalau belum dipakai category), dan tombol **Save All**.

### 3.5 Basic Information

| Field | Wajib | Aturan |
|---|---|---|
| Code | Ya | Unik per company (perlu dikonfirmasi saat implementasi). Contoh: `VP-AMT-RETAIL`. |
| Name | Ya | Bebas. |
| Type | Ya | by Amount atau by Weight. Lihat aturan kunci di bawah. |
| Active | Ya | Switch. Default aktif. |
| Description | Tidak | Teks bebas. |

**Field Type**

- Label Type punya **icon info**. Hover menampilkan: *"One Variable Price can only use one type. To combine amount and weight rules, create separate masters and attach both in Category Price."*
- **Belum dipakai category mana pun** → Type boleh diubah kapan saja.
- **Sudah dipakai di Category Price** → Type **tetap tampil tapi disabled** (icon gembok). Tooltip menambahkan: *"Type is locked because this Variable Price is already used in a Category Price."*
- Untuk dev: field jangan disembunyikan, cukup disabled. Penolakan juga harus dilakukan di sisi server, bukan hanya di tampilan.
- Saat Type diubah (belum dipakai), satuan band berubah (Rp ke gram). Usulan perilaku: band dikosongkan dengan konfirmasi. Lihat Bagian 9.

### 3.6 Margin Price Configuration

Sama polanya dengan section Margin Price Configuration di Category Price sekarang.

| Kolom | Isi |
|---|---|
| Start | Terisi otomatis dari End baris sebelumnya + 1. Baris pertama: 0 untuk by Amount, 1 untuk by Weight. Tidak bisa diedit. |
| End | Bisa diedit hanya di **baris editable terakhir**. Baris sebelumnya terkunci. Baris terakhir bertuliskan **Unlimited** dan terkunci. |
| Type | Percentage atau Amount. |
| Value | Angka. **Boleh minus.** Jika Type Percentage, ada akhiran `%`. |
| Action | Tombol tambah baris dan hapus baris, **hanya di baris editable terakhir**. |

- by Amount: Start dan End berawalan `Rp.`
- by Weight: Start dan End berakhiran `g` (gram), bukan Rp.
- Teks bantuan di atas tabel: untuk by Weight, "Start and End are in grams (g). Percentage is calculated from the SKU default price. Value can be negative." Untuk by Amount, "Start and End are SKU default price. Value can be negative. The last row is Unlimited and matches any price from its Start."

**Validasi**

| Kondisi | Perilaku |
|---|---|
| Type kosong | Tolak simpan. |
| End lebih kecil atau sama dengan Start (band biasa) | Tolak simpan, sama seperti Category Price sekarang. |
| Baris Unlimited tidak ada | Tolak simpan. Wajib ada satu baris Unlimited di akhir, mengikuti pola Category Price sekarang. |
| Value minus | Diizinkan. |
| Code sudah dipakai di company yang sama | Tolak simpan. |

### 3.7 Used in Category Price

Section **read-only**. Tidak ada tombol memasang master ke category di sini. Memasang hanya dilakukan di Category Price.

Judul: "Used in Category Price" dengan lencana jumlah.

| Kondisi | Tampilan |
|---|---|
| Belum dipakai | Teks kosong: *"This Variable Price is not used by any Category Price yet."* + penjelasan kecil bahwa pemasangan dilakukan lewat Category Price. |
| Sudah dipakai | Kotak peringatan (kuning), lalu tabel, lalu tombol **Update to Category**. |

Kotak peringatan: *"Update to Category will overwrite band snapshots on all categories listed below (including local edits). Pricelist Product will not change until each category runs Update to Pricelist."*

Kolom tabel: **Code**, **Category Name**, **Status**, **Last snapshot sync**, dan link **Open** (membuka form Category Price di tab baru).

### 3.8 Dialog Update to Category

Muncul dari tombol di form, tombol di sidebar, atau icon massal di datalist. Memakai dialog konfirmasi yang sudah ada.

- Judul: **Update to Category Price?**
- Isi: *"{N} Category Price will get the latest bands from {Variable Price}. Local edits on the matching tiers will be overwritten."*
- Daftar kode dan nama category yang akan terkena.
- Catatan: *"Pricelist Product does not change. Run Update to Pricelist on each category when you are ready."*
- Tombol: **Cancel** dan **Update**.
- Setelah Update: toast sukses (bukan halaman sukses). Contoh: "Band snapshots updated on 3 Category Price."

### 3.9 Audit dan log

- **Audit Log** di form: pembuatan, perubahan, dan setiap Update to Category (tanggal, user, aksi, detail).
- Di sisi **Category** setiap Update to Category tercatat: siapa, kapan, dari Variable Price mana.

### 3.10 Acceptance criteria

- [ ] Menu muncul di sidebar BD di atas Category Price. Create, edit, dan hapus berjalan.
- [ ] Satu master hanya bisa satu type.
- [ ] Band mendukung Percentage dan Amount, Value minus, dan baris Unlimited.
- [ ] Type bisa diubah selama belum dipakai category. Setelah dipakai, Type disabled dengan icon info dan tooltip. Server menolak perubahan Type pada master yang sudah dipakai.
- [ ] Section Used in Category Price tampil (kosong dan terisi), read-only, link Open berfungsi.
- [ ] Datalist punya kolom Used in Categories dan icon massal Update to Category yang nonaktif bila ada master terpilih yang belum dipakai.
- [ ] Update to Category menimpa snapshot di semua category pemakai setelah konfirmasi, dan tercatat di log Category.
- [ ] Perubahan master tidak mengubah Pricelist Product.

---

## 4. Menu Category Price (ETM-16313)

### 4.1 Tujuan

Memasang satu atau beberapa Variable Price sebagai tier, sehingga margin hasilnya dijumlahkan.

### 4.2 Yang berubah dari sekarang

| Sekarang | Sesudah |
|---|---|
| Section *Margin Price Configuration* berisi satu set band yang diisi langsung. | Diganti section **Variable Price Tiers**. Isinya beberapa tier hasil pemasangan Variable Price. |
| Hanya by harga default. | Boleh by Amount dan by Weight, sebanyak yang dibutuhkan. |
| Tidak terhubung ke master. | Tiap tier terhubung ke Variable Price sumbernya (lewat snapshot). |

Section **Basic Information** (Code, Category Name, Description, Applied Store, Show for all company) **tidak berubah**. DataList Category Price tidak berubah.

### 4.3 Form Edit (wireframe layar D)

Breadcrumb: `Busdev › Price › Category Price › Edit`.

Section: **Basic Information**, **Variable Price Tiers** (dengan lencana jumlah tier), **Audit Log**.

Sidebar kanan: daftar lompat-section, tombol **Update from Master**, tombol **Update to Pricelist** (berwarna merah, karena dampaknya besar), dan **Save All**.

### 4.4 Menambah tier: field Select Variable Price

- Berupa **field pilihan** (bukan tombol), bisa dicari, dengan pola yang sama seperti *Select Product* di detail Purchase Order.
- Placeholder: **Select Variable Price**. Kolom pencarian: "Search Variable Price...".
- Opsi yang muncul: semua Variable Price **Active** yang **belum** dipasang di category ini.
- Setiap opsi menampilkan **Code** (tebal), Name di bawahnya, dan lencana **type** (by Amount atau by Weight) di sisi kanan.
- Variable Price yang sudah dipasang **hilang dari opsi**. Kalau tier-nya dihapus, opsinya muncul lagi.
- Kalau tidak ada yang tersisa: **"No Variable Price available"**.
- Setelah dipilih, tier langsung muncul di daftar dengan snapshot band dari master. Toast: "{Code} added. Click Save All to apply."

### 4.5 Tampilan satu tier

Tiap tier berupa accordion (bisa dibuka dan ditutup):

| Elemen | Isi |
|---|---|
| Label | "Tier N" (N = urutan tampil). |
| Judul | `{Code} — {Name}`. |
| Lencana | Type (by Amount atau by Weight). |
| Tanggal | "Snapshot {tanggal dan jam}" (kapan terakhir disalin dari master). |
| Tombol hapus | Icon hapus di kanan. Lihat Bagian 4.7. |
| Isi | Band hasil snapshot: Start, End, Type, Value, baris Unlimited. Tampilannya sama dengan Margin Price Configuration sekarang. Tier by Weight memakai satuan `g`, bukan `Rp.`. |

- Band di Category **boleh diedit lokal**. Edit lokal **tidak** mengubah master.
- Aturan baris (Start otomatis, End hanya di baris editable terakhir, tombol tambah/hapus baris) sama dengan Bagian 3.6.

**Tanda tier yang sudah diedit lokal**

- Kalau isi sebuah tier sudah berbeda dari master karena diedit di Category, header tier menampilkan **icon info berwarna oranye**.
- Hover: *"This tier was edited in this Category Price, so it no longer matches the Variable Price master."*
- Tidak ada label teks tambahan di header.

### 4.6 Teks bantuan contoh hitung

Di bawah daftar tier ada kotak bantuan kecil: *"Margin of every tier is added together, in the order shown. Example: SKU default price 16.000, weight 1.500 g gives 3.000 + 2.000 + 3.500 = 8.500 margin, so final price is 24.500. A tier with no matching band adds 0."*

### 4.7 Menghapus tier

- Klik icon hapus di header tier → dialog kecil: **"Remove {Code}?"**
- Isi: *"Its band snapshot will be removed from this Category Price. The Variable Price master is not changed."* Catatan: Pricelist Product tidak berubah sampai Update to Pricelist.
- Tombol: **Cancel** dan **Remove**.
- Toast: "{Code} removed. Click Save All to apply."
- Opsinya kembali tersedia di field Select Variable Price.

### 4.8 Update from Master

- Tombol di sidebar kanan.
- Dialog sederhana, **tanpa merinci** bagian mana yang pernah diedit.
- Judul: **Update from Master?**
- Isi: *"All tiers will be replaced with the current Variable Price master. Any changes made in this Category Price will be overridden."*
- Tombol: **Cancel** dan **Update**. Toast: "Tiers updated from master."
- Tercatat di log Category (siapa, kapan, master mana).

### 4.9 Update to Pricelist

- Tombol di sidebar kanan, berwarna merah.
- Dialog **konfirmasi keras**:
  - Judul: **Update to Pricelist?**
  - Isi: *"Margin of all {N} Pricelist Product in {Code} will be recalculated from the tiers on this page. Manual margin overrides will be overwritten. This cannot be undone."* ({N} = jumlah baris Pricelist category itu.)
  - Kotak centang: *"I understand manual margin overrides will be overwritten."*
  - Tombol **Update to Pricelist** (merah) **nonaktif sampai kotak dicentang**. Tombol **Cancel** selalu aktif.
- Toast: "Pricelist Product updated for {Code} ({N} rows)."
- Perilaku penimpaan dan log di Pricelist dijelaskan di Bagian 5.

### 4.10 Audit Log

Section tertutup secara default. Mencatat antara lain: tambah tier, hapus tier, edit nilai tier, Update from Master, Update to Pricelist.

### 4.11 Aturan dan validasi

- Boleh memasang beberapa Variable Price by Amount dan/atau by Weight.
- Category **tanpa tier** diperbolehkan. Hasilnya margin 0 saat Update to Pricelist (perlu konfirmasi, Bagian 9).
- Satu Variable Price tidak bisa dipasang dua kali di category yang sama (otomatis karena hilang dari opsi).
- Hanya Variable Price Active yang bisa dipasang.
- Validasi band lokal sama seperti sekarang (rentang valid, ada baris Unlimited).
- Data margin lama di Category tidak dimigrasi otomatis.

### 4.12 Acceptance criteria

- [ ] Section Variable Price Tiers menggantikan Margin Price Configuration. Basic Information tidak berubah.
- [ ] Tier ditambah lewat Select Variable Price. Opsi menampilkan Code, Name, dan type. Hanya Variable Price Active yang muncul. Yang sudah dipasang tidak muncul dan muncul lagi setelah tier dihapus.
- [ ] Band tiap tier tampil sebagai snapshot dan boleh diedit lokal tanpa mengubah master.
- [ ] Tier yang diedit lokal menampilkan icon info dengan tooltip penjelasan.
- [ ] Hapus tier meminta konfirmasi.
- [ ] Update from Master menimpa semua tier setelah konfirmasi dengan pesan override sederhana, dan tercatat di log.
- [ ] Update to Pricelist meminta konfirmasi keras (centang persetujuan) dan tidak jalan otomatis.
- [ ] Hubungan dengan ETM-16312 tercatat di Jira.

---

## 5. Menu Pricelist Product (ETM-16314)

### 5.1 Tujuan

Menampilkan dan menyimpan hasil margin dan harga final per produk dari semua tier di category-nya, lengkap dengan rincian hitungan.

### 5.2 Yang berubah dari sekarang

| Sekarang | Sesudah |
|---|---|
| Margin dari satu set band Category. | Margin = jumlah kontribusi semua tier (Bagian 2). |
| Tidak ada kolom Weight. | Kolom **Weight** setelah kolom SKU. |
| Tidak ada rincian hitungan. | Hover angka margin menampilkan **Tier breakdown**. |
| Margin bisa diedit, tapi tidak ada penanda bahwa nilainya bukan hasil hitungan. | Margin yang diedit user tampil **oranye**, dan info editor ada di tooltip. |

### 5.3 DataList (wireframe layar F)

Kolom yang sudah ada tetap: System Product SKU/Name, Bound Stores, Default Price, Latest Sync, kolom harga per store. Di kolom harga per store, angka besar = harga final, **angka kecil di bawahnya = margin**.

### 5.4 Kolom Weight

- Posisi: tepat setelah kolom SKU.
- Isi: weight primary produk, ditulis `1.500 g`.
- **Icon info di header kolom.** Hover: *"Weight comes from the SKU's System Product: the Dimension & Weight row marked as primary (in grams)."*

**Kalau weight kosong atau 0**

- Sel menampilkan icon peringatan oranye dan teks **"No weight"**.
- Hover: *"This SKU has no primary weight. Weight-based Variable Price tiers are skipped in margin calculation."*

### 5.5 Tooltip Tier breakdown (hover angka margin)

Isi tooltip, dari atas ke bawah:

1. Judul **Tier breakdown**.
2. Baris info: `Default price {nilai} · Weight {nilai g atau none}`.
3. Satu blok per tier, berisi:
   - `{type} · {Code master}`,
   - **range band yang cocok**: `Price 10.001 – 20.000`, `Weight 1.001 – 2.000 g`, atau `... – Unlimited`,
   - nilai kontribusinya di sisi kanan. Untuk Percentage ditulis rumusnya, mis. `15% x 12.000 = 1.800`.
4. **Total margin**.

Kasus khusus per tier:

| Kondisi | Tampilan |
|---|---|
| Tidak ada band yang cocok | Range band terdekat tidak ditampilkan. Nilai kontribusi `0`. |
| Tier by Weight, produk tanpa weight | Keterangan "No primary weight", nilai `skipped` (kuning). |

Alasan menampilkan range: supaya QA dan user bisa mengecek sendiri apakah band yang dipakai sudah benar, tanpa menebak dari angka akhir.

### 5.6 Mengedit margin langsung

- **Tidak ada icon edit** dan **tidak ada label "manual"**.
- Klik angka margin → berubah jadi **field edit langsung (inline)**. **Enter** menyimpan, **Esc** membatalkan.
- Harga final ikut berubah (default price + margin baru).
- Edit di Pricelist **tidak** mengubah Category maupun Variable Price.

**Margin yang diedit user**

- Angka margin berwarna **oranye**.
- Siapa dan kapan mengedit **hanya** tampil di tooltip Tier breakdown. Tooltip tetap menampilkan hasil hitung asli, lalu:
  - `Calculated margin {nilai hitung}`,
  - `Margin edited by {user} · {tanggal dan jam}`,
  - `Current margin {nilai sekarang}`.
- Kalau user mengisi nilai yang sama dengan hasil hitung, status kembali menjadi calculated (warna normal).

**Log**

- Setiap edit margin tercatat di log Pricelist: nilai lama → nilai baru, user, waktu, dan penanda bahwa nilai ini **bukan lagi hasil hitungan multi-tier Category**.

### 5.7 Update to Pricelist (dari Category Price)

- Menghitung ulang margin **semua baris Pricelist** milik category itu dari tier terbaru.
- **Menimpa** margin yang diedit manual. Status override hilang, kembali calculated.
- Wajib konfirmasi (Bagian 4.9).
- Tercatat di log Pricelist: user siapa, dipicu dari Category Price mana.
- Tidak berjalan otomatis ketika master atau category berubah.

### 5.8 Aturan hitung

Lihat Bagian 2.2 sampai 2.5. Ringkasnya: `Final = Default price + jumlah kontribusi tier yang cocok`. Persentase selalu dari default price. Tier by Weight dilewati kalau tidak ada weight. Beberapa tier by Amount boleh ikut sekaligus.

### 5.9 Acceptance criteria

- [ ] Setelah Update to Pricelist, SKU contoh (default 16.000, weight 1.500 g) menghasilkan margin 8.500 dan final 24.500.
- [ ] Kolom Weight tampil setelah SKU. Header punya icon info yang menjelaskan sumber weight.
- [ ] Weight kosong atau 0 menampilkan peringatan dan tooltip. Tier by Weight dilewati.
- [ ] Hover margin menampilkan breakdown per tier lengkap dengan range band, default price, dan weight.
- [ ] Margin diedit lewat klik angka (inline), tanpa icon edit atau label. Angka yang diedit berwarna oranye.
- [ ] Tooltip untuk margin yang diedit menampilkan hasil hitung asli, siapa yang mengedit, dan kapan.
- [ ] Edit margin tercatat di log (lama → baru, penanda bukan hasil hitungan).
- [ ] Update to Pricelist menimpa termasuk margin yang diedit, setelah konfirmasi, dan tercatat di log Pricelist (user + category sumber).

---

## 6. Alur end to end

| # | Langkah | Menu | Hasil yang diharapkan |
|---|---|---|---|
| 1 | Buat Variable Price A (by Amount) beserta band. | Variable Price | Tersimpan. Used in Categories = 0. |
| 2 | Buat Variable Price B (by Weight) beserta band. | Variable Price | Tersimpan. Satuan band gram. |
| 3 | Edit Category Price, pilih A dan B di Select Variable Price (opsional C). | Category Price | Tier muncul dengan snapshot. Opsi yang sudah dipilih hilang dari daftar. |
| 4 | (Opsional) Edit Value lokal di salah satu tier. | Category Price | Icon info oranye muncul di header tier itu. Master tidak berubah. |
| 5 | Buka Variable Price A, lihat section Used in Category Price. | Variable Price | Category tadi tampil di tabel. |
| 6 | Ubah Value di master A, klik Update to Category, konfirmasi. | Variable Price | Snapshot di category pemakai tertimpa. Toast muncul. Pricelist belum berubah. |
| 7 | Buka Category dari link Open, cek snapshot. | Category Price | Band sama dengan master A. Icon info (jika ada) hilang. |
| 8 | Klik Update to Pricelist, centang persetujuan, konfirmasi. | Category Price | Margin dan harga final semua baris Pricelist category itu dihitung ulang. |
| 9 | Buka Pricelist Product, cek Weight, harga final, hover margin. | Pricelist Product | Angka sesuai hitungan. Breakdown menampilkan range tiap tier. |
| 10 | (Opsional) Klik angka margin, ubah, Enter. | Pricelist Product | Angka berwarna oranye. Tooltip mencatat siapa dan kapan. |
| 11 | Jalankan Update to Pricelist lagi dari Category. | Category Price | Margin yang diedit tertimpa hasil hitungan. Warna kembali normal. |

---

## 7. Data contoh dan hasil yang diharapkan (untuk uji)

### 7.1 Master

**VP-AMT-RETAIL** (by Amount)

| Start | End | Type | Value |
|---|---|---|---|
| 0 | 10.000 | Amount | 2.000 |
| 10.001 | 20.000 | Amount | 3.000 |
| 20.001 | Unlimited | Amount | 4.000 |

**VP-WGT-STD** (by Weight, gram)

| Start | End | Type | Value |
|---|---|---|---|
| 1 | 1.000 | Amount | 1.500 |
| 1.001 | 2.000 | Amount | 2.000 |
| 2.001 | Unlimited | Percentage | 15 |

**VP-AMT-MKTPLACE** (by Amount)

| Start | End | Type | Value |
|---|---|---|---|
| 0 | 14.999 | Amount | 0 |
| 15.000 | 25.000 | Amount | 3.500 |
| 25.001 | Unlimited | Amount | 5.000 |

Category `SH-GARME` memasang ketiganya dengan urutan: VP-AMT-RETAIL, VP-WGT-STD, VP-AMT-MKTPLACE.

### 7.2 Hasil hitung per SKU

| SKU | Default price | Weight | Tier 1 (RETAIL) | Tier 2 (WGT-STD) | Tier 3 (MKTPLACE) | Margin | Final |
|---|---|---|---|---|---|---|---|
| SKU-001 | 16.000 | 1.500 g | 3.000 | 2.000 | 3.500 | **8.500** | **24.500** |
| SKU-002 | 22.500 | tidak ada | 4.000 | dilewati | 3.500 | **7.500** | **30.000** |
| SKU-003 | 20.500 | 1.000 g | 4.000 | 1.500 | 3.500 | **9.000** | **29.500** |
| SKU-004 | 12.000 | 3.200 g | 3.000 | 15% × 12.000 = 1.800 | 0 | **4.800** | **16.800** |
| SKU-005 | 30.000 | 500 g | 4.000 | 1.500 | 5.000 | **10.500** | **40.500** |

### 7.3 Kasus batas yang perlu diuji

| Kasus | Hasil yang diharapkan |
|---|---|
| Default price tepat 10.000 pada VP-AMT-RETAIL | Masuk band 1 (2.000), karena batas atas ikut dihitung. |
| Default price 10.001 | Masuk band 2 (3.000). |
| Weight tepat 1.000 g pada VP-WGT-STD | Masuk band 1 (1.500). |
| Weight 1.001 g | Masuk band 2 (2.000). |
| Weight 0 atau kosong | Tier by Weight dilewati. Tier by Amount tetap dihitung. |
| Weight di bawah 1 g (mis. 0,5 g) | Tidak ada band yang cocok pada VP-WGT-STD, kontribusi 0 (perlu konfirmasi, Bagian 9). |
| Value minus pada band | Mengurangi margin. Final = default + margin. |
| SKU-003 diedit manual menjadi 5.000 | Margin 5.000 (oranye), final 25.500. Tooltip: Calculated margin 9.000, Current margin 5.000, ditambah nama user dan waktu edit. |
| Update to Pricelist dijalankan setelah itu | SKU-003 kembali 9.000 dan 29.500. Warna normal. |
| Ubah Value tier 3 di Category (lokal) lalu Update from Master | Nilai kembali sama dengan master. Icon info hilang. |
| Hapus tier, lalu buka Select Variable Price | Master tadi muncul lagi di opsi. |
| Pasang semua master Active | Select Variable Price menampilkan "No Variable Price available". |
| Variable Price sudah dipakai category, buka form-nya | Type disabled + gembok + tooltip tambahan. |
| Variable Price belum dipakai category, buka form-nya | Type masih bisa diganti. |
| Ubah Value master lalu buka Pricelist tanpa menjalankan update | Pricelist tidak berubah. |

---

## 8. Log, audit, dan hak akses

| Tempat | Yang dicatat |
|---|---|
| Variable Price (Audit Log di form) | Buat, ubah, Update to Category (user, waktu, jumlah category). |
| Category Price (Audit Log di form) | Tambah dan hapus tier, edit nilai tier, Update from Master (master mana), Update to Pricelist. |
| Pricelist Product (log) | Edit margin: nilai lama → baru, user, waktu, penanda bukan hasil hitungan. Update to Pricelist: user, category sumber. |

Hak akses: menu Variable Price mengikuti pola menu Business Development lain (didaftarkan ke sidebar dan role). Aturan siapa boleh menjalankan Update to Category dan Update to Pricelist perlu dikonfirmasi (Bagian 9).

---

## 9. Belum diputuskan dan perlu konfirmasi

Poin 1 dan 2 adalah temuan dari pengecekan kode hari ini. Sisanya dari analisis requirement.

| # | Pertanyaan | Kenapa penting | Usulan |
|---|---|---|---|
| 1 | **Apa yang terjadi di Pricelist ketika default price produk berubah?** Saat ini, margin hanya dihitung dari band saat harga produk **pertama kali** diisi (harga sebelumnya 0). Kalau harga berubah belakangan, margin lama dipertahankan dan hanya final yang bergeser (final = harga baru + margin lama). | Dengan multi tier, margin berbasis harga bisa jadi tidak lagi sesuai band setelah harga berubah. Tidak ada update otomatis, jadi user harus menjalankan Update to Pricelist. | Pertahankan perilaku sekarang selama fase trial, dan tulis jelas di docs bahwa harga baru baru "dihitung ulang" lewat Update to Pricelist. |
| 2 | **Produk baru atau Pricelist baru: margin awalnya dari mana?** Saat ini produk yang baru diberi harga mendapat margin dari band Category. Di sisi lain weight bisa baru diisi belakangan. | Tanpa keputusan, margin awal produk baru bisa hanya dari tier by Amount, lalu berubah setelah Update to Pricelist. | Margin awal dihitung dari semua tier yang datanya sudah ada (weight kosong = tier Weight dilewati). |
| 3 | Saat Type diubah (master belum dipakai), apa yang terjadi pada band? | Satuan band berubah dari Rp ke gram. | Band dikosongkan dengan dialog konfirmasi. |
| 4 | Satuan weight: kolom weight di Dimension & Weight punya satuan sendiri. Apakah sistem harus mengonversi ke gram sebelum dicocokkan? | Weight 1,5 kg kalau dibaca 1,5 akan salah band. | Konversi ke gram sebelum dicocokkan. Perlu dicek dulu bagaimana satuan disimpan. |
| 5 | Weight pecahan atau di bawah 1 g: band by Weight dimulai dari 1. | Weight 0,5 g tidak cocok band mana pun. | Terima apa adanya (kontribusi 0), atau baris pertama dimulai dari 0. |
| 6 | Category tanpa tier: Update to Pricelist menghasilkan margin 0. Perlu dipastikan itu yang diinginkan. | Menimpa margin lama semua Pricelist category itu menjadi 0. | Boleh, tapi dialog konfirmasi menyebut "no tiers". |
| 7 | Variable Price menjadi **Inactive** atau **dihapus** padahal sudah dipasang di category. | Category pemakai bisa kehilangan acuan. | Yang sudah terpasang tetap jalan (snapshot). Master Inactive tidak bisa dipasang baru. Hapus master yang masih dipakai ditolak. |
| 8 | Category **Inactive** di tabel Used in Category Price: ikut tertimpa saat Update to Category? | Dialog menyebut jumlah category. | Ikut tertimpa, dan statusnya tampil di tabel dan dialog. |
| 9 | Update from Master **massal** di datalist Category Price. | Ada di card ETM-16313 tapi tidak digambar di wireframe. | Kalau dikerjakan, pakai pola icon massal di atas tabel seperti Variable Price. |
| 10 | Siapa yang boleh menjalankan Update to Category dan Update to Pricelist. | Dampaknya besar (menimpa banyak data). | Pakai hak akses edit menu masing-masing, kecuali ada permintaan role khusus. |
| 11 | Jumlah baris Pricelist yang terdampak bisa sangat besar. Apakah update dijalankan di latar belakang dan user diberi tahu saat selesai? | Menghindari halaman menggantung. | Jalankan sebagai proses latar belakang dan tampilkan toast saat mulai dan selesai. |

---

## 10. Di luar cakupan

- Update otomatis dari master ke category, atau dari category ke pricelist.
- Migrasi massal data band lama di Category.
- Mencampur Amount dan Weight dalam satu Variable Price.
- Perubahan DataList Category Price.
- Menulis balik hasil edit di Category atau Pricelist ke master.

---

## 11. Referensi

| Item | Lokasi |
|---|---|
| Wireframe final (layar A–G dan alur E2E) | https://claude.ai/artifact/CSgXVMhzsztTJqwpeD7f89 |
| Jira Variable Price | https://erpintegration.atlassian.net/browse/ETM-16312 |
| Jira Category Price | https://erpintegration.atlassian.net/browse/ETM-16313 |
| Jira Pricelist Product | https://erpintegration.atlassian.net/browse/ETM-16314 |
| SOT Variable Price | `olshoperp/docs/qa-docs/_meta/sot/businessdevelopment-variable-price-source-of-truth.md` (aturan Type di SOT masih "immutable setelah save pertama" dan perlu disesuaikan dengan Bagian 3.5) |
| Docs menu terkait | `docs/qa-docs/businessdevelopment-category-price/`, `docs/qa-docs/businessdevelopment-pricelist-product/` |
| Komponen UI yang diacu | Category Price `Form.vue` dan `DataList.vue`, Pricelist `DataList.vue`, pola "Select Product" di `SCM/PurchaseOrder/DatalistDetail.vue` |
