---
doc_type: gemini-generation-brief
target_menu: "Purchase Report"
menu_slug: accounting-purchase-report
source_of_truth: docs/qa-docs/accounting-purchase-report/ (repo olshoperp — dibaca 2026-09-01)
purpose: >
  Brief lengkap untuk di-paste ke Gemini agar generate SATU dokumen
  konsolidasi "Purchase Report" bergaya Pentaho — bukan wireframe, bukan kode.
status: ready-to-send-to-gemini
source_doc_status: >
  KB review v2.0 · requirement review v2.0 · technical review v2.0 ·
  user-guide review v1.0 · ~600 baris total · tidak ada feature-map/Lingo cards.
  AS-IS dual-tab shell; 2 gap Open (default tanggal, Total Tagihan).
---

# BRIEF UNTUK GEMINI — Generate Dokumentasi "Purchase Report"

> **Cara pakai:** copy/upload file ini ke Gemini. **PART 1** = instruksi.
> **PART 2** = SELURUH fakta sumber. Gemini wajib pakai Part 2 saja — dilarang mengarang.

---

# PART 0 — Kenapa struktur ini seperti ini / beda dari menu lain

1. **Laporan read-only — bukan transaksi.** Tidak ada create/edit/approve dokumen di menu ini. Grid menampilkan baris dari PO atau PI yang sudah ada. **Jangan** paksakan siklus status Draft/Open/Approved untuk menu report — cukup jelaskan status yang tampil = status **dokumen sumber**.

2. **Satu menu, dua dataset terisolasi.** Tab **Purchase Order** vs **Purchase Invoice** — bukan radio blank menunggu pilihan, bukan campur PO+PI dalam satu grid. Ganti tab = ganti seluruh dataset + export terpisah. Ini konsep inti yang harus dijelaskan di awal.

3. **Grouping per Supplier.** Baris digroup per nama supplier; **total supplier** tampil di header group (kanan), bukan running total Excel per baris. Kolom **Total Tagihan** per baris = nilai line — beda dari ilustrasi card lama.

4. **Default filter tanggal = bulan kalender berjalan** (bukan 30 hari mundur seperti draft card Jira). Gap harus disebut netral; docs mengikuti perilaku sistem sekarang.

5. **Total Price exclude Other Cost / Other Discount** dokumen — angka di report bisa beda dari grand total form PO/PI. Warning wajib supaya user tidak mengira bug.

6. **Bukan Account Payable Report** — tidak untuk aging utang; tidak ada join PO↔PI di grid. Bedakan eksplisit dari laporan AP.

---

# PART 1 — Instruksi untuk Gemini

## 1.1 Peran

Kamu = technical writer bergaya pentaho.com: definisi → prosedur → tabel referensi; langkah bernomor; callout **Note / Tip / Warning**; tanpa marketing. **Sumber satu-satunya = PART 2**.

## 1.2 Bahasa & tone

- Bahasa Indonesia + istilah EN seperlunya (Purchase Report, Purchase Order, Purchase Invoice, Total Tagihan, Export All, Advanced Filter).
- Definisikan istilah sebelum dipakai.
- **NOL** path file / class / kolom DB / ID internal (GAP-PURREP-xx, R-xx, INV-xx, ETM-xxxxx di body).
- Menu **tidak punya feature-map** — jangan sebut ID `SF-…`.

## 1.3 Struktur dokumen WAJIB (20 section)

1. Judul & Ringkasan Singkat (read-only; per SKU per supplier; dual tab)
2. Istilah Kunci (POV, Total Tagihan, Total Price, Other Cost/Disc, dll.)
3. Kapan & Kenapa Dipakai
4. Prasyarat
5. Posisi dalam Alur Bisnis (`flowchart LR` — PO/PI → tab → group supplier → export)
6. Lokasi Menu + placeholder screenshot
7. **Bukan siklus status dokumen report** — jelaskan: read-only; status kolom = status sumber PO/PI
8. Dua Tab: Purchase Order vs Purchase Invoice — tabel pembanding
9. Langkah Penggunaan — tab Purchase Order
10. Langkah Penggunaan — tab Purchase Invoice
11. Grouping Supplier & Total Tagihan (header group vs kolom line)
12. Referensi Kolom Grid
13. Filter, Search & Columns Show/Hide
14. Export — Export All (async) & This Page (terpisah per tab)
15. Aturan Bisnis & Validasi — format "Kalau kamu…, maka…"
16. Keterbatasan & Hal dalam Tinjauan (default tanggal, Total Tagihan, no PO↔PI link)
17. Hubungan dengan Menu Lain (`flowchart TB`) — termasuk **bukan** AP Report
18. Troubleshooting
19. FAQ
20. Lihat Juga / Referensi

