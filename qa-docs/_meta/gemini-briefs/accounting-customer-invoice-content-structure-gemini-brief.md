---
doc_type: gemini-generation-brief
target_menu: "Sales Invoice"
menu_slug: accounting-customer-invoice
source_of_truth: docs/qa-docs/accounting-customer-invoice/ (repo olshoperp — dibaca 2026-08-24)
purpose: >
  Brief lengkap untuk di-paste ke Gemini agar generate SATU dokumen
  konsolidasi "Sales Invoice" bergaya Pentaho — bukan wireframe, bukan kode.
status: ready-to-send-to-gemini
source_doc_status: >
  KB review v2.0 · requirement review v2.0 · technical review v2.0 ·
  user-guide review v1.0 · ~926 baris total · proporsional section standar.
  Belum ada feature-map / capability cards.
  1 fitur TO-BE (create default Open vs AS-IS draft); 5 Gap.
---

# BRIEF UNTUK GEMINI — Generate Dokumentasi "Sales Invoice"

> **Cara pakai:** copy/upload file ini ke Gemini. **PART 1** = instruksi.
> **PART 2** = SELURUH fakta sumber. Gemini wajib pakai Part 2 saja — dilarang mengarang.

---

# PART 0 — Kenapa struktur ini seperti ini / beda dari menu lain

1. **Transaksi penuh dengan siklus status.** Draft → Open → Approved / Rejected. Setelah Approved, dokumen terkunci dan jurnal piutang terbit. Butuh `stateDiagram-v2`.
2. **Dua jalur: Manual General vs Platform.** Invoice manual dibuat dari Sales Order General. Invoice platform muncul otomatis dari Instant Settlement — dengan batasan: tidak bisa reject/delete. Harus ada tabel pembanding.
3. **Partial invoice per SKU/line, bukan partial qty.** Saat mengambil barang dari SO, sistem mengambil **seluruh sisa** baris SKU itu. Tidak bisa "5 dari 10". Bisa tagih SKU-A dulu, SKU-B di invoice berikutnya. Konsep penting yang sering membingungkan.
4. **Import saldo awal** dengan aturan ketat: hanya SO General, hasil status Open (bukan langsung Approved), all-or-nothing per file, dan platform ditolak.
5. **1 fitur TO-BE:** saat ini create menghasilkan Draft (harus set Open manual sebelum Approve). Target ke depan: create langsung Open. Penanda "TO-BE" konsisten di setiap sebutan.
6. **Pasangan menu downstream:** Account Receive (pelunasan), Credit Note / Sales Return (koreksi/retur). Journal sebagai konsumen otomatis.

---

# PART 1 — Instruksi untuk Gemini

## 1.1 Peran

Kamu = technical writer bergaya pentaho.com: definisi → prosedur → tabel referensi; langkah bernomor; callout **Note / Tip / Warning**; tanpa marketing. **Sumber satu-satunya = PART 2** — dilarang mengarang fakta di luar itu.

## 1.2 Bahasa & tone

- Bahasa Indonesia + istilah EN seperlunya (Sales Invoice, Sales Order, Approve, Reject, Outstanding, Prepared/Processed, Net Sales, Account Receive).
- Definisikan istilah sebelum dipakai.
- **NOL** path file / class controller / nama kolom DB / ID internal.
- Menu ini **belum** punya feature-map — **larang** menyebut kode SF-* di dokumen.

## 1.3 Struktur dokumen WAJIB

Buat **satu dokumen** dengan section berikut (nomor urut tetap; hapus section yang tidak relevan **hanya jika** Part 2 benar-benar tidak punya datanya):

