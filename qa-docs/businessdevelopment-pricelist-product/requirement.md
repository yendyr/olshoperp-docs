---
doc_type: requirement
menu: businessdevelopment-pricelist-product
menu_name: "Pricelist Product"
version: 1.2
last_updated: 2026-10-28
owner: QA - Yemima
status: review
---

# Pricelist Product — Requirement

**Modul:** Business Development · **Jira:** [ETM-16314](https://erpintegration.atlassian.net/browse/ETM-16314)  
**Wireframe:** https://claude.ai/artifact/CSgXVMhzsztTJqwpeD7f89 (layar F)  
**E2E final:** [`_meta/sot/variable-price-multi-tier-final-requirement.md`](../_meta/sot/variable-price-multi-tier-final-requirement.md) §2, §5, §7–9  
**Relates:** ETM-16312 · ETM-16313 · **[ETM-16668](https://erpintegration.atlassian.net/browse/ETM-16668)** (auto-recalc dari weight System Product) · **[ETM-16861](https://erpintegration.atlassian.net/browse/ETM-16861)** (Advanced Filter Manual Margin) · **[ETM-16835](https://erpintegration.atlassian.net/browse/ETM-16835)** (Max Value di hitung tier)

---

## 0. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.2 | 2026-10-28 | **TO-BE** [ETM-16861](https://erpintegration.atlassian.net/browse/ETM-16861): Advanced Filter **Manual Margin** Yes/No dropdown; cross-ref Max Value ETM-16835 pada hitung tier |
| 1.1 | 2026-10-21 | **TO-BE** [ETM-16668](https://erpintegration.atlassian.net/browse/ETM-16668): auto-recalc Weight/margin/final saat DnW default System Product berubah; log Pricelist; jangan override manual |
| 0.1 | 2026-10-07 | Draft multi-tier margin + weight |
| 1.0 | 2026-10-09 | Full: Weight column, tier breakdown + override, inline orange override |

---

## 1. Ringkasan

**TO-BE:** `margin = Σ kontribusi tier` Category; `final = default + margin`. Kolom **Weight**; hover margin = **Tier breakdown** (range band + rumus %); edit margin inline → angka **oranye** + audit; Update to Pricelist dari Category menimpa override.

---

## 2. Acceptance Criteria

| ID | Kriteria | Status |
|----|----------|--------|
| A-01 | Setelah Update to Pricelist, SKU contoh 16.000 / 1.500 g → margin 8.500 / final 24.500 | **TO-BE** |
| A-02 | Kolom Weight setelah SKU; header info = primary DnW gram | **TO-BE** |
| A-03 | Weight kosong/0 → warning "No weight" + skip tier by Weight | **TO-BE** |
| A-04 | Hover margin → breakdown per tier + range + default/weight + total | **TO-BE** |
| A-05 | Edit margin: klik angka inline (Enter/Esc); tanpa icon edit/label manual; oranye jika override | **TO-BE** |
| A-06 | Tooltip override: Calculated / Edited by·when / Current | **TO-BE** |
| A-07 | Log edit old→new + flag bukan calculated; Update to Pricelist overwrite + log (user + category) | **TO-BE** |
| A-08 | Ubah weight DnW **default** di System Product → Weight + margin + final Category (by Weight) auto-update; **Log Pricelist** wajib | **TO-BE** [ETM-16668](https://erpintegration.atlassian.net/browse/ETM-16668) |
| A-09 | Ganti radio default DnW → ikut weight default baru + recalc; DnW non-default tanpa ganti default → **tidak** recalc | **TO-BE** ETM-16668 |
| A-10 | Margin / nilai **manual** tidak tertimpa auto-recalc dari weight | **TO-BE** ETM-16668 |
| A-11 | Advanced Filter variable **Manual Margin** (Yes/No dropdown); Equals / Not Equals; scope **Any** category cell manual ([ETM-16861](https://erpintegration.atlassian.net/browse/ETM-16861)) | **TO-BE** |

---

## 3. Formula

```
Margin      = Σ kontribusi tier yang cocok
Final price = Default price + Margin
```

Matching & percentage: final §2.2–2.5. Percentage selalu dari **default price**; **lalu** apply **Max Value** band jika terisi ([ETM-16835](https://erpintegration.atlassian.net/browse/ETM-16835) / VP §4.2.1). Weight null/0 → skip Weight tiers. Urutan tier hanya tampilan.

---

## 4. DataList

Kolom existing tetap (SKU/Name, Bound Stores, Default Price, Latest Sync, harga per store). Angka besar = final; kecil di bawah = margin.

### 4.1 Weight

Setelah SKU. Format `1.500 g`. Info header. Kosong/0: icon oranye + **"No weight"** + tooltip skip Weight tiers.

### 4.2 Tier breakdown (hover margin)

1. Judul Tier breakdown  
2. `Default price … · Weight …`  
3. Per tier: `{type} · {Code}` · range (`Price 10.001 – 20.000` / `Weight … g` / Unlimited) · kontribusi (Percentage: `15% x 12.000 = 1.800`)  
4. Total margin  

| Kondisi | Tampilan |
|---------|----------|
| Tidak ada band cocok | Kontribusi `0` |
| Weight tier, no weight | `skipped` (kuning) + "No primary weight" |

### 4.3 Edit margin

Inline klik → Enter save / Esc cancel. Final ikut. Tidak ubah Category/VP. Override: warna oranye; isi sama calculated → kembali normal. Log: old→new, user, time, flag non-calculated (`is_edited`).

### 4.4 Advanced Filter — Manual Margin (TO-BE · ETM-16861)

| Item | Aturan |
|------|--------|
| Label | **Manual Margin** |
| Value | Dropdown **Yes** \| **No** (bukan free text) |
| Operator | **Equals**, **Not Equals** |
| Sumber | Flag margin manual / override (`is_edited` / oranye) — bukan CSS saja |
| Scope v1 (**Any**) | **Yes** jika **minimal satu** kolom Category pada baris punya margin manual; **No** jika tidak ada margin manual pada baris |

| Operator | Value | Expected |
|----------|-------|----------|
| Equals | Yes | Hanya baris dengan ≥1 margin manual |
| Equals | No | Hanya baris tanpa margin manual |
| Not Equals | Yes | ≡ Equals No |
| Not Equals | No | ≡ Equals Yes |

Edit balik ke nilai calculated → `is_edited = 0` → masuk filter **No**.

---

## 5. Update to Pricelist (dari Category)

Recalc semua baris category; overwrite override → calculated; konfirmasi keras di Category; log Pricelist (user + category sumber). Tidak auto saat master/category berubah.

### 5.1 Auto-recalc dari System Product weight (TO-BE · ETM-16668)

**AS-IS:** ubah weight di System Product → kolom Weight/margin/final di Pricelist **belum** ikut; butuh trigger **Update to Pricelist**.

**TO-BE:** setelah perubahan di System Product → **Dimensions & Weight**:

| Trigger | Recalc Pricelist? |
|---------|-------------------|
| Edit baris DnW yang sedang **default** (sumber primary weight) | **Ya** |
| Ganti radio **default** ke baris DnW lain | **Ya** (pakai weight default baru) |
| Edit baris DnW **non-default** saja | **Tidak** |

**Yang dihitung ulang:** Weight column + margin + final pada kolom Category Price untuk SKU itu, untuk category yang punya perhitungan **by Weight**, memakai **tier Category Price terkini** saat weight berubah.

**Jangan override:** margin/nilai yang diinput **manual** (override oranye / category value manual) tetap.

**Log:** setiap auto-update angka Pricelist **wajib** masuk **Log Pricelist** (history price & margin).

**No weight:** weight 0/kosong → skip tier Weight (existing; UI min 1, tetap untuk TC).

**Category Price:** nilai/preview yang bergantung weight ikut relevan; input manual category tidak tertimpa.

---

## 6. Contoh uji (wajib)

| SKU | Default | Weight | Margin | Final |
|-----|---------|--------|--------|-------|
| SKU-001 | 16.000 | 1.500 g | **8.500** | **24.500** |
| SKU-002 | 22.500 | none | **7.500** | **30.000** |
| SKU-003 | 20.500 | 1.000 g | **9.000** | **29.500** |
| SKU-004 | 12.000 | 3.200 g | **4.800** | **16.800** |
| SKU-005 | 30.000 | 500 g | **10.500** | **40.500** |

Master & band lengkap + kasus batas (boundary inklusif, override, re-Update): final §7.

---

## 7. Gap (ikut final §9)

| ID | Topik | Usulan |
|----|-------|--------|
| GAP-PL-01 | Default price berubah belakangan | Pertahankan AS-IS trial; recalc hanya via Update to Pricelist (bukan scope ETM-16668) |
| GAP-PL-02 | Produk baru / weight belakangan | Hitung dari tier yang datanya ada — **ETM-16668** menutup path weight berubah setelah produk sudah di Pricelist |
| GAP-PL-03 | Konversi satuan weight → gram | Convert sebelum match |
| GAP-PL-04 | N rows besar | Job background + toast start/finish |
| GAP-PL-05 | Auto-recalc weight dari System Product | **TO-BE** [ETM-16668](https://erpintegration.atlassian.net/browse/ETM-16668) — DnW default only; log; preserve manual |
| GAP-PL-06 | Filter Manual Margin di Advanced Filter | **TO-BE** [ETM-16861](https://erpintegration.atlassian.net/browse/ETM-16861) — §4.4 |

---

## Related

[knowledge-base.md](./knowledge-base.md) · [Category Price](../businessdevelopment-category-price/) · [Variable Price](../businessdevelopment-variable-price/)
