# Crawl plan per menu

Rencana crawl/regresi yang bisa dipakai ulang, supaya run Playwright berikutnya tidak riset menu dari nol.

> **Sejak 26-10-2026 TC hanya di Jira.** Jangan buat file `TC-*.md` baru, jangan update `README.md` test-cases,
> jangan isi `last_execution`. Rencana crawl baru ditulis sebagai card Test Case Jira (skill
> `olshoperp-testcase-authoring`); isi badan di bawah tetap jadi acuan isinya. Bagian "Di mana file-nya" dan
> "Frontmatter" = **format arsip** untuk membaca file lama.

Contoh arsip: `qa-docs/businessdevelopment-variable-price/test-cases/TC-VP-001.md`.

## Di mana file-nya (ARSIP)

Format file lama di menu yang sudah ada di manifest:

`qa-docs/{menu-slug}/test-cases/TC-{PREFIX}-DRAFT-{timestamp14}.md`

- `doc_type` wajib `e2e-test-case`.
- `tc_code` saat draft: `PENDING-{timestamp14}` (14 digit, sama dengan nama file).
- Update satu baris di `qa-docs/{menu-slug}/test-cases/README.md`.
- Satu baris indeks Test Cases di README menu boleh ditambah.

Jangan buat layer baru (misalnya `crawl-plan.md` sebagai dokumen terpisah). Docs Hub hanya mengenal layer `overview`, `knowledge-base`, `feature-map`, `requirement`, `technical`, `user-guide`, dan `test-cases`. Layer lain dibalas `Unsupported QA doc layer`.

Halaman `/docs/{modul}/{menu-slug}/test-cases` mengisi daftar dari file `TC-*.md`. Badan Markdown **setelah** frontmatter yang dirender sebagai catatan (HTML) di detail test case. README folder tidak ikut masuk daftar.

`manifest.yaml` tidak perlu diubah supaya daftar test case muncul. Slug menu harus sudah terdaftar.

## Frontmatter (ARSIP)

Ikuti rule `13` (arsip). Parser-nya PHP Symfony YAML (`E2eTestCaseDocService.php`). Yang sering menjatuhkan halaman:

- Tiap baris di bawah `expected_result: |` menjorok **2 spasi**.
- Kutipan di dalam `steps` / `preconditions`: single quote di dalam double quote.
- `related_menus` hanya slug, satu per baris. Bukan pasangan key/value.
- `last_execution` lengkap: `at`, `jira`, `status`, `via`. Untuk plan yang belum dijalankan sebagai test case ini: `status: not_run` dan tiga field lain `null`.
- Jangan menulis `passed` jika `via` bukan spec yang ada, atau run manual tanpa `notes`.

`npm run tc:lint` harus bersih untuk file baru itu.

## Isi badan (bahasa Indonesia, untuk QA)

1. Scope, route aplikasi, URL Docs Hub, company yang boleh (code + id) dan company yang dipakai run terakhir.
2. Kontrak data: master yang di-lookup, data yang dibuat (prefix `QA-AUTO-`), dan label jejaknya. **Data uji tidak dihapus** (aturan 15-10-2026, lihat `AGENT-RUNBOOK.md` § Data uji: simpan, jangan hapus).
3. Checklist yang disepakati menu itu (untuk Variable Price: input vs tampil, UI/UX, audit log, kasus negatif). Pilar UI/UX mengikuti kitab `tests/UX-STANDARD.md`, bukan kesan dari satu menu sejenis. Sebelum assert simpan, klasifikasikan tiap input: field form biasa (Save All), baris detail transaksi (autosave), atau inline edit (sel datatable atau text box section konfigurasi yang diketik di tempat, wajib autosave). Tombol outline ikon-saja (termasuk Delete baris dan bulk) wajib primary; tombol Delete di modal konfirmasi tetap merah `rgb(193, 0, 7)` dan harus konsisten di semua menu.
4. Menu hulu/hilir dan bagian crawl mana yang diulang kalau menu itu berubah.
5. Peta kartu Jira, plus status pada tanggal plan ditulis.
6. Baseline pesan UI: pisahkan yang **teramati** pada run terakhir dan yang masih **target**.
7. Log run terakhir: tanggal, ringkasan lulus/temuan, folder bukti. Tanpa kredensial.
8. Daftar yang belum tercakup.

