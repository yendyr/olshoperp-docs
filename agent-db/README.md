---
doc_type: agent-db-catalog
version: 5.0
last_updated: 2026-09-14
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

## Sequence S0–S6

S0–S3 = cari **nama tabel**. Tabel ketemu → lanjut S4 (bukan langsung SELECT).

```
S0  Cari nama menu / kata user di cache.md (kolom Menu + Tebakan). Ketemu tabel → S4.
S1  Cheat sheet di rule 19. Ketemu tabel → S4.
S2  Peta prefix dari nama menu:
      PO / PR / inbound / outbound / transfer / System Product / warehouse → scm_
      SO / store / wave / Manage Platform Product → omni_
      Journal / COA / invoice / payment / CN / DN / tax → accounting_
      User / role → gate_
      Company → gs_
    Pengecualian: Sales Return & Purchase Return (menu Accounting / SCM) = scm_stock_mutations.
    Adjustment Inbound/Outbound (Accounting): kemungkinan scm_stock_mutations
      (is_inventory_adjustment = 1) — belum diverifikasi, DESCRIBE dulu.
S3  SHOW TABLES LIKE '%keyword%' (saring prefix S2).
    System Product → scm_products; Manage Platform Product → omni_products.
    Ambigu → DESCRIBE kandidat, jangan SELECT tebakan.
S4  DESCRIBE <tabel> — 1× per tabel per sesi.
    Wajib jika kolom yang akan dipakai belum tercatat di cache atau belum di-DESCRIBE di sesi ini.
    Wajib untuk omni_sales_orders.
S5  SELECT hanya kolom yang muncul di DESCRIBE.
    company_id / deleted_at hanya jika kolomnya ada di DESCRIBE.
    HTTP 500 / Unknown column → STOP menebak → DESCRIBE → perbaiki query → maks 1 retry.
S6  Write-back cache.md + auto commit & push (lihat bawah). Hanya kalau belajar hal baru.
```

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
