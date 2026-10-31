---
name: olshoperp-jira-card
description: >-
  Buat/regenerate card Jira ETM non-TC: Error (bug), Improvement, Change Requirement.
  Format section, label UI persis, Expected/AS-IS dari requirement, bahasa non-teknis,
  Relates, Request ID. Pakai saat bug:/improvement:/cr:, "buatkan card Error/Improvement",
  regenerate description. Test Case → skill olshoperp-testcase-authoring. Testing → card-testing.
---

# OlshopERP — Buat Card Jira (Error / Improvement / CR)

**Baca file ini dulu** untuk buat/edit description card non-TC.  
**Jangan** load rule `12`/`24`/`25` penuh kecuali skill kurang.  
Template section: [reference.md](reference.md).

Site: **hanya ETM** (`erpintegration.atlassian.net`, cloudId `44cc9820-3372-4c12-884c-698b1397173c`).

---

## 0. STOP — salah skill / larangan

| Situasi | Arahkan |
|---------|---------|
| Buat **Test Case** | skill `olshoperp-testcase-authoring` |
| Jalankan / isi hasil uji | skill `olshoperp-card-testing` |
| Q&A menu saja | skill `olshoperp-qa-menu-ask` |
| Cek DB | skill `olshoperp-db-verify` |

- **Create/edit/transition ke Jira** hanya atas permintaan user di sesi itu. Draft di chat boleh kapan saja.
- Jangan geser card ke **Done** atas inisiatif sendiri.
- Pengecualian Failed otomatis saat **menguji** → skill testing / rule `22`, bukan skill ini.
- Issue type finding = **`Error`** (bukan `Bug` — di ETM, Bug = subtask).

---

## 1. Judul & istilah

- Judul: `[Nama Menu] - short desc` — nama menu **persis** di app; 1 gejala; ±15 kata.
- Label tombol/field/status = teks UI atau `qa-docs` — **jangan** karangan (“Finance Complete”, dll.).
- AS-IS / Expected / AC: dari `requirement.md` (review/approved) atau KB — **bukan** asumsi ERP. Draft/kosong → STOP atau tandai gap / butuh konfirmasi Yemima.
- Fixture staging ada → wajib URL **edit** di Environment / Precondition / Steps.

---

## 2. Pilih tipe & field

| Maksud | Issuetype | Id tipikal |
|--------|-----------|------------|
| Bug / finding | **Error** | `10033` |
| Improvement | Improvement | `10088` |
| Change Requirement | Change Requirement | `10048` |

Wajib field: Menu (`customfield_10429`), Request ID (`customfield_10495` — definisi valid di rule `12`: ID asli atau literal `none`; `-` / kosong / spasi tidak valid, jangan disalin), Story Points, labels, Relates ke card sumber bila ada.

**Hasil uji** pada card tipe ini → **komentar** (field Actual Result tidak tampil). Bagian “Actual Result” di template Error = teks di **description**, bukan `customfield_10203`.

Bahasa ke tim QA: sehari-hari, non-teknis (jangan `customfield_*`, `last_execution`, JQL ke pembaca QA).

---

## 3. Improvement + Request ID (screening ringkas)

Jika Improvement dan Request ID terisi (bukan `none`):

| Simple (semua terpenuhi) | Butuh konfirmasi (salah satu cukup) |
|--------------------------|-------------------------------------|
| Menu di manifest; requirement review/approved; tidak bentrok docs; tidak cross-menu; AC konkret dari docs | Menu/req draft/hilang; bentrok; cross-menu; ambigu; dugaan duplikat |

- **Simple:** lengkapi description dari docs; pertahankan verbatim **"Request Asli (dari User)"**; footer draf otomatis. Jangan ubah status/assignee/SP.
- **Butuh konfirmasi:** jangan sunting description; notify Yemima dengan pertanyaan konkret (Telegram topic mapping di tools bila dipakai bot).
- Ragu → konfirmasi. Sudah ada penanda auto-complete → jangan proses ulang.

Detail: reference §D atau rule `25`.

---

## 4. Alur kerja agent

1. Pastikan user minta create/edit (atau trigger `bug:` / `improvement:` / `cr:`).  
2. Resolve menu + baca **satu** layer requirement (status OK).  
3. Susun draft section sesuai tipe (reference §B).  
4. Cek FE/docs untuk label UI; URL edit jika ada data.  
5. Setelah izin: create/update Jira + Relates; verifikasi GET sesuai rule `12` (Request ID tidak valid diperbaiki sebelum lanjut); laporkan URL.  
6. Jeda ~2,5 dtk antar create beruntun.

---

## 5. Checklist

- [ ] Tipe benar (Error ≠ Bug subtask)
- [ ] Judul `[Menu] - …`; istilah UI konsisten
- [ ] Expected/AS-IS/AC dari docs; gap dilabeli
- [ ] Menu + Request ID valid (rule `12`, bukan `-`) + Relates (jika ada sumber); sudah dicek GET setelah create
- [ ] URL edit jika fixture staging
- [ ] Bahasa non-teknis di section utama
- [ ] Create hanya karena permintaan sesi ini
