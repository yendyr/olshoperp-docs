---
doc_type: requirement
menu: gate-role
menu_name: "Role (Gate)"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# Role (Gate) — Requirement Documentation

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS) |

## 1. Ringkasan Eksekutif

Role CRUD + **RoleMenu** privilege matrix per modul sidebar group. Super company (token company_id < 3) dapat role global (`owned_by = null`).

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | Datalist role dengan is_default, is_in_flight | index | List |
| A-02 | Create role name required max 50 | store | Create |
| A-03 | Default role unik sistem-wide | is_default reset others | Create/Update |
| A-04 | Delete blocked jika role_pivot exists | destroy | Delete |
| A-05 | Role privilege save per module | RoleMenuController store | Privilege |
| A-06 | Module list dari menu groups | GET role-menu/module | Privilege UI |
| A-07 | Privilege datatable per role+group | GET role-menu/role/{role}/{group} | Privilege UI |
| A-08 | Audit role & role menu | audit endpoints | Audit |

## 3. Validasi & Rules

### Role CRUD

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-01 | role_name required max 50 | store/update | Laravel validation |
| V-02 | description nullable max 150 | store/update | Laravel validation |
| V-03 | Default role requires show_for_all_company | company_id < 3 | "Default Role Only Applicable when Show for All Company Also ON" |
| V-04 | Cannot delete if role_pivot exists | destroy | "Cannot delete role, role already use in user" |

### RoleMenu store

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-10 | role, index[], module required | Save privilege | Laravel validation |
| V-11 | Cannot modify system role without bypass | owned_by null | "You Can't Modify this Role..." |
| V-12 | Non-super company: menu subset master user role | index query | AS-IS filter |

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | owned_by logic | create | null if show_for_all; else company_id |
| F-02 | Menu hierarchy in privilege table | buildMenuHierarchy | Parent-child order |
| F-03 | Approval columns dynamic | menu.approval count | Lv.1..N checkboxes |
| F-04 | select2Role active only | status = 1 | Dropdown |

## 5. Permission & Dependencies

- `RolePolicy`, `RoleMenuPolicy` → MainPolicy
- Menu seeder: `gate/role` (id 2); RoleMenu entity commented as separate sidebar menu
- Depends: `gate_menus`, `gate_role_menus`, user assignments

## 6. QA Test Notes

- [ ] Create role + assign privilege satu modul → user dengan role bisa akses menu
- [ ] Hapus privilege view → menu hilang dari sidebar user (after cache)
- [ ] Coba delete role yang dipakai → error
- [ ] Default role: set on role A → role B is_default = 0

## 7. Known Gaps / Open Questions

- Menu sidebar "Role Privilege" di seeder di-comment — confirm UX final.
- `RoleController@show` authorize signature uses Role::class not instance — verify policy behavior.

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| User assignment | [../gate-user/requirement.md](../gate-user/requirement.md) |
