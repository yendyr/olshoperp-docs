---
doc_type: gemini-generation-brief
target_menu: "Transfer Internal"
menu_slug: supplychain-mutation-transfer-internal
source_of_truth: docs/qa-docs/supplychain-mutation-transfer-internal/ (repo olshoperp — dibaca 2026-09-01)
purpose: >
  Brief lengkap untuk di-paste ke Gemini agar generate SATU dokumen
  konsolidasi "Transfer Internal" bergaya Pentaho — bukan wireframe, bukan kode.
status: ready-to-send-to-gemini
source_doc_status: >
  KB review v2.0 · requirement review v2.0 · technical review v2.0 ·
  user-guide review v1.0 · feature-map review v1.0 · 7 Lingo cards detailed ·
  ~1.400 baris total · proporsional section standar.
  Hybrid AS-IS + TO-BE (import colli v2); 7 Gap (2 Major Open).
---

# BRIEF UNTUK GEMINI — Generate Dokumentasi "Transfer Internal"

> **Cara pakai:** copy/upload file ini ke Gemini. **PART 1** = instruksi.
> **PART 2** = SELURUH fakta sumber. Gemini wajib pakai Part 2 saja — dilarang mengarang.

---

# PART 0 — Kenapa struktur ini seperti ini / beda dari menu lain

1. **Transaksi SCM dengan siklus status** — Draft → Open → Approved / Rejected. **Tidak ada Void** untuk TFI manual. Butuh `stateDiagram-v2`.
2. **Dua tampilan UI:** **Legacy** (`/supplychain/mutation-transfer-internal`) untuk operasi harian tanpa colli; **BETA Colli v2** (`/supplychain/new-mutation-transfer-internal`) untuk fitur colli. Harus ada tabel pembanding.
3. **Tiga cara tambah barang** dengan aturan alokasi berbeda: Select Product (Fulfill-after-FIFO), Available Product (stock ID spesifik), Import Excel (bulk). Ini konsep paling sering membingungkan operator.
4. **Fulfill-after-FIFO** — coba cukup dari satu batch/rak dulu; kalau tidak, gabung beberapa batch terlama. Hanya untuk Select Product & Import, bukan Available Product.
5. **Colli v2 (BETA):** invariant **1 colli code = 1 lokasi**; ganti lokasi tujuan → colli destination kosong lagi; relocate whole colli punya aturan reserved.
6. **TFI otomatis** dari Assembly, SO fulfillment, Failed Ship — kolom Trx. Ref; toggle **Show Virtual WH** di datalist.
7. **Import colli TO-BE** (1 kolom code) vs AS-IS codebase masih format lama — framing netral sebagai gap.

---

# PART 1 — Instruksi untuk Gemini

## 1.1 Peran

Kamu = technical writer bergaya pentaho.com: definisi → prosedur → tabel referensi; langkah bernomor; callout **Note / Tip / Warning**; tanpa marketing. **Sumber satu-satunya = PART 2**.

## 1.2 Bahasa & tone

- Bahasa Indonesia + istilah EN seperlunya (Transfer Internal, Approve, Colli, Fulfill-after-FIFO, Show Virtual WH).
- Definisikan istilah sebelum dipakai.
- **NOL** path file / class / kolom DB / ID internal (GAP-TFI-xx, A-TFI-xx, V-TFI-xx).
- Boleh sebut ID sub-feature Lingo (SF-DET-01, SF-TFI-01..04, SF-VIEW-01, SF-IMP-01) sebagai navigasi.

## 1.3 Struktur dokumen WAJIB (22 section)

1. Judul & Ringkasan Singkat
2. Istilah Kunci
3. Kapan & Kenapa Dipakai
4. Prasyarat
5. Posisi dalam Alur Bisnis (`flowchart LR`)
6. Lokasi Menu — legacy vs BETA + placeholder screenshot
7. Siklus Status (`stateDiagram-v2`) + tabel — **tanpa Void**
8. Legacy vs BETA Colli v2 — tabel pembanding
9. Langkah Penggunaan — Transfer biasa (legacy)
10. Langkah Penggunaan — Transfer dengan Colli (BETA)
11. Tiga Cara Tambah Barang (Select Product / Available Product / Import)
12. Fulfill-after-FIFO — cara kerja + contoh alokasi
13. Group View vs Detail View
14. Colli v2 — New Colli, Existing Colli, invariant 1 lokasi
15. Relocate Whole Colli — Available Product + bulk Use
16. Show Virtual WH & TFI Otomatis
17. Referensi Field — header + detail
18. Aturan Bisnis & Validasi
19. Keterbatasan & Hal dalam Tinjauan (gap, import colli TO-BE)
20. Hubungan dengan Menu Lain (`flowchart TB`)
21. Troubleshooting
22. FAQ + Lihat Juga

