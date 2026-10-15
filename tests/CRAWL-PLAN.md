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
3. Checklist yang disepakati menu itu (untuk Variable Price: input vs tampil, UI/UX, audit log, kasus negatif). Pilar UI/UX mengikuti kitab `tests/UX-STANDARD.md`, bukan kesan dari satu menu sejenis. Sebelum assert simpan, klasifikasikan tiap input: field form biasa (Save All), baris detail transaksi (autosave), atau inline edit (sel datatable atau text box section konfigurasi yang diketik di tempat, wajib autosave). Tombol outline ikon-saja (termasuk Delete baris dan bulk) wajib primary; tombol Delete di modal konfirmasi tetap merah `rgb(193, 0, 7)` dan harus konsisten di semua menu.
4. Menu hulu/hilir dan bagian crawl mana yang diulang kalau menu itu berubah.
5. Peta kartu Jira, plus status pada tanggal plan ditulis.
6. Baseline pesan UI: pisahkan yang **teramati** pada run terakhir dan yang masih **target**.
7. Log run terakhir: tanggal, ringkasan lulus/temuan, folder bukti. Tanpa kredensial.
8. Daftar yang belum tercakup.

Jangan menyalin password, token, atau email login ke dokumen ini.

Expected bisnis tetap dari `requirement.md` menu itu. Kalau kartu Jira menambah batas yang belum ada di requirement, tulis sebagai kartu, jangan sebagai aturan requirement.

## Datalist standard checklist (pakai ulang untuk tiap menu)

Acuan perilaku: shared capabilities backend `yendyr/olshoperp` branch `dev` `docs/qa-docs/_meta/shared-capabilities/` (SF-DL-01 search/filter, SF-DL-03 show-deleted, SF-DL-04 column show/hide, SF-DL-05 export) + `requirement.md` § DataList menu. Tampilan: `tests/UX-STANDARD.md` §2.10. Seed data `QA-AUTO-{MENU}DL-NN` cukup untuk >1 halaman (page size 10), hapus semua di akhir.

| # | Fitur | Langkah | Lulus jika |
|---|-------|---------|------------|
| 1 | Show deleted data | Hapus 1–2 data QA-AUTO, centang **Show deleted data**, lalu lepas | ON: baris terhapus muncul dengan penanda `Deleted`, tanpa aksi edit/hapus (bukan restore, SF-DL-03). OFF: baris hilang lagi, total kembali. Hubungkan ke TC delete. |
| 2 | Columns Show/Hide | Toggle tiap kolom satu per satu; sembunyikan 1 kolom lalu reload; **Reset to Default** | Header tabel ikut berubah; pilihan bertahan setelah reload; reset mengembalikan default. Label di panel = label header. |
| 3 | Export | Export dengan filter + kolom tersembunyi + data >1 halaman; buka xlsx (openpyxl) | Header file = header layar (kolom gabungan boleh dipecah). Mengikuti filter & kolom tersembunyi. Semua baris hasil filter ikut (bukan hanya halaman aktif) kecuali requirement bilang lain. Kolom angka bertipe numerik (`data_type` `n`, bukan `@`/teks), tanggal bertipe tanggal. |
| 4 | Bulk action | Pilih baris via checkbox kiri; daftar semua ikon di bar atas; hover (tooltip) dan klik satu per satu | Tiap ikon outline primary, punya tooltip, disabled sesuai requirement (tooltip alasan), konfirmasi + toast + hasil benar. |
| 5 | Global search | Cari kode penuh, potongan di tengah, beda huruf besar/kecil, nama, kolom lain, kata acak | Cocok sebagian (contains) dan tidak peka huruf; kolom yang dicakup sesuai requirement; tanpa hasil = `No matching records found` + `Showing 0 to 0 of 0 entries (filtered from N total entries)`. |
| 6 | Pagination | Page size 10, data > 10; next/prev/nomor/first/last; ganti page size | `Showing x to y of N entries` benar di tiap halaman; tombol disabled di ujung; ganti size mengubah jumlah baris. |
| 7 | Sort | Untuk **setiap** header yang punya ikon sort: klik asc, desc, klik ketiga (reset bila ada); kumpulkan nilai dari semua halaman | Urutan benar sesuai tipe data (teks alfabet tidak peka huruf, angka numerik, tanggal kronologis) lintas halaman; indikator (`dt-ordering-asc/desc`) berubah; **isi baris tidak berubah** karena sort (kode, pembuat, status tetap sama). Kolom dengan nilai seragam ditandai "tidak teruji". |
| 8 | Tampilan | Lihat UX-STANDARD §2.10 | Status primary bold, sel kode link ke edit, tanpa underline titik-titik, breadcrumb konsisten, jamak benar. |
