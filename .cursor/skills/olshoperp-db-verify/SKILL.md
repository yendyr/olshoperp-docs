---
name: olshoperp-db-verify
description: >-
  Cek/query data DB OlshopERP via webhook (staging/tyas/merdian): precondition,
  forensik FAIL, audit, hitung kuantitatif. Read-only, anti-dump, owned_by.
  Pakai saat "cek db", "query staging/tyas/merdian", "audit trail", "siapa ubah",
  "ada di company belum". Bukan pengganti TC Passed. Bukan Q&A menu / test card.
---

# OlshopERP — Cek DB (hemat token)

**Baca file ini dulu** untuk tugas cek/query DB.  
**Jangan** load rule `19` + `DATA-VERIFICATION.md` penuh kecuali skill kurang.  
Webhook / contoh curl: [reference.md](reference.md). SoT teknis panjang: `olshoperp` rule `19` + `tests/DATA-VERIFICATION.md`.

---

## 0. STOP — salah jalur?

| Situasi | Arahkan |
|---------|---------|
| Assert TC / UI lulus | skill `olshoperp-card-testing` / Playwright — **bukan** DB |
| Error 500 / exception / stack | rule `21` (log) dulu; DB hanya cross-check id |
| Q&A menu / aturan bisnis | skill `olshoperp-qa-menu-ask` |
| User belum sebut **menu / kode transaksi-SKU / server** | **STOP** — minta kelengkapan (charter A.4) |
| List ≥ ~20 SO/SKU ditempel di chat | **STOP** — minta file `scratch/…` (charter A.2) |
| User minta UPDATE/DELETE/INSERT | **Tolak** — read-only saja |

---

## 1. Kapan boleh L3 DB

| YA | TIDAK |
|----|-------|
| Precondition: id/SKU ada di company X? | Klaim **TC Passed** hanya karena baris DB “benar” |
| Forensik FAIL: UI ≠ dugaan status/qty | Ganti assert UI / toast / gate hard |
| Audit: siapa ubah / soft-delete | Exploratory sweep besar di **Merdian** tanpa perintah |
| User eksplisit “cek db staging/tyas/merdian” | Mutasi SQL |
| Hitung kuantitatif / anomali (`COUNT`, distribusi) | Spam `SHOW TABLES` / `DESCRIBE` berulang |

Hasil = **Catatan DB (supporting)** — di komentar Jira / Additional Context. Field Actual Result hanya di card **TC**.

---

## 2. Zero-exploration (wajib)

1. Skema: `agent-db/cache.md` → bila perlu `agent-db/schema-catalog.yaml`. **Jangan** tebak nama tabel dari requirement saja.  
2. Tenant: filter **`owned_by`** (= company), bukan asal `company_id` (kecuali kolom tabel memang itu — cek catalog). SoftDeletes: `deleted_at IS NULL` (atau cek trashed jika “hilang”).  
3. Index-aware: `WHERE` pakai kolom berindeks; **dilarang** `LIKE '%x%'` (leading wildcard).  
4. **Satu** SELECT spesifik + `LIMIT` (kecuali agregasi `COUNT`/`GROUP BY` yang disengaja). Dilarang `SELECT *` tabel besar.  
5. Status dokumen sering = `transaction_status` (lowercase); `status` 1/0 = flag aktif.  
6. Tabel `audits`: wajib `auditable_type` + `auditable_id`. Di JSON body: `App\\\\Models\\\\…`.  
7. Fallback: tabel belum di catalog → **1×** `DESCRIBE` lalu catat (S6 cache bila alur resmi).

Dilarang: buat script `.mjs`/`.sh`/`.py` di repo; pakai `agent-db-query.mjs`/`.php`; hardcode API key di chat/commit.

---

## 3. Env & eksekusi

| Env | `db` body | Webhook |
|-----|-----------|---------|
| Staging | `staging_olshoperp` | n8n `agent-db-tyas` (shared) |
| Tyas | `tyas_olshoperp` | sama |
| Merdian | `merdian_olshoperp` | **n9n** `agent-db-merdian` |

- Key: `DB_DEBUG_API_KEY` (Tyas/Staging); Merdian: `DB_DEBUG_API_KEY_MERDIAN` fallback key yang sama.  
- **Hanya** HTTP `POST` JSON `{ "db", "query" }` + header `X-API-Key`. Contoh: reference §A.  
- Alat cepat di skill testing: `tools/qm.py` (folder card-testing) — tetap read-only.  
- Merdian = treat hati-hati (prod-like): query sempit, LIMIT ketat.

---

## 4. Jawaban ke manusia (anti-dump)

Wajib kuantitatif bila hitung populasi:

1. Env + nama `db` (bukan URL/key).  
2. Pertanyaan 1 kalimat.  
3. **N**, distribusi Count + %, formula/`GROUP BY` singkat.  
4. **Maks 3–5** contoh id/kode.  
5. Label: **Catatan DB (supporting)** — bukan test passed.

Dilarang paste JSON penuh / ratusan baris di chat. Detail besar → `scratch/` (jangan commit).

---

## 5. Checklist

- [ ] Konteks: menu / kode / server ada (atau user eksplisit cek db)
- [ ] Catalog/cache dibaca; `owned_by` + soft-delete sadar
- [ ] HTTP webhook benar (Merdian = n9n); no secret di chat
- [ ] Read-only; one-shot; anti leading `%`
- [ ] Jawaban: N + % + ≤5 contoh + label supporting
