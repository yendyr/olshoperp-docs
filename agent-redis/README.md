---
doc_type: agent-redis
version: 1.2
last_updated: 2026-11-07
owner: Platform / DevOps
source_of_truth: olshoperp/docs/infra/agent-redis.md
---

# Agent Redis — Horizon metrics (read-only)

Untuk agent yang **direct POST** ke webhook Redis Agent — read-only (Horizon / queue metrics).
SoT deploy+ops: `olshoperp/docs/infra/agent-redis.md` (salinan ini di-sync ke sini).

Webhook n8n/n9n; pola sama DB Agent ke Redis yang dipakai Laravel Horizon / queue. Pola sama dengan DB Agent & App Log Agent: `POST` + header `X-API-Key`, JSON body, error code eksplisit.

| | n8n (Tyas VPS) | n9n (Merdian VPS) |
|--|----------------|-------------------|
| Host | `https://n8n.olshoperp.com` | `https://n9n.olshoperp.com` |
| Workflow | **Redis Agent** | **Redis Agent** |
| Workflow ID | `fM7IobiE8YwmExeG` | `aCA3IPNAj7Nx0hzr` |
| Path | `/webhook/agent-redis-tyas` | `/webhook/agent-redis-merdian` |
| `server` body | `tyas` \| `staging` | `merdian` |
| Redis credential | `Redis Tyas Staging RO` | `Redis Merdian RO` |
| Header Auth | sama DB Agent Tyas | sama DB Agent Merdian |
| Env API key | `DB_DEBUG_API_KEY` | `DB_DEBUG_API_KEY_MERDIAN` (fallback `DB_DEBUG_API_KEY`) |

**Dilarang:** operasi write Redis lewat agent; hardcode API key / password di chat atau commit; mengandalkan password dari screenshot OCR (harus dari `.env` server).

---

## 1. Arsitektur singkat

```
Agent / curl
  → POST n8n|n9n webhook (Header Auth)
  → Guard Read-Only (allowlist op)
  → Switch server / operation
  → Node Redis (get|keys|info|llen saja)
  → JSON response
```

- Tyas + Staging share **satu Redis** di VPS Tyas (`76.13.184.23`); beda prefix/queue (`CACHE_PREFIX`, `REDIS_QUEUE`).
- Merdian punya Redis sendiri di VPS Merdian (`187.52.127.149`).
- n8n/n9n jalan di **Docker**; Redis host default `127.0.0.1` / unix socket **tidak** terlihat dari container. Deploy wajib expose Redis ke gateway bridge Docker (`172.18.0.1`) — pola sama MariaDB ↔ n8n.

Horizon prefix default (bila `HORIZON_PREFIX` kosong):

```text
{slug(APP_NAME)}_horizon:
```

Untuk `APP_NAME=OlshopERP` → `olshoperp_horizon:`.

| Env | `REDIS_QUEUE` (contoh) | `CACHE_PREFIX` |
|-----|------------------------|----------------|
| Staging | `olshoperp_staging` | `staging` |
| Tyas | `olshoperp_production` | `tyas` |
| Merdian | `olshoperp_merdian` | `merdian` |

List queue Laravel di Redis: key `queues:{REDIS_QUEUE}` (pending) dan `queues:{REDIS_QUEUE}:reserved`.

---

## 2. Deploy (dari nol / rebuild)

Lakukan per VPS (Tyas untuk n8n, Merdian untuk n9n). Butuh SSH root (lihat `.cursor/rules/27-prod-vps-ssh-access.mdc`).

### 2.1 Buka Redis ke Docker gateway

```bash
# Tyas: root@76.13.184.23  |  Merdian: root@187.52.127.149
CONF=/etc/redis/redis.conf
cp -a "$CONF" "${CONF}.bak.$(date +%Y%m%d%H%M%S)"
# Dari: bind 127.0.0.1 -::1
# Ke:
sed -i 's/^bind 127.0.0.1 -::1$/bind 127.0.0.1 172.18.0.1 -::1/' "$CONF"
grep '^bind' "$CONF"
systemctl restart redis-server
ss -lntp | grep 6379
```

Verifikasi dari container n8n:

```bash
docker exec n8n-compose-n8n-1 node -e \
  'const n=require("net");n.connect({host:"172.18.0.1",port:6379},()=>{console.log("TCP_OK");process.exit(0)}).on("error",e=>{console.log(e.message);process.exit(1)})'
```

`PONG` dari host:

```bash
# Tyas/staging .env
PASS=$(grep '^REDIS_PASSWORD=' /var/www/api/staging-olshoperp/.env | cut -d= -f2-)
# Merdian .env
# PASS=$(grep '^REDIS_PASSWORD=' /var/www/merdian/olshoperp/.env | cut -d= -f2-)
redis-cli -h 172.18.0.1 -p 6379 -a "$PASS" --no-auth-warning PING
```