## 1.4 Mermaid

- **Wajib:** §5 `flowchart LR` (inbound → TFI → stok pindah); §7 `stateDiagram-v2`; §20 `flowchart TB` relasi menu.
- **Jangan** `stateDiagram-v2` untuk hal selain siklus status dokumen.
- Label berkoma/spasi → kutip; `classDef` hex only; tiap diagram + fallback teks numbered list.

## 1.5 Placeholder gambar (min 5)

1. Sidebar Supply Chain → Transfer Internal
2. Datalist + toggle Show Virtual WH
3. Form header (Origin, Location Destination)
4. Panel Select Product / Available Product
5. BETA: toolbar New Colli / Existing Colli

## 1.6 Checklist penutup

- [ ] 22 section; state diagram tanpa Void
- [ ] Legacy vs BETA table
- [ ] Tiga sumber insert + FIFO vs stock ID beda section
- [ ] Colli invariant + relocate whole + location change reset colli
- [ ] TO-BE import colli ditandai; gap netral
- [ ] SF-* boleh; tidak ada path/class/DB/GAP ID internal di body
- [ ] FAQ: legacy vs BETA, wajib colli?, beda MPL, TF order tidak kelihatan?

---

# PART 2 — SUMBER FAKTA LENGKAP (jangan menambah di luar ini)

> **Transfer Internal** · Modul SupplyChain · Prefix **TFI-** · API type `tf internal`
> Legacy: `/supplychain/mutation-transfer-internal` · BETA: `/supplychain/new-mutation-transfer-internal`

## §A. Ringkasan

Memindahkan stok antar **rak/lokasi dalam satu gedung** (origin = destination header dalam struktur gudang yang sama). Kode dokumen **`TFI-*`**.

Selain input manual, banyak TFI **otomatis** dari Assembly, SO fulfillment, Failed Ship, dll. — lihat kolom **Trx. Ref**; aktifkan **Show Virtual WH** untuk melihatnya.

**Invariant Colli v2 (BETA):** **1 colli code = 1 lokasi** — tidak boleh split lokasi untuk code yang sama.

## §B. Kapan & Kenapa

| Pakai jika | Jangan jika |
|------------|-------------|
| Pindah barang antar rak dalam gedung sama | Pindah antar gedung/eksternal (pakai Transfer External) |
| Stok tersedia di origin | Stok tidak cukup / reserved penuh |
| Periode fiskal terbuka, tanggal ≤ hari ini | Tanggal masa depan |
| Legacy: operasi harian tanpa colli | Expect colli di legacy (pakai BETA) |

## §C. Prasyarat

- WH origin level ≤ 20; detail destination = leaf dalam gedung yang sama
- Availability > 0 per stock ID / colli
- Fiscal period terbuka; tanggal transaksi ≤ today
- Privilege menu (view/create/update/approval)
- Colli Type Active (untuk New Colli BETA)
- Stok/colli dari inbound approved (terlihat di Multisku Colli)

## §D. Istilah Kunci

| Istilah | Arti |
|---------|------|
| **TFI** | Prefix kode Transfer Internal |
| **Fulfill-after-FIFO** | Coba satu batch/rak cukup dulu; else gabung batch terlama |
| **Stock ID** | Satu batch stok (SKU sama bisa banyak stock ID) |
| **Group View / Detail View** | Ringkas per SKU vs per batch stok |
| **Reserved** | Qty dipegang TF draft/open — availability berkurang |
| **Colli (COL)** | Wadah multi-SKU di satu lokasi — Colli v2 hanya di BETA |
| **Show Virtual WH** | Tampilkan TF otomatis dari proses order |
| **Loose** | Barang tanpa colli (`multisku_colli_id` NULL) |
| **Relocate whole colli** | Pindah seluruh isi colli ke lokasi baru, code colli sama |

## §E. Siklus Status

**Tidak ada Void** untuk TFI manual.

```text
Draft → Open → Approved
Open → Rejected → Open (setelah perbaikan)
Draft/Open → Delete (jika belum Approved)
Approved → terkunci (tidak edit)
```

