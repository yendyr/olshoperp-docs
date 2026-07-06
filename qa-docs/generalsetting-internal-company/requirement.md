---
doc_type: requirement
menu: generalsetting-internal-company
menu_name: "Internal Company"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# Internal Company — Requirement Documentation

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS) |

## 1. Ringkasan Eksekutif

Largest GeneralSetting controller — company master + nested CRUD. Filter `Company::TYPE_INTERNAL`.

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | Index scoped internal + own company | withCompanyScope merge | List |
| A-02 | Super company badge owned_by null | code_name_formatted | List |
| A-03 | Parent column from tree | internal_company_tree | List |
| A-04 | Create code unique max 50 | store validation | Create |
| A-05 | Logo upload max image config | logoUpload | Branding |
| A-06 | Contact/address/document CRUD | nested routes | Tabs |
| A-07 | Address create country+province+city required | contactStore rules | Address |
| A-08 | Document file required on create | file_attachment | Documents |
| A-09 | Audit loads relations | audit method | Audit |

## 3. Validasi & Rules

### Company store/update

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-01 | code required unique max 50 | store/update | Laravel + uniqueCreate/Update |
| V-02 | name required max 50 | store/update | Laravel validation |
| V-03 | gst_number, npwp_number nullable max 50 | store/update | Laravel validation |
| V-04 | logo nullable max upload.size.image | upload | Laravel validation |
| V-05 | description nullable max 150 | store/update | Laravel validation |

### Address store (representative)

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-10 | country_id, province, city required | addressStore | Laravel validation |
| V-11 | street, post_code max 50 | addressStore | Laravel validation |

### Document store

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-20 | title required, dates required, file required | documentStore | Laravel validation |

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | show_deleted query | index | Include trashed ids |
| F-02 | tree endpoint | GET tree/company | Hierarchy JSON |
| F-03 | public data companies | publicDataCompanyList | Cross-company sharing |
| F-04 | getRequired | GET required | FE required field hints |
| F-05 | Create may dispatch ImportCoaDevJob, InitWarehouse | store | Side effects |

## 5. Permission & Dependencies

- Policy: `InternalCompanyPolicy`, `CompanyPolicy`
- Depends: country, region, business-field, currency, accounting COA
- Menu id 117 under Master Company parent

## 6. QA Test Notes

- [ ] Create internal company → verify warehouse/COA exists (staging)
- [ ] Super company label on owned_by null
- [ ] Address cascade from country ID
- [ ] Soft delete company → show_deleted toggle

## 7. Known Gaps / Open Questions

- Full create side-effect chain lengthy — document detailed technical flow in pass 2.
- Contact validation company_id on store — verify FE always sends.

---

## Relasi Master User

**Dampak ke menu ini:** Internal Company **Active** muncul sebagai opsi **Company** di Role Assignment (Master User).

| Aspek | Behaviour |
|-------|-----------|
| Select2 | `UserController@select2company` — `company_type=internal`, `status=1` |
| Assignment | `gate_role_pivots.company_id` → FK company |
| Login context | Default/first pivot menentukan company saat login |
| User Profile | Switch company list = companies dari pivot user |

**Prasyarat:** Company harus **Active** agar bisa di-assign ke user.

**Detail:** [Master User requirement §4–§5](../gate-user/requirement.md) · Pending items: [§14](../gate-user/requirement.md#14-pending-items-registry--harus-segera-di-close).

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| Master User | [../gate-user/requirement.md](../gate-user/requirement.md) |