**Catatan keamanan:** `172.18.0.1` hanya reachable dari Docker bridge host itu; tetap wajib `requirepass`. Jangan bind `0.0.0.0`.

### 2.1b Password file untuk ZCARD (+ optional helper script)

Node Redis n8n tidak support `ZCARD`. Agent memakai Code node yang baca:

| Path di container | Isi |
|-------------------|-----|
| `/files/redis-agent.pass` | `REDIS_PASSWORD` (chmod 600, owner node uid 1000) |

Host path: `/var/www/n8n-compose/local-files/redis-agent.pass` (volume `./local-files:/files`).

```bash
# Tyas/staging
PASS=$(grep '^REDIS_PASSWORD=' /var/www/api/staging-olshoperp/.env | cut -d= -f2-)
# Merdian: /var/www/merdian/olshoperp/.env
printf '%s\n' "$PASS" > /var/www/n8n-compose/local-files/redis-agent.pass
chown 1000:1000 /var/www/n8n-compose/local-files/redis-agent.pass
chmod 600 /var/www/n8n-compose/local-files/redis-agent.pass
```

Di `compose.yaml` service `n8n`, wajib:

```yaml
- NODE_FUNCTION_ALLOW_BUILTIN=fs,net
```

(supaya Code node boleh `require('fs')` / `require('net')` — tanpa ini ZCARD gagal di runner). Lalu `docker compose up -d n8n`.

Optional helper (debug manual): `/files/redis-zcard.js` — `node /files/redis-zcard.js 'queues:…:reserved'`.

### 2.2 Credential n8n / n9n

Di UI Credentials atau Public API:

| Field | Value |
|-------|--------|
| Type | `redis` |
| Host | `172.18.0.1` |
| Port | `6379` |
| User | `default` (**wajib** — string kosong → `WRONGPASS` + hang reconnect ~15 mnt) |
| Password | dari `REDIS_PASSWORD` di `.env` app (**bukan** OCR screenshot) |
| Database | `0` |
| SSL | off |

Nama yang dipakai sekarang:

- n8n: **Redis Tyas Staging RO**
- n9n: **Redis Merdian RO**

Patch password dari server (hindari korupsi lewat clipboard), contoh n8n di Tyas:

```bash
# Di VPS, dengan N8N/N9N_API_KEY di env — jangan echo password
python3 <<'PY'
import json, os, urllib.request
env = open('/var/www/api/staging-olshoperp/.env').read()  # merdian: /var/www/merdian/olshoperp/.env
passw = env.split('REDIS_PASSWORD=',1)[1].splitlines()[0].strip().strip('"').strip("'")
body = json.dumps({
  "name": "Redis Tyas Staging RO",
  "type": "redis",
  "data": {"host":"172.18.0.1","port":6379,"user":"default","password":passw,"database":0,"ssl":False},
}).encode()
req = urllib.request.Request(
  "http://127.0.0.1:5678/api/v1/credentials/<CREDENTIAL_ID>",
  data=body, method="PATCH",
  headers={"Content-Type":"application/json","X-N8N-API-KEY": os.environ["API_KEY"]},
)
print(urllib.request.urlopen(req, timeout=20).status)
PY
```

### 2.3 Workflow Redis Agent

1. Import / buat workflow **Redis Agent** (lihat struktur di bawah) **atau** pakai ID yang sudah ada.
2. Tempel credential Redis ke **semua** node Redis (hanya op read).
3. Webhook: Header Auth = credential yang sama dengan DB Agent instance itu.
4. **Activate / Publish** workflow.
5. Smoke test §4.

#### Struktur node (wajib)

1. **Webhook** — `POST`, `responseMode: responseNode`, `authentication: headerAuth`
2. **Guard Read-Only** (Code) — allowlist `get|keys|info|llen`; tolak write
3. **IF Valid** → true: Switch op / server · false: Respond Guard Error (HTTP 400)
4. **Switch** operation → node Redis terpisah per op (**jangan** wire `delete|set|incr|pop|push|publish`)
5. Redis `onError: continueErrorOutput` → Respond OK / Respond Redis Error
6. `keys`: `getValues: false` (hindari dump massal)

n8n menambah **Switch Server** (`tyas` / `staging`) sebelum switch op (satu credential, dua cabang semantik).

### 2.4 Setelah upgrade Redis / reinstall OS

Ulangi §2.1 (bind). Credential & workflow biasanya tetap.

---

## 3. Cara pakai / call

### 3.1 Endpoint & auth

