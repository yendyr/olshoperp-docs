---
doc_type: proposal
title: Feature Map + Capability Lingo (sub-feature documentation)
status: draft-for-review
owner: QA - Yemima
created: 2026-07-24
audience: [PM, QA, Tech Writer, AI analyst]
purpose: >
  Ringkasan diskusi desain untuk memperkaya QA docs agar sub-feature
  (Show Deleted, Column Show/Hide, Import, Log, dll.) terpetakan rapi,
  bisa jadi basis user-guide per function, dan kelak di-render sebagai
  Lingo-like modal di OlshopERP — tanpa wajib database di fase 1.
related:
  - docs/qa-docs/_meta/manifest.yaml
  - .cursor/rules/qa-docs-standard.mdc
  - .cursor/rules/09-menu-documentation.mdc
  - docs/qa-docs/accounting-supplier-invoice/  # golden reference simulasi
---

# Proposal: Feature Map + Capability Lingo

> **Untuk reviewer (termasuk Claude / AI analyst):**  
> Analisa dokumen ini lalu usulkan: (1) format docs yang harus di-generate, (2) apakah ada rekomendasi lebih efisien untuk jangka panjang, (3) trade-off vs model 5-file QA docs yang ada sekarang.  
> **Jangan anggap proposal ini sudah standar aktif** — belum diadopsi ke `qa-docs-standard.mdc`.

---

## 1. Konteks & masalah

### 1.1 Model QA docs hari ini (AS-IS)

Per menu = **5 file** di `docs/qa-docs/{menu-slug}/`:

| File | Audience |
|------|----------|
| `README.md` | Index + changelog kanonik |
| `knowledge-base.md` | Operator / support |
| `requirement.md` | PM / QA / BA |
| `technical.md` | Developer |
| `user-guide.md` | Onboarding publish eksternal (Notion/Lark) |

Aturan utama: **1 fakta = 1 rumah**, sync matrix saat perilaku berubah, budget baris per layer, golden ref = `accounting-supplier-invoice/`.

### 1.2 Gap yang terasa

Di banyak menu (termasuk golden ref PI), **sub-feature / small feature** sering hanya disebut satu baris, tanpa rumah detail.

Contoh di Purchase Invoice `requirement.md` § Datalist:

> **Fitur:** Global Search, Advanced Filter, Show Deleted, Column Show/Hide, Export with/without detail…

Itu cukup sebagai **sebutan**, tidak cukup sebagai:

- acceptance / perilaku per capability,
- panduan user per function,
- basis in-app help / glossary card.

Akibatnya:

| Gejala | Dampak |
|--------|--------|
| Sub-feature “ada di UI” tapi tidak terdokumentasi | Support & UG tidak punya sumber |
| Penjelasan shared (Show Deleted) diulang / dilupakan per menu | Duplikasi atau bolong |
| Tidak ada indeks “menu ini punya capability apa saja” | Sulit audit kelengkapan doc |
| User guide = 1 narasi menu | Tidak scalable ke “guide per function” |
| Changelog/version doc kuat | Tapi bukan product/feature timeline (topik terpisah; lihat §8) |

### 1.3 Kebutuhan jangka panjang (TO-BE produk)

1. **Docs lebih detail** per sub-feature (global vs per-menu).
2. **User guide per function** yang user jalankan (bukan hanya overview menu).
3. **UX ala Lark Lingo** di OlshopERP: di teks/guide, term ter-highlight → klik → modal penjelasan (+ contoh data bila perlu).
4. Fase 1 konten **tanpa database** (file di repo = SoT).

---

## 2. Referensi UX: Lark Lingo (ringkas)

Lark/Feishu **Lingo** = kamus entri perusahaan:

- Entri: nama, alias, deskripsi singkat, related docs/link, (opsional) gambar.
- Di chat/docs: nama/alias **otomatis ter-highlight**.
- User **klik** → **kartu/modal** penjelasan tanpa meninggalkan konteks baca.
- Ada scope tampil (global vs terbatas).
- API highlight: kirim teks → dapat posisi term + entity id (untuk sistem eksternal).

**Yang ingin dipinjam:** highlight kontekstual + card, bukan admin console penuh ala Lark di fase 1.

**Nama kerja di OlshopERP (usulan):** *Capability Card* / *SF Entry* (hindari bentrok merek “Lingo”), ID tetap `SF-*`.

---

## 3. Desain usulan — dua lapisan saling melengkapi

