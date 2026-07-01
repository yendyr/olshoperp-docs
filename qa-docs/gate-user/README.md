# User (Gate) — Dokumentasi

Menu **User** — manajemen akun login OlshopERP, termasuk **Role Assignment** (Company + Role per user via `RolePivot`).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, admin | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Route & code

- FE: `/gate/user` → `olshoperp-frontend/src/pages/gate/user/`
- BE: `Modules/Gate/Http/Controllers/UserController.php`
- Role Assignment (sub-fitur): `RolePivot`, endpoint assign di `UserController`

## Sidebar

- Group: **Developer Setting** (parent: Setting)
- `menu_link`: `gate/user`
- Menu privileges: add ✅, update ✅, delete ❌ (list action delete disabled di datalist)
