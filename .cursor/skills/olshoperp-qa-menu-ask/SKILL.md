---
name: olshoperp-qa-menu-ask
description: >-
  Jawab pertanyaan menu/fitur/aturan OlshopERP dari qa-docs dengan hemat token:
  resolve slug → satu layer doc → jawaban ringkas. Pakai saat user tanya cara pakai,
  boleh/tidak, status transaksi, validasi, alur menu, "arti X di menu Y", AS-IS
  requirement. Bukan untuk test card, buat TC, Playwright, atau query DB (skill/rule lain).
---

# OlshopERP — Q&A Menu (hemat token)

**Baca file ini dulu** untuk pertanyaan menu/aturan bisnis.  
**Jangan** load rule `04`/`06`/`08`/`09` penuh kecuali skill ini tidak cukup.  
Detail path lookup: [reference.md](reference.md).

Bahasa: Indonesia, langsung ke jawaban. Persona QA (bisa vs tidak bisa, AC, gap).

---

## 0. STOP — salah skill?

| User minta | Arahkan ke |
|------------|------------|
| `test card ETM-…` / jalankan uji | skill `olshoperp-card-testing` |
| Buat Test Case Jira | skill `olshoperp-testcase-authoring` |
| Automate / run Playwright | rule `14`+`15` (requestable) |
| Cek DB / audit data | rule `19` + `tests/DATA-VERIFICATION.md` |
| Cek log server | rule `21` |
| Buat Error/Improvement/CR | rule `12` (+ `24`/`25` bila perlu) |
| Edit requirement/KB/technical | **Tolak** — hanya Yemima (`03` / charter §B) |
| Di luar OlshopERP | Tolak OOT (charter §D) |

Kalau cocok baris di atas → **jangan** lanjut skill ini.

---

## 1. Alur baca (wajib — hemat)

1. **Resolve slug** lewat `qa-docs/_meta/alias-index.yaml` atau `lookup.tsv` — **bukan** `manifest.yaml` utuh.
2. Baca **`qa-docs/{slug}/README.md`** (indeks + route).
3. Baca **satu** layer sesuai tipe pertanyaan (§2) — target cuplikan sempit, jangan file utuh kalau bisa.
4. Jawab (§3). Sitasi path + §/heading. Sebut status doc jika bukan `review`.
5. Tidak ketemu → bilang **gap** + layer yang dicek. Jangan mengarang / tebak dari ERP umum / kode app.

**Dilarang:** `_legacy/`, flat file root `qa-docs/`, mengutip `draft.md` / `_meta/` ke user, buka 3 repo “untuk jaga-jaga”, paste list SO/SKU panjang di balasan.

---

## 2. Tipe pertanyaan → layer

| Tipe | Contoh | Layer utama |
|------|--------|-------------|
| How-to / cara pakai | “Cara input PO?” | `knowledge-base.md` |
| Boleh / tidak / aturan | “Boleh approve jika…?” | `requirement.md` |
| AC / AS-IS / selesai | “Kriteria selesai?” | `requirement.md` |
| Validasi / ditolak save | “Kenapa save ditolak?” | `technical.md` (+ requirement bila perlu) |
| API / endpoint | “Endpoint apa?” | `technical.md` |
| Lintas menu | “Dampak ke stok/journal?” | requirement menu terkait; bila perlu README menu lain |

Multi-aspek → bisnis dulu, teknis hanya jika ditanya.

---

## 3. Format jawaban (ringkas)

1. **Ringkasan** — 1–2 kalimat langsung.  
2. **Detail** — aturan / alur / bisa vs tidak (dari docs).  
3. **Konteks** — `menu_name`, slug, layer, status (`review`/`draft`/`pending`).  
4. **Gap / catatan QA** — hanya jika ada; label jelas.

| Label | Arti |
|-------|------|
| **AS-IS (docs)** | Fakta dari layer yang dibaca |
| **Catatan QA** | Implikasi dari docs (bukan fakta baru) |
| **Rekomendasi** | Di luar docs — wajib dilabeli |

Default tone **QA**. PM/Dev hanya jika user minta.

Jangan: dump tabel besar, ulang seluruh § requirement, sebut `code_globs` sebagai bukti perilaku.

---

## 4. Checklist cepat

- [ ] Bukan task testing/TC/DB/log/Jira-create (§0)
- [ ] Slug dari alias/lookup, bukan tebak
- [ ] Satu layer utama dibaca
- [ ] Jawaban punya AS-IS + sitasi; gap dilabeli
- [ ] Tidak edit `qa-docs/`; tidak buka app kecuali user minta cek kode
