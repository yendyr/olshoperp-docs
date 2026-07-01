---
doc_type: requirement
menu: generalsetting-region
menu_name: "Master Region"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# Master Region — Requirement Documentation

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS) |

## 1. Ringkasan Eksekutif

CRUD `gs_regions` + API cascade select2 untuk alamat company.

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | CRUD region | store/update/destroy | Master |
| A-02 | Code unique | uniqueCreate/Update | Create/Edit |
| A-03 | select2Province by country | phone_code prefix | Address forms |
| A-04 | select2Region by type | code_length filter | Cascade |
| A-05 | showRegion resolves hierarchy | explode code | Display |

## 3. Validasi & Rules

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-01 | code required max 50 unique | store/update | Laravel + helper |
| V-02 | name required max 150 | store/update | Laravel validation |
| V-03 | description max 150 | store/update | Laravel validation |
| V-04 | Invalid regions type | select2Region bad type | "Invalid regions" |
| V-05 | Invalid Country | select2Province | "Invalid Country" |

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | Province filter | code like phone_code.% | First level only |
| F-02 | _inject param | select2Region | Pre-select deleted/inactive row |

## 5. Permission & Dependencies

- Depends: [generalsetting-country](../generalsetting-country/requirement.md)
- Menu id 116 — add/update/delete enabled

## 6. QA Test Notes

- [ ] Create province + city under country ID
- [ ] Company address form cascade end-to-end

## 7. Known Gaps / Open Questions

- Region table tidak store country_id langsung — hierarchy purely via code string.

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
