# Role (Gate) — Dokumentasi

Menu **Role** — definisi role/peran user. **Role Privilege** (`RoleMenu`) dikonfigurasi dari form edit role per modul menu.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, admin | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Route & code

- FE: `/gate/role` → `olshoperp-frontend/src/pages/gate/role/`
- BE: `Modules/Gate/Http/Controllers/RoleController.php`, `RoleMenuController.php`
- Role Privilege UI: `RolePrivilege.vue` (tab/section di edit role)

## Sidebar

- Group: **Developer Setting**
- `menu_link`: `gate/role`
- Menu privileges: add ✅, update ✅, delete ❌
