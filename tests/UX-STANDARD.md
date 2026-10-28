# Kitab UI/UX — standar crawl OlshopERP

Standar ini dipakai crawl Playwright supaya tiap menu dinilai dengan tolok ukur yang sama. Bahasa ini untuk QA.

**Keputusan final** di §2 ditetapkan QA lead (15 Oktober 2026). Itu yang di-assert.

**Fakta baseline** di §3 adalah hasil crawl Purchase Order di staging, 14 Oktober 2026 sekitar 23:05–23:15 WIB, company lumicharmsid (153). Bukan keputusan desain terpisah. Dipakai sebagai angka dan pola yang sudah terukur.

Bukti layar: folder Drive [UX crawl 14 Okt 2026](https://drive.google.com/drive/folders/1O5z48Cb_uGjW7CeWjzeLXLiSgtyDptSv).

Spec sekali pakai (tidak di repo): `tests/scratch/ux-common.ts`, `ux-po-1.spec.ts`, `ux-po-2.spec.ts`, `ux-vp.spec.ts`.

Data uji crawl itu (PO-6ACFA887, Variable Price `QA-AUTO-VPUX-*`) tercatat sudah tidak ada saat dokumen ini ditulis. Tidak ada PO yang di-approve. Catatan: agent **tidak menghapus** data uji; data uji tidak dihapus kecuali TC-nya memang menguji delete / show deleted.

## 1. Cara memakai

1. Baca requirement menu untuk aturan bisnis.
2. Baca kitab ini untuk tampilan dan interaksi.
3. Checklist per pilar ada di §6. Satu pilar = satu kelompok assert. Jangan digabung jadi satu hasil “UI lulus”.
4. Yang menyimpang dari §2 dicatat sebagai temuan, meski menu itu meniru perilaku lama.
5. Dua hal di §5 **belum** diputuskan. Catat apa yang terlihat, jangan gagalkan menu karenanya.

## 2. Keputusan final

### 2.1 Simpan form vs autosave

| Jenis layar | Aturan |
|-------------|--------|
| Form **master**, field biasa (header, field di accordion/section) | Tidak ada autosave. Tersimpan hanya lewat **Save All**. Blur, pindah section, atau scroll tidak boleh mengirim simpan. |
| Level **transaksional** | Autosave boleh. Contoh: baris line item Purchase Order. Ubah qty lalu pindah field → tersimpan, ada toast sukses atau toast error. |
| **Inline edit** (sel datatable, atau text box di section grid/konfigurasi yang bisa langsung diketik, mis. Margin Price Configuration di Variable Price) | Berlaku untuk master dan transaksional. Selesai edit (blur/Tab/Enter) wajib tersimpan tanpa klik Save All, seperti header SO/PO. |
| Header transaksi (SO/PO) selama detail masih kosong | Autosave. Ganti Transaction Date lalu blur langsung mengirim simpan header dan bertahan setelah reload (terukur 15-10-2026). |

Klasifikasi sebelum assert: field form biasa ikut baris pertama; baris detail transaksi (seperti detail PO) ikut baris kedua; sel datatable atau text box section konfigurasi yang diketik langsung di tempat ikut baris ketiga. Keputusan Rachy 15-10-2026: input Margin Price Configuration Variable Price = inline edit, jadi wajib autosave.

### 2.2 Label tombol simpan

Di create dan di edit, label wajib sama: **Save All**.

Tidak boleh “Save” di create dan “Save All” di edit.

### 2.3 Audit Log

Audit Log wajib panel **slide-over** (drawer kanan), pola Purchase Order.

Bukan section/accordion inline di badan form. Link di sidebar membuka drawer, bukan menggulir ke section bawah.

Isi drawer yang jadi acuan PO: pencarian, Columns Show/Hide, Export, kolom Date | Source | Old Value | New Value | Action | User, urutan terbaru di atas, pagination 20.

### 2.4 Inline edit

Edit langsung di sel datatable atau di text box section grid/konfigurasi tersimpan saat edit selesai (blur atau setara), tanpa Save All. Berlaku menu master dan menu transaksi. Toast sukses atau error tetap muncul.

### 2.5 Wording toast sukses

Kalimat target, persis:

| Aksi | Kalimat |
|------|---------|
| Create | `Data has been successfully created.` |
| Update | `Data has been successfully updated.` |
| Delete | `Data has been successfully deleted.` |

Crawl 14 Oktober 2026 masih melihat kalimat lama. Itu temuan, bukan acuan baru:

- Update PO: `The data has been success updated`
- Delete PO: `The data has been success deleted`
- Create Variable Price: `The new data has been successfully created.`

### 2.6 Warna tombol

| Peran | Warna | Dipakai untuk |
|-------|--------|----------------|
| Primary solid | `rgb(16, 78, 100)` (#104E64), teks putih | Aksi utama: **Create** di daftar, **Save All** di form. Satu tombol solid primary per area. Tombol **Delete** juga primary, bukan merah (keputusan Rachy 15-10-2026, konsisten di semua menu). |
| Outline | Outline dan teks warna primary yang sama, latar transparan | Aksi baris di datatable detail, aksi bulk, dan aksi sekunder (Export, Import, Columns, Advanced Filter, Edit, Approve, Print). |
| Konfirmasi Delete di modal | `rgb(193, 0, 7)` (merah), teks putih. Terukur sama di PO, SO General, Variable Price (15-10-2026) | Diterima untuk sementara (keputusan Rachy 15-10-2026), **asal konsisten merah di semua menu**. Menu yang modal Delete-nya beda warna = gagal. |
| Pengecualian outline | Warning atau danger | Hanya tombol spesial yang jarang dipakai atau memang harus menarik perhatian. Bukan aksi rutin. |

Semua tombol outline ikon-saja (termasuk hapus di baris dan hapus bulk) wajib outline primary `rgb(16, 78, 100)` (terukur sama di PO, SO General, Variable Price). Hover danger (`hover:bg-danger/10`) boleh, seperti PO. Merah tidak dipakai untuk tombol Delete.

Crawl PO juga melihat ikon kecil `rgb(27, 142, 253)` di samping Save All. Tujuan tombol itu belum terdokumentasi. Kalau fungsinya aksi rutin, outline-nya harus primary. Warna lain hanya lolos jika tombol itu masuk pengecualian spesial/warning/danger.

### 2.7 Spasi

Jarak antar konten, antar accordion, dan antar field harus konsisten di create, edit, dan daftar menu yang sama.

Crawl PO 14 Oktober 2026 **tidak** menyimpan angka margin, gap, atau padding. Belum ada nilai piksel baku. Sampai angka itu dikunci, crawl mengukur computed style dan membandingkan (langkah di pilar spasi, §6).

### 2.8 Select / dropdown saat scroll

Panel pilihan tidak boleh menumpuk di atas field lain secara salah, terpotong container, atau tertinggal di koordinat lama saat halaman atau container di-scroll.

Yang benar: panel mengikuti field, atau tertutup saat scroll. Gagal jika panel tetap di posisi viewport lama sementara field sudah pindah, terpotong `overflow`, atau menutup field pemicunya.

### 2.9 Kolom aksi redundan

Kalau sel kode (Code / Trx. Code) di tabel sudah bisa diklik dan membuka dokumen (di tab yang sama atau tab baru), tabel itu **tidak boleh** punya kolom atau tombol terpisah (mis. teks `Open` + ikon) yang membuka tujuan yang sama. Satu tujuan, satu pemicu: sel kode.

Contoh gagal (15-10-2026): Variable Price edit, accordion **Used in Category Price**. Sel Code `GRS05` adalah link `target=_blank` ke `/businessdevelopment/pricelist-category/edit/27`; kolom paling kanan `Open` + ikon membuka URL yang sama.

### 2.10 Datalist: status, breadcrumb, sel kode, garis bawah

Keputusan Rachy 15-10-2026.

| Aturan | Wajib | Terukur baseline (getComputedStyle, 15-10-2026) |
|--------|-------|----------------------------------|
| Gaya status | Semua menu memakai gaya status primary: teks `rgb(16, 78, 100)`, `font-weight: 700`, rata tengah. Bukan teks hijau/merah tipis. | PO `Trx. Status`: `<strong class="text-primary">`, `rgb(16, 78, 100)`, 700, 13.6px, center. Variable Price: `text-success` `rgb(0, 150, 137)` / Inactive `rgb(193, 0, 7)`, 400, kiri = gagal. |
| Breadcrumb | Satu nama grup yang sama di daftar, create, dan edit, mengikuti sidebar. | Variable Price daftar `Busdev > Master Data Busdev > Variable Price`, form `Busdev > Price > …` = gagal. |
| Sel kode | Sel Code/SKU/Trx. Code di datalist wajib link ke halaman edit, gaya `text-primary font-bold` (`rgb(16, 78, 100)`, 700). | Master System Product: SKU `<a class="text-primary font-bold" href="/supplychain/product/edit/{id}" target="_blank">`. PO: Trx. Code link bold primary. Variable Price: teks biasa `rgb(71, 85, 105)`, 400, tidak bisa diklik = gagal. |
| Garis bawah | Tidak ada garis bawah titik-titik (`underline decoration-dotted`) pada sel datalist. Tooltip boleh tanpa garis. | Variable Price `Used In Categories`: `underline dotted` = gagal. Tidak ada di menu lain. |
| Kata hitungan | Bentuk jamak benar: `0 categories`, `1 category`, `2 categories`. | Variable Price `0 category` = gagal. |

### 2.11 Datalist fungsional (keputusan Rachy 15-10-2026)

| Fitur | Aturan |
|-------|--------|
| Global search | Menu tanpa Advanced Filter: pencarian wajib *contains* di semua kolom tampil (termasuk Type, Status), tidak peka huruf. Prefix-only = gagal → card Error. Menu dengan Advanced Filter: prefix ditoleransi. |
| Export | Export halaman aktif saja diterima. Header file harus sama dengan header datalist. Tipe sel numerik wajib hanya untuk kolom murni angka; kolom campuran teks (mis. `0 category`) boleh General. |
| Show deleted data | Lulus jika baris terhapus tampil dengan teks merah `Deleted` di kolom Action. Status `Active` pada baris terhapus tidak dihitung temuan. |

## 3. Fakta baseline Purchase Order

Dipakai ulang saat mengukur. Jangan diganti diam-diam oleh kesan crawl menu lain.

### Warna terukur

| Token | Computed | Pemakaian di PO |
|-------|----------|-----------------|
| Primary | `rgb(16, 78, 100)` | Create (daftar), Save All (sidebar form) |
| Outline primary | latar transparan atau `rgba(255,255,255,.35)`, teks primary, `border-current` | Ikon baris dan tautan toolbar |
| Danger | `rgb(193, 0, 7)` | Tombol Delete di dialog “Are you sure?” |
| Header accordion | `oklch(0.929 0.013 255.5)` (slate-200), teks slate-600 | Basic Information, Purchase Order Detail, dan section lain |
| Bintang wajib | `oklch(0.637 0.237 25.3)` (red-500) | Transaction Date, Supplier, Currency, Exchange Rate |

### Breadcrumb

Breadcrumb harus mengikuti grup sidebar.

PO lulus pola ini: daftar `SCM > Purchase Order`; form `SCM > Purchase Order > Edit`. Segmen terakhir tebal. Sidebar: Supply Chain Management > Purchase Order.

### Toast

- Pustaka toastify, pojok **kanan atas**.
- Kartu putih, ikon hijau untuk sukses, ikon merah untuk error, plus tombol tutup.
- Validasi backend tampil sebagai toast, bukan teks di bawah field dan bukan border merah.
- Pola validasi: `<pesan pertama> (and N more error(s))`. Contoh Variable Price: `The code field is required. (and 1 more error)`.

### Empty state

| Kondisi | Teks PO |
|---------|---------|
| Pencarian tidak ketemu | `No matching records found` |
| Grid detail kosong | `no data available in table` |
| Info jumlah | `Showing 0 to 0 of 0 entries` |

Tidak ada ilustrasi atau tombol ajakan di kosong itu.

### Pola letak yang ikut baseline (selama tidak bentrok dengan §2)

- **Create** di kanan atas daftar, solid primary, ada ikon.
- Toolbar: pencarian `find something ...` kiri, Advanced Filter; Show deleted, Columns Show/Hide, Export di kanan atas tabel.
- Aksi baris: ikon outline, tooltip (Edit, Approve, Print, Closed, Delete).
- **Save All** di sidebar kanan form. PO menempel di bawah radio Draft/Open. Menu tanpa radio status tetap menaruh Save All di sidebar, labelnya tetap Save All.
- Section form: accordion, header abu-abu, chevron.
- Dialog hapus daftar: judul `Are you sure?`, badan `Do you really want to delete these records? This process cannot be undone.`, satu tombol Delete merah `rgb(193, 0, 7)` (diterima, harus konsisten). Tutup dengan Esc atau klik luar. Komponen yang sama terlihat di PO dan Variable Price.

### Simpan yang teramati di PO (ilustrasi §2, bukan kalimat toast acuan)

- Header: blur Supplier Ref Doc tidak mengirim request. Save All mengirim `POST /api/supplychain/purchase-order/{id}`.
- Detail: ubah PO Qty lalu Tab mengirim `PUT /api/supplychain/purchase-order-detail/{id}`. Error contoh: `Input Quantity exceeds Outstanding PR. Max allowed: 1`.
- Pilih produk di Select Product menambah baris dan langsung tersimpan.
- Hapus baris detail PO saat crawl itu **tanpa** dialog. Lihat §5.

## 4. Variable Price terhadap kitab (14 Oktober 2026)

Dicatat agar crawl master tidak mengulang riset. Assert tetap §2, bukan “samakan dengan AS-IS Variable Price”.

| Poin | Yang terlihat | Terhadap kitab |
|------|----------------|----------------|
| Breadcrumb | Daftar `Busdev > Master Data Busdev > Variable Price`. Create/Edit `Busdev > Price > Variable Price > …`. Menu di sidebar ada di grup **Price**. | Gagal. Daftar dan form harus sama-sama mengikuti sidebar. |
| Label simpan | Create = `Save`, Edit = `Save All` | Gagal. Keduanya `Save All`. |
| Warna tombol utama | Save/Save All primary `rgb(16, 78, 100)`; Update to Category dan tambah band outline primary; Create primary | Lulus warna. |
| Autosave Margin Price Configuration | Recheck 15-10-2026: Value diubah 0 → 7 lalu Tab = 0 request, setelah reload kembali 0. | **Gagal.** Input section ini inline edit (§2.1, §2.4), wajib tersimpan tanpa Save All. |
| Audit Log | Accordion inline di bawah form. Link sidebar menggulir ke section. Tanpa kotak cari. | Gagal wadah. Harus slide-over. Isi nilai (enum mentah, old/new) tetap di pilar audit crawl menu. |
| Bintang wajib | red-600, sedikit lebih gelap dari red-500 PO | Catat selisih. Bukan pemblokir warna tombol. |
| Validasi & dialog hapus | Toast, pola `(and N more error)`; dialog “Are you sure?” sama | Lulus pola. Kalimat sukses create masih kalimat lama (§2.5). |
| Advanced Filter | Tidak ada di daftar | Info. Bukan syarat kitab ini untuk master kecil. |

## 5. Belum diputuskan

Jangan dijadikan gagal/lulus.

1. Alur create: PO membuka `/create` lalu langsung membuat draft dan pindah ke Edit. Variable Price punya halaman create, lalu kembali ke daftar. Keduanya masih terbuka.
2. Hapus baris detail PO tanpa konfirmasi.

## 6. Checklist crawl (untuk spec Playwright)

Tiap pilar berdiri sendiri. Laporkan lulus/gagal per baris, plus nilai terukur bila ada.

Company crawl UI mengikuti allowlist menu itu. Baseline PO diukur di lumicharmsid (153).

### Pilar tombol

1. Di daftar, hitung tombol solid primary. Harus satu: **Create**. `background-color` = `rgb(16, 78, 100)`, teks putih.
2. Di form, tombol solid primary harus **Save All**, warna yang sama, di create dan di edit.
3. Label create dan edit sama persis: `Save All`.
4. Aksi baris datatable dan aksi bulk: outline + teks primary, bukan solid, bukan warna lain.
5. Tombol outline berwarna lain hanya jika aksi itu spesial, warning, atau danger. Catat label tombolnya.
6. Semua tombol outline ikon-saja (termasuk hapus baris dan hapus bulk): outline primary `rgb(16, 78, 100)`, bukan merah.
7. Modal `Are you sure?`: tombol Delete tetap merah `rgb(193, 0, 7)`, teks putih, sama di semua menu. Beda warna dari menu lain = gagal.

### Pilar simpan

1. Form master, field biasa: isi atau blur satu field header. Tidak ada request simpan. Baru ada setelah Save All.
2. Menu transaksi: ubah satu line item lalu pindah field. Ada request simpan baris itu, plus toast.
3. Jika ada inline edit (sel datatable atau text box section konfigurasi, master atau transaksi): selesai edit tanpa Save All, ada request simpan, data tetap ada setelah reload.
4. Menu transaksi dengan detail kosong: ganti Transaction Date header lalu blur. Ada request simpan header, nilai bertahan setelah reload (baseline PO `POST /api/supplychain/purchase-order/{id}`, SO General `POST /api/omnichannel/sales-order/{id}`).
5. Tinggalkan halaman dengan perubahan form master yang belum di-Save All. Catat apakah ada peringatan. Kitab tidak mewajibkan teks peringatan tertentu.

### Pilar toast

1. Setelah create, update, dan delete yang sah, teks toast persis kalimat §2.5.
2. Posisi kanan atas.
3. Field wajib yang dikosongkan: toast, bukan error di bawah field. Pola `(and N more error` bila pesannya lebih dari satu.

### Pilar breadcrumb

1. Catat teks breadcrumb daftar dan form.
2. Samakan dengan jalur sidebar menu itu (grup dan nama menu).
3. Daftar dan form memakai segmen modul/menu yang sama. Form menambah segmen Create atau Edit.

### Pilar tabel / aksi redundan

1. Untuk tiap tabel (datalist dan tabel di dalam form): kalau sel kode berupa link, cek tidak ada kolom/tombol lain (`Open`, ikon external link) dengan `href` yang sama. Ada = gagal (§2.9).

### Pilar datalist tampilan

1. Status: computed color `rgb(16, 78, 100)`, weight 700, rata tengah (§2.10).
2. Sel kode: `<a>` ke `/edit/{id}`, primary bold.
3. Tidak ada `text-decoration-line: underline` + `dotted` di sel tabel.
4. Breadcrumb daftar = create = edit = grup sidebar.
5. Teks hitungan memakai bentuk jamak benar.

### Pilar audit

1. Buka Audit Log dari sidebar.
2. Yang terbuka panel slide-over, bukan section inline.
3. Kolom memuat Old Value dan New Value.
4. Label terbaca. Bukan id mentah atau enum mentah. Aturan isi tambahan tetap dari requirement menu.

### Pilar empty state

1. Pencarian yang tidak ketemu: `No matching records found`.
2. Grid detail kosong: `no data available in table`.
3. Baris info: `Showing 0 to 0 of 0 entries`.

### Pilar spasi

Angka baku belum ada. Ukur, jangan mengira.

1. Di form, ambil `getBoundingClientRect()` tiap header accordion. Gap = `top` accordion berikut − `bottom` accordion ini. Create dan edit harus sama. Selisih lebih dari 1px = gagal konsistensi di menu itu.
2. Di dalam satu section, baca `margin-top`, `margin-bottom`, dan `gap` pembungkus field. Field sejenis harus sama.
3. Ulangi di Purchase Order sekali, simpan angkanya di log crawl sebagai baseline terukur pertama. Crawl menu lain membandingkan ke angka itu setelah baseline PO tercatat. Sebelum angka PO ada, gagalkan hanya ketidakkonsistenan di dalam menu yang sedang diuji.

### Pilar dropdown

1. Buka satu select di form (dan di dalam dialog/accordion bila ada).
2. Scroll halaman. Panel tidak boleh tertinggal di koordinat lama dan tidak boleh terpotong.
3. Scroll container yang menggulung (bukan window). Assert yang sama.
4. Tutup atau tempel ulang ke field, keduanya lulus. Menumpuk menutup field pemicu, atau tertinggal di posisi scroll sebelumnya, gagal.
