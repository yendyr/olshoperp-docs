---
doc_type: knowledge-base
menu: omni-checking-list
menu_name: "Checking List"
version: 1.0
last_updated: 2026-09-29
owner: QA - Yemima
status: review
audience: operator
aliases: [checking list, CL, replace defective]
---

# Checking List — Knowledge Base

**UI:** `/omni/checking-list` · **SoT:** `_meta/sot/omni-checking-list-source-of-truth.md` v1.0  
**Improvement UI:** [ETM-16138](https://erpintegration.atlassian.net/browse/ETM-16138)

---

## Apa ini?

Dokumen **checking / QC** setelah barang di-pick. Operator set stasiun checking, centang item, bisa **Replace** barang rusak, lalu Complete menuju packing.

Bukan menu create transfer by scan tersendiri (Transfer Checking / Checking Process entry lain).

---

## Alur singkat

1. Buka CL → jika belum ada location, **Set Location** dulu.  
2. **Check / Uncheck** per baris (seluruh qty baris sekaligus) — hanya info; **tidak** menghalangi Complete.  
3. Barang rusak → **Replace** (modal terpisah): pilih qty + rack pengganti → sistem siapkan TF Scrap + TF Replace.  
4. **Complete & Next** → approve checking; TF Scrap/Replace di-approve otomatis → summary / next / packing.

---

## Replace defective (yang perlu diketahui)

| Dokumen | Arah | Kapan dibuat | Kapan jalan stok |
|---------|------|--------------|------------------|
| TF Scrap/Broken | Outrack → gudang scrap | Saat konfirmasi Replace | Saat Complete CL |
| TF Replace | Rack pengganti → outrack checking | Saat konfirmasi Replace | Saat Complete CL |

- Check ≠ Replace. Replace selalu modal sendiri.  
- Partial replace boleh; beda lokasi sebaiknya baris terpisah.  
- Order cancel/void tapi pilih **Continue to Packing** → TF tetap seperti biasa.  
- Pilih **Void** → **tidak** buat TF Scrap/Replace (stok dianggap masih dari Picking List di outrack).

---

## Cancel / Void di Complete

Hanya jika checking **manual** (bukan dari Skip Wave / Skip Processing). Sistem tanya: lanjut Packing, Void only, atau Void & Recreate SO.

---

## Relasi Instant Settlement

CL belum selesai → order belum lanjut packing/DO/Shipped → upload settlement bisa gagal.

---

## Troubleshooting

| Gejala | Cek |
|--------|-----|
| Diminta set location | Belum ada `location_id` — set station dulu |
| Tidak bisa Replace | CL harus paused (AS-IS); status Open |
| Table tanpa header | Known broken UI — ETM-16138 |
| Settlement gagal | Order belum Shipped karena checking belum complete |
