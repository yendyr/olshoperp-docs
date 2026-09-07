# Data Verification — Level Cek (UI → API → DB)

Kontrol operasional untuk **Antigravity / agent QA** di workspace `olshoperp-docs`.
Ini **bukan** dokumentasi menu bisnis (`qa-docs/{menu}/`). SoT teknis runner + keamanan
query ada di repo developer:

- Rule: `../olshoperp/.cursor/rules/19-database-debugger.mdc`
- Runner: `../olshoperp/scripts/agent-db-query.mjs`

Baca halaman ini saat perlu **cek data di DB** (precondition, forensik FAIL, audit).
Jangan pakai DB sebagai pengganti assert UI untuk menandai TC `passed`.

---

## Level cek (pilih yang paling rendah yang cukup)

| Level | Alat | Kapan | Boleh jadi bukti TC `passed`? |
|-------|------|-------|-------------------------------|
| **L1 UI** | Playwright CLI + POM / Browser MCP (observasi) | Default act & assert TC | **Ya** — hanya CLI + `via:` path spec (atau `manual:{Nama}` + notes) |
| **L2 API read** | `page.request` / network response (hati-hati) | Debug payload, select2, status HTTP | Tidak sendirian |
| **L3 DB read** | Webhook via `agent-db-query.mjs` | Precondition (“id X ada di company Y?”), FAIL forensik, UI ≠ DB, audit trail | **Tidak** — supporting evidence saja |

> [!CAUTION]
> Hasil L3 DB **dilarang** menulis `last_execution.status: passed` untuk TC yang
> expected-nya UI crawling (rule `13`/`14` §8). Catat sebagai observasi di chat /
> Additional Context Jira / `notes` investigasi — bukan status eksekusi TC.

---

## Matriks environment & webhook

| Env app | Host (contoh) | Flag `--db=` | Webhook |
|---------|---------------|--------------|---------|
| **Staging** | staging.olshoperp.com | `staging_olshoperp` | **Shared** dengan Tyas (`DB_DEBUG_WEBHOOK_URL` → default path `agent-db-tyas` di n8n) |
| **Tyas** | tyas.olshoperp.com | `tyas_olshoperp` | **Shared** dengan Staging (webhook yang sama) |
| **Merdian** | merdian.olshoperp.com | `merdian_olshoperp` | **Terpisah** (`DB_DEBUG_WEBHOOK_URL_MERDIAN` → host n9n / path `agent-db-merdian`) |

Runner memilih URL & key otomatis dari flag `--db=` — **jangan** hardcode API key di
command, chat, TC markdown, atau commit.

Kredensial (hanya di `.env` lokal / mesin agent, tidak di repo docs):

| Env var | Dipakai untuk |
|---------|----------------|
| `DB_DEBUG_API_KEY` | Tyas + Staging (shared) |
| `DB_DEBUG_WEBHOOK_URL` | Override URL Tyas/Staging (opsional) |
| `DB_DEBUG_API_KEY_MERDIAN` | Merdian (jika beda key) |
| `DB_DEBUG_WEBHOOK_URL_MERDIAN` | Override URL Merdian (opsional) |

---

## Cara jalankan (dari mesin yang punya akses)

Workspace agent sering di `olshoperp-docs`. Runner hidup di sibling `olshoperp`:

```bash
# Dari root olshoperp-docs (path sibling)
node ../olshoperp/scripts/agent-db-query.mjs --db=staging_olshoperp --query="SELECT id, code FROM products WHERE company_id = 153 AND id = 12345 LIMIT 5"

node ../olshoperp/scripts/agent-db-query.mjs --db=tyas_olshoperp --query="SELECT id, user_id, event, auditable_type, auditable_id, created_at FROM audits WHERE auditable_id = 12345 ORDER BY created_at DESC LIMIT 10"

node ../olshoperp/scripts/agent-db-query.mjs --db=merdian_olshoperp --query="SELECT id, code, transaction_status FROM purchase_orders WHERE company_id = 153 AND id = 999 LIMIT 5"
```

Atau `cd ../olshoperp` lalu `node scripts/agent-db-query.mjs ...` — sama saja.
Detail guard read-only + forensik 4 langkah → rule `19` di `olshoperp`.

---

## Gate QA wajib (setiap query)

1. **Read-only** — hanya `SELECT` / `EXPLAIN` / `DESCRIBE` / `SHOW` / `WITH`. Runner
   memblokir mutasi; jangan usulkan `UPDATE`/`DELETE`/`INSERT` ke user.
2. **Multi-tenant** — filter `company_id` (atau kolom scope setara) sesuai company uji.
   Default E2E staging sering **FAT (112)** atau **lumicharmsid (153)** — jangan campur.
3. **SoftDeletes** — jika “tidak ketemu”, cek `deleted_at IS NOT NULL` / `withTrashed` di model.
4. **Jangan paparkan secret** — tidak ada key di argumen shell, screenshot, atau file TC.
5. **Merdian** — treat sebagai produksi tenant lain: query lebih sempit, LIMIT ketat,
   jangan exploratory sweep besar tanpa instruksi user.

---

## Kapan pakai L3 DB (YA)

- Precondition: pastikan master/transaksi id ada di company yang benar sebelum E2E.
- FAIL UI: status/harga/qty di layar ≠ dugaan — verifikasi baris tabel + `audits`.
- Investigasi bug card: data hilang, soft-delete, siapa ubah field (user_id + url di `audits`).
- User eksplisit: “cek db staging/tyas/merdian …”.

## Kapan jangan (TIDAK)

- Mengklaim TC / flow E2E **passed** hanya karena baris DB “kelihatan benar”.
- Mengganti hard gate UI (harga > 0, WH level, outbound approved, toast sukses).
- Menulis hasil query ke `last_execution` sebagai pengganti run Playwright / manual bernama.
- Menyimpan webhook URL + API key di `qa-docs/` atau frontmatter TC.

---

## Pelaporan ke user / Jira

Saat L3 dipakai, laporkan ringkas:

1. Env + `--db=` yang dipakai (bukan URL/key).
2. Pertanyaan yang dijawab (1 kalimat).
3. Temuan faktual (id, status, company_id, deleted_at bila relevan).
4. Label jelas: **Catatan DB (supporting)** — bukan “test passed”.

Untuk card Jira: masukkan ke **Additional Context** / Actual Result investigasi;
Expected Result tetap dari `requirement.md` (rule `12`).

---

## Pointer terkait

| Butuh | Baca |
|-------|------|
| Protokol forensik + larangan mutasi (SoT) | `olshoperp/.cursor/rules/19-database-debugger.mdc` |
| Pointer agent di workspace docs | `.cursor/rules/19-database-data-verification.mdc` |
| Assert TC / CLI vs MCP | `tests/AGENT-RUNBOOK.md`, rule `14` §6B |
| Company allowlist E2E | rule `13` §4 / `14` §7 |
