---
doc_type: knowledge-base
menu: omni-packing-list
menu_name: "Packing List"
version: 1.0
last_updated: 2026-09-29
owner: QA - Yemima
status: review
audience: operator
aliases: [packing list, pack list, shipping handoff]
---

# Packing List — Knowledge Base

**UI:** `/omni/packing-list` · **SoT:** `_meta/sot/omni-packing-list-source-of-truth.md` v1.0  
**Wireframe:** https://claude.ai/artifact/JmsKaAYDVR1F67iGj3SV5X

---

## Apa ini?

Dokumen **packing / kemas** setelah checking. Setelah Complete, order lanjut **Collecting → Delivery Order → gudang 3PL kurir**.

Skip Wave / Skip Processing bisa melewati langkah manual sampai shipped — konfirmasi cancel/void di packing **tidak** muncul untuk sumber itu.

---

## Alur singkat

1. Buka Packing List → **Set Location** jika belum ada.  
2. **Pack / Unpack** per baris (termasuk 1× pack untuk **bundle** header). Pack hanya penanda — **tidak** menghalangi Complete.  
3. Bundle: klik **View items** untuk lihat komponen + peringatan jika bundle berubah.  
4. **Complete & Next** → (TO-BE) kartu handoff shipper + AWB; next Collecting.

---

## Bundle

- Baris = SKU **bundle** (badge Bundle), bukan di-expand komponen di tabel utama.  
- Pack sekali di level bundle.  
- Detail komponen lewat modal View items.

---

## Cancel / Void di Complete (TO-BE, manual saja)

Jika order cancel/void: Continue (lanjut shipping) **atau** Void only / Void & Clone.  
Void (TO-BE): stok dikembalikan ke **OUTRACK** lewat TF internal auto-approved — jangan tertinggal di WH virtual packing.  
*(AS-IS void masih ke WH voided order — sedang diarahkan ulang di improvement.)*

---

## Completion = handoff kurir (TO-BE)

Bukan summary generik: tonjolkan **nama shipper + service + WH 3PL** + **AWB/resi**. Kalau resi belum ada → arahkan Get Resi di Process Summary.

---

## Relasi Instant Settlement

Order macet di packing → belum Collecting/DO/Shipped → settlement bisa gagal V-04.

---

## Troubleshooting

| Gejala | Cek |
|--------|-----|
| Diminta set location | Belum `location_id` |
| Table tanpa header | Known UI broken — handoff/wireframe fix |
| Tidak ada AWB di complete | Cek Process Summary Get Resi |
| Settlement gagal | Packing/collecting/DO belum sampai Shipped |