1. **Judul & Ringkasan Singkat** — 2–3 kalimat: faktur penjualan / tagihan pelanggan, mencatat piutang.
2. **Istilah Kunci** — tabel istilah → definisi awam.
3. **Kapan & Kenapa Dipakai** — situasi nyata: tagih SO General, saldo awal, platform.
4. **Prasyarat** — apa yang harus sudah ada sebelum create / approve.
5. **Posisi dalam Alur Bisnis** — `flowchart LR` (SO → SI → Account Receive / Credit Note). Ikuti aturan Mermaid §1.4.
6. **Lokasi Menu** — path navigasi + placeholder screenshot.
7. **Siklus Status** — `stateDiagram-v2` (Draft → Open → Approved / Rejected → Draft). Tabel status + arti + bisa edit?
8. **Manual General vs Platform (Instant Settlement)** — tabel pembanding: sumber, cara buat, bisa reject/delete?, import?.
9. **Langkah-Langkah Penggunaan — Manual General** — langkah bernomor: create, header, Use outstanding SO, Other Cost/Discount, Open, Approve.
10. **Partial Invoice — Cara Kerja** — penjelasan: per SKU/line (full remaining), bukan partial qty. Contoh SO 2 SKU → 2 SI.
11. **Import Saldo Awal (Excel)** — template 3 kolom, aturan XOR key, hanya SO General, status Open, all-or-nothing, lanjut Approve manual.
12. **Journal on Approve** — tabel debit/kredit: AR, Sales, VAT, Other Cost, Other Discount. Jurnal auto-approved.
13. **Referensi Field — Header** — tabel field, required, default/behavior.
14. **Referensi Field — Detail (Item)** — outstanding SO, Use, qty disabled, Invoice Progress.
15. **Referensi Field — Additional Cost / Discount** — Other Cost, Other Discount, efek ke Net Sales.
16. **Referensi Field — Totals** — Total Products, Disc Products, VAT, Other Cost/Discount, Net Sales.
17. **Aturan Bisnis & Validasi** — setiap baris dari Part 2 §I → kalimat "Kalau kamu …, maka …".
18. **Keterbatasan & Hal dalam Tinjauan** — gap dan TO-BE, framing netral.
19. **Hubungan dengan Menu Lain** — `flowchart TB`: SO General, Instant Settlement, Account Receive, Credit Note, Journal, Fiscal Period, dsb.
20. **Troubleshooting** — tabel gejala → penyebab → solusi.
21. **FAQ** — dari Part 2.
22. **Lihat Juga / Referensi** — link ke menu terkait.

## 1.4 Mermaid

- Fence: ` ```mermaid ` baris sendiri, tanpa indent; baris pertama = tipe diagram.
- Tipe boleh: `flowchart TD/LR/TB`, `stateDiagram-v2`, `sequenceDiagram`, `erDiagram`. Hindari `classDiagram` / `gantt` / `pie`.
- Label: `\n` bukan `<br/>`; jangan unicode arrow di label; label berkoma/spasi → kutip `A["teks, koma"]`.
- Edge label berkoma/spasi → kutip: `A -->|"label, text"| B`.
- Subgraph: judul berkutip jika ada spasi/`/`/`-`.
- `classDef`: **hex only** (`#4a90d9`).
- Pola tiap diagram: (1) judul + 1–2 kalimat, (2) Mermaid ≤ 5–10 node, (3) **"Keterangan langkah:"** numbered list, (4) **fallback teks** numbered list.

**Diagram WAJIB:**

| Section | Diagram |
|---------|---------|
| §5 Alur Bisnis | `flowchart LR` — SO → SI → AR / CN |
| §7 Siklus Status | `stateDiagram-v2` — Draft → Open → Approved / Rejected |
| §19 Menu Lain | `flowchart TB` — relasi SI dengan SO, IS, AR, CN, Journal, dsb. |

## 1.5 Placeholder gambar

Format: `> 🖼️ **[PLACEHOLDER GAMBAR]** — <deskripsi screenshot>`

Taruh di minimal **5 titik**:

1. Lokasi menu Sales Invoice di sidebar.
2. Datalist Sales Invoice (kolom, toolbar, status badge).
3. Form header (customer, tanggal, kurs, status radio).
4. Panel Outstanding Sales Order (Use per SKU / per SO).
5. Tampilan setelah Approve (dokumen terkunci).

Opsional: form import Excel, print preview.

## 1.6 Checklist penutup Gemini

Sebelum selesai, Gemini **wajib** verifikasi mandiri:

