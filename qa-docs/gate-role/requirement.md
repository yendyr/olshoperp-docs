---
doc_type: requirement
menu: gate-role
menu_name: "Role (Gate)"
version: 2.1
last_updated: 2026-07-05
owner: QA - Yemima
status: review
---

# Master Role — Requirement Documentation

**Modul:** General Settings → Developer Setting  
**Audience:** PM, Operations, QA, Support, Developer  
**Status:** AS-IS verified against codebase per 2026-07-05

**UI route:** `/gate/role`  
**API base:** `{VITE_API_URL}gate/role` · privilege `{VITE_API_URL}gate/role-menu`  
**Tables:** `gate_roles` · `gate_role_menus` · `gate_menus` · pivot `gate_role_pivots`

**PM source:** `master_role_requirement.md` v1.0 (2026-07-04)

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS) |
| 1.1 | 2026-07-04 | QA - Yemima | Cross-reference Master User |
| 1.2 | 2026-07-05 | QA - Yemima | Pending P-02 pointer |
| 2.0 | 2026-07-05 | QA - Yemima | Full rewrite: merge PM requirement, privilege matrix, gaps §13–§14 |
| 2.1 | 2026-07-05 | QA - Yemima | Plain-language §8; urgent pending §14; dev follow-ups §15; verified logout scope |

---

## 1. Ringkasan Eksekutif

**Master Role** mendefinisikan bundle permission (modul → menu → level akses) yang di-assign ke user via [Master User](../gate-user/requirement.md) (Section Role Assignment), per kombinasi **user + company**.

| Kebutuhan Bisnis | Bagaimana Master Role Menjawab |
|------------------|-------------------------------|
| Kontrol akses menu | `gate_role_menus`: view/add/update/delete/print/approval per `menu_id` |
| Konfigurasi per modul | Tab **Role Privilege** — sidebar module + matrix checkbox |
| Refresh permission | Simpan privilege → mass logout user dengan role tersebut |
| Role shared antar company | Toggle **Show for All Company** (`is_all_company`) |
| Audit perubahan | Tab **Audit Log** pada role header |

> **Logout saat ubah role:** User hanya otomatis logout massal saat Anda **Save** di tab **Role Privilege**. Mengubah nama, deskripsi, atau toggle Active lalu klik **Update** **tidak** logout user — ini **perilaku resmi sistem saat ini** (sudah disepakati).

---

## 2. Datalist — Kolom & Fitur

### 2.1 Kolom (AS-IS)

| Kolom | Visible default (FE) | Backend / note |
|-------|----------------------|----------------|
| ROLE NAME | ✅ true | `role_name` — satu-satunya kolom eksplisit di `DataLists.vue` |
| Active | ✅ (default column) | `status` via `datalist()` / DataTablesV3 |
| Created By \| Created At | ✅ (default column) | `creator` relation |
| Action | ✅ | Edit, Delete (soft) |
| is_default | ❌ tidak di FE | Kolom BE `renderBoolean($row->is_default)` — tidak dipass ke FE columns |
| is_in_flight_role | ❌ tidak di FE | Kolom BE — khusus Flight Operations |
| ID | ❌ | Tidak ada kolom ID di FE (PM §2 menyebut hidden — AS-IS: absent) |
| Data Owner | ❌ | `owned_by` tidak ditampilkan di datalist FE |

### 2.2 Column Show/Hide

- `filter_column=true` pada `DataLists.vue` ✅
- Preferensi kolom per user via DataTablesV3

### 2.3 Show Deleted

- `:is_show_deleted="true"` + toggle show deleted ✅

### 2.4 Advanced Filter & Export

| Fitur | AS-IS |
|-------|-------|
| Advanced Filter | Tidak ada filter khusus di FE (hanya search per kolom DataTables) |
| Export | Export standar DataTablesV3 (Basic) — kolom visible + default backend |

---

## 3. Create / Edit — Field & Button

### 3.1 Field (AS-IS)

| Field | Wajib? | Validasi BE | Default | Keterangan |
|-------|--------|-------------|---------|------------|
| Role Name | **Required** | `required\|string\|max:50` | — | Placeholder: "e.g: Administrator" |
| Description | Opsional | `nullable\|max:150` | empty | Textarea |
| Active | — | `status` string `'true'`/`'false'` | **ON** | Toggle |
| Show for All Company | — | `is_all_company` string `'true'`/`'false'` | **OFF** | Hanya tampil jika `own_data=true` (role milik company login atau super) |

**Field BE tanpa UI Vue (`Form.vue`):**

