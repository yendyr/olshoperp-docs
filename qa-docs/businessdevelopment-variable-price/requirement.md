---
doc_type: requirement
menu: businessdevelopment-variable-price
menu_name: "Variable Price"
version: 1.1
last_updated: 2026-10-14
owner: QA - Yemima
status: review
---

# Variable Price — Requirement

**Modul:** Business Development · **Jira:** [ETM-16312](https://erpintegration.atlassian.net/browse/ETM-16312) (RE-OPEN)  
**Wireframe:** https://claude.ai/artifact/CSgXVMhzsztTJqwpeD7f89 (layar A–B)  
**E2E final:** [`_meta/sot/variable-price-multi-tier-final-requirement.md`](../_meta/sot/variable-price-multi-tier-final-requirement.md) §1–3, §6–9  
**Relates:** ETM-16313 (Category) · ETM-16314 (Pricelist)  
**Follow-up:** [ETM-16569](https://erpintegration.atlassian.net/browse/ETM-16569) (batas Percentage ±9.999) · Error: [ETM-16566](https://erpintegration.atlassian.net/browse/ETM-16566) · [ETM-16567](https://erpintegration.atlassian.net/browse/ETM-16567) · [ETM-16568](https://erpintegration.atlassian.net/browse/ETM-16568) · [ETM-16562](https://erpintegration.atlassian.net/browse/ETM-16562) (desimal Percentage) · [ETM-16565](https://erpintegration.atlassian.net/browse/ETM-16565) (Audit Log tier)

---

## 0. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2026-10-07 | Stub dari SoT |
| 1.0 | 2026-10-09 | Full dari final requirement + wireframe; Type lock setelah dipakai Category |
| 1.1 | 2026-10-14 | Sync RE-OPEN ETM-16312 + ETM-16569 (±9.999% Percentage) + finding Type/Update/tooltip (16566–16568); desimal Percentage 4dp (16562); Audit Log tier akurat (16565) |

---

## 1. Ringkasan

Master aturan margin (band) yang reusable. Satu Variable Price = **by Amount** ATAU **by Weight**. Category memasang beberapa master sebagai tier; Pricelist menjumlahkan kontribusi. Perubahan master **tidak** otomatis ke Category/Pricelist — user tekan **Update to Category**.

```
Variable Price ──[Update to Category]──► Category Price ──[Update to Pricelist]──► Pricelist Product
```

Sidebar: Business Development → Price → **Variable Price** (di atas Category Price → Pricelist Product).

---

## 2. Acceptance Criteria

| ID | Kriteria | Status |
|----|----------|--------|
| A-01 | Menu sidebar BD di atas Category Price; create/edit/hapus | **TO-BE** |
| A-02 | Satu master hanya satu type (by Amount \| by Weight) | **TO-BE** |
| A-03 | Band: Percentage/Amount, Value minus, baris Unlimited wajib | **TO-BE** |
| A-04 | Type editable jika unused; setelah dipakai Category → disabled + gembok + tooltip; server reject | **TO-BE** |
| A-05 | Section Used in Category Price read-only (kosong/terisi) + link Open | **TO-BE** |
| A-06 | Datalist: kolom Used in Categories; icon massal Update to Category; disabled jika ada master terpilih unused | **TO-BE** |
| A-07 | Update to Category overwrite snapshot semua category pemakai + konfirmasi + log; Pricelist tidak berubah | **TO-BE** |
| A-08 | Value Type **Percentage** hanya -9.999 … 9.999; ≥10.000 atau ≤-10.000 ditolak UI+server; Type Amount tidak kena batas ini ([ETM-16569](https://erpintegration.atlassian.net/browse/ETM-16569)) | **TO-BE** |
| A-09 | Ubah Type (saat belum dipakai Category) → dialog konfirmasi + band dikosongkan; tanpa konfirmasi / band nyangkut = reject (lihat ETM-16568) | **TO-BE** |
| A-10 | Tombol/icon **Update to Category** (form + massal) **disabled** jika master belum dipakai Category mana pun (ETM-16567) | **TO-BE** |
| A-11 | Tooltip Type (info / lock) muncul saat hover icon (ETM-16566) | **TO-BE** |
| A-12 | Value Percentage desimal tersimpan benar (pemisah desimal); dipotong **4 digit desimal** (bukan dibulatkan ke atas) ([ETM-16562](https://erpintegration.atlassian.net/browse/ETM-16562)) | **TO-BE** |
| A-13 | Audit Log tier: Start/End/Margin default tampil angka/`Unlimited` (bukan `-`); Old Value lengkap saat update baris; UI slideover konsisten ([ETM-16565](https://erpintegration.atlassian.net/browse/ETM-16565)) | **TO-BE** |

---

## 3. DataList

| Kolom | Isi |
|-------|-----|
| Checkbox | Multi-select |
| CODE / Name | Identifier |
| Type | by Amount / by Weight |
| Used in Categories | Count; hover = daftar Code+Name; 0 jika unused |
| Status | Active / Inactive |
| Action | Edit, hapus (pola BD) |

**Update to Category (massal):** icon bar atas + tooltip; nonaktif jika ada terpilih unused — tooltip `"{Code} is not used by any Category Price yet, so there is nothing to update."`

---

## 4. Form Create/Edit

Halaman penuh. Section: Basic Information · Margin Price Configuration · Used in Category Price · Audit Log (default collapsed).  
Sidebar: jump-section · **Update to Category** (Edit only; disabled jika unused) · **Save All**.

### 4.1 Basic Information

| Field | Wajib | Aturan |
|-------|-------|--------|
| Code | Ya | Unik per company `[VERIFY]` |
| Name | Ya | — |
| Type | Ya | by Amount \| by Weight; info tooltip satu type; lock setelah dipakai |
| Active | Ya | Default on |
| Description | Tidak | — |

Ubah Type (unused): **wajib** dialog konfirmasi → band dikosongkan (satuan Rp ↔ g berubah). Putusan: final §9.3 + temuan ETM-16568 (AS-IS bug: ganti Type tanpa konfirmasi, nilai band tetap / Start berubah sendiri — **tidak boleh**).

### 4.2 Margin Price Configuration

Pola sama Category Price AS-IS. by Amount: prefix `Rp.`; by Weight: suffix `g`. Start otomatis; End hanya di baris editable terakhir; Unlimited di akhir terkunci.

| Validasi | Perilaku |
|----------|----------|
| Type kosong | Tolak |
| End ≤ Start (band biasa) | Tolak |
| Tidak ada Unlimited | Tolak |
| Value minus | OK (Amount dan Percentage dalam batas) |
| Value Type **Percentage** di luar -9.999 … 9.999 | Tolak Save/Save All + pesan jelas (baris + batas); server juga reject ([ETM-16569](https://erpintegration.atlassian.net/browse/ETM-16569)) |
| Value Type **Percentage** desimal | Simpan dengan pemisah desimal yang benar; truncate ke **4 dp** (contoh `2,56789` → `2,5678`) ([ETM-16562](https://erpintegration.atlassian.net/browse/ETM-16562)) |
| Value Type **Amount** | Tidak kena batas ±9.999 |
| Code duplikat | Tolak |

Contoh Percentage: `15`, `-5.000`, `9.999`, `-9.999` → OK; `10.000`, `-10.000`, `50.000` → ditolak.

### 4.3 Used in Category Price

Read-only. Empty state + penjelasan attach di Category. Terisi: warning kuning (overwrite termasuk local edits; Pricelist tidak ikut) + tabel Code / Category Name / Status / Last snapshot sync / Open (tab baru) + tombol Update to Category.

### 4.4 Dialog Update to Category

Judul **Update to Category Price?** · daftar category · catatan Pricelist tidak berubah · Cancel / Update · toast sukses.

---

## 5. Aturan hitung (lintas menu — ringkas)

Matching Start–End inklusif → else Unlimited → else 0. Percentage × default price. Weight null/0 → skip tier Weight. Final = default + Σ kontribusi. Detail: final §2 · contoh §7.

---

## 6. Out of scope

Auto-update hilir · migrasi band Category lama · campur Amount+Weight satu master · write-back dari Category/Pricelist ke master.

---

## 7. Gap (ikut final §9)

| ID | Topik | Status |
|----|-------|--------|
| GAP-VP-01 | Type change → band | **Resolved (1.1)** — konfirmasi + kosongkan band |
| GAP-VP-02 | Hapus/Inactive master terpasang | Snapshot tetap; Inactive tidak attach baru; hapus ditolak jika masih dipakai |
| GAP-VP-03 | Inactive Category ikut Update | Ya + tampilkan status |
| GAP-VP-04 | Permission Update | Hak edit menu (kecuali role khusus diminta) |
| GAP-VP-05 | Batas Value Percentage | **Resolved (1.1)** — ±9.999 per ETM-16569; mirror ke edit band lokal Category (konsistensi) |

---

## Related

[knowledge-base.md](./knowledge-base.md) · [technical.md](./technical.md) · [user-guide.md](./user-guide.md) · [Category Price](../businessdevelopment-category-price/) · [Pricelist Product](../businessdevelopment-pricelist-product/)