## 1.4 Mermaid

- **Wajib:** §5 `flowchart LR`; §17 `flowchart TB` (PO, PI, bukan AP).
- **Jangan** `stateDiagram-v2` untuk siklus transaksi — menu ini bukan dokumen berstatus.
- Boleh `flowchart TD` opsional untuk alur operator (buka → tab → filter → export).
- Label berkoma/spasi → kutip; `classDef` hex only; tiap diagram + fallback teks numbered list.

## 1.5 Placeholder gambar (min 5)

1. Sidebar Accounting → Report → Purchase Report
2. Dua tab Purchase Order / Purchase Invoice
3. Grid dengan group header supplier + total kanan
4. Advanced Filter Trx. Date (default bulan berjalan)
5. Export All + daftar file export per tab

## 1.6 Checklist penutup

- [ ] 20 section; **tidak** ada stateDiagram transaksi
- [ ] Dual tab PO/PI terisolasi; tidak campur dataset
- [ ] Group supplier + Total Tagihan line vs header dijelaskan
- [ ] Other Cost/Disc excluded — Warning jelas
- [ ] Bukan AP Report; tidak join PO↔PI
- [ ] Gap default tanggal & Total Tagihan framing netral
- [ ] Semua status PO/PI ikut; PO With+Without PR
- [ ] FAQ: PO+PI sekaligus?, draft ikut?, default 30 hari?

---

# PART 2 — SUMBER FAKTA LENGKAP (jangan menambah di luar ini)

> **Purchase Report** · Modul Accounting → Report · Route `/accounting/purchase-report`
> Read-only · Group per Supplier · Dua tab PO / PI

## §A. Ringkasan

Laporan pembelian **per baris SKU**, digroup per **Supplier**. Satu menu, **dua sudut pandang (tab)**:

| Tab | Sumber baris |
|-----|--------------|
| **Purchase Order** | Detail PO (With PR + Without PR) |
| **Purchase Invoice** | Detail Purchase Invoice / Supplier Invoice |

Satu load = **satu** dataset — PO dan PI **tidak** tampil bersamaan. **Tidak** menghubungkan PO ke PI di dalam grid. **Bukan** Account Payable Report (aging utang).

## §B. Kapan & Kenapa

| Pakai jika | Jangan jika |
|------------|-------------|
| Rekap pembelian per SKU per supplier dari PO | Butuh aging utang supplier (pakai AP Report) |
| Rekap dari faktur beli (PI) | Butuh PO dan PI dalam satu tabel sekaligus |
| Audit baris barang + hyperlink ke dokumen | Butuh edit transaksi dari report |
| Export data PO atau PI terfilter | Butuh grand total termasuk Other Cost/Disc dokumen |

## §C. Prasyarat

- Privilege view menu Purchase Report
- Data PO (tab PO) dan/atau PI (tab PI) sudah ada di company aktif
- Company scope — hanya transaksi company login
- Soft-deleted dokumen **tidak** tampil

## §D. Istilah Kunci

| Istilah | Arti |
|---------|------|
| **POV / Tab** | Sudut pandang: Purchase Order atau Purchase Invoice |
| **Total Price** | Nilai line produk — **tanpa** Other Cost / Other Discount header dokumen |
| **Total Tagihan (kolom)** | Nilai amount per **baris** (bukan running Excel per row) |
| **Total Tagihan (header group)** | Jumlah line amounts supplier itu dalam filter aktif |
| **Trx. Code** | Nomor PO atau PI — hyperlink ke dokumen sumber |
| **With PR / Without PR** | Kedua tipe PO ikut di tab Purchase Order |
| **Currency as-is** | Mata uang transaksi tidak dikonversi paksa |
| **Other Cost / Other Disc** | Biaya/diskon tambahan di dokumen PO/PI — **tidak** masuk Total Price report |

