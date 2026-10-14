# Design: BugSnap — QA evidence recorder → Google Drive public URLs

| Field | Value |
|-------|--------|
| Status | **plan / under consideration** — Lead QA (Yemima); **belum** approved untuk build |
| Date | 2026-10-14 |
| Product | BugSnap (Chrome extension, private / internal QA) — *proposed* |
| Goal | Record testing evidence → one Drive folder → **Anyone with the link** URLs |
| Infra | **No OlshopERP server**; no serverless in MVP |
| Drive account (intended) | `yemimakrisdiantifani@gmail.com` (OAuth only — never store password) |
| Owner | Lead QA — Yemima |
| Note | Disimpan sebagai rencana saja; implementasi ditunda sampai Lead QA putuskan lanjut |

---

## 1. Goal

Memberi QA OlshopERP alur mirip BetterBugs/Jam yang **ringan**:

1. Start / Stop record dari ekstensi Chrome.
2. Ambil **video** + **console log** (file terpisah).
3. Upload otomatis ke **satu folder** Google Drive.
4. Set permission **Anyone with the link** (viewer).
5. Tampilkan **URL publik** siap paste ke Jira / test case.

### Non-goals (MVP)

- Clone penuh Jam / BetterBugs (DOM session replay, network HAR UI, annotation editor).
- Hosting / server OlshopERP (Laravel, Tyas, Merdian, staging API).
- Serverless backend (Cloud Functions, dll.).
- Publish wajib ke Chrome Web Store (cukup load unpacked / zip internal).
- Minta atau menyimpan password Google di chat / di kode.

---

## 2. Why this approach

| Pendekatan | Verdict |
|------------|---------|
| Pakai BetterBugs / Jam saja | Sudah dipakai; tidak otomatis ke 1 folder GDrive + URL publik konsisten |
| OSS BugShot → Jira attachment | Dekat, tapi storage = Jira; URL sering butuh login Atlassian |
| OpenReplay Spot | Perlu self-host instance |
| **BugSnap sendiri → GDrive** | Sesuai preferensi: URL anyone-with-link, 1 folder, tanpa server ERP |

---

## 3. Architecture (MVP)

```text
┌─────────────────────────────────────────────────────────────┐
│  Chrome (QA laptop)                                          │
│  ┌──────────────────┐     ┌─────────────────────────────┐  │
│  │ BugSnap extension │────▶│ Tab capture (default)        │  │
│  │ Start / Stop      │     │ OR All-screen (getDisplayMedia)│ │
│  │ + console hook    │     └─────────────────────────────┘  │
│  └─────────┬────────┘                                        │
│            │ OAuth (chrome.identity)                          │
│            ▼                                                  │
│  Google Drive API ──▶ folder tetap "BugSnap-OlshopERP"       │
│                       ├── *.webm (video)                      │
│                       └── *_console.json (logs)               │
│                       permission: anyone with link            │
│            ▼                                                  │
│  Popup menampilkan 2 URL publik (copy)                        │
└─────────────────────────────────────────────────────────────┘
```

**Tidak ada** hop ke server OlshopERP.

---

## 4. Recording modes

| Mode | Perilaku | Izin yang dirasakan user |
|------|----------|---------------------------|
| **Tab** (default) | Rekam tab aktif (staging OlshopERP) | Mirip BetterBugs; indikator rekam tab Chrome; tanpa Screen Recording Mac penuh |
| **All screen** | User pilih window/screen via picker | Popup share screen; mungkin izin Screen Recording OS |

**Console:** selalu dari **tab web** yang di-inject (halaman OlshopERP). Mode All screen memperluas **video** saja; log tetap dari tab browser.

---

## 5. Storage & sharing

- **Satu folder tetap** di Drive (nama kerja: `BugSnap-OlshopERP`). Tidak buat subfolder per hari/orang di MVP.
- Naming file (contoh):
  - `{ETM-or-manual}_{yyyy-MM-dd_HHmm}_video.webm`
  - `{ETM-or-manual}_{yyyy-MM-dd_HHmm}_console.json`
