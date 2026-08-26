---
doc_type: technical
menu: supplychain-colli-type
menu_name: "Colli Type"
version: 1.0
last_updated: 2026-08-14
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Colli Type — Technical Documentation

> **Review** — schema AS-IS 2026-08-14; CRUD API/FE **WIP**. Behavior: [requirement v1.0](./requirement.md).

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-14 | QA - Yemima | Entity ColliType, migration, MultiskuColli consumer; CRUD missing |

---

## 1. File Map

| Layer | Path | Status |
|-------|------|--------|
| Entity | `Modules/SupplyChain/Entities/ColliType.php` — table `scm_colli_types` | Ada |
| Migration type | `Modules/SupplyChain/Database/Migrations/2026_08_12_140135_create_colli_types_table.php` | Ada — `baseColumns` + `name` + `description` |
| Consumer | `Modules/SupplyChain/Entities/MultiskuColli.php` — `scm_multisku_collis.colli_type_id`, `code_identifier = COL` | Ada |
| Migration colli | `…/2026_08_12_140249_create_multisku_collis_table.php` | Ada |
| Controller / Policy / Routes / Menu seeder / FE | — | **Belum** (GAP-CT-02) |
| UI staging (direncanakan) | `/supplychain/colli-type`, create `/supplychain/colli-type/create` | WIP |

Fillable AS-IS: `code`, `status`, `is_all_company`, `owned_by`, audit, `name`, `description`. **Tidak ada** `is_default` (GAP-CT-01). Relasi: `multiskuCollis()`.

---

## 2. Invariants (TO-BE)

1. Max satu `is_default = 1` per company scope (setelah kolom ada).  
2. First Colli Type create → default ON.  
3. Create: Active ON; Show for all company OFF.  
4. Tidak boleh Active OFF / delete jika `multiskuCollis()->exists()`.  
5. Code & name tetap editable setelah used.  
6. Soft delete + Show deleted = *already deleted*.  
7. Select transaksi hanya type Active.

---

## 3. Failure modes

| Mode | Expected |
|------|----------|
| Required / unique code | FormRequest (belum ada) |
| Cannot inactive / cannot delete | Pesan EN [requirement §7](./requirement.md#7-validasi) |
| Race dua default ON | Transaction demote others |

---

## 4. Data lifecycle

Create type → dipakai saat generate Multisku Colli di inbound → type terkunci inactive/delete → code/name masih bisa diubah → audit log setiap perubahan.

---

## 5. Known Issues

[requirement §11](./requirement.md#11-gap-registry) — GAP-CT-01…07.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Purchase Inbound | [../supplychain-new-purchase-inbound/technical.md](../supplychain-new-purchase-inbound/technical.md) |
