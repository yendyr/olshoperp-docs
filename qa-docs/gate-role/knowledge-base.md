---
doc_type: knowledge-base
menu: gate-role
menu_name: "Role (Gate)"
version: 2.1
last_updated: 2026-07-05
owner: QA - Yemima
status: review
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, status-badge, how-to, troubleshooting]
---

# Master Role — Knowledge Base

## 1. Apa itu menu Role?

Menu **Role** dipakai untuk menentukan **hak akses** yang bisa diberikan ke user. Satu role berisi daftar menu apa saja yang boleh dibuka, ditambah, diubah, dihapus, dicetak, atau di-approve.

User **tidak** mendapat akses langsung dari menu ini. Role dihubungkan ke user lewat menu **[Master User](../gate-user/knowledge-base.md)** → **Role Assignment**, per **user + company**.

**Path:** Developer Setting → Setting → **Role**

---

## 2. Glosarium

| Istilah | Arti (bahasa operasional) |
|---------|----------------------------|
| **Role** | Nama peran + pengaturan aktif/nonaktif + apakah role dipakai semua company |
| **Role Privilege** | Daftar centang akses per menu (View, Add, Update, dll.) |
| **Module** | Kelompok menu di sidebar — mis. Supply Chain, Human Resources |
| **Show for All Company** | Role ini boleh dipakai company lain (shared) |
| **Role system** | Role dari system administrator — company tenant biasanya tidak bisa ubah privilege-nya |
| **Assignment** | Hubungan user ↔ company ↔ role — diatur di Master User |

---

## 3. Satu user — satu role per company

Ini aturan penting saat assign user:

| Pertanyaan | Jawaban |
|------------|---------|
| Bisa punya role berbeda di company berbeda? | **Ya** — mis. Admin di PT A, Staff di PT B |
| Bisa punya **dua role sekaligus** di company yang sama? | **Tidak** — assign ulang = **ganti** role, bukan tambah |
| Apa yang terjadi kalau assign user yang sama ke company yang sama? | Role lama **diganti** role baru |

**Contoh:** Budi di PT Alpha = Admin. Assign lagi Budi di PT Alpha sebagai Manager → Budi jadi **Manager** di PT Alpha (bukan Admin + Manager).

---

## 4. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Buat role: nama, deskripsi, Active, Show for All Company
- Atur **Role Privilege** per module
- **Check All** untuk centang cepat semua menu dalam module aktif
- Hapus role jika **belum** dipakai user manapun
- Lihat Audit Log

### Tidak Bisa
- Hapus role yang masih dipakai user
- Ubah privilege role system dari company tenant biasa
- Set privilege di luar batas menu Master User company (untuk company non-super)
- Buka tab Role Privilege sebelum role disimpan

---

## 5. Cara Pakai

### 5.1 Buat role + atur privilege

1. **Role** → **Create**
2. Isi **Role Name** (wajib), **Description** (opsional)
3. **Active** ON; **Show for All Company** ON jika role untuk semua company
4. Klik **Save & Review** → lanjut ke halaman edit
5. Tab **Role Privilege** → pilih **Module** di kiri
6. Centang **View** (dan Add/Update/Delete/Print/Approval jika perlu)
7. **Save** — user dengan role ini akan **logout otomatis**

> **Logout:** Hanya saat **Save privilege**. Ubah nama/deskripsi lalu **Update** di tab Role **tidak** logout user — ini **perilaku resmi sistem**.

### 5.2 Tombol saat create

| Tombol | Kapan dipakai |
|--------|---------------|
| **Save & Review** | Langsung atur privilege setelah create |
| **Save** | Create saja, kembali ke datalist |
| **Back To Datalist** | Batal |

---

## 6. Hal yang Perlu Didiskusikan (PM) — Perilaku Sistem Saat Ini

> Sampai ada keputusan & update sistem, **yang di bawah ini adalah cara kerja resmi hari ini**. Bukan bug dokumentasi — baseline untuk operator & QA.

| Topik | Cara kerja **sekarang** | Kenapa perlu diskusi PM |
|-------|-------------------------|-------------------------|
| **Dropdown role di Master User** | Semua role **aktif** muncul saat assign user | Belum dibatasi role milik company sendiri vs shared |
| **Matikan Show for All Company** | Bisa OFF kapan saja | PM ingin cek dulu apakah company lain masih pakai |
| **Nonaktifkan role (Active OFF)** | Bisa OFF meski user masih pakai role itu | PM perlu putuskan: boleh atau harus ditolak |

Detail requirement: [requirement §14](./requirement.md#14-pending-items--urgent-diskusi-pm--product)

---

## 7. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Tab Role Privilege tidak muncul | Belum save role | **Save & Review** dulu |
| Menu module sedikit | Login company tenant | Subset dari Master User — hubungi admin |
| "Can't Modify this Role" | Role system | Hubungi system administrator |
| Delete gagal | Masih ada user | Reassign di Master User |
| User logout massal setelah save privilege | Normal | Login ulang |
| User tidak logout setelah rename role | By design | Save privilege jika perlu refresh permission |
| Role company lain muncul di assign | Lihat §6 | Tunggu keputusan PM P-R03 |

---

## 8. FAQ

**Q: Kapan user logout otomatis?**  
A: Saat **Save** di tab Role Privilege — bukan saat Update nama/status di tab Role.

**Q: Satu user bisa banyak role?**  
A: **Satu role per company.** Banyak company = banyak assignment, role boleh berbeda.

**Q: Approval Level 1 dan 2?**  
A: Beberapa menu (terutama HRIS) butuh approval bertingkat. Centang level yang sesuai. Menu lain mungkin hanya Lv.1.

**Q: Bisa hapus role yang masih dipakai?**  
A: Tidak — pesan: *"Cannot delete role, role already use in user"*.

**Q: Ada fitur teknis yang belum jelas?**  
A: Temuan untuk tim dev (bukan urgent operator): flag default role tanpa UI, akses Process tanpa checkbox — lihat [requirement §15](./requirement.md#15-dev-team--technical-follow-ups) / [technical §15](./technical.md#15-dev-team--technical-follow-ups).

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| Master User | [../gate-user/knowledge-base.md](../gate-user/knowledge-base.md) |