- [ ] Semua 22 section di atas tercakup (atau eksplisit dihapus karena tidak ada data).
- [ ] Istilah Kunci mendahului penggunaan pertama istilah itu.
- [ ] State diagram `stateDiagram-v2` ada dan akurat (Draft → Open → Approved/Rejected).
- [ ] Mermaid sesuai aturan §1.4 (hex color, label kutip, fallback teks).
- [ ] TO-BE (create → Open) ditandai konsisten di setiap sebutan + masuk keterbatasan.
- [ ] Gap/pending di-frame netral ("saat ini …") — bukan janji perbaikan.
- [ ] Tabel pembanding Manual General vs Platform ada di §8.
- [ ] Partial invoice per SKU/line (bukan partial qty) dijelaskan + contoh.
- [ ] Import: hanya SO General, status Open, all-or-nothing, journal setelah Approve — semua tertulis.
- [ ] Tidak ada path file / class / nama kolom DB / ID SF-*.
- [ ] Placeholder gambar di 5+ titik.
- [ ] FAQ mencakup: Draft vs Open, partial qty, platform import, kapan jurnal, customer manual.

---

# PART 2 — SUMBER FAKTA LENGKAP (jangan menambah di luar ini)

> Dikompilasi dari `docs/qa-docs/accounting-customer-invoice/` — semua layer review v2.0, user-guide review v1.0. Per 2026-08-24.
> Nama: **Sales Invoice**. Modul: Accounting / Account Receivable. Route UI: `/accounting/customer-invoice`. Kode: prefix **SI**.

---

## §A. Ringkasan & Posisi Bisnis

**Sales Invoice (SI)** adalah dokumen tagihan ke pelanggan. Dari sini sistem mencatat **piutang** (Account Receivable) dan **penjualan** — plus PPN, biaya lain, dan diskon lain jika ada.

Dua jalur pembuatan:
- **Manual (General):** buat SI dari Sales Order General yang sudah disetujui, pilih barang dari outstanding, lalu Approve.
- **Platform (Instant Settlement):** SI muncul otomatis dari proses settlement marketplace — biasanya hanya bisa dilihat, tidak bisa reject/hapus.

Setelah SI **Approved**: qty SO yang sudah di-invoice naik, jurnal piutang + penjualan terbit otomatis, dan SI muncul sebagai outstanding di **Account Receive** untuk pelunasan.

### Rantai proses

```text
Sales Order General ──► Sales Invoice ──┬──► Journal AR + Sales (otomatis)
                                        ├──► Account Receive (pelunasan)
Order Platform ──► Instant Settlement ──┘    └──► Credit Note / Sales Return (koreksi)
```

---

## §B. Kapan & Kenapa Dipakai

| Situasi | Pakai Sales Invoice jika |
|---------|-------------------------|
| Tagih SO General | Ada SO General approved dengan sisa belum ditagih |
| Saldo awal | Import Excel — hanya SO General/internal |
| Platform | SI biasanya muncul otomatis dari Instant Settlement — **jangan** create manual untuk order platform |
| Piutang & penjualan perlu tercatat | Approve SI → jurnal terbit |

| Jangan jika |
|-------------|
| Mau tagih order marketplace lewat Create manual |
| Akun piutang / penjualan / pajak belum dikonfigurasi — Approve akan gagal |
| Periode fiskal tanggal SI sudah tutup |
| SO sudah full di-invoice |

---

## §C. Prasyarat

| Prasyarat | Penjelasan |
|-----------|------------|
| Privilege SI (view/create/update/delete/approval) | Harus diberikan ke role user |
| Fiscal period **active** untuk Transaction Date | Blokir simpan / approve jika tutup |
| Primary currency ter-set | Kurs = 1 jika mata uang = primary company |
| Customer General: diakui sebagai customer, punya akun piutang (AR), punya SO General Approved/Processed outstanding | Untuk create manual |
| Store punya akun piutang (AR) | Untuk SI platform dari Instant Settlement |
| Produk punya akun Sales + pengaturan PPN penjualan | Wajib agar journal approve sukses |
| Other Cost / Other Discount **active** di master | Opsional di header |
| Import: SO General saja, Approved/Processed, belum di-invoice | Platform ditolak |

---

## §D. Istilah Kunci