```http
POST /webhook/agent-redis-tyas          # n8n — tyas|staging
POST /webhook/agent-redis-merdian       # n9n — merdian
Content-Type: application/json
X-API-Key: <DB_DEBUG_API_KEY atau DB_DEBUG_API_KEY_MERDIAN>
```

Full URL:

- `https://n8n.olshoperp.com/webhook/agent-redis-tyas`
- `https://n9n.olshoperp.com/webhook/agent-redis-merdian`

### 3.2 Body

| Field | Wajib | Keterangan |
|-------|-------|------------|
| `server` | ya | n8n: `tyas` \| `staging` · n9n: `merdian` |
| `operation` | ya | alias `op` — `get` \| `keys` \| `info` \| `llen` \| `zcard` \| `zrangebyscore` |
| `key` | untuk `get` / `zcard` / `zrangebyscore` | nama key penuh (juga terima `list` sebagai alias) |
| `keyPattern` / `pattern` | untuk `keys` | pola Redis `KEYS` |
| `list` / `key` | untuk `llen` | nama list |
| `min` / `max` | opsional (`zrangebyscore`) | default `-inf` / `+inf` |
| `withscores` / `withScores` | opsional (`zrangebyscore`) | default `true` |
| `offset` | opsional (`zrangebyscore`) | default `0` |
| `count` / `limit` | opsional (`zrangebyscore`) | default `100`, max `500` |
| `keyType` | opsional (`get`) | di node saat ini fixed `automatic` |

### 3.3 Operasi yang diizinkan vs ditolak

| Op | Efek |
|----|------|
| `get` | Baca value (string/hash/list/set — automatic) |
| `keys` | List key by pattern (**tanpa** values) |
| `info` | `INFO` server |
| `llen` | Panjang list |
| `zcard` | Cardinality sorted set (mis. `queues:{name}:reserved`) |
| `zrangebyscore` | Baca member sorted set by score range (+ optional WITHSCORES / LIMIT) |
| `delete` `set` `incr` `pop` `push` `publish` | **`WRITE_FORBIDDEN`** (HTTP 400) |

Lapisan keamanan: (1) Guard Code, (2) hanya node read di canvas (+ ZCard / ZRangeByScore RESP read-only), (3) idealnya Redis ACL read-only di server (belum wajib).

**Catatan `zcard` / `zrangebyscore`:** node Redis n8n bawaan **tidak** punya perintah ini. Workflow memakai Code node + RESP TCP ke `172.18.0.1:6379`, password dari `/files/redis-agent.pass`. Butuh env compose `NODE_FUNCTION_ALLOW_BUILTIN=fs,net` (sudah dipasang di Tyas & Merdian).

### 3.4 Contoh curl

Jangan hardcode key — ambil dari `.env`:

```bash
set -a; source ~/Documents/GitHub/olshoperp/.env; set +a

# Staging — Horizon snapshots
curl -sS -X POST "https://n8n.olshoperp.com/webhook/agent-redis-tyas" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${DB_DEBUG_API_KEY}" \
  -d '{"server":"staging","operation":"keys","keyPattern":"olshoperp_horizon:snapshot:*"}'

# Tyas — panjang antrean production (list pending)
curl -sS -X POST "https://n8n.olshoperp.com/webhook/agent-redis-tyas" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${DB_DEBUG_API_KEY}" \
  -d '{"server":"tyas","operation":"llen","list":"queues:olshoperp_production"}'

# Tyas — reserved count (sorted set)
curl -sS -X POST "https://n8n.olshoperp.com/webhook/agent-redis-tyas" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${DB_DEBUG_API_KEY}" \
  -d '{"server":"tyas","operation":"zcard","key":"queues:olshoperp_production:reserved"}'

# Tyas — reserved members by score (WITHSCORES, max 20)
curl -sS -X POST "https://n8n.olshoperp.com/webhook/agent-redis-tyas" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${DB_DEBUG_API_KEY}" \
  -d '{"server":"tyas","operation":"zrangebyscore","key":"queues:olshoperp_production:reserved","min":"-inf","max":"+inf","count":20}'

# Tyas — INFO
curl -sS -X POST "https://n8n.olshoperp.com/webhook/agent-redis-tyas" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${DB_DEBUG_API_KEY}" \
  -d '{"server":"tyas","operation":"info"}'

# Merdian
curl -sS -X POST "https://n9n.olshoperp.com/webhook/agent-redis-merdian" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${DB_DEBUG_API_KEY_MERDIAN}" \
  -d '{"server":"merdian","operation":"llen","list":"queues:olshoperp_merdian"}'
```

### 3.5 Respons sukses

