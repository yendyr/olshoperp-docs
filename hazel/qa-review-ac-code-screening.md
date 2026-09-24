---
title: QA Review — AC vs Code Screening (Hazel / Grokbot)
audience: Hazel, Grokbot, Lead QA
status: active
version: 1.0
last_updated: 2026-09-24
owner: QA - Yemima
related_case: ETM-16058
related_modules:
  - reopen-defect-flow
  - plain-language-team-comms
---

# QA Review — Screening AC vs Implementasi (Code / Commit)

Playbook khusus saat card Jira ETM digeser ke **QA Review** dan bot men-screen apakah perbaikan di kode/commit sudah menutup **Acceptance Criteria** di description card.

Bukan pengganti:

- Reopen & Defect Flow (aksi setelah verifikasi gagal)
- TC Screening (kelengkapan TC Done)
- Improvement Intake (lengkapi description card To Do)

Ini modul **debug/verifikasi AC vs kode** sebelum Lead QA putuskan pass / balik ke dev.

---

## 1. Trigger

Jalankan playbook ini jika:

1. Card ETM status **QA Review**, dan
2. Ada sinyal implementasi: commit yang menyebut key card (`ETM-xxxxx`), PR terkait, atau komentar Dev “sudah fix”, dan
3. Audience butuh verdict: **PASS** / **REWORK** / **NEED MANUAL QA**

---

## 2. Urutan kerja (wajib)

### Langkah A — Ambil kontrak

1. Baca **Acceptance Criteria** (+ Expected / TO-BE) di description card.
2. Baca requirement menu terkait di `qa-docs/{slug}/requirement.md` jika AC merujuk docs.
3. Buat daftar centang: tiap butir AC = satu baris.

### Langkah B — Ambil bukti implementasi

1. Cari commit/PR yang menyebut key card (contoh `fix(ETM-16058)`, branch `ETM-16058`).
2. Baca **diff** file yang berubah — jangan hanya pesan commit.
3. Catat apa yang **ada** vs **tidak ada** di diff (kode, asset template, docs).

### Langkah C — Map tiap AC

Untuk **setiap** butir AC, isi salah satu:

| Status | Arti |
|--------|------|
| **PASS** | Ada bukti jelas di diff/commit |
| **GAP** | Belum ada, atau ada tapi belum menutup AC utuh |
| **NOT VERIFIED** | Tidak bisa dipastikan dari kode saja (perlu uji UI/manual) |

Jangan loncat ke “code smell” sebelum map ke AC.

### Langkah D — Verdict

| Verdict | Kapan |
|---------|--------|
| **PASS** | Semua AC kritis PASS; sisa paling banyak kosmetik / NOT VERIFIED non-blocker |
| **REWORK** | Ada ≥1 AC kritis berstatus GAP |
| **NEED MANUAL QA** | Kode kelihatan lengkap tapi butuh bukti UI/staging sebelum putuskan |

---

## 3. Tiga lapisan (hindari salah frame)

Banyak gap “setengah beres” karena bot menyamakan **definisi** dengan **penegakan**.

| Lapisan | Pertanyaan | Contoh |
|---------|------------|--------|
| **Define** | Nama kolom / aturan sudah ada di const, config, mapping? | Const kolom `lihat berdasarkan` sudah diisi |
| **Enforce** | Validasi **awal** menolak kalau syarat hilang? | Cek header upload **wajibkan** kolom itu ada |
| **Message** | Pesan ke user jelas sesuai AC? | “Format lama ditolak…” bukan error teknis di tengah proses |

Aturan:

- Define = ya, Enforce/Message = tidak → **tetap GAP** (bukan “sudah beres”).
- Jangan tulis “kolom tidak ada / tidak dicek” kalau yang terjadi adalah “kolom sudah dikenali tapi belum diwajibkan”.

### Frame yang benar vs salah

| ❌ Salah (gampang dibantah Dev) | ✅ Benar |
|----------------------------------|---------|
| “Kolom X tidak didefinisikan / tidak dicek.” | “Kolom X sudah dikenali (Define), tapi belum diwajibkan di cek awal (Enforce) — AC tolak format lama + pesan jelas belum terpenuhi.” |
| “Happy path ada = card selesai.” | Pisahkan happy path vs reject path vs asset ikut. |

---

## 4. Selalu pisahkan 3 jalur laporan

