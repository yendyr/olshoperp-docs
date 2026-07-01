---
doc_type: requirement
menu: gate-user
menu_name: "User (Gate)"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# User (Gate) — Requirement Documentation

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS) |

## 1. Ringkasan Eksekutif

Menu User mengelola identitas login dan **Role Assignment** multi-company. Validasi backend di `UserController`; authorization via `UserPolicy` (extends `MainPolicy` + role menu).

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | Datalist user scoped company | `User::withCompanyScope()` | Index |
| A-02 | Create user dengan field wajib | Form validation store | Create |
| A-03 | Update user dengan unique username/email | Rule::unique ignore id | Edit |
| A-04 | Password update optional; jika diisi min 8 + confirmed | update validation | Edit |
| A-05 | Role assignment create/update pivot | storeUserRoleCompany | Role Assignment |
| A-06 | Hapus assignment non-default | destroyAssignUser | Role Assignment |
| A-07 | Self-service profile | updateProfile hanya user sendiri | Profile |
| A-08 | Bulk status update | bulkUpdate ids + status | Datalist |
| A-09 | Audit log per user | GET audit | Audit |
| A-10 | Delete user dari list disabled | render_delete: false | Datalist |

## 3. Validasi & Rules

### Create (`store`)

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-01 | username required, alpha_dash, max 50, unique gate_users | Save create | Laravel validation |
| V-02 | first_name, last_name required max 50 | Save create | Laravel validation |
| V-03 | email required, email:rfc,dns, unique max 50 | Save create | Laravel validation |
| V-04 | password required max 50 | Save create | Laravel validation |
| V-05 | confirm_password required, min 8, same:password | Save create | Laravel validation |
| V-06 | image nullable, max config upload.size.image | Upload | Laravel validation |
| V-07 | description nullable max 150 | Save create | Laravel validation |

### Update (`update`)

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-10 | username/email unique ignore current user | Save edit | Laravel validation |
| V-11 | password nullable min 8 confirmed | Ganti password | Laravel validation |
| V-12 | Master user can't change own role | is_master_user self + role change | "Master User Can't Change Role for Itself" |
| V-13 | Satu master user per company (company_id > 2) | Set master | "Assigned Company Already has Master User" |

### Role Assignment (`storeUserRoleCompany`)

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-20 | role_id, company_id required | Save assign | Laravel validation |
| V-21 | company internal + status 1 | Save assign | 404 / fail |
| V-22 | role status 1 | Save assign | 404 / fail |
| V-23 | Cannot edit own assignment | user.id == auth id | "Cannot edit your own role data" |
| V-24 | Revoke all tokens after assign | Post save | User re-login |

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | Datalist columns | Load page | full name, email verified, employee, last active, created by |
| F-02 | Toggles boolean | Request 'true'/'false' string | Cast ke 0/1 |
| F-03 | Email verified toggle | true on create | email_verified_at = now |
| F-04 | Default company logic | Assign | Satu pivot is_default_company; auto-set jika none |
| F-05 | Select2 user/company/role | Dropdown | Filter status active |

## 5. Permission & Dependencies

- Policy: `UserPolicy` → `MainPolicy` (view/add/update/delete dari role menu `gate/user`)
- Role Assignment menu entity: `RolePivot` (sidebar hidden, privileges add/update/delete)
- Depends: `gs_companies` (internal), `gate_roles`, HR `Employee` (optional link)

## 6. QA Test Notes

- [ ] Create user + login dengan kredensial baru
- [ ] Assign 2 company, set default, login ulang cek company context
- [ ] Coba assign role ke diri sendiri → expect error
- [ ] Bulk deactivate → user tidak bisa login
- [ ] Super company (company_id < 3): toggle master user editable

## 7. Known Gaps / Open Questions

- Delete user dari UI list sengaja disabled — apakah requirement TO-BE perlu soft-delete dari datalist?
- Validasi password create: `password` max 50 tapi `confirm_password` min 8 — inkonsistensi minor di rules.

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| Role (privilege target) | [../gate-role/requirement.md](../gate-role/requirement.md) |
