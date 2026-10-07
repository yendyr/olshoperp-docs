---
doc_type: requirement
menu: businessdevelopment-variable-price
menu_name: "Variable Price"
version: 0.1
last_updated: 2026-10-07
owner: QA - Yemima
status: draft
---

# Variable Price — Requirement

Ringkasan kanonik pra-split: lihat SoT  
[`docs/qa-docs/_meta/sot/businessdevelopment-variable-price-source-of-truth.md`](../_meta/sot/businessdevelopment-variable-price-source-of-truth.md).

## Poin wajib

1. Satu master = satu type: **by Amount** ATAU **by Weight** (tidak campur).
2. Band: Start/End + Unlimited; Type band percentage|amount; Value boleh minus.
3. Sidebar di atas Category Price.
4. **Update to Category**: overwrite snapshot di semua category pemakai + konfirmasi + log Category; tidak auto ke Pricelist.
5. Tidak ada migrasi otomatis dari margin Category AS-IS.

## Contoh

Lihat SoT §6.4 — SKU 16.000 / 1.500 g → final 24.500 setelah stacking di Category/Pricelist.

## Gaps

GAP-VP-01 … GAP-VP-05 di SoT §9.

**Jira:** ETM-16312
