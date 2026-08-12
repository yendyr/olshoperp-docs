---
doc_type: gemini-generation-brief
target_menu: "Profit & Loss"
menu_slug: accounting-profit-loss
source_of_truth: docs/qa-docs/accounting-profit-loss/ (repo olshoperp — dibaca 2026-08-12)
purpose: >
  Brief lengkap untuk di-paste ke Gemini agar generate SATU dokumen
  konsolidasi "Profit & Loss" bergaya Pentaho — bukan wireframe, bukan kode.
status: ready-to-send-to-gemini
source_doc_status: >
  KB review v1.0 (123 baris); requirement review v1.0 (308); technical review v1.0 (107);
  user-guide review v1.1 (115); feature-map review v1.0 (47); 5 capability cards (≈270).
  Total ≈1.006 baris → brief PROPORSIONAL. Sudah ada feature-map + Lingo cards (SF-PL-01..05).
  Sudah ada user-guide v1.1 (acuan tone). Banyak TO-BE (17 gap, 11 Pending Decision) — framing netral wajib.
---

# BRIEF UNTUK GEMINI — Generate Dokumentasi "Profit & Loss"

> **Cara pakai:** copy/upload file ini ke Gemini. **PART 1** = instruksi.
> **PART 2** = SELURUH fakta sumber. Gemini wajib pakai Part 2 saja — dilarang mengarang.

---

# PART 0 — Kenapa struktur ini seperti ini / beda dari menu lain

1. **Laporan read-only — bukan dokumen transaksi.** Tidak ada create/edit/approve/delete dokumen. Tidak ada siklus status. Tabel muncul setelah **Apply** filter periode. Jangan paksakan `stateDiagram-v2` — cukup jelaskan bahwa angka bergantung pada status **Journal** sumber (Approved).

2. **Multi-period comparison = fitur inti.** Hingga 12 kolom side-by-side (1 pilihan + 11 pembanding). Dua jalur perhitungan: *fixed-duration* (jendela hari inklusif mundur tanpa overlap) vs *whole-month* (kalender bulan penuh mundur per bulan). Pembaca **harus** paham keduanya karena angka bisa beda tergantung filter. Ini bukan fitur yang ada di banyak menu lain — butuh penjelasan mendalam + contoh angka.

3. **Revenue terlihat negatif — ini bukan bug.** Tampilan saat ini = debit dikurangi credit mentah. Akun pendapatan (credit-normal) jadi negatif. Berbeda dari Dev Profit & Loss yang sudah di-flip. Ini poin yang **paling sering membingungkan user** — butuh Warning jelas + FAQ + konsistensi di setiap penyebutan.

4. **Banyak TO-BE / fitur belum tersedia.** Sejumlah besar filter dan fitur gaya Mekari (Urutan, Tag, Include all/Either, Tampilkan akun, Template, Bandingkan dengan label terpisah, baris Laba Kotor/Bersih, warna % berdasarkan nature akun, mitigasi performa) belum ada di produksi — semua masih menunggu keputusan bisnis. Tandai **konsisten** di **setiap** tempat fitur TO-BE disebut, jangan hanya sekali di section keterbatasan.

5. **Dua versi P&L yang bersamaan.** Produksi = Profit & Loss (multi-period + export + 1 tabel). Legacy = Dev Profit & Loss (kartu ringkas + 2 tabel + All Time, tanpa compare/export). Pembaca harus tahu bedanya di awal supaya tidak membuka menu yang salah. Rujuk singkat — jangan duplikasi detail Dev P&L.

6. **Export async + akun Current Profit/Loss punya jalur data khusus.** Export berjalan di belakang layar (cek progress/log). Akun Current P/L diambil dari jalur history tersendiri yang **belum** memfilter status journal Approved — keterbatasan yang perlu disebutkan netral.

---

# PART 1 — Instruksi untuk Gemini

## 1.1 Peran kamu (Gemini)

