---
doc_type: requirement
menu: gate-global-audit-log
menu_name: "Global Audit Log"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# Global Audit Log — Requirement Documentation

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS) |

## 1. Ringkasan Eksekutif

Read-only global view atas tabel `audits` via `AuditHandlerTrait::auditDatatableAll()`. Menu privileges all zero di seeder.

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | Hanya viewAny authorized | GlobalAuditLogPolicy | Index |
| A-02 | Datalist all audits | auditDatatableAll | List |
| A-03 | Custom SearchBuilder filters | formattedQuery | Filter |
| A-04 | No store/update/destroy | Empty controller methods | — |
| A-05 | Menu add/update/delete = 0 | GateMenuSeeder id 253 | Permission |

## 3. Validasi & Rules

Tidak ada form input — hanya query filters.

| ID | Rule | Trigger | Notes |
|----|------|---------|-------|
| V-01 | viewAny policy | GET index | MainPolicy |
| V-02 | Date filter BETWEEN/BEFORE/AFTER | SearchBuilder | Carbon parse |
| V-03 | Event filter supports status yes/no in JSON | event column | Special case |

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | user_formatted filter | Search | gate_users or hr_employees name |
| F-02 | trx_code_formatted | Search | Exists audit_codes |
| F-03 | old/new value JSON search | SearchBuilder logic | Subquery on JSON columns |

## 5. Permission & Dependencies

- Entity: `Modules/Gate/Entities/GlobalAuditLog` (virtual/policy model)
- Policy: `GlobalAuditLogPolicy`
- Trait: `App\Traits\AuditHandlerTrait`

## 6. QA Test Notes

- [ ] User tanpa privilege view → 403
- [ ] Filter tanggal range → hasil sesuai
- [ ] Verify tidak ada tombol create/edit/delete di FE

## 7. Known Gaps / Open Questions

- Resource routes register full REST — store/update/destroy stub; confirm tidak exposed di FE.

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
