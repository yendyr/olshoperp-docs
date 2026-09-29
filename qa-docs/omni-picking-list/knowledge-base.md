---
doc_type: knowledge-base
menu: omni-picking-list
menu_name: "Picking List"
version: 1.0
last_updated: 2026-09-29
owner: QA - Yemima
status: review
audience: operator
aliases: [picking list, PL, incomplete so picklist]
---

# Picking List — Knowledge Base

**UI:** `/omni/picking-list` · **Module:** Supply Chain › Processing  
**SoT:** `_meta/sot/omni-picking-list-source-of-truth.md` v1.0

---

## Apa ini?

Daftar **Picking List (PL)** yang sudah digenerate dari Wave / Sales Order, plus layar **process** untuk mulai pick, centang SKU, dan complete.

Bukan tempat **buat PL manual** (itu Manual Picking List). Bukan layar **scan SO** di Omni Picking Process (itu pintu masuk lain ke process yang sama — TO-BE).

---

## Generate PL (yang perlu diketahui ops)

| Situasi | Hasil |
|---------|--------|
| Order beda **warehouse process** | Auto-split: tiap WH process → PL sendiri |
| WH process sama, store beda | Boleh **1 PL** berisi beberapa store |
| 1 SO banyak WH process | 1 SO bisa muncul di **banyak PL** |
| Banyak SO 1 WH process | Banyak SO bisa di **1 PL** |

---

## Datalist — yang bisa dilakukan

- Cari (Global Search), Advanced Filter, Show deleted, Column show/hide, Export
- Pill **Incomplete SO Picklist** — filter POV order yang pick-nya belum lengkap (bukan filter status PL)
- Kolom utama: Trx Code/Date, Trx Ref (SO), SO Total, Store, Building, Assignee, Start/End Picking, Total SKU/Qty, Picking Status, Time Duration, Trx Status, Action

### Status picking (baca cepat)

| Picking Status | Arti | Trx Status |
|----------------|------|------------|
| `-` | Belum Start Picking | Draft |
| In Progress | Sedang pick | Open |
| Paused | Pick dijeda (AS-IS ada) | Open |
| Complete | Sudah Complete | Approved |

Time Duration: `-` sebelum start; saat berjalan `N picked | M unpicked`; setelah complete = durasi start→end.

---

## Process — alur singkat

1. Buka PL dari Action → Start Picking  
2. Pick / Unpick per baris SKU (lokasi inline jika masih unpicked)  
3. Complete → Review Unpicked (jika ada yang belum) → Yay → Completion Summary  

**Incomplete SO Picklist** di process = filter/slideover POV **order**, bukan status dokumen PL.

---

## Manual PL vs menu ini

| | Picking List (ini) | Manual Picking List |
|--|--------------------|---------------------|
| Sidebar | SCM › Processing › Picking List | SCM › Manual Picking List |
| Create form | Tidak (dari Wave/SO) | Ya |
| `process_type` | picking | manual picking |

Detail Manual: [supplychain-manual-picking-list](../supplychain-manual-picking-list/knowledge-base.md).

---

## Known gaps (ops / support)

| Gap | Gejala | Status |
|-----|--------|--------|
| Building di datalist | Bisa tidak cocok WH process order (masih dari default store) | Belum card terpisah — follow-up |
| Multi-store di 1 PL | Belum tooltip list store / export multi | TO-BE |
| UI process | Redesign 5 screen | [ETM-16131](https://erpintegration.atlassian.net/browse/ETM-16131) |
| Pill Incomplete SO | Count bisa kosong | Dilaporkan di ETM-16131 |

---

## Troubleshooting cepat

| Gejala | Cek |
|--------|-----|
| PL tidak muncul | Filter / Show deleted / company / sudah digenerate Wave? |
| Tidak bisa pick lokasi | Baris sudah picked? Location harus same warehouse structure |
| Complete tertahan | Masih ada unpicked — lewat Review Unpicked |
| Bingung Incomplete SO | Itu filter **order**, bukan status PL Complete |
