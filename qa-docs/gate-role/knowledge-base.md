---
doc_type: knowledge-base
menu: gate-role
menu_name: "Role (Gate)"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Role (Gate) — Knowledge Base

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 1. Apa itu menu Role?

Menu **Role** mendefinisikan peran (role name) yang menentukan **privilege menu** — view, add, update, delete, print, approval level — via entitas **RoleMenu**. User tidak langsung dapat privilege; privilege role di-assign ke user per company (lihat [gate-user](../gate-user/knowledge-base.md)).

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **Role** | Record `gate_roles` — nama role |
| **Role Privilege / RoleMenu** | Mapping role ↔ menu + granular CRUD/approval |
| **Default Role** | Hanya satu role `is_default = 1` (global reset saat set) |
| **Show for All Company** | Role `owned_by = null` — disediakan system admin |
| **In-Flight Role** | Flag khusus modul flight operations |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Buat/edit role (nama, deskripsi, status, all company)
- Atur **Role Privilege** per modul menu (checkbox view/add/update/delete/print/approval)
- Hapus role jika belum dipakai user (no role_pivot)
- Audit log role dan role menu

### Tidak Bisa
- Set **Default Role** tanpa **Show for All Company** (company_id < 3)
- Hapus role yang masih dipakai assignment user
- Edit privilege role system (`owned_by = null`) jika company bukan bypass — error dari `RoleMenuController`

## 4. Cara Pakai (How-To)

### Buat role baru
1. **Setting → Role** → Create.
2. Isi Role Name (max 50), Description (opsional).
3. Toggle Status, All Company; super-admin bisa Show for All Company + Default Role.
4. Save.

### Atur privilege menu
1. Edit role → buka **Role Privilege** (`RolePrivilege.vue`).
2. Pilih modul (group) dari dropdown — load menu tree modul tersebut.
3. Centang **View** per menu; expand untuk Add/Update/Delete/Print/Approval level.
4. Save — POST ke `gate/role-menu` dengan payload `index`, `add`, `update`, dll.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Menu modul kosong | Company non-super: hanya menu master user | Login master user atau super admin |
| "Can't Modify this Role" | Role owned_by null | Hubungi system admin / bypass company |
| Delete role gagal | Masih ada user assignment | Hapus/reassign user dulu |

## 6. FAQ

**Q: Di mana Role Privilege di sidebar?**
A: Tidak ada menu terpisah (seeder Role Privilege di-comment). Diakses dari form edit Role.

**Q: Apa yang terjadi saat centang View menu?**
A: Membuat/update `RoleMenu` untuk menu_id; unchecked menu di modul yang sama di-soft-delete batch.