| Istilah | Arti |
|---------|------|
| **Sales Invoice (SI)** | Dokumen tagihan ke pelanggan — mencatat piutang dan penjualan |
| **Sales Order General** | Order internal (bukan marketplace); sumber outstanding untuk SI manual |
| **Instant Settlement** | Proses upload settlement marketplace yang otomatis menghasilkan SI platform |
| **Outstanding** | Sisa qty SO yang belum ditagih / belum dibuatkan invoice |
| **Prepared to invoice** | Qty sudah masuk SI tapi SI belum approved (draft/open) |
| **Processed to invoice** | Qty sudah di SI yang approved |
| **Net Sales** | Total tagihan setelah VAT + other cost − other discount |
| **Account Receive** | Menu pelunasan / terima bayar dari customer atas SI yang sudah approved |
| **Credit Note** | Koreksi / pengurangan piutang setelah SI (retur, diskon, dll.) |
| **AR COA** | Akun piutang usaha (Account Receivable Chart of Account) |
| **Other Cost** | Biaya tambahan di header SI (opsional) — di luar dasar PPN produk |
| **Other Discount** | Diskon tambahan di header SI (opsional) — di luar dasar PPN produk |

---

## §E. Siklus Status

| Status | Arti | Bisa edit? | Aksi tersedia |
|--------|------|-----------|---------------|
| **Draft** | Header tersimpan; belum siap approve | Ya | Edit, Delete, Print |
| **Open** | Siap Approve / Reject | Ya | Edit, Delete, Print, Approve, Reject |
| **Approved** | Terkunci; jurnal sudah terbit; piutang berjalan | Tidak (hanya lihat) | Show, Print |
| **Rejected** | Ditolak; setelah Save edit biasanya kembali **Draft** | Ya | Edit, Delete, Print |

Transisi:
```text
[Create] → Draft → (set Open + Save) → Open → Approve → Approved (selesai)
                                           └─→ Reject → Rejected → (Save edit) → Draft
Draft / Open → Delete (hapus)
```

**Platform SI:** Reject dan Delete diblokir — sistem menampilkan pesan "tidak bisa karena dari platform".

**TO-BE (belum aktif):** Rencana ke depan, Create langsung menghasilkan status **Open** (bukan Draft). Saat ini (AS-IS): Create menghasilkan **Draft** — harus set Open manual sebelum Approve.

---

## §F. Manual General vs Platform — Tabel Pembanding

| Aspek | Manual (General) | Platform (Instant Settlement) |
|-------|-----------------|------------------------------|
| Sumber | Sales Order General approved | Order marketplace via Instant Settlement |
| Cara buat | Create manual di menu SI | Otomatis dari sistem settlement |
| Customer | General Company as customer | Store platform |
| Bisa reject? | Ya (dari status Open) | Tidak — diblokir |
| Bisa delete? | Ya (draft/open/rejected) | Tidak — diblokir |
| Import saldo awal? | Ya — hanya SO General | Tidak — platform ditolak |
| Kolom "Instant Settlement" di datalist | Kosong | Terisi; kolom default hidden |

---

## §G. Langkah Penggunaan — Manual General

1. **Create** — sistem sering mengisi customer / kurs dari invoice terakhir; tanggal = hari ini. Gagal jika belum ada last saved atau fiscal invalid → isi manual.
2. **Cek header** — Customer, Transaction Date, Currency, Exchange Rate, Your Ref (opsional).
3. **Tambah barang dari Outstanding SO** — buka panel Outstanding, pilih per baris SKU (full remaining sisa) atau per seluruh SO. Qty otomatis = sisa penuh, tidak bisa diedit partial.
4. **Opsional: tambah Other Cost / Other Discount** di header.
5. **Set status Open** + **Save** (jika masih Draft).
6. **Approve** — sistem validasi: fiscal OK, minimal 1 baris detail, qty prepared cukup, akun piutang/penjualan/pajak terkonfigurasi.
7. **Setelah Approve:** qty "processed to invoice" di SO naik; jurnal piutang + penjualan terbit otomatis; SI muncul di Account Receive.
8. **Terima bayar** di **Account Receive**.

---

## §H. Partial Invoice — Cara Kerja

- Satu SO boleh punya **beberapa SI** (partial antar invoice).
- Saat mengambil barang dari Outstanding SO, sistem mengambil **seluruh sisa** baris SKU itu — **tidak bisa** isi "5 dari 10" di UI (qty disabled saat Use with SO).
- Boleh tagih SKU-A dulu (full qty), SKU-B di invoice berikutnya.

**Contoh:**
- SO-001 berisi: SKU-A 10 pcs, SKU-B 10 pcs.
- SI-1: Use hanya SKU-A → qty 10.
- SKU-B tetap outstanding → SI-2 nanti.

