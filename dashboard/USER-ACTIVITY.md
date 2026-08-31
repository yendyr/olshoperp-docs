# Enable User Activity — Tyas & Merdian

Checklist setelah kode FE (`userActivityTelemetry`) sudah di-merge & di-deploy.

## 1. Import & activate n8n

Ikuti [n8n/user-activity/README.md](../n8n/user-activity/README.md).

Catat URL production:

| Role | Method | Contoh URL |
|------|--------|------------|
| Ingest | POST | `https://n8n.olshoperp.com/webhook/user-activity` |
| Export | GET | `https://n8n.olshoperp.com/webhook/user-activity-export` |

Opsional: set `USER_ACTIVITY_EXPORT_SECRET` di n8n.

## 2. Build env FE

Pada pipeline / secret build **Tyas** dan **Merdian**:

```env
VITE_USER_ACTIVITY_WEBHOOK_URL=https://n8n.olshoperp.com/webhook/user-activity
```

Opsional (kalau hostname tidak `tyas.*` / `merdian.*`):

```env
VITE_USER_ACTIVITY_ENV=tyas
# atau
VITE_USER_ACTIVITY_ENV=merdian
```

Kosongkan `VITE_USER_ACTIVITY_WEBHOOK_URL` di staging/local agar telemetry off (default `.env.example`).

Redeploy FE kedua env setelah secret terpasang.

## 3. Dashboard viewer

Buka:

```text
olshoperp-docs/dashboard/user-activity.html
```

Config URL → paste export URL (+ token bila ada) → Save & fetch.

Atau query:

```text
user-activity.html?url=https://n8n.olshoperp.com/webhook/user-activity-export&token=SECRET
```

## 4. Smoke test (1 user per env)

### A. Webhook langsung

```bash
curl -sS -X POST "$INGEST_URL" \
  -H 'Content-Type: application/json' \
  -d '{"env":"tyas","user_id":999001,"username":"smoke.tyas","company_code":"TANRISE","menu_slug":"dashboard","menu_path":"/","event":"open","method":"GET","at":"2026-08-28T16:00:00.000Z"}'

curl -sS -X POST "$INGEST_URL" \
  -H 'Content-Type: application/json' \
  -d '{"env":"merdian","user_id":999002,"username":"smoke.merdian","company_code":"SOMURAH","menu_slug":"accounting-supplier-invoice","menu_path":"/accounting/supplier-invoice","event":"write","method":"POST","at":"2026-08-28T16:01:00.000Z"}'

curl -sS "$EXPORT_URL?token=$SECRET"
```

Harus muncul 2 row di export JSON + di dashboard (filter Tyas / Merdian).

### B. Via UI production

1. Login 1 user di `https://tyas.olshoperp.com` → buka menu apa saja → tunggu ≤60s debounce open.
2. Login 1 user di `https://merdian.olshoperp.com` → save/approve sesuatu (write).
3. Refresh dashboard → cek `last_opened_*` (Tyas) dan `last_write_*` (Merdian).

DevTools Network: request ke webhook URL (beacon/fetch) tanpa error CORS di ingest (sendBeacon tidak butuh response CORS untuk sukses kirim).

## 5. Acceptance

- [ ] Open di Tyas mengisi `last_opened_*`
- [ ] Write di Merdian mengisi `last_write_*` (open tidak menimpa write)
- [ ] Filter env memisahkan Tyas vs Merdian
- [ ] Staging/local tanpa webhook URL → tidak error, tidak kirim

## Privacy

Halaman ops/QA saja. Jangan host publik tanpa token export.
