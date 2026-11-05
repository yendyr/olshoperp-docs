---
doc_type: requirement
menu: accounting-sales-order-profit-loss
menu_name: "Sales Order Profit Loss"
version: 1.1
last_updated: 2026-11-05
owner: QA - Yemima
status: review
aliases: [SO P/L, sales order profit loss, SO profit loss]
---

# Sales Order Profit Loss — Requirement Documentation

**Modul:** Finance & Accounting / Report  
**UI route:** `/accounting/sales-order-profit-loss`  
**Audience:** PM, QA  
**TO-BE:** [ETM-17074](https://erpintegration.atlassian.net/browse/ETM-17074) kolom Outbound · [ETM-17073](https://erpintegration.atlassian.net/browse/ETM-17073) Export / Advanced Filter / Global Search (tabel per SO)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.1 | 2026-11-05 | QA - Yemima | §5b TO-BE ETM-17073 (export/filter/search OrderTable); Relates 17074 |
| 1.0 | 2026-11-05 | QA - Yemima | Initial SoT dari AS-IS kode + TO-BE ETM-17074 |

---

## 1. Ringkasan Eksekutif

**Sales Order Profit Loss** = report **read-only** yang menampilkan laba/rugi penjualan per periode, dengan filter **platform** & **store**, chart agregat, dan beberapa datalist (harian / per store / per platform / **per Sales Order**).

Sumber angka:

| Komponen | Sumber |
|----------|--------|
| Qty / Total SO / Total SI | Sales Order **Approved** atau **Processed** + detail order |
| Total COGS (HPP) | Outbound External kode **`OT-%`** (tidak soft-deleted), detail ref `SalesOrderDetail` |
| Total P/L | `Total SI − Total COGS` |
| % P/L | `(Total SI − Total COGS) / Total SI × 100%` (edge: SI=0 & COGS>0 → `∞`; COGS=0 → `0%`) |

Bukan menu ini: [Profit & Loss](../accounting-profit-loss/) (COA), [Product Profit Loss](../accounting-product-profit-loss/) (per SKU).

---

## 2. Prasyarat

| Prasyarat | Catatan |
|-----------|---------|
| SO Approved/Processed di rentang filter tanggal | Draft/Open/dll. tidak masuk |
| Outbound `OT-%` untuk COGS | Tanpa outbound → COGS = 0; P/L = Total SI |
| Filter store/platform | Opsional; kosong = semua store yang user boleh lihat |
| Privilege view report | Menu read-only |

---

## 3. Filter UI (AS-IS)

| Kontrol | Perilaku |
|---------|----------|
| Date period | Range tanggal; default ~1 bulan ke belakang → hari ini; ubah → refresh chart + tabel |
| Platform (multiselect) | Memilih platform mengisi/menyesuaikan store terkait |
| Store (multiselect) | Filter `storeIds[]` ke API chart & datalist |

---

## 4. Area laporan (AS-IS)

### 4.1 Chart

- Line: daily P/L & daily P/L %
- Donut: P/L per platform & per store

### 4.2 Datalist

| Judul UI di layar | Endpoint | Grain baris |
|-------------------|----------|-------------|
| Daily Total P/L in Period | `…/daily` | per hari |
| (tabel per store — StoreTable) | `…/daily-per-store` | per hari + store + platform |
| (tabel per platform — PlatformTable) | `…/daily-per-platform` | per hari + platform |
| **Daily Total P/L in Period per Store** | `…/daily-per-so` | **per Sales Order** |

> **Catatan AS-IS:** Judul UI **"Daily Total P/L in Period per Store"** dipakai pada komponen **OrderTable** (satu baris = satu SO / `Trx. Code` order). Bukan agregat per store. ETM-17074 mengacu tabel ini (ada nomor order).

### 4.3 Kolom tabel per SO — AS-IS

| Kolom UI | Isi |
|----------|-----|
| **Trx. Code** | Kode Sales Order (link) |
| **Store Name** | Store SO |
| **Platform Name** | Platform SO |
| **Total Product Qty Sold** | Qty base unit (tooltip: Total quantity in base unit) |
| **Total COGS** | Dari outbound details (tooltip) |
| **Total SO** | Net Sales Order |
| **Total SI** | Net Sales Invoice |
| **Total P/L** | Total SI − Total COGS |
| **% P/L** | Formula di atas |

**Tidak ada** kolom kode/tanggal Outbound di AS-IS.

---

## 5. TO-BE — ETM-17074 (kolom Outbound di tabel per SO)

### 5.1 Request (user)

Tambah kolom **Trx. Code Outbound** dan **Trx. Date Outbound** pada datalist yang menampilkan nomor SO (**Daily Total P/L in Period per Store** / OrderTable).

### 5.2 Expected

| ID | Kriteria |
|----|----------|
| SOPL-OB-01 | Di tabel per SO (`daily-per-so`), muncul kolom **Trx. Code Outbound** dan **Trx. Date Outbound** |
| SOPL-OB-02 | Nilai diambil dari Outbound External **`OT-%`** yang sama jalur dengan kalkulasi **Total COGS** (detail outbound ref Sales Order Detail) |
| SOPL-OB-03 | SO tanpa outbound terkait → kolom outbound tampil kosong / `-`; Total COGS tetap 0 (AS-IS) |
| SOPL-OB-04 | Hanya tabel per SO yang wajib kolom baru; chart & tabel agregat harian/store/platform **tidak** wajib diubah |
| SOPL-OB-05 | Label kolom UI persis: **Trx. Code Outbound**, **Trx. Date Outbound** |

### 5.3 Multi-outbound per SO (keputusan default docs)

Satu SO dapat punya **lebih dari satu** Outbound `OT-%`.

| Aturan (v1.0) | Perilaku |
|---------------|----------|
| Beberapa OT | **Trx. Code Outbound** = daftar kode digabung koma (urut tanggal outbound naik / kode); **Trx. Date Outbound** = tanggal outbound terkait (multi → digabung atau tampil rentang — implementasi boleh tooltip daftar lengkap) |
| Satu OT | Tampil satu kode + satu tanggal |

Jika implementasi memilih hanya “OT pertama”: dokumentasikan di technical + update AC — status gap **GAP-SOPL-01** sampai QA verify di staging.

---

## 5b. TO-BE — ETM-17073 (Export / Advanced Filter / Global Search di tabel per SO)

**Target UI:** hanya **Daily Total P/L in Period per Store** (`OrderTable` / `daily-per-so`). Chart & tabel agregat harian / store / platform **out of scope**.

### AS-IS (OrderTable)

- `filter_column=false` — tidak ada Advanced Filter / Global Search toolbar
- Tidak ada Export All / Active Page

### Expected

| ID | Kriteria |
|----|----------|
| SOPL-XF-01 | **Advanced Filter** untuk kolom yang tampil di tabel per SO |
| SOPL-XF-02 | **Global Search** pada datalist tabel per SO |
| SOPL-XF-03 | **Export All** — kolom file mengikuti UI; hormati periode + `storeIds` halaman + Advanced Filter/search aktif |
| SOPL-XF-04 | **Export Active Page** — pola standar report Accounting (selaras Product Profit Loss) |
| SOPL-XF-05 | Setelah ETM-17074 live: kolom Outbound ikut filter & export jika sudah di UI |

---

## 6. Contoh kasus

| # | Situasi | Expected |
|---|---------|----------|
| T01 | SO Approved, 1× OT Approved | Trx. Code Outbound = kode OT; Trx. Date Outbound = tanggal OT; COGS > 0 |
| T02 | SO Approved, belum OT | Outbound columns `-` / kosong; COGS = 0 |
| T03 | SO dengan 2× OT | Kedua kode OT terlihat di kolom (aturan §5.3) |
| T04 | Filter store A | Hanya SO store A; kolom outbound tetap konsisten per baris |

---

## 7. Acceptance Criteria (menu inti + TO-BE cards)

| ID | Kriteria |
|----|----------|
| SOPL-01 | Filter periode + store/platform memengaruhi chart & semua datalist |
| SOPL-02 | Hanya SO Approved/Processed |
| SOPL-03 | COGS dari OT-% ref SOD; tanpa OT → COGS 0 |
| SOPL-04 | Formula P/L & % sesuai §1 |
| SOPL-05 | Tabel per SO menampilkan Trx. Code (SO) + store + platform + metrik |
| SOPL-06 | **TO-BE** SOPL-OB-01…05 (ETM-17074) |
| SOPL-07 | **TO-BE** SOPL-XF-01…05 (ETM-17073) |

---

## 8. Gap Registry

| ID | Deskripsi | Status |
|----|-----------|--------|
| GAP-SOPL-01 | Display exact multi-OT (join koma vs first-only vs tooltip) | Open — verify saat implementasi ETM-17074 |
| GAP-SOPL-02 | Judul UI "…per Store" pada tabel per SO membingungkan | Open — opsional rename (bukan scope 17074/17073) |

---

## 9. Relasi Menu

| Menu | Peran |
|------|--------|
| Sales Order (General / Platform) | Sumber baris & Total SO/SI |
| Outbound External | Sumber COGS + (TO-BE) kode/tanggal OT |
| Product Profit Loss | Sibling report per SKU |
| Profit & Loss | Sibling report COA |