**Invoice Progress:**
- **Prepared:** qty sudah masuk SI yang masih draft/open (belum approved).
- **Processed:** qty sudah di SI yang approved.

---

## §I. Validasi & Aturan Bisnis

| Kondisi | Behavior / pesan |
|---------|------------------|
| Fiscal period invalid (tutup) | Blokir simpan / ubah tanggal / approve |
| Customer inactive | Pesan konfigurasi customer |
| Currency tidak ditemukan | Pesan currency missing |
| Kurs primary ≠ 1 | Pesan invalid rate |
| Kode transaksi duplikat | Pesan "sudah dipakai di form lain" |
| Ubah customer / currency / tanggal setelah ada detail | Blokir — hapus detail dulu |
| Approve tanpa detail | Pesan "tidak ada detail" |
| Qty prepared kurang | Pesan "insufficient invoicable quantity" per SKU |
| Akun piutang (AR) belum dikonfigurasi | Pesan konfigurasi AR untuk Company/Store |
| Akun penjualan produk kosong | Pesan konfigurasi Sales untuk produk yang bersangkutan |
| Akun pajak penjualan kosong | Pesan konfigurasi Tax Sales |
| Reject / Delete SI platform | Diblokir — pesan "dari platform" |
| Import: header template tidak cocok | Pesan format mismatch |
| Import: SO platform | Ditolak — hanya order internal/general |
| Import: Order Number dan Platform Order ID keduanya kosong / terisi | Ditolak — salah satu saja |
| Import: SO sudah full di-invoice | Pesan "already been invoiced" |
| Import: tanggal transaksi < tanggal SO | Ditolak |
| Import: duplikat dalam file | Ditolak |
| Import: 1 baris invalid | Seluruh file gagal (all-or-nothing) |

---

## §J. Import Saldo Awal (Excel)

**Template 3 kolom:** Transaction Date · Order Number · Platform Order ID

| Aturan | Detail |
|--------|--------|
| Format file | Terutama .xlsx (FE); backend juga terima .xls/.csv |
| Key: Order Number ATAU Platform Order ID | Wajib **salah satu** — jangan keduanya kosong atau terisi |
| Jenis SO | Hanya **Sales Order General/internal** — platform ditolak |
| SO harus | Approved/Processed, belum di-invoice (non-void), milik company |
| Tanggal transaksi | Harus ≥ tanggal SO; format DD-MM-YYYY (juga numeric Excel / yyyy-mm-dd) |
| 1 baris = 1 SI | Semua outstanding line SO di-Use ke satu SI |
| Status setelah import | **Open** — **belum** auto-approve |
| Jurnal | **Belum** terbit saat import — terbit saat **Approve** SI manual |
| Partial success? | **Tidak** — 1 baris invalid → seluruh file gagal |
| Limit | ~5.000 baris |
| Duplikat dalam file | Ditolak |

---

## §K. Journal on Approve

Saat SI di-approve, jurnal terbit otomatis (auto-approved):

| Sisi | Akun | Amount |
|------|------|--------|
| Debit | **Piutang (AR)** — akun Company (general) / Store (platform) | Net = jumlah kredit − other discount |
| Kredit | **Penjualan** — per akun produk (sebelum PPN, local currency) | Per SKU |
| Kredit | **PPN penjualan** — akun pajak | Total VAT |
| Kredit | **Other Cost** — akun biaya lain | Jika ada |
| Debit | **Other Discount** — akun diskon lain | Jika ada |

Deskripsi jurnal: "Auto-Journal from {kode SI}" + referensi SO/platform/customer.

---

## §L. Field Header (Basic Information)

| Field | Wajib | Default / behavior |
|-------|-------|--------------------|
| Transaction Code | Auto-generate | Prefix **SI**; bisa manual, max 50, harus unik |
| Transaction Date | Ya | Hari ini; validasi fiscal period |
| Due Date | Tidak | = Trx Date jika kosong; tanpa validasi fiscal |
| Currency | Ya | Primary (IDR); dari last saved |
| Exchange Rate | Ya | 1; disabled jika primary; primary harus 1 |
| Customer | Ya (manual) | General + AR COA + SO outstanding; platform show-only dari store |
| AR COA | Disabled | Otomatis dari Company AR atau Store AR |
| Your Ref / Term / Description | Tidak | Max Term 2.000; Description 150 |
| Transaction Status | Draft / Open | AS-IS create = Draft (TO-BE: Open) |
| Attachment | Tidak | Validasi ekstensi file |

