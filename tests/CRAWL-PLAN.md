# Crawl plan per menu

Rencana crawl/regresi yang bisa dipakai ulang, supaya run Playwright berikutnya tidak riset menu dari nol.

Contoh hidup: `qa-docs/businessdevelopment-variable-price/test-cases/TC-VP-DRAFT-20261014161000.md`.

## Di mana file-nya

Simpan sebagai test case di menu yang sudah ada di manifest:

`qa-docs/{menu-slug}/test-cases/TC-{PREFIX}-DRAFT-{timestamp14}.md`

- `doc_type` wajib `e2e-test-case`.
- `tc_code` saat draft: `PENDING-{timestamp14}` (14 digit, sama dengan nama file).
- Update satu baris di `qa-docs/{menu-slug}/test-cases/README.md`.
- Satu baris indeks Test Cases di README menu boleh ditambah.

Jangan buat layer baru (misalnya `crawl-plan.md` sebagai dokumen terpisah). Docs Hub hanya mengenal layer `overview`, `knowledge-base`, `feature-map`, `requirement`, `technical`, `user-guide`, dan `test-cases`. Layer lain dibalas `Unsupported QA doc layer`.

Halaman `/docs/{modul}/{menu-slug}/test-cases` mengisi daftar dari file `TC-*.md`. Badan Markdown **setelah** frontmatter yang dirender sebagai catatan (HTML) di detail test case. README folder tidak ikut masuk daftar.

`manifest.yaml` tidak perlu diubah supaya daftar test case muncul. Slug menu harus sudah terdaftar.

## Frontmatter

Ikuti rule `13`. Parser-nya PHP Symfony YAML (`E2eTestCaseDocService.php`). Yang sering menjatuhkan halaman:

- Tiap baris di bawah `expected_result: |` menjorok **2 spasi**.
- Kutipan di dalam `steps` / `preconditions`: single quote di dalam double quote.
- `related_menus` hanya slug, satu per baris. Bukan pasangan key/value.
- `last_execution` lengkap: `at`, `jira`, `status`, `via`. Untuk plan yang belum dijalankan sebagai test case ini: `status: not_run` dan tiga field lain `null`.
- Jangan menulis `passed` jika `via` bukan spec yang ada, atau run manual tanpa `notes`.

`npm run tc:lint` harus bersih untuk file baru itu.

## Isi badan (bahasa Indonesia, untuk QA)

1. Scope, route aplikasi, URL Docs Hub, company yang boleh (code + id) dan company yang dipakai run terakhir.
2. Kontrak data: master yang di-lookup, data yang dibuat (prefix `QA-AUTO-`), langkah bersihkan.
3. Checklist yang disepakati menu itu (untuk Variable Price: input vs tampil, UI/UX, audit log, kasus negatif). Pilar UI/UX mengikuti kitab `tests/UX-STANDARD.md`, bukan kesan dari satu menu sejenis.
4. Menu hulu/hilir dan bagian crawl mana yang diulang kalau menu itu berubah.
5. Peta kartu Jira, plus status pada tanggal plan ditulis.
6. Baseline pesan UI: pisahkan yang **teramati** pada run terakhir dan yang masih **target**.
7. Log run terakhir: tanggal, ringkasan lulus/temuan, folder bukti. Tanpa kredensial.
8. Daftar yang belum tercakup.

Jangan menyalin password, token, atau email login ke dokumen ini.

Expected bisnis tetap dari `requirement.md` menu itu. Kalau kartu Jira menambah batas yang belum ada di requirement, tulis sebagai kartu, jangan sebagai aturan requirement.