```text
Feature Map (index per menu)          Capability Entry / SF Entry (isi)
─────────────────────────────         ────────────────────────────────
Daftar semua sub-feature              1 kartu penjelasan per sub-feature
Scan / audit kelengkapan              Dipanggil dari Map ATAU dari teks
Tidak menggantikan 5-file             Bisa global atau menu-bound
                                      Boleh bawa contoh data nyata
```

| Lapisan | Pertanyaan yang dijawab | Analogi Lingo |
|---------|-------------------------|---------------|
| **Feature Map** | “Menu ini punya capability apa saja?” | All entries (filtered by menu) |
| **SF Entry** | “Capability ini artinya apa, cara pakai, contoh?” | 1 Lingo entry + card |

**Keputusan desain yang sudah disepakati arahnya (belum diimplementasi):**

- Model **5-file tetap**; jangan pecah jadi puluhan file dari hari pertama.
- Feature Map **wajib** sebagai indeks di `requirement.md` (atau setara).
- Shared UI → baseline di `_meta/shared-capabilities/` (atau nama setara).
- Detail menu-specific → subsection di requirement / entry terpisah hanya jika budget/kompleksitas memaksa.
- Folder `features/` atau `user-guide/{slug}.md` = **fase belakangan**, bukan default.

---

## 4. Feature Map — format usulan

### 4.1 Letak

Usulan: section di `requirement.md` (setelah Ringkasan/Status, sebelum atau menggantikan list “Fitur: …” di Datalist).  
README cukup 1 baris pointer: “Feature Map → requirement §X (N fitur, M missing)”.

### 4.2 Kolom tabel (kontrak)

| Kolom | Isi |
|-------|-----|
| `ID` | Stabil: `SF-<AREA>-NN` (contoh `SF-DL-03`, `SF-PI-01`) |
| `Label UI` | Nama yang user lihat |
| `Jenis` | `shared` \| `hybrid` \| `menu` |
| `Status` | `AS-IS` \| `TO-BE` \| `N/A` \| `Partial` |
| `Depth` | `stub` \| `detailed` \| `missing` |
| `Detail` | Link shared baseline **atau** anchor subsection / entry file |
| `KB` | Ya / — |
| `UG` | `overview` \| `slice` \| `pending` \| `—` |

### 4.3 Arti Depth

| Depth | Arti | Implikasi tulis |
|-------|------|-----------------|
| `stub` | Perilaku = shared; menu tidak override bermakna | Cukup baris Map + link shared |
| `detailed` | Ada AC / edge case / contoh khas menu | Wajib punya body (subsection atau entry) |
| `missing` | Ada di UI / disebut di doc, belum punya penjelasan | Backlog doc — jangan diam-diam skip |
| `N/A` (via Status) | Menu memang tidak punya (mis. Import di PI) | Tetap dicantumkan agar eksplisit |

### 4.4 Area ID (usulan awal — bisa direvisi)

| Prefix | Area |
|--------|------|
| `SF-DL-*` | Datalist (search, filter, show deleted, column, export, actions) |
| `SF-HDR-*` | Header / create / field khusus |
| `SF-DET-*` | Detail line / insert modal |
| `SF-IMP-*` | Import |
| `SF-EXP-*` | Export (jika dipisah dari DL) |
| `SF-LOG-*` | Approval / Audit log |
| `SF-PRT-*` | Print |
| `SF-{MENU}-*` | Capability unik menu (contoh `SF-PI-01` partial invoicing) |

---

## 5. Capability Entry (SF Entry) — format (Pentaho-style)

