---
doc_type: requirement
menu: bill-of-material
menu_name: "Bill of Material"
version: 1.1
last_updated: 2026-07-04
owner: QA - Yemima
status: review
---

# Bill of Material — Requirement Documentation

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Migrated from legacy KB to structured requirement |
| 1.1 | 2026-07-04 | QA - Yemima | Cross-reference Relasi Assembly + Master Unit |

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
| [Master Unit](../supplychain-unit/) | Primary/alternate; unit lock |
| [Assembly](../supplychain-assembly/) | Consumer utama — snapshot BOM saat transaksi dibuat |

---

## Relasi Assembly

**Dampak ke menu ini:** Assembly hanya menampilkan SKU dengan **Header BOM Active**. Saat Assembly **Open**, sistem snapshot komposisi BoM ke `scm_work_order_bill_of_materials`. Saat **Approve**, qty komponen = `bom_qty × assembly_qty` per baris snapshot.

**Prasyarat dari menu ini agar Assembly lolos:**

- Header BOM **Active** + composition rule valid (≥2 detail ATAU qty > 1)
- Semua komponen **stockable** dan **active**
- Nested BOM (sub-assembly): child Header BOM diperlakukan sebagai **1 SKU komponen** — tidak auto-explode; operator Assembly child dulu ([Assembly §8](../supplychain-assembly/requirement.md))

**Independensi:** Edit BoM setelah Assembly Draft → snapshot di-rebuild saat Open. Edit setelah Open → qty snapshot di-update saat Approve (non-retry). Assembly **Approved** tidak terpengaruh edit BoM. Delete BoM diblok jika pernah dipakai Assembly.

**Detail alur:** [Assembly requirement](../supplychain-assembly/requirement.md) — §5 Stock Movement, §8 Nested BOM, §10 Relasi Menu.

---

## Relasi Master Unit

**Dampak ke menu ini:** Kolom **Unit** di Detail BOM hanya dari **primary** atau **alternate unit** produk komponen. Qty detail BOM **integer only** — pecahan via konversi unit di Master Unit (mis. gram vs kg).

**Prasyarat dari menu ini agar Master Unit lock applies:** Unit yang sudah dipakai di baris Detail BOM **tidak boleh dihapus** dari Master Unit maupun di-unassign dari System Product alternate unit.

**Independensi:** Ubah conversion rate di Master Unit setelah unit ter-lock di BOM → **diblok** (`haveRelations()`). Rate NULL di master tetap flexible per produk di alternate unit.

**Detail:** [Master Unit requirement](../supplychain-unit/requirement.md) — §5 Validasi, §10 Relasi.

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
| Assembly | [../supplychain-assembly/requirement.md](../supplychain-assembly/requirement.md) |
| Master Unit | [../supplychain-unit/requirement.md](../supplychain-unit/requirement.md) |
| System Product | [../system-product/requirement.md](../system-product/requirement.md) |
