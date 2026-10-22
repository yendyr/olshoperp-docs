# Referensi — olshoperp-card-testing

Tidak ada token/password di file ini. Kredensial hanya dari `.env` repo `olshoperp` dan `tests/TEST-ACCOUNTS.md`; jangan dicetak ke chat.

## A. Jira (site ETM, `erpintegration.atlassian.net`, REST v3 ADF; v2 untuk deskripsi wiki)
- Auth: `JIRA_EMAIL` + `JIRA_API_TOKEN` dari `.env` repo olshoperp (basic auth via curl `-K -` agar tidak tampil di proses).
- Issue type: Error `10033`, Test Case `10051`, Improvement `10088`, Change Requirement `10048`.
- Field: Test Result `customfield_10202` `{"value":"Passed|Failed|Blocked"}`, Actual Result `customfield_10203` (ADF), Menu/Notion `customfield_10429` (string), Request ID `customfield_10495` (salin dari origin, atau `none`), Story Points `customfield_10043`.
- Transisi (CONTOH, selalu `GET issue/{key}/transitions`): Test Case TESTING PROGRESS `4`, Done `2`; non-TC "QA Review --> Done" `291`, RE-OPEN `10` (juga `71`), TESTING PROGRESS `6`. Transisi ke TESTING PROGRESS memindahkan assignee ke akun Yemima (efek Jira).
- Link: tipe `Relates`; clone pakai `Cloners` (inwardIssue = clone, outwardIssue = origin).
- Lampiran Jira dinonaktifkan di site ETM: bukti = teks di komentar + Drive.
- Jeda 2,5 detik antar create/update/link beruntun.
- Cari duplikat: `GET search/jql?jql=...&fields=summary,status` (JQL di-URL-encode).

## B. Database baca-saja (n8n webhook, JANGAN tulis)
- Staging/tyas: `POST https://n8n.olshoperp.com/webhook/agent-db-tyas`, body `{"db":"staging_olshoperp","query":"..."}`.
- Merdian (production): `POST https://n9n.olshoperp.com/webhook/agent-db-merdian`, `db` `merdian_olshoperp`.
- Header `X-API-Key` = env `DB_DEBUG_API_KEY` (dari `.env` olshoperp). Hasil kosong dikembalikan sebagai body kosong (bukan JSON) = 0 baris. Query join berat kadang kosong: ulangi lebih sederhana.
- Tabel berguna: `accounting_payments` (AP/AR/DN/CN lewat kolom `type`), `accounting_payment_details|detail_funds|detail_deposits|detail_adjustments`, `accounting_supplier_invoices`, `accounting_customer_invoices`, `gs_company_detail_banks`, `accounting_chart_of_accounts`, `gs_companies` (supplier/customer), `bd_pricelists` (`product_id` = `scm_products`), `audits`.
- Log Laravel: `node scripts/agent-log-fetch.mjs --server=merdian|tyas --file=laravel-YYYY-MM-DD.log --level=error` (file harian terpecah `_1`, `_2`).

## C. Membuat card Test Case
Lihat skill `olshoperp-testcase-authoring`. TC hanya di Jira (tanpa dokumen repo).

## D. Playwright probe (repo olshoperp-docs)
- Jalankan: `npx playwright test tests/specs/check-xxx.spec.ts --project=authenticated --reporter=line`.
- Helper `tests/helpers/company-access.ts`: `prepareSession(page,{companyCode,targetPath})`, `switchCompanyByCode(page,code)`, `readAuthFromPage(page)`.
- Company staging: FAT 112, lumicharmsid 153, DEV-STG 13, Lumielle 810, TANRISE 3, HUAWEI 915. Akun default dan sandi: `tests/TEST-ACCOUNTS.md` + rule `13` §4.
- Pola probe: rekam `page.on('response')` status >= 400, `page.on('request')` untuk hitung simpan, screenshot ke scratchpad, tulis hasil ke JSON bertahap (supaya tidak hilang bila gagal di akhir).
- Komponen: dropdown vue-multiselect (`.multiselect` placeholder, bukan button), PrimeVue `.p-multiselect` (panel `li.p-multiselect-option`), datalist DataTables (`input.dt-input[type=search]`, pencarian cocok dari awal teks), toast `.toastify`.

## E. Telegram laporan test
Bot `@OlshopERP_bot` (token `TELEGRAM_BOT_TOKEN` di `.env`), grup `-1001931573603`, thread `51478`, `parse_mode=HTML`.
Urutan pesan: `<b>ETM-xxxxx — [Menu] judul</b>` → `<b>✅ Hasil: LULUS (Passed)</b>` / `❌ GAGAL` / `⚠️ Hasil sementara` → baris `Staging · company X · tanggal` → `<b>Expected Poin:</b>` (✅/❌/⏸) → `<b>Catatan:</b>` → `<b>Data uji:</b>` → `<b>Jira:</b>` + link + status → `<b>Evidence:</b>` → `Dijalankan oleh Bugsy (Claude) atas permintaan Yemima` → `cc @yemimatifani`. Ubah pesan lewat `editMessageText` (chat_id + message_id).
**Batch (≥3 card):** satu pesan: `<b>Batch test ETM-xxxxx — N TC</b>` → `✅ a Passed · ❌ b Failed · ⏸ c Blocked` → satu baris per card `ETM-16707 ✅ <hal terpenting>` → card Error baru (bila ada) → `Detail ada di komentar tiap card Jira` → `cc @yemimatifani`.

## F. Drive (TIDAK dipakai secara default)
Bukti = data di environment bertanda nomor card + komentar Jira. Drive hanya bila Yemima menyuruh: root `Temuan Bugsy/` (id `167QtP9hNLYjDibgRL6DVd9nbgEDJ2dgU`), subfolder `{KEY}`; tool Drive hanya membuat file baru.

## G. Template komentar non-TC (Jira)
```
Hasil test: LULUS (<satu kalimat>)
<tanggal, jam> WIB · Staging · company <X> · login <akun> · data <SKU/dokumen>
Hasil per Expected: (daftar angka eksak, 0 request / N dari N kasus)
Catatan: (hal tak sengaja, data awal tidak diketahui, versi build)
```

## H. Alat bawaan (folder tools/)
`tools/jira.sh` (curl Jira; `JV=2` untuk REST v2; `OLSHOP_ENV_FILE` menunjuk `.env`) dan `tools/qm.py` (DB baca-saja: `from qm import show; show("judul","SQL")`). Folder scratchpad agen bisa terhapus antar-hari; alat ini tinggal dipakai, jangan ditulis ulang.
