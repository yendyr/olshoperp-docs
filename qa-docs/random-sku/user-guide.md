---
doc_type: user-guide
menu: random-sku
menu_name: "Random SKU"
version: 1.0
last_updated: 2026-10-09
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: "1.1"
owner: QA - Yemima
status: review
---

# Random SKU — Panduan Pengguna

**Bukan menu datalist terpisah** — fitur di System Product / variant.

Saat opsi variant = **random**, sistem buat SKU virtual (non-stock). Saat order memakai SKU random, fulfillment auto-pilih sibling variant dengan stok tertinggi.

Retail Price di random dipakai harga default order / pecah harga bundle (bukan Benchmark COGS).

Detail: [knowledge-base.md](./knowledge-base.md) · teknis bundle: System Product technical §16