**Penting:** setelah ada baris detail, field berikut terkunci: Customer, Currency, Exchange Rate, Transaction Date, Due Date. Hapus semua detail dulu untuk mengubah.

---

## §M. Field Detail (Item Configuration)

| Elemen | Behavior |
|--------|----------|
| Select Product | SKU dari SO detail yang Approved/Processed dan masih outstanding |
| Outstanding SO | Filter berdasarkan nomor SO internal (bukan kode order platform) |
| Bundle | Tampil **header bundle** saja |
| Qty | Otomatis = seluruh remaining qty baris; **disabled** di UI (tidak bisa edit partial) |
| Invoice Progress | Prepared = di SI draft/open lain; Processed = di SI approved |

**Outstanding Detail view:** SO Code/Date · SKU/Name · SO Qty · Unit · Unit Price (dari SO) · Discount · VAT · Total · Invoice Progress.
**Group view:** per SO yang masih punya SKU outstanding; create-group menambah semua outstanding line SO.

---

## §N. Field Additional Cost / Discount

| | Other Cost | Other Discount |
|--|-----------|---------------|
| Master | Other Cost active | Other Discount active |
| Akun di tabel | Dari master; **bisa diedit** | Sama |
| Masuk Net Sales | Ya | Ya |
| Masuk basis PPN produk | **Tidak** | **Tidak** |

---

## §O. Totals

| Label | Arti |
|-------|------|
| Total Products | Unit price before VAT × qty |
| Disc Products | Diskon per item |
| Total VAT | PPN detail |
| Total Other Cost / Discount | Sum header |
| **Net Sales** | Products − Disc + VAT + Other Cost − Other Discount |

---

## §P. Datalist

### Kolom default

| Kolom | Default visible | Catatan |
|-------|----------------|---------|
| Trx. Code / Trx.Date | Ya | Link ke edit |
| Customer | Ya | Company atau store |
| Your Ref. | Ya | Referensi customer |
| Trx. Ref. | Ya | SO / settlement |
| Instant Settlement | **Tidak** | Jika dari settlement |
| Platform Order | Ya | Platform order ID |
| Currency / Exchange | Ya | |
| Total Product | Ya | After discount incl. VAT |
| Total Other Cost / Discount | Ya | |
| Total | **Tidak** | Grand before VAT |
| Net Sales | Ya | Grand after VAT |
| Trx. Status | Ya | Badge status |
| Description | **Tidak** | |
| Created by / at | Ya | |
| Action | Ya | Edit / Show / Delete / Print / Approve / Reject |

### Toolbar

Global Search · Advanced Filter (SearchBuilder) · **Create** (auto-save dari last saved) · Show deleted · Column show/hide · Export without/with detail (async) · **Import** template 3 kolom.

### Action per baris

| Action | Muncul jika |
|--------|-------------|
| Edit | Belum approved (draft/open/rejected) |
| Show | Approved (atau view-only platform) |
| Delete | Belum approved **dan** bukan platform |
| Print | Semua status |
| Approve / Reject | Status **open** + privilege; Reject diblokir untuk platform |

---

## §Q. Contoh Kasus

| # | Situasi | Expected |
|---|---------|----------|
| 1 | SO: SKU-A 10, SKU-B 10; SI-1 Use hanya SKU-A | Qty SI = 10 (tidak bisa 5); SKU-B outstanding untuk SI-2 |
| 2 | Unit price UI 10.000 VAT included | UI tetap 10.000; sistem hitung before VAT di belakang untuk jurnal |
| 3 | Rejected → buka form | Radio menunjukkan Draft; Save → Draft; set Open lagi sebelum Approve |
| 4 | Import 1 SO General valid | SI berstatus **Open**; jurnal terbit setelah Approve manual |
| 5 | Import SO platform | Ditolak — hanya internal/general |
| 6 | Create manual untuk order platform | Tidak bisa — SO platform tidak muncul di outstanding |
| 7 | Approve tanpa konfigurasi akun AR | Gagal dengan pesan konfigurasi |
| 8 | Fiscal period tutup | Create / approve ditolak |

---

