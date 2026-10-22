---
doc_type: e2e-test-case
tc_code: TC-CP-DELTOAST-001
menu: businessdevelopment-category-price
menu_name: "Category Price"
test_type: regression
title: "Form edit Category Price yang sudah dihapus: toast 'Pricelist Category Data Not Found' tidak spamming + regresi cek store POS"
summary: "Buka form edit Category Price yang sudah dihapus: tidak ada toast berulang dan form read-only. Regresi: lepas store yang dipakai sesi POS open tetap memunculkan 1 toast dan store kembali terpilih; tambah/lepas store biasa tetap tersimpan."
status: review
owner: QA - Bugsy (automation)
last_updated: 2026-10-20
requirement_ref: "ETM-16650 (Error) · relates ETM-16313 · fix PR frontend #4459 (7edbb43)"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
preconditions:
  - "Login staging tim_dev@mail.com, company Dev Staging (13) — sesuai card"
  - "FE build minimal 20-10-2026 13:36 (3ed3583); cek di footer 'Last FE build'"
  - "Ada Category Price yang sudah dihapus: ID 3 KKVPRC (tidak muncul di datalist aktif, check-store → 404)"
  - "Ada store dengan sesi POS open: GracesMaterial (store 50, sesi #8), KKV Store (10, sesi #1), Garment Marts - Seruni (5, sesi #2). Cek via GET /api/businessdevelopment/pos-session-list"
  - "Category Price aktif yang memakai store POS: ID 58 SHP-DEV2 (GracesMaterial + Aeri's Store 1)"
test_data:
  - field: deleted_category
    value: "ID 3 KKVPRC — https://staging.olshoperp.com/businessdevelopment/pricelist-category/edit/3"
  - field: pos_regression_category
    value: "ID 58 SHP-DEV2 (JANGAN klik Save All saat test POS; cukup lepas tag store)"
  - field: qa_auto_category
    value: "ID 63 QA-AUTO-16650 'QA-AUTO ETM-16650 20-10-2026' (store akhir: Komi, Cosmetics). Jangan dihapus; untuk retest pakai store lain yang belum terpakai (mis. LuluLemon, AVORA)"
steps:
  - "A. Buka edit/3 (data terhapus), tunggu 12 detik, ulangi 3× (reload). Pantau toast & Network (check-store)"
  - "A2. Klik field Applied Store → harus terkunci (class is-disabled, dropdown tidak terbuka)"
  - "B. Buka edit/58, klik × pada tag GracesMaterial (store dengan sesi POS open). Tunggu 15 detik. Jangan Save"
  - "C. Buka edit/63 (atau buat QA-AUTO baru), lepas 1 store tanpa sesi POS, tambah 1 store lain, klik Save All, reload"
expected_result: |
  A. Tidak ada toast berulang. (Card minta "cukup 1 kali"; hasil fix: 0 toast, form read-only — lihat Catatan.)
     Tidak ada call /check-store; detail + tiers dipanggil 1× per load. Semua input terkunci, tombol Save tidak tampil.
  B. Toast "GracesMaterial can't be deleted as it's used in the POS menu." muncul tepat 1×, check-store 1× (422),
     tag GracesMaterial kembali terpilih, tidak ada toast ulang.
  C. Lepas store biasa → check-store 200 tanpa toast. Save All → PUT 200. Setelah reload store sesuai perubahan.
test_result:
  status: passed-with-question
  started_at: "2026-10-20T15:02:00+07:00"
  finished_at: "2026-10-20T15:08:00+07:00"
  executed_by: "Bugsy (tim_dev@mail.com)"
  environment: staging
  log_summary: "A: 3 load, 0 toast, 0 check-store, read-only. B: 1 toast, check-store 1× 422, store kembali. C: Glowzy dilepas tanpa toast, Cosmetics ditambah, PUT 200, reload Komi+Cosmetics. 0 toast (ekspektasi 1) diterima QA lead 20-10-2026; card Done."
  report_url: "https://drive.google.com/drive/folders/1BMJ6tUAaQtEEoRAdavujRKUdsVHyySf_"
