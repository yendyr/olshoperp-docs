---
doc_type: knowledge-base
menu: gate-user
menu_name: "User (Gate)"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# User (Gate) — Knowledge Base

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 1. Apa itu menu User?

Menu **User** mengelola akun yang bisa login ke OlshopERP. Setiap user punya kredensial (username, email, password) dan bisa di-assign ke **beberapa kombinasi Company + Role** lewat **Role Assignment** (`RolePivot`).

Login API memakai Sanctum Bearer token; company/role aktif saat login ditentukan oleh assignment default atau pilihan saat login.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| **User** | Akun `gate_users` — identitas login |
| **Role Assignment** | Baris `gate_role_pivots`: user ↔ internal company ↔ role |
| **Master User** | User utama per company; hanya satu per company (company_id > 2) |
| **Default Company** | Assignment yang dipakai otomatis saat login (`is_default_company`) |
| **All Company** | Flag user bisa akses lintas company (super-admin context) |
| **Multi Device** | Izinkan login simultan di beberapa perangkat |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Buat user baru (username, nama, email, password, toggles status/master/employee)
- Edit profil user (admin) atau profile sendiri (`/gate/user/profile/:id`)
- Bulk update status user terpilih
- Assign / ubah role per internal company
- Set default company pada assignment
- Hapus assignment (kecuali default company — delete disabled)
- Lihat audit log per user
- Upload foto profil

### Tidak Bisa
- Hapus user dari datalist (action delete disabled di `UserController@index`)
- Edit role assignment **diri sendiri**
- Ubah role master user untuk dirinya sendiri (non-bypass company)
- Assign ke company non-internal atau role inactive

## 4. Cara Pakai (How-To)

### Buat user baru
1. Buka **Setting → User** → Create.
2. Isi username (alpha_dash, unik), first/last name, email, password + konfirmasi (min 8).
3. Atur toggle: Status, Master User, Employee, Email Verified, Multi Device, All Company.
4. Save → lanjut **Role Assignment** di detail user.

### Assign role ke company
1. Edit user → tab/section **Role Assignment**.
2. Pilih **Internal Company** + **Role** (keduanya harus status aktif).
3. Opsional: centang **Default Company**.
4. Save — semua token user di-revoke (harus login ulang).

### Bulk nonaktifkan user
1. Centang baris di datalist → Bulk Update Status.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| User tidak muncul di list | Company scope / bukan internal context | Login sebagai admin company yang benar |
| "Assigned Company Already has Master User" | Sudah ada master user di company | Nonaktifkan master lama atau jangan set master |
| "Cannot edit your own role data" | Self-assign | Minta admin lain assign |
| Login gagal setelah assign | Token di-force delete | Login ulang |
| Employee name `-` | Belum link ke HR employee | Link via HR module jika perlu |

## 6. FAQ

**Q: Apa beda User dan Employee?**
A: User = akun login. Employee = data HR. Flag `is_employee` menandai user terkait karyawan; kolom employee name dari relasi `employee_detail_user`.

**Q: Kenapa delete user tidak ada di list?**
A: AS-IS: `renderAction(..., render_delete: false)` — delete hanya via API/policy jika diizinkan role menu.