Kamu technical writer bergaya dokumentasi pentaho.com untuk OlshopERP:
- Definisi dulu, lalu prosedur, lalu tabel referensi lengkap.
- Langkah bernomor yang actionable; label UI **tebal**.
- Callout **Note** / **Tip** / **Warning** di tempat yang tepat.
- Tanpa bahasa marketing.
- **Sumber kebenaran HANYA Part 2.** Dilarang mengarang fakta, angka, pesan error, atau perilaku di luar Part 2. Kalau Part 2 bertanda `[NEEDS SOURCE]`, jangan mengisi tebakan.

## 1.2 Bahasa & tone

- Bahasa Indonesia; istilah teknis Inggris boleh (Profit & Loss, Revenue, Expense, COGS, Other Revenue & Expenses, Compared Period, Apply, Export, Journal, Approved, Current Profit/Loss).
- Definisikan istilah di glossary sebelum dipakai.
- Kalimat pendek di bagian prosedur.
- **Nol toleransi** di body dokumen akhir: path file, nama class/controller/job, nama tabel/kolom database mentah, ID internal validasi/gap/AC (`GAP-PL-…`, `PL-01`, `AC…`). Reframe ke bahasa fungsional/awam.
- Menu **sudah punya feature-map** — boleh referensi Label UI dari Feature Map secara natural ("lihat _Period filter & Apply_"), tapi **jangan** tampilkan ID `SF-…` mentah di body teks.
- Tone boleh mengikuti gaya user-guide Finance yang sudah ada di Part 2.

## 1.3 Struktur dokumen WAJIB (urut tetap)

1. Judul & Ringkasan Singkat (read-only report; bukan Dev P&L)
2. Istilah Kunci (Compared Period, leaf, in-period, whole-month, Current Profit/Loss, dll.)
3. Kapan & Kenapa Dipakai
4. Prasyarat
5. Posisi dalam Alur Bisnis (`flowchart LR` — Journal Approved → COA → P&L tabel → compare → export)
6. Lokasi Menu (+ placeholder gambar)
7. **Bukan `stateDiagram-v2`** — jelaskan: menu tidak punya status dokumen; angka mengikuti status Journal
8. Profit & Loss vs Dev Profit & Loss (tabel pembanding singkat)
9. Filter Periode & Apply (langkah + preset + default bulan berjalan)
10. Compared Period / Multi-Period (cara kerja + dua jalur: fixed-duration vs whole-month + contoh angka)
11. Cara Baca Tabel (group class, indent parent/child, footer leaf-only, tooltip FX)
12. **Warning: Revenue terlihat negatif** — penjelasan debit minus credit mentah + beda dari Dev P&L
13. Difference / Persentase (rumus konseptual, warna hijau/merah, 0% hidden, edge case prev=0)
14. Export All (async, progress/log, pesan kosong)
15. Search Builder (COA / Class filter — ringkas)
16. **Fitur yang Belum Tersedia 🔜** (TO-BE: Filter Lainnya, Tag, Template, Urutan, Include all/Either, Tampilkan akun, baris Laba Kotor/Bersih, warna % by nature, mitigasi performa) — tabel terpusat + tandai ulang di section terkait
17. Aturan Bisnis & Validasi — format "Kalau kamu…, maka…"
18. Keterbatasan / Inkonsistensi yang Diketahui (framing netral; pisahkan menunggu keputusan bisnis vs teknis open)
19. Hubungan dengan Menu Lain (`flowchart TB`)
20. Troubleshooting
21. FAQ
22. Lihat Juga / Referensi

## 1.4 Standar Diagram Mermaid

- Fence: ` ```mermaid ` di baris sendiri tanpa indent; tutup ` ``` `. Baris pertama = tipe diagram. Hindari `classDiagram`, `gantt`, `pie`.
- Label node: `\n` untuk baris baru (bukan `<br/>`). Jangan unicode arrow di label. Label berkoma/spasi → kutip.
- Edge label berkoma/spasi → kutip. Dotted aman.
- Subgraph: judul berkutip jika ada spasi/`/`/`-`.
- `classDef`: **hex only**.
- Pola tiap diagram: (1) judul + 1–2 kalimat konteks, (2) Mermaid happy-path ≤5–10 node, (3) **"Keterangan langkah:"**, (4) **fallback teks** numbered list.

