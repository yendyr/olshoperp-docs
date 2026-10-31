# Referensi — olshoperp-jira-card

Dipakai bersama [SKILL.md](SKILL.md). Struktur penuh historis: rule `12`.

## A. Konstanta ETM

| Item | Nilai |
|------|--------|
| Site / cloudId | `erpintegration.atlassian.net` / `44cc9820-3372-4c12-884c-698b1397173c` |
| Error | `10033` |
| Improvement | `10088` |
| Change Requirement | `10048` |
| Test Case | `10051` → skill authoring |
| Menu | `customfield_10429` |
| Request ID | `customfield_10495` — nilai sah: rule `12` (ID asli atau `none`, bukan `-`). Setelah create, verifikasi GET di rule `12` |
| Story Points | `customfield_10043` |
| Link | Relates |

Browse: `https://erpintegration.atlassian.net/browse/ETM-xxxxx`

## B. Template ringkas

### Error (finding)

```
## Judul: [Nama Menu] - short desc

**Summary** — apa rusak, di mana, pemicu
**Environment** — Menu/Fitur; Staging/…; URL (retest) edit bila ada
**Precondition Data** — data/state; code + URL; atau "Precondition tidak disebutkan"
**Steps to Reproduce** — label UI persis; buka URL edit dulu bila ada
**Expected Result** — dari requirement.md §…
**Actual Result** — (bagian description, BUKAN custom field) apa yang terjadi
**Additional Context** — atau "(tidak ada catatan tambahan)"
```

### Improvement

```
**Summary** / **Environment** / **Background**
**Request Asli (dari User)** — verbatim jika dari end user
**Example Data** / **Current Behavior (AS-IS)** / **Expected Improvement (TO-BE)**
**Acceptance Criteria** — terukur, dari docs
**Additional Context**
```

Footer auto (jalur Simple Request ID):  
`*Draf awal disusun otomatis berdasarkan requirement.md — tolong dicek ulang sebelum di-assign ke dev.*`

### Change Requirement

```
**Summary** / **Environment** / **Background**
**Current Behavior (AS-IS)** / **Requested Change (TO-BE)**
**Acceptance Criteria** / **Additional Context**
```

(Sesuaikan heading persis template rule `12` Tipe 3 bila regenerasi formal.)

## C. Hasil uji di card non-TC

Tulis di **komentar** Jira (template mirip skill card-testing reference §G). Jangan isi `customfield_10203`.

## D. Improvement Request ID — pointer

Simple vs konfirmasi: SKILL.md §3. Notify topic & gaya: rule `25` + `24`. Bot idempotent: skip jika sudah ada "Request Asli (dari User)" / footer draf.
