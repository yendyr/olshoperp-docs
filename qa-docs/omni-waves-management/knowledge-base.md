---
doc_type: knowledge-base
menu: omni-waves-management
menu_name: "Waves Management"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Waves Management — Knowledge Base

> **Status: DRAFT** — Dokumentasi AS-IS pertama (2026-06-19). Belum melalui review QA/PM.

## 1. Apa itu Waves Management?

Menu **Waves Management** (`/omni/waves-management`) mengatur **wave** — aturan pengelompokan order dan transfer untuk fulfillment gudang. Wave menentukan SO/transfer mana yang masuk kelompok picking berdasarkan filter **platform**, **store**, **warehouse**, shipper, rack, label group, dan kondisi produk.

Dua tipe wave di UI:

| Tipe | `wave_type` | Isi wave |
|------|-------------|----------|
| Sales Order | `sales order` | Sales Order Platform |
| Transfer | `transfer` | Stock Mutation Transfer (hidden wave TF) |

Wave **MIX** (id=1) adalah default bucket — SO baru masuk MIX sampai automation memindahkan ke wave prioritas.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Wave | Record `omni_waves` dengan priority, filter, minimum order |
| Priority | Urutan evaluasi wave — `NULL` = tidak aktif |
| MIX / MIX-TF | Wave default SO dan Transfer (tidak editable via link) |
| Wave Automation | Start/Pause generate wave — status di `wave_generate_status` |
| Generate Wave | Job memindahkan SO dari MIX ke wave matching |
| Filter Platform/Store/Warehouse | Detail filter di tabel pivot wave |
| Revert Wave | Kembalikan SO dari wave ke MIX (bulk action) |
| Picklist | Daftar picking — di-generate terpisah (bukan menu ini) |

## 3. Yang Bisa / Tidak Bisa

### Bisa

- Create/edit wave (kecuali MIX)
- Set filter platform, store, warehouse process, rack, shipper, label
- Set kondisi SO (min order, qty SKU, dimensi, berat)
- Start / Pause wave automation
- Lihat jumlah SO/transfer & produk per wave
- Revert all wave (dengan konfirmasi)
- Generate picklist dari wave (dispatch job)
- Toggle wave type Sales Order vs Transfer di DataList

### Tidak Bisa

- Edit wave MIX / MIX-TF (read-only di grid)
- Generate wave saat automation paused (SO tetap di MIX)
- Hapus wave yang masih berisi SO aktif (policy)

## 4. Cara Pakai

### 4.1 Buat wave baru

1. **Waves Management** → Create
2. Isi nama, priority (angka — lebih kecil = lebih prioritas)
3. Tab filter: pilih **Platform**, **Store**, **Warehouse** (WH process)
4. Set minimum order, kondisi produk jika perlu
5. Save → **Start** automation agar SO baru didistribusikan

### 4.2 Start / Pause automation

| Tombol | Efek |
|--------|------|
| **Start** | `wave_generate_status` → STARTED — scheduler/job `GenerateWaveJob` aktif |
| **Pause** | Status → PAUSED — distribusi SO ke wave prioritas berhenti |

### 4.3 Monitor wave

- Klik angka **SO Total** untuk slideover detail SO di wave
- Filter warehouse di header DataList — scope count per WH process user
- Tab **Transfer** untuk wave tipe transfer (hidden TF dari WH binding)

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| SO tidak pindah dari MIX | Automation paused atau tidak match filter | Start automation; cek filter store/WH |
| SO Total = 0 | Belum ada picklist / filter WH salah | Cek `wh_process_id` SO vs filter |
| Revert stuck | `RevertWaveJob` running | Tunggu `revert_status` selesai |
| Wave tidak muncul di picker | `priority` NULL | Set priority > 0 |

## 6. FAQ

**Q: Beda Waves Management vs Picking List?**  
A: **Waves Management** = aturan pengelompokan SO. **Picking List** = dokumen operasional picking setelah picklist di-generate.

**Q: Kapan GenerateWaveJob jalan?**  
A: Saat automation STARTED — memindahkan SO dari MIX ke wave pertama yang match (`WaveService::findMatchingWave`).

## Relasi Instant Settlement (operator)

Settlement hanya untuk order yang sudah **Shipped WH 3PL**. Itu dimulai dari SO yang masuk **wave** lalu menjalani pick → check → pack → collect → DO.

| Tips | Penjelasan |
|------|------------|
| SO stuck di MIX | Jalankan wave automation / unassign wave sesuai SOP |
| Upload settlement gagal V-04 | Selesaikan rantai gudang dulu — wave hanya langkah pertama |

Detail: [Instant Settlement](../accounting-settlement-upload/requirement.md)
