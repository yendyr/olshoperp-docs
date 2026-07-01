---
doc_type: knowledge-base
menu: supplychain-setting
menu_name: "Warehouse Setting"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Warehouse Setting — Knowledge Base

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 1. Apa itu Warehouse Setting?

**Warehouse Setting** mengonfigurasi lokasi khusus per **building** (warehouse level 19): out rack picking, scrap, return, WIP, finish goods, dan failed ship. Mapping disimpan per building dan dipakai otomatis oleh proses mutasi, picking, dan void/scrap.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Building** | Warehouse non-virtual level 19 (active) |
| **Out Rack Picking** | Lokasi keluar untuk picking (`SettingWarehouseOutRack` type picking) |
| **Scrap / Return / WIP / FG / Failed Ship** | Virtual location targets di `SettingWarehouseScrapVoid` |
| **Smallest child** | Node tanpa child non-virtual — satu-satunya yang boleh dipilih |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Lihat daftar building aktif level 19
- Set tiap kolom lokasi via dropdown inline (auto-save per field)
- Pilih hanya leaf warehouse di bawah building yang sama
- Lihat audit gabungan setting out rack + scrap/void

### Tidak Bisa
- Tambah building dari menu ini (building harus ada di Warehouse Structure)
- Pilih warehouse yang masih punya child
- Create record baru via form terpisah (inline update only)

## 4. Cara Pakai (How-To)

1. Buka **SCM → Master → Warehouse Setting**.
2. Pada baris building, klik dropdown **Out Rack Location**, **Scrap**, **Return**, dll.
3. Pilih lokasi leaf di dalam hierarki building tersebut.
4. Perubahan tersimpan otomatis via API update.
5. **Audit Log** dari sidebar untuk riwayat perubahan.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Building tidak muncul | Bukan level 19 / inactive | Buat/aktifkan building di Structure |
| Dropdown kosong | Tidak ada leaf rack di bawah building | Lengkapi struktur hingga rack |
| Error smallest child | Memilih parent node | Pilih lokasi paling bawah |

## 6. FAQ

**Q: Apakah setting wajib sebelum transaksi?**
A: Banyak alur mutasi memanggil `getWarehouseOutRack()` — tanpa setting, sistem fallback ke virtual warehouse by `process_group` config.
