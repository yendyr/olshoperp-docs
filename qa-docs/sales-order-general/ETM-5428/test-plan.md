# Test Plan: ETM-5428 — Watermark VOIDED pada Print Dev - Sales Order berstatus VOID

- **Origin Card:** [ETM-5428](https://erpintegration.atlassian.net/browse/ETM-5428) — `[Sales Order General - Print] Kasih watermark 'VOIDED' di halaman print out yang status transaksinya VOID`
- **Tipe card:** Sub Story (QA Review)
- **Menu Target:** Dev - Sales Order (`sales-order-general` / `/businessdevelopment/sales-order-general`)
- **Staging URL:** `https://staging.olshoperp.com/businessdevelopment/sales-order-general`
- **Request ID:** `none`
- **Owner / Author:** QA - Rachmatulloh Yendy
- **Intent:** `new` — 0 reuse (folder `qa-docs/sales-order-general/test-cases/` belum ada; scan TC existing menu ini = kosong)
- **Company default eksekusi TC:** FAT (`id: 112`) per rule 13. Card menyebut fixture **PT KOMI** + `jenni_qa@mail.com` — bukan allowlist Playwright; dicatat di body TC, bukan `execution_company`.
- **Metode:** Web UI crawling (buka dokumen → **Print** → cek halaman print out)

---

## Tujuan Pengujian

Memastikan card **ETM-5428** teruji sebagai **tiga skenario terpisah** (bukan satu TC gabungan):

1. **Happy** — Print Sales Order General berstatus **Void** menampilkan watermark **VOIDED**.
2. **Negative** — Print Sales Order General berstatus **Approved** **tidak** menampilkan watermark **VOIDED**.
3. **Edge** — Print Sales Order General berstatus **Closed** **tidak** menampilkan watermark **VOIDED**, karena requirement memisahkan **Closed ≠ Void**.

Print / watermark **bukan** acceptance yang sudah tertulis di requirement. Semua expected print memakai label **`[MENUNGGU REQUIREMENT]`**. Yang boleh di-assert dari SoT hari ini hanya siklus status Void / Approved / Closed.

---

## Validasi vs Requirement

| Sumber | Status layer | Isi yang relevan | Cukup untuk expected print? |
|---|---|---|---|
| `qa-docs/sales-order-general/requirement.md` §3 Siklus Status | **review** | Status `approved` / `closed` / `void`; tombol **Void Doc**, **Close Doc**, **Duplicate**; aturan **Closed ≠ Void** | Tidak — tidak ada Print |
| `qa-docs/sales-order-general/requirement.md` §7.5 Void / Close / Delete | **review** | Close Doc → `closed` (terkunci, bukan Void). Void Doc dari approved → `void` (bisa diblokir jika terkait outbound/invoice) | Tidak — tidak ada Print / watermark |
| `qa-docs/sales-order-general/requirement.md` §4 Datalist | **review** | Kolom **Trx. Status**; tidak ada aksi Print di tabel kolom | Tidak |
| `qa-docs/sales-order-general/requirement.md` §9 Gap Registry | **review** | GAP-SOG-01…15 — tidak ada gap print/watermark | Tidak |
| `qa-docs/sales-order-general/knowledge-base.md` / `user-guide.md` / `technical.md` | **review** | Status Void/Closed sama semangat §3; **tidak ada** kata Print / watermark / VOIDED | Tidak |
| Card ETM-5428 | QA Review | Expected card: watermark `VOIDED` di halaman print out yang status transaksinya VOID | Bukan SoT — hanya kandidat expected |

**Kesimpulan QA:** requirement **review** (boleh jadi acuan status), tetapi fitur Print + watermark **belum terdokumentasi**. Expected print di setiap TC wajib `[MENUNGGU REQUIREMENT]`. String error UI print **tidak dikarang**.

**Catatan QA (bukan AS-IS print):** Negative + edge adalah implikasi lingkup card (“hanya VOID”) + aturan **Closed ≠ Void** (§3 / §7.5). Bukan teks card. Kalau PM memutuskan Closed juga VOIDED, itu change requirement — bukan yang diuji di sini.

---

## Matriks Skenario (3 NEW)

| No | Kode Skenario | Test Type | Judul / Fokus | Expected core (card vs SoT) |
|:---:|:---|:---:|:---|:---|
| 1 | `SC-SOG-5428-01` | **happy** | Print SO **Void** → watermark **VOIDED** | Card: watermark VOIDED ada. SoT: status `void` lewat **Void Doc** (§3 / §7.5). Print = **[MENUNGGU REQUIREMENT]** |
| 2 | `SC-SOG-5428-02` | **negative** | Print SO **Approved** → **tanpa** watermark VOIDED | Card hanya menyebut VOID. SoT: `approved` bukan `void` (§3). Print = **[MENUNGGU REQUIREMENT]** |
| 3 | `SC-SOG-5428-03` | **edge** | Print SO **Closed** → **tanpa** watermark VOIDED | SoT: **Closed ≠ Void** (§3 / §7.5). Print = **[MENUNGGU REQUIREMENT]** |

Tidak ada reuse. Tidak ada skenario Draft/Open/Rejected print (card tidak menyebut; requirement tidak punya Print).

---

## Rincian Detail Skenario

### 1. SC-SOG-5428-01 — happy: Print SO Void → watermark VOIDED

- **Prekondisi:**
  - Login staging, company **FAT (112)** (default TC). Card fixture PT KOMI hanya catatan, bukan default.
  - Ada SO General **Approved** yang **belum** terkait outbound/invoice — supaya **Void Doc** tidak diblokir (§3 / §7.5).
  - User punya akses buka dokumen + aksi **Print** (label dari card; tombol tidak ada di requirement).
- **Langkah:**
  1. Buka **Dev - Sales Order** (`/businessdevelopment/sales-order-general`).
  2. Cari SO uji di datalist (kolom **Trx. Code** / **Trx. Status**).
  3. Jika masih Approved: buka dokumen → klik **Void Doc** → pastikan **Trx. Status** = Void.
  4. Dari halaman dokumen (tetap di konteks form/show), klik **Print**.
  5. Periksa halaman print out: ada/tidaknya teks watermark **VOIDED**.
- **Expected:**
  - Status dokumen = **void** (AS-IS requirement §3 / §7.5).
  - Print/watermark: **[MENUNGGU REQUIREMENT]**. Kandidat card: watermark **VOIDED** tampil di print out.
  - Jangan mengarang pesan error UI.

### 2. SC-SOG-5428-02 — negative: Print SO Approved → tidak ada VOIDED

- **Prekondisi:**
  - SO General berstatus **Approved** (bukan Void, bukan Closed).
  - Form Approved tidak editable; aksi yang terdokumentasi: **Void Doc**, **Close Doc** (§3) — **jangan** void/close dokumen ini.
- **Langkah:**
  1. Buka datalist Dev - Sales Order → filter/cari SO **Approved**.
  2. Buka dokumen via link **Trx. Code**.
  3. Pastikan **Trx. Status** tetap Approved.
  4. Klik **Print**.
  5. Periksa print out: tidak ada watermark **VOIDED**.
- **Expected:**
  - Status tetap **approved** (AS-IS §3).
  - Print/watermark: **[MENUNGGU REQUIREMENT]**. Kandidat QA dari lingkup card: **tidak** ada watermark VOIDED.
  - Jangan mengarang pesan error / toast.

### 3. SC-SOG-5428-03 — edge: Print SO Closed → tidak ada VOIDED (Closed ≠ Void)

- **Prekondisi:**
  - SO General berstatus **Closed** (hasil **Close Doc** dari Approved — §7.5).
  - Jangan memakai dokumen Void. Closed terkunci; bukan Void; bukan Duplicate-from-void (§3 / §7.5).
- **Langkah:**
  1. Buka datalist → cari SO **Closed** (atau Approved lalu **Close Doc** jika belum ada fixture Closed).
  2. Buka dokumen; pastikan **Trx. Status** = Closed (bukan Void).
  3. Klik **Print**.
  4. Periksa print out: tidak ada watermark **VOIDED**.
- **Expected:**
  - Status **closed** ≠ **void** (AS-IS §3 / §7.5 — “Jangan menyamakan Closed dengan Void”).
  - Print/watermark: **[MENUNGGU REQUIREMENT]**. Kandidat QA: Closed tidak mendapat watermark VOIDED.
  - Jangan mengarang string UI.

---

## Mapping Skenario → File TC

| Skenario | `test_type` | File | `tc_code` | Status |
|---|---|---|---|---|
| SC-SOG-5428-01 | happy | `qa-docs/sales-order-general/ETM-5428/test-cases/TC-SOG-DRAFT-20260918111407.md` | `PENDING-20260918111407` | draft / NEW |
| SC-SOG-5428-02 | negative | `qa-docs/sales-order-general/ETM-5428/test-cases/TC-SOG-DRAFT-20260918111408.md` | `PENDING-20260918111408` | draft / NEW |
| SC-SOG-5428-03 | edge | `qa-docs/sales-order-general/ETM-5428/test-cases/TC-SOG-DRAFT-20260918111409.md` | `PENDING-20260918111409` | draft / NEW |

Indeks folder: `qa-docs/sales-order-general/ETM-5428/test-cases/README.md`.

**Checklist konversi (rule 13 §5C):** 3 skenario test plan → 3 TC. Tidak ada skenario yang di-skip atau digabung.

---

## Strategi Data & Company

| Item | Ketentuan |
|---|---|
| Company TC | **FAT (112)** |
| Fixture card | PT KOMI disebut di card — **bukan** `execution_company`; pakai hanya jika prompter override |
| SO Void | Approved dulu, **tanpa** outbound/invoice, lalu **Void Doc** |
| SO Approved | Jangan void/close |
| SO Closed | **Close Doc** dari Approved; jangan samakan dengan Void |
| Print control | Label **Print** dari judul/expected card; selector/API print **tidak** ada di qa-docs |

---

## Yang tidak diuji di plan ini

- Print Draft / Open / Rejected
- Print All Sales Order / Dev - Sales Platform
- Duplicate dari Void
- Blokir Void Doc karena outbound/invoice (sudah di §7.5; bukan print)
- Automate Playwright (ketiga TC `automated: false`)

---

## Cara run (setelah TC di-acc)

Jalur sah = UI crawling / spec `@TC-*` setelah renumber. Jangan `tests/scripts/`. `last_execution` hanya terisi dari run CLI atau catatan manual bernama — **jangan** diisi saat create.