## §E. Shell UI (AS-IS)

| Control | Perilaku |
|---------|----------|
| **Tab Purchase Order / Purchase Invoice** | Ganti tab = ganti dataset seluruhnya |
| Default tab | **Purchase Order** — data langsung load (bukan grid kosong menunggu pilihan) |
| Trx. Date filter | Advanced Filter default: **awal–akhir bulan berjalan** |
| Global Search | Ya |
| Advanced Filter | Ya (SearchBuilder) |
| Columns Show/Hide | Ya |
| Export | Export All (async) · This Page · file list **per tab** |

> Draft card Jira menyebut blank sampai Type + default **30 hari**. AS-IS = **tab** (bukan blank) + default **bulan kalender berjalan**.

## §F. Grouping & Total Tagihan

- Group header = **nama Supplier** + nominal total di kanan header.
- Total supplier = jumlah Total Price line terfilter untuk supplier itu.
- Kolom **Total Tagihan** per baris = amount line (bukan akumulasi running seperti contoh Excel di card).

**Contoh konsep (PI):** beberapa baris SKU TROLIK* dalam group supplier yang sama — di UI, penjumlahan supplier tampil di **header group**, bukan running di setiap baris.

## §G. Kolom Grid

| Kolom | Keterangan |
|-------|------------|
| ID. Trx | Id detail |
| Trx. Date | Tanggal transaksi header (`dd-mm-yyyy HH:mm:ss`) |
| Type Transaction | Purchase Order / Purchase Invoice |
| Trx. Code | Hyperlink ke edit PO atau PI |
| SKU / Name | System Product (link + copy SKU) |
| Description | PO: deskripsi header; PI: deskripsi line |
| Qty / Unit | PO: order qty; PI: invoice qty |
| DPP / VAT / Currency | Currency **as-is**; beberapa kolom default hidden |
| Unit Price | Harga line before discount before VAT |
| Total Price | Line produk — **tanpa** Other Cost/Disc |
| Total Tagihan | Nilai line (+ total supplier di header group) |
| Trx. Status | Status dokumen sumber — **semua status** ikut |

Kolom supplier raw sering hidden (dipakai sebagai group key).

## §H. Tab Purchase Order — aturan data

1. Sumber: detail PO join header PO, product, supplier, currency, unit.
2. **With PR** dan **Without PR** — keduanya masuk.
3. **Semua** status PO (Draft, Open, Approved, dll.) — tidak difilter status di query.
4. Currency as-is.
5. Total Price dari harga line PO — tidak join Other Cost / Other Discount.
6. **Tidak** join ke Purchase Invoice atau AP Report.
7. Hyperlink Trx. Code → edit Purchase Order.

**Contoh:** Tab PO, supplier LUKAS, beberapa SKU → group header LUKAS + total; kode `PO-…` bisa diklik; tidak ada baris PI.

## §I. Tab Purchase Invoice — aturan data

1. Sumber: detail Supplier Invoice join header PI, product, supplier, dll.
2. **Semua** status PI ikut.
3. Currency as-is; Total Price = line invoice (qty × harga line).
4. Qty dari invoice quantity; Description dari line PI.
5. **Tidak** join ke PO; **tidak** ada kolom linkage PI→PO.
6. Hyperlink Trx. Code → edit Purchase Invoice (Supplier Invoice).

## §J. Isolasi dataset

- Satu request API = satu tab (PO **atau** PI).
- Campur PO+PI dalam satu grid = **tidak didukung** / out of scope.
- Filter, search, export state **terpisah** antar tab.

## §K. Export

| Mode | Perilaku |
|------|----------|
| **Export All** | Async batch; mengikuti filter aktif; terpisah per tab |
| **This Page Only** | Halaman grid yang sedang tampil |
| Progress / file list | Daftar file export PO dan PI **terpisah** — jangan export dari tab PO lalu cari file di list PI |

## §L. Filter & Search

- Global search + Advanced Filter (tanggal, kode, SKU, supplier, status, dll.).
- Default tanggal jika belum ada SearchBuilder tersimpan: **bulan berjalan**.
- Kolom yang di-hide mengikuti preferensi Columns show/hide.
- Data sepi → longgarkan filter **Trx. Date** dulu.

