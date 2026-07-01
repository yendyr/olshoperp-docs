---
doc_type: requirement
menu: bill-of-material
menu_name: "Bill of Material"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: review
---

# Bill of Material — Requirement Documentation

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Migrated from legacy KB to structured requirement |

**UI route:** `/supplychain/bill-of-material`  
**Module:** Supply Chain

---

## 1. Ringkasan

Menu untuk flag SKU sebagai **Header BOM** (barang jadi) dan mendefinisikan **Detail BOM** (komponen). Hanya Header BOM **Active** yang bisa dipakai di transaksi **Assembly**. Hubungan **strict 1:1** — 1 SKU header = max 1 BOM, tanpa versioning.

---

## 2. Acceptance Criteria

| ID | Kriteria |
|----|----------|
| A-01 | User dapat create BOM via **Refer from System Product** atau **Create New** |
| A-02 | Header BOM hanya SINGLE & VARIANT (bukan bundle, bukan random) |
| A-03 | Detail BOM: SINGLE/VARIANT stockable; nested BOM allowed (non-self) |
| A-04 | Composition rule: `count(detail) > 1 OR qty > 1` untuk status Active |
| A-05 | Toggle Active force OFF + warning jika composition rule violated |
| A-06 | Variant header: detail BOM independen per variant |
| A-07 | Delete BOM hanya jika belum dipakai Assembly |
| A-08 | Inactive BOM → SKU tidak muncul di selector Assembly |
| A-09 | Audit log: create, edit detail, toggle active, delete |
| A-10 | Export datalist (.xls) header + detail |

---

## 3. Validasi Header BOM

| ID | Rule | Pesan / behavior |
|----|------|------------------|
| V-01 | Type SINGLE atau VARIANT only | Reject bundle |
| V-02 | Bundle = YES tidak boleh | Cross-validation dari System Product |
| V-03 | Random SKU tidak boleh | Non-stockable |
| V-04 | Strict 1:1 per SKU header | Max 1 BOM record |
| V-05 | SKU code conflict (Create New) | Error notif, BOM tidak save |
| V-06 | Stock-in/out history tidak block | Boleh jadi header asal rules terpenuhi |

---

## 4. Validasi Detail BOM

| ID | Rule | Pesan / behavior |
|----|------|------------------|
| V-07 | SINGLE/VARIANT only, bukan bundle | Stockable requirement |
| V-08 | Random SKU tidak boleh | Virtual SKU |
| V-09 | No self-reference | Header tidak boleh jadi detail dirinya |
| V-10 | Nested BOM allowed | Header BOM lain boleh jadi detail |
| V-11 | Qty integer only | Tidak decimal, tidak zero/negative |
| V-12 | Unit dari primary/alternate product | Lock jika unit dipakai di BOM |

---

## 5. Composition & Active Gate

| Kondisi | Active toggle |
|---------|---------------|
| 1 detail SKU qty = 1 | Force OFF, warning icon |
| ≥2 detail SKU ATAU qty > 1 | Boleh ON (manual) |
| Rule violated mid-edit | Autosave detail OK; Active tetap OFF |

---

## 6. UI Specification

### Datalist

- Advanced filter semua kolom visible
- Export default `.xls` (header + detail)

### Create/Edit

| Mode | Behavior |
|------|----------|
| Refer from System Product | Select SINGLE/VARIANT, bundle=NO |
| Create New | Input SKU + Name; optional Variations toggle |
| Variations OFF | Auto-create SINGLE + flag header |
| Variations ON | Parent + variants + flag per variant; `-random` generated but **not** flagged |

Detail section: autosave per row; hyperlink ke System Product edit.

---

## 7. Dependencies

| Menu | Relasi |
|------|--------|
| [system-product](../system-product/) | Sumber SKU header/detail |
| [random-sku](../random-sku/) | Excluded dari BOM |
| Master Variant | Options saat Create New + Variations |
| Master Unit | Primary/alternate; unit lock |
| Assembly | Consumer utama — snapshot BOM saat transaksi dibuat |

---

## 8. QA Test Notes

| Skenario | Expected |
|----------|----------|
| 1 detail qty 1 | Active OFF, warning |
| Add second detail | Active bisa ON |
| Bundle toggle ON di System Product untuk header BOM | Rejected |
| Edit BOM saat Assembly in-progress | Assembly pakai snapshot lama |
| Delete BOM used in Assembly | Blocked |
| Nested BOM (sub-assembly) | Allowed |

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
