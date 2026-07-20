---
doc_type: knowledge-base
menu: omni-other-discount
menu_name: "Other Discount"
version: 1.2
last_updated: 2026-07-17
owner: QA - Yemima
status: draft
audience: operator
---

# Other Discount — Knowledge Base

## Ringkasan

**Master Other Discount** mendefinisikan jenis **potongan/diskon** dan COA-nya. Struktur dan cara pakainya **sama** dengan [Other Cost](../omni-other-cost/knowledge-base.md). Scope COA juga **sama**: **semua class**, wajib akun **child** (leaf).

**Lokasi menu:** FA → Master → Other Discount  
**Route:** `/omni/other-discount`

## Kapan dipakai?

- Menambah opsi diskon di **Purchase Order**, **Sales Order**, **Invoice** (pembelian & penjualan)
- Menentukan kolom `OD:` di template **Instant Settlement General** (toko tipe **Others**)

## Field penting

| Field | Wajib? | Catatan |
|-------|--------|---------|
| Code | Ya | Unik per company; max 50 karakter; **boleh sama** dengan Code di Other Cost (menu terpisah) |
| Name | Ya | |
| Other Discount COA | Ya | Akun **leaf** aktif — **semua COA class** (TO-BE; AS-IS form/import masih Expense + Other Revenue & Expenses) |
| Active | Ya | Default Yes |
| Applied to Store | Tidak | All Stores atau pilih toko Others aktif |
| Description | Tidak | Max 150 karakter |

## Applied to Store

Identik Other Cost:

- Hanya store tipe **Others** (General), bukan platform (Shopee, TikTok, dll.)
- **All** = semua toko Others aktif (dinamis)
- Kosong = diskon **tidak** muncul di template settlement

## Active vs Inactive

- **Inactive** → tidak muncul di dropdown transaksi **baru**
- Transaksi yang **sudah** punya line diskon (atau warisan PO→PI / SO→SI) → line tetap valid meski master inactive

## Import Excel

- API backend tersedia; tombol UI belum di datalist FE
- Kolom **Applied Store** = **nama store** (bukan kode), dipisah koma, atau `All`
- Kolom **Other Discount COA** = **kode COA**

## FAQ

**Q: Bedanya dengan Other Cost?**  
A: Other Cost = biaya tambahan (menambah nilai). Other Discount = potongan (mengurangi nilai). Scope COA **sama**: semua class, wajib child (leaf).

**Q: Code boleh sama dengan Other Cost?**  
A: **Ya.** Masing-masing menu punya daftar master sendiri.

**Q: Kenapa diskon tidak muncul di template Settlement?**  
A: Cek status Active, Applied to Store (harus All atau mencakup toko yang dipilih), dan pastikan toko tipe Others.

**Q: Import — Applied Store isi apa?**  
A: **Nama store**, sama seperti form manual. Bukan kode store.

**Q: Apakah COA di Purchase Invoice harus sama dengan master?**  
A: **Tidak wajib.** COA di master adalah **default**. Di Purchase Invoice, user boleh override COA per baris Additional Discount sebelum approve — tanpa mengubah master. Lihat [Purchase Invoice §8.3](../accounting-supplier-invoice/requirement.md#83-coa-editable-per-baris-change-req-2026-07).

## Troubleshooting

| Gejala | Kemungkinan penyebab | Tindakan |
|--------|---------------------|----------|
| Tidak bisa save — error COA | COA bukan leaf, inactive, atau bukan milik company | Pilih COA child aktif milik company |
| Diskon tidak di dropdown transaksi | Status Inactive | Aktifkan master atau pakai warisan dari dokumen induk |
| Template settlement tanpa kolom OD | Applied Store tidak mencakup toko / master inactive | Cek konfigurasi Applied to Store & Active |

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Other Cost | [../omni-other-cost/knowledge-base.md](../omni-other-cost/knowledge-base.md) |
