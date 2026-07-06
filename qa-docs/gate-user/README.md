# User (Gate) — Dokumentasi

Menu **Master User** — manajemen akun login OlshopERP + **Role Assignment** (Company + Role per user).

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, admin | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |

**Route UI:** `/gate/user`  
**Maintenance owner:** QA — Yemima

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Initial draft from codebase analysis |
| 2.0 | 2026-07-04 | Full rewrite: PM requirement merge, role assignment, multi-device, auto-logout, gap analysis |
| 2.1 | 2026-07-05 | §13 Known Gaps AS-IS detail + §14 Pending Items Registry (PM §15) |

## Related menus

- [Master Role](../gate-role/) — opsi role + privilege; perubahan trigger auto-logout user
- [Internal Company](../generalsetting-internal-company/) — opsi company di Role Assignment
- HR Employee — link user ↔ karyawan (`is_employee`, Assigned Employee column)

## Route & code

- FE: `/gate/user` → `olshoperp-frontend/src/pages/gate/user/`
- BE: `Modules/Gate/Http/Controllers/UserController.php`
- Role Assignment: `RolePivot`, `POST gate/user/{id}/assign`

## Sidebar

- Group: **Developer Setting** (parent: Setting)
- `menu_link`: `gate/user`
- Menu privileges: add ✅, update ✅, delete ❌ (datalist delete user disabled)
