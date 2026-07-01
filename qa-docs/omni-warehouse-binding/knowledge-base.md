---
doc_type: knowledge-base
menu: omni-warehouse-binding
menu_name: "Warehouse Binding"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
---

# Warehouse Binding — Knowledge Base

> **Status: DRAFT** — Dokumentasi AS-IS pertama (2026-06-19). Belum melalui review QA/PM.

## 1. Apa itu Warehouse Binding?

Menu **Warehouse Binding** (`/omni/warehouse-binding`) memetakan **gudang platform** (hasil sync dari marketplace per store) ke **gudang sistem** OlshopERP. Tiga tipe binding:

| Tipe | Konstanta | Fungsi operasional |
|------|-----------|-------------------|
| **Process** | `WB_PROCESS` | Gudang proses fulfillment — SO dialokasikan ke WH ini |
| **Stock** | `WB_STOCK` | Gudang stok (building) — sumber push/pull inventory ATS |
| **Return** | `WB_RETURN` | Gudang return — optional |

Data disimpan di tabel `omni_warehouse_binding_pivot`. Grid utama menampilkan WH platform per store dengan kolom WH Stock dan WH Process terikat.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| WH Platform | Record `omni_warehouse_platforms` — gudang di sisi marketplace |
| WH System | Gudang internal Supply Chain (`warehouses`) |
| Process Binding | Satu WH sistem per WH platform (1:1) |
| Stock Binding | Bisa multi WH sistem per WH platform |
| Include ATS | Flag warehouse — auto-enabled saat set Process binding |
| Transfer Wave | Dokumen transfer internal tersembunyi WH proses → virtual WH wave |

## 3. Yang Bisa / Tidak Bisa

### Bisa

- Lihat daftar WH platform semua store (filter per platform/store)
- Create binding Process, Stock, atau Return via form Create
- Edit binding Process/Return (update WH sistem)
- Hapus binding individual (detail view)
- Binding massal per store dari form Store (sumber data sama)

### Tidak Bisa

- Bind Process ke WH dengan level > 30 (di bawah rack)
- Hapus dari grid utama (delete hanya di detail binding)
- Bind WH platform tanpa sync warehouse store terlebih dahulu

## 4. Cara Pakai

### 4.1 Bind Warehouse Process

1. Buka **Warehouse Binding** → **Create**
2. Pilih **Type = Process**
3. Pilih WH platform (per store) dan WH sistem proses
4. Save

**Efek sistem (AS-IS):**

- Create/update pivot `type = Process`
- Auto-create Stock binding untuk WH sistem yang sama jika belum ada
- Panggil `WaveController::createTransferWave` — generate transfer internal ke virtual WH wave
- Auto-enable `include_ats` pada WH proses jika belum aktif

### 4.2 Bind Warehouse Stock

1. Create → Type **Stock**
2. Multi-select WH platform + multi-select WH sistem (building level)
3. Save — binding stock lama di store yang tidak dipilih akan dihapus

### 4.3 Bind Warehouse Return

1. Create → Type **Return**
2. WH sistem optional — kosongkan untuk hapus binding return
3. Save — trigger `createTransferWave` jika WH diisi

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| WH platform kosong di grid | Sync warehouse belum jalan | Sync warehouse dari menu Store |
| "Warehouse process level must be under 31" | WH level terlalu dalam | Pilih WH building/process level valid |
| SO tidak masuk wave | WH process belum di-bind | Bind Process untuk store terkait |
| Transfer wave tidak ada | `createTransferWave` belum terpanggil | Re-save Process binding |

## 6. FAQ

**Q: Beda bind dari Store vs Warehouse Binding?**  
A: Sama — keduanya menulis ke `omni_warehouse_binding_pivot`. Warehouse Binding adalah view terpusat lintas store.

**Q: Kenapa Process otomatis buat Stock binding?**  
A: WH proses harus juga terdaftar sebagai sumber stok ATS untuk push inventory platform.