**Diagram wajib:**
- Section 5: `flowchart LR` — Journal Approved → Journal Detail IDR → COA class P&L → P&L v2 tabel → multi-period + % → Export Excel.
- Section 19: `flowchart TB` — hubungan ringkas ke Journal, COA, Dev P&L, Balance Sheet/Trial Balance/GL, Product P&L, SO P&L, Fiscal Period.

**Jangan** buat `stateDiagram-v2` — menu ini bukan dokumen bertransisi status.

## 1.5 Placeholder Gambar

Format persis:

```text
> 🖼️ **[PLACEHOLDER GAMBAR]** — <deskripsi singkat apa yang harus di-screenshot>
```

Titik wajib (5):
1. Lokasi menu Profit & Loss di sidebar / halaman report.
2. Filter periode (tanggal awal/akhir + preset + Compared Period) sebelum Apply.
3. Tabel setelah Apply — kolom amount multi-period + kolom % + group class akun (Revenue/COGS/Expense/Other).
4. Tooltip hover pada amount (basis journal + FX).
5. Tombol Export All + progress/log export.

## 1.6 Checklist sebelum mengakhiri output

- [ ] Hanya fakta dari Part 2; tidak ada path/class/kolom-DB/ID internal.
- [ ] Glossary mencakup semua istilah (Compared Period, leaf, in-period, whole-month, Current P/L, preset, Apply, Refresh).
- [ ] **Tidak ada** `stateDiagram-v2` — sudah dijelaskan "read-only, ikut status Journal".
- [ ] Beda P&L vs Dev P&L ada tabel pembanding di awal.
- [ ] Multi-period: fixed-duration vs whole-month calendar **keduanya** dijelaskan + contoh angka.
- [ ] Warning Revenue negatif konsisten (section sendiri + FAQ + tips).
- [ ] TO-BE 🔜 ditandai **konsisten di setiap tempat** disebut + tabel terpusat di section 16.
- [ ] Persentase: rumus, warna, 0% hidden, edge case prev=0 (±100%).
- [ ] Export async dijelaskan (progress/log + pesan kosong).
- [ ] Current P/L history tanpa filter Approved disebutkan netral.
- [ ] Keterbatasan: framing "kondisi saat ini"; pending decision ≠ janji perbaikan.
- [ ] Setiap Mermaid punya keterangan langkah + fallback teks.
- [ ] 5 placeholder gambar sesuai §1.5.

### Framing sensitif (wajib)

- **Revenue negatif:** perilaku laporan saat ini (debit − credit mentah). Bukan bug. Dev P&L sudah di-flip. Keputusan apakah produksi ikut flip → masih keputusan bisnis. Jangan tulis seolah akan "diperbaiki" — tulis sebagai "cara kerja sekarang, beda dari menu Dev".
- **TO-BE / fitur belum tersedia:** tandai konsisten 🔜 di **setiap** tempat (section filter, tips, FAQ, keterbatasan). Jangan seolah roadmap / promise.
- **Menunggu keputusan bisnis:** banyak item pending decision (11 dari 17 gap). Framing netral: "baseline saat ini, menunggu keputusan lebih lanjut". Jangan kelompokkan sebagai "bug" — ini keputusan produk.
- **Current P/L tanpa filter Approved:** framing netral — jalur data khusus yang masih dalam tinjauan Finance/Dev.
- **FE vs BE duration mismatch:** kondisi teknis yang bisa membuat header kolom berbeda sedikit — sebutkan apa adanya di keterbatasan, bukan sebagai janji fix.
- **Performa (rentang besar + banyak compare):** sebutkan "mulai dari 1–2 periode, perbesar bertahap" sebagai tip — bukan menakut-nakuti.

---

# PART 2 — SUMBER FAKTA LENGKAP (jangan menambah di luar ini)

> Dikompilasi dari `docs/qa-docs/accounting-profit-loss/` (repo `olshoperp`, KB/requirement/technical/user-guide/feature-map **v1.0–1.1 status review**, 5 capability cards, per **2026-08-12**). Nama menu: **Profit & Loss**. Modul: Finance & Accounting / Report. Route UI: `/accounting/profit-loss`. Staging: `https://staging.olshoperp.com/accounting/profit-loss`.