Wajib dilaporkan terpisah (meski singkat):

1. **Happy path** — alur sukses utama sudah diimplementasi?
2. **Reject / negatif** — kasus yang harus ditolak (format lama, input invalid) + pesan jelas?
3. **Asset / ikutannya** — template download, docs, file contoh, yang disebut AC/requirement?

Pola umum Improvement: happy path PASS, reject/asset masih GAP → verdict **REWORK**, bukan PASS.

---

## 5. Confidence

| Level | Arti | Kapan dipakai |
|-------|------|----------------|
| **tinggi** | Verdict ditopang AC + diff yang sudah dibaca | Map AC lengkap; gap/pass punya bukti file |
| **sedang** | Inti kelihatan, masih ada celah atau asumsi | Happy path jelas; reject path / asset belum terkunci |
| **rendah** | Bukti tipis | Commit tidak ketemu, diff tidak kebaca, AC ambigu |

Tulis confidence **bersama** verdict. Jangan confidence tinggi jika hanya menebak dari nama commit.

---

## 6. Antisipasi bantahan Dev

Jika Dev bilang “sudah ada di const / config / mapping”:

1. **Akui** bagian yang benar (Define).
2. **Tunjukkan** lapisan mana yang masih kosong (Enforce / Message / asset).
3. **Kaitkan** ke nomor/butir AC yang belum close.

Jangan debat “salah total” kalau temuan bot hanya salah frame; koreksi frame, pertahankan GAP yang valid.

---

## 7. Format output (wajib)

### 7.1 Untuk Lead QA / Telegram / comment awal (non-teknis)

Ikuti gaya plain-language team comms. Hindari nama class, path file, dan indeks array di pesan utama.

```text
Verdict: PASS | REWORK | NEED MANUAL QA
Confidence: tinggi | sedang | rendah
Card: ETM-xxxxx

Sudah oke:
- …

Masih gap (kait AC):
- …

Rekomendasi:
- Balik ke Dev / lanjut uji manual / bisa di-pass
```

### 7.2 Lampiran teknis (opsional, terpisah)

Boleh sebut file/class/commit **hanya** di blok teknis sekunder, untuk Dev yang mau jejak kode.

### 7.3 Keputusan balik ke Dev

REWORK layak jika gap menyentuh AC eksplisit (contoh: “tolak format lama dengan pesan jelas”, “update template download”).  
Happy path yang sudah jalan **tidak** perlu diminta ulang dari nol — sebutkan fokus perbaikan.

---

## 8. Lesson case — ETM-16058 (Instant Settlement Shopee)

Konteks singkat (jangan diulang panjang di screening lain; ini contoh pola):

| Butir | Hasil screening yang benar |
|-------|----------------------------|
| Happy path Penghasilan / header row 3 / filter Order | PASS |
| Kolom *Lihat berdasarkan* di const | Define = ya (Dev benar) |
| Wajib di cek header + pesan tolak format lama | Enforce/Message = GAP |
| Template download Shopee ikut di-update | GAP |
| Verdict | **REWORK** (bukan tolak seluruh implementasi) |

Kesalahan frame yang dihindari ke depan: menyimpulkan “kolom type tidak dicek sama sekali” tanpa membedakan Define vs Enforce.

---

## 9. Checklist cepat sebelum kirim screening

- [ ] Tiap AC punya PASS / GAP / NOT VERIFIED
- [ ] Happy path, reject path, dan asset dilaporkan terpisah
- [ ] Define ≠ Enforce sudah dicek kalau ada const/config terkait
- [ ] Verdict + confidence ada
- [ ] Versi non-teknis siap baca Lead QA / Dev di comment
- [ ] Tidak mengklaim PASS jika AC kritis masih GAP

---

## 10. Di mana file ini hidup

| Item | Lokasi |
|------|--------|
| **Playbook ini (SoT)** | `olshoperp-docs/hazel/qa-review-ac-code-screening.md` |
| Repo aplikasi | Jangan jadi sumber proses QA; boleh dirujuk saat baca diff |
| Promosi ke Cursor rule twin | Opsional nanti via `#update-rules` (olshoperp summary + olshoperp-docs full), jika Hazel wajib auto-load |

**Maintenance:** QA — Yemima. Update playbook ini saat ada lesson screening baru yang mengubah cara frame temuan (bukan tiap card).