| Field BE | Keterangan |
|----------|------------|
| `is_default` | Hanya via API; validasi: default role wajib show-for-all (super company). **Tidak ada toggle di FE** |
| `is_in_flight_role` | Diupdate via `update_flightoperations` — modul Flight Operations terpisah |

**Public/private semantics (AS-IS):**

- Visibility antar company primarily via `is_all_company=1` (`canSelect` attribute di `MainModel`)
- `owned_by` di-set observer ke `company_id` creator jika null — **bukan** otomatis null saat Show for All Company ON
- `RoleMenuController` block edit memakai `owned_by == null` (system-provided role), terpisah dari `is_all_company`

### 3.2 Button (AS-IS)

| Button | Mode | Behavior |
|--------|------|----------|
| **Back To Datalist** | create/edit | Router ke `/gate/role` tanpa save |
| **Save & Review** | create only | POST → redirect `/gate/role/edit/{id}` (buka tab Role Privilege) |
| **Save** | create only | POST → redirect `/gate/role` (datalist) |
| **Update** | edit | PUT header fields — **stay di halaman**, tidak logout user |

### 3.3 Tab (edit mode only)

| Tab | Kapan | Isi |
|-----|-------|-----|
| Role | Selalu | Form header |
| Role Privilege | `is_edit=true` | `RolePrivilege.vue` |
| Audit Log | `is_edit=true` | `GET gate/role/{id}/audit` |

Query `?module={snake_group}` auto-buka tab Role Privilege (module pre-selected).

---

## 4. Section Role Privilege — Konsep & Struktur

### 4.1 Kapan tersedia

- Tab **Role Privilege** hanya setelah role punya ID (mode edit).
- Create via **Save & Review** → redirect edit → user langsung konfigurasi privilege ✅ (PM §4.1)

### 4.2 Layout UI (AS-IS)

```
+---------------------------+------------------------------------------+
| MODULE LIST (sidebar)     | ACCESS PRIVILEGE TABLE                   |
| snake_case → Title Case   | Menu | View | Add | Update | Del | Print |
| e.g. supply_chain_...     |        | Approval Lv.1..N (if supported) |
+---------------------------+------------------------------------------+
| Warning box: logout users | Check All | Save                         |
+---------------------------+------------------------------------------+
```

- Module list: `GET gate/role-menu/module` → distinct `gate_menus.group` → `Str::snake()`
- Per module: `GET gate/role-menu/role/{roleId}/{group}` → hierarchical menu rows
- Save: `POST gate/role-menu` — **replace all** `gate_role_menus` untuk menu dalam module tersebut

### 4.3 Tombol

| Tombol | Behavior |
|--------|----------|
| **Check All / Uncheck All** | Toggle semua checkbox `id` contains `"index"` di DOM, lalu cascade enabled sub-checkboxes |
| **Save** | POST payload per module aktif; loading state 1s |

### 4.4 Scope menu (company non-super)

Company dengan `company_id >= 3`: menu yang bisa di-privilege **subset** dari privilege **Master User** company tersebut (`is_master_user=1`). Super company (`company_id < 3` atau null): full `gate_menus` per group.

### 4.5 System role protection

Role dengan `owned_by = null` tidak bisa diubah privilege-nya oleh company non-bypass:

> "You Can't Modify this Role, Because this Role Provided by Your System Administrator for Your Company"

---

## 5. Access Level per Menu

### 5.1 Tipe access (AS-IS)

| Access | UI | Sumber capability | Catatan |
|--------|-----|-------------------|---------|
| **View** | Checkbox selalu | `view_menu` / `index[]` | Wajib ON agar kolom lain muncul |
| **Add** | Conditional | `gate_menus.add == 1` | Hidden/disabled jika menu tidak support |
| **Update** | Conditional | `gate_menus.update == 1` | |
| **Delete** | Conditional | `gate_menus.delete == 1` | |
| **Print** | Conditional | `gate_menus.print == 1` | |
| **Approval** | Lv.1 … Lv.N | `gate_menus.approval >= 1` | N = nilai integer kolom `approval` menu |
| **Process** | ❌ tidak di UI | `gate_menus.process` | Disimpan BE sebagai JSON; selalu `json_encode(0)` dari FE saat ini |

Enforcement runtime: `MainPolicy` + cache keys `gate-update`, `gate-approve` per `menu_class` + `role_id`.

### 5.2 Approval multi-level (AS-IS)