| Status | Edit | Approve | Reserved |
|--------|------|---------|----------|
| Draft / Open | Ya | Ya jika ada detail | Qty detail → reserved ↓ availability |
| Approved | Tidak | — | Mutasi final |
| Rejected | Ya | — | Reserved tetap |

Delete header: reserved → kolom **Transfer** di Stock Monitoring.

## §F. Legacy vs BETA

| Aspek | Legacy | BETA Colli v2 |
|-------|--------|---------------|
| Route | `/supplychain/mutation-transfer-internal` | `/supplychain/new-mutation-transfer-internal` |
| Colli | Tidak | New Colli / Existing Colli toolbar |
| End-user default | **Ya** | Colli rollout |
| API | Sama (`mutation-transfer`) | Sama + `from_menu=new-transfer-internal` |

## §G. Tiga Sumber Insert Detail

| Sumber | Alokasi stok | Edit qty |
|--------|--------------|----------|
| **Select Product** | Fulfill-after-FIFO (loose only) | Re-run rules |
| **Import Excel** | Sama Select Product | Sama |
| **Available Product Use** | **Stock ID spesifik** — tidak FIFO | Max = availability stock ID itu |

**Available Product error:** qty melebihi stok batch terpilih — *Quantity entered cannot exceed available stock for this specific product stock ID…*

**Loose path:** hanya stok tanpa colli — stok colli-bound tidak diambil lewat Select Product/Import.

## §H. Fulfill-after-FIFO

1. Satu Item Stock paling lama dengan `available >= qty` (bukan Outrack/WIP).
2. Else fallback multi-batch FIFO klasik.
3. Else **Insufficient product stock.**

**Contoh** (pensil): 1 Jan A 50 · 2 Jan B 100 · 3 Jan C 150 · 4 Jan D 200

| Pindah | Dari |
|--------|------|
| 50 | A saja |
| 75 | B saja |
| 250 | A50 + B100 + C100 |

## §I. Group View / Detail View

- **Group View (default):** ringkas per SKU
- **Detail View:** per stock ID saat FIFO pecah multi-batch
- BETA: kolom Colli Origin/Destination di kedua view; Group View colli read-only

## §J. Colli v2 (BETA)

**Flow 1 — New Colli:**
- Loose: FIFO loose; exclude colli same loc as origin stock
- Colli-bound origin: max qty = colli availability

**Flow 2 — Existing Colli:**
- Assign multi-SKU ke colli existing
- **Relocate whole colli:** Available Product → bulk Use semua SKU dalam colli → Colli Origin = Colli Destination = code sama → lokasi baru tunggal

**Aturan wajib:**
- Ganti **Location Destination** baris → **Colli Destination NULL** — assign ulang (kecuali lokasi masih sama dengan colli)
- Bulk Existing: exclude colli code = origin baris terpilih (anti self)
- Approve whole colli gagal jika ada qty **reserved** di transaksi lain untuk colli yang sama

**Contoh gagal whole colli:**
- COLLI001 @ RAK001: pensil 100 + buku 50
- Transaksi lain reserve buku 2 pcs di COLLI001 @ RAK001
- TF pindah pensil 100 + buku 48 → **tidak bisa** approve sebagai relocate whole COLLI001

**TF vs PI Colli:**

| Aspek | Purchase Inbound | TF BETA |
|-------|------------------|---------|
| Filter Existing | Exact WH dest header | WH origin structure; exclude same loc as origin stock |
| New Colli location | Header dest | **Detail row** dest |
| Permanent di Multisku Colli | After inbound Approve | After TF Approve |

## §K. Import Excel

- Maks **500** baris; async job + import log
- Alokasi = Fulfill-after-FIFO (sama Select Product)
- Jangan Approve saat import masih jalan

**Colli di import (TO-BE target — 1 kolom colli code):**

| Nilai kolom | Interpretasi |
|-------------|--------------|
| Kosong | Tanpa colli |
| Code belum ada | New Colli |
| Code ada, lokasi = WH dest baris | Existing Colli |
| Code ada, lokasi beda | **Baris gagal** — partial import OK |

**AS-IS codebase:** masih format Colli × Colli Qty v1 — gap major; jelaskan netral di keterbatasan.

## §L. Show Virtual WH & TFI Otomatis

Default datalist **menyembunyikan** TFI virtual / proses fulfillment. Toggle **Show Virtual WH** menampilkan.

| Tahap (contoh rantai) | process_type | Prefix contoh |
|------------------------|--------------|---------------|
| In wave | in wave | TFI virtual |
| Picking | picking | PL |
| Checking | checking | CL |
| Packing | packing | PK |
| Shipping | shipping | SL |
| Shipping DO | shipping do | TFI |
| Failed ship | failed ship | FS |