- Field opsional di UI sebelum/sesudah stop: kode ETM / TC (kalau kosong → `manual` atau timestamp saja).
- Setelah upload: set permission **anyone with the link**, role **reader/viewer**.
- Output ke user: 2 URL (video + console), tombol copy.

**App private:** ekstensi tidak wajib store publik; distribusi internal (unpacked / zip).

**Link file:** anyone with the link (disepakati) agar praktis di Jira/TC. Risiko: siapa pun yang punya URL bisa menonton — acceptable untuk bukti QA staging dengan awareness.

---

## 6. Auth (Google)

- OAuth 2.0 via Chrome extension (`chrome.identity` + Google Cloud OAuth client).
- Scope minimal yang dibutuhkan Drive: create file di folder, set permission, get webViewLink.
- User login sendiri di UI Google; **password tidak pernah** diminta agent / disimpan di repo.
- Setup sekali: Google Cloud project → enable Drive API → OAuth client type Chrome extension (butuh Extension ID setelah generate key).

---

## 7. Infra checklist (MVP)

| Item | Wajib? |
|------|--------|
| Kode Chrome extension | Ya |
| Akun Google + 1 folder Drive | Ya |
| Google Cloud project (Drive API + OAuth) | Ya |
| Server OlshopERP | Tidak |
| Serverless | Tidak |
| Domain / hosting web | Tidak |

---

## 8. Components (code units)

| Unit | Tanggung jawab |
|------|----------------|
| `manifest.json` (MV3) | Permissions: identity, tabCapture / scripting, storage |
| Background service worker | Orkestrasi start/stop, upload, permission Drive |
| Offscreen / tab capture helper | MediaRecorder → Blob video |
| Content script | Hook `console.*`, `error`, unhandledrejection → buffer |
| Popup UI | Mode Tab/All screen, Connect Drive, Start/Stop, tampil URL |
| `drive.js` | OAuth token, ensure folder, multipart upload, create permission, return links |

Repo kode: **terpisah** dari monorepo app ERP (usulan: folder/repo `bugsnap` di samping workspace QA). Spec ini hidup di `olshoperp-docs` sebagai SoT desain.

---

## 9. Error handling (MVP)

- User belum Connect Drive → blok Start atau prompt connect.
- Upload gagal → tampilkan error + opsi **Download lokal** (video + console) agar bukti tidak hilang.
- Tab closed saat record → stop + simpan yang ada bila memungkinkan.
- All screen denied (user cancel picker) → kembali ke idle, pesan singkat.

---

## 10. Out of scope / later

- Network HAR, DOM rrweb replay, annotation.
- Integrasi auto-comment Jira.
- Playwright auto-record pipeline.
- Thin serverless OAuth proxy / shared team service account.
- Restrict Drive links ke domain Google Workspace saja.

---

## 11. Success criteria (MVP trial)

1. QA bisa Start/Stop di staging tanpa server ERP.
2. File muncul di **satu** folder Drive yang disepakati.
3. Link video & console terbuka **tanpa login Google** (anyone with the link).
4. Mode Tab jalan tanpa full OS screen-recording flow; All screen tersedia sebagai opsi.

---

## 12. Decisions log

| Tanggal | Keputusan |
|---------|-----------|
| 2026-10-14 | Build BugSnap sendiri, bukan clone Jam penuh |
| 2026-10-14 | Prefer GDrive URL anyone-with-link |
| 2026-10-14 | Tab + opsi All screen |
| 2026-10-14 | Video + console terpisah |
| 2026-10-14 | App private; 1 folder Drive |
| 2026-10-14 | Tanpa server OlshopERP / serverless di MVP |
| 2026-10-14 | Auth OAuth; jangan pakai password di chat |