## §A. Ringkasan & Posisi Bisnis

- **Profit & Loss** = Income Statement perusahaan: saldo **in-period** dari 4 class akun (Revenue, Other Revenue & Expenses, Cost Of Goods Sold, Expense) dari **journal yang sudah Approved**, dalam mata uang utama (IDR).
- Menu **read-only** — tidak ada create/edit/approve/delete transaksi.
- Alur: pilih periode → **Apply** → lihat tabel → opsional bandingkan sampai 11 periode sebelumnya → export Excel.
- **Bukan** menu ini: Dev Profit & Loss (versi lama), Product Profit Loss (per SKU), Sales Order Profit Loss (per SO).
- Versi API: `v2` (multi-period + persentase).

## §B. Kapan & Kenapa Dipakai

- Melihat performa laba rugi per periode.
- Membandingkan beberapa periode side-by-side tanpa buka laporan berkali-kali.
- Export arsip bulanan / audit / management.
- Audience: Finance / Controller.

## §C. Prasyarat

| Prasyarat | Sumber | Catatan |
|-----------|--------|---------|
| COA aktif class Revenue / Other Revenue & Expenses / COGS / Expense | Chart of Account | Hanya 4 class ini di P&L produksi |
| Hierarki parent–child COA benar | COA Tree | Parent = agregasi; indent + bold |
| Mapping Current Profit/Loss | Company accounting | Path history khusus |
| Journal Approved di rentang tanggal | Journal (+ dokumen sumber) | Draft/Open/Rejected tidak ikut jalur normal |
| Privilege melihat menu Profit & Loss | Gate | Export juga butuh privilege |
| Primary currency (IDR) | Company | Amount tampil IDR dari nilai journal |

## §D. Istilah Kunci

| Istilah | Arti |
|---------|------|
| **Compared Period** | Berapa periode ke belakang yang ditampilkan berdampingan (0–11; total max 12 kolom) |
| **Leaf akun** | Akun paling bawah (bukan induk) — dipakai hitung total class |
| **In-period** | Hanya transaksi dalam rentang tanggal filter |
| **Whole-month** | Kalau filter pas 1 bulan kalender penuh, bandingkan per bulan (bukan jumlah hari sama) |
| **Current Profit/Loss** | Akun khusus laba rugi berjalan — punya jalur data tersendiri |
| **Apply** | Tombol yang memuat / menyegarkan tabel sesuai filter — tanpa Apply, tabel belum terisi |
| **Refresh** | Menggambar ulang tabel tanpa mengubah filter |
| **Preset** | Shortcut tanggal: 1 / 2 / 3 weeks / 1 month dari awal bulan berjalan |
| **Export All** | Unduh laporan ke Excel secara async |

## §E. Status Dokumen

Menu ini **tidak punya status dokumen**. Angka mengikuti status **Journal**:

| Status Journal | Akun biasa (leaf/parent) | Akun Current Profit/Loss (history) |
|----------------|--------------------------|-------------------------------------|
| **Approved** | Ya — masuk perhitungan | Ikut jika ada di history |
| Draft / Open / Rejected | Tidak masuk | Query history **belum** memfilter Approved (kondisi saat ini — lihat §R) |

## §F. Profit & Loss vs Dev Profit & Loss

| | Profit & Loss (produksi) | Dev Profit & Loss (legacy) |
|--|--------------------------|---------------------------|
| Route | `/accounting/profit-loss` | `/accounting/profit-loss-v1` |
| Tampilan | 1 tabel multi-period | Kartu ringkas + 2 tabel |
| Compare | Sampai 11 periode pembanding | Tidak ada |
| Export | Ya (async Excel) | Tidak |
| All Time | Tidak | Ya |
| Sign revenue | Debit − credit mentah (negatif) | Di-flip (positif) |

## §G. Filter Periode & Apply

1. Buka menu → default periode = **bulan berjalan**.
2. Opsional: preset **1 / 2 / 3 weeks / 1 month** (dari start bulan berjalan).
3. Opsional: set **Compared Period** (0–11).
4. Klik **Apply** — tanpa Apply, tabel belum terisi.
5. **Refresh** hanya menggambar ulang tanpa mengubah filter.

