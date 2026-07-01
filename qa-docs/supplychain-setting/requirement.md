---
doc_type: requirement
menu: supplychain-setting
menu_name: "Warehouse Setting"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# Warehouse Setting — Requirement Documentation

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS) |

## 1. Ringkasan Eksekutif

Halaman konfigurasi tunggal (bukan CRUD master klasik): datalist building level 19 dengan inline edit ke `scm_setting_warehouse_out_racks` dan `scm_setting_warehouse_scrap_voids` via `SettingWarehouseScrapVoidController`.

## 2. How It Works

```mermaid
flowchart TD
    A["PrimeDataTables\nbuilding rows"] --> B{User picks location}
    B --> C["PUT setting-warehouse-scrap-n-void\n/{warehouse_id}"]
    C --> D{Field type}
    D -->|out_rack_picking| E[Upsert SettingWarehouseOutRack]
    D -->|scrap return wip fg failed| F[Upsert SettingWarehouseScrapVoid]
    E --> G[isSmallestChild check]
    F --> G
    G -->|fail| H[Error JSON]
    G -->|ok| I[Success]
```

## 3. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | List buildings level 19 active | index query | Datalist |
| A-02 | Inline update per column | update partial body | PrimeDataTables |
| A-03 | Select2 leaf children only | select2* endpoints | Dropdown |
| A-04 | Smallest child validation | update | Business rule |
| A-05 | Merged audit | audit | Audit slideover |
| A-06 | Helper getWarehouseOutRack | static method | Used by mutations |

## 4. Validasi & Rules

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-01 | Selected WH must be smallest child | update any location field | `You can only select a warehouse without child locations.` |
| V-02 | Select2 scope: descendants of building | select2* | level = `rack_level - 1`, no children |
| V-03 | Index filter: `is_virtual=0`, `status=1`, space type level 19 | index | — |

## 5. Relasi Menu

```mermaid
flowchart LR
    WS["Warehouse Structure\nlevel 19 building"]
    WSET["Warehouse Setting"]
    MUT["Stock Mutations\nVoid Scrap Transfer"]
    WS --> WSET
    WSET --> MUT
```

| Menu | Relasi |
|------|--------|
| Warehouse Structure | Source buildings & leaf racks |
| Transfer Void / Scrap / Picking | Consumes `getWarehouseOutRack` |

## 6. Permission

- Policy: `SettingSCMPolicy` (entity `SettingSCM`)
- Menu id **251** — add/update/delete flags exist but UI is single Form page

## 7. QA Test Notes

- [ ] Each column saves independently
- [ ] Pick parent warehouse → error
- [ ] select2 limited to 20 results
- [ ] Audit shows both out rack and scrap void changes

## 8. Known Gaps

- `store`/`destroy` empty on controller — no create/delete UI.
- Return/WIP/FG use same select2 URL as scrap (`select2-warehouse-scrap`).

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| Warehouse Structure | [../supplychain-warehouse-structure/requirement.md](../supplychain-warehouse-structure/requirement.md) |
