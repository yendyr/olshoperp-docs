---
doc_type: requirement
menu: businessdevelopment-pricelist-product
menu_name: "Pricelist Product"
version: 1.6
last_updated: 2026-11-05
owner: QA - Yemima
status: review
---

# Pricelist Product — Requirement

**Modul:** Business Development · **Jira:** [ETM-16314](https://erpintegration.atlassian.net/browse/ETM-16314)  
**Wireframe:** https://claude.ai/artifact/CSgXVMhzsztTJqwpeD7f89 (layar F)  
**E2E final:** [`_meta/sot/variable-price-multi-tier-final-requirement.md`](../_meta/sot/variable-price-multi-tier-final-requirement.md) §2, §5, §7–9  
**Relates:** ETM-16312 · ETM-16313 · **[ETM-16668](https://erpintegration.atlassian.net/browse/ETM-16668)** (auto-recalc weight) · **[ETM-16861](https://erpintegration.atlassian.net/browse/ETM-16861)** (filter Manual Margin) · **[ETM-16835](https://erpintegration.atlassian.net/browse/ETM-16835)** (Max Value) · **[ETM-16882](https://erpintegration.atlassian.net/browse/ETM-16882)** (Applied Store Others di Category) · **[ETM-16883](https://erpintegration.atlassian.net/browse/ETM-16883)** (User Set Margin + tooltips) · **[ETM-16884](https://erpintegration.atlassian.net/browse/ETM-16884)** (calc Others/NULL + Sync + stack Manual Price) · **[ETM-17002](https://erpintegration.atlassian.net/browse/ETM-17002)** (optimasi Update to Pricelist) · **[ETM-17071](https://erpintegration.atlassian.net/browse/ETM-17071)** (kolom Images) · **[ETM-17072](https://erpintegration.atlassian.net/browse/ETM-17072)** (default Aktif + Show archived data)

---

## 0. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.6 | 2026-11-05 | **TO-BE** ETM-17002: cross-ref optimasi Update to Pricelist (lewati baris tidak berubah, satu log, Last Update level category, Sync 0 baris). Rumus Manual ETM-16884 tidak berubah |
| 1.5 | 2026-11-05 | **TO-BE** ETM-17071: kolom Images paling kiri (UI & logic sama System Product) |
| 1.4 | 2026-11-05 | **TO-BE** ETM-17072: default hanya produk Aktif + switch Show archived data (sama dengan menu Product) |
| 1.3 | 2026-10-28 | **TO-BE** ETM-16883/16884: User Set Margin (`-` non-manual), tooltip input/header/calc, Sync hanya category ber-platform, Update to Pricelist **stack** Manual Price (bukan overwrite); calc tetap untuk Applied Store Others/NULL |
| 1.2 | 2026-10-28 | **TO-BE** ETM-16861 Manual Margin filter; cross-ref Max Value ETM-16835 |
| 1.1 | 2026-10-21 | **TO-BE** ETM-16668 auto-recalc weight; preserve manual |
| 0.1 | 2026-10-07 | Draft multi-tier margin + weight |
| 1.0 | 2026-10-09 | Full: Weight column, tier breakdown + override, inline orange override |

---

## 1. Ringkasan

**TO-BE:** Category tier → kontribusi margin; **Final Price** = Default Price + komponen margin (lihat §3).  
Cell bawah = **User Set Margin**: hanya angka jika **Manual Price** (edit user); selain itu **`-`**. Orange = penanda edited-by-user.  
**Update to Pricelist:** row Manual Price → **jangan** timpa User Set Margin; Final = Default + User Set Margin + Category tier.  
**Sync** (row + header + Sync All): hanya jika Applied Store category mengandung ≥1 store **platform**.  
Calc Final tetap untuk Applied Store **NULL** / **Others** (ETM-16884).

---

## 2. Acceptance Criteria

| ID | Kriteria | Status |
|----|----------|--------|
| A-01 | Setelah Update to Pricelist, SKU contoh 16.000 / 1.500 g → Final 24.500; detail margin di tooltip; cell User Set Margin `-` jika non-manual | **TO-BE** |
| A-02 | Kolom Weight setelah SKU; header info = primary DnW gram | **TO-BE** |
| A-03 | Weight kosong/0 → warning "No weight" + skip tier by Weight | **TO-BE** |
| A-04 | Hover User Set Margin / breakdown → komponen calc readable (default, tiers, final; + manual/stack bila ada) | **TO-BE** ETM-16883 |
| A-05 | Edit Final atau User Set Margin = Manual Price; label **User Set Margin**; orange hanya jika edited | **TO-BE** ETM-16883 |
| A-06 | Hover input: Final = `Click to edit Final Price`; bawah = `Click to edit User Set Margin` | **TO-BE** ETM-16883 |
| A-07 | Non-manual: cell User Set Margin = `-`; tooltip calc tetap lengkap. Log edit; Update to Pricelist **tidak** overwrite User Set Margin pada Manual Price | **TO-BE** ETM-16883/16884 |
| A-08 | Ubah weight DnW **default** → Weight + final (by Weight) auto-update; **Log Pricelist**; Manual Price tidak tertimpa | **TO-BE** ETM-16668 |
| A-09 | Ganti radio default DnW → recalc; DnW non-default tanpa ganti default → tidak recalc | **TO-BE** ETM-16668 |
| A-10 | Margin / nilai **manual** tidak tertimpa auto-recalc dari weight | **TO-BE** ETM-16668 |
| A-11 | Advanced Filter **Manual Margin** Yes/No (Any category cell) | **TO-BE** ETM-16861 |
| A-12 | Kosongkan/hapus input margin = **reset** Manual Price → cell `-`, Final ikut Category tier | **TO-BE** ETM-16883 |
| A-13 | Header kolom category: tooltip summary tier + **Last Update to Pricelist** = waktu Update terakhir yang selesai, termasuk bila 0 baris harga berubah (penanda level category, bukan hanya log per baris) | **TO-BE** ETM-16883 + ETM-17002 |
| A-14 | Applied Store Others/NULL: Final tetap terhitung; Sync row+header hide; Sync All hanya category ber-platform | **TO-BE** ETM-16884 |
| A-15 | Update to Pricelist + Manual Price: Final = Default + User Set Margin + Category tier; cell margin tetap nilai user | **TO-BE** ETM-16884 |
| A-16 | Datalist default hanya SKU status **Aktif**. Switch **Show archived data** di toolbar: ON = SKU **Non Aktif** ikut tampil; OFF lagi = disembunyikan. Perilaku sama dengan menu Product | **TO-BE** ETM-17072 |
| A-17 | Kolom **Images** paling kiri (sebelum Product/SKU): thumbnail 100×100 dari `getImageProduct()`; kosong → `-` di box 100×100; non-orderable / non-searchable; UI & logic sama System Product | **TO-BE** ETM-17071 |

---

## 3. Formula

```
Category_tier_margin = Σ kontribusi tier yang cocok (Max Value setelah % × default bila ada)

Non-manual:
  Final = Default Price + Category_tier_margin
  Cell User Set Margin = "-"

Manual Price (is_edited):
  Final = Default Price + User_Set_Margin + Category_tier_margin
  Cell User Set Margin = User_Set_Margin (murni input user, orange)
```

Matching & percentage: final §2.2–2.5. Percentage dari **default price**; lalu **Max Value** band ([ETM-16835](https://erpintegration.atlassian.net/browse/ETM-16835)). Weight null/0 → skip Weight tiers.

**Contoh stack (ETM-16884):** Default 10.000; User Set Margin +2.000; setelah Update to Pricelist Category tier +1.500 → Final **13.500**; cell tetap **2.000** orange.

---

## 4. DataList

Kolom existing tetap (SKU/Name, Bound Stores, Default Price, Latest Sync, harga per store). Angka besar = **Final Price**; kecil di bawah = **User Set Margin**.

### 4.0 Images (TO-BE · ETM-17071)

| Item | Aturan |
|------|--------|
| Posisi | Paling kiri — sebelum kolom Product/SKU |
| Sumber | `$product->getImageProduct()` (sama System Product) |
| Single / Parent | Gambar primary produk |
| Variant | Gambar variant; jika kosong → fallback primary parent |
| UI | Box **100×100**, `object-cover`, `p-2`, `rounded-md` |
| Kosong | Box 100×100 berisi `-` di tengah |
| Sort / search | `orderable: false`, `searchable: false` |

### 4.1 Weight

Setelah SKU. Format `1.500 g`. Info header. Kosong/0: icon oranye + **"No weight"** + tooltip skip Weight tiers.

### 4.2 User Set Margin & tooltips (TO-BE · ETM-16883)

| Item | Aturan |
|------|--------|
| Label | **User Set Margin** |
| Non-manual | Cell tampil **`-`** (bukan angka auto dari Update to Pricelist) |
| Manual | Angka murni user; warna **orange** saja sebagai penanda |
| Hover Final | `Click to edit Final Price` |
| Hover User Set Margin | `Click to edit User Set Margin` |
| Definisi Manual Price | Edit via Final **atau** User Set Margin → `is_edited` |
| Reset | Hapus/kosongkan input margin → keluar Manual Price; Final = Category tier; cell `-` |

**Tooltip calculation (readable):**

Non-manual:

```
Calculation
• Default Price ………… …
• Category tiers ……… +…
    – [tier lines]
• Final Price …………… …
```

Manual (+ setelah Update category):

```
Calculation
• Default Price ……………… …
• User Set Margin (manual) … +…
• Category tier (update) …… +…
    – [tier lines]
• Final Price ………………… …
• Last Update to Pricelist … dd MMM yyyy, HH:mm
```

### 4.3 Header kolom category (TO-BE · ETM-16883)

Hover header: summary tier Category + label jelas **Last Update to Pricelist:** waktu Update to Pricelist terakhir yang selesai untuk category itu, **termasuk bila tidak ada harga yang berubah**. Bukan sekadar waktu ubah master, dan bukan hanya log per baris (baris yang dilewati tidak menulis log). Sumber yang benar: penanda level category. Saat ini tooltip masih membaca log per baris — [GAP-CP-08](../businessdevelopment-category-price/requirement.md).

### 4.4 Sync (TO-BE · ETM-16884)

| Kondisi Applied Store category | Icon Sync row + header | Sync All |
|--------------------------------|------------------------|----------|
| NULL / Others saja | Hide | Tidak mencakup |
| ≥1 platform (termasuk mix + Others) | Show* | Ya* |

\*Eksekusi sync tetap syarat existing (produk bound ke platform). Calc Final tetap muncul untuk Others/NULL.

Update tanpa perubahan harga **tidak** menaikkan waktu ubah baris, jadi Sync tidak memilih baris itu (0 baris). Aturan platform-only di tabel di atas tidak berubah. Detail: [Category §3.4](../businessdevelopment-category-price/requirement.md).

### 4.5 Advanced Filter — Manual Margin (TO-BE · ETM-16861)

| Item | Aturan |
|------|--------|
| Label | **Manual Margin** |
| Value | Dropdown **Yes** \| **No** |
| Operator | Equals, Not Equals |
| Sumber | `is_edited` / orange — Manual Price |
| Scope v1 (**Any**) | Yes jika ≥1 category cell manual pada baris |

Reset / clear margin → `is_edited = 0` → filter **No**.

### 4.6 Filter Aktif / Non Aktif (TO-BE · ETM-17072)

Datalist Pricelist memakai switch yang sama dengan menu Product.

| Item | Aturan |
|------|--------|
| Default | Hanya produk/SKU status **Aktif** |
| Switch | **Show archived data** di toolbar datalist |
| ON | SKU **Non Aktif** ikut tampil bersama Aktif |
| OFF lagi | SKU Non Aktif disembunyikan; daftar kembali hanya Aktif |
| Bukan | Mengubah status produk; hanya filter tampilan daftar |

---

## 5. Update to Pricelist (dari Category)

Recalc baris category; konfirmasi keras di Category; log Pricelist (user + category sumber). Tidak auto saat master/category berubah (kecuali path ETM-16668).

| Row state | Perilaku |
|-----------|----------|
| Non-manual | Final dari Category tier; cell User Set Margin tetap `-`; `is_edited` false |
| Manual Price | **Jangan** timpa User Set Margin; Final = Default + User Set Margin + Category tier; orange tetap; tooltip tampilkan komponen terpisah |

Dialog Category harus mencerminkan: manual override **tidak** dihapus; Final dapat berubah karena tier ditambahkan ke margin user (ETM-16884).

**TO-BE ETM-17002** (rumah aturan: [Category §3.4](../businessdevelopment-category-price/requirement.md)):

- Baris yang margin, Final, flag Manual, dan snapshot-nya sama tidak ditulis ulang: tidak ada log, waktu ubah tidak berubah.
- Harga sama tetapi snapshot beda: hanya penunjuk snapshot yang diganti, tanpa log dan tanpa menaikkan waktu ubah.
- Harga berubah: tepat 1 log **updated** / update_to_pricelist.
- Baris baru: tepat 1 log **created** / update_to_pricelist (nilai lama 0). Tidak ada log manual palsu. Edit grid tetap log tipe **manual** supaya tooltip "Margin edited by" tetap benar.
- Baris ganda: simpan yang Manual (atau yang pertama); sisanya hilang + 1 log **deleted** / duplicate.
- Tooltip header **Last Update to Pricelist** wajib maju ke waktu Update yang selesai meski 0 baris berubah (A-13, GAP-CP-08).
- Poin 8 (jangan simpan baris turunan) **bukan** perilaku sekarang.

**Contoh:** HCD-1 Manual No, Default 30.000, tier +5.500 → Final **35.500**, cell `-`. HAWAT-Biru Manual Yes, Default 7.000, margin 2.000, tier naik ke +6.500 → cell tetap **2.000**, Final **15.500**, tepat 1 log updated. Update ulang tanpa ubah tier/Default → 0 log baru per baris; Sync 0 baris; tooltip Last Update tetap harus jam yang baru.

### 5.1 Auto-recalc dari System Product weight (TO-BE · ETM-16668)

| Trigger | Recalc Pricelist? |
|---------|-------------------|
| Edit baris DnW yang sedang **default** | **Ya** |
| Ganti radio **default** ke baris DnW lain | **Ya** |
| Edit baris DnW **non-default** saja | **Tidak** |

**Yang dihitung ulang:** Weight + Final (by Weight) memakai tier Category terkini.  
**Jangan override:** Manual Price (User Set Margin) tetap; Final mengikuti formula Manual di §3 bila applicable.  
**Log:** wajib **Log Pricelist**.

---

## 6. Contoh uji (wajib)

| SKU | Default | Weight | Category tier (tooltip) | Cell User Set Margin | Final |
|-----|---------|--------|-------------------------|----------------------|-------|
| SKU-001 | 16.000 | 1.500 g | 8.500 | `-` (non-manual) | **24.500** |
| SKU-002 | 22.500 | none | 7.500 | `-` | **30.000** |
| Manual contoh | 10.000 | — | +1.500 setelah Update | **2.000** orange | **13.500** |
| HAWAT-Biru | 7.000 | — | tier naik ke +6.500 | **2.000** orange | **15.500** |
| HCD-1 | 30.000 | — | +5.500 | `-` | **35.500** |

Master & band lengkap: final §7.

---

## 7. Gap

| ID | Topik | Usulan |
|----|-------|--------|
| GAP-PL-01 | Default price berubah belakangan | Recalc via Update to Pricelist (bukan scope ETM-16668) |
| GAP-PL-02 | Produk baru / weight belakangan | ETM-16668 menutup path weight berubah |
| GAP-PL-03 | Konversi satuan weight → gram | Convert sebelum match |
| GAP-PL-04 | N rows besar | Job background + toast |
| GAP-PL-05 | Auto-recalc weight | **TO-BE** ETM-16668 |
| GAP-PL-06 | Filter Manual Margin | **TO-BE** ETM-16861 |
| GAP-PL-07 | User Set Margin UI + tooltips | **TO-BE** ETM-16883 |
| GAP-PL-08 | Sync platform-only + stack Manual on Update | **TO-BE** ETM-16884 |
| GAP-PL-09 | Others → Unit Price SO by store header | Future (out of scope 16884) |
| GAP-PL-10 | Kolom Images di datalist | **TO-BE** ETM-17071 (BE `image_formatted` sudah ada; FE wire kolom) |
| GAP-PL-11 | Default Aktif + Show archived | **TO-BE** ETM-17072 |
| GAP-PL-12 | Last Update saat 0 baris berubah | Ikut [GAP-CP-08](../businessdevelopment-category-price/requirement.md): tooltip header masih dari log per baris |

---

## Related

[knowledge-base.md](./knowledge-base.md) · [Category Price](../businessdevelopment-category-price/) · [Variable Price](../businessdevelopment-variable-price/)