## §R. Keterbatasan & Hal dalam Tinjauan

Framing: ini adalah **kondisi sistem saat ini**, bukan janji perbaikan.

| # | Deskripsi | Status |
|---|-----------|--------|
| 1 | **TO-BE: Create langsung Open.** Saat ini Create menghasilkan Draft — user harus set Open manual sebelum Approve. Rencana ke depan: Create langsung Open. | Pending |
| 2 | **Import: intent jurnal belum terbit sampai Approve.** Kode internal mungkin masih memanggil proses jurnal saat import (residual), tapi intent bisnis: jurnal baru terbit saat SI di-Approve. | Perlu konfirmasi residual |
| 3 | **Format file import:** frontend terutama .xlsx; backend juga terima .xls/.csv. | Minor |
| 4 | **Pesan error currency** mungkin menyebut "purchase order" — tidak sesuai konteks Sales Invoice. | Bug candidate |

---

## §S. Menu Terkait

| Menu | Relasi dengan Sales Invoice |
|------|-----------------------------|
| **Sales Order General / All SO** | Sumber order & outstanding qty untuk create manual |
| **Instant Settlement** | Generate SI platform otomatis |
| **Account Receive** | Pelunasan / alokasi bayar ke SI approved |
| **Credit Note / Sales Return** | Koreksi / retur setelah SI |
| **AR Report / SO Invoicing / Settlement Status** | Progress & laporan |
| **Journal / GL / P&L / Balance Sheet** | Konsumen jurnal SI |
| **Fiscal Period** | Validasi tanggal transaksi |
| **Currency / Product COA / Tax / Other Cost-Discount** | Master data pendukung |

---

## §T. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Tidak bisa Approve dari Draft | Status masih Draft | Set **Open** + Save dulu |
| Outstanding kosong saat tambah barang | SO belum approved, atau sisa sudah full prepared/processed | Cek status SO dan invoice progress |
| Approve gagal — pesan konfigurasi akun | Akun piutang (AR), penjualan, atau pajak belum diset | Lengkapi konfigurasi di Company/Store/Product |
| SI platform tidak bisa hapus/reject | Normal — SI dari platform | Tidak ada aksi; hubungi admin settlement jika perlu koreksi |
| Import gagal semua padahal hanya 1 baris bermasalah | All-or-nothing | Perbaiki baris bermasalah; cek log import |
| Rejected jadi Draft setelah Save | Normal — set Open lagi lalu Approve | |
| Tidak bisa ubah customer/tanggal setelah ada baris barang | Header terkunci setelah ada detail | Hapus semua baris detail dulu |
| Pesan error menyebut "purchase order" saat validasi currency | Diketahui sebagai teks yang tidak sesuai | Abaikan kata "purchase order"; validasi tetap berlaku untuk SI |

---

## §U. FAQ

**Q: Kenapa tidak bisa Approve dari status Draft?**
A: Approval membutuhkan status minimal **Open**. Set Open + Save dulu.

**Q: Boleh invoice sebagian qty satu SKU (misal 5 dari 10)?**
A: Tidak. Saat Use dari Outstanding SO, qty = **seluruh sisa** baris itu. Partial antar SI = pilih SKU/line yang berbeda.

**Q: Order platform bisa di-create manual?**
A: Tidak. Platform order otomatis dari Instant Settlement.

**Q: Platform order bisa di-import?**
A: Tidak. Import hanya untuk Sales Order General/internal.

**Q: Kapan jurnal muncul?**
A: Saat SI di-**Approve** (bukan saat import — import berhenti di status Open).

**Q: Customer manual dari mana?**
A: General Company yang sudah diakui sebagai customer + punya akun piutang + punya SO General outstanding — bukan store platform.

**Q: Setelah Approve, jurnal sudah langsung approved?**
A: Ya, pada approve normal. Import: SI masuk Open dulu; jurnal saat Approve SI.

**Q: Setelah Reject, status jadi apa?**
A: Setelah Save edit, biasanya kembali ke **Draft**. Set Open lagi lalu Approve.

**Q: Wajib isi Other Cost?**
A: Tidak — opsional.

**Q: Beda Sales Invoice vs Instant Settlement?**
A: Sales Invoice = dokumen tagihan. Instant Settlement = proses yang otomatis membuat SI dari settlement marketplace.
