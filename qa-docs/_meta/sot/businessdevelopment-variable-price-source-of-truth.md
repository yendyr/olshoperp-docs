---
doc_type: source-of-truth
menu: businessdevelopment-variable-price
menu_name: "Variable Price"
version: 1.2
last_updated: 2026-10-14
owner: QA - Yemima
status: review
---

# Variable Price — Source of Truth

**Final E2E requirement (kanonik pra-split detail UI):** [`variable-price-multi-tier-final-requirement.md`](./variable-price-multi-tier-final-requirement.md)  
**Wireframe:** https://claude.ai/artifact/CSgXVMhzsztTJqwpeD7f89  
**Jira:** [ETM-16312](https://erpintegration.atlassian.net/browse/ETM-16312) · [ETM-16313](https://erpintegration.atlassian.net/browse/ETM-16313) · [ETM-16314](https://erpintegration.atlassian.net/browse/ETM-16314)  
**Follow-up 2026-10-14:** [ETM-16569](https://erpintegration.atlassian.net/browse/ETM-16569) · [ETM-16566](https://erpintegration.atlassian.net/browse/ETM-16566) · [ETM-16567](https://erpintegration.atlassian.net/browse/ETM-16567) · [ETM-16568](https://erpintegration.atlassian.net/browse/ETM-16568) · [ETM-16562](https://erpintegration.atlassian.net/browse/ETM-16562) · [ETM-16565](https://erpintegration.atlassian.net/browse/ETM-16565)

## 1. Ringkasan

Variable Price = master band margin reusable. Satu master = **satu type**: **by Amount** (default price) atau **by Weight** (weight primary, gram). Multi tier = attach beberapa master di Category Price. Estafet manual: VP → Category → Pricelist (fase trial, tidak auto).

```mermaid
flowchart LR
    VP[Variable Price] -->|Update to Category| CP[Category Price]
    CP -->|Update to Pricelist| PL[Pricelist Product]
```

## 2. Aturan inti

| Aturan | Isi |
|--------|-----|
| Type | Satu master satu type; Amount+Weight = dua master |
| Matching | Start–End inklusif; else Unlimited (≥ Start); else kontribusi 0 |
| Percentage | Selalu × **default price** (juga untuk tier by Weight) |
| Percentage Value | **-9.999 … 9.999**; ≥10.000 / ≤-10.000 ditolak (UI+server). Amount tidak kena batas (ETM-16569) |
| Percentage desimal | Truncate **4 dp** (bukan round); parse pemisah desimal benar (ETM-16562) |
| Amount value | Boleh minus |
| Weight kosong/0 | Semua tier by Weight di-skip |
| Rumus | Margin = Σ kontribusi; Final = default + margin |
| Type field | Boleh ubah jika **belum** dipakai Category → **konfirmasi + kosongkan band**; setelah dipakai → disabled + server reject |
| Update to Category | Disabled jika unused; overwrite snapshot + konfirmasi + log; Pricelist tidak ikut |
| Audit Log tier | Nilai 0 / Unlimited tercatat (bukan `-`); Old Value lengkap; UI slideover (ETM-16565) |
| Update | Overwrite snapshot/Pricelist; konfirmasi + log; tidak auto hilir |

## 3. Gap terbuka (final §9)

GAP-VP/CP/PL dari final Bagian 9: default price change behavior, konversi satuan weight, weight &lt; 1 g, category tanpa tier, Inactive/hapus master, mass Update from Master, permission Update, job background Pricelist.

**Resolved (2026-10-14):** Type change → konfirmasi + clear bands; Percentage Value ±9.999; mirror ke Category band lokal.

## 4. Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-10-07 | 1.0 | Draft awal ETM-16312/13/14 |
| 2026-10-09 | 1.1 | Align final requirement + wireframe; Type lock = setelah dipakai Category |
| 2026-10-14 | 1.2 | ETM-16569 ±9.999%; Type-change confirm+clear; Update disabled unused; tooltip; 4dp; Audit Log; Category mirror |