Satu skema untuk global maupun per-menu. Tone = **user guide singkat** (bukan AC/requirement). Referensi struktur: [Pentaho docs](https://docs.pentaho.com/) (Definition / Purpose / numbered procedure) + standar di `qa-docs-standard.mdc` § Capability Lingo.

### Frontmatter

```yaml
doc_type: shared-capability   # atau menu-capability
id: SF-DL-03
also: []
title: Show Deleted
aliases: [tampilkan terhapus, show deleted data]
scope: global                 # global | menu
summary: >-
  Toggle di datalist untuk melihat transaksi yang sudah dihapus
  tanpa mengembalikan datanya ke daftar aktif.
version: 0.2
last_updated: 2026-07-27
status: draft
```

### Body (urutan wajib)

| Section | Analogi Pentaho | Isi |
|---------|-----------------|-----|
| **Apa ini** | Definition | 1–3 kalimat |
| **Kapan dipakai** | Purpose | Use case / tabel keputusan |
| **Cara pakai** | Procedure | Langkah bernomor; label UI tebal |
| **Catatan** | Note | Batasan singkat |
| **Contoh** | Example | Opsional; first-class jika angka/qty/lifecycle |
| **Lihat juga** | Related | Sibling SF + requirement |

Template file: `_meta/templates/capability-lingo.md`.

### 5.1 Kapan `Contoh` wajib dipertimbangkan

Jika capability melibatkan: **angka/qty**, partial, selisih, kurs, status lifecycle, bulk vs single.  
Tanpa contoh angka, user sering “baca tapi tidak nempel” (contoh: Net Purchase Invoice, Invoice Diff, outstanding qty).

### 5.2 Penyimpanan file (fase 1 — tanpa DB)

```text
docs/qa-docs/
├── _meta/
│   ├── templates/capability-lingo.md
│   └── shared-capabilities/     # GLOBAL entries
│       ├── README.md
│       ├── show-deleted.md
│       ├── column-show-hide.md
│       ├── datalist-search-filter.md
│       ├── approval-audit-log.md
│       └── export-with-without-detail.md
└── {menu-slug}/
    ├── feature-map.md           # tab Feature Map (bukan di dalam requirement)
    ├── … (5 file existing + feature-map)
    └── capabilities/            # OPSIONAL — menu-bound
        └── sf-….md
```

**Prinsip:** jangan buat `capabilities/` kosong di setiap menu. Buat hanya jika `depth: detailed` dan dibutuhkan sebagai sumber tunggal untuk modal + UG slice.

### 5.3 Konvensi tautan di narasi (untuk renderer nanti)

Contoh markup di markdown sumber:

```markdown
Aktifkan [[SF-DL-03|Show Deleted]] di datalist.
```

Sampai ada renderer: boleh di-resolve sebagai link ke entry / anchor.  
Nanti FE: highlight + klik → modal dari catalog.

---

## 6. Simulasi — Purchase Invoice (contoh Feature Map)

> Simulasi dari diskusi; **belum** ditulis ke folder `accounting-supplier-invoice/`.

| ID | Label UI | Jenis | Status | Depth | Detail (usulan) | UG |
|----|----------|-------|--------|-------|-----------------|-----|
| SF-DL-01 | Global Search | shared | AS-IS | stub | shared/datalist-search-filter | overview |
| SF-DL-02 | Advanced Filter | shared | AS-IS | stub | shared/… | overview |
| SF-DL-03 | Show Deleted | shared | AS-IS | stub | shared/show-deleted | slice |
| SF-DL-04 | Column Show/Hide | shared | AS-IS | stub | shared/column-show-hide | slice |
| SF-DL-05 | Export (with/without detail) | hybrid | AS-IS | **missing** | perlu dijabarkan + contoh filter | pending |
| SF-DL-06 | Action rules (Edit/Show/Approve/…) | menu | AS-IS | detailed | § Datalist action rules | overview |
| SF-HDR-01 | Create auto-save / Save & Next | menu | AS-IS | detailed | § Form Basic Information | overview |
| SF-HDR-02 | Supplier's Invoice Amount | menu | TO-BE | detailed | §5.1b (sudah relatif lengkap) | pending |
| SF-DET-01 | Insert Inbound — Single / Bulk Use | menu | AS-IS | detailed | § Detail + contoh qty | overview |
| SF-COST-01 | Additional Cost & Discount | menu | AS-IS | detailed | §5.3 | overview |
| SF-PI-01 | Partial invoicing per SKU | menu | AS-IS | detailed | How It Works (pakai ID di heading) | overview |
| SF-PI-02 | Currency lock | menu | AS-IS | detailed | How It Works | overview |
| SF-LOG-01 | Approval Log | shared | AS-IS | stub | shared/approval-audit-log | slice |
| SF-LOG-02 | Audit Log | shared | AS-IS | stub | shared/… | slice |
| SF-PRT-01 | Print PI | menu | AS-IS | **missing** | GAP-PI-01; cara pakai belum di KB/UG | pending |
| SF-IMP-01 | Import | — | **N/A** | — | PI tidak punya import | — |

**Insight dari simulasi:** Map membuat “disebut tapi kosong” (Export, Print) jadi **terukur**; N/A Import jadi eksplisit.

### 6.1 Contoh card singkat — Net Purchase Invoice (butuh contoh angka)

```text
┌ Net Purchase Invoice                         [menu: PI]
│
│ Total akhir tagihan di sistem = produk − diskon
│ + PPN + biaya − diskon tambahan.
│
│ Contoh
│   Total Products     37.500.000
│   Disc Products         100.000
│   Total VAT           4.114.000
│   Additional Cost       500.000
│   ─────────────────────────────
│   Net Purchase Invoice 42.014.000
│
│ Bandingkan ke faktur fisik → (TO-BE) Supplier's Invoice Amount
└
```

---

## 7. UX Lingo di OlshopERP + opsi tanpa database

### 7.1 Flow UI (target produk)

```text
User baca guide / help / (nanti) teks di app
  → term yang punya SF Entry ter-highlight
  → klik / tap
  → modal / side card: summary + examples + link “langkah lengkap” / Feature Map
  → tutup; tetap di konteks baca
```

Desktop: prefer **klik → card** (bukan hover-only) agar contoh tabel & link bisa diinteraksi.  
Mobile: tap yang sama.

### 7.2 Tanpa database — feasible?

**Ya untuk fase 1.** SoT = file markdown/YAML di git.

| Pendekatan | Cara | Cocok jika |
|------------|------|------------|
| **A. Corpus file** | Baca MD/YAML dari `shared-capabilities` + override menu | SoT = QA docs |
| **B. Build artifact** | CI generate `lingo-catalog.json` → Vue fetch/embed | Perf, deploy sederhana |
| **C. Reuse KB index** | `ai:index-kb` / corpus existing → resolve by `SF-ID` | Chatbot + Lingo sekalian |

Yang hilang tanpa DB: CRUD admin non-dev, draft/publish tanpa deploy, entry per-tenant, analytics like/dislike.  
DB baru relevan jika produk Lingo jadi editable live oleh PM di banyak company.

**Alur data usulan:**

```text
Repo (SF entry + Feature Map)
  → catalog.json (build)
  → Vue modal / help panel
  ↘ tetap dipakai agent & publish Notion/Lark
```

### 7.3 Di mana UX hidup (fase)

| Fase | Deliverable |
|------|-------------|
| **1 Content** | Feature Map + SF Entry di repo; konvensi `[[SF-…]]` |
| **2 Publish** | Notion/Lark / docs site render card |
| **3 In-product** | Highlight di help Vue / label form → modal dari catalog |

Fase 1 bisa jalan **tanpa** bangun UI Lingo dulu.

---

## 8. Identifikasi sub-feature & peran agent saat update docs

### 8.1 Sumber sinyal (urut)

1. **UI nyata** — toolbar datalist, action, sidebar (Show Deleted, Column, Import, Log, Print, Export…)
2. **Code** — DataList/Form, route import-export, approval log
3. **Doc existing** — list “Fitur: …”, How It Works, Gap TO-BE
4. **Shared catalog** — SF global yang hampir semua menu punya

### 8.2 Feedback wajib saat “update docs” (usulan protokol)

Setiap kali human minta update/sync docs suatu menu, agent **wajib** menyertakan:

1. **Delta Feature Map** — SF baru / berubah / tetap  
2. **Rekomendasi depth** — stub vs detailed vs missing  
3. **Rekomendasi contoh case** — SF mana perlu 1–3 skenario data  
4. **Missing list** — ada di produk tapi belum entry  

Contoh bentuk feedback:

```text
Feature Map review — Purchase Invoice
• SF-DL-03 Show Deleted  → stub (shared) — contoh 1 baris cukup
• SF-DL-05 Export        → missing → detailed + contoh filter+export
• SF-DET-01 Bulk Use     → detailed — contoh 3 SKU outstanding
• SF-HDR-02 SIA          → TO-BE detailed — contoh Net vs Amount
• SF-IMP-01 Import       → N/A
```

Human approve prioritas (isi sekarang vs backlog); agent tidak mengarang `detailed` tanpa sumber (code / SoT / konfirmasi).

### 8.3 Alur kerja

```text
Human: update docs menu X / fitur Y
  → Agent: manifest → requirement → UI/code
  → Agent: Feature Map diff + rekomendasi detail/contoh
  → Human: pilih prioritas
  → Agent: tulis entry + contoh + sync KB/UG sesuai prioritas
```

---

## 9. Dampak ke layer docs existing

| Layer | Perubahan usulan |
|-------|------------------|
| `requirement.md` | + Feature Map; How It Works heading pakai `SF-*`; list “Fitur: …” diganti/digabung Map |
| `knowledge-base.md` | Tidak wajib section per SF; tips merujuk Label UI (+ ID opsional) |
| `technical.md` | Refer SF-ID bila relevan (API import, soft-delete flag); jangan duplikasi panduan user |
| `user-guide.md` | Tetap 8-section overview; tag SF di langkah/tips untuk `UG=slice\|overview` |
| `user-guide/{slug}.md` | **Fase 2** — generate dari baris Map `UG=slice` yang sudah punya entry |
| `README.md` | Pointer Map + hitungan missing; changelog tetap kanonik versi doc |
| `_meta/shared-capabilities/` | Baseline global |
| `qa-docs-standard.mdc` / skill | Baru diupdate **setelah** format final disetujui |

**Budget:** Feature Map ~15–25 baris. Stub tidak menggembungkan requirement. Yang menambah panjang hanya `missing` → `detailed` yang sengaja diisi.

---

## 10. Relasi dengan topik “timeline” (diskusi terpisah, ringkas)

Diskusi sebelumnya: changelog `version` + README = **riwayat revisi dokumen**, belum **timeline produk** (kapan requirement disepakati vs feature live).

Feature Map / SF Entry **tidak** menyelesaikan timeline produk dengan sendirinya. Opsional nanti: kolom di Map atau di changelog (`Type`: req/feat/fix/gap, `Status`: doc-only / to-be / shipped).  
Jangan campur aduk dengan adopsi Map+Lingo kecuali reviewer menggabungkan sengaja.

---

## 11. Open decisions (perlu diputus sebelum implementasi)

1. **Skema ID** — setuju `SF-DL / SF-LOG / SF-PI` atau prefix lain?  
2. **Letak Feature Map** — § awal requirement vs setelah status vs README-only index?  
3. **UG fase 1** — cukup 1 `user-guide.md` bertag SF, atau langsung folder per function?  
4. **Shared dulu vs Map dulu** — Map + 4 shared stub, atau Map dengan Detail=`TBD shared`?  
5. **Audience card** — satu summary untuk user+QA, atau `summary_user` vs `body_qa`?  
6. **Contoh data** — fiktif stabil (`PI-DEMO-*`) vs anonymize staging?  
7. **Surface Lingo pertama** — publish eksternal dulu vs in-app Vue dulu vs kontrak markdown saja dulu?  
8. **Apakah pecah file `capabilities/`** — selalu terpisah, atau default inline di requirement sampai budget pecah?

**Usulan default dari diskusi (untuk diuji):**  
Map di PI + 4 shared stub (Show Deleted, Column, Search/Filter, Log) + UG tetap 1 file dengan 2–3 slice contoh. Belum pecah folder UG. Belum UI Lingo. Protokol feedback agent diaktifkan.

---

## 12. Pertanyaan eksplisit untuk reviewer / Claude

Mohon analisa dan jawab:

1. **Format generate** — struktur file & frontmatter final yang paling bersih untuk: Feature Map, SF Entry global, SF Entry per-menu, dan (nanti) UG per function?  
2. **Efisiensi jangka panjang** — apakah model di atas scalable ke ratusan menu, atau ada alternatif lebih efisien (mis. Hanya shared catalog + diff override YAML; atau single `capabilities.yaml` per menu; atau generate dari code annotations)?  
3. **Duplikasi risiko** — bagaimana menghindari Map ↔ Entry ↔ requirement How It Works ↔ UG saling drift?  
4. **Integrasi** — apakah SF Entry harus jadi file ke-6 di folder menu, atau tetap di luar model “5 file” sebagai suplemen `_meta` + opsional?  
5. **Prioritas implementasi** — urutan fase yang disarankan (content contract → PI pilot → shared catalog → generator UG → in-app modal)?  
6. **Rekomendasi yang menolak/menyederhanakan** proposal ini dipersilakan, asal trade-off jelas vs masalah di §1.2.

---

## 13. Referensi eksternal

- Lark: [Create and import Lingo entries](https://www.larksuite.com/hc/en-US/articles/826167966155-create-and-import-lingo-entries)  
- Feishu Lingo API overview / highlight entity (kamus + highlight teks)

---

## 14. Riwayat dokumen proposal ini

| Date | Author | Notes |
|------|--------|-------|
| 2026-07-24 | QA - Yemima (+ agent) | Tuang diskusi chat: gap sub-feature, Feature Map, Capability Lingo, no-DB, identifikasi + feedback agent, simulasi PI |
| 2026-07-27 | QA - Yemima (+ agent) | Feedback UX: Label UI = klik Lingo; Feature Map → tab `feature-map.md`; auto-highlight lintas layer; tone card (poin 4) deferred |
| 2026-07-27 | QA - Yemima (+ agent) | Tone/struktur Lingo → Pentaho-style (Apa ini / Kapan / Cara pakai / Catatan / Contoh / Lihat juga); semua shared + PI cards di-rewrite; merge ke `qa-docs-standard.mdc` |

**Status:** draft untuk review — pilot content + modal MenuDoc + Feature Map tab; struktur/tone Lingo **sudah** di `qa-docs-standard.mdc` § Capability Lingo.