Edit/approve aturan **berbeda** untuk TFI auto — jangan disamakan dengan input manual.

## §M. Field Header & Detail (ringkas)

**Header:** Origin (gedung), Location Destination default, Transaction Date (≤ today), Description (max 150), Status (Draft/Open).

**Detail per baris:** SKU, Qty + Unit, Location Destination (per baris), Stock ID (Available Product path), Colli Origin/Destination (BETA).

**Setelah Approved:** tidak bisa edit.

## §N. Validasi (inti)

| Kondisi | Behavior |
|---------|----------|
| Tanggal > hari ini | Ditolak |
| Approve tanpa detail | Ditolak |
| Import masih jalan | Approve ditolak |
| Insufficient FIFO | Insufficient product stock |
| Available Product over stock ID | Pesan exceed stock ID |
| Origin = destination detail | Ditolak |
| Colli qty > colli avail | Ditolak |
| Whole colli + reserved elsewhere | Approve gagal |
| Ganti lokasi vs colli dest | Colli dest NULL |

## §O. Yang Bisa / Tidak Bisa

**Bisa:** CRUD Draft/Open/Rejected; Select Product / Import / Available Product; Bulk Delete & Approve; Export; Show Deleted; Show Virtual WH; BETA New/Existing Colli.

**Tidak bisa:** Edit setelah Approved; tanggal masa depan; Approve tanpa detail; Available Product qty > stock ID; relocate whole colli jika reserved; **Void**; approve saat import jalan.

## §P. Keterbatasan & Gap (framing netral)

| Topik | Status |
|-------|--------|
| Colli dest NULL saat ganti location — belum universal di codebase | Open Major |
| Import 1 kolom colli vs format lama di code | Open Major |
| Filter Existing exclude same loc as origin | Verify |
| Whole colli + reserved — pesan approve | Verify |
| Colli ID v1 takedown | Note |
| BETA URL vs Multisku Colli transactionUrl legacy | Open |
| Loose vs colli FIFO edge case | QA watch |

## §Q. Menu Terkait

| Menu | Relasi |
|------|--------|
| **New Purchase Inbound** | Birth colli on Item Stock |
| **Colli Type / Multisku Colli** | Master colli |
| **Assembly** | Auto TFI Open → Approve saat Assembly Approve |
| **Failed Ship / Omni fulfillment** | Auto TFI + Show Virtual |
| **Stock Monitoring** | Reserved / Transfer |
| **Manual Picking List** | Pola Available Product; PL prefix `PL-*` ≠ TFI manual |
| **Transfer External** | Pindah antar gudang/eksternal — beda menu |

**Manual Picking List vs TFI manual:**

| Aspek | TFI (`TFI-*`) | Manual PL (`PL-*`) |
|-------|---------------|---------------------|
| Create | User di Transfer Internal | Manual Picking List |
| Approve | User Approve | Auto saat Complete Picking |
| Picking UI | Tidak | Omni picking |

## §R. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Qty Available Product ditolak | Melebihi stock ID | Kurangi qty atau Select Product |
| Insufficient product stock | Stok tidak cukup | Cek Stock Monitoring |
| Colli hilang setelah ganti lokasi | Colli dest reset | Assign colli lagi |
| Approve colli gagal | Reserved di TF lain | Selesaikan TF lain / colli baru |
| Import baris colli gagal | Code colli di lokasi lain | Perbaiki baris |
| TF order tidak kelihatan | Filter default | Show Virtual WH |

## §S. FAQ

**Q: Legacy vs BETA?**  
A: End-user pakai **legacy**; Colli v2 hanya di **BETA** sampai cutover.

**Q: Wajib pakai colli?**  
A: Tidak — kosong = barang loose.

**Q: Beda dengan Manual Picking List?**  
A: PL prefix `PL-*`, auto approve saat Complete Picking — bukan TFI manual.

**Q: Kapan colli muncul di Multisku Colli?**  
A: Setelah transaksi yang membuat colli di-**Approve**.

**Q: Kenapa TF dari order tidak kelihatan?**  
A: Aktifkan **Show Virtual WH**.

**Q: Bisa Void?**  
A: Tidak — TFI manual tidak punya Void.

**Q: Import colli gagal sebagian?**  
A: Baris dengan colli code lokasi tidak cocok bisa gagal; baris valid lain tetap sukses (partial).