test_data_used:
  - "Category Price ID 3 KKVPRC (deleted)"
  - "Category Price ID 58 SHP-DEV2 (tidak diubah)"
  - "Category Price ID 63 QA-AUTO-16650 (dibuat 20-10-2026)"
run_history: []
origin_jira: ETM-16650
first_execution:
  at: "2026-10-20"
  via: "manual:Bugsy"
  jira: "ETM-16650"
last_execution:
  at: "2026-10-20"
  jira: "ETM-16650"
  status: passed
  via: "manual:Bugsy"
  notes: "A: 3 load, 0 toast, 0 check-store, read-only. B: 1 toast, check-store 1× 422, store kembali. C: Glowzy dilepas tanpa toast, Cosmetics ditambah, PUT 200, reload Komi+Cosmetics. 0 toast (ekspektasi 1) diterima QA lead 20-10-2026; card Done."
---

# TC-CP-DELTOAST-001 — Toast "Data Not Found" di form Category Price terhapus

## Konteks bug (ETM-16650)
Dulu watcher `applied_store` di `PricelistCategory/Form.vue` selalu memanggil `GET pricelist-category/{id}/check-store`
tiap data dimuat. Route itu pakai route-model binding **tanpa** `withTrashed`, jadi data terhapus → 404
"Pricelist Category Data not found!". `catch` memanggil `fetchDetail()` + `fetchTiers()` + toast → watcher jalan lagi → loop toast.

Fix (PR FE #4459): watcher hanya jalan bila `id && can_update && oldValue.length` **dan** ada store yang benar-benar dilepas.
Data terhapus → `can_update=false` → tidak ada check-store → tidak ada toast.

## Cara retest cepat
1. Login tim_dev / Dev Staging, pastikan footer "Last FE build" ≥ 20-10-2026 13:36.
2. Buka DevTools Network filter `check-store`.
3. Jalankan langkah A–C di frontmatter.
4. Hitung toast: elemen `.toast-close` yang muncul = jumlah toast.

## Hasil 20-10-2026 (Bugsy)
| Poin | Hasil | Bukti |
|---|---|---|
| A. Data terhapus tidak spamming toast | ✅ 0 toast di 3 load, 0 call check-store, form read-only | [video](https://drive.google.com/file/d/1V3dtI4hrPbENxxt1jUfarhpVTfmomT2D/view) · [ss](https://drive.google.com/file/d/16LgeJmrYHa6Sb3rdQ0-MQe0aY92yEAD4/view) · [store terkunci](https://drive.google.com/file/d/1M_92mR94V3k4-SGuMBGsbMSPbF6iV0Bi/view) |
| A'. "Cukup muncul 1 kali" | ✅ muncul 0 kali, tanpa penanda data terhapus — diterima QA lead 20-10-2026 | — |
| B. Regresi store POS | ✅ 1 toast, store kembali terpilih | [video](https://drive.google.com/file/d/18AAE5wOJvexqndRd6nyQBquetYAps8qx/view) · [1,5s](https://drive.google.com/file/d/1spH8IHF7Xnmt1m4MSDp9hqqIrtV6eiqg/view) · [15s](https://drive.google.com/file/d/1BPImK81zgt_maYAkeBgIALQhGFcyy4_k/view) |
| C. Regresi tambah/lepas store biasa | ✅ tersimpan, sesuai setelah reload | [video](https://drive.google.com/file/d/172iWiawj86cj339bwa2Etj7J7yE4_Oyb/view) · [lepas](https://drive.google.com/file/d/1pD2jlwb1ol_2ih2xpYw5tnG1oB9zLctv/view) · [reload](https://drive.google.com/file/d/1O5ILcvW4ScvQOVtdKqV0BV9I3wciZQqW/view) |

Telegram report: thread 51478, message id 52161.

## Catatan
- API `GET pricelist-category/{id}` untuk data terhapus **tidak** mengembalikan `deleted_at`; read-only datang dari `can_update=false`.
  `applied_store` ID 3 sekarang `[]` (pivot store terhapus ikut delete).
- Tidak ada banner/label "Deleted" di form; user bisa bingung kenapa form terkunci. Kandidat improvement UX bila diputuskan perlu penanda.
- Create Category Price default "Show for all company" = ON (ID 63 tersimpan `is_all_company=1`). Di luar scope card ini.
