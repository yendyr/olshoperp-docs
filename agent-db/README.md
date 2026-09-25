---
doc_type: agent-db-catalog
version: 5.1
last_updated: 2026-09-24
owner: QA - Yemima
---

# Agent DB — nama menu → tabel

Untuk agent yang menjalankan `agent-db-query.mjs` ke **tyas / staging / merdian** (read-only).
Tujuan: tidak menebak nama tabel / kolom → tidak kena HTTP 500 `Unknown column` berulang.

- Cache nama tabel: [`cache.md`](cache.md)
- Rule: `.cursor/rules/19-database-data-verification.mdc` (docs) · `olshoperp/.cursor/rules/19-database-debugger.mdc` (developer)
- Gate QA: `tests/DATA-VERIFICATION.md`

Hasil DB **bukan** bukti TC passed. Cache **bukan** daftar lengkap — tumbuh saat agent belajar hal baru.

---

## Konsep: empat kosa kata, jangan dicampur

User menyebut **nama menu**, bukan `scm_` / `omni_`.

| Sumber | Contoh | Boleh jadi nama kolom/tabel? |
|--------|--------|------------------------------|
| User / nama menu | "Purchase Order approved" | Tidak |
| Teks UI | "Approved", radio "Draft" | Tidak |
| Frontend (Vue / accessor) | `transaction_status_id`, `transaction_status_formatted` | **Tidak** — bukan kolom DB |
| Database | `scm_purchase_orders.transaction_status = 'approved'` | Ya (setelah DESCRIBE) |

Pola umum:

- `status` = flag aktif 1/0 — **bukan** status dokumen.
- Status dokumen PR / PO / journal / payment / invoice = `transaction_status` (lowercase: `draft`, `open`, `approved`, `processed`, `void`, …).
- `*_formatted` dan `*_id` dari v-model Vue **bukan** kolom.
- Sales Order (`omni_sales_orders`) punya banyak kolom `*status*` — DESCRIBE wajib.
- `requirement.md` = arti & expected, **bukan** sumber nama tabel/kolom.
- Jangan pakai `olshoperp/docs/db-schema/` untuk nama kolom (generator hanya membaca `Schema::create`, tidak lengkap).

---

## Sequence Baru: Zero-Exploration (Fast & Token Efficient)

Agent **DILARANG** melakukan query eksplorasi (`SHOW TABLES LIKE` dan `DESCRIBE`) jika tabel sudah tercatat di `schema-catalog.yaml` atau `cache.md`.

```
S0  CEK KONTEKS & LOKAL: Jika skema sudah diketahui dari konteks sesi, JANGAN baca file berulang. Jika belum, cek `agent-db/cache.md`. Buka `agent-db/schema-catalog.yaml` HANYA jika butuh detail index dan kolom (0 HTTP Request).
S1  SCOPE MULTI-TENANT: Gunakan `owned_by = <company_id>` (Bukan `company_id`).
    Hampir seluruh tabel SCM, Omni, Accounting, dan Gate menggunakan `owned_by` dengan composite index `(owned_by, is_all_company, deleted_at)`.
S2  INDEX-AWARE FILTER: Susun WHERE clause HANYA menggunakan kolom yang ada di daftar index schema-catalog.yaml.
    - omni_sales_orders: order_no / reference_no / created_at range
    - audits: auditable_type ('App\\\\Models\\\\...') AND auditable_id
S3  ONE-SHOT SELECT: Langsung kirim 1 query SELECT spesifik dengan LIMIT.
    Dilarang SELECT * pada tabel besar (scm_item_stocks, omni_sales_orders, audits).
S4  FALLBACK (HANYA jika tabel BENAR-BENAR belum ada di catalog):
    Boleh 1x DESCRIBE hanya untuk tabel baru yang tidak ada di schema-catalog.yaml.
S5  WRITE-BACK & COMMIT: Tambahkan tabel baru tersebut ke schema-catalog.yaml / cache.md (lihat § S6).
```

**Anti-boros Usage & Anti-Spam (Mutlak):**

| Lakukan | Dilarang Keras |
|---------|----------------|
| Baca `schema-catalog.yaml` lokal dulu (S0) | Kirim `SHOW TABLES LIKE '%...%'` ke DB |
| Langsung SELECT kolom spesifik | Kirim `DESCRIBE <table>` untuk tabel yang sudah di catalog |
| Filter `WHERE owned_by = <company_id>` | Tebak `WHERE company_id = ...` (tidak ada kolomnya) |
| Gunakan exact match (`=`) atau prefix `LIKE 'OT-%'` | Gunakan `LIKE '%keyword%'` (leading wildcard = Full Table Scan) |
| Filter `audits` dengan `auditable_type` + `auditable_id` | Query `audits` hanya dengan `user_id` atau `event` (full scan) |
| Escaping `App\\\\Models\\\\X` di JSON payload | Kirim backslash tunggal `App\Models\X` (kena 422) |

---

## S6 — write-back, anti-dobel, auto commit & push `main`

**Kapan:** miss di S0–S1 lalu ketemu lewat S3/S4, **atau** baris cache ternyata salah (500 / Unknown column / arti kolom salah). **Bukan** setiap query.

Jalankan di repo **olshoperp-docs** (dari olshoperp: `git -C ../olshoperp-docs …`):

1. `git pull --rebase --autostash` — ambil cache terbaru dari user lain.
2. Cek dobel dengan kunci **Menu + Table**:
   - Sudah ada dan benar → **jangan ubah, jangan commit.** Selesai.
   - Sudah ada tapi salah → perbaiki baris itu di tempat (bukan baris baru).
   - Belum ada → tambah 1 baris di section modul yang sesuai (bukan di bawah file).
3. Jangan dump hasil DESCRIBE. Jangan tambah sinonim ke baris yang sudah benar.
4. Auto commit **tanpa tanya user** — hanya `agent-db/cache.md`:
   ```bash
   git add agent-db/cache.md
   git commit -m "<pesan>" -- agent-db/cache.md
   ```
   - baris baru: `docs(agent-db): add cache {Menu} -> {table}`
   - perbaikan: `fix(agent-db): correct cache {Menu} -> {table}`
5. `git pull --rebase --autostash` lalu `git push origin main`.
   - Konflik di `cache.md`: gabungkan, sisakan 1 baris per Menu + Table, `git rebase --continue`, push lagi (maks 1 retry).
   - Konflik file lain / branch bukan `main` / push ditolak setelah retry: **STOP**, jangan force push, laporkan ke user.
6. Lapor 1 baris ke user: `cache.md di-update & di-push: {pesan commit}`.

Agent dari repo **olshoperp**: tulis & commit di `../olshoperp-docs` (bukan branch ETM olshoperp). Kalau folder sibling tidak ada → jangan buat cache di olshoperp; laporkan baris usulan ke user.

### Format baris baru

```md
| {Nama Menu UI} | {kata user lain} | `{table}` | {jebakan singkat} |
```

Nama menu sama tapi beda tabel per modul → tulis modul di kolom Menu, mis. `Sales Return (Omni)`.