Jangan menyalin password, token, atau email login ke dokumen ini.

Expected bisnis tetap dari `requirement.md` menu itu. Kalau kartu Jira menambah batas yang belum ada di requirement, tulis sebagai kartu, jangan sebagai aturan requirement.

## Datalist standard checklist (pakai ulang untuk tiap menu)

Acuan perilaku: shared capabilities backend `yendyr/olshoperp` branch `dev` `docs/qa-docs/_meta/shared-capabilities/` (SF-DL-01 search/filter, SF-DL-03 show-deleted, SF-DL-04 column show/hide, SF-DL-05 export) + `requirement.md` § DataList menu. Tampilan: `tests/UX-STANDARD.md` §2.10. Seed data `QA-AUTO-{MENU}DL-NN` cukup untuk >1 halaman (page size 10). Seed tidak dihapus di akhir; beri jejak TC/card + tanggal di Name/Description. Uji Show deleted (item 1) tetap boleh menghapus 1–2 seed karena hapus adalah objek uji itu.

| # | Fitur | Langkah | Lulus jika |
|---|-------|---------|------------|
| 1 | Show deleted data | Hapus 1–2 data QA-AUTO, centang **Show deleted data**, lalu lepas | Lulus jika ON: baris terhapus muncul dengan teks merah `Deleted` di kolom Action (tanpa aksi edit/hapus, bukan restore, SF-DL-03). OFF: baris hilang lagi, total kembali. Status `Active` di baris terhapus **boleh** (tidak terkait). Hubungkan ke TC delete. |
| 2 | Columns Show/Hide | Toggle tiap kolom satu per satu; sembunyikan 1 kolom lalu reload; **Reset to Default** | Header tabel ikut berubah; pilihan bertahan setelah reload; reset mengembalikan default. Label di panel = label header. |
| 3 | Export | Export dengan filter + kolom tersembunyi + data >1 halaman; buka xlsx (openpyxl) | Header file = header layar (kolom gabungan boleh dipecah). Mengikuti filter & kolom tersembunyi. Export dasar **halaman aktif saja** (`Export Active Page Only`) diterima. Tipe numerik (`data_type` `n`) wajib **hanya** untuk kolom yang isinya murni angka (qty, harga, total); kolom campuran teks seperti `0 category` boleh General/teks. |
| 4 | Bulk action | Pilih baris via checkbox kiri; daftar semua ikon di bar atas; hover (tooltip) dan klik satu per satu | Tiap ikon outline primary, punya tooltip, disabled sesuai requirement (tooltip alasan), konfirmasi + toast + hasil benar. |
| 5 | Global search | Cari kode penuh, potongan di tengah, beda huruf besar/kecil, nama, kolom lain, kata acak | Menu **tanpa** Advanced Filter: wajib contains (potongan di tengah teks) di **semua kolom tampil** (termasuk Type, Status), tidak peka huruf; gagal = card Error. Menu **dengan** Advanced Filter: pola awal-teks (prefix) ditoleransi. Tanpa hasil = `No matching records found` + `Showing 0 to 0 of 0 entries (filtered from N total entries)`. |
| 6 | Pagination | Page size 10, data > 10; next/prev/nomor/first/last; ganti page size | `Showing x to y of N entries` benar di tiap halaman; tombol disabled di ujung; ganti size mengubah jumlah baris. |
| 7 | Sort | Untuk **setiap** header yang punya ikon sort: klik asc, desc, klik ketiga (reset bila ada); kumpulkan nilai dari semua halaman | Urutan benar sesuai tipe data (teks alfabet tidak peka huruf, angka numerik, tanggal kronologis) lintas halaman; indikator (`dt-ordering-asc/desc`) berubah; **isi baris tidak berubah** karena sort (kode, pembuat, status tetap sama). Kolom dengan nilai seragam ditandai "tidak teruji". |
| 8 | Tampilan | Lihat UX-STANDARD §2.10 | Status primary bold, sel kode link ke edit, tanpa underline titik-titik, breadcrumb konsisten, jamak benar. |
