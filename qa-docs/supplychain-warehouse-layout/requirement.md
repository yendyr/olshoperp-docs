---
doc_type: requirement
menu: supplychain-warehouse-layout
menu_name: "Warehouse Layout"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# Warehouse Layout — Requirement Documentation

> **DRAFT** — Dokumen ini adalah draft awal hasil analisis codebase otomatis per 2026-06-19. Perlu direview PM/QA sebelum final.

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS) |

## 1. Ringkasan Eksekutif

Import-driven master: upload Excel → validasi (`WhLayoutValidation`) → persist details (`WhLayoutImport`). Update terbatas pada metadata; tidak ada create via POST body tanpa file.

## 2. How It Works

```mermaid
flowchart TD
    A[Upload xlsx] --> B[WarehouseLayoutController@import]
    B --> C[UploadJob - store file]
    C --> D[Create WarehouseLayout header]
    D --> E[WhLayoutValidation]
    E --> F[WhLayoutImport]
    F --> G[Layout details + warehouse_id]
    H[Delete layout] --> I[Delete details + DeleteFileJob]
```

## 3. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | Datalist layouts | index | List |
| A-02 | Import create | POST import | Create |
| A-03 | Update name/description | update | Edit metadata |
| A-04 | Detail datalist per layout | indexDetail | TreeDetail |
| A-05 | Tree view | GET tree | Tree |
| A-06 | Delete + file cleanup | destroy + DeleteFileJob | Delete |
| A-07 | Template download | FE static file | UX |

## 4. Validasi & Rules

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-01 | `name` required max 50 | import/update | Laravel |
| V-02 | `description` nullable max 150 | import/update | Laravel |
| V-03 | `layout` required, xlsx, max upload size | import | Laravel + mimes |
| V-04 | Excel row rules | WhLayoutValidation | Import exception |

## 5. Relasi Menu

| Menu | Relasi |
|------|--------|
| Warehouse Structure | `warehouse_id` pada setiap detail |
| Picking / path helper | `get-path` API (FIFO path — dev utility) |

## 6. Permission

- `WarehouseLayoutPolicy`, menu id **182**

## 7. QA Test Notes

- [ ] Import template valid
- [ ] Import invalid row → rollback transaction
- [ ] Delete removes S3/local file via job
- [ ] Detail grid shows `code_name_formatted`

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
