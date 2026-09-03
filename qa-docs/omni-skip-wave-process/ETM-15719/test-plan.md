# Test Plan: ETM-15719 — Implementasi Advanced Filter (SearchBuilder) pada Skip Wave Process

- **Origin Card:** [ETM-15719](https://erpintegration.atlassian.net/browse/ETM-15719) — `[Skip Wave Process] Tambahkan advanced filter`
- **Menu Target:** Omni Channel -> **Skip Wave Process** (`/omni/skip-wave-process` / `omni-skip-wave-process`)
- **Target Host Testing:** `https://merdian.olshoperp.com/login`
- **Credential:** `yemimamerdian@gmail.com` / `12345678`
- **Metode Pengujian:** Web UI Crawling Only (Strict Search / Read-Only; Dilarang modifikasi data pada server Merdian)
- **Request ID:** `recvu1jXwU7V5R`
- **Owner / Author:** QA - Yemima

---

## 🎯 Tujuan Pengujian
Memvalidasi fungsionalitas fitur **Advanced Filter (SearchBuilder)** pada menu **Skip Wave Process**, memastikan:
1. Setiap variabel/katalog key memiliki 1 Test Case khusus yang menguji seluruh operator filter yang didukung (`string`, `num`, `moment/datetime`).
2. Melakukan breakdown eksplisit pada variabel yang merepresentasikan 2 konteks data dalam 1 kolom UI (misal: *Wave Start & End* $\rightarrow$ variabel memfilter *Wave Start*, dan *Processing Start & End* $\rightarrow$ variabel memfilter *Processing Start*).
3. Memastikan pemetaan alias kata pada *Skip Wave Summary* berjalan akurat.
4. Memvalidasi logika kombinasi multi-kriteria (**AND** / **OR**) serta fungsi **Clear** filter.
5. Memverifikasi integritas datalist hasil pencarian melalui Web UI Crawling pada host `merdian.olshoperp.com`.

---

## 🔍 Analisis Breakdown Variabel (1 Kolom UI vs 2 Konteks Data)

| Label di SearchBuilder UI | Key / Field Backend | Tipe Data | Analisis Perilaku Sistem (Bagian Data yang Difilter) |
|---|---|---|---|
| **Batch Code** | `batch_code` | `string` | Memfilter kolom kode batch `SW...` |
| **Wave Start & End** | `wave_start_formatted` | `moment` | **Breakdown:** Kolom UI menampilkan 2 data (Wave Start & Wave End). Namun, variabel SearchBuilder `wave_start_formatted` memproses query `MIN(omni_unassign_wave_logs.created_at)` yang **hanya memfilter tanggal Wave Start**. Data Wave End tidak menjadi filter kriteria. |
| **Processing Start & End** | `proc_start_formatted` | `moment` | **Breakdown:** Kolom UI menampilkan 2 data (Processing Start & Processing End). Namun, variabel SearchBuilder `proc_start_formatted` memproses query `MIN(scm_skip_processing_logs.created_at)` yang **hanya memfilter tanggal Processing Start**. Data Processing End tidak menjadi filter kriteria. |
| **Processing Date** | `processing_date` | `moment` | Memfilter tanggal pemrosesan order batch. |
| **Skip Wave Summary** | `skip_wave_summary_formatted` | `string` | Memetakan kata alias ke status: `completed/success/done` $\rightarrow$ Completed; `failed/fail` $\rightarrow$ Failed; `processing/in progress/queue` $\rightarrow$ Processing/Pending/In Queue. |
| **Total Order** | `total_sales_order` | `num` | Memfilter total kuantitas Sales Order dalam batch. Operator `between` dinonaktifkan. |
| **Wave Progress** | `wave_progress_formatted` | `num` | Memfilter persentase progres unassign wave (`0` - `100`). |
| **Skip Processing** | `processing_progress_formatted` | `num` | Memfilter persentase progres 5-stage skip processing (`0` - `100`). |
| **Created At** | `created_at_formatted` | `moment` | Memfilter waktu pembuatan record batch (`created_at`). |
| **Created By** | `created_by_formatted` | `string` | Memfilter username pembuat batch (kolom tersembunyi di grid). |
| **Owner Company** | `owner_company_formatted` | `string` | Helper filter company owner (verifikasi visibilitas dropdown). |

---

## 📋 Matriks Test Case per Variabel / Key (12 Skenario)

| No | Kode Skenario | Test Type | Variabel / Key | Operator yang Diuji | Ringkasan Expected Result |
|:---:|:---|:---:|:---|:---|:---|
| 1 | `SC-SKWP-15719-01` | **`happy`** | **Batch Code** (`batch_code`) | `=`, `!=`, `contains`, `!contains`, `starts_with`, `!starts_with`, `ends_with`, `!ends_with`, `empty`, `!empty` | Datalist memfilter baris yang kodenya cocok dengan kriteria operator string. |
| 2 | `SC-SKWP-15719-02` | **`happy`** | **Wave Start & End** (`wave_start_formatted`) | `=`, `!=`, `<`, `>`, `between`, `not between`, `empty`, `!empty` | Filter mengevaluasi waktu **Wave Start**; baris dengan waktu start di luar range tidak muncul. |
| 3 | `SC-SKWP-15719-03` | **`happy`** | **Processing Start & End** (`proc_start_formatted`) | `=`, `!=`, `<`, `>`, `between`, `not between`, `empty`, `!empty` | Filter mengevaluasi waktu **Processing Start**; baris tanpa log processing match dengan `empty`. |
| 4 | `SC-SKWP-15719-04` | **`happy`** | **Processing Date** (`processing_date`) | `=`, `!=`, `<`, `>`, `between`, `not between`, `empty`, `!empty` | Datalist memfilter tanggal transaksi pemrosesan batch secara tepat. |
| 5 | `SC-SKWP-15719-05` | **`happy`** | **Skip Wave Summary** (`skip_wave_summary_formatted`) | `=`, `!=`, `contains`, `!contains` (dengan alias kata) | Input kata `completed/success`, `failed/fail`, `processing/queue` menyaring status batch terkait secara akurat. |
| 6 | `SC-SKWP-15719-06` | **`happy`** | **Total Order** (`total_sales_order`) | `=`, `!=`, `<`, `<=`, `>`, `>=`, `empty`, `!empty` | Datalist memfilter jumlah SO secara numerik; verifikasi operator `between` dinonaktifkan. |
| 7 | `SC-SKWP-15719-07` | **`happy`** | **Wave Progress** (`wave_progress_formatted`) | `=`, `!=`, `<`, `<=`, `>`, `>=`, `empty`, `!empty` | Datalist menyaring persentase wave progress (misal `= 100` atau `< 100`). |
| 8 | `SC-SKWP-15719-08` | **`happy`** | **Skip Processing** (`processing_progress_formatted`) | `=`, `!=`, `<`, `<=`, `>`, `>=`, `empty`, `!empty` | Datalist menyaring persentase progress pemrosesan skip wave. |
| 9 | `SC-SKWP-15719-09` | **`happy`** | **Created At** (`created_at_formatted`) | `=`, `!=`, `<`, `>`, `between`, `not between` | Datalist menyaring batch berdasarkan timestamp pembuatan record. |
| 10 | `SC-SKWP-15719-10` | **`happy`** | **Created By** (`created_by_formatted`) | `=`, `!=`, `contains`, `!contains`, `starts_with`, `ends_with`, `empty`, `!empty` | Menyaring batch berdasarkan username creator meskipun kolom disembunyikan (*hidden*). |
| 11 | `SC-SKWP-15719-11` | **`edge`** | **Owner Company** (`owner_company_formatted`) | Dropdown availability & filtering | Memverifikasi ketersediaan dan stabilitas opsi Owner Company pada dropdown Advanced Filter. |
| 12 | `SC-SKWP-15719-12` | **`edge`** | **Multi-Kriteria (Logika AND / OR & Clear Filter)** | Kombinasi AND, OR, dan Clear Filter | Kombinasi 2+ filter dengan AND (semua cocok) dan OR (salah satu cocok) bekerja valid, serta Clear mengembalikan seluruh data. |

---

## 🔒 Protokol Keamanan Server Merdian (Strict Guidelines)
1. URL Target: `https://merdian.olshoperp.com/login`
2. Kredensial: `yemimamerdian@gmail.com` / `12345678`
3. **Dilarang Melakukan Modifikasi Data Apapun:** Tidak boleh membuat batch baru, mengedit data, menekan Stop Queue, menghapus baris, atau memicu proses API mutasi.
4. **Hanya Interaksi Search & Query:** Hanya diperbolehkan membuka menu Skip Wave Process, membuka modal Advanced Filter, memilih kriteria/operator, menekan Apply, memeriksa kecocokan data yang tampil pada datalist, dan menekan Clear Filter.