Preset AS-IS = week/month dari start bulan berjalan — dropdown "Bulan Lalu / Kuartal" belum tersedia 🔜.

## §H. Multi-Period / Compared Period

**Compared Period** = berapa banyak periode **pembanding**. None (0) = 1 kolom. Maksimal 11 → total 12 kolom amount.

### H.1 Fixed-duration (non-whole-month)

1. Kolom 1 = selected `from`–`to`.
2. Durasi = jumlah hari inklusif (end − start + 1).
3. Kolom tambahan mundur **durasi** hari; **tanpa overlap, tanpa gap**.
4. Max 12 kolom.

**Contoh (45 hari):** 1 Apr 2026 – 15 Mei 2026 → kolom 2 = 15 Feb – 31 Mar 2026 → kolom 3 = 1 Jan – 14 Feb 2026 → …

### H.2 Whole-month (satu bulan kalender penuh)

Jika `from` = hari pertama bulan **dan** `to` = hari terakhir bulan **yang sama** → mundur pakai **kalender bulan** (per bulan, bukan jendela hari tetap). Panjang bulan bisa beda (28/30/31).

**Catatan kondisi saat ini:** ada sedikit perbedaan perhitungan hari antara tampilan dan kalkulasi backend untuk jendela non-month — bisa membuat header kolom sedikit berbeda (lihat §R keterbatasan).

Kolom dibaca **kiri ke kanan** = terbaru ke lebih lama.

## §I. Cara Baca Tabel

- Group urut: **Revenue → Other Revenue & Expenses → Cost Of Goods Sold → Expense**.
- Induk akun **tebal** + indent; akun paling bawah (leaf) di bawahnya.
- Total class di footer = jumlah **akun paling bawah saja** (hindari double-count induk).
- Hover amount → tooltip: basis journal Approved + konversi FX saat transaksi.
- Kolom dinamis: `periods + 1` kolom amount (max 12) + kolom % di antara amount.

## §J. Revenue Terlihat Negatif — Warning

Laporan saat ini menampilkan **debit dikurangi credit mentah**. Akun pendapatan yang normalnya credit sering **negatif** di menu ini. Ini **bukan bug** — perilaku berbeda dari Dev Profit & Loss yang sudah di-flip.

Keputusan apakah produksi akan ikut flip → masih menunggu keputusan bisnis. Jangan tulis seolah akan "diperbaiki".

## §K. Difference / Persentase

Kolom % membandingkan periode lebih baru vs kolom di sebelah kanannya (lebih lama).

- Rumus konsep: (amount baru − amount lama) / |amount lama| × 100%.
- Naik = **hijau** (% positif); turun = **merah** (% negatif).
- 0% = **tidak ditampilkan**.
- Kolom paling kanan (paling lama) **tidak** punya %.
- Compared = None → tidak ada kolom %.
- Edge case: kolom lama = 0, kolom baru ≠ 0 → sistem bisa menampilkan ±100%.
- Warna saat ini mengikuti **tanda angka % saja** — belum mempertimbangkan "baik/buruk" menurut jenis akun (mis. beban turun = baik) 🔜.

Contoh:

| Kolom baru | Kolom lama | % | Warna |
|------------|------------|---|-------|
| 8 jt | 6 jt | ≈ +33,3% | Hijau |
| 5 jt | 6 jt | ≈ −16,7% | Merah |
| 6 jt | 6 jt | (kosong) | — |

## §L. Export All

1. Set filter + Apply; pastikan tabel terisi.
2. Klik **Export All**.
3. Proses berjalan di belakang layar (async) — pantau progress/log sampai file siap.
4. Unduh file Excel.

- Jika tidak ada data: pesan "There is no data to export".
- Butuh privilege melihat menu.
- Export mengikuti filter period & compared yang aktif.
- Compared besar + rentang panjang → export lebih lama.

## §M. Search Builder

Filter COA / Class dari 4 class P&L. Standar kontrol filter tabel.

## §N. Toolbar & Kontrol

