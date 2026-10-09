---
doc_type: requirement
menu: businessdevelopment-variable-price
menu_name: "Variable Price"
version: 1.0
last_updated: 2026-10-09
owner: QA - Yemima
status: review
---

# Variable Price — Requirement

**Modul:** Business Development · **Jira:** [ETM-16312](https://erpintegration.atlassian.net/browse/ETM-16312)  
**Wireframe:** https://claude.ai/artifact/CSgXVMhzsztTJqwpeD7f89 (layar A–B)  
**E2E final:** [`_meta/sot/variable-price-multi-tier-final-requirement.md`](../_meta/sot/variable-price-multi-tier-final-requirement.md) §1–3, §6–9  
**Relates:** ETM-16313 (Category) · ETM-16314 (Pricelist)

---

## 0. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2026-10-07 | Stub dari SoT |
| 1.0 | 2026-10-09 | Full dari final requirement + wireframe; Type lock setelah dipakai Category |

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

Ubah Type (unused): satuan band berubah — **usulan:** kosongkan band + konfirmasi (GAP final §9.3).

### 4.2 Margin Price Configuration

Pola sama Category Price AS-IS. by Amount: prefix `Rp.`; by Weight: suffix `g`. Start otomatis; End hanya di baris editable terakhir; Unlimited di akhir terkunci.

| Validasi | Perilaku |
|----------|----------|
| Type kosong | Tolak |
| End ≤ Start (band biasa) | Tolak |
| Tidak ada Unlimited | Tolak |
| Value minus | OK |
| Code duplikat | Tolak |

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

| ID | Topik | Usulan |
|----|-------|--------|
| GAP-VP-01 | Type change → band | Kosongkan + konfirmasi |
| GAP-VP-02 | Hapus/Inactive master terpasang | Snapshot tetap; Inactive tidak attach baru; hapus ditolak jika masih dipakai |
| GAP-VP-03 | Inactive Category ikut Update | Ya + tampilkan status |
| GAP-VP-04 | Permission Update | Hak edit menu (kecuali role khusus diminta) |

---

## Related

[knowledge-base.md](./knowledge-base.md) · [technical.md](./technical.md) · [user-guide.md](./user-guide.md) · [Category Price](../businessdevelopment-category-price/) · [Pricelist Product](../businessdevelopment-pricelist-product/)
