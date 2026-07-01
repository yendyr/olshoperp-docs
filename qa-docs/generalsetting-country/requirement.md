---
doc_type: requirement
menu: generalsetting-country
menu_name: "Master Country"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# Master Country — Requirement Documentation

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS) |

## 1. Ringkasan Eksekutif

Standard master CRUD untuk `gs_countries` via `CountryController`.

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | Datalist countries | index | List |
| A-02 | CRUD with validation | store/update/destroy | Form |
| A-03 | Select2 active only | status = 1 | Dropdown |
| A-04 | Audit per record | GET audit | Audit |
| A-05 | Soft delete sets deleted_by | destroy | Delete |

## 3. Validasi & Rules

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-01 | iso, iso_3, name required max 50 | store/update | Laravel validation |
| V-02 | phone_code required numeric max_digits 50 | store/update | Laravel validation |
| V-03 | nice_name nullable max 50 | store/update | Laravel validation |
| V-04 | num_code nullable numeric | store/update | Laravel validation |
| V-05 | description nullable max 150 | store/update | Laravel validation |
| V-06 | status, is_all_company boolean string 'true' | toggles | Cast 0/1 |

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | select2 by nice_name search name | q param | Max 25 results |
| F-02 | show withTrashed | show | Include soft deleted |

## 5. Permission & Dependencies

- Policy: `CountryPolicy` (GeneralSetting)
- Menu: add/update/delete = 1 (GeneralSettingMenuSeeder id 6)

## 6. QA Test Notes

- [ ] Create Indonesia-like row with phone_code → region province select works
- [ ] Deactivate → hilang dari select2

## 7. Known Gaps / Open Questions

- Unique constraint ISO di DB vs validation — verify migration unique indexes.

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| Region | [../generalsetting-region/requirement.md](../generalsetting-region/requirement.md) |
