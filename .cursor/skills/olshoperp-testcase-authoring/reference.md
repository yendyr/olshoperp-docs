# Referensi — olshoperp-testcase-authoring

Tidak ada token/password di file ini. Kredensial hanya dari `.env` repo `olshoperp` (path bisa diatur lewat env `OLSHOP_ENV_FILE`).

## A. Field card Test Case (Jira ETM, REST v3 ADF)
| Field | Key | Isi |
|---|---|---|
| Issue type | `issuetype.id` | Test Case `10051` (Error `10033`, Improvement `10088`, Change Requirement `10048`) |
| Summary | `summary` | `[Nama Menu] - deskripsi (tipe)` |
| Description | `description` | ADF (tabel `table/tableRow/tableHeader/tableCell`, `orderedList` bersarang `bulletList` jalan) |
| Menu / Notion Page | `customfield_10429` | nama menu persis di aplikasi |
| Request ID | `customfield_10495` | salin dari card origin (atau `none`) |
| Story Points | `customfield_10043` | 1 |
| Labels | `labels` | `[ETM-origin, "test-case", "test-type-<tipe>"]` |
| Priority | `priority.name` | High untuk alur utama/celah penting, selain itu Medium |
| Assignee | `assignee.accountId` | akun Yemima `70121:4ae91cca-e288-40ee-aed0-32b6050a1bc1` |
| Relasi | `POST issueLink` | tipe `Relates`, inwardIssue = TC baru, outwardIssue = origin |

Status awal otomatis "Not Execute". Jeda 2,5 detik antar create/update/link. Lampiran Jira dinonaktifkan di site ETM.

## B. Alat (folder tools/)
- `jira.sh` — curl Jira (`JV=2` untuk REST v2). Contoh: `tools/jira.sh GET "issue/ETM-1?fields=summary,status"`.
- `qm.py` — DB baca-saja lewat webhook n8n: `from qm import show; show("judul","SELECT ...")`. Header `X-API-Key` dari env `DB_DEBUG_API_KEY` di `.env`. Hasil kosong = 0 baris; query join berat kadang kosong, ulangi lebih sederhana.
- `tc_lib.py` — `python3 tc_lib.py file_data.py create|update`; membuat/memperbarui card dari struktur data dan menautkannya ke origin; kunci card disimpan di `file_data_keys.json`.
- `example_tc_data.py` — contoh struktur (CFG + TCS).

## C. Struktur satu TC (ringkas)
`n`, `ttype`, `priority`, `title`, `summary`, `req` (rujukan requirement), `menu_hint`, `pre` (prasyarat khusus TC), `data_tables` [(judul, header, baris)], `steps` [(teks, [cek…])], `expected` [..], `notes` [..]. `CFG`: `origin`, `request_id`, `menu_label`, `company_label`, `list_url`, `pre_common`, `cleanup`, `card_flow`.

## D. Tabel DB yang sering dipakai untuk data uji
`accounting_payments` (AP/AR/DN/CN lewat `type`), `accounting_payment_details|detail_funds|detail_deposits|detail_adjustments`, `accounting_supplier_invoices`, `accounting_customer_invoices`, `gs_company_detail_banks`, `accounting_chart_of_accounts`, `gs_companies` (supplier/customer), `bd_pricelists` (`product_id` = `scm_products`). Cek reservasi: `transaction_status IN ('draft','open')` pada dokumen yang memakai invoice/note itu.

## E. Menu keuangan: pelajaran yang sudah terbukti
- Isian "to be Paid Amount (kode)" di Account Payment/Receive selalu dalam mata uang header; kolom kanan hanya tampilan. Summary = angka yang diketik, kecuali lewat tombol Allocate Full Amount (Clearing): sisa invoice dikonversi (invoice valas × kurs invoice; header valas ÷ kurs header).
- Header terkunci (kurs, currency, supplier/customer, tanggal) selama ada detail/source/adjustment: "Cannot edit Header when detail data exists. Please clear all details first."
- AP header valas hanya memuat PI currency header atau IDR; AR tidak memfilter per currency.