| Kontrol | Perilaku |
|---------|----------|
| Period | Default = bulan berjalan |
| Preset | 1 / 2 / 3 weeks / 1 month dari start bulan berjalan |
| Compared Period | None (0) sampai 11 |
| Apply / Refresh | Apply = rebuild + reload; Refresh = redraw |
| Search Builder | Filter COA / Class |
| Export All | Async — log + progress |

Tidak ada edit/approve/delete. Hanya Apply/Refresh, Export, Search Builder.

## §O. Aturan Bisnis & Validasi

| Kondisi | Perilaku |
|---------|----------|
| Tanggal awal / akhir / period kosong atau format salah | Ditolak (tanggal wajib) |
| Belum Apply | Tabel belum load |
| Export tanpa data | Pesan "There is no data to export" |
| Compared Period di tampilan | Opsi 0–11 |
| Rentang sangat panjang | Tidak diblokir (risiko lambat — lihat §R) |

## §P. Contoh Kasus

| # | Situasi | Hasil |
|---|---------|-------|
| 1 | 1 Apr–15 Mei (45 hari), 11 tambahan | 12 kolom × 45 hari, tanpa overlap/gap |
| 2 | 1 bulan penuh, 3 tambahan | 4 kolom per bulan kalender (panjang bulan bisa beda) |
| 3 | Journal USD rate 16.000 | IDR = nilai × rate tersimpan di journal |
| 4 | Kolom baru 8 jt, lama 6 jt | ≈ +33,3% hijau |
| 5 | Kolom baru 5 jt, lama 6 jt | ≈ −16,7% merah |
| 6 | Kolom baru = lama | % tidak tampil |
| 7 | Kolom terakhir | Tanpa % |
| 8 | Journal Draft/Open | Tidak dihitung (akun biasa) |
| 9 | Compared None | 1 kolom, tanpa % |
| 10 | Hover amount | Tooltip periode + basis kalkulasi + FX |

## §Q. Fitur yang Belum Tersedia 🔜 (TO-BE)

Semua belum ada di produksi — **menunggu keputusan bisnis**, bukan roadmap.

| Fitur | Ringkasan |
|-------|-----------|
| Dropdown periode (Bulan Lalu/Ini/Kuartal) | Preset saat ini = 1/2/3 week + 1 month |
| Bandingkan dengan / Bandingkan periode (label terpisah) | Saat ini = satu kontrol Compared Period |
| Urutan Naik/Turun | Belum ada |
| Tag store / input & treatment non-SI/OB | Belum ada — butuh P&L per toko pakai menu Product/SO P&L (jika ada tag) |
| Include all vs Either | Belum ada |
| Tampilkan akun unchecked = summary only | Belum ada |
| Warna % berdasarkan nature akun | Saat ini hijau/merah hanya ikut tanda angka |
| Basis "Terakhir diperbarui" | Belum ada |
| Fungsi Template | Belum ada |
| Baris Laba Kotor / Laba Bersih | Saat ini hanya total per class akun |
| Mitigasi performa (max range / job / lazy) | Belum ada cap; rentang besar bisa lambat |

## §R. Keterbatasan yang Diketahui (framing netral)

Tulis sebagai kondisi sistem saat ini. **Jangan** janjikan perbaikan atau tanggal rilis.

### R.1 Menunggu keputusan bisnis (11 item)

| Ringkasan (tanpa kode ID) | Arti untuk pembaca |
|---------------------------|--------------------|
| Daftar/logik dropdown Periode (Bulan Lalu/Ini/Kuartal vs preset week/month) | Preset saat ini = shortcut minggu/bulan; dropdown bulan/kuartal belum tersedia |
| Requirement fixed-duration vs perilaku whole-month yang mundur per bulan kalender | Bisa menghasilkan kolom jendela beda panjang — keputusan mana yang "benar" masih terbuka |
| Current P/L history tanpa filter journal Approved | Akun khusus ini bisa menyertakan angka dari journal non-Approved — masih dalam tinjauan |
| Sign raw → Revenue negatif vs tampilan "normal" pendapatan positif | Cara kerja saat ini; keputusan flip masih terbuka |
| Tidak ada baris terpisah Laba Kotor / Laba Bersih | Hanya total per class; baris computed belum ada |
| Bandingkan dengan vs Bandingkan periode (label terpisah) | Saat ini = satu kontrol |
| Urutan Naik/Turun | Belum |
| Include all vs Either | Belum |
| Tampilkan akun unchecked = summary only | Belum |
| Warna % berdasarkan nature akun | Belum — warna ikut tanda angka saja |
| Mitigasi performa (max range) | Belum ada cap |