```json
{
  "status": "success",
  "error_code": null,
  "message": "OK",
  "server": "staging",
  "operation": "keys",
  "data": { "keys": ["olshoperp_horizon:snapshot:…", "…"] }
}
```

`llen` contoh: `"data": { "queues:olshoperp_production": 0 }`.  
`zcard` contoh: `"data": { "queues:olshoperp_production:reserved": 0 }`.  
`zrangebyscore` contoh:

```json
{
  "key": "queues:olshoperp_production:reserved",
  "min": "-inf",
  "max": "+inf",
  "withscores": true,
  "offset": 0,
  "count": 20,
  "returned": 1,
  "items": [{ "member": "{…payload…}", "score": "1730000000" }]
}
```

`get` contoh: `"data": { "value": … }`.  
`info`: objek hasil parse INFO (versi, memory, clients, …).

### 3.6 Error codes

| `error_code` | HTTP | Artinya |
|--------------|------|---------|
| `INVALID_SERVER` | 400 | `server` tidak di allowlist instance |
| `MISSING_OPERATION` | 400 | `operation` kosong |
| `WRITE_FORBIDDEN` | 400 | op write / tidak di allowlist |
| `MISSING_KEY` | 400 | `get` tanpa `key` |
| `MISSING_KEY_PATTERN` | 400 | `keys` tanpa pattern |
| `MISSING_LIST` | 400 | `llen` tanpa list/key |
| `REDIS_FAILED` | 400 | error dari node Redis |

---

## 4. Smoke test checklist

Setelah deploy/activate:

1. Write deny: `operation=set` → `WRITE_FORBIDDEN` (cepat, &lt;1s).
2. `operation=info` → `status=success` (&lt;2s). Jika hang &gt;15s: cek user credential = `default`, password dari `.env`, bind `172.18.0.1`, TCP dari container.
3. `llen` ke `queues:{REDIS_QUEUE}` env itu → success (angka boleh 0).
4. `zcard` ke `queues:{REDIS_QUEUE}:reserved` → success (angka boleh 0).
5. `zrangebyscore` ke key yang sama → success (`items` boleh `[]`).
6. `keys` `olshoperp_horizon:*` atau `olshoperp_horizon:snapshot:*` → success (list boleh kosong di Merdian jika belum ada snapshot).

---

## 5. Troubleshooting

| Gejala | Penyebab umum | Perbaikan |
|--------|---------------|-----------|
| Curl hang / 504 di op Redis; write deny tetap cepat | Password salah / user `""` → reconnectStrategy lama | User `default`; password dari `.env` server (hash-check vs clipboard) |
| `ECONNREFUSED` 172.18.0.1:6379 dari container | Redis belum bind docker gateway | §2.1 |
| `INVALID_SERVER` | Body `server` salah host | n8n: tyas/staging; n9n: merdian |
| Webhook 403 | API key salah | Pakai key Header Auth DB Agent instance itu |
| Workflow inactive | Belum publish | Activate di UI / `activateWorkflow` MCP |
| Keys kosong | Pattern / prefix salah, atau belum `horizon:snapshot` | Cek `HORIZON_PREFIX` / `APP_NAME`; schedule `horizon:snapshot` |

---

## 6. Pola Horizon yang sering dipakai agent

```json
{"server":"staging","operation":"keys","keyPattern":"olshoperp_horizon:masters:*"}
{"server":"staging","operation":"keys","keyPattern":"olshoperp_horizon:supervisor:*"}
{"server":"staging","operation":"keys","keyPattern":"olshoperp_horizon:metrics:*"}
{"server":"tyas","operation":"llen","list":"queues:olshoperp_production"}
{"server":"tyas","operation":"zcard","key":"queues:olshoperp_production:reserved"}
{"server":"tyas","operation":"zrangebyscore","key":"queues:olshoperp_production:reserved","count":20}
{"server":"staging","operation":"get","key":"olshoperp_horizon:<id-job>"}
```

Pending = list (`llen`) · reserved/delayed Horizon = sorted set (`zcard` / `zrangebyscore`).

Ini **bukan** pengganti dashboard `/horizon` (auth session). Untuk metrik time-series penuh tetap butuh snapshot Horizon + UI, atau `get` key metrik spesifik.

---

## 7. Sync dari SoT developer

SoT file ini: `olshoperp/docs/infra/agent-redis.md`.  
Salinan agent-facing: `olshoperp-docs/agent-redis/README.md`.

Setelah ubah SoT:

```bash
cp docs/infra/agent-redis.md ../olshoperp-docs/agent-redis/README.md
# sesuaikan frontmatter sync_to bila perlu; commit di masing-masing repo sesuai permintaan user
```

Index terkait: `docs/infra/README.md`, skill `.cursor/skills/n8n-olshoperp/SKILL.md`.
