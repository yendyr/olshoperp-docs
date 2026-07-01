---
doc_type: requirement
menu: generalsetting-currency
menu_name: "Master Currency"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# Master Currency — Requirement Documentation

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS) |

## 1. Ringkasan Eksekutif

CRUD `gs_currencies` + country pivot; primary currency guarded by config.

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | Datalist with country_formatted | with countries | List |
| A-02 | Primary row no update/delete actions | config currency.primary.id | List |
| A-03 | Create/update with unique code | uniqueCreate/Update | Form |
| A-04 | Max 10 countries per currency | count check | Form |
| A-05 | Delete blocked if relations | haveRelations / cek_relasi | Delete |
| A-06 | Update replaces country pivot | forceDelete + recreate | Update |

## 3. Validasi & Rules

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-01 | code, name, symbol required max 50 | store/update | Laravel validation |
| V-02 | description nullable max 150 | store/update | Laravel validation |
| V-03 | country_id must exist status 1 | store | "Country not found" |
| V-04 | max 10 countries | loop create | "limited to selecting only 10..." |
| V-05 | primary currency modify | update/destroy | 403 "You can't modify/delete primary currency" |
| V-06 | used currency delete | destroy | "You can't delete used currency" |

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | has_relation in show | show API | FE disable edit if true |
| F-02 | select2 active currencies | status = 1 | Dropdowns |

## 5. Permission & Dependencies

- Depends: [generalsetting-country](../generalsetting-country/requirement.md)
- Menu id 9

## 6. QA Test Notes

- [ ] Primary currency row — no delete
- [ ] Currency with company bank — delete hidden/blocked
- [ ] Assign 11 countries — error

## 7. Known Gaps / Open Questions

- `can_update` on model vs controller checks — align QA with FE Form.vue.

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
