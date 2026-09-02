# User Activity — dashboard HTML (QA)

**Pendekatan:** file HTML statis di repo `olshoperp-docs` — **bukan** menu di Help Center / staging ERP.

## Buka dashboard

1. Clone / buka repo `olshoperp-docs`
2. Buka di browser:

```text
dashboard/user-activity.html
```

Atau dari Test Dashboard: `dashboard/index.html` → link **User Activity**.

Bisa juga double-click file HTML di Finder — asal n8n export mengizinkan CORS (sudah diset di workflow).

## Setup sekali (n8n + FE Tyas/Merdian)

Detail lengkap: [n8n/user-activity/README.md](../n8n/user-activity/README.md)

Ringkas:

| Langkah | Apa |
|--------|-----|
| n8n | Import `user-activity-hub.workflow.json`, aktifkan, catat **Export URL** |
| Tyas / Merdian FE | Set `VITE_USER_ACTIVITY_WEBHOOK_URL` di build → redeploy |
| Dashboard | Config URL di HTML → paste Export URL (+ token jika ada) |

Query param (boleh dishare ke tim QA):

```text
user-activity.html?url=https://n8n.olshoperp.com/webhook/user-activity-export&token=SECRET
```

Disimpan di `localStorage` browser setelah pertama kali.

## Tombol di halaman

| Tombol | Fungsi |
|--------|--------|
| **Refresh** | Ambil data terbaru dari n8n |
| **Config URL** | Simpan Export URL + token |
| **Load sample** | Preview UI tanpa n8n |
| Filter Tyas / Merdian | Pisah per environment |

Auto-refresh setiap 60 detik setelah Config disimpan.

## Catatan

- Data **tidak** di-commit ke git — sumber = n8n Data Store.
- Audit log DB Tyas (tanpa telemetry FE) **tidak** tampil di dashboard ini; butuh workflow export terpisah atau query agent-db manual (`olshoperp/scripts/agent-db-query.mjs`).
- Jangan taruh API key n8n di file HTML — hanya URL export + token opsional.
