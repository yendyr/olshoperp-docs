# User Activity Hub (n8n)

Ingest last-menu activity dari FE Tyas & Merdian, simpan upsert per `(env, user_id)`, export JSON untuk dashboard di `dashboard/user-activity.html`.

**System of record = n8n Data Store** — jangan commit snapshot activity ke git.

## Import

1. Buka n8n → **Workflows** → Import from file  
   `n8n/user-activity/user-activity-hub.workflow.json`
2. Buat **Data Store** (mis. `user-activity-users`)
3. Di node `Data Store Get` / `Set` / `Get All`: pilih Data Store itu (ganti `REPLACE_WITH_DATA_STORE_ID`)
4. Activate workflow
5. Catat URL production:
   - **Ingest (POST):** `https://n8n.olshoperp.com/webhook/user-activity`
   - **Export (GET):** `https://n8n.olshoperp.com/webhook/user-activity-export`

> Path webhook mengikuti setting node. Sesuaikan jika instance memakai prefix `/webhook-test/` saat inactive.

## Optional export secret

Set env di n8n:

```text
USER_ACTIVITY_EXPORT_SECRET=<random>
```

Dashboard fetch: `.../user-activity-export?token=<same>`

Tanpa secret, export terbuka (hanya untuk LAN/ops internal singkat — disarankan set secret).

## Payload ingest (dari FE)

```json
{
  "env": "tyas",
  "user_id": 123,
  "username": "ops.user",
  "company_id": 112,
  "company_code": "FAT",
  "menu_slug": "supplychain-new-purchase-inbound",
  "menu_path": "/supplychain/new-purchase-inbound",
  "event": "open",
  "method": "GET",
  "at": "2026-08-28T15:00:00.000Z"
}
```

`event`: `open` | `write`

## Record tersimpan (per key `env:user_id`)

| Field | Arti |
|-------|------|
| `last_opened_menu` / `_at` / `_path` | Route terakhir (debounce FE 60s) |
| `last_write_menu` / `_at` / `_path` / `_method` | Mutasi API terakhir |
| `username`, `company_*` | Identitas display |

## FE env (Tyas / Merdian build)

```env
VITE_USER_ACTIVITY_WEBHOOK_URL=https://n8n.olshoperp.com/webhook/user-activity
VITE_USER_ACTIVITY_ENV=tyas
```

Merdian: `VITE_USER_ACTIVITY_ENV=merdian` (atau biarkan auto dari hostname `merdian.*`).

## CORS

Node Respond Export sudah set `Access-Control-Allow-Origin: *` agar file HTML lokal/`dashboard/` bisa fetch. Kunci akses via `token` query, bukan via CORS.

## Smoke test

```bash
curl -sS -X POST 'https://n8n.olshoperp.com/webhook/user-activity' \
  -H 'Content-Type: application/json' \
  -d '{"env":"tyas","user_id":1,"username":"smoke","company_id":3,"company_code":"TANRISE","menu_slug":"dashboard","menu_path":"/","event":"open","method":"GET","at":"2026-08-28T15:00:00.000Z"}'

curl -sS 'https://n8n.olshoperp.com/webhook/user-activity-export?token=YOUR_SECRET'
```

Buka `dashboard/user-activity.html` — set `EXPORT_URL` di config page.