### R.2 Keterbatasan teknis (open)

| Ringkasan | Arti untuk pembaca |
|-----------|--------------------|
| Perbedaan perhitungan hari antara tampilan (inklusif +1) dan kalkulasi backend (tanpa +1) untuk jendela non-month | Bisa membuat header kolom sedikit beda — catat tanggal jika menemukan |
| Endpoint tabel utama tanpa validasi privilege eksplisit | Data tetap scoped ke company login — catatan untuk pengembang |
| Basis "Terakhir diperbarui" belum ada | Tidak bisa tahu kapan terakhir journal di-approve di range ini |
| Fungsi Template | Belum ada |
| Tag store / treatment non-SI/OB | Belum — pakai Product/SO P&L jika perlu dimensi produk/toko |

## §S. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Tabel kosong / tidak muncul | Belum Apply; period kosong | Isi tanggal → **Apply** |
| Angka 0 padahal ada transaksi | Journal belum Approved; tanggal di luar range; class bukan 4 class P&L | Cek status journal & tanggal; pastikan akun Revenue/Expense/COGS/Other |
| Revenue terlihat negatif | Laporan pakai debit − credit mentah | Perilaku saat ini; beda dari Dev P&L |
| Export gagal | Tidak ada data / privilege / queue | Baca pesan; cek akses menu; coba lagi |
| Kolom periode "aneh" (bukan full month) | Kemungkinan beda hitung hari tampilan vs kalkulasi | Catat tanggal header vs angka; laporkan |
| Butuh P&L per toko / SKU | Bukan scope menu ini | Pakai Product / Sales Order Profit Loss |
| Laporan lambat | Compared besar + rentang panjang | Kurangi Compared Period; perkecil rentang |

## §T. FAQ

**Q: Beda dengan Dev Profit & Loss?**
A: Produksi = multi-period + export + 1 tabel. Dev = kartu + 2 tabel + All Time, tanpa compare/export.

**Q: Kenapa Revenue negatif?**
A: Laporan menampilkan debit dikurangi credit mentah. Akun pendapatan (credit-normal) jadi negatif. Dev P&L sudah di-flip. Keputusan apakah produksi ikut flip masih terbuka.

**Q: Hanya journal Approved?**
A: Akun biasa: ya. Akun Current Profit/Loss: jalur history yang belum memfilter Approved (masih dalam tinjauan).

**Q: Kurs USD dihitung ulang?**
A: Tidak — pakai kurs yang tersimpan saat journal dibuat.

**Q: Max berapa kolom?**
A: 12 (1 periode dipilih + 11 pembanding).

**Q: Filter store/tag?**
A: Belum tersedia 🔜. Pakai menu Product / Sales Order Profit Loss jika ada.

**Q: Kenapa Laba Kotor / Laba Bersih tidak ada?**
A: Belum tersedia 🔜. Saat ini hanya total per class akun.

**Q: Fiscal Period memfilter laporan?**
A: Tidak langsung — Fiscal Period mengatur boleh/tidaknya posting tanggal; laporan tetap filter dari tanggal yang kamu Apply.

**Q: 1 bulan penuh beda hasilnya dari 30 hari biasa?**
A: Ya — bulan kalender penuh mundur per bulan (panjang bisa beda: 28/30/31); jendela bebas mundur per jumlah hari tetap.

## §U. Menu Terkait

| Menu | Relasi |
|------|--------|
| Journal | Sumber angka (harus Approved) |
| Chart of Account | Baris & class akun |
| Dev - Profit & Loss | Legacy (tanpa multi-period / export) |
| Balance Sheet / Trial Balance / General Ledger | Sibling report |
| Product Profit Loss | Dimensi per SKU |
| Sales Order Profit Loss | Dimensi per SO |
| Fiscal Period | Tidak filter report; mengatur posting tanggal journal |
