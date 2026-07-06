---
doc_type: knowledge-base
menu: gate-user
menu_name: "User (Gate)"
version: 2.1
last_updated: 2026-07-05
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, glossary, workflow, ui-buttons, role-assignment, troubleshooting, faq]
---

# Master User — Knowledge Base

## Apa itu Master User?

**Master User** (menu **User**) mengelola akun yang bisa login ke OlshopERP — username, email, password, dan **assignment akses** ke company + role.

| Item | Nilai |
|------|-------|
| Menu | Developer Setting → Setting → **User** |
| Route UI | `/gate/user` |
| API | `gate/user` |

Satu user bisa akses **beberapa company** dengan **role berbeda** per company. Saat login, sistem masuk ke **Default Company**.

---

## Glosarium

| Istilah | Arti |
|---------|------|
| Role Assignment | Baris Company + Role per user (`gate_role_pivots`) |
| Default Company | Assignment yang dipakai otomatis saat login (`is_default_company`) |
| Active | User aktif — harus ON untuk login |
| Is Verified | Email verified — harus ON untuk login (independen dari Active) |
| Show for All Company | Public — visible ke company lain |
| Allow Multi-Device Login | Izinkan login simultan di banyak device |
| Assigned Employee | Link ke data HR Employee (jika ada) |

---

## Alur Kerja Operator

### Langkah 1 — Buat User

1. **Setting → User → Create**
2. Isi First Name, Last Name, Email, Username, Password + Re-type Password
3. Atur toggle: **Active** (default ON), **Is Verified** (default ON), **Show for All Company** (default OFF), **Allow Multi-Device** (default OFF)
4. Upload foto opsional
5. **Save & Next** → lanjut ke Role Assignment (edit mode)

### Langkah 2 — Role Assignment

1. Pilih **Company** (internal company active)
2. Pilih **Role**
3. Opsional: **Is Default Company**
4. Klik **Save** → baris muncul di datatable
5. Ulangi untuk company lain jika perlu

**Tips (notice kuning di form):**

- Jika tidak ada default company, **baris pertama/terbaru** otomatis jadi default
- Jika role user diubah, user **otomatis logout**

### Langkah 3 — Edit / Nonaktifkan

| Kebutuhan | Cara |
|-----------|------|
| Blok login sementara | **Is Verified OFF** (assignment tetap) |
| Nonaktifkan user | **Active OFF** atau bulk deactivate di datalist |
| Ganti default company | Assign ulang dengan toggle Default ON — default lama otomatis OFF |
| Hapus akses ke 1 company | Delete row (kecuali row Default Company) |

---

## UI/UX — Tombol & Fitur

### Datalist

| Tombol/Fitur | Fungsi |
|--------------|--------|
| **Create** | Form user baru |
| **Edit** | Edit user + Role Assignment |
| **Delete user** | **Tidak tersedia** di datalist |
| **Bulk Activate/Deactivate** | Update status banyak user |
| **Column Show/Hide** | `filter_column=true` + Reset to Defaults |
| **Export Basic** | Export kolom visible + default |

### Form User Information

| Toggle | Default | Efek |
|--------|---------|------|
| Active | ON | OFF = tidak bisa login |
| Is Verified | ON | OFF = tidak bisa login |
| Assign to Employee | OFF | **Read-only** — di-set dari modul HR |
| Show for All Company | OFF | ON = public ke semua company |
| Allow Multi-Device Login | OFF | OFF = 1 device; login baru logout device lama |

### Role Assignment Datatable

| Row | Action |
|-----|--------|
| Default Company = No | **Delete** |
| Default Company = Yes | **Tidak bisa delete** |

---

## Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Login gagal, Active ON | Is Verified OFF | Aktifkan Is Verified |
| Tidak bisa delete row company | Row = Default Company | Set default ke company lain dulu, atau Is Verified OFF |
| User logout sendiri | Role privilege diupdate / assignment changed / multi-device OFF | Re-login |
| "Cannot edit your own role data" | Assign role diri sendiri | Minta admin lain |
| Assigned Employee `-` | Belum link dari HR | Link di modul Employee |
| Login ulang wajib setelah assign | Token di-revoke by design | Normal — login lagi |

> **Pending items (PM §15):** Gap & action items yang harus di-close — [requirement §14](./requirement.md#14-pending-items-registry--harus-segera-di-close).

---

## FAQ

**Q: Apa beda Active vs Is Verified?**  
A: Keduanya harus ON untuk login. Is Verified berguna untuk cabut akses cepat tanpa hapus assignment.

**Q: Kenapa toggle Assign to Employee tidak bisa diklik?**  
A: By design — assignment employee dilakukan dari modul **HR Employee**, bukan dari form User.

**Q: Bisa 1 user punya role berbeda di company berbeda?**  
A: Ya.

**Q: User logout karena orang lain pakai akun yang sama?**  
A: Kemungkinan **Allow Multi-Device Login = OFF** — login baru menggantikan session lama.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Master Role | [../gate-role/knowledge-base.md](../gate-role/knowledge-base.md) |
| Internal Company | [../generalsetting-internal-company/knowledge-base.md](../generalsetting-internal-company/knowledge-base.md) |
