# Role (Gate) — Dokumentasi

Menu **Master Role** — definisi role/peran user dan **Role Privilege** (`gate_role_menus`) per modul menu.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, admin | review |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | review |
| Technical | [technical.md](./technical.md) | Developer | review |

**Route UI:** `/gate/role`  
**Maintenance owner:** QA — Yemima  
**PM source:** `master_role_requirement.md` v1.0 (2026-07-04)

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Initial draft from codebase analysis |
| 1.1 | 2026-07-04 | Cross-reference Master User |
| 1.2 | 2026-07-05 | Pending P-02 pointer |
| 2.0 | 2026-07-05 | Full rewrite: PM merge, privilege catalog, gaps §13–§14, logout scope correction |
| 2.1 | 2026-07-05 | Plain language §8/KB; urgent pending §14; dev follow-ups §15 |

## Key notes (v2.1)

- **Satu role per company per user** — bahasa operasional di requirement §8 & KB §3
- **Urgent diskusi PM:** P-R03 (dropdown role), P-R06 (Active OFF), P-R10 (Show for All revert) — baseline valid = codebase saat ini (§13–§14)
- **Dev discussion:** DEV-R01 `is_default`, DEV-R02 `process` — requirement §15 / technical §15
- Logout massal: **Save Role Privilege saja** (verified)

## Related menus

| Menu | Relasi |
|------|--------|
| [Master User](../gate-user/) | Assignment Company+Role; terdampak auto-logout saat privilege save |
| [Sidebar Menu](../sidebar-menu/) | Cache invalidation setelah privilege save |
| [Internal Company](../generalsetting-internal-company/) | Company context per pivot |

## Route & code

- FE: `/gate/role` → `olshoperp-frontend/src/pages/gate/role/`
- BE: `RoleController.php`, `RoleMenuController.php`
- Privilege UI: `RolePrivilege.vue` (tab edit role)

## Sidebar

- Group: **Developer Setting**
- `menu_link`: `gate/role`
- Menu privileges: add ✅, update ✅, delete ❌ (per GateMenuSeeder)