- Bukan fixed 2-level — **dinamis 1..N** berdasarkan `gate_menus.approval`
- Disimpan di `gate_role_menus.approval` sebagai **JSON object** level → `1` (checked)
- Contoh menu `approval => 2` di seeders (Human Resources):
  - Employee Payroll
  - Propose Leave
  - Propose Overtime
- Sequential vs parallel workflow: **enforcement di controller approval masing-masing menu** — belum didokumentasikan per-menu (Pending P-R02)

### 5.3 Daftar Module (AS-IS — dari menu seeders)

Module sidebar Role Privilege (API snake_case → label UI):

| API key (snake) | Label (`gate_menus.group`) |
|-----------------|----------------------------|
| `business_development` | Business Development |
| `developer_setting` | Developer Setting |
| `finance_and_accounting` | Finance and Accounting |
| `flight_operations` | Flight Operations |
| `general_setting` | General Setting |
| `human_resources` | Human Resources |
| `omni_channel` | Omni Channel |
| `p_p_c` | P P C |
| `procurement` | Procurement |
| `quality_assurance` | Quality Assurance |
| `supply_chain_management` | Supply Chain Management |

> Daftar menu per module **living data** — sumber canonical: `Modules/Gate/Database/Seeders/ModuleMenu/*.php` + DB production. Detail teknis: [technical.md §9](./technical.md#9-role-privilege-catalog).

---

## 6. Section Audit Log

| Aspek | AS-IS |
|-------|-------|
| Endpoint | `GET gate/role/{role}/audit` |
| Loader | `auditDatatable($role->load('roleMenu'))` |
| Role header changes | ✅ Tercatat via model audit (`Role` uses auditing) |
| RoleMenu (privilege checkbox) | ✅ `RoleMenu` model `$auditEvents = created, updated, deleted` |
| Kolom | Pola standar AuditLogTables (Date, Source, Old/New Value, Action, User) |

Privilege save = batch delete + recreate `RoleMenu` rows → audit **created/deleted** events per row.

---

## 7. Validasi yang Berjalan (AS-IS)

| # | Validasi | Kondisi | Behavior |
|---|----------|---------|----------|
| V-01 | Role Name | Kosong / >50 char | 422 validation error |
| V-02 | Description | >150 char | 422 validation error |
| V-03 | Default role | `is_default` tanpa show-for-all (super) | Error JSON: "Default Role Only Applicable when Show for All Company Also ON" |
| V-04 | Delete role | `role_pivot` exists | **Ditolak** — "Cannot delete role, role already use in user" |
| V-05 | Active OFF | Role masih dipakai user | **Diizinkan** — tidak ada scan user aktif |
| V-06 | Show for All → OFF | Sudah dipakai company lain | **Tidak diblok** di BE update (gap vs PM §7 #6) |
| V-07 | Privilege save | User login dengan role ini | Mass logout via `expires_at = now()` |
| V-08 | Header update | User login dengan role ini | **Tidak** logout (gap vs PM §7 #5) |
| V-09 | Privilege POST | `index` array required | Minimal satu menu View dicentang per save module |
| V-10 | System role edit | `owned_by null` + non-bypass company | Error modify message |

---

## 8. Relasi dengan Master User

Role **tidak** langsung ditempel ke user dari menu Role. Assignment dilakukan di menu **[Master User](../gate-user/requirement.md)** → tab edit user → **Role Assignment**.

### 8.1 Satu user — satu role per company

Artinya: **di satu company, user hanya punya satu role**. Tidak bisa punya dua role sekaligus di company yang sama.

| Situasi | Apa yang terjadi |
|---------|------------------|
| User belum pernah di-assign di Company A | Sistem **buat** assignment baru (company + role) |
| User sudah punah assignment di Company A, lalu di-assign lagi dengan role lain | Sistem **ganti** role lama — **bukan** menambah baris kedua |
| User di Company A dan Company B | **Boleh** — role di A dan B bisa berbeda (dua assignment terpisah) |

**Contoh:** Budi di PT Alpha = Admin, di PT Beta = Staff. Assign ulang Budi di PT Alpha menjadi Manager → Budi tetap **satu** role di PT Alpha (kini Manager).

> Detail teknis assignment: [gate-user requirement §5](../gate-user/requirement.md#5-multi-company--default-company)

### 8.2 Perilaku lain (sistem saat ini)

| Topik | Perilaku resmi (codebase) |
|-------|---------------------------|
| Dropdown Role di form assign user | Menampilkan **semua** role aktif — belum difilter public/private → lihat **§14 urgent P-R03** |
| Ubah privilege role | Semua user dengan role tersebut logout otomatis |
| Ubah nama/status role (tab Role) | User **tidak** logout otomatis |
| Hapus role | Ditolak jika masih ada user yang memakai role itu |

**Cross-ref:** [gate-user requirement §14](../gate-user/requirement.md#14-pending-items-registry-pm-15)

---

## 9. Acceptance Criteria

### Verified (AS-IS)

- [x] Role Name required max 50; Description opsional max 150
- [x] Active default ON; Show for All Company default OFF (jika toggle visible)
- [x] Save & Review → stay edit; Save → redirect datalist; Back To Datalist
- [x] Role Privilege tab setelah create (via Save & Review)
- [x] Sidebar module clickable; matrix checkbox per menu
- [x] Check All shortcut per module
- [x] Approval multi-level (1..N) untuk menu dengan `gate_menus.approval > 0`
- [x] Delete blocked jika role masih di-assign user
- [x] Column show/hide + show deleted
- [x] Audit log role + role menu events

### Partial / menunggu keputusan PM (§14)

- [ ] Filter dropdown Role saat assign user (public/private)
- [ ] Blokir matikan **Show for All Company** jika role dipakai company lain
- [ ] Aturan **Active OFF** saat role masih dipakai user

---

## 10. Confirmed Design Decisions

| ID | Keputusan | Status |
|----|-----------|--------|
| D-R01 | Logout massal **hanya** saat Save Role Privilege — bukan saat Update tab Role | 🟢 Verified |
| D-R02 | Privilege disimpan per module (save satu module tidak menghapus module lain) | 🟢 Verified |
| D-R03 | Company tenant hanya bisa set privilege menu yang dimiliki Master User company-nya | 🟢 Verified |
| D-R04 | Level Approval mengikuti menu (Lv.1, Lv.2, …) — saat ini banyak dipakai modul HRIS | 🟢 Verified |
| D-R05 | **Show for All Company** menentukan role bisa dipakai company lain | 🟢 Verified (perilaku saat ini) |

---

## 11. Related Menus

| Menu | Relasi |
|------|--------|
| [Master User](../gate-user/) | Consumer assignment; terdampak logout |
| [Sidebar Menu](../sidebar-menu/) | Menu build cache invalidation |
| [Internal Company](../generalsetting-internal-company/) | Company context pivot |

---

## 12. QA Notes

1. Regression privilege: setelah save module A, cek module B tidak ter-reset (save scoped per module).
2. Test logout: user A login dengan role X → admin save privilege role X → user A request API → 403/expired token.
3. Test non-super subset: login company tenant → privilege list ⊆ master user role menus.
4. Test system role (`owned_by null`): tenant tidak bisa save privilege.
5. Cross-test dengan Master User P-02 (role dropdown scope).

---

## 13. Perilaku Sistem Saat Ini (Baseline Valid)

> Mendeskripsikan **cara sistem bekerja hari ini**. Sampai ada update product/engineering, QA dan operator mengacu pada baseline ini.

### G-R02 — Show for All Company bisa dimatikan kapan saja

| | |
|---|---|
| **Ekspektasi PM** | Tidak boleh kembali Private jika role sudah dipakai company lain |
| **Sistem saat ini** | Toggle bisa OFF tanpa cek apakah masih ada user di company lain yang memakai role ini |
| **Dampak** | Role bisa “ditutup” padahal assignment user di company lain masih ada |
| **Diskusi** | 🔴 Urgent — §14 P-R10 |

### G-R03 — Role bisa dinonaktifkan meski masih dipakai user

| | |
|---|---|
| **Ekspektasi PM** | Perlu keputusan: boleh atau tidak Active OFF saat masih assigned |
| **Sistem saat ini** | Toggle **Active OFF diizinkan**; user yang sudah punya role ini tidak otomatis logout |
| **Dampak** | Role tidak muncul di dropdown assign baru; user lama bisa tetap login dengan role tersebut |
| **Diskusi** | 🔴 Urgent — §14 P-R06 |

### G-R04 — Dua cara menandai role “public”

| | |
|---|---|
| **Sistem saat ini** | Form pakai toggle **Show for All Company**. Field pemilik data (`owned_by`) terpisah untuk role system |
| **Dampak** | Saat troubleshooting, pastikan cek kedua flag — detail di [technical.md](./technical.md) |

### G-R06 — Beberapa kolom backend tidak tampil di layar

| | |
|---|---|
| **Sistem saat ini** | Layar Role menampilkan Role Name + kolom standar; info teknis tambahan ada di backend saja |
| **Dampak** | Bukan gangguan operasional harian |

### G-R08 — Dropdown Role di Master User menampilkan semua role aktif

| | |
|---|---|
| **Sistem saat ini** | Saat assign user, **semua** role aktif di sistem muncul di dropdown |
| **Dampak** | Admin company bisa melihat role milik company lain |
| **Diskusi** | 🔴 Urgent — §14 P-R03 |

---

## 14. Pending Items — Urgent (Diskusi PM / Product)

> **Baseline valid:** selama belum diimplementasi, acu §13. Setelah keputusan PM → update doc + QA.

| ID | Prioritas | Topik | Perilaku sistem saat ini (valid) | Yang perlu diputuskan PM |
|----|-----------|-------|----------------------------------|--------------------------|
| **P-R03** | 🔴 Urgent | Filter dropdown Role di Master User | Semua role aktif muncul | Matrix public vs private — siapa boleh assign role apa? |
| **P-R06** | 🔴 Urgent | Nonaktifkan role (Active OFF) | Boleh OFF meski masih assigned | Block + error, atau allow + efek samping? |
| **P-R10** | 🔴 Urgent | Matikan Show for All Company | Boleh OFF tanpa cek company lain | Block jika masih dipakai company lain? |

### P-R03 — Dropdown Role (shared gate-user P-02)

**Operasional:** Daftar role saat assign user belum dibatasi per company / public-private.

**Valid untuk QA sekarang:** API `select2Role` hanya filter role **aktif**.

**Close:** PM matrix → engineering filter → regression dengan [gate-user P-02](../gate-user/requirement.md#p-02--role-publicprivate-di-role-assignment-pm-15-2).

### P-R06 — Active OFF saat masih dipakai

**Operasional:** Admin bisa mematikan role meski user masih memakainya.

**Valid untuk QA sekarang:** Tidak ada penolakan; user lama tidak auto-logout; assign baru tidak bisa pilih role inactive.

### P-R10 — Revert Show for All Company

**Operasional:** Role shared bisa ditutup kembali tanpa peringatan.

**Valid untuk QA sekarang:** Toggle OFF selalu lolos.

### Pending non-urgent

| ID | Status | Item |
|----|--------|------|
| P-R01 | 🟡 Doc-QA | Katalog menu = living data (seeders) |
| P-R02 | 🔴 Open | Alur approval Lv.1 vs Lv.2 per menu (HRIS+) |
| P-R04 | 🟢 Verified | Satu role per company per user |
| P-R05 | 🟢 Verified | Hapus role ditolak jika masih assigned |
| P-R07 | 🟢 Verified | Audit log role + privilege |
| P-R08 | 🟢 Verified | Column show/hide + export |

---

## 15. Dev Team — Technical Follow-ups

> Temuan teknis untuk diskusi engineering — **bukan** urgent PM. **Belum** dianggap defect production sampai dev konfirmasi.

### DEV-R01 — Flag default role (`is_default`) tanpa UI

| | |
|---|---|
| **Temuan** | Backend punya flag “role default” (hanya satu di seluruh sistem). **Tidak ada** toggle di form Role |
| **Bug atau bukan?** | **Belum pasti** — kemungkinan fitur admin/API-only atau legacy. Tidak ditemukan kode lain yang memakai flag ini saat login/assign |
| **Opsi dev** | Expose UI + rule bisnis · deprecate field · konfirmasi unused → cleanup |
| **Files** | `RoleController.php` · `Form.vue` |

### DEV-R02 — Akses “Process” tanpa UI & tanpa policy

| | |
|---|---|
| **Temuan** | Database mendukung privilege **Process** (mirip Add/Update). UI Role Privilege **tidak** menampilkan checkbox. Save dari UI selalu simpan process = kosong |
| **Bug atau bukan?** | **Belum pasti** — kemungkinan implementasi belum selesai / legacy. Banyak menu HRIS di seeder punya flag process, tapi tidak ada pengecekan di authorization policy |
| **Opsi dev** | Implement UI + policy · konfirmasi dead code → hapus · dokumentasikan sengaja tidak dipakai |
| **Files** | `RoleMenuController.php` · `RolePrivilege.vue` · HR menu seeders |

Detail: [technical.md §15](./technical.md#15-dev-team--technical-follow-ups)

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| Master User | [../gate-user/requirement.md](../gate-user/requirement.md) |
| Sidebar Menu | [../sidebar-menu/technical.md](../sidebar-menu/technical.md) |
