---
doc_type: knowledge-base
menu: supplychain-location
menu_name: "Location"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Location — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Location?

**Location (Processing Location)** adalah master **titik/lokasi proses gudang** — misalnya stasiun CCTV, meja checking, atau area packing — yang direkam saat operator memproses order. Data disimpan di `scm_locations` dan direferensi transaksi seperti Failed Ship, Manual Picking List, serta alur Omni processing.

| Item | Nilai |
|------|-------|
| Menu | Supply Chain → Master → Location |
| Route UI | `/supplychain/location` |
| API prefix | `supplychain/location` |
| Tabel | `scm_locations` |

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Processing Location | Lokasi fisik/logis tempat aktivitas warehouse dicatat |
| `location_id` | FK pada `scm_stock_mutations` (Failed Ship, picking, dll.) |
| Select2 Location | Dropdown lokasi aktif untuk transaksi |
| `is_all_company` | Lokasi dibagikan antar company grup |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa

- CRUD master location (code, name, description)
- Aktif/nonaktifkan location
- Pilih location via select2 di Failed Ship, Manual Picking List, dll.
- Lihat audit log per location
- Share location antar company (`is_all_company`)

### Tidak Bisa

- Duplikasi `code` per company
- Menggunakan location inactive di select2 (filter active)

## 4. Cara Pakai (How-To)

### Buat location baru

1. Buka **Location** → **Create**.
2. Isi **Code** (unik), **Name**, **Description** (opsional).
3. Set status **Active**.
4. Simpan.

### Pakai di Failed Ship

1. Buat/buka dokumen Failed Ship.
2. Buka halaman **Set Location** (`/supplychain/failed-ship/set-location/:id`).
3. Pilih location dari select2.
4. Simpan — status dokumen dapat berubah `draft` → `open` dan durasi proses mulai tercatat.

### Nonaktifkan location

1. Edit location → status Inactive.
2. Location tidak muncul lagi di dropdown transaksi baru.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Location tidak muncul di select2 | Status inactive | Aktifkan location |
| Code already taken | Duplikat | Gunakan code lain |
| Set location gagal | Failed Ship bukan draft/open | Cek status dokumen FS |

## 6. FAQ

**Q: Apakah location sama dengan warehouse bin/rack?**  
A: Tidak. Location di menu ini adalah **processing station** (CCTV/meja proses), bukan layout bin warehouse.

**Q: Menu mana yang wajib set location?**  
A: Failed Ship (set-location flow); juga dipakai Manual Picking List dan modul Omni processing.

## 7. Relasi Menu

| Menu | Route | Hubungan |
|------|-------|----------|
| Failed Ship | `supplychain/failed-ship/set-location/:id` | `location_id` on stock mutation |
| Manual Picking List | `supplychain/manual-picking-list` | set-location, select2 |
| Omni Processing Location | `omni/processing/location` | Reuse entity/komponen |

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
