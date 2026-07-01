# Global Audit Log (Gate) — Dokumentasi

Menu **Global Audit Log** — tampilan read-only seluruh jejak audit sistem (`audits` table) lintas modul.

| Dokumen | File | Audience | Status |
|---------|------|----------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | Operator, admin | draft |
| Requirement | [requirement.md](./requirement.md) | PM, QA, Dev | draft |
| Technical | [technical.md](./technical.md) | Developer | draft |

**Maintenance owner:** QA — Yemima

## Route & code

- FE: `/gate/global-audit-log` → `olshoperp-frontend/src/pages/gate/GlobalAuditLog/`
- BE: `Modules/Gate/Http/Controllers/GlobalAuditLogController.php`

## Sidebar

- Group: **Developer Setting**
- `menu_link`: `gate/global-audit-log`
- Menu privileges: add ❌, update ❌, delete ❌ (read-only)