## §M. Validasi & perilaku sistem

| Kondisi | Perilaku |
|---------|----------|
| Tanpa privilege | Akses ditolak |
| Soft-deleted header/detail | Tidak tampil |
| Company lain | Tidak tampil |
| Tab PO | Hanya kode prefix PO |
| Tab PI | Hanya kode prefix PI |
| Total Price vs grand total dokumen | Other Cost/Disc sengaja tidak dihitung |

Tidak ada form create/edit — report only.

## §N. Yang Bisa / Tidak Bisa

**Bisa:**
- Lihat semua status PO/PI (termasuk draft)
- PO With PR dan Without PR di tab PO
- Hyperlink Trx. Code ke dokumen sumber
- Global search, Advanced Filter, Columns, Export per tab
- Group per supplier dengan total di header

**Tidak bisa:**
- Campur PO+PI dalam satu tabel
- Pakai report ini sebagai aging AP / settlement utang
- Edit transaksi dari report
- Kolom linkage PO→PI atau PI→PO di grid
- Mengharapkan Total Price = grand total dokumen (Other Cost/Disc excluded)

## §O. Keterbatasan & Gap (framing netral)

| Topik | Status |
|-------|--------|
| Card Jira: default **30 hari** · Sistem: **bulan kalender berjalan** | Open — docs ikuti sistem |
| Card: Total Tagihan **running** per row · Sistem: line amount + sum di header group | Open — docs ikuti sistem |
| Summary Total Tagihan kanan atas vs global search | Temuan QA — di luar scope user doc |

## §P. Menu Terkait

| Menu | Relasi |
|------|--------|
| **Purchase Order** | Sumber tab Purchase Order |
| **Purchase Invoice** (Supplier Invoice) | Sumber tab Purchase Invoice |
| **System Product** | Link dari kolom SKU |
| **Account Payable Report** | **Tidak terkait** — laporan utang terpisah |

```text
Purchase Report ──baca──► Purchase Order (tab PO)
Purchase Report ──baca──► Purchase Invoice (tab PI)
Purchase Report ──tidak──► Account Payable Report
```

## §Q. Alur operator (ringkas)

1. Buka Purchase Report — tab **Purchase Order** aktif, data load.
2. Cek/ubah filter tanggal (default bulan ini).
3. Baca grid per group supplier; total supplier di header kanan.
4. Klik Trx. Code untuk buka dokumen PO.
5. Butuh data PI → klik tab **Purchase Invoice** (dataset baru).
6. Filter, search, atau export dari tab yang sedang aktif.

## §R. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Tidak ketemu data PI | Masih di tab PO | Pindah tab **Purchase Invoice** |
| Grid sepi | Filter tanggal sempit | Longgarkan **Trx. Date** |
| Total Price ≠ total di form PO/PI | Other Cost/Disc tidak masuk report | Cek dokumen sumber |
| File export "hilang" | Export dari tab lain | Export & cek file list di tab yang sama |
| Cari PI di tab PO | Dataset terisolasi | Ganti tab |

## §S. FAQ

**Q: Kenapa PO dan PI tidak bisa sekaligus?**  
A: Sengaja — satu tab satu sumber supaya jelas dan tidak tercampur.

**Q: Default tanggal 30 hari?**  
A: Di sistem sekarang defaultnya **bulan kalender berjalan**. Ubah lewat Advanced Filter.

**Q: Draft PO/PI ikut tampil?**  
A: Ya — semua status ikut, selama masuk filter tanggal dan tidak soft-deleted.

**Q: PO With PR dan Without PR ikut?**  
A: Ya, keduanya di tab Purchase Order.

**Q: Ini laporan utang AP?**  
A: **Tidak** — Account Payable Report terpisah.

**Q: Kenapa Total Price beda dengan total dokumen?**  
A: Other Cost dan Other Discount dokumen sengaja **tidak** masuk perhitungan line report.

**Q: Bisa edit PO dari report?**  
A: Tidak — hanya baca; klik Trx. Code untuk **buka** dokumen di menu asal.

**Q: Export PO dan PI satu file?**  
A: Tidak — export dan daftar file terpisah per tab.
