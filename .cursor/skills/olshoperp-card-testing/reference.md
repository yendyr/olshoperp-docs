# Referensi teknis — olshoperp-card-testing

Buka file ini **hanya** untuk ID field, URL webhook, template pesan, atau perintah alat.
Aturan operasional = [SKILL.md](SKILL.md).  
**Jangan** cetak password / API token ke chat.

Kredensial: `.env` di repo `olshoperp` (override path: env `OLSHOP_ENV_FILE`).  
Akun uji khusus: `tests/TEST-ACCOUNTS.md` (di repo docs; tidak dimirror ke Help Center).

---

## A. Jira (site ETM saja)

- Site: `https://erpintegration.atlassian.net` — `cloudId` `44cc9820-3372-4c12-884c-698b1397173c` (bukan eduqat).
- Failed TC / RE-OPEN detail operasional: **SKILL.md §3–§4** (ringkas dari rule reopen).
- Auth: `JIRA_EMAIL` + `JIRA_API_TOKEN` (basic auth; `tools/jira.sh` pakai curl `-K -`).
- Issue type id: Error `10033`, Test Case `10051`, Improvement `10088`, Change Requirement `10048`.
- Field (**Test Case saja**): Test Result `customfield_10202` `{"value":"Passed|Failed"}` — **jangan** pakai `Blocked` sebagai hasil final; Actual Result `customfield_10203` (ADF). Non-TC: hasil di **komentar** (field Actual tidak tampil).
- Menu `customfield_10429`, Request ID `customfield_10495`, Story Points `customfield_10043`.
- **Transisi:** pakai **peta status di bawah langsung** (dipetakan 28-10-2026 dari card ETM nyata). `GET issue/{key}/transitions` **hanya jika** call gagal. **Id beda per tipe** — jangan campur TC vs non-TC.

### Peta status ETM (28-10-2026)

**Test Case / Subtask TC** — bebas pindah; **tidak ada RE-OPEN**:

| Ke status | Transition id (contoh) |
|-----------|------------------------|
| TESTING PROGRESS | `4` |
| Done | `2` |
| BLOCKED (status board, bukan Test Result) | `71` |
| Re-Test | `61` |
| Not Execute | `11` |
| Cancelled | `3` |

**Error / Improvement / CR / Story / Task** (global; sebagian CR/Story/Task diasumsikan sama Error/Improvement):

| Dari → ke | Transition id |
|-----------|---------------|
| → TESTING PROGRESS | `6` |
| → RE-OPEN | `10` |
| → Cancelled | `12` |
| → PENDING DISCUSSION | `351` |
| → BLOCKED | `361` |
| QA Review → Done | `291` |
| QA Review → Closed | `5` |
| QA Review → Rejected | `311` |
| OTW DEV → QA Review | `341` |
| In Progress → QA Review | `171` |
| To Do → In Progress | `11` |
| RE-OPEN → Done | `2` |
| TESTING PROGRESS → Done | `7` |
| BLOCKED → QA Review | `391` |

**Tidak ada** Done langsung dari To Do / In Progress / OTW DEV.

- Link: `Relates`; clone: `Cloners` (inward = clone, outward = origin).
- Lampiran file di Jira ETM sering nonaktif → bukti = teks komentar + data bertanda card di app.
- Jeda ~2,5 dtk antar create/update/link beruntun.
- Browse: `https://erpintegration.atlassian.net/browse/ETM-xxxxx`

Alat: `tools/jira.sh GET|POST|PUT "issue/…" [body.json]` — set `JV=2` bila perlu REST v2.

---

## B. Database baca-saja

| Env | Payload `"db"` | Webhook |
|-----|----------------|---------|
| Staging | `staging_olshoperp` | `https://n8n.olshoperp.com/webhook/agent-db-tyas` |
| Tyas | `tyas_olshoperp` | sama (shared) |
| Merdian | `merdian_olshoperp` | `https://n9n.olshoperp.com/webhook/agent-db-merdian` |

Header: `X-API-Key` dari `DB_DEBUG_API_KEY` (Merdian: `DB_DEBUG_API_KEY_MERDIAN` bila ada).

Alat cepat: `tools/qm.py` → `from qm import show; show("judul", "SELECT ... LIMIT 20")`  
atau HTTP POST setara (lihat `tests/DATA-VERIFICATION.md` bila butuh contoh curl panjang).

SoT aturan kapan boleh query = **SKILL.md §8** (jangan skip).

---

## C. Log server (opsional)

Dari sibling `olshoperp`:

```bash
node ../olshoperp/scripts/agent-log-fetch.mjs --server=staging|tyas|merdian \
  --file=laravel-YYYY-MM-DD.log --level=error --start=1 --end=50
```

Webhook log: staging/tyas via n8n `agent-log-tyas`; merdian via n9n `agent-log-merdian` (detail di `olshoperp` rule log debugger bila perlu).

---

## D. Playwright / company / UI

Playwright untuk uji card → **SKILL.md §7** (tidak ada skill `olshoperp-playwright-run`). Otomasi murni → `tests/AGENT-RUNBOOK.md`.

- **Urutan company Staging (default):** `153` lumicharmsid → `112` FAT → `13` DEV-STG. Prompter sebut spesifik → ikuti prompter.
- Allowlist lain bila diminta: Lumielle `810`, TANRISE `3`, HUAWEI `915`.
- Credential login per server: **SKILL.md §6** (staging/tyas `playwright@…`, merdian `yemimamerdian@…`; Tyas+Merdian **no create**).
- **Merdian:** tanpa kode approval exact `yemimamerdian` di pesan prompter → **tolak** (jangan login).
- Helper session: `tests/helpers/company-access.ts` — `prepareSession`, `switchCompanyByCode`.
- Kontrak komponen: **`tests/ui-components.md`** + helper `tests/helpers/shared/`.
- Probe sekali pakai: `tests/scratch/` atau `tests/specs/check-*.spec.ts` **tanpa** tag `@ETM`/`@FLOW` — hapus setelah selesai.
- Regresi: `tests/specs/...` bertag `@ETM-xxxxx`.
- **Dilarang** `tests/scripts/`.
- Contoh run probe: `npx playwright test path/ke/file.spec.ts --project=authenticated --reporter=line`.
- Base URL: `OLSHOP_BASE_URL` atau host sesuai server (staging / tyas / merdian).

---

## E. Telegram

- Grup OlshopERP: chat id `-1001931573603` (`t.me/c/1931573603`), thread/topik `51478`.
- Bot: `TELEGRAM_BOT_TOKEN` di `.env` olshoperp.
- `parse_mode=HTML`, mention `@yemimatifani`.
- Isi: judul → hasil → ✅/❌ per poin Expected → catatan → kode data uji → link Jira/evidence (lihat SKILL.md §10).
- Batch ≥3: satu pesan ringkasan; update via `editMessageText`.

---

## F. Drive

Default **tidak dipakai**. Hanya jika Yemima minta: folder root Temuan Bugsy (id di instruksi sesi lama); prefer bukti di environment + Jira.

---

## G. Template komentar non-TC

```
Hasil test: LULUS / GAGAL (<satu kalimat>)
<tanggal, jam> WIB · <Staging|Tyas> · company <X> · login <akun> · data <kode/URL>
Hasil per Expected: …
Catatan: …
```

---

## H. Membuat card Test Case

Bukan skill ini → `.cursor/skills/olshoperp-testcase-authoring/` (SKILL.md + reference.md di folder itu).
